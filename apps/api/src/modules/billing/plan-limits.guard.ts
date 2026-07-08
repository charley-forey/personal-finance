import { Injectable, CanActivate, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BillingService } from '../../services/billing.service';
import { getAuth } from '../../common/auth.guard';

export type PlanLimitType = 'banks' | 'ai_messages' | 'documents' | 'history_days';

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

    if (limitType === 'history_days') {
      const daysParam = request.query?.days ?? request.query?.historyDays;
      const requestedDays = daysParam !== undefined ? parseInt(String(daysParam), 10) : undefined;
      await this.billing.enforcePlanLimit(auth.orgId, limitType, {
        requestedDays: Number.isFinite(requestedDays) ? requestedDays : undefined,
      });
    } else {
      await this.billing.enforcePlanLimit(auth.orgId, limitType);
    }

    return true;
  }
}
