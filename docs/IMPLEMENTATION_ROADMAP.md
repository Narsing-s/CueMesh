# CueMesh implementation roadmap

This roadmap records the remaining work identified in the repository audit. It is a planning document, not a claim that these capabilities are implemented. Keep this file aligned with `docs/IMPLEMENTATION_STATUS.md` and `docs/PRODUCTION_CHECKLIST.md`.

## Release gates

Do not expose private situations or uploaded content publicly until authentication, authorization, durable storage, and abuse controls are implemented and tested.

### P0 — Safe, reliable core

- [ ] **Resolve architecture documentation drift.** Establish one authoritative description of the current persistence mode, Prisma/PostgreSQL status, upload behavior, and deployment requirements. Update README, architecture, implementation status, and production checklist together.
- [ ] **Authentication and sessions.** Integrate a maintained identity provider; secure session cookies, logout, expiry, and account lifecycle.
- [ ] **Authorization.** Enforce owner/member/role checks on every situation, document, event, action, graph, replay, export, consent, job, notification, and audit endpoint. Never treat client-supplied actor or ownership headers as authorization.
- [ ] **Durable persistence.** Implement and document the production database adapter, migrations, transactions, indexes, backup/restore procedures, and multi-instance consistency. Preserve the in-memory adapter for local development only if useful.
- [ ] **Secure document storage.** Store files outside process memory; use scoped signed upload/download URLs, size/type validation, malware scanning where available, safe filenames, and access checks.
- [ ] **Privacy lifecycle.** Implement retention configuration, consent withdrawal, export and verified deletion across database, object storage, derived data, embeddings, and backups according to documented policy.
- [ ] **Abuse protection.** Shared-store rate limits, request/body limits, origin/CSRF strategy for cookie-authenticated writes, secret management, and per-user AI quotas.
- [ ] **Core tests.** Add unit and API integration tests for authorization boundaries, ownership isolation, action state transitions, dependency cycle prevention, deletion, export, upload validation, and failure paths.

### P1 — Complete the intelligence workflow

- [ ] **Document ingestion pipeline.** PDF/DOCX/TXT/CSV and image support as appropriate; extraction/OCR workers, document versions, progress states, retries, and clear failure reporting.
- [ ] **AI provider implementation.** Server-side provider configuration, timeouts, structured-output schema validation, model/version metadata, usage/cost limits, and graceful provider failure.
- [ ] **Evidence-grounded results.** Stable source citations (document version/page/section or event), provenance for extracted facts, user correction, and separation of source evidence from AI-derived claims.
- [ ] **Retrieval and access control.** Embeddings/vector search with tenant/situation filtering applied before results are returned; deletion and re-indexing behavior.
- [ ] **Situation analysis.** Entity and relationship extraction, duplicate detection, contradiction detection, missing-information reasoning, dependency/risk analysis, and explainable suggested actions. Treat document contents as untrusted data and defend against prompt injection.
- [ ] **Visual Life Graph.** Render accessible interactive nodes/edges; search/filter/zoom, source navigation, unresolved-gap and dependency states, and graph updates after replay or edits.
- [ ] **Durable jobs.** Queue/worker execution, idempotency, bounded retries/backoff, dead-letter handling, cancellation, progress, and operational visibility.
- [ ] **Real reminders.** Durable scheduling and delivery provider integration, timezone handling, user preferences, retry behavior, and delivery status.

### P2 — Usability and collaboration

- [ ] Situation templates/playbooks with versioning and safe customization.
- [ ] Multi-user collaboration: invitations, roles, comments, mentions, activity feed, and revocation.
- [ ] Global search across authorized situations, documents, events, actions, and citations.
- [ ] Decision records capturing options, rationale, approver, evidence, and outcome.
- [ ] Snapshot comparison showing changed facts, evidence, dependencies, and actions.
- [ ] Export formats (PDF/Markdown/CSV/JSON) with permission checks and sensitive-data handling.
- [ ] PWA/mobile polish, offline drafts with conflict handling, keyboard navigation, screen-reader support, and responsive-browser tests.
- [ ] Optional integrations (calendar, GitHub, Jira, Drive, Slack) using least-privilege scopes, explicit consent, revocation, and audit records.

### P3 — Operational maturity

- [ ] Structured logs with request/correlation IDs, metrics, traces, dashboards, and actionable alerts.
- [ ] Health/readiness checks that distinguish app, database, queue, storage, and AI-provider status without leaking secrets.
- [ ] Deployment validation for required environment variables, migrations, health checks, rollback, and secret isolation.
- [ ] Backup restore drills, retention enforcement, incident response runbook, and security threat model.
- [ ] End-to-end tests for critical user journeys and accessibility; CI should run lint, typecheck, unit, integration, and build checks.
- [ ] Load/concurrency tests for multi-user isolation, graph queries, uploads, job throughput, and rate limits.

## Definition of done for a capability

A capability is not “implemented” merely because a data model, route, placeholder, or provider interface exists. Mark it implemented only when:
1. The user-facing workflow is connected end-to-end.
2. Authentication and authorization are enforced where data is private.
3. Success, validation, timeout, provider failure, retry, and recovery behavior are defined.
4. Automated tests cover the expected and security-sensitive paths.
5. Documentation accurately describes runtime requirements and limitations.
6. Observability and operational ownership are defined for production features.

## Suggested release sequence

1. Documentation consistency and test baseline.
2. Authentication, authorization, and abuse controls.
3. Durable persistence and secure file storage.
4. Privacy lifecycle and backup/restore.
5. Document ingestion and evidence provenance.
6. AI analysis and controlled retrieval.
7. Durable jobs, reminders, and visual Life Graph.
8. Collaboration, search, exports, and integrations.
9. Operational hardening and production release review.
