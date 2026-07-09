export const MCP_TOOLS = [
  { name: 'get_net_worth', description: 'Current net worth breakdown' },
  { name: 'get_graph_neighbors', description: 'Linked entities for a financial object' },
  { name: 'get_page_context', description: 'Priority actions for a route' },
  { name: 'run_twin_scenario', description: 'Run financial twin branch' },
] as const;

export const MCP_RESOURCES = [
  { uri: 'financial-graph://entities', name: 'Financial Graph' },
  { uri: 'twin://branches', name: 'Twin Branches' },
] as const;

export interface McpToolCall {
  tool: string;
  arguments: Record<string, unknown>;
}

export function listTools() {
  return MCP_TOOLS;
}

export function listResources() {
  return MCP_RESOURCES;
}
