const ACT_AS_KEY = 'pf_act_as';

export interface ActAsSession {
  sessionId: string;
  orgId: string;
  orgName?: string;
  expiresAt: string;
  reason?: string;
}

export function getActAsSession(): ActAsSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(ACT_AS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ActAsSession;
    if (!parsed?.orgId || !parsed?.sessionId) return null;
    if (parsed.expiresAt && new Date(parsed.expiresAt).getTime() < Date.now()) {
      clearActAsSession();
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function setActAsSession(session: ActAsSession) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACT_AS_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event('pf:act-as-change'));
}

export function clearActAsSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACT_AS_KEY);
  window.dispatchEvent(new Event('pf:act-as-change'));
}
