# ForgeFabric SOC 2 Type II Controls (Feb 2026)

## Trust Services Criteria Mapping

| Control ID | Trust Services Criteria | ForgeFabric Implementation | Evidence Source | Status |
|------------|--------------------------|----------------------------|-----------------|--------|
| CC6.1      | Logical Access Control   | Clerk + Org-level JWT + Supabase RLS | Clerk audit logs + Supabase audit | Ready |
| CC6.2      | Authentication           | Clerk SSO (Okta/Google compatible) | Clerk session logs | Ready |
| CC6.3      | Authorization            | Tenant isolation via `tenant_id` in all tables | Database RLS policies | Ready |
| CC4.1      | Monitoring and Logging   | OpenTelemetry traces + Temporal history + OPA decisions | `/observability/traces` + Temporal Export | Ready |
| CC4.2      | Change Management        | GitHub + GitHub Actions + versioned workflows | GitHub commit history + workflow logs | Ready |
| CC7.2      | Incident Response        | OPA denials + bias alerts trigger Slack/email | Automated alert script | Ready |
| CC8.1      | Risk Assessment          | Bias/hallucination scoring in every trace | Observability dashboard | Ready |
| P4.2       | Data Processing Integrity| Runtime OPA checks before every tool call | OPA decision logs | Ready |
| P4.3       | Data Retention           | Configurable retention in Postgres + S3 archive | Automated archive script | Ready |

## Evidence Collection

Automated evidence collection runs daily (2 AM UTC) via `backend/scripts/collect_soc2_evidence.py`.

Evidence is uploaded to S3 as JSON with the following structure:

- `temporal_workflows` - All completed workflows in the last 24 hours
- `opa_decisions` - All OPA policy evaluations with allow/deny + reason
- `clerk_audits` - Authentication and authorization events
- `traces` - OpenTelemetry trace summaries with bias/hallucination scores
- `bias_alerts` - Any trace where bias score exceeded threshold (0.3)

Evidence path: `s3://<SOC2_EVIDENCE_BUCKET>/soc2-evidence/forgefabric-<date>.json`

## Data Flow Security

```
User Request
    |
    v
Clerk JWT Verification (CC6.2)
    |
    v
Tenant Extraction (CC6.3)
    |
    v
FastAPI Endpoint (CC6.1)
    |
    v
OPA Policy Check (P4.2)
    |
    v
Temporal Workflow (CC4.1 - full audit trail)
    |
    v
LLM Activity (CC8.1 - bias/hallucination scored)
    |
    v
Tool Execution (P4.2 - governed)
    |
    v
Result + ROI (P4.3 - persisted + archived)
```

## Encryption

| Layer | Method |
|-------|--------|
| In transit | TLS 1.3 (platform-enforced via Vercel/Render) |
| At rest (database) | AES-256 (Render Postgres / AWS RDS) |
| At rest (S3) | SSE-S3 or SSE-KMS |
| Secrets | Environment variables only, never in code |

## Incident Response Plan

1. **Detection** - OPA denial or bias score > 0.3 triggers alert
2. **Notification** - Slack webhook + email to security team
3. **Containment** - Temporal workflow paused automatically
4. **Investigation** - Full trace replay via Temporal history
5. **Resolution** - Policy update in OPA, deployed via CI/CD
6. **Post-mortem** - Documented in GitHub Issues

## Audit Schedule

- **Daily**: Automated evidence collection to S3
- **Weekly**: Bias/hallucination trend review
- **Monthly**: Access control review (Clerk org membership)
- **Quarterly**: Full SOC 2 readiness self-assessment

## Compliance Tools Integration

This checklist is compatible with:
- [Vanta](https://vanta.com) - Import evidence from S3
- [Drata](https://drata.com) - API integration for continuous monitoring
- [Secureframe](https://secureframe.com) - Automated control testing
