# CueMesh production checklist

## Verified repository baseline

- Next.js App Router with strict TypeScript.
- Current persistence is a process-local, database-free in-memory store. Data is not durable across restarts or serverless instances.
- Document upload currently uses a validation boundary and in-memory storage; it is not durable object storage.
- Action approval/rejection/completion workflow and audit-event foundation exist.
- Security headers and server-side validation are present; these do not replace authentication or authorization.
- CI runs lint, TypeScript typecheck, and production build. Automated unit, integration, and E2E coverage is still required.
- AI provider contract exists, but a production provider is not configured by this repository.

## Required before production

1. Add real authentication, secure sessions, logout and account lifecycle.
2. Enforce situation/member authorization on every private API, including documents, events, actions, graph, replay, exports, consents, jobs, notifications and audit.
3. Implement durable persistence, migrations, transactions, indexes, multi-instance consistency and tested backup/restore.
4. Add secure object storage, scoped signed URLs, upload limits, safe filenames and malware scanning where available.
5. Add document parsing/OCR, versioning, durable processing workers, retries and failure reporting.
6. Implement a real AI provider with structured-output validation, timeouts, model metadata, cost limits and graceful failure.
7. Store stable citations/provenance and ensure retrieval is authorization-scoped; support correction and re-indexing.
8. Add durable jobs, idempotency, bounded retries, dead-letter handling and cancellation.
9. Add durable reminder scheduling, delivery integrations, timezone handling and delivery status.
10. Add shared-store rate limits, request/body limits, CSRF/origin protections, secret management and abuse controls.
11. Implement consent withdrawal, retention, export and verified deletion across primary data, files, derived data, indexes and backup policy.
12. Add unit, API integration, end-to-end, authorization-isolation, accessibility and failure-path tests.
13. Add structured logs, correlation IDs, metrics, traces, dashboards, alerts and health/readiness checks.
14. Add staging, smoke tests, migration compatibility checks, rollback and release notes.
15. Complete threat modeling for uploads and prompt injection; document incident response and privacy/data-processing disclosures.
16. Test mobile browsers, keyboard navigation and screen-reader accessibility.
17. Define operational limits, support path, RPO/RTO, backup retention and restore drills.

Do not describe PostgreSQL/Prisma persistence, durable uploads, delivered reminders, configured AI, or authentication as implemented until the corresponding end-to-end behavior is present and tested.
