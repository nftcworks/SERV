param([string] $SdkPath)

$ErrorActionPreference = 'Stop'
$project = Split-Path -Parent $PSScriptRoot
$android = Join-Path $project 'android'

if (-not $SdkPath) {
    $candidates = @(
        $env:ANDROID_HOME,
        $env:ANDROID_SDK_ROOT,
        (Join-Path $env:LOCALAPPDATA 'Android/Sdk'),
        (Join-Path $env:LOCALAPPDATA 'SERV/AndroidSdk')
    )
    $SdkPath = $candidates | Where-Object {
        $_ -and (Test-Path -LiteralPath (Join-Path $_ 'platforms/android-35/android.jar')) -and
        (Test-Path -LiteralPath (Join-Path $_ 'build-tools/35.0.0/aapt2.exe'))
    } | Select-Object -First 1
}
if (-not $SdkPath) {
    throw 'Install Android SDK Platform 35 and Build Tools 35.0.0, or pass -SdkPath to an existing SDK.'
}

$platform = Join-Path $SdkPath 'platforms/android-35/android.jar'
$buildTools = Join-Path $SdkPath 'build-tools/35.0.0'
$aapt = Join-Path $buildTools 'aapt2.exe'
$dexer = Join-Path $buildTools 'd8.bat'
$aligner = Join-Path $buildTools 'zipalign.exe'
$signer = Join-Path $buildTools 'apksigner.bat'
foreach ($file in @($platform, $aapt, $dexer, $aligner, $signer)) {
    if (-not (Test-Path -LiteralPath $file -PathType Leaf)) { throw "Missing SDK file: $file" }
}

function Invoke-BuildCommand([string] $Command, [string[]] $Arguments) {
    & $Command @Arguments
    if ($LASTEXITCODE -ne 0) { throw "Build failed while running $Command (exit $LASTEXITCODE)." }
}

Invoke-BuildCommand 'node' @((Join-Path $PSScriptRoot 'build.mjs'))
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$dist = (Resolve-Path -LiteralPath (Join-Path $project 'dist')).Path

$buildRoot = (New-Item -ItemType Directory -Force -Path (Join-Path $android '.build')).FullName
$staging = (New-Item -ItemType Directory -Path (Join-Path $buildRoot ([guid]::NewGuid().ToString('N')))).FullName
$classes = Join-Path $staging 'classes'
$dex = Join-Path $staging 'dex'
$compiled = Join-Path $staging 'resources.zip'
$unsigned = Join-Path $staging 'unsigned.apk'
$aligned = Join-Path $staging 'aligned.apk'
$signed = Join-Path $staging 'signed.apk'
$bytecode = Join-Path $staging 'classes.jar'
$output = Join-Path $project 'SERV.apk'

try {
    New-Item -ItemType Directory -Path $classes, $dex | Out-Null
    Invoke-BuildCommand $aapt @('compile', '--dir', (Join-Path $android 'res'), '-o', $compiled)
    Invoke-BuildCommand $aapt @('link', '--manifest', (Join-Path $android 'AndroidManifest.xml'),
        '-I', $platform, '-o', $unsigned, $compiled)
    Invoke-BuildCommand 'javac' @('--release', '8', '-encoding', 'UTF-8', '-cp', $platform,
        '-d', $classes, (Join-Path $android 'src/ph/serv/marketplace/MainActivity.java'))
    Invoke-BuildCommand 'jar' @('cf', $bytecode, '-C', $classes, '.')
    Invoke-BuildCommand $dexer @('--release', '--lib', $platform, '--min-api', '26', '--output', $dex, $bytecode)
    $apk = [System.IO.Compression.ZipFile]::Open($unsigned, [System.IO.Compression.ZipArchiveMode]::Update)
    try {
        foreach ($file in (Get-ChildItem -LiteralPath $dist -Recurse -File)) {
            $relative = $file.FullName.Substring($dist.Length + 1).Replace('\', '/')
            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($apk, $file.FullName, "assets/$relative") | Out-Null
        }
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($apk, (Join-Path $dex 'classes.dex'), 'classes.dex') | Out-Null
    } finally {
        $apk.Dispose()
    }
    Invoke-BuildCommand $aligner @('-f', '4', $unsigned, $aligned)

    $signing = (New-Item -ItemType Directory -Force -Path (Join-Path $android '.signing')).FullName
    $key = Join-Path $signing 'serv-test.keystore'
    if (-not (Test-Path -LiteralPath $key)) {
        Invoke-BuildCommand 'keytool' @('-genkeypair', '-keystore', $key, '-storetype', 'JKS',
            '-alias', 'serv-test', '-storepass', 'android', '-keypass', 'android',
            '-keyalg', 'RSA', '-keysize', '2048', '-validity', '10000', '-dname', 'CN=SERV Android Test')
    }
    Invoke-BuildCommand $signer @('sign', '--ks', $key, '--ks-key-alias', 'serv-test',
        '--ks-pass', 'pass:android', '--key-pass', 'pass:android', '--out', $signed, $aligned)
    Invoke-BuildCommand $signer @('verify', '--verbose', $signed)
    Copy-Item -LiteralPath $signed -Destination $output -Force
    Write-Host "APK ready: $output"
} finally {
    $resolved = (Resolve-Path -LiteralPath $staging).Path
    $buildPrefix = (Resolve-Path -LiteralPath $buildRoot).Path.TrimEnd('\') + '\'
    if ($resolved.StartsWith($buildPrefix, [StringComparison]::OrdinalIgnoreCase)) {
        Remove-Item -LiteralPath $resolved -Recurse -Force
    }
}
