# CueMesh production checklist

## Implemented foundation
- Next.js App Router and strict TypeScript
- Prisma/PostgreSQL data model
- Persistent situation APIs
- Action approval/rejection/completion workflow
- Audit events
- Upload validation boundary
- Security headers
- Docker development database
- CI build workflow
- AI provider contract

## Before public production
1. Add real authentication and session management.
2. Enforce situation/member authorization on every private API.
3. Add object storage with signed upload URLs.
4. Add OCR/text extraction workers and document versioning.
5. Implement a real AI provider with structured-output validation.
6. Store AI runs, citations, evidence and model metadata.
7. Add embeddings/vector search and retrieval access controls.
8. Build graph/entity extraction and contradiction detection.
9. Add durable background jobs, retries, idempotency and dead-letter handling.
10. Add notification providers and follow-up scheduling.
11. Add rate limits, CSRF/origin strategy, secret management and abuse controls.
12. Add unit, integration, API and E2E tests.
13. Add observability: structured logs, metrics, traces and alerting.
14. Add backups, restore drills and retention/deletion workflows.
15. Threat-model uploads, prompt injection and malicious document content.
16. Add privacy export/delete and consent/audit controls.
17. Add accessibility and mobile browser testing.
18. Configure production database, secrets and deployment.
