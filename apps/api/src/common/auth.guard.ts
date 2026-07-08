import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, SetMetadata, Inject, forwardRef } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { jwtVerify, createRemoteJWKSet } from 'jose';
import type { AuthContext, MemberRole } from '@pf/shared';
import { AuthService } from '../services/core.services';
import { isDevelopment } from './env.util';

export const ROLES_KEY = 'roles';
export const RequireRoles = (...roles: MemberRole[]) => SetMetadata(ROLES_KEY, roles);

export const Public = () => SetMetadata('isPublic', true);

@Injectable()
export class AuthGuard implements CanActivate {
  private jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

  constructor(
    private config: ConfigService,
    private reflector: Reflector,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const queryToken = request.query?.token as string | undefined;

    if (!authHeader?.startsWith('Bearer ') && !queryToken) {
      throw new UnauthorizedException('Missing authorization token');
    }

    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : queryToken!;

    if (token.startsWith('dev:')) {
      if (!isDevelopment()) {
        throw new UnauthorizedException('Dev tokens are not allowed in production');
      }
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
      const claims = payload as Record<string, unknown>;
      const workosUserId = payload.sub as string;
      const email = (claims.email as string) || `${workosUserId}@users.workos`;
      const name = (claims.first_name as string | undefined)
        ? `${claims.first_name as string} ${(claims.last_name as string | undefined) ?? ''}`.trim()
        : undefined;
      const workosOrgId = (claims.org_id as string | undefined) ?? undefined;

      request.auth = await this.authService.resolveContext(
        workosUserId,
        email,
        name,
        workosOrgId,
      );
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
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
