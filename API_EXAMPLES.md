# API Usage Examples

Comprehensive examples for all Allumino API endpoints.

## Authentication

### 1. Login Flow

**Step 1: Initiate Login**

```bash
curl -L http://localhost:3001/api/auth/login
```

This redirects to Auth0. Complete the login in your browser.

**Step 2: Exchange Code for Token**

After Auth0 redirects back to `/api/auth/callback?code=...`, the backend automatically:
1. Exchanges code for tokens
2. Creates/updates user in database
3. Returns JWT token

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "displayName": "John Doe",
    "avatarUrl": "https://...",
    "roles": ["user"]
  }
}
```

**Step 3: Use Token**

Include the token in all subsequent requests:

```bash
curl http://localhost:3001/api/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 2. Logout

```bash
curl -X POST http://localhost:3001/api/auth/logout
```

**Response:**
```json
{
  "logoutUrl": "https://your-tenant.auth0.com/v2/logout?..."
}
```

Redirect user to this URL to complete logout.

---

## User Endpoints

### Get Current User Profile

```bash
curl http://localhost:3001/api/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "id": "uuid",
  "auth0Id": "auth0|123",
  "email": "user@example.com",
  "displayName": "John Doe",
  "avatarUrl": "https://...",
  "roles": ["user"],
  "metadata": {},
  "createdAt": "2025-01-15T10:00:00Z",
  "updatedAt": "2025-01-15T10:00:00Z",
  "profile": {
    "userId": "uuid",
    "preferences": {},
    "customFields": {}
  }
}
```

### Update User Profile

```bash
curl -X PUT http://localhost:3001/api/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "preferences": {
      "theme": "dark",
      "notifications": true,
      "language": "en"
    },
    "customFields": {
      "bio": "Software Engineer passionate about education",
      "linkedIn": "https://linkedin.com/in/johndoe"
    }
  }'
```

**Response:**
```json
{
  "userId": "uuid",
  "preferences": {
    "theme": "dark",
    "notifications": true,
    "language": "en"
  },
  "customFields": {
    "bio": "Software Engineer passionate about education",
    "linkedIn": "https://linkedin.com/in/johndoe"
  },
  "updatedAt": "2025-01-15T11:00:00Z"
}
```

---

## Pathways

### List User's Pathways

```bash
curl "http://localhost:3001/api/pathways?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid-1",
      "userId": "user-uuid",
      "title": "Software Engineer",
      "description": "Complete pathway to software engineering",
      "metadata": {
        "tags": ["software", "engineering"],
        "duration": "2-4 years"
      },
      "createdAt": "2025-01-15T10:00:00Z",
      "updatedAt": "2025-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### Create Pathway

```bash
curl -X POST http://localhost:3001/api/pathways \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Chemical Engineer",
    "description": "Pathway to becoming a chemical engineer with focus on sustainability",
    "metadata": {
      "tags": ["chemistry", "engineering", "sustainability"],
      "difficulty": "advanced",
      "duration": "4-5 years",
      "prerequisites": ["High school chemistry", "Calculus"]
    }
  }'
```

**Response (201):**
```json
{
  "id": "new-uuid",
  "userId": "user-uuid",
  "title": "Chemical Engineer",
  "description": "Pathway to becoming a chemical engineer with focus on sustainability",
  "metadata": {
    "tags": ["chemistry", "engineering", "sustainability"],
    "difficulty": "advanced",
    "duration": "4-5 years",
    "prerequisites": ["High school chemistry", "Calculus"]
  },
  "createdAt": "2025-01-15T12:00:00Z",
  "updatedAt": "2025-01-15T12:00:00Z"
}
```

### Get Pathway by ID

```bash
curl http://localhost:3001/api/pathways/uuid-here \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "id": "uuid",
  "userId": "user-uuid",
  "title": "Chemical Engineer",
  "description": "Pathway to becoming a chemical engineer",
  "metadata": {...},
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "displayName": "John Doe"
  },
  "contents": [
    {
      "_id": "mongo-id",
      "title": "Introduction to Chemistry",
      "body": "...",
      "tags": ["chemistry", "basics"]
    }
  ],
  "createdAt": "2025-01-15T10:00:00Z",
  "updatedAt": "2025-01-15T10:00:00Z"
}
```

### Update Pathway

```bash
curl -X PUT http://localhost:3001/api/pathways/uuid-here \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Chemical Engineer Path",
    "description": "Updated description with new content"
  }'
```

### Delete Pathway

```bash
curl -X DELETE http://localhost:3001/api/pathways/uuid-here \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (204 No Content)**

### List Public Pathways (No Auth)

```bash
curl "http://localhost:3001/api/public/pathways?page=1&limit=20&search=engineer"
```

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Software Engineer",
    "description": "...",
    "createdAt": "2025-01-15T10:00:00Z"
  },
  {
    "id": "uuid",
    "title": "Chemical Engineer",
    "description": "...",
    "createdAt": "2025-01-15T11:00:00Z"
  }
]
```

---

## Assessments

### List User's Assessments

```bash
curl "http://localhost:3001/api/assessments?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Assessment

```bash
curl -X POST http://localhost:3001/api/assessments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Chemistry Skills Assessment",
    "type": "skills",
    "pathwayId": "pathway-uuid",
    "score": 85.5,
    "completedAt": "2025-01-15T14:00:00Z",
    "metadata": {
      "totalQuestions": 20,
      "correctAnswers": 17,
      "timeSpent": "45 minutes"
    },
    "rawData": {
      "responses": [
        {
          "questionId": "q1",
          "question": "What is the atomic number of Carbon?",
          "answer": "6",
          "correct": true,
          "timeSpent": 10
        },
        {
          "questionId": "q2",
          "question": "What is H2O?",
          "answer": "Water",
          "correct": true,
          "timeSpent": 5
        }
      ],
      "aiAnalysis": {
        "strengths": ["Basic chemistry", "Molecular structure"],
        "weaknesses": ["Organic chemistry"],
        "recommendations": ["Study carbon compounds"]
      }
    }
  }'
```

**Response (201):**
```json
{
  "id": "assessment-uuid",
  "userId": "user-uuid",
  "pathwayId": "pathway-uuid",
  "title": "Chemistry Skills Assessment",
  "type": "skills",
  "score": "85.50",
  "completedAt": "2025-01-15T14:00:00Z",
  "metadata": {
    "totalQuestions": 20,
    "correctAnswers": 17,
    "timeSpent": "45 minutes"
  },
  "createdAt": "2025-01-15T14:30:00Z"
}
```

### Get Assessment with Results

```bash
curl http://localhost:3001/api/assessments/uuid-here \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "id": "assessment-uuid",
  "userId": "user-uuid",
  "pathwayId": "pathway-uuid",
  "title": "Chemistry Skills Assessment",
  "type": "skills",
  "score": "85.50",
  "completedAt": "2025-01-15T14:00:00Z",
  "metadata": {...},
  "user": {...},
  "pathway": {...},
  "result": {
    "_id": "mongo-id",
    "assessmentId": "assessment-uuid",
    "userId": "user-uuid",
    "rawData": {
      "responses": [...],
      "aiAnalysis": {...}
    },
    "createdAt": "2025-01-15T14:30:00Z"
  },
  "createdAt": "2025-01-15T14:30:00Z"
}
```

---

## Opportunities

### List Opportunities

```bash
curl "http://localhost:3001/api/opportunities?tags=internship,remote&location=San Francisco&search=engineer" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Software Engineering Internship",
      "description": "Summer internship for aspiring engineers",
      "location": "San Francisco, CA",
      "tags": ["internship", "software", "remote"],
      "createdAt": "2025-01-15T10:00:00Z",
      "updatedAt": "2025-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

### Create Opportunity (Admin Only)

```bash
curl -X POST http://localhost:3001/api/opportunities \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Chemical Engineering Co-op",
    "description": "6-month co-op program at leading chemical company",
    "location": "Houston, TX",
    "tags": ["co-op", "chemistry", "full-time"]
  }'
```

**Response (201):**
```json
{
  "id": "new-uuid",
  "title": "Chemical Engineering Co-op",
  "description": "6-month co-op program at leading chemical company",
  "location": "Houston, TX",
  "tags": ["co-op", "chemistry", "full-time"],
  "createdById": "admin-uuid",
  "createdAt": "2025-01-15T15:00:00Z",
  "updatedAt": "2025-01-15T15:00:00Z"
}
```

### Update Opportunity (Admin Only)

```bash
curl -X PUT http://localhost:3001/api/opportunities/uuid-here \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated description with more details"
  }'
```

### Delete Opportunity (Admin Only)

```bash
curl -X DELETE http://localhost:3001/api/opportunities/uuid-here \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

**Response (204 No Content)**

### List Public Opportunities (No Auth)

```bash
curl http://localhost:3001/api/public/opportunities
```

---

## Error Responses

### 400 Bad Request (Validation Error)

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

### 401 Unauthorized

```json
{
  "error": "No authorization token provided"
}
```

### 403 Forbidden

```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found

```json
{
  "error": "Resource not found"
}
```

### 409 Conflict

```json
{
  "error": "Resource already exists"
}
```

### 429 Too Many Requests

```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error"
}
```

---

## Health Check

### Get Service Health

```bash
curl http://localhost:3001/api/health
```

**Response (200 Healthy):**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T16:00:00Z",
  "uptime": 3600,
  "databases": {
    "postgres": true,
    "mongodb": true
  }
}
```

**Response (503 Unhealthy):**
```json
{
  "status": "unhealthy",
  "timestamp": "2025-01-15T16:00:00Z",
  "uptime": 3600,
  "databases": {
    "postgres": false,
    "mongodb": true
  }
}
```

---

## Pagination & Filtering

All list endpoints support:

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

Example:

```bash
curl "http://localhost:3001/api/pathways?page=2&limit=10"
```

Specific filters:
- **Opportunities**: `tags`, `location`, `search`
- **Pathways**: `search` (public only)

---

## Advanced Usage

### Curl with Auth Token in Variable

```bash
# Save token
TOKEN="your-jwt-token-here"

# Use in requests
curl http://localhost:3001/api/me \
  -H "Authorization: Bearer $TOKEN"
```

### Using jq for JSON Parsing

```bash
# Get just the user ID
curl -s http://localhost:3001/api/me \
  -H "Authorization: Bearer $TOKEN" \
  | jq -r '.id'

# Get all pathway titles
curl -s "http://localhost:3001/api/pathways" \
  -H "Authorization: Bearer $TOKEN" \
  | jq -r '.data[].title'
```

---

For more examples, import the Postman collection: `postman_collection.json`
