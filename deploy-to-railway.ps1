$RepoDir = Get-Location
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "       REPARO DE BUILD E DEPLOY FINAL     " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Configura Safe Directory
Write-Host ">> Configurando Safe Directory..." -ForegroundColor Gray
git config --global --add safe.directory $RepoDir

# 2. Sincroniza package-lock.json (Essencial para o Railway)
Write-Host ">> Sincronizando package-lock.json (Aguarde...)" -ForegroundColor Yellow
npm install

# 3. Configura o Remote se necessário
if (-not (Test-Path "$RepoDir\.git")) {
    Write-Host ">> Inicializando repositório..." -ForegroundColor Gray
    git init
}
git remote remove origin 2>$null
git remote add origin https://github.com/ofranciscorocha/rocha-tec.git

# 4. Limpeza de Cache para garantir o novo lock
Write-Host ">> Limpando Cache do Git..." -ForegroundColor Yellow
git rm -r --cached . 2>$null

# 5. Push para a MAIN
Write-Host ">> Adicionando arquivos e enviando para MAIN..." -ForegroundColor Cyan
git add .
git commit -m "fix: sync package-lock.json for Railway build"
git branch -M main
git push origin main --force

Write-Host "==========================================" -ForegroundColor Green
Write-Host "   Sucesso! Agora o Railway vai construir. " -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
