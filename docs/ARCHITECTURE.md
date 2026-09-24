# CueMesh Architecture

## Request path
Web UI -> Route/API layer -> domain services -> database-free in-memory store -> AI provider abstraction.

The current deployment does not require PostgreSQL, Prisma, or a database service. The store is process-local and therefore intentionally non-durable.

## Core domains
- situations
- documents
- graph
- intelligence
- actions
- notifications
- permissions
- audit

## Evidence model
AI outputs should reference source documents/events through stable citation records. Derived information must remain distinguishable from original evidence.

## Execution rule
AI proposes -> human approves -> system executes -> system verifies -> audit event is recorded.

## Security baseline
- Never commit secrets.
- Validate uploaded files and size limits.
- Authorize every situation/document/action access.
- Keep an audit trail for consequential changes.
- Separate temporary situations from long-lived personal memory.
