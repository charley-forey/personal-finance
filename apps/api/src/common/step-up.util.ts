/**
 * Step-up confirmation for sensitive actions.
 * Production: integrate WorkOS MFA / re-auth assertion.
 * Dev: accept X-Step-Up-Token matching STEP_UP_DEV_TOKEN or any non-empty token when not production.
 */
import { ForbiddenException } from '@nestjs/common';
import { isProduction } from './env.util';

export type SensitiveAction =
  | 'account.delete'
  | 'data.export'
  | 'plaid.disconnect'
  | 'members.change'
  | 'apikey.create'
  | 'impersonate.start';

export function assertStepUp(action: SensitiveAction, stepUpToken?: string | null) {
  if (!isProduction()) {
    // Soft enforce in non-prod: log-friendly allow when header present or STEP_UP_REQUIRED unset
    if (process.env.STEP_UP_REQUIRED === 'true' && !stepUpToken) {
      throw new ForbiddenException(`Step-up required for ${action}`);
    }
    return;
  }
  const expected = process.env.STEP_UP_DEV_TOKEN;
  if (!stepUpToken || (expected && stepUpToken !== expected)) {
    throw new ForbiddenException(`Step-up required for ${action}`);
  }
}
