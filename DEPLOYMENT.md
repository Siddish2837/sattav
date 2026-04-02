# Deployment Configuration Guide

This document specifies the exact configuration required to deploy the Career Engine to Vercel (frontend) and Render (backend).

## ✅ Pre-Deployment Checklist

- [x] Frontend builds successfully: `pnpm --filter @workspace/career-engine build`
- [x] Backend builds successfully: `pnpm --filter @workspace/api-server build`
- [x] All endpoints implemented: `/analyze` and `/recommend`
- [x] Shared analysis logic: Single source of truth in `api-server/src/logic/analysis.ts`
- [x] Frontend uses backend API via environment variable `VITE_API_URL`
- [x] No hardcoded localhost URLs
- [x] Safe environment variable defaults in both vite.config.ts and index.ts

---

## Frontend Deployment (Vercel)

### Project Settings

**Framework**: Vite  
**Root Directory**: `career-engine`  
**Node.js Version**: 18.x or later (recommended: 20.x LTS)

### Build Settings

```
Install Command:      pnpm install
Build Command:        pnpm --filter @workspace/career-engine build
Output Directory:     dist
```

### Environment Variables

Set in Vercel Project Settings → Environment Variables:

```
VITE_API_URL=https://<your-render-backend-url>.onrender.com
```

**Example:**
```
VITE_API_URL=https://career-api.onrender.com
```

### Deployment

1. Connect your GitHub repository to Vercel
2. Set Root Directory to: `career-engine`
3. Add the environment variable: `VITE_API_URL`
4. Deploy

**Important**: Do NOT set `PORT` or `BASE_PATH` in Vercel. The frontend vite.config.ts has safe defaults.

---

## Backend Deployment (Render)

### Project Settings

**Service Type**: Web Service  
**Runtime**: Node  
**Root Directory**: `api-server`  
**Node.js Version**: 18.x or later (recommended: 20.x LTS)

### Build Settings

```
Build Command:   pnpm install && pnpm --filter @workspace/api-server build
Start Command:   pnpm --filter @workspace/api-server start
```

### Environment Variables

Set in Render Service Settings → Environment:

```
NODE_ENV=production
PORT=10000
```

**Note**: The `PORT` environment variable will be automatically assigned by Render (typically 10000). The backend safely defaults to 5000 if not provided, but Render will override it.

### Deployment

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set Root Directory to: `api-server`
4. Set Build Command: `pnpm install && pnpm --filter @workspace/api-server build`
5. Set Start Command: `pnpm --filter @workspace/api-server start`
6. Deploy

---

## Verification Checklist Post-Deployment

### Frontend (Vercel)

1. ✅ Site loads without console errors
2. ✅ Recommendations page fetches data from backend API
3. ✅ Clicking a recommendation navigates to analysis page
4. ✅ Analysis page displays consistent scores
5. ✅ `VITE_API_URL` environment variable is correctly set

### Backend (Render)

1. ✅ GET `/healthz` returns 200 OK
2. ✅ POST `/analyze` accepts `{ skills, interests, careerGoal, careerId }` and returns analysis
3. ✅ POST `/recommend` accepts `{ skills, interests, careerGoal }` and returns top 3 careers
4. ✅ Scores are consistent between `/analyze` and `/recommend` responses (both use `computeCareerAnalysis()`)
5. ✅ Server logs show no errors

### Integration Test

1. Open frontend URL from Vercel
2. Enter profile (skills, interests, career goal)
3. Verify recommendations load from backend
4. Click a recommendation
5. Verify analysis page opens with consistent scores

---

## Environment Variables Reference

### Frontend (Vercel)

| Variable | Required | Default | Notes |
|----------|----------|---------|-------|
| `VITE_API_URL` | ✅ | N/A | Backend URL (e.g., `https://career-api.onrender.com`) |
| `PORT` | ❌ | 5173 | Not needed; Vercel manages ports |
| `BASE_PATH` | ❌ | `/` | Not needed; safe default in vite.config.ts |

### Backend (Render)

| Variable | Required | Default | Notes |
|----------|----------|---------|-------|
| `PORT` | ❌ | 5000 | Render will override with its assigned port |
| `NODE_ENV` | ✅ | `production` | Set to "production" for security |

---

## Build Specifications

### Frontend Build Output

- **Location**: `dist/` (Vercel output directory)
- **Artifacts**:
  - `dist/index.html` - Entrypoint
  - `dist/assets/index-*.js` - Bundled React app (~529 KB before gzip)
  - `dist/assets/index-*.css` - Tailwind CSS (~113 KB)

### Backend Build Output

- **Location**: `dist/` (Render artifact)
- **Artifacts**:
  - `dist/index.mjs` - Main server bundle (~1.8 MB)
  - `dist/pino-*.mjs` - Logging workers
  - All files bundled with esbuild from TypeScript source

---

## Troubleshooting

### Frontend Build Fails

**Error**: `PORT environment variable is required`

**Solution**: Delete `artifacts/career-engine/vite.config.ts` or update it to use safe defaults. The main source at `career-engine/vite.config.ts` already has safe defaults.

### Frontend Shows API Error

**Error**: `Failed to fetch from undefined/recommend`

**Solution**: Verify `VITE_API_URL` is set in Vercel environment variables and points to your Render backend (e.g., `https://career-api.onrender.com`).

### Backend Won't Start

**Error**: `Unable to analyze career inputs`

**Solution**: Check:
1. `/analyze` endpoint imports `computeCareerAnalysis` from `logic/analysis.ts`
2. `logic/analysis.ts` imports all dependencies (match, survival, skillGap)
3. `data/careers.ts` exports `CAREERS` array and `getCareerById()` function

### Scores Don't Match Between Pages

**Problem**: Recommendations page shows one score, analysis page shows different score for same career.

**Solution**: This should NOT happen. Both endpoints use `computeCareerAnalysis()` from the same source file. If it occurs, verify:
1. Backend was rebuilt after any code changes
2. No duplicate logic exists in either endpoint
3. Both endpoints use the exact same input processing (skills array trimmed, interests/careerGoal trimmed)

---

## Deployment Workflow

### Local Development

```bash
# Install dependencies
pnpm install

# Frontend development
cd career-engine && pnpm dev

# In another terminal, backend development
cd api-server && pnpm dev
```

### Before Pushing to Production

```bash
# Run full typecheck
pnpm typecheck

# Build frontend
pnpm --filter @workspace/career-engine build

# Build backend
pnpm --filter @workspace/api-server build

# Verify build artifacts exist
ls artifacts/career-engine/dist
ls artifacts/api-server/dist
```

### Deploy

1. Push to your GitHub repository
2. Vercel and Render will auto-deploy when connected
3. Verify both services are running and communicating

---

## API Specification

### POST /analyze

**Request:**
```json
{
  "skills": ["JavaScript", "React", "TypeScript"],
  "interests": "web development",
  "careerGoal": "senior developer",
  "careerId": "software-engineer"
}
```

**Response:**
```json
{
  "matchScore": 85,
  "survivalScore": 72,
  "missingSkills": ["System Design"],
  "readinessTime": "1-2 months",
  "difficulty": "Easy",
  "recommendation": "Your profile already aligns well...",
  "stressFit": 80,
  "workHoursFit": 85,
  "learningCurveFit": 70
}
```

### POST /recommend

**Request:**
```json
{
  "skills": ["JavaScript", "React", "TypeScript"],
  "interests": "web development",
  "careerGoal": "senior developer"
}
```

**Response:**
```json
[
  {
    "careerId": "software-engineer",
    "title": "Software Engineer",
    "matchScore": 85,
    "survivalScore": 72,
    "finalScore": 80,
    "missingSkills": ["System Design"],
    "readinessTime": "1-2 months",
    "difficulty": "Easy"
  },
  // ... 2 more top careers
]
```

---

## Support

For issues during deployment:

1. Check application logs in Vercel/Render dashboards
2. Verify environment variables are correctly set
3. Confirm both frontend and backend services are running
4. Test API endpoint directly with curl:
   ```bash
   curl -X POST https://your-backend.onrender.com/recommend \
     -H "Content-Type: application/json" \
     -d '{"skills":["JavaScript"],"interests":"web","careerGoal":"dev"}'
   ```
