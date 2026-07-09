# Revolution Master Plan — Wave 10

Synthesized from Wave 10+ plan. Execution order:

1. **Phase 0** — Scaffold (this tree + spawn script)
2. **Phase 1** — G01 Graph, C01 Context, N01 Narrative packages + APIs
3. **Phase 2** — H01–H06 hub pages + app-shell restructure
4. **Phase 3** — R01–R34 page revolution (batches A–D)
5. **Phase 4** — I15–I19 intelligence + X01 integrator
6. **Phase 5** — Journey mode + polish

## Shared UI primitives

- `@/components/page-context-banner.tsx`
- `@/components/entity-graph-panel.tsx`
- `@/components/explain-button.tsx`
- `@/components/hub-layout.tsx`
- `@/components/journey-checklist.tsx`

## API surface

- `GET /graph/entity/:type/:id/neighbors`
- `GET /graph/context?route=`
- `GET /context/page?route=`
- `GET /narrative/page?route=`
- `GET /narrative/session`
- `GET /journey/progress`
- `POST /journey/progress/:hubId/step/:stepId`

Per-agent briefs: `docs/planning/revolution/pages/<page>/spec.md`
