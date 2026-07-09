export type WidgetType = 'stat' | 'chart' | 'action_queue' | 'graph' | 'narrative' | 'agent_thread';

export interface ComposedWidget {
  type: WidgetType;
  id: string;
  priority: number;
  config: Record<string, unknown>;
}

export function composePageWidgets(input: {
  route: string;
  priorityCount: number;
  hasAccounts: boolean;
}): ComposedWidget[] {
  const widgets: ComposedWidget[] = [
    { type: 'narrative', id: 'session', priority: 1, config: {} },
    { type: 'action_queue', id: 'actions', priority: 2, config: {} },
  ];
  if (input.route === '/app' || input.route === '/app/today') {
    widgets.push({ type: 'stat', id: 'net_worth', priority: 3, config: { metric: 'net_worth' } });
    widgets.push({ type: 'chart', id: 'nw_chart', priority: 4, config: {} });
  }
  if (!input.hasAccounts) {
    widgets.push({ type: 'stat', id: 'onboarding', priority: 0, config: { cta: 'link_account' } });
  }
  return widgets.sort((a, b) => a.priority - b.priority).slice(0, input.priorityCount);
}
