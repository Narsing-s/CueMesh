# CueMesh implementation roadmap

## Completed foundation
- Mobile-first web experience
- Strict TypeScript configuration
- Error and 404 boundaries
- Health endpoint
- Prisma/PostgreSQL schema
- Database health endpoint
- Persistent situation API
- Situation detail API
- Upload validation boundary
- Baseline security headers
- Local PostgreSQL Docker setup

## Remaining production layers

### Identity and authorization
Authentication, session management, situation membership enforcement, role-based permissions, CSRF strategy where applicable, rate limiting.

### Ingestion
Object storage, malware/content validation, OCR, DOCX/PDF extraction, document versioning, chunking and asynchronous processing.

### Intelligence
AI provider abstraction, structured extraction, entity normalization, graph construction, contradiction detection, confidence, missing-item detection and citations.

### Actions
Action planner, dependency graph, approval UI, execution adapters, completion verification, follow-up scheduler and audit events.

### Collaboration
Family/team members, responsibility assignment, notification preferences, activity history and temporary situations.

### Operations
Background queue, retries, idempotency, observability, cost controls, retention/deletion, backups, migrations in CI and end-to-end tests.

## Product safety rule
AI output is proposed as derived information. Consequential actions require explicit human authorization. Evidence and audit history should remain available for important decisions.
