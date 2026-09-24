# CueMesh data model

CueMesh currently uses a process-local, database-free runtime store. It intentionally mirrors the application data model without requiring PostgreSQL or Prisma.

## Core relationships
- User -> SituationMember -> Situation
- Situation -> Documents, Events, Actions, Insights, MissingItems
- Document -> Versions, Chunks, Citations
- Action -> Evidence and dependencies
- Entity -> SituationEntity -> Situation
- Entity -> EntityRelationship -> Entity
- Situation -> Notifications and Jobs

## Evidence
CueMesh distinguishes original evidence from derived information. Insights and proposed actions can reference citations rather than presenting unsupported statements as facts.

## Current runtime behavior
- Data and uploaded document bytes are held in process memory.
- A restart, redeploy, or a different serverless instance can lose state.
- The current runtime is suitable for demos and functional validation, not durable production persistence.

## Production evolution
When durable persistence is required, add a persistent data store and object storage without changing the domain/API contracts. Authentication, authorization, OCR/extraction, AI analysis, durable jobs and notifications can then be attached to these contracts.