# Stub Audit Ritual

Run weekly with the [WEEKLY-SCORECARD](./WEEKLY-SCORECARD.md).

## Checklist

For each capability in `docs/planning/CAPABILITY-CATALOG.md`:

1. Is the status (`done` / `partial` / `stub` / `missing`) accurate vs code?
2. If stub: is it behind a feature flag / kill switch and excluded from marketing?
3. If partial: what is the exit criterion to reach production?
4. Any AGENT-STATUS “done” that is still a stub? Correct both docs.

## Known stubs (track until closed)

| Capability | Status | Gate |
|------------|--------|------|
| SSO/SCIM | stub / not_configured | WorkOS org SSO wiring |
| Advisor portal | stub | Firm/client UX + permissions |
| API key auth | partial | Validate wired; scopes/rate limits next |
| Learning jobs | partial → real pure functions | Wire workers to call jobs with DB rows |
| Document AI parse | stub without OpenAI | Hard-disable or require key |
| Push notifications | stub subscribe | Web Push / FCM |

## Output

Update CAPABILITY-CATALOG and note date in AGENT-STATUS or scorecard notes.
