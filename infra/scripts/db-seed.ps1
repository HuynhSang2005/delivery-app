$ErrorActionPreference = 'Stop'

$composeFile = 'infra/docker-compose.yml'
$service = 'postgres'
$db = if ($env:POSTGRES_DB) { $env:POSTGRES_DB } else { 'delivery_app' }
$user = if ($env:POSTGRES_USER) { $env:POSTGRES_USER } else { 'delivery_user' }

Write-Host '[db-seed] Applying deterministic seed data...'
docker compose -f $composeFile exec -T $service psql -U $user -d $db -f /docker-entrypoint-initdb.d/002-seed.sql
if ($LASTEXITCODE -ne 0) {
	throw "[db-seed] docker compose exec failed with exit code $LASTEXITCODE"
}
Write-Host '[db-seed] Done.'
