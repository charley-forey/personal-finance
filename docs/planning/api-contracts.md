# API Contracts

## Intelligence (implemented)

| Method | Path | Auth |
|--------|------|------|
| GET | `/insights` | yes |
| POST | `/insights/generate` | yes |
| POST | `/insights/:id/feedback` | yes |
| GET | `/recommendations` | yes |
| POST | `/recommendations/generate` | yes |
| POST | `/recommendations/:id/outcome` | yes |
| POST | `/signals` | yes |
| POST | `/agents/chat` | yes + plan limit |

## Wave 3 additions (planned)

- `GET/PUT /profile` — financial profile
- `POST /categorization/correct` — corrections feed
- `GET /forecast/runs` — forecast history
