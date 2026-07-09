# Page Spec: {{PAGE_NAME}}

**Agent:** {{AGENT_ID}}  
**Route:** {{ROUTE}}

## UI Wireframe

```
[PageContextBanner]
[Primary metric + ExplainButton]
[Main content]
[EntityGraphPanel sidebar]
[Cross-links to related pages]
```

## API Needs

- GET /context/page?route={{ROUTE}}
- GET /graph/entity/:type/:id/neighbors (min 2 entity types)

## Graph Links

| Entity | Link type | Target |
|--------|-----------|--------|
| | | |

## Acceptance Criteria

- [ ] PageContextBanner
- [ ] Min 2 EntityGraphPanel integrations
- [ ] Min 1 ExplainButton on primary metric
- [ ] EmptyState uses context API guidance
- [ ] Cross-link to 2+ related pages

## E2E Scenarios

1. Page loads with context banner
2. Graph panel shows neighbors when entity selected
