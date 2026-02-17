-- ForgeFabric Multi-Tenancy: Row-Level Security Migration
-- Run with: psql $DATABASE_URL -f 002_multi_tenancy_rls.sql

-- Add tenant_id column to checkpoints tables
ALTER TABLE checkpoints ADD COLUMN IF NOT EXISTS tenant_id TEXT NOT NULL DEFAULT 'public';
ALTER TABLE checkpoint_writes ADD COLUMN IF NOT EXISTS tenant_id TEXT NOT NULL DEFAULT 'public';
ALTER TABLE checkpoint_blobs ADD COLUMN IF NOT EXISTS tenant_id TEXT NOT NULL DEFAULT 'public';

-- Indexes for tenant-scoped queries
CREATE INDEX IF NOT EXISTS idx_checkpoints_tenant ON checkpoints(tenant_id);
CREATE INDEX IF NOT EXISTS idx_checkpoint_writes_tenant ON checkpoint_writes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_checkpoint_blobs_tenant ON checkpoint_blobs(tenant_id);

-- Enable Row-Level Security
ALTER TABLE checkpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkpoint_writes ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkpoint_blobs ENABLE ROW LEVEL SECURITY;

-- RLS policies: each tenant can only see their own data
CREATE POLICY tenant_isolation_checkpoints ON checkpoints
    USING (tenant_id = current_setting('app.tenant_id', true));

CREATE POLICY tenant_isolation_writes ON checkpoint_writes
    USING (tenant_id = current_setting('app.tenant_id', true));

CREATE POLICY tenant_isolation_blobs ON checkpoint_blobs
    USING (tenant_id = current_setting('app.tenant_id', true));

COMMENT ON COLUMN checkpoints.tenant_id IS 'Clerk org_id for multi-tenant isolation';
