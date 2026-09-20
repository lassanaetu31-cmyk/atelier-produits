# Assemble le paquet de vente Invoice Generator -> release/Invoice-Generator.zip
# Prérequis : npm run build:invoice (génère apps/invoice/dist/index.html)
$ErrorActionPreference = "Stop"
$root  = Split-Path -Parent $PSScriptRoot
$build = Join-Path $root "apps\invoice\dist\index.html"
$stage = Join-Path $root "release\Invoice-Generator"
$zip   = Join-Path $root "release\Invoice-Generator.zip"

if (-not (Test-Path $build)) { throw "Build introuvable. Lance d'abord : npm run build:invoice" }

if (Test-Path $stage) { Remove-Item -Recurse -Force $stage }
New-Item -ItemType Directory -Force $stage | Out-Null

Copy-Item $build (Join-Path $stage "Invoice-Generator.html")
Copy-Item (Join-Path $root "release-assets\invoice\*") $stage

if (Test-Path $zip) { Remove-Item -Force $zip }
Compress-Archive -Path (Join-Path $stage "*") -DestinationPath $zip

Write-Host "OK -> $zip"
Get-ChildItem $stage | Select-Object Name, Length
