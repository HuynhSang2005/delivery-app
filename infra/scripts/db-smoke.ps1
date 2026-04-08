$ErrorActionPreference = 'Stop'

$composeFile = 'docker-compose.yml'
$service = 'postgres'
$db = if ($env:POSTGRES_DB) { $env:POSTGRES_DB } else { 'delivery_app' }
$user = if ($env:POSTGRES_USER) { $env:POSTGRES_USER } else { 'delivery_user' }

docker compose -f $composeFile up -d --wait --wait-timeout 120 $service
if ($LASTEXITCODE -ne 0) {
  throw "[db-smoke] failed to start $service"
}

Write-Host '[db-smoke] Running PostGIS and seed smoke checks...'
$extensionCheck = docker compose -f $composeFile exec -T $service psql -U $user -d $db -tA -c "SELECT extname FROM pg_extension WHERE extname = 'postgis';"
if ($LASTEXITCODE -ne 0) {
  throw "[db-smoke] postgis extension check failed with exit code $LASTEXITCODE"
}
if ($extensionCheck.Trim() -ne 'postgis') {
  throw 'PostGIS extension is not installed.'
}

$seedCount = docker compose -f $composeFile exec -T $service psql -U $user -d $db -tA -c "SELECT COUNT(*) FROM foundation.demo_accounts;"
if ($LASTEXITCODE -ne 0) {
  throw "[db-smoke] seeded accounts check failed with exit code $LASTEXITCODE"
}
if ($seedCount.Trim() -lt 3) {
  throw "Expected at least 3 seeded accounts, got $seedCount"
}

Write-Host "[db-smoke] Passed. Seed count: $($seedCount.Trim())"
