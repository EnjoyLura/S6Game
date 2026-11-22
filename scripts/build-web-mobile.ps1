param([string]$EditorRoot='C:\ProgramData\cocos\editors\Creator\3.8.8')
$ErrorActionPreference='Stop'
$projectRoot=Split-Path $PSScriptRoot -Parent
$exe=Join-Path $EditorRoot 'CocosCreator.exe'
$logDir=Join-Path $projectRoot 'logs'
New-Item -ItemType Directory -Path $logDir -Force | Out-Null
$argsList=@('--project',('"'+$projectRoot+'"'),'--build',('"configPath='+ (Join-Path $projectRoot 'build-web-mobile.json')+'"'))
$p=Start-Process -FilePath $exe -ArgumentList $argsList -PassThru -WindowStyle Hidden -Wait -RedirectStandardOutput (Join-Path $logDir 'build-stdout.log') -RedirectStandardError (Join-Path $logDir 'build-stderr.log')
Write-Host "Creator build PID $($p.Id)"
Write-Host "Creator exit code: $($p.ExitCode)"
if($p.ExitCode -ne 36){Get-Content (Join-Path $logDir 'build-stderr.log') -Tail 30;throw 'Cocos build failed; see logs/build-stdout.log'}
$entry=Join-Path $projectRoot 'build/web-mobile/index.html'
if(-not(Test-Path -LiteralPath $entry)){throw 'Missing web-mobile/index.html'}
Write-Host "Web-mobile built: $entry"

python (Join-Path $PSScriptRoot 'encode-web-art.py')
if($LASTEXITCODE -ne 0){throw 'Encoding WebP artwork failed'}
node (Join-Path $PSScriptRoot 'brand-build.cjs')
if($LASTEXITCODE -ne 0){throw 'Preparing the startup page failed'}
node (Join-Path $PSScriptRoot 'verify-build.cjs')
if($LASTEXITCODE -ne 0){throw 'Build artifact verification failed'}
