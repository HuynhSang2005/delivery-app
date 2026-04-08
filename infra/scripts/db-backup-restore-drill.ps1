$ErrorActionPreference = 'Stop'

Write-Host '[db-drill] Starting backup/restore drill...'

bun run db:up
if ($LASTEXITCODE -ne 0) { throw '[db-drill] db:up failed' }
bun run db:migrate
if ($LASTEXITCODE -ne 0) { throw '[db-drill] db:migrate failed' }
bun run db:seed
if ($LASTEXITCODE -ne 0) { throw '[db-drill] db:seed failed' }
bun run job:db-backup
if ($LASTEXITCODE -ne 0) { throw '[db-drill] job:db-backup failed' }
bun run db:restore
if ($LASTEXITCODE -ne 0) { throw '[db-drill] db:restore failed' }
bun run db:smoke
if ($LASTEXITCODE -ne 0) { throw '[db-drill] db:smoke failed' }

Write-Host '[db-drill] Backup/restore drill passed.'
