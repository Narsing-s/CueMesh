# CueMesh Product Scope

## Product principle
CueMesh turns scattered life information into an evidence-backed situation. AI proposes; a human authorizes; the system records what happened.

## MVP foundation
- Mobile-first Next.js application
- Situation creation API
- Health endpoint
- Error and not-found boundaries
- TypeScript strict mode
- Repository hygiene

## Next implementation stages

### Stage 1 — Data foundation
PostgreSQL schema, migrations, users, situations, documents, events, actions, audit events.

### Stage 2 — Document intelligence
Secure upload, file validation, OCR/text extraction, classification, chunking, citations and document versions.

### Stage 3 — Situation intelligence
Entity extraction, relationship graph, timeline, contradictions, missing-item detection, confidence and evidence.

### Stage 4 — Action layer
Action plans, dependencies, human approval, evidence, completion verification and follow-up.

### Stage 5 — Collaboration and safety
Situation members, responsibility assignment, permissions, audit history, temporary situations and emergency snapshot.

### Stage 6 — AI and operations
Provider abstraction, model run tracking, queues/background jobs, rate limits, observability and cost controls.

## Non-goals
CueMesh should not silently execute consequential actions. It should not present unsupported AI guesses as facts. Every important recommendation should expose its evidence and confidence where available.
