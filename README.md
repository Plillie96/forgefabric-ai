# ForgeFabric - The Operating System for Enterprise Agents

**Govern every action. Prove every dollar. Scale without limits.**

[![Python](https://img.shields.io/badge/Python-3.11%2B-blue)](https://www.python.org)
[![Temporal](https://img.shields.io/badge/Temporal-1.26+-purple)](https://temporal.io)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688)](https://fastapi.tiangolo.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![CI](https://github.com/Plillie96/forgefabric-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/Plillie96/forgefabric-ai/actions)

---

> *The neutral runtime + governance fabric that sits on top of every agent platform and makes them enterprise-safe, interoperable, and provably valuable.*

## Why ForgeFabric

While everyone builds agents, ForgeFabric is the **neutral runtime** that makes thousands of agents safe, measurable, and unstoppable across Salesforce, SAP, Snowflake, and any other system.

Companies are drowning in agent sprawl. One hallucinated decision, one unauthorized API call = massive fines. Leadership asks "How much did this save?" and gets shrugs. ForgeFabric fixes all of that.

**Four unbreakable pillars:**

| Pillar | What It Does |
|--------|-------------|
| **Temporal-Native Orchestration** | Durable multi-agent swarms with automatic retries, rollback, and state persistence across failures |
| **Runtime Governance Fabric** | OPA policy enforcement before every tool call with cryptographic audit trails |
| **Real-Time ROI Engine** | Every action tagged with dollar impact — live CFO dashboard proves value every second |
| **Enterprise-Grade Infrastructure** | Multi-tenancy, JWT auth, SOC 2 controls, human-in-the-loop approvals |

## Architecture

```
+-----------------------------------------------------------+
|                    Next.js Dashboard                       |
|          React Flow Graph - ROI Charts - HITL UI           |
+-----------------------------------------------------------+
|                     FastAPI Gateway                        |
|           /agents/run  -  /agents/approve                  |
+------------+------------+------------+--------------------+
|  Temporal  |    OPA     | OpenTelem  |   Stripe Billing   |
|  Durable   | Governance |  Tracing   |  Outcome-Based     |
|  Workflows |   Engine   |            |                    |
+------------+------------+------------+--------------------+
|           Integrations (Salesforce, SAP, Slack)            |
+-----------------------------------------------------------+
|            PostgreSQL  -  Redis  -  Temporal Server        |
+-----------------------------------------------------------+
```

## One-Command Local Setup

```bash
git clone https://github.com/Plillie96/forgefabric-ai.git
cd forgefabric-ai
cp .env.example backend/.env          # add your OPENAI_API_KEY
docker compose up -d                   # Temporal + Postgres + Redis + OPA
cd backend && pip install -r requirements.txt && uvicorn src.main:app --reload &
cd ../frontend && npm install && npm run dev
```

Open http://localhost:3000 and click **Launch Deal Swarm**.

## Key Features

- Full ReAct loops with real tool calling
- Human-in-the-loop approval for high-value actions
- Live animated agent graph in the dashboard
- Outcome-based Stripe billing (5% value share)
- OPA governance checks on every tool call
- Persistent Postgres checkpoints (survives crashes)
- Ready for 100+ concurrent swarms

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/agents/run` | Launch a governed deal swarm |
| `POST` | `/api/v1/agents/approve` | Approve / reject HITL decision |
| `GET`  | `/api/v1/agents/status/{id}` | Get workflow result |
| `GET`  | `/health` | Liveness check |
| `GET`  | `/ready` | Readiness check (Temporal + OPA) |

## How It Works

1. **Trigger** - User submits a lead from dashboard or API
2. **Orchestrate** - Temporal spins up a durable ReAct swarm (qualifier -> researcher -> compliance -> closer)
3. **Govern** - Every tool call passes OPA policy checks at runtime
4. **Persist** - Temporal ensures crash-proof, resumable execution with Postgres checkpoints
5. **Trace** - OpenTelemetry tags every step with dollar attribution
6. **Approve** - High-value decisions pause for human-in-the-loop
7. **Bill** - Outcome value invoiced via Stripe on completion

## Project Structure

```
forgefabric-ai/
+-- backend/
|   +-- src/
|   |   +-- main.py              # FastAPI entry + middleware
|   |   +-- config.py            # Pydantic settings
|   |   +-- activities/          # Temporal activities (LLM, tools, OPA, ROI)
|   |   +-- agents/              # Agent swarm definitions
|   |   +-- workflows/           # Temporal workflows (SalesAgentWorkflow)
|   |   +-- governance/          # OPA policies (Rego)
|   |   +-- api/v1/              # REST endpoints
|   |   +-- services/            # ROI calculator, Stripe billing
|   |   +-- core/                # Security, logging, exceptions
|   |   +-- schemas/             # Pydantic models
|   +-- tests/                   # Pytest suite
|   +-- temporal/worker.py       # Temporal worker
|   +-- migrations/              # Postgres migrations
+-- frontend/                    # Next.js 15 + Tailwind
|   +-- app/                     # Pages (landing, dashboard)
|   +-- components/              # AgentGraph, RoiDashboard, GovernancePanel
+-- docker-compose.yml           # Full local infra
+-- DEPLOY.md                    # Production deploy guide
+-- SECURITY.md                  # Security and compliance posture
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Orchestration | Temporal.io | Durable workflows, retries, state persistence |
| Governance | Open Policy Agent | Policy-as-code, runtime enforcement |
| Observability | OpenTelemetry | Traces, spans, ROI attribution |
| Backend | FastAPI (Python 3.11+) | Async-first, high performance |
| Frontend | Next.js 15 + Tailwind | Live dashboards, React Flow graphs |
| Database | PostgreSQL + Redis | Audit logs, checkpoints, caching |
| Billing | Stripe | Outcome-based pay-per-value invoicing |
| Auth | JWT + OPA RBAC | Enterprise SSO-ready |

## Production Deploy

See [DEPLOY.md](DEPLOY.md) for the full production deploy guide.

- **Frontend** -> Vercel (zero-config Next.js)
- **Backend** -> Render / Railway / AWS
- **Database** -> Render Postgres or AWS RDS
- **Temporal** -> Temporal Cloud or self-hosted

## Security and Compliance

See [SECURITY.md](SECURITY.md) for our security posture, data handling policies, and SOC 2 readiness controls.

## Roadmap

- [x] Temporal-native core orchestration
- [x] OPA governance + ROI engine
- [x] Human-in-the-loop approval
- [x] Stripe outcome-based billing
- [x] Animated React Flow dashboard
- [ ] Clerk / Auth0 SSO integration
- [ ] Phoenix observability dashboard
- [ ] SOC 2 evidence automation
- [ ] MCP server endpoint
- [ ] Kubernetes auto-scaling (100+ swarms)

## License

[MIT](LICENSE)

---

**Built by [Nathan](https://github.com/Plillie96) in Salt Lake City**

*ForgeFabric - Agents that actually work. At enterprise scale.*
