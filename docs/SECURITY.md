# CueMesh security baseline

- Never store secrets in source control.
- Validate file type and size before processing uploads.
- Do not trust client-supplied ownership or permissions.
- Every situation, document and action query must be authorization-scoped.
- Keep original evidence separate from AI-derived data.
- Record consequential state changes in audit events.
- Use least-privilege database and storage credentials.
- Add rate limits before exposing write/AI endpoints publicly.
- Add retention and deletion controls before storing sensitive documents.
- Do not execute consequential external actions without explicit user approval.
