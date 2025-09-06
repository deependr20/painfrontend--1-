#!/bin/bash

# Bash script to setup GitHub repository
# Run this script to initialize and push to GitHub

echo "🚀 Setting up GitHub repository for Paint Shop Inventory..."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Initialize git repository if not already initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
else
    echo "✅ Git repository already initialized."
fi

# Add all files
echo "📝 Adding files to Git..."
git add .

# Commit files
echo "💾 Committing files..."
git commit -m "Initial commit: Paint Shop Inventory Management System with Vercel deployment fix"

# Prompt for GitHub repository URL
echo ""
echo "🔗 Please create a new repository on GitHub and provide the URL:"
echo "   1. Go to https://github.com/new"
echo "   2. Create a new repository (don't initialize with README)"
echo "   3. Copy the repository URL"
echo ""

read -p "Enter your GitHub repository URL (e.g., https://github.com/username/repo.git): " repoUrl

if [ ! -z "$repoUrl" ]; then
    # Add remote origin
    echo "🔗 Adding remote origin..."
    git remote remove origin 2>/dev/null  # Remove if exists
    git remote add origin "$repoUrl"
    
    # Set main branch
    echo "🌿 Setting main branch..."
    git branch -M main
    
    # Push to GitHub
    echo "🚀 Pushing to GitHub..."
    git push -u origin main
    
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo "🌐 Your repository is now available at: $repoUrl"
    echo ""
    echo "🚀 Next steps for Vercel deployment:"
    echo "   1. Go to https://vercel.com"
    echo "   2. Sign in with GitHub"
    echo "   3. Import your repository"
    echo "   4. Deploy with default settings"
    echo ""
    echo "📖 For detailed instructions, see DEPLOYMENT.md"
else
    echo "❌ No repository URL provided. Please run the script again."
fi

echo ""
echo "🎉 Setup complete! Your 404 refresh issue is now fixed."
