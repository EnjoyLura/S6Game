param([string]$EditorRoot='C:\ProgramData\cocos\editors\Creator\3.8.8')
$ErrorActionPreference='Stop'
$projectRoot=Split-Path $PSScriptRoot -Parent
$template=Join-Path $EditorRoot 'resources\templates\empty-2d'
foreach($item in Get-ChildItem -LiteralPath $template -Force){$dest=Join-Path $projectRoot $item.Name;if(-not(Test-Path -LiteralPath $dest)){Copy-Item -LiteralPath $item.FullName -Destination $dest -Recurse}}
foreach($dir in @('assets/scripts','assets/resources/art','assets/scenes','tests')){New-Item -ItemType Directory -Path (Join-Path $projectRoot $dir) -Force | Out-Null}
Write-Host "Initialized from Cocos Creator 3.8.8 official empty-2d template: $projectRoot"
