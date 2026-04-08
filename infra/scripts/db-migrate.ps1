$ErrorActionPreference = 'Stop'

$composeFile = 'docker-compose.yml'
$service = 'postgres'
$db = if ($env:POSTGRES_DB) { $env:POSTGRES_DB } else { 'delivery_app' }
$user = if ($env:POSTGRES_USER) { $env:POSTGRES_USER } else { 'delivery_user' }

docker compose -f $composeFile up -d --wait --wait-timeout 120 $service
if ($LASTEXITCODE -ne 0) {
	throw "[db-migrate] failed to start $service"
}

Write-Host '[db-migrate] Applying schema baseline...'
docker compose -f $composeFile exec -T $service psql -U $user -d $db -f /docker-entrypoint-initdb.d/001-init.sql
if ($LASTEXITCODE -ne 0) {
	throw "[db-migrate] docker compose exec failed with exit code $LASTEXITCODE"
}
Write-Host '[db-migrate] Done.'
