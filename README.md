<div align="center">

<img src="https://img.shields.io/badge/SkillBridge-Attendance%20Management-6366f1?style=for-the-badge&logo=graduation-cap&logoColor=white" />

<br/><br/>

[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat-square&logo=render&logoColor=white)](https://skillbridge-backend.onrender.com)
[![Frontend](https://img.shields.io/badge/Frontend-Render-46E3B7?style=flat-square&logo=render&logoColor=white)](https://skillbridge-frontend.onrender.com)
[![Database](https://img.shields.io/badge/Database-Railway%20MySQL-0B0D0E?style=flat-square&logo=railway&logoColor=white)](https://railway.app)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-6DB33F?style=flat-square&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)
[![Java](https://img.shields.io/badge/Java-17-ED8B00?style=flat-square&logo=openjdk&logoColor=white)](https://openjdk.org)

<br/>

> **A production-ready, full-stack attendance management system** with 5 role-based dashboards, real-time session tracking, and a clean Spring Boot + Next.js architecture.

</div>

---

## 🌐 Live URLs

| Service | URL |
|---|---|
| 🖥️ **Frontend** | [skillbridge-frontend.onrender.com](https://skillbridge-frontend.onrender.com) |
| ⚙️ **Backend API** | [skillbridge-backend.onrender.com](https://skillbridge-backend.onrender.com) |
| 🏥 **Health Check** | [/api/health](https://skillbridge-backend.onrender.com/api/health) |
| 📂 **GitHub** | [SkillBridge-Attendance-Management-System](https://github.com/zubair-ahmad-beigh/SkillBridge-Attendance-Management-System) |

---

## ✨ Features

- 🎓 **5 Role-Based Dashboards** — Student, Trainer, Institution, Programme Manager, Monitoring Officer
- 🔐 **RBAC enforced** on every API endpoint via Spring Security + custom `RbacGuard`
- 📅 **Session Management** — Create, list, and manage training sessions per batch
- ✅ **Attendance Tracking** — Mark Present / Late / Absent per session
- 🔗 **Batch Invite System** — Trainers generate invite tokens; students join via token
- 📊 **Analytics Dashboards** — Per-batch, per-institution, and programme-wide summaries
- 👁️ **Read-Only Monitoring** — Monitoring officers see all data without mutation access
- 🐳 **Docker Deployment** — Backend Docker image deployed on Render
- 🛡️ **Secure by Default** — No secrets in source, all credentials via environment variables

---

## 🏗️ Architecture

```
┌──────────────────────────┐    HTTP + X-Dev-Role    ┌───────────────────────────┐
│     Next.js 14 Frontend  │  ◄────────────────────► │   Spring Boot 3.2 Backend │
│        (Render)          │                          │        (Render / Docker)  │
│                          │                          │                           │
│  • 5 Role Dashboards     │                          │  • Spring Security RBAC   │
│  • Axios API Client      │                          │  • Spring Data JPA        │
│  • Dev-Mode Auth         │                          │  • GlobalExceptionHandler │
│  • No hard-coded URLs    │                          │  • HikariCP Connection    │
└──────────────────────────┘                          └───────────────────────────┘
                                                                  │
                                                         JDBC/SSL │
                                                                  ▼
                                                    ┌─────────────────────────┐
                                                    │    Railway MySQL         │
                                                    │  (Cloud-hosted, free)   │
                                                    └─────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | Next.js 14 + TypeScript | App Router, SSR, dynamic pages |
| **Backend** | Spring Boot 3.2 (Java 17) | REST API, RBAC, business logic |
| **ORM** | Spring Data JPA + Hibernate | Type-safe DB operations |
| **Database** | Railway MySQL | Managed cloud MySQL |
| **Connection Pool** | HikariCP | Connection management & health |
| **Containerization** | Docker (multi-stage build) | Backend deployment |
| **Deployment** | Render (frontend + backend) | Free-tier cloud hosting |
| **Build Tool** | Maven 3.9 | Java dependency management |

---

## 👥 Role-Based Access

| Role | Access |
|---|---|
| 🎓 **Student** | View enrolled sessions, mark own attendance, join batches via invite |
| 👨‍🏫 **Trainer** | Create sessions, view attendance per session, generate batch invite links |
| 🏫 **Institution** | Create batches, view batch-level attendance summaries |
| 📊 **Programme Manager** | Cross-institution analytics and per-batch drill-down |
| 👁️ **Monitoring Officer** | Read-only view of all sessions and attendance records |

---

## 📁 Project Structure

```
skillbridge/
├── 📂 frontend/                    # Next.js 14 App Router
│   ├── app/
│   │   ├── page.tsx                # Landing page (role selector)
│   │   ├── layout.tsx              # Root layout
│   │   ├── onboarding/             # User onboarding & role selection
│   │   └── dashboard/
│   │       ├── student/            # Student dashboard
│   │       ├── trainer/            # Trainer dashboard
│   │       ├── institution/        # Institution dashboard
│   │       ├── programme-manager/  # Programme Manager dashboard
│   │       └── monitoring-officer/ # Monitoring Officer dashboard
│   ├── components/
│   │   ├── Sidebar.tsx             # Shared navigation sidebar
│   │   ├── SessionCard.tsx         # Session display component
│   │   ├── AttendanceTable.tsx     # Attendance records table
│   │   └── StatCard.tsx            # Stat metric card
│   ├── lib/
│   │   └── api.ts                  # Typed Axios API client
│   ├── middleware.ts                # Route protection middleware
│   ├── .env.example                # Environment variable template
│   └── Dockerfile                  # (optional) frontend container
│
├── 📂 backend/                     # Spring Boot 3.2
│   ├── src/main/java/com/skillbridge/
│   │   ├── controller/             # REST controllers (Batch, Session, Attendance…)
│   │   ├── service/                # Business logic layer
│   │   ├── repository/             # Spring Data JPA repositories
│   │   ├── entity/                 # JPA entities (User, Batch, Session, Attendance…)
│   │   ├── dto/                    # Request & Response DTOs
│   │   ├── security/               # DevAuthFilter, UserContextFilter, RbacGuard
│   │   ├── exception/              # GlobalExceptionHandler
│   │   └── config/                 # SecurityConfig, CorsConfig
│   ├── src/main/resources/
│   │   ├── application.yml         # Profile-based configuration
│   │   └── schema.sql              # MySQL DDL schema
│   ├── Dockerfile                  # Multi-stage Docker build
│   └── .env.example                # Backend env variable template
│
├── render.yaml                     # Render Blueprint (auto-deploys both services)
├── .gitignore                      # Excludes node_modules, target, .env files
└── README.md
```

---

## 🚀 Local Development Setup

### Prerequisites
- Java 17+, Maven 3.8+
- Node.js 18+, npm
- MySQL (local) or Railway MySQL URL

### Backend

```bash
cd backend

# 1. Create .env from template
cp .env.example .env
# Fill in: DB_PASSWORD, DATABASE_URL, FRONTEND_URL

# 2. Run with dev profile (bypasses JWT auth — uses X-Dev-Role header)
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# ✅ API running at http://localhost:8080
# ✅ Test: curl http://localhost:8080/api/health
```

### Frontend

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Create .env.local from template
cp .env.example .env.local
# Set: NEXT_PUBLIC_API_URL=http://localhost:8080
#      NEXT_PUBLIC_DEV_ROLE=STUDENT

# 3. Start dev server
npm run dev

# ✅ App running at http://localhost:3000
```

---

## ☁️ Deployment

### Option A — Render Blueprint (Recommended, 1-click)

1. Fork/clone this repo to GitHub
2. Go to [dashboard.render.com](https://dashboard.render.com) → **New+** → **Blueprint**
3. Connect the GitHub repo — Render auto-detects `render.yaml`
4. Add the sensitive env vars manually:

| Service | Variable | Value |
|---|---|---|
| Backend | `DATABASE_URL` | Railway MySQL JDBC URL |
| Backend | `DB_USERNAME` | `root` |
| Backend | `DB_PASSWORD` | Your Railway MySQL password |
| Frontend | `NEXT_PUBLIC_API_URL` | `https://skillbridge-backend.onrender.com` |

5. Click **Apply** — both services deploy automatically ✅

---

### Option B — Manual Deployment

**Backend (Render Web Service)**

| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Runtime | `Docker` |
| Instance | Free |

Environment Variables:
```env
SPRING_PROFILES_ACTIVE = dev
PORT                   = 8080
DATABASE_URL           = jdbc:mysql://<host>:<port>/railway?useSSL=true&...
DB_USERNAME            = root
DB_PASSWORD            = <your-password>
FRONTEND_URL           = https://skillbridge-frontend.onrender.com
```

**Frontend (Render Web Service)**

| Setting | Value |
|---|---|
| Root Directory | `frontend` |
| Runtime | `Node` |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |

Environment Variables:
```env
NEXT_PUBLIC_API_URL  = https://skillbridge-backend.onrender.com
NEXT_PUBLIC_DEV_ROLE = STUDENT
NODE_VERSION         = 18
```

---

## 🔑 Environment Variables Reference

### Backend (`backend/.env.example`)

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | Full JDBC MySQL connection URL |
| `DB_USERNAME` | ✅ | Database username |
| `DB_PASSWORD` | ✅ | Database password |
| `PORT` | ✅ | Server port (set 8080 on Render) |
| `SPRING_PROFILES_ACTIVE` | ✅ | `dev` for dev mode, `prod` for Clerk auth |
| `FRONTEND_URL` | ✅ | Frontend URL (for CORS) |
| `CLERK_ISSUER_URI` | ⚡ prod only | Clerk JWKS issuer URI |

### Frontend (`frontend/.env.example`)

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | ✅ | Backend URL (no trailing slash) |
| `NEXT_PUBLIC_DEV_ROLE` | dev only | Role for dev bypass (`STUDENT`, `TRAINER`, etc.) |

---

## 🧪 API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | DB connection health check |
| `POST` | `/api/users/sync` | Public | Create/update user record |
| `GET` | `/api/users/me` | Any role | Get current user info |
| `GET` | `/api/batches` | Any role | List batches (role-filtered) |
| `POST` | `/api/batches` | Institution | Create a batch |
| `POST` | `/api/batches/:id/invite` | Trainer | Generate invite token |
| `POST` | `/api/batches/:id/join` | Student | Join batch via token |
| `GET` | `/api/batches/:id/summary` | Institution+ | Batch attendance summary |
| `GET` | `/api/sessions` | Any role | List sessions (role-filtered) |
| `POST` | `/api/sessions` | Trainer | Create a session |
| `GET` | `/api/attendance/me` | Student | My attendance records |
| `POST` | `/api/attendance/mark` | Student | Mark attendance |
| `GET` | `/api/attendance/session/:id` | Trainer+ | Session attendance list |
| `GET` | `/api/programme/summary` | PM / MO | Programme-wide summary |

---

## 🔒 Security Notes

- All secrets stored in environment variables — ❌ never in source code
- `.env`, `.env.local`, `target/`, `node_modules/` are gitignored
- Dev mode uses `X-Dev-Role` header (only active when `SPRING_PROFILES_ACTIVE=dev`)
- Production profile requires valid Clerk JWT for all protected endpoints
- CORS configured to only allow requests from the configured `FRONTEND_URL`

---

## 📌 Known Limitations

| Area | Limitation |
|---|---|
| **Auth** | Dev mode uses header-based role bypass — switch to `SPRING_PROFILES_ACTIVE=prod` with real Clerk keys for production security |
| **Pagination** | List endpoints return all records — add `Pageable` for large datasets |
| **Real-time** | Attendance updates require page refresh (no WebSocket/SSE) |
| **Webhooks** | User sync is client-side; production should use Clerk webhook with signature verification |


