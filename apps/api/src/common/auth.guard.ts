import { Injectable, Inject, CanActivate, ExecutionContext, UnauthorizedException, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { jwtVerify, createRemoteJWKSet } from 'jose';
import type { AuthContext, MemberRole } from '@pf/shared';

export const ROLES_KEY = 'roles';
export const RequireRoles = (...roles: MemberRole[]) => SetMetadata(ROLES_KEY, roles);

export const Public = () => SetMetadata('isPublic', true);

@Injectable()
export class AuthGuard implements CanActivate {
  private jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

  constructor(
    private config: ConfigService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing authorization token');
    }

    const token = authHeader.slice(7);

    // Dev mode: accept simple dev tokens
    if (token.startsWith('dev:')) {
      const [, orgId, userId, role] = token.split(':');
      request.auth = {
        userId: userId ?? 'dev-user',
        workosUserId: userId ?? 'dev-user',
        email: 'dev@example.com',
        orgId: orgId ?? 'dev-org',
        role: (role as MemberRole) ?? 'owner',
      } satisfies AuthContext;
      return true;
    }

    try {
      const clientId = this.config.get<string>('WORKOS_CLIENT_ID');
      if (!clientId) throw new UnauthorizedException('Auth not configured');

      if (!this.jwks) {
        this.jwks = createRemoteJWKSet(
          new URL(`https://api.workos.com/sso/jwks/${clientId}`),
        );
      }

      const { payload } = await jwtVerify(token, this.jwks);
      request.auth = {
        userId: payload.sub as string,
        workosUserId: payload.sub as string,
        email: (payload as Record<string, unknown>).email as string ?? '',
        orgId: (payload as Record<string, unknown>).org_id as string ?? '',
        role: 'owner' as MemberRole,
      };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

export const Auth = () => {
  return (target: object, propertyKey: string | symbol, parameterIndex: number) => {
    // Parameter decorator placeholder
  };
};

export function getAuth(request: { auth?: AuthContext }): AuthContext {
  if (!request.auth) throw new UnauthorizedException();
  return request.auth;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<MemberRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles?.length) return true;

    const request = context.switchToHttp().getRequest();
    const auth = request.auth as AuthContext | undefined;
    if (!auth) return false;

    const roleHierarchy: Record<MemberRole, number> = { owner: 3, admin: 2, viewer: 1 };
    return requiredRoles.some((role) => roleHierarchy[auth.role] >= roleHierarchy[role]);
  }
}
