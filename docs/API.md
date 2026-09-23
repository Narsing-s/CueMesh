# CueMesh API foundation

## Health
- GET /api/health
- GET /api/db-health

## Situations
- GET /api/situations
- POST /api/situations
- GET /api/situations/:id

## Documents
- POST /api/documents — validates an upload boundary
- GET /api/documents/metadata?situationId=...

## Actions
- GET/POST /api/situations/:id/actions
- POST /api/actions/:id/approve
- POST /api/actions/:id/reject
- POST /api/actions/:id/complete

## Intelligence
- POST /api/insights — reserved for configured AI processing

## Gaps and audit
- GET /api/missing-items?situationId=...
- GET /api/audit?entityId=...

All write endpoints must receive authorization before production exposure. These routes are intentionally not a substitute for authentication.
