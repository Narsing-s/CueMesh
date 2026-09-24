# CueMesh Architecture

## Request path
Web UI -> Route/API layer -> domain services -> database-free in-memory store -> AI provider abstraction.

The current deployment does not require PostgreSQL, Prisma, or a database service. The store is process-local and intentionally non-durable.

## Core domains
- situations
- documents
- graph
- intelligence
- actions
- notifications
- permissions
- audit

## Current end-to-end workflow
Document/evidence -> deterministic gap detection -> Life Graph -> proposed follow-up -> human approval -> execution/completion -> audit.

## Life Graph
The graph API exposes nodes and relationships for the situation, documents, events, actions and unresolved gaps. The UI presents these nodes and relationship counts and is ready for a visual graph renderer.

## Human approval
Proposed actions cannot be completed directly: completion requires APPROVED or IN_PROGRESS status. Approval/rejection records actor metadata and an audit event. Full authentication/authorization remains a production requirement.

## Follow-ups
Follow-up reminders are created as notification records with a scheduled time. Delivery is not yet durable or externally scheduled.

## Evidence model
AI outputs should reference source documents/events through stable citation records. Derived information must remain distinguishable from original evidence.

## Security baseline
- Never commit secrets.
- Validate uploaded files and size limits.
- Authorize every situation/document/action access when authentication is available.
- Keep an audit trail for consequential changes.
- Separate temporary situations from long-lived personal memory.

## Durability
The current runtime is intentionally DB-free. Process memory can be lost on restart/redeploy or across serverless instances. Persistent production storage is therefore a separate deployment decision.