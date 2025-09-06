# Deployment Guide

This guide will help you deploy your Paint Shop Inventory Management System to GitHub and Vercel.

## 🚀 Quick Fix for 404 Issues

The 404 error when refreshing pages in Vercel has been fixed with the following configurations:

### 1. Vercel Configuration (`vercel.json`)
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2. Fallback for Other Platforms (`public/_redirects`)
```
/*    /index.html   200
```

These files ensure that all routes are redirected to `index.html`, allowing React Router to handle client-side routing properly.

## 📁 GitHub Setup

### Step 1: Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit: Paint Shop Inventory Management System"
```

### Step 2: Create GitHub Repository
1. Go to [GitHub](https://github.com) and create a new repository
2. Name it something like `paint-shop-inventory` or `painfrontend`
3. Don't initialize with README (we already have one)

### Step 3: Connect Local Repository to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
git branch -M main
git push -u origin main
```

## 🌐 Vercel Deployment

### Method 1: Automatic Deployment (Recommended)

1. **Connect GitHub to Vercel:**
   - Go to [Vercel](https://vercel.com)
   - Sign up/Login with your GitHub account
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings:**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app
   - You'll get a live URL like `https://your-app-name.vercel.app`

### Method 2: Manual Deployment

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy:**
```bash
vercel --prod
```

## 🔧 Environment Variables (If Needed)

If your app uses environment variables:

1. Create `.env.local` file (already in .gitignore)
2. Add variables like:
```
VITE_API_URL=https://your-api.com
VITE_APP_NAME=Paint Shop Inventory
```

3. In Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add your variables there

## 🔄 Automatic Deployments

The included GitHub Actions workflow (`.github/workflows/deploy.yml`) can automatically deploy to Vercel on every push to main branch.

### Setup GitHub Actions for Vercel:

1. **Get Vercel Tokens:**
   - Go to Vercel Dashboard → Settings → Tokens
   - Create a new token

2. **Get Project IDs:**
```bash
vercel link
cat .vercel/project.json
```

3. **Add GitHub Secrets:**
   - Go to GitHub Repository → Settings → Secrets and Variables → Actions
   - Add these secrets:
     - `VERCEL_TOKEN`: Your Vercel token
     - `ORG_ID`: Your organization ID from project.json
     - `PROJECT_ID`: Your project ID from project.json

## 🧪 Testing Your Deployment

After deployment, test these scenarios:

1. **Direct URL Access:** Visit `https://your-app.vercel.app/dashboard`
2. **Refresh Test:** Navigate to any route and refresh the page
3. **Deep Link Test:** Share a direct link to a specific route

All should work without 404 errors!

## 🐛 Troubleshooting

### Common Issues:

1. **404 on Refresh:**
   - ✅ Fixed with `vercel.json` configuration

2. **Build Failures:**
   - Check that all dependencies are in `package.json`
   - Ensure build command is `npm run build`
   - Verify output directory is `dist`

3. **Routing Issues:**
   - Ensure you're using `BrowserRouter` (not `HashRouter`)
   - Check that all routes are properly defined in `App.jsx`

4. **Environment Variables:**
   - Prefix with `VITE_` for client-side access
   - Add to Vercel dashboard for production

### Build Locally to Test:
```bash
npm run build
npm run preview
```

## 📊 Performance Optimization

The build is optimized with:
- Code splitting for vendor libraries
- Separate chunks for React, Router, and UI components
- Minified CSS and JavaScript
- Tree shaking for unused code

## 🔒 Security Notes

- Never commit `.env` files to GitHub
- Use environment variables for sensitive data
- The `.gitignore` file is configured to exclude sensitive files

## 📈 Monitoring

After deployment, you can monitor your app:
- Vercel Analytics (built-in)
- Vercel Speed Insights
- Custom analytics if needed

---

Your Paint Shop Inventory Management System is now ready for production! 🎉
