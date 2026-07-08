import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import type { AuthContext } from '@pf/shared';
import { isPlatformAdmin } from './env.util';

@Injectable()
export class PlatformAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const auth = request.auth as AuthContext | undefined;
    if (!auth) return false;
    if (!isPlatformAdmin(auth.email)) {
      throw new ForbiddenException('Platform admin access required');
    }
    return true;
  }
}
