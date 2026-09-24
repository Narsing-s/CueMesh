# CueMesh

CueMesh is a mobile-first **situation intelligence workspace**. It turns scattered information into a connected situation containing evidence, documents, events, gaps, dependencies, actions, approvals and follow-up.

## Product principle

**AI proposes. Humans authorize. The system records what happened.**

CueMesh is designed around situations rather than generic chat: understand context, identify missing pieces, map dependencies, propose next actions, preserve evidence, and make progress auditable.

## Implemented foundation

- Responsive dashboard and situation detail experience
- Database-free situation CRUD through an in-memory server store
- Situation archive/restore
- Events, actions and human approval state machine
- Action dependencies with cycle protection
- Evidence/citation and graph data model
- Missing-item model and resolution endpoint
- Unified situation timeline
- Versioned Situation Replay snapshots
- Background-job data model and API
- Document processing lifecycle
- Notification and playbook foundations
- Privacy consent records
- Situation JSON export and deletion
- Audit-event foundation
- Security headers and server-side validation
- AI provider contract that fails explicitly when no provider is configured

## Important production boundaries

The repository deliberately does **not** fake integrations. Before production use, configure:

1. Authentication and authorization for every private route
2. Durable object storage for uploaded documents
3. PDF/DOCX parsing and OCR for image documents
4. A real server-side AI provider with structured-output validation
5. pgvector embeddings and retrieval
6. A durable worker/queue that executes Job records
7. Email/push notification delivery
8. Rate limiting backed by shared storage for multi-instance deployments
9. Automated unit, integration and E2E tests
10. Observability, alerting, backups and database migrations
11. Privacy retention/deletion policies and legal review
12. Production deployment with secrets configured outside source control

## Local development

Requirements: Node.js 20+.

    npm install
    npm run dev

CueMesh does not require PostgreSQL, Prisma, Docker, or DATABASE_URL. All core situation, action, event, dependency, replay, notification, consent, audit, playbook, job and document-metadata operations run through the built-in database-free store.

### Persistence boundary

The application is intentionally database-free. Data is kept in the running application instance and is reset when that instance is restarted, redeployed, or recycled. This makes the app usable without provisioning a database, but it is not a substitute for durable multi-instance persistence.

## Deployment


The app is structured for Next.js/Vercel, while PostgreSQL, object storage, AI, queues and notifications should be supplied by production services. Do not expose the application publicly until authentication/authorization and durable storage are configured.

See docs/API.md, docs/ARCHITECTURE.md, docs/SECURITY.md, docs/PRODUCTION_CHECKLIST.md, and docs/IMPLEMENTATION_STATUS.md.
