# 🎓 Campus Connect

### A Full-Stack College Placement & Management Portal

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge&logo=vercel)](https://campus-connect-olive-one.vercel.app)
[![Backend](https://img.shields.io/badge/backend-Render-46E3B7?style=for-the-badge&logo=render)](https://campus-connect-2egt.onrender.com)
[![Java](https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?style=for-the-badge&logo=spring)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-38BDF8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=for-the-badge&logo=mysql)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](./LICENSE)

> A modern, production-ready placement portal connecting students, recruiters, and college placement officers on a single platform. Built with Spring Boot, React, Tailwind CSS, MySQL, and JWT authentication.

---

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| 🚀 **Frontend (Vercel)** | https://campus-connect-olive-one.vercel.app |
| ⚙️ **Backend API (Render)** | https://campus-connect-2egt.onrender.com |
| 🗄️ **Database (Aiven MySQL)** | Cloud-hosted MySQL 8 |

**Try it:**
1. Register as a **Student** → browse jobs → apply.
2. Register as a **Company** → post jobs → review applicants.
3. Log back in as the student → see your application status.

> ⚠️ Free tier services sleep after inactivity. First request may take 30–60 seconds.

---

## ✨ Features

### 👨‍🎓 Student Module
- ✅ Secure registration with **BCrypt password hashing**
- ✅ **JWT-based authentication** (stateless, token-based)
- ✅ Protected dashboard with role-based access
- ✅ Browse all open job postings
- ✅ View detailed job descriptions
- ✅ **One-click apply** with instant feedback
- ✅ **My Applications** page with real-time status tracking
- ✅ CGPA eligibility auto-validation on application

### 🏢 Company / Recruiter Module
- ✅ Company registration with profile details
- ✅ Separate JWT login flow with `ROLE_COMPANY`
- ✅ **Post new jobs** with title, description, salary, skills, deadline, min CGPA
- ✅ View all posted jobs with status indicators
- ✅ **See all applicants** per job with full candidate details
- ✅ **Shortlist / Select / Reject** applicants with one click
- ✅ Status updates reflect instantly on the student side

### 🔐 Security
- ✅ **JWT (JSON Web Tokens)** with custom `role` claim
- ✅ **Role-Based Access Control** (`ROLE_STUDENT`, `ROLE_COMPANY`)
- ✅ **BCrypt password hashing** (60-character salted hashes)
- ✅ **Global exception handling** with structured JSON errors
- ✅ **CORS** configured for localhost + any Vercel preview
- ✅ **Stateless sessions** — no server-side session storage
- ✅ **DTOs** to prevent password leakage in API responses

### 🎨 UI / UX
- ✅ Modern **Tailwind CSS** design system
- ✅ **Gradient buttons** with hover-lift and colored glow
- ✅ **Frosted-glass navbar** (`backdrop-blur`)
- ✅ **Staggered fade-in animations** on cards
- ✅ **Focus rings** on inputs (indigo glow)
- ✅ **Loading spinners** during async actions
- ✅ **Empty states** with emoji illustrations
- ✅ **Responsive layout** (mobile → desktop)
- ✅ **Status badges** with color coding (APPLIED / SHORTLISTED / SELECTED / REJECTED)
- ✅ **Inline error / success banners** with slide-in animation

### 🚀 Deployment & DevOps
- ✅ **Dockerized backend** with multi-stage build
- ✅ **Continuous deployment** — push to `main` auto-deploys
- ✅ **Profile-based config** for local + prod
- ✅ **Environment variables** for secrets (no hardcoded credentials)
- ✅ **Cloud MySQL** with SSL (`sslMode=REQUIRED`)

---

## 🛠️ Tech Stack

### Backend
| Tech | Purpose |
|------|---------|
| **Java 21** | Language |
| **Spring Boot 3.5** | Application framework |
| **Spring Web** | REST API |
| **Spring Data JPA / Hibernate** | ORM |
| **Spring Security** | Authentication & authorization |
| **JJWT 0.11.5** | JWT generation & validation |
| **MySQL Connector/J** | JDBC driver |
| **Lombok** | Boilerplate reduction |
| **Bean Validation** | Input validation |
| **Maven** | Build tool |

### Frontend
| Tech | Purpose |
|------|---------|
| **React 18** | UI library |
| **Vite** | Build tool + dev server |
| **React Router v6** | Client-side routing |
| **Axios** | HTTP client with interceptors |
| **Tailwind CSS 4** | Utility-first styling |

### Infrastructure
| Tech | Purpose |
|------|---------|
| **Render** | Backend hosting (Docker) |
| **Vercel** | Frontend hosting (CDN) |
| **Aiven** | Managed MySQL |
| **GitHub** | Version control + CI trigger |

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────┐
│                    BROWSER (User)                       │
└──────────────────────┬─────────────────────────────────┘
                       │ HTTPS
                       ▼
┌────────────────────────────────────────────────────────┐
│         VERCEL — React SPA (Vite + Tailwind)            │
│  • Public pages (Login, Register, Jobs)                 │
│  • Protected pages (Dashboard, Applications)            │
│  • Axios interceptor auto-attaches JWT                  │
└──────────────────────┬─────────────────────────────────┘
                       │ JSON over HTTPS
                       ▼
┌────────────────────────────────────────────────────────┐
│         RENDER — Spring Boot (Dockerized)               │
│                                                          │
│   Request Flow:                                          │
│   ┌────────────────┐                                    │
│   │ JwtFilter      │  ← validates token, sets role      │
│   └───────┬────────┘                                    │
│           ▼                                              │
│   ┌────────────────┐                                    │
│   │ Controller     │  ← HTTP layer (thin)               │
│   └───────┬────────┘                                    │
│           ▼                                              │
│   ┌────────────────┐                                    │
│   │ Service        │  ← Business logic + rules          │
│   └───────┬────────┘                                    │
│           ▼                                              │
│   ┌────────────────┐                                    │
│   │ Repository     │  ← Spring Data JPA                 │
│   └───────┬────────┘                                    │
└───────────┼──────────────────────────────────────────────┘
            │ JDBC + SSL
            ▼
┌────────────────────────────────────────────────────────┐
│              AIVEN — MySQL 8 (Managed)                  │
│   Tables: students, companies, job_postings,            │
│           applications                                   │
└────────────────────────────────────────────────────────┘
```

---

## 🔄 Request Lifecycle (Example: Student Applies)

```
1. Student clicks "Apply" in React
2. Axios sends POST /api/applications with:
   Headers: { Authorization: "Bearer <jwt>", Content-Type: "application/json" }
   Body:    { "jobPostingId": 5 }

3. Render receives the request:
   ├── JwtAuthenticationFilter extracts token
   ├── Validates signature and expiry
   ├── Extracts email + role
   ├── Sets SecurityContext: ROLE_STUDENT
   └── Continues

4. Spring Security checks:
   POST /api/applications → requires hasRole("STUDENT") ✅

5. ApplicationController.apply() runs:
   ├── Calls ApplicationService.apply(request, email)
   ├── Service validates:
   │   ├── Job exists & status = OPEN
   │   ├── Deadline not passed
   │   ├── Student CGPA ≥ min CGPA
   │   └── No duplicate application
   ├── Creates Application entity
   ├── Saves to MySQL (via JPA)
   └── Returns ApplicationResponseDTO

6. Response: 201 Created with JSON
7. React updates UI: shows "✓ Applied"
```

---

## 📦 Project Structure

```
campus-connect/
├── src/main/java/com/campusconnect/
│   ├── config/                 # Security, CORS, JWT filter
│   ├── controller/             # REST endpoints
│   ├── dto/                    # Request/Response objects
│   ├── entity/                 # JPA entities
│   ├── exception/              # Global exception handler
│   ├── repository/             # Spring Data JPA
│   ├── service/                # Business logic
│   ├── util/                   # JwtUtil
│   └── CampusConnectApplication.java
├── src/main/resources/
│   └── application.yml
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable UI (Navbar, Input, Button)
│   │   ├── pages/              # Route components
│   │   ├── services/           # api.js (Axios)
│   │   └── index.css           # Tailwind import
│   ├── vercel.json
│   └── vite.config.js
├── Dockerfile
└── pom.xml
```

---

## 🗄️ Database Schema

```sql
students
├── id (PK)
├── name, email (unique), password (hashed)
├── roll_number, branch, cgpa
└── created_at

companies
├── id (PK)
├── name, email (unique), password (hashed)
├── description, website, industry
├── contact_person, contact_phone, location
└── created_at

job_postings
├── id (PK)
├── company_id (FK → companies)
├── job_title, description, location, salary
├── required_skills, min_cgpa, application_deadline
├── status (OPEN / CLOSED)
└── posted_at

applications
├── id (PK)
├── student_id (FK → students)
├── job_posting_id (FK → job_postings)
├── status (APPLIED / SHORTLISTED / SELECTED / REJECTED)
├── applied_at
└── UNIQUE (student_id, job_posting_id)
```

---

## 🚀 Local Setup

### Prerequisites
- Java 21
- Node.js 18+
- MySQL 8
- Maven

### 1. Clone the repository
```bash
git clone https://github.com/Karthikeya-105/Campus_Connect.git
cd Campus_Connect
```

### 2. Backend setup
```bash
# Ensure MySQL is running locally
mysql -u root -p -e "CREATE DATABASE placement_db;"
```

Set your local password (or edit `application.yml`):
```bash
export SPRING_DATASOURCE_PASSWORD=your_local_password
```

Run the backend:
```bash
./mvnw spring-boot:run
```
API will be live at `http://localhost:8080`.

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will be live at `http://localhost:5173`.

Set the API URL in `.env.local`:
```
VITE_API_URL=http://localhost:8080/api
```

---

## 🔐 API Reference

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/students/register` | Public | Register a student |
| POST | `/api/auth/login` | Public | Student login → JWT |
| POST | `/api/companies/register` | Public | Register a company |
| POST | `/api/auth/company/login` | Public | Company login → JWT |

### Jobs
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/jobs` | COMPANY | Create a job posting |
| GET | `/api/jobs/active` | Public | List open jobs |
| GET | `/api/jobs/{id}` | Public | Job details |
| GET | `/api/jobs/company/{companyId}` | COMPANY | Company's own jobs |

### Applications
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/applications` | STUDENT | Apply to a job |
| GET | `/api/applications/me` | STUDENT | My applications |
| GET | `/api/applications/job/{jobId}` | COMPANY | Job's applicants |
| PATCH | `/api/applications/{id}/status` | COMPANY | Update status |

---

## 🧪 Example Requests

### Register a Student
```http
POST /api/students/register
Content-Type: application/json

{
  "name": "Alice Wonderland",
  "email": "alice@college.edu",
  "password": "secret123",
  "rollNumber": "CS2201",
  "branch": "Computer Science",
  "cgpa": 8.9
}
```

### Login as a Company
```http
POST /api/auth/company/login
Content-Type: application/json

{
  "email": "hr@technova.com",
  "password": "tech@123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "companyId": 1,
  "name": "TechNova Pvt Ltd",
  "email": "hr@technova.com"
}
```

### Apply to a Job (Student)
```http
POST /api/applications
Authorization: Bearer <student_jwt>
Content-Type: application/json

{ "jobPostingId": 5 }
```

---

## 🎨 Design Highlights

- **Color palette:** Indigo primary (`#4f46e5`), slate neutrals, semantic red/green for feedback.
- **Typography:** Inter (Google Fonts) — the same font used by Vercel and Linear.
- **Motion:** 200ms transitions, subtle hover-lifts (`translateY(-2px)`), colored glows.
- **Animations:** Fade-in-up on cards, staggered by 50–60ms per item.
- **Focus states:** 4px indigo rings on inputs.
- **Frosted glass:** Navbar with `backdrop-blur-md` and 80% white.

---

## 🗺️ Roadmap

### ✅ Completed
- [x] Student registration + login (JWT)
- [x] Company registration + login (JWT)
- [x] Job posting (company)
- [x] Job browsing (student)
- [x] Job application
- [x] Applicant review with status updates
- [x] Role-based access control
- [x] Global exception handling
- [x] Full production deployment

### 🔜 Planned
- [ ] Resume upload (multipart + cloud storage)
- [ ] Admin / TPO dashboard
- [ ] Analytics with charts (placement rate, top recruiters)
- [ ] Company profile pages (public)
- [ ] Search & filters (location, salary, skills)
- [ ] Toast notifications
- [ ] Dark mode
- [ ] Email notifications on status change
- [ ] Interview scheduling
- [ ] Pagination

---

## 🤝 Contributing

This is a personal major project — feedback and suggestions are welcome.

- Open an issue for bugs or feature requests.
- Fork, create a branch, submit a pull request.

---

## 📄 License

Licensed under the **MIT License**. See [`LICENSE`](./LICENSE) for details.

---

## 👤 Author

**Karthikeya G**
- GitHub: [@Karthikeya-105](https://github.com/Karthikeya-105)
- Project: [Campus_Connect](https://github.com/Karthikeya-105/Campus_Connect)

---

<div align="center">

**⭐ If you found this project useful, give it a star! ⭐**

Built with 💜 using Spring Boot & React

</div>
