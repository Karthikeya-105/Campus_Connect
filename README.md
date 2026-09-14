# CampusConnect Backend

College Placement & Management Portal built with Java and Spring Boot.

## Current stage

This is the initial project foundation.

### Included
- Java 21
- Spring Boot
- Maven
- Spring Web
- Validation
- DevTools
- JUnit/Spring Boot Test
- Basic package structure
- First `/api/hello` endpoint

## Run

Make sure Java 21 and Maven are installed.

```bash
mvn spring-boot:run
```

Then open:

`http://localhost:8080/api/hello`

Expected response:

```text
CampusConnect Backend is running!
```

## Planned modules

- Authentication & authorization
- Students
- Recruiters
- Companies
- Placement drives
- Eligibility engine
- Applications
- Interviews
- Notifications
- Analytics
- Documents
- Audit logs

## ✨ Current Features

- ✅ Student Registration (BCrypt password hashing)
- ✅ JWT-based Login
- ✅ Protected Dashboard (auth guard)
- ✅ React frontend with Axios interceptor
- ✅ Global Exception Handling
- ✅ CORS configured
