$RepoDir = Get-Location
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "       DEPLOY ROCHA TEC (MAIN BRANCH)     " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Configura Safe Directory
Write-Host ">> Configurando Safe Directory..." -ForegroundColor Gray
git config --global --add safe.directory $RepoDir

# 2. Inicializa ou corrige branch
if (-not (Test-Path "$RepoDir\.git")) {
    Write-Host ">> Inicializando novo repositório..." -ForegroundColor Gray
    git init
}

# 3. Configura o Remote
Write-Host ">> Configurando Remote GitHub..." -ForegroundColor Gray
git remote remove origin 2>$null
git remote add origin https://github.com/ofranciscorocha/rocha-tec.git

# 4. Limpeza de Cache
Write-Host ">> Limpando Cache do Git..." -ForegroundColor Yellow
git rm -r --cached . 2>$null

# 5. Push para a MAIN (Padrão do Railway)
Write-Host ">> Adicionando arquivos e enviando para MAIN..." -ForegroundColor Cyan
git add .
git commit -m "feat: unified ecosystem final deploy to main"
git branch -M main
git push origin main --force

Write-Host "==========================================" -ForegroundColor Green
Write-Host "   Sucesso! Agora o Railway vai iniciar. " -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
