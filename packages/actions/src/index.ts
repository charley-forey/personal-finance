export type ApprovalTier = 'T0_observe' | 'T1_notify' | 'T2_confirm' | 'T3_auto';

export interface ActionRequest {
  id: string;
  actionType: string;
  tier: ApprovalTier;
  title: string;
  payload: Record<string, unknown>;
  status: 'pending' | 'approved' | 'executed' | 'dismissed';
}

export function canAutoExecute(tier: ApprovalTier, policy: Record<string, ApprovalTier>): boolean {
  return policy[ tier ] === 'T3_auto' || tier === 'T3_auto';
}

export function buildActionProof(request: ActionRequest, dataUsed: string[]): Record<string, unknown> {
  return {
    actionId: request.id,
    actionType: request.actionType,
    tier: request.tier,
    dataUsed,
    executedAt: new Date().toISOString(),
  };
}
