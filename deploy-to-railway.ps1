$RepoDir = Get-Location
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "       DEPLOY ROCHA TEC (FRESH START)     " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Configura Safe Directory
Write-Host ">> Configurando Safe Directory..." -ForegroundColor Gray
git config --global --add safe.directory $RepoDir

# 2. Inicializa se necessário
if (-not (Test-Path "$RepoDir\.git")) {
    Write-Host ">> Inicializando novo repositório..." -ForegroundColor Gray
    git init
}

# 3. Configura o Remote
Write-Host ">> Configurando Remote GitHub..." -ForegroundColor Gray
git remote remove origin 2>$null
git remote add origin https://github.com/ofranciscorocha/rocha-tec.git

# 4. Limpeza de Cache (Caso o node_modules tenha entrado por engano)
Write-Host ">> Limpando Cache do Git (Ignorando node_modules)..." -ForegroundColor Yellow
git rm -r --cached . 2>$null

# 5. Push final
Write-Host ">> Adicionando arquivos e fazendo Push..." -ForegroundColor Cyan
git add .
git commit -m "feat: unified ecosystem fresh start with gitignore"
git branch -M production
git push origin production --force

Write-Host "==========================================" -ForegroundColor Green
Write-Host "   Sucesso! Verifique agora o Railway.   " -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
