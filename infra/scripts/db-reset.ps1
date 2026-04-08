$ErrorActionPreference = 'Stop'

$composeFile = 'docker-compose.yml'
$service = 'postgres'
$db = if ($env:POSTGRES_DB) { $env:POSTGRES_DB } else { 'delivery_app' }
$user = if ($env:POSTGRES_USER) { $env:POSTGRES_USER } else { 'delivery_user' }

docker compose -f $composeFile up -d --wait --wait-timeout 120 $service
if ($LASTEXITCODE -ne 0) {
	throw "[db-reset] failed to start $service"
}

Write-Host '[db-reset] Resetting deterministic baseline...'
docker compose -f $composeFile exec -T $service psql -U $user -d $db -c "DROP SCHEMA IF EXISTS foundation CASCADE;"
if ($LASTEXITCODE -ne 0) {
	throw "[db-reset] schema drop failed with exit code $LASTEXITCODE"
}

powershell -ExecutionPolicy Bypass -File infra/scripts/db-migrate.ps1
powershell -ExecutionPolicy Bypass -File infra/scripts/db-seed.ps1
Write-Host '[db-reset] Done.'
