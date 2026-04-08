param(
  [string]$BackupFile
)

$ErrorActionPreference = 'Stop'

$composeFile = 'docker-compose.yml'
$service = 'postgres'
$db = if ($env:POSTGRES_DB) { $env:POSTGRES_DB } else { 'delivery_app' }
$user = if ($env:POSTGRES_USER) { $env:POSTGRES_USER } else { 'delivery_user' }

if (-not $BackupFile -or $BackupFile.Trim().Length -eq 0) {
  $BackupFile = if ($env:DB_BACKUP_FILE) { $env:DB_BACKUP_FILE } else { 'delivery_app_backup.sql' }
}

Write-Host "[db-restore] Using backup file: $BackupFile"

docker compose -f $composeFile up -d --wait --wait-timeout 120 $service
if ($LASTEXITCODE -ne 0) {
  throw "[db-restore] failed to start $service"
}

docker compose -f $composeFile exec -T $service sh -lc "test -f /backups/$BackupFile"
if ($LASTEXITCODE -ne 0) {
  throw "[db-restore] backup file not found in volume: /backups/$BackupFile"
}

Write-Host '[db-restore] Restoring deterministic baseline schema from backup...'
docker compose -f $composeFile exec -T $service psql -U $user -d $db -c "DROP SCHEMA IF EXISTS foundation CASCADE;"
if ($LASTEXITCODE -ne 0) {
  throw "[db-restore] schema drop failed with exit code $LASTEXITCODE"
}

docker compose -f $composeFile exec -T $service psql -U $user -d $db -f "/backups/$BackupFile"
if ($LASTEXITCODE -ne 0) {
  throw "[db-restore] restore failed with exit code $LASTEXITCODE"
}

Write-Host '[db-restore] Done.'
