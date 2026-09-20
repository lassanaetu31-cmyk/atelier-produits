# Assemble le paquet de vente Catalog Builder -> release/Catalog-Builder.zip
# Prérequis : npm run build:catalog (génère apps/catalog/dist/index.html)
$ErrorActionPreference = "Stop"
$root  = Split-Path -Parent $PSScriptRoot
$build = Join-Path $root "apps\catalog\dist\index.html"
$stage = Join-Path $root "release\Catalog-Builder"
$zip   = Join-Path $root "release\Catalog-Builder.zip"

if (-not (Test-Path $build)) { throw "Build introuvable. Lance d'abord : npm run build:catalog" }

if (Test-Path $stage) { Remove-Item -Recurse -Force $stage }
New-Item -ItemType Directory -Force $stage | Out-Null

Copy-Item $build (Join-Path $stage "Catalog-Builder.html")
Copy-Item (Join-Path $root "release-assets\catalog\*") $stage

if (Test-Path $zip) { Remove-Item -Force $zip }
Compress-Archive -Path (Join-Path $stage "*") -DestinationPath $zip

Write-Host "OK -> $zip"
Get-ChildItem $stage | Select-Object Name, Length
