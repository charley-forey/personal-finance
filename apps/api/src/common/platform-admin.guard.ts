import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
  Inject,
  Optional,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { eq } from 'drizzle-orm';
import type { AuthContext, PlatformAdminContext, PlatformPermission, PlatformRole } from '@pf/shared';
import { permissionsForRole } from '@pf/shared';
import { platformAdmins, type Database } from '@pf/database';
import { isPlatformAdmin as isEnvPlatformAdmin, isDevelopment } from './env.util';
import { DATABASE } from '../database.module';

export const PLATFORM_PERMISSIONS_KEY = 'platformPermissions';
export const RequirePlatformPermissions = (...permissions: PlatformPermission[]) =>
  SetMetadata(PLATFORM_PERMISSIONS_KEY, permissions);

/** Allow authenticated non-admins through (used for GET /admin/v1/me probe). */
export const PLATFORM_ADMIN_OPTIONAL_KEY = 'platformAdminOptional';
export const PlatformAdminOptional = () => SetMetadata(PLATFORM_ADMIN_OPTIONAL_KEY, true);

export type RequestWithPlatform = {
  auth?: AuthContext;
  platformAdmin?: PlatformAdminContext;
};

/** Resolve platform admin context from DB row and/or env break-glass. */
export function buildPlatformAdminContext(input: {
  email: string;
  userId: string;
  dbRole?: PlatformRole | null;
  dbActive?: boolean;
}): PlatformAdminContext {
  const email = input.email.toLowerCase();
  const viaBreakGlass = isEnvPlatformAdmin(email) && !input.dbRole;

  let role: PlatformRole | null = input.dbActive === false ? null : (input.dbRole ?? null);

  if (!role && isEnvPlatformAdmin(email)) {
    role = 'platform_owner';
  }

  if (!role && isDevelopment() && !process.env.PLATFORM_ADMIN_EMAILS?.trim()) {
    role = 'platform_owner';
  }

  if (!role) {
    return {
      isPlatformAdmin: false,
      email,
      userId: input.userId,
      role: null,
      permissions: [],
      viaBreakGlass: false,
    };
  }

  return {
    isPlatformAdmin: true,
    email,
    userId: input.userId,
    role,
    permissions: permissionsForRole(role),
    viaBreakGlass,
  };
}

@Injectable()
export class PlatformAdminGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Optional() @Inject(DATABASE) private db?: Database,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as RequestWithPlatform;
    const auth = request.auth;
    if (!auth) return false;

    let dbRole: PlatformRole | null = null;
    let dbActive: boolean | undefined;
    if (this.db) {
      try {
        const email = auth.email.toLowerCase();
        let [row] = await this.db
          .select()
          .from(platformAdmins)
          .where(eq(platformAdmins.email, email))
          .limit(1);

        // Fallback: match by linked user id when JWT email was previously synthetic
        if (!row && auth.userId && !auth.userId.startsWith('api-key:')) {
          [row] = await this.db
            .select()
            .from(platformAdmins)
            .where(eq(platformAdmins.userId, auth.userId))
            .limit(1);
        }

        if (row) {
          dbRole = row.role as PlatformRole;
          dbActive = row.active;
        }
      } catch {
        // Table may not exist yet — fall back to env allowlist
      }
    }

    const platform = buildPlatformAdminContext({
      email: auth.email,
      userId: auth.userId,
      dbRole,
      dbActive,
    });
    request.platformAdmin = platform;

    const optional = this.reflector.getAllAndOverride<boolean>(PLATFORM_ADMIN_OPTIONAL_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (optional) {
      return true;
    }

    if (!platform.isPlatformAdmin) {
      throw new ForbiddenException('Platform admin access required');
    }

    const required = this.reflector.getAllAndOverride<PlatformPermission[]>(
      PLATFORM_PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (required?.length) {
      const missing = required.filter((p) => !platform.permissions.includes(p));
      if (missing.length) {
        throw new ForbiddenException(`Missing platform permission: ${missing.join(', ')}`);
      }
    }

    return true;
  }
}
