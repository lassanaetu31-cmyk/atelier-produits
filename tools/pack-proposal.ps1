# Assemble le paquet de vente Proposal Generator -> release/Proposal-Generator.zip
# Prérequis : npm run build:proposal (génère apps/proposal/dist/index.html)
$ErrorActionPreference = "Stop"
$root  = Split-Path -Parent $PSScriptRoot
$build = Join-Path $root "apps\proposal\dist\index.html"
$stage = Join-Path $root "release\Proposal-Generator"
$zip   = Join-Path $root "release\Proposal-Generator.zip"

if (-not (Test-Path $build)) { throw "Build introuvable. Lance d'abord : npm run build:proposal" }

if (Test-Path $stage) { Remove-Item -Recurse -Force $stage }
New-Item -ItemType Directory -Force $stage | Out-Null

Copy-Item $build (Join-Path $stage "Proposal-Generator.html")
Copy-Item (Join-Path $root "release-assets\proposal\*") $stage

if (Test-Path $zip) { Remove-Item -Force $zip }
Compress-Archive -Path (Join-Path $stage "*") -DestinationPath $zip

Write-Host "OK -> $zip"
Get-ChildItem $stage | Select-Object Name, Length
