# Security and Compliance

## Authentication

- JWT-based authentication via `Authorization: Bearer <token>` header
- Tokens signed with HS256 using a configurable `SECRET_KEY`
- Demo mode: unauthenticated requests are treated as `demo_user` with admin role
- Production: set `SECRET_KEY` to a strong random value and enforce auth

## Authorization

- Role-based access on every API endpoint via `get_current_user` dependency
- OPA (Open Policy Agent) evaluates governance policies before every tool call
- High-value actions require explicit human approval via Temporal signals

## Data Handling

- Customer data is never used for model training
- All LLM calls go through OpenAI API; no data is stored by the LLM provider
- Postgres stores workflow checkpoints and audit logs
- Redis is used only for ephemeral caching

## Infrastructure Security

- CORS origins are explicitly configured (no wildcards in production)
- HTTPS enforced via Vercel/Render edge
- Database credentials stored in environment variables, never in code
- Docker Compose uses named volumes; no host mounts in production

## Audit Trail

- Every tool call is logged with: tool name, arguments, policy decision, timestamp
- Temporal provides full workflow history with replay capability
- Structured JSON logging captures all API requests with timing

## SOC 2 Readiness

The following controls are implemented or documented:

| Control | Status |
|---------|--------|
| Access control (AuthN/AuthZ) | Implemented |
| Encryption in transit (TLS) | Platform-enforced |
| Encryption at rest | Platform-enforced (Render/AWS) |
| Audit logging | Implemented |
| Change management (CI/CD) | GitHub Actions CI |
| Incident response | Documented |
| Data retention | Configurable |
| Vulnerability scanning | Dependabot recommended |

## Reporting Vulnerabilities

Email security@forgefabric.ai (or open a private GitHub advisory).
Do not open public issues for security vulnerabilities.
