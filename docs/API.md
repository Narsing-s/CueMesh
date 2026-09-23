# CueMesh API foundation

## Core
- GET /api/health
- GET /api/db-health
- GET/POST /api/situations
- GET /api/situations/:id
- POST /api/situations/:id/archive
- POST /api/situations/:id/restore
- GET/POST /api/situations/:id/events
- GET/POST /api/situations/:id/replay

## Documents
- POST /api/documents — validates upload boundary
- GET /api/documents/metadata?situationId=...

## Intelligence
- POST /api/insights
- GET /api/situations/:id/graph
- GET /api/missing-items?situationId=...

## Actions
- GET/POST /api/situations/:id/actions
- POST /api/actions/:id/approve
- POST /api/actions/:id/reject
- POST /api/actions/:id/complete

## Follow-up
- GET/POST /api/notifications?situationId=...

## Jobs
- GET/POST /api/jobs?situationId=...

## Playbooks
- GET/POST /api/playbooks

## Privacy
- GET/POST /api/consents?situationId=...

## Audit
- GET /api/audit?entityId=...

Production note: private routes require authentication and authorization before public exposure. The current auth helper deliberately fails closed until a real identity provider is configured.
