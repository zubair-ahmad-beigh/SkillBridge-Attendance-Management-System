# SkillBridge — Attendance Management System

[![Frontend](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://skillbridge.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render)](https://skillbridge-api.onrender.com)

## 🌐 Live URLs

| Service | URL |
|---|---|
| Frontend | `https://skillbridge.vercel.app` *(update after deploy)* |
| Backend | `https://skillbridge-api.onrender.com` *(update after deploy)* |
| API Health | `https://skillbridge-api.onrender.com/actuator/health` |

---

## 👥 Test Accounts

After deploying, create accounts through the sign-up flow and select a role on the onboarding screen.

| Role | Email | Password |
|---|---|---|
| Student | student@test.com | Test@1234 |
| Trainer | trainer@test.com | Test@1234 |
| Institution | institution@test.com | Test@1234 |
| Programme Manager | pm@test.com | Test@1234 |
| Monitoring Officer | mo@test.com | Test@1234 |

> **Note:** Accounts must be created via the sign-up flow. After signing up, the onboarding page lets you pick your role.

---

## 🏗 Architecture Decisions

```
┌─────────────────────┐       HTTPS + JWT        ┌──────────────────────┐
│   Next.js Frontend  │  ◄──────────────────────► │  Spring Boot Backend │
│    (Vercel)         │                            │    (Render)          │
│                     │                            │                      │
│  • Clerk Auth       │                            │  • Spring Security   │
│  • 5 Role Dashboards│                            │  • OAuth2 RS (JWT)   │
│  • Axios API client │                            │  • Spring Data JPA   │
└─────────────────────┘                            └──────────────────────┘
          │                                                  │
          │ Clerk JWT                               JDBC/SSL │
          ▼                                                  ▼
  ┌──────────────┐                              ┌────────────────────┐
  │  Clerk Auth  │                              │  Neon PostgreSQL   │
  │  (JWKS URL)  │                              │  (Serverless DB)   │
  └──────────────┘                              └────────────────────┘
```

**Key Decisions:**

1. **Clerk JWT via OAuth2 Resource Server** — Spring Security validates Clerk JWTs using Clerk's JWKS endpoint. No custom JWT parsing needed, benefits from Spring's battle-tested JWT validation.

2. **UserContextFilter** — After JWT validation, this filter looks up the local DB user record and attaches it to the request. RBAC is enforced against the DB role (not a JWT claim), making role changes possible without re-issuing tokens.

3. **Idempotent /users/sync** — Called from the frontend after every Clerk signup/login. Safe to call multiple times; upserts the user record. This decouples Clerk's user management from our database.

4. **Role-scoped queries** — Each dashboard endpoint auto-filters based on the caller's role (e.g., trainers only see their batches; students only see their enrolled sessions).

5. **Neon PostgreSQL** — Serverless Postgres with connection pooling built in. DDL-validate mode means the schema SQL must be run once manually.

---

## 🛠 Tech Stack

| Layer | Tech | Why |
|---|---|---|
| Frontend | Next.js 14 + TypeScript | SSR, App Router, Vercel-native |
| Auth | Clerk | Built-in UI, JWT, webhooks |
| Backend | Spring Boot 3.2 (Java 17) | Production-grade RBAC, Spring Security |
| ORM | Spring Data JPA + Hibernate | Type-safe, validated queries |
| DB | PostgreSQL (Neon) | Serverless, free tier, scalable |
| Deployment | Vercel + Render + Neon | All free-tier compatible |

---

## ✅ What Works

- Full authentication with Clerk (sign-up, login, JWT)
- Role selection during onboarding → stored in PostgreSQL
- 5 role-specific dashboards with full CRUD relevant to each role
- RBAC enforced on every API endpoint (Spring Security + custom RbacGuard)
- Student: view sessions, mark attendance (present/late/absent), join batch via invite
- Trainer: create sessions, generate invite links, view per-session attendance
- Institution: view and create batches, see batch-level attendance summaries
- Programme Manager: cross-institution summary with per-institution drill-down
- Monitoring Officer: read-only view of all sessions and attendance data
- REST API: all 9+ endpoints from the spec
- PostgreSQL schema with all tables, constraints, indexes
- CORS configured for frontend origin

---

## ⚠ What Is Incomplete / Known Limitations

- **Clerk Webhook** — User sync uses a client-side call to `/api/users/sync` instead of a server-side Clerk webhook. This means the sync depends on the frontend calling the endpoint after signup. A production system would use a Clerk webhook with signature verification.
- **Pagination** — List endpoints return all records. Should add `Pageable` support for large datasets.
- **Clerk JWT `clockSkew`** — Deployed Render instances may face token expiry issues under high latency. Adding `clockSkew` tolerance in Spring Security helps.
- **Real-time** — Attendance updates are not real-time (no WebSocket/SSE). Page refresh is required.

---

## 🚀 Setup Instructions

### Backend (Spring Boot)

```bash
# Prerequisites: Java 17, Maven 3.8+

cd backend

# Copy env template
cp .env.example .env
# → Fill in DATABASE_URL, CLERK_ISSUER_URI, FRONTEND_URL

# Run schema in Neon SQL editor (one time):
# Contents of src/main/resources/schema.sql

# Run locally
mvn spring-boot:run
# → API available at http://localhost:8080
```

### Frontend (Next.js)

```bash
cd frontend

# Copy env template
cp .env.local.example .env.local
# → Fill in Clerk keys and NEXT_PUBLIC_API_URL

npm install
npm run dev
# → App available at http://localhost:3000
```

---

## 📦 Deployment Steps

### 1. Neon PostgreSQL
1. Go to [neon.tech](https://neon.tech), create a free project
2. Open the SQL editor, paste & run the contents of `backend/src/main/resources/schema.sql`
3. Copy the connection string

### 2. Backend on Render
1. Push this repo to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Select the `backend/` folder (or use Docker build)
4. Set environment variables:
   - `DATABASE_URL` = Neon JDBC URL (`jdbc:postgresql://...`)
   - `CLERK_ISSUER_URI` = Your Clerk Frontend API URL
   - `FRONTEND_URL` = Your Vercel URL
5. Build command: `mvn clean package -DskipTests`
6. Start command: `java -jar target/*.jar`

### 3. Frontend on Vercel
1. Import GitHub repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Set environment variables:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_API_URL` = Render backend URL

---

## 💡 One Improvement with More Time

**Clerk Webhook with Role Metadata** — I would implement a proper Clerk webhook endpoint on the backend. When a user signs up, Clerk sends a `user.created` event with a signature. The backend would verify the signature, create the user record, and store the role in Clerk's `publicMetadata`. Subsequent JWTs would contain the role in claims, eliminating the extra DB lookup in `UserContextFilter` and making RBAC truly stateless.

---

## 📁 Project Structure

```
skillbridge/
├── frontend/          # Next.js 14 App Router
│   ├── app/           # Pages (landing, sign-in, dashboards)
│   ├── components/    # Sidebar, SessionCard, AttendanceTable, StatCard
│   ├── lib/api.ts     # Typed API client
│   └── middleware.ts  # Clerk route protection
│
├── backend/           # Spring Boot 3.2
│   └── src/main/java/com/skillbridge/
│       ├── controller/   # BatchController, SessionController, etc.
│       ├── service/      # Business logic
│       ├── repository/   # JPA repositories
│       ├── entity/       # JPA entities
│       ├── dto/          # Request/Response DTOs
│       ├── security/     # UserContextFilter, RbacGuard
│       └── config/       # SecurityConfig (CORS, JWT)
│
└── README.md
```
