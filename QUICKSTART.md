# Allumino Backend - Quick Start Guide

Get the Allumino backend running in under 10 minutes!

## Prerequisites

- Node.js 18+ installed
- Docker Desktop installed and running
- Auth0 account (free tier works)

## Step-by-Step Setup

### 1. Install Dependencies (1 min)

```bash
npm install
```

### 2. Setup Auth0 (3 min)

1. Go to https://manage.auth0.com/ and create an account
2. Create a new Application (Regular Web Application)
3. Create a new API:
   - Name: `Allumino API`
   - Identifier: `https://api.allumino.com`
4. In your Application settings, add:
   - **Allowed Callback URLs**: `http://localhost:3001/api/auth/callback`
   - **Allowed Logout URLs**: `http://localhost:3000`
   - **Allowed Web Origins**: `http://localhost:3000`

### 3. Configure Environment (2 min)

```bash
cp .env.example .env
```

Edit `.env` and add your Auth0 credentials:

```env
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_client_secret
AUTH0_AUDIENCE=https://api.allumino.com
```

Generate a strong session secret:

```bash
# On macOS/Linux
openssl rand -base64 32

# Copy the output and add to .env as SESSION_SECRET
```

### 4. Start Databases (2 min)

```bash
docker-compose up -d postgres mongodb
```

Wait 10 seconds for databases to initialize, then verify:

```bash
docker-compose ps
# Both postgres and mongodb should show "Up" status
```

### 5. Setup Database & Seed Data (1 min)

```bash
npm run db:setup
```

This will:
- Generate Prisma client
- Run database migrations
- Seed sample data

### 6. Start Server (1 min)

```bash
npm run dev
```

You should see:

```
Server running on port 3001
Environment: development
PostgreSQL connected successfully
MongoDB connected successfully
```

### 7. Test API (30 sec)

Open a new terminal and test:

```bash
# Health check
curl http://localhost:3001/api/health

# Should return:
# {"status":"healthy","timestamp":"...","uptime":..., "databases":{"postgres":true,"mongodb":true}}
```

## 🎉 You're Done!

Your backend is now running at:
- **API Base URL**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/api/health

## Next Steps

### Test Authentication Flow

1. Open browser to: http://localhost:3001/api/auth/login
2. You'll be redirected to Auth0
3. Sign up or log in
4. You'll be redirected back with a JWT token

### Import Postman Collection

1. Open Postman
2. Import `postman_collection.json`
3. Set the `{{token}}` variable with your JWT token
4. Test all endpoints!

### View Database

**PostgreSQL (via Prisma Studio):**
```bash
npm run prisma:studio
```
Opens at http://localhost:5555

**MongoDB (via Docker):**
```bash
docker exec -it allumino-mongodb mongosh \
  -u allumino -p allumino_dev_pass \
  --authenticationDatabase admin allumino
```

## Sample Data Available

After seeding, you have:

**Users:**
- `demo@allumino.com` (regular user)
- `admin@allumino.com` (admin user)

**Pathways:**
- Software Engineer
- Chemical Engineer

**Opportunities:**
- Software Engineering Internship
- Chemical Engineering Co-op

## Troubleshooting

### Database won't connect

```bash
# Stop and restart databases
docker-compose down
docker-compose up -d postgres mongodb

# Wait 10 seconds, then retry
npm run dev
```

### Port 3001 already in use

```bash
# Find and kill process
lsof -ti:3001 | xargs kill -9
```

### Auth0 callback fails

- Double-check callback URL in Auth0 dashboard matches exactly
- Verify `.env` has correct Auth0 credentials
- Make sure `AUTH0_CALLBACK_URL` includes `/api/auth/callback`

## Commands Reference

```bash
# Development
npm run dev              # Start dev server with hot reload
npm test                # Run tests
npm run lint            # Check code quality

# Database
npm run prisma:studio   # Open Prisma Studio GUI
npm run db:seed         # Re-seed database
npm run prisma:migrate  # Create new migration

# Production
npm start               # Start production server
docker-compose up       # Full stack (databases + backend)
```

## API Testing Examples

**Get Public Pathways (no auth needed):**
```bash
curl http://localhost:3001/api/public/pathways
```

**Get My Profile (requires auth):**
```bash
curl http://localhost:3001/api/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Create Pathway (requires auth):**
```bash
curl -X POST http://localhost:3001/api/pathways \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Data Scientist",
    "description": "Path to becoming a data scientist",
    "metadata": {"tags": ["data", "science", "AI"]}
  }'
```

## Need Help?

- Check the full [README.md](./README.md)
- Review [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- Open an issue on GitHub

---

Happy coding! 🚀
