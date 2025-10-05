An AI-powered platform built at Hack the Valley X, designed to uncover hidden STEM talent in students, personalize their learning and career pathways, and connect them to real-world opportunities by adapting to their behavior and regional context. 




# Allumino Backend API

Production-ready backend for the Allumino platform built with Node.js, Express, PostgreSQL, MongoDB, and Auth0.

## 🏗️ Architecture Overview

### Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Databases**:
  - PostgreSQL (via Prisma ORM) - Users, pathways, assessments, opportunities
  - MongoDB (via Mongoose) - Learning content, assessment results, activity logs
- **Authentication**: Auth0 (OAuth 2.0 with JWT)
- **Security**: Helmet, CORS, rate limiting, express-validator
- **Logging**: Winston
- **Testing**: Jest + Supertest
- **Deployment**: Railway (primary), Vercel (serverless)

### Project Structure

```
allumino/
├── src/
│   ├── config/           # Database, Auth0, logger config
│   ├── controllers/      # Request handlers
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic
│   ├── models/          # MongoDB Mongoose models
│   ├── repositories/    # Data access layer
│   ├── middlewares/     # Auth, validation, error handling
│   ├── utils/           # Validators and helpers
│   ├── app.js           # Express app configuration
│   └── server.js        # Server entry point
├── api/                 # Vercel serverless adapter
├── prisma/              # PostgreSQL schema
├── tests/               # Jest test suites
├── migrations/          # Database migrations
├── scripts/             # Utility scripts
├── docker-compose.yml   # Local development stack
├── Dockerfile           # Production container
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for local databases)
- Auth0 account
- Git

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd allumino
npm install
```

### 2. Configure Auth0

#### Create Auth0 Application

1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Create a new application (Regular Web Application)
3. Note your:
   - Domain (e.g., `your-tenant.auth0.com`)
   - Client ID
   - Client Secret

#### Configure Auth0 Settings

**Allowed Callback URLs:**
```
http://localhost:3001/api/auth/callback
```

**Allowed Logout URLs:**
```
http://localhost:3000
```

**Allowed Web Origins:**
```
http://localhost:3000
```

**Allowed Origins (CORS):**
```
http://localhost:3000
```

#### Create Auth0 API

1. Go to APIs → Create API
2. Name: `Allumino API`
3. Identifier: `https://api.allumino.com`
4. Signing Algorithm: RS256

### 3. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your Auth0 credentials:

```env
# Server
NODE_ENV=development
PORT=3001

# Databases (auto-configured by docker-compose)
DATABASE_URL_POSTGRES=postgresql://allumino:allumino_dev_pass@localhost:5432/allumino
MONGODB_URI=mongodb://allumino:allumino_dev_pass@localhost:27017/allumino?authSource=admin

# Auth0
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your_client_id_here
AUTH0_CLIENT_SECRET=your_client_secret_here
AUTH0_AUDIENCE=https://api.allumino.com
AUTH0_CALLBACK_URL=http://localhost:3001/api/auth/callback

# Session
SESSION_SECRET=your_strong_random_secret_min_32_chars

# Frontend
FRONTEND_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000
```

### 4. Start Local Databases

```bash
docker-compose up -d postgres mongodb
```

Verify databases are running:

```bash
docker-compose ps
```

### 5. Run Database Migrations

Generate Prisma client:

```bash
npm run prisma:generate
```

Run migrations:

```bash
npm run prisma:migrate
```

### 6. Start Development Server

```bash
npm run dev
```

Server will start on `http://localhost:3001`

### 7. Test the API

**Health Check:**
```bash
curl http://localhost:3001/api/health
```

**Root Endpoint:**
```bash
curl http://localhost:3001
```

---

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### View Coverage Report

```bash
npm test
# Coverage report in coverage/lcov-report/index.html
```

---

## 📡 API Documentation

### API Endpoints

#### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/` | API info |
| GET | `/api/public/pathways` | List public pathways |
| GET | `/api/public/opportunities` | List public opportunities |

#### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/login` | Redirect to Auth0 login |
| GET | `/api/auth/callback` | Auth0 callback handler |
| POST | `/api/auth/logout` | Logout (returns logout URL) |

#### Protected Endpoints (Require JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/me` | Get current user profile |
| PUT | `/api/me` | Update user profile |
| GET | `/api/pathways` | List user pathways |
| POST | `/api/pathways` | Create pathway |
| GET | `/api/pathways/:id` | Get pathway by ID |
| PUT | `/api/pathways/:id` | Update pathway |
| DELETE | `/api/pathways/:id` | Delete pathway |
| GET | `/api/assessments` | List user assessments |
| POST | `/api/assessments` | Create assessment |
| GET | `/api/assessments/:id` | Get assessment by ID |
| GET | `/api/opportunities` | List opportunities |

#### Admin Only Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/opportunities` | Create opportunity |
| PUT | `/api/opportunities/:id` | Update opportunity |
| DELETE | `/api/opportunities/:id` | Delete opportunity |

### Example Requests

#### Create Pathway

```bash
curl -X POST http://localhost:3001/api/pathways \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Chemical Engineer",
    "description": "Pathway to becoming a chemical engineer",
    "metadata": {
      "tags": ["chemistry", "engineering"]
    }
  }'
```

**Response (201):**
```json
{
  "id": "uuid-here",
  "userId": "user-uuid",
  "title": "Chemical Engineer",
  "description": "Pathway to becoming a chemical engineer",
  "metadata": {
    "tags": ["chemistry", "engineering"]
  },
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-15T10:30:00Z"
}
```

### OpenAPI & Postman

- **OpenAPI Spec**: See `openapi.yaml`
- **Postman Collection**: See `postman_collection.json`

Import the Postman collection:
1. Open Postman
2. Import → Upload Files → Select `postman_collection.json`
3. Set `{{token}}` variable with your JWT token

---

## 🗄️ Database Schema

### PostgreSQL (Prisma)

**Tables:**
- `users` - User profiles and auth mapping
- `pathways` - Learning pathways
- `assessments` - Assessment metadata
- `opportunities` - Opportunity listings
- `sessions` - Session storage (optional)

**Key Relationships:**
- User → Pathways (1:N)
- User → Assessments (1:N)
- Pathway → Assessments (1:N)

### MongoDB (Mongoose)

**Collections:**
- `userprofiles` - Flexible user profile data
- `learningcontents` - Rich learning content
- `assessmentresults` - Raw assessment data
- `activitylogs` - User activity tracking

### Manage Database

**Prisma Studio (GUI):**
```bash
npm run prisma:studio
```

**Create New Migration:**
```bash
npx prisma migrate dev --name description_of_change
```

---

## 🐳 Docker

### Run Full Stack Locally

```bash
docker-compose up
```

This starts:
- PostgreSQL on port 5432
- MongoDB on port 27017
- Backend API on port 3001

### Build Production Image

```bash
docker build -t allumino-backend .
```

### Run Production Container

```bash
docker run -p 3001:3001 \
  -e DATABASE_URL_POSTGRES="postgresql://..." \
  -e MONGODB_URI="mongodb://..." \
  -e AUTH0_DOMAIN="..." \
  allumino-backend
```

---

## 🚢 Deployment

### Railway (Recommended)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

**Quick Steps:**

1. Create Railway project and add PostgreSQL + MongoDB services
2. Add environment variables from `.env.example`
3. Deploy from GitHub
4. Update Auth0 callback URLs

**Environment Variables for Railway:**

All variables from `.env.example` plus:
- `AUTH0_CALLBACK_URL=https://your-app.up.railway.app/api/auth/callback`

### Vercel (Serverless)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

**Note:** Vercel has limitations:
- Cold starts (~1-3s)
- Max execution time: 10s (Hobby), 60s (Pro)
- Requires connection pooling for databases

---

## 🔒 Security

### Implemented Security Measures

- ✅ Helmet.js for secure HTTP headers
- ✅ CORS with whitelist
- ✅ Rate limiting (100 req/15min general, 10 req/15min for auth)
- ✅ JWT token verification
- ✅ Input validation with express-validator
- ✅ Parameterized queries (Prisma/Mongoose)
- ✅ Environment variable secrets
- ✅ HTTPS enforcement in production
- ✅ Secure session cookies (HttpOnly, Secure)

### Security Best Practices

1. **Never commit `.env`** - Use `.env.example` as template
2. **Rotate secrets regularly** - Especially `SESSION_SECRET`
3. **Use strong passwords** - For database credentials
4. **Enable 2FA on Auth0** - For admin accounts
5. **Monitor logs** - Check `logs/` directory regularly

---

## 📊 Logging

Logs are written to:
- `logs/combined.log` - All logs
- `logs/error.log` - Error logs only
- Console (development only)

**Log Levels:**
- `error` - Critical errors
- `warn` - Warnings
- `info` - General information
- `debug` - Debug information

Configure log level via `LOG_LEVEL` environment variable.

---

## 🛠️ Development

### Code Quality

**Lint code:**
```bash
npm run lint
```

**Fix linting issues:**
```bash
npm run lint:fix
```

**Format code:**
```bash
npm run format
```

### Git Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "Add feature"`
3. Run tests: `npm test`
4. Push and create PR: `git push origin feature/your-feature`

---

## 🐛 Troubleshooting

### Database Connection Errors

**Issue:** Cannot connect to PostgreSQL

**Solution:**
```bash
# Check if PostgreSQL is running
docker-compose ps

# Restart PostgreSQL
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

### Auth0 Errors

**Issue:** "Invalid callback URL"

**Solution:**
- Verify callback URL in `.env` matches Auth0 dashboard exactly
- Ensure Auth0 callback includes full path: `/api/auth/callback`

### Port Already in Use

**Issue:** `EADDRINUSE: address already in use :::3001`

**Solution:**
```bash
# Find process using port 3001
lsof -ti:3001

# Kill process
kill -9 $(lsof -ti:3001)
```

---

## 📝 Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment | Yes | `development` |
| `PORT` | Server port | Yes | `3001` |
| `DATABASE_URL_POSTGRES` | PostgreSQL connection string | Yes | `postgresql://user:pass@localhost:5432/db` |
| `MONGODB_URI` | MongoDB connection string | Yes | `mongodb://user:pass@localhost:27017/db` |
| `AUTH0_DOMAIN` | Auth0 tenant domain | Yes | `tenant.auth0.com` |
| `AUTH0_CLIENT_ID` | Auth0 client ID | Yes | `abc123...` |
| `AUTH0_CLIENT_SECRET` | Auth0 client secret | Yes | `secret123...` |
| `AUTH0_AUDIENCE` | Auth0 API identifier | Yes | `https://api.allumino.com` |
| `AUTH0_CALLBACK_URL` | OAuth callback URL | Yes | `http://localhost:3001/api/auth/callback` |
| `SESSION_SECRET` | JWT signing secret (32+ chars) | Yes | `random-secret-min-32-chars` |
| `FRONTEND_URL` | Frontend application URL | Yes | `http://localhost:3000` |
| `CORS_ORIGINS` | Allowed CORS origins (comma-separated) | Yes | `http://localhost:3000` |
| `LOG_LEVEL` | Logging level | No | `info` |

---

## 📚 Additional Resources

- [Auth0 Documentation](https://auth0.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Express Documentation](https://expressjs.com/)
- [Railway Documentation](https://docs.railway.app/)
- [Vercel Documentation](https://vercel.com/docs)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Ensure all tests pass
5. Submit pull request

---

## 📄 License

ISC

---

## 👥 Support

For issues and questions:
- Open a GitHub issue
- Contact the development team

---

## ✅ Deployment Checklist

Before deploying to production:

- [ ] All environment variables configured
- [ ] Auth0 callback URLs updated
- [ ] Database migrations run
- [ ] Tests passing
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] CORS configured correctly
- [ ] Logging configured
- [ ] Health check endpoint working
- [ ] SSL/TLS enabled

---

**Built with ❤️ for Allumino**
