# RoadSoS Backend Architecture

RoadSoS is an event-driven emergency response backend. Express exposes authenticated REST APIs, Socket.IO namespaces provide real-time victim, responder, and control-room updates, MongoDB stores operational records, Redis powers JWT blacklisting and queue infrastructure, and Bull workers execute emergency workflows.

## Flow

1. Victim, voice, or GPS impact detection creates an SOS and incident.
2. The SOS event is emitted and a Bull job starts the workflow.
3. Workflow predicts severity, selects the best-fit hospital, calculates routing, dispatches alerts, starts first aid, and records timeline events.
4. Each AI decision is written to transparency logs.
5. Socket rooms named by incident id stream updates to victim and responder clients; the dashboard namespace receives national control-room feed events.
6. If queue, AI, network, or external provider calls fail, fallback SMS activation records encoded exchanges and accepts responder SMS replies.

## Data Guarantees

All incident analytics are computed from MongoDB incident records. Hospital selection uses seeded Hyderabad hospital records plus live resource availability and Google ETA when configured.
