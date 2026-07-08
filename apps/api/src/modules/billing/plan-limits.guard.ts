import { Injectable, CanActivate, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BillingService } from '../../services/platform.services';
import { getAuth } from '../../common/auth.guard';

export type PlanLimitType = 'banks' | 'ai_messages';

export const PLAN_LIMIT_KEY = 'planLimit';
export const RequirePlanLimit = (limit: PlanLimitType) => SetMetadata(PLAN_LIMIT_KEY, limit);

@Injectable()
export class PlanLimitsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private billing: BillingService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const limitType = this.reflector.getAllAndOverride<PlanLimitType>(PLAN_LIMIT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!limitType) return true;

    const request = context.switchToHttp().getRequest();
    const auth = getAuth(request);
    await this.billing.enforcePlanLimit(auth.orgId, limitType);
    return true;
  }
}
