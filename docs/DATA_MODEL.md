# CueMesh data model

The Prisma schema defines the first persistent foundation.

## Core relationships
- User -> SituationMember -> Situation
- Situation -> Documents, Events, Actions, Insights, MissingItems
- Document -> Versions, Chunks, Citations
- Action -> Evidence

## Evidence
CueMesh distinguishes original evidence from AI-derived information. Insights and proposed actions can reference citations rather than presenting unsupported statements as facts.

## Production sequence
1. Provision PostgreSQL.
2. Set DATABASE_URL.
3. Run Prisma migrations.
4. Generate the Prisma client.
5. Add authentication and replace placeholder actor identity.
6. Add object storage for document bytes.
7. Add ingestion workers for OCR, extraction and chunking.
