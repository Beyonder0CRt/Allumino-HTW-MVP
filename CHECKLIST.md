# Allumino Backend - Setup Checklist

Use this checklist to get your backend running smoothly.

## ✅ Initial Setup

### 1. Prerequisites Installation

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Docker Desktop installed and running
- [ ] Git installed (optional, for version control)

### 2. Project Setup

- [ ] Cloned/downloaded project
- [ ] Navigated to project directory
- [ ] Ran `npm install` successfully
- [ ] All dependencies installed without errors

### 3. Auth0 Configuration

- [ ] Created Auth0 account at https://auth0.com
- [ ] Created new Application (Regular Web Application)
- [ ] Created new API (Identifier: `https://api.allumino.com`)
- [ ] Noted Auth0 Domain (e.g., `tenant.auth0.com`)
- [ ] Noted Client ID
- [ ] Noted Client Secret
- [ ] Added Allowed Callback URLs: `http://localhost:3001/api/auth/callback`
- [ ] Added Allowed Logout URLs: `http://localhost:3000`
- [ ] Added Allowed Web Origins: `http://localhost:3000`
- [ ] Enabled Google Social Connection (optional)

### 4. Environment Configuration

- [ ] Copied `.env.example` to `.env`
- [ ] Updated `AUTH0_DOMAIN` in `.env`
- [ ] Updated `AUTH0_CLIENT_ID` in `.env`
- [ ] Updated `AUTH0_CLIENT_SECRET` in `.env`
- [ ] Generated strong `SESSION_SECRET` (32+ characters)
- [ ] Verified database URLs in `.env` (auto-configured for docker-compose)

### 5. Database Setup

- [ ] Started PostgreSQL: `docker-compose up -d postgres`
- [ ] Started MongoDB: `docker-compose up -d mongodb`
- [ ] Verified databases running: `docker-compose ps`
- [ ] Generated Prisma client: `npm run prisma:generate`
- [ ] Ran database migrations: `npm run prisma:migrate`
- [ ] Seeded sample data: `npm run db:seed`

### 6. Start Development Server

- [ ] Started server: `npm run dev`
- [ ] Server running on port 3001
- [ ] No error messages in console
- [ ] PostgreSQL connected successfully
- [ ] MongoDB connected successfully

### 7. Verify Installation

- [ ] Health check works: `curl http://localhost:3001/api/health`
- [ ] Returns `{"status":"healthy",...}`
- [ ] Databases show as `true` in health check
- [ ] Login redirect works: Visit `http://localhost:3001/api/auth/login`

---

## ✅ Testing & Development

### 8. Run Tests

- [ ] Tests pass: `npm test`
- [ ] No failing tests
- [ ] Coverage report generated
- [ ] Health endpoint tests pass
- [ ] Auth endpoint tests pass

### 9. Code Quality

- [ ] Linting passes: `npm run lint`
- [ ] No linting errors
- [ ] Code formatted: `npm run format`
- [ ] ESLint configured correctly

### 10. API Testing

- [ ] Imported Postman collection (`postman_collection.json`)
- [ ] Set `baseUrl` variable to `http://localhost:3001/api`
- [ ] Tested health endpoint in Postman
- [ ] Tested public endpoints
- [ ] Generated JWT token via login flow
- [ ] Tested protected endpoints with token

---

## ✅ Documentation Review

### 11. Read Documentation

- [ ] Read README.md for overview
- [ ] Read QUICKSTART.md for setup
- [ ] Read API_EXAMPLES.md for usage examples
- [ ] Reviewed OpenAPI spec (openapi.yaml)
- [ ] Reviewed Postman collection

---

## ✅ Deployment Preparation

### 12. Railway Deployment (Optional)

- [ ] Created Railway account
- [ ] Created new project
- [ ] Added PostgreSQL database service
- [ ] Added MongoDB database service
- [ ] Connected GitHub repository
- [ ] Configured environment variables
- [ ] Updated Auth0 callback URL for Railway
- [ ] Deployed successfully
- [ ] Health check endpoint accessible

### 13. Vercel Deployment (Optional)

- [ ] Created Vercel account
- [ ] Imported GitHub repository
- [ ] Configured environment variables
- [ ] Set up external PostgreSQL database
- [ ] Set up MongoDB Atlas
- [ ] Ran migrations manually
- [ ] Updated Auth0 callback URL for Vercel
- [ ] Deployed successfully
- [ ] Health check endpoint accessible

---

## ✅ Production Readiness

### 14. Security Checklist

- [ ] `.env` file NOT committed to Git
- [ ] Strong `SESSION_SECRET` generated (32+ chars)
- [ ] Auth0 credentials secured
- [ ] Database passwords strong and unique
- [ ] CORS origins properly configured
- [ ] Rate limiting enabled
- [ ] Helmet security headers active
- [ ] Input validation on all endpoints

### 15. Monitoring & Logging

- [ ] Winston logs writing to `logs/` directory
- [ ] Error logs separated in `logs/error.log`
- [ ] Log rotation configured (if needed)
- [ ] Health check endpoint returns correct status

### 16. Database Management

- [ ] Prisma Studio tested: `npm run prisma:studio`
- [ ] Can view PostgreSQL data
- [ ] Can view MongoDB data via Docker
- [ ] Backup strategy planned (production)

---

## ✅ Advanced Features

### 17. Docker Setup

- [ ] Full stack runs: `docker-compose up`
- [ ] All services healthy
- [ ] Backend accessible at `http://localhost:3001`
- [ ] Can stop services: `docker-compose down`

### 18. CI/CD

- [ ] GitHub Actions workflow file present (`.github/workflows/ci.yml`)
- [ ] Workflow runs on push/PR
- [ ] Tests run in CI
- [ ] Linting runs in CI

---

## ✅ Development Workflow

### 19. Daily Development

- [ ] Start databases: `docker-compose up -d postgres mongodb`
- [ ] Start dev server: `npm run dev`
- [ ] Server restarts on file changes (nodemon)
- [ ] Can view logs in console
- [ ] Can stop server with Ctrl+C

### 20. Common Tasks

- [ ] Know how to create migration: `npm run prisma:migrate`
- [ ] Know how to seed data: `npm run db:seed`
- [ ] Know how to run tests: `npm test`
- [ ] Know how to view database: `npm run prisma:studio`
- [ ] Know how to check logs: `tail -f logs/combined.log`

---

## 🎯 Quick Reference

### Essential Commands

```bash
# Development
npm run dev              # Start dev server
npm test                # Run tests
npm run lint            # Check code quality

# Database
npm run prisma:studio   # GUI for PostgreSQL
npm run db:seed         # Seed sample data
npm run prisma:migrate  # Create migration

# Docker
docker-compose up -d    # Start all services
docker-compose ps       # Check status
docker-compose logs     # View logs
docker-compose down     # Stop all services
```

### Useful URLs

- **API Base**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/api/health
- **Auth Login**: http://localhost:3001/api/auth/login
- **Prisma Studio**: http://localhost:5555

### Environment Variables

Key variables to configure:
- `AUTH0_DOMAIN`
- `AUTH0_CLIENT_ID`
- `AUTH0_CLIENT_SECRET`
- `AUTH0_AUDIENCE`
- `SESSION_SECRET`

---

## 🆘 Troubleshooting

### Common Issues

**Database won't connect:**
```bash
docker-compose restart postgres mongodb
# Wait 10 seconds
npm run dev
```

**Port 3001 in use:**
```bash
lsof -ti:3001 | xargs kill -9
```

**Auth0 callback fails:**
- Check callback URL matches exactly
- Verify Auth0 credentials in `.env`
- Ensure `SESSION_SECRET` is set

**Prisma errors:**
```bash
npm run prisma:generate
npm run prisma:migrate
```

---

## ✨ Success Criteria

You're ready to develop when:

- ✅ Server starts without errors
- ✅ Health check returns `"status":"healthy"`
- ✅ Both databases connected
- ✅ Auth0 login redirects properly
- ✅ Tests pass
- ✅ Postman collection works

---

## 📚 Next Steps

1. **Build Frontend** - Connect to this backend
2. **Add Features** - Extend controllers and services
3. **Write More Tests** - Increase coverage
4. **Deploy to Production** - Use Railway or Vercel
5. **Monitor** - Set up logging and alerts

---

**Happy Coding! 🚀**

Check off each item as you complete it. If you get stuck, refer to the detailed documentation in README.md or QUICKSTART.md.
