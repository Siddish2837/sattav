# QUICK START: Deploy to Production

## Prerequisites
- GitHub account connected to project
- Vercel account (for frontend)
- Render account (for backend)

---

## Step 1: Deploy Backend to Render

### 1.1 Create Render Web Service
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub account and select this repository

### 1.2 Configure Service
- **Service Name**: `career-api` (or your choice)
- **Root Directory**: `api-server`
- **Runtime**: Node
- **Build Command**: `pnpm install && pnpm --filter @workspace/api-server build`
- **Start Command**: `pnpm --filter @workspace/api-server start`
- **Instance Type**: Free tier is sufficient for testing

### 1.3 Set Environment Variables
1. In Render dashboard, go to your service → Environment
2. Add: `NODE_ENV=production`
3. Deploy

**Wait for deployment to complete. Note your service URL** (e.g., `https://career-api.onrender.com`)

---

## Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Project
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New +" → "Project"
3. Import your GitHub repository

### 2.2 Configure Project
- **Project Name**: `career-engine` (or your choice)
- **Framework**: Vite
- **Root Directory**: `career-engine`
- **Build Command**: `pnpm --filter @workspace/career-engine build`
- **Output Directory**: `dist`

### 2.3 Add Environment Variables
1. In Vercel dashboard, go to your project → Settings → Environment Variables
2. Add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://career-api.onrender.com` (replace with your Render service URL)
3. Deploy

**Vercel will automatically deploy on every push to main.**

---

## Step 3: Verify Deployment

### Test Frontend
1. Open your Vercel URL
2. Fill profile and click "Analyze"
3. See recommendations appear
4. Click a recommendation to see analysis

### Test Backend
```bash
curl -X POST https://career-api.onrender.com/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "skills": ["JavaScript", "React"],
    "interests": "web development",
    "careerGoal": "senior developer"
  }'
```

Should return:
```json
[
  {
    "careerId": "...",
    "title": "...",
    "matchScore": 85,
    ...
  },
  ...
]
```

---

## Step 4: Monitor & Debug

### Vercel Logs
- Dashboard → Your project → Deployments (current) → View logs

### Render Logs
- Dashboard → Your service → Logs tab

---

## Environment Variables Reference

### Frontend (Vercel)
```
VITE_API_URL=https://career-api.onrender.com
```

### Backend (Render)
```
NODE_ENV=production
PORT=<automatically assigned>
```

---

## Troubleshooting

**Frontend shows "Failed to fetch"**
- Check VITE_API_URL is set in Vercel environment variables
- Verify backend service is running (check Render logs)
- Confirm backend URL is correct

**Backend won't start**
- Check "Start Command" is: `pnpm --filter @workspace/api-server start`
- Verify pnpm is installed (check build logs)
- Look for missing dependencies in logs

**Build fails on Vercel**
- Check "Build Command" is: `pnpm --filter @workspace/career-engine build`
- Verify Root Directory is: `career-engine`
- Check logs for TypeScript errors

---

## Local Development Reference

```bash
# Install all dependencies
pnpm install

# Frontend development
cd career-engine && pnpm dev

# Backend development
cd api-server && pnpm dev

# Full build
pnpm build

# Check for TypeScript errors
pnpm typecheck
```

---

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Deploy frontend to Vercel
3. ✅ Add custom domain (optional)
4. ✅ Enable HTTPS (automatic on both platforms)
5. ✅ Set up monitoring/alerts (optional)

---

## Support

- Check [AUDIT_REPORT.md](AUDIT_REPORT.md) for detailed issue list
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for full configuration guide
- Review API spec in [DEPLOYMENT.md](DEPLOYMENT.md#api-specification)

**Ready to deploy? Get started now!** 🚀
