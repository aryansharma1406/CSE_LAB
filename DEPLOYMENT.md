# Deployment Guide

This guide will help you deploy the CSE LAB project to production.

## Project Structure

- **Frontend**: Next.js 14 application
- **Backend**: Python Flask API (circuit analyzer)
- **Database**: Supabase (PostgreSQL + Storage)

## Prerequisites

1. GitHub account
2. Vercel account (for frontend) - [Sign up](https://vercel.com)
3. Supabase account (for database) - [Sign up](https://supabase.com)
4. Railway/Render account (for Python backend) - [Railway](https://railway.app) or [Render](https://render.com)

---

## Step 1: Deploy Supabase Database

### 1.1 Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in project details:
   - Name: `cse-lab` (or your preferred name)
   - Database Password: (save this securely)
   - Region: Choose closest to your users
4. Wait for project to be created (~2 minutes)

### 1.2 Set Up Database Tables

1. Go to SQL Editor in Supabase Dashboard
2. Run the SQL scripts in order from the `scripts/` folder:
   - `001_create_tables.sql`
   - `002_profile_trigger.sql`
   - `003_saved_circuits_table.sql`
   - `004_lab_manuals_table.sql`
   - `005_seed_lab_manuals.sql`
   - `006_pdf_storage_setup.sql`
   - `007_add_admin_role.sql`

### 1.3 Create Storage Buckets

1. Go to Storage in Supabase Dashboard
2. Create bucket: `experiment-pdfs`
   - Make it **Public** (for PDF access)
   - Enable RLS (Row Level Security)
3. Create bucket: `lab-manuals` (if needed)
   - Make it **Public**

### 1.4 Get API Keys

1. Go to Settings → API
2. Copy these values (you'll need them later):
   - **Project URL**: `https://your-project.supabase.co`
   - **anon/public key**: (starts with `eyJ...`)
   - **service_role key**: (starts with `eyJ...`) - Keep this secret!

---

## Step 2: Deploy Python Backend

### Option A: Railway (Recommended)

1. **Install Railway CLI**:
   ```bash
   npm i -g @railway/cli
   railway login
   ```

2. **Initialize Railway Project**:
   ```bash
   cd circuit-analyzer-backend
   railway init
   ```

3. **Create Railway Service**:
   - Go to [Railway Dashboard](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo" (or use CLI)

4. **Configure Environment Variables**:
   - In Railway dashboard, go to Variables
   - Add: `PORT=5001` (Railway will auto-assign, but set default)

5. **Deploy**:
   ```bash
   railway up
   ```

6. **Get Backend URL**:
   - Railway will provide a URL like: `https://your-app.railway.app`
   - Copy this URL (you'll need it for frontend)

### Option B: Render

1. Go to [Render Dashboard](https://render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `circuit-analyzer-backend`
   - **Root Directory**: `circuit-analyzer-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python circuit_analyzer.py`
5. Add Environment Variable:
   - `PORT=5001`
6. Click "Create Web Service"
7. Copy the service URL

### Option C: Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create circuit-analyzer-backend`
4. Set config: `heroku config:set PORT=5001`
5. Deploy: `git push heroku main`

---

## Step 3: Update Backend URL in Frontend

Update the API routes to use your deployed backend URL:

1. **Update `/app/api/matlab-analysis/route.ts`**:
   - Change `http://localhost:5001` to your backend URL
   - Or use environment variable: `process.env.CIRCUIT_ANALYZER_URL || 'http://localhost:5001'`

2. **Update `/app/api/transfer-function/route.ts`**:
   - Same as above

---

## Step 4: Deploy Next.js Frontend to Vercel

### 4.1 Prepare Repository

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/cse-lab.git
   git push -u origin main
   ```

### 4.2 Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 4.3 Set Environment Variables

In Vercel project settings → Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
CIRCUIT_ANALYZER_URL=https://your-backend.railway.app
```

**Important**: 
- Replace `your-project`, `your-anon-key`, etc. with actual values
- For production, set these in "Production" environment
- You can also set for "Preview" and "Development"

### 4.4 Deploy

1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Your site will be live at: `https://your-project.vercel.app`

---

## Step 5: Update API Routes for Production

Update the API routes to use environment variables:

### Update `/app/api/matlab-analysis/route.ts`:

```typescript
const backendUrl = process.env.CIRCUIT_ANALYZER_URL || 'http://localhost:5001'
const response = await fetch(`${backendUrl}/api/matlab-analysis`, {
  // ... rest of code
})
```

### Update `/app/api/transfer-function/route.ts`:

```typescript
const backendUrl = process.env.CIRCUIT_ANALYZER_URL || 'http://localhost:5001'
const response = await fetch(`${backendUrl}/api/transfer-function`, {
  // ... rest of code
})
```

---

## Step 6: Verify Deployment

1. **Test Frontend**: Visit your Vercel URL
2. **Test Authentication**: Try signing up/logging in
3. **Test Circuit Lab**: Try the circuit simulator
4. **Test PDF Upload**: Upload a PDF in admin section
5. **Test Backend**: Try calculating a transfer function

---

## Troubleshooting

### Backend Not Connecting

- Check backend URL is correct in environment variables
- Verify backend is running (check Railway/Render logs)
- Check CORS settings in `circuit_analyzer.py`

### Supabase Errors

- Verify API keys are correct
- Check database tables exist
- Verify storage buckets are created and public

### Build Errors

- Check Node.js version (should be 18+)
- Verify all dependencies are in `package.json`
- Check for TypeScript errors

---

## Environment Variables Summary

### Frontend (Vercel):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CIRCUIT_ANALYZER_URL`

### Backend (Railway/Render):
- `PORT=5001`

---

## Post-Deployment Checklist

- [ ] Database tables created
- [ ] Storage buckets created and public
- [ ] Backend deployed and accessible
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set
- [ ] API routes updated with backend URL
- [ ] Test authentication
- [ ] Test circuit simulator
- [ ] Test PDF upload/download
- [ ] Test transfer function calculator

---

## Custom Domain (Optional)

1. In Vercel dashboard, go to Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic)

---

## Monitoring

- **Vercel Analytics**: Built-in analytics in Vercel dashboard
- **Railway/Render Logs**: Check application logs for errors
- **Supabase Dashboard**: Monitor database usage and storage

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs

