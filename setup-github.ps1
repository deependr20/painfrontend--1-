# PowerShell script to setup GitHub repository
# Run this script in PowerShell to initialize and push to GitHub

Write-Host "🚀 Setting up GitHub repository for Paint Shop Inventory..." -ForegroundColor Green

# Check if git is installed
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git is not installed. Please install Git first." -ForegroundColor Red
    exit 1
}

# Initialize git repository if not already initialized
if (!(Test-Path ".git")) {
    Write-Host "📁 Initializing Git repository..." -ForegroundColor Yellow
    git init
} else {
    Write-Host "✅ Git repository already initialized." -ForegroundColor Green
}

# Add all files
Write-Host "📝 Adding files to Git..." -ForegroundColor Yellow
git add .

# Commit files
Write-Host "💾 Committing files..." -ForegroundColor Yellow
git commit -m "Initial commit: Paint Shop Inventory Management System with Vercel deployment fix"

# Prompt for GitHub repository URL
Write-Host ""
Write-Host "🔗 Please create a new repository on GitHub and provide the URL:" -ForegroundColor Cyan
Write-Host "   1. Go to https://github.com/new" -ForegroundColor Gray
Write-Host "   2. Create a new repository (don't initialize with README)" -ForegroundColor Gray
Write-Host "   3. Copy the repository URL" -ForegroundColor Gray
Write-Host ""

$repoUrl = Read-Host "Enter your GitHub repository URL (e.g., https://github.com/username/repo.git)"

if ($repoUrl) {
    # Add remote origin
    Write-Host "🔗 Adding remote origin..." -ForegroundColor Yellow
    git remote remove origin 2>$null  # Remove if exists
    git remote add origin $repoUrl
    
    # Set main branch
    Write-Host "🌿 Setting main branch..." -ForegroundColor Yellow
    git branch -M main
    
    # Push to GitHub
    Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
    git push -u origin main
    
    Write-Host ""
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "🌐 Your repository is now available at: $repoUrl" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🚀 Next steps for Vercel deployment:" -ForegroundColor Yellow
    Write-Host "   1. Go to https://vercel.com" -ForegroundColor Gray
    Write-Host "   2. Sign in with GitHub" -ForegroundColor Gray
    Write-Host "   3. Import your repository" -ForegroundColor Gray
    Write-Host "   4. Deploy with default settings" -ForegroundColor Gray
    Write-Host ""
    Write-Host "📖 For detailed instructions, see DEPLOYMENT.md" -ForegroundColor Cyan
} else {
    Write-Host "❌ No repository URL provided. Please run the script again." -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Setup complete! Your 404 refresh issue is now fixed." -ForegroundColor Green
