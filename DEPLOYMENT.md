# Deployment Guide

This guide covers deploying the Allumino backend to Railway and Vercel.

## Prerequisites

1. Auth0 account and tenant configured
2. PostgreSQL database (can use Railway/Vercel Postgres)
3. MongoDB database (can use MongoDB Atlas)

---

## Railway Deployment

### Step 1: Create Railway Project

1. Go to [railway.app](https://railway.app) and create a new project
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your Allumino backend repository

### Step 2: Add Database Services

#### PostgreSQL
1. Click "+ New" → "Database" → "Add PostgreSQL"
2. Railway will auto-generate `DATABASE_URL` variable
3. Rename it to `DATABASE_URL_POSTGRES` in your service variables

#### MongoDB
1. Click "+ New" → "Database" → "Add MongoDB"
2. Railway will auto-generate `MONGO_URL` variable
3. Rename it to `MONGODB_URI` in your service variables

### Step 3: Configure Environment Variables

Add these variables to your Railway service:

```
NODE_ENV=production
PORT=3001
DATABASE_URL_POSTGRES=(auto-generated, rename from DATABASE_URL)
MONGODB_URI=(auto-generated, rename from MONGO_URL)
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret
AUTH0_AUDIENCE=https://api.allumino.com
AUTH0_CALLBACK_URL=https://your-app.up.railway.app/api/auth/callback
SESSION_SECRET=(generate strong random string)
FRONTEND_URL=https://your-frontend.vercel.app
CORS_ORIGINS=https://your-frontend.vercel.app
```

### Step 4: Configure Auth0 Callback URLs

In your Auth0 Dashboard → Applications → Your App:

**Allowed Callback URLs:**
```
https://your-app.up.railway.app/api/auth/callback
```

**Allowed Logout URLs:**
```
https://your-frontend.vercel.app
```

**Allowed Web Origins:**
```
https://your-frontend.vercel.app
```

### Step 5: Deploy

1. Railway will automatically deploy on every push to main branch
2. Monitor deployment logs in Railway dashboard
3. Once deployed, visit: `https://your-app.up.railway.app/api/health`

---

## Vercel Deployment

### Step 1: Install Vercel CLI (Optional)

```bash
npm i -g vercel
```

### Step 2: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and import your GitHub repo
2. Select the repository
3. Keep default settings (Vercel auto-detects Node.js)

### Step 3: Configure Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```
NODE_ENV=production
DATABASE_URL_POSTGRES=postgresql://username:password@hostname:5432/database_name
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret
AUTH0_AUDIENCE=https://api.allumino.com
AUTH0_CALLBACK_URL=https://your-app.vercel.app/api/auth/callback
SESSION_SECRET=(generate strong random string)
FRONTEND_URL=https://your-frontend.vercel.app
CORS_ORIGINS=https://your-frontend.vercel.app
```

### Step 4: Configure Auth0 Callback URLs

In your Auth0 Dashboard → Applications → Your App:

**Allowed Callback URLs:**
```
https://your-app.vercel.app/api/auth/callback
```

**Allowed Logout URLs:**
```
https://your-frontend.vercel.app
```

**Allowed Web Origins:**
```
https://your-frontend.vercel.app
```

### Step 5: Run Database Migrations

Vercel serverless functions don't run migrations automatically. You need to:

**Option 1: Run migrations locally**
```bash
DATABASE_URL_POSTGRES="your-production-db-url" npx prisma migrate deploy
```

**Option 2: Use Railway for migrations**
Deploy to Railway first, let it run migrations, then deploy to Vercel pointing to the same database.

### Step 6: Deploy

```bash
vercel --prod
```

Or push to your main branch (if auto-deploy is configured).

---

## Vercel Limitations

1. **Cold Starts**: Serverless functions have cold start latency (~1-3s)
2. **Execution Time**: Max 10s for Hobby, 60s for Pro
3. **File Size**: 50MB deployment limit
4. **Connections**: Database connection pooling recommended (use Prisma Data Proxy or PgBouncer)

**Recommendation**: Use Railway for production, Vercel for testing/preview deployments.

---

## Database Connection Pooling (Important for Vercel)

For Vercel serverless, use connection pooling:

### Prisma Data Proxy (Recommended)
```bash
npx prisma generate --data-proxy
```

Update DATABASE_URL_POSTGRES to use `prisma://` protocol.

### PgBouncer
Use a PgBouncer connection string for PostgreSQL.

---

## Auth0 Configuration Summary

### Local Development
```
Callback URL: http://localhost:3001/api/auth/callback
Logout URL: http://localhost:3000
Web Origin: http://localhost:3000
```

### Railway Production
```
Callback URL: https://your-app.up.railway.app/api/auth/callback
Logout URL: https://your-frontend.vercel.app
Web Origin: https://your-frontend.vercel.app
```

### Vercel Production
```
Callback URL: https://your-app.vercel.app/api/auth/callback
Logout URL: https://your-frontend.vercel.app
Web Origin: https://your-frontend.vercel.app
```

---

## Monitoring and Health Checks

Both platforms support health checks:

- **Health endpoint**: `/api/health`
- Railway: Configure in `railway.json`
- Vercel: Monitor via Vercel dashboard

---

## Troubleshooting

### Database Connection Errors
- Verify connection strings are correct
- Check firewall rules allow connections from Railway/Vercel IPs
- For Vercel: Use connection pooling

### Auth0 Callback Errors
- Double-check callback URLs match exactly (including https://)
- Verify Auth0 client secret is correct
- Check SESSION_SECRET is set

### Migration Errors
- Run migrations manually for Vercel
- For Railway: Check build logs

---

## Security Checklist

- [ ] All environment variables use strong, random values
- [ ] SESSION_SECRET is cryptographically random (32+ chars)
- [ ] Auth0 client secrets are kept secure
- [ ] CORS_ORIGINS only includes trusted domains
- [ ] Database credentials are secured
- [ ] SSL/TLS enabled for all database connections
- [ ] Rate limiting configured appropriately
