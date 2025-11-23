# Quick Deployment Checklist

Follow these steps in order to deploy your project:

## ✅ Pre-Deployment Checklist

- [ ] Code is pushed to GitHub
- [ ] Supabase project created
- [ ] Database tables created (run SQL scripts)
- [ ] Storage buckets created (`experiment-pdfs` - public)

## 🚀 Deployment Steps

### 1. Deploy Backend (5 minutes)

**Option A: Railway (Easiest)**
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select `circuit-analyzer-backend` folder
4. Add environment variable: `PORT=5001`
5. Copy the deployed URL

**Option B: Render**
1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repo
4. Root Directory: `circuit-analyzer-backend`
5. Build: `pip install -r requirements.txt`
6. Start: `python circuit_analyzer.py`
7. Copy the deployed URL

### 2. Deploy Frontend (5 minutes)

1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Framework: Next.js (auto-detected)
4. Add Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   CIRCUIT_ANALYZER_URL=your-backend-url
   ```
5. Deploy!

## 📝 Environment Variables Needed

### Vercel (Frontend):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CIRCUIT_ANALYZER_URL` (your backend URL)

### Backend (Railway/Render):
- `PORT=5001` (optional, auto-assigned)

## 🔍 Testing After Deployment

1. Visit your Vercel URL
2. Test sign up / login
3. Test circuit simulator
4. Test PDF upload (admin section)
5. Test transfer function calculator

## 🆘 Common Issues

**Backend not connecting?**
- Check `CIRCUIT_ANALYZER_URL` is correct in Vercel
- Verify backend is running (check logs)
- Ensure CORS is enabled in Flask

**Supabase errors?**
- Verify API keys are correct
- Check database tables exist
- Verify storage buckets are public

**Build fails?**
- Check Node.js version (18+)
- Verify all dependencies installed
- Check for TypeScript errors

## 📚 Full Guide

See `DEPLOYMENT.md` for detailed instructions.

