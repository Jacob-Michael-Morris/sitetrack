# SiteTrack Deployment Overview

## Purpose

This document describes the production deployment configuration used by SiteTrack.

SiteTrack is deployed using separate hosted frontend, backend, and database services. Render hosts the React frontend and Node.js/Express backend, while Neon provides the PostgreSQL database.

---

# 1. Production Architecture

The deployed SiteTrack system uses the following structure:

```text
+-----------------------------+
|            User             |
+-----------------------------+
              |
            HTTPS
              |
              v
+-----------------------------+
|     Render Static Site      |
|       React Frontend        |
+-----------------------------+
              |
       JSON / REST / HTTPS
              |
              v
+-----------------------------+
|     Render Web Service      |
|   Node.js / Express API     |
+-----------------------------+
              |
     PostgreSQL Connection
              |
              v
+-----------------------------+
|      Neon PostgreSQL        |
+-----------------------------+
```

The frontend and backend are deployed separately so each service can be built, configured, and maintained independently.

The browser does not connect directly to PostgreSQL.

---

# 2. Source Repository

SiteTrack source code is stored in GitHub.

Repository:

```text
https://github.com/Jacob-Michael-Morris/sitetrack
```

The production branch is:

```text
main
```

The shared development and integration branch is:

```text
develop
```

The normal development flow is:

```text
feature branch
      |
      v
   develop
      |
      v
     main
      |
      v
Production Deployment
```

Changes are integrated and verified on `develop` before being promoted to `main`.

---

# 3. Frontend Deployment

The SiteTrack frontend is deployed as a Render Static Site.

Technology:

```text
React 19.2
TypeScript
Vite 8
CSS
```

Production URL:

```text
https://sitetrack-8nyy.onrender.com
```

The frontend project is located in:

```text
client/
```

## Build Configuration

The client package provides the production build command:

```bash
npm run build
```

The build performs:

```text
TypeScript compilation
        |
        v
Vite production build
```

The generated production files are placed in:

```text
dist/
```

A typical Render build configuration is:

```bash
npm install && npm run build
```

Publish directory:

```text
dist
```

---

# 4. Frontend Environment Configuration

The React frontend communicates with the SiteTrack API through its configured API base URL.

The production API base is:

```text
https://sitetrack-api.onrender.com/api
```

Environment-specific API configuration prevents production code from depending on a local development address.

Local development uses:

```text
http://localhost:3000/api
```

Production uses:

```text
https://sitetrack-api.onrender.com/api
```

---

# 5. Client-Side Routing

SiteTrack uses client-side routing.

Because the frontend is deployed as a static site, application routes must resolve back to:

```text
/index.html
```

A typical Render rewrite is:

```text
/*  ->  /index.html
```

This allows users to refresh or directly navigate to application routes without receiving a static-site `404` response.

---

# 6. Backend Deployment

The SiteTrack REST API is deployed as a Render Web Service.

Technology:

```text
Node.js
Express 5
TypeScript
```

Production API:

```text
https://sitetrack-api.onrender.com
```

API base route:

```text
https://sitetrack-api.onrender.com/api
```

Health endpoint:

```text
https://sitetrack-api.onrender.com/api/health
```

The backend project is located in:

```text
server/
```

---

# 7. Backend Build and Start Configuration

The server package defines the following production scripts:

```json
{
  "build": "tsc",
  "start": "node dist/server.js",
  "typecheck": "tsc --noEmit"
}
```

A typical Render backend build command is:

```bash
npm install --include=dev && npm run build
```

The production start command is:

```bash
npm start
```

The TypeScript source is compiled into the generated:

```text
dist/
```

directory.

The application listens on the port provided by the hosting environment.

The server binds to:

```text
0.0.0.0
```

so Render can expose the service publicly.

---

# 8. Backend Environment Configuration

Private production configuration is stored in Render environment variables rather than committed to GitHub.

Backend environment configuration includes values such as:

- PostgreSQL connection information
- JWT secret
- Environment mode
- Allowed frontend origin

Production mode uses:

```text
NODE_ENV=production
```

The frontend origin is configured using:

```text
CLIENT_URL
```

The production value should correspond to the deployed SiteTrack frontend:

```text
https://sitetrack-8nyy.onrender.com
```

The backend CORS configuration uses this value to determine which browser origin may send authenticated cross-origin requests.

---

# 9. CORS Configuration

SiteTrack restricts browser access to the configured frontend origin.

The backend CORS configuration enables credentials and accepts requests from:

```text
CLIENT_URL
```

Local development normally uses:

```text
http://localhost:5173
```

Production uses the hosted Render frontend.

This configuration is important because SiteTrack uses authentication cookies with frontend-to-backend requests.

Requests from an unapproved browser origin are rejected by the browser's CORS protections.

---

# 10. Database Deployment

SiteTrack uses PostgreSQL hosted through Neon.

Database provider:

```text
Neon
```

The backend connects to Neon using PostgreSQL connection information stored in backend environment configuration.

The production database stores data including:

- Roles
- Permissions
- Role-permission assignments
- Users
- Jobsites
- Tools
- Tool assignments
- Inspections
- Damage reports
- Work orders
- Return-to-service decisions
- Alerts
- Audit logs

The frontend does not receive database credentials and cannot connect directly to PostgreSQL.

---

# 11. Database Schema and Migrations

The primary database schema is maintained in:

```text
server/src/database/schema.sql
```

The backend also includes migration scripts for changes introduced after the original schema was deployed.

Current migration commands include:

```bash
npm run migrate:return-service
```

and:

```bash
npm run migrate:role-permissions
```

These migrations support features such as:

- Return-to-service workflow data
- Repair-completion traceability
- Return-to-service request tracking
- Return-to-service decision history
- Database-backed permissions
- Role-permission assignments

Database migrations should be run against the intended environment before application code that depends on the new schema is treated as fully deployed.

A database backup should be created before applying production migrations whenever practical.

---

# 12. Production Communication

SiteTrack uses HTTPS for production browser communication.

## User to Frontend

```text
HTTPS
```

## Frontend to Backend

```text
HTTPS
JSON / REST
Authentication Cookie
```

## Backend to Database

```text
PostgreSQL Connection
SQL
```

The browser does not communicate directly with Neon.

All application database access passes through the SiteTrack backend.

---

# 13. Authentication in Production

SiteTrack uses JWT authentication with HTTP-only cookies.

The deployed frontend sends authenticated requests to the deployed backend using browser credentials.

Production authentication depends on coordination between:

- Frontend origin
- Backend CORS configuration
- Cookie security settings
- HTTPS
- JWT configuration

HTTP-only cookies prevent frontend JavaScript from directly reading the authentication token.

After authentication, backend middleware verifies the session and checks the permissions required by protected operations.

---

# 14. Role-Based Authorization in Production

SiteTrack uses database-backed Role-Based Access Control.

The authorization model is:

```text
User
 |
 v
Role
 |
 v
Role Permissions
 |
 v
Permission
```

Protected API routes can require permissions such as:

```text
tools.create
assignments.checkout
inspections.create
maintenance.complete
maintenance.return_approve
audit.view
users.edit
roles.manage
```

Authorization is enforced by the backend and does not depend only on frontend navigation controls.

Authorized administrators can manage role-permission assignments through the application.

---

# 15. Deployment Process

The normal SiteTrack release process is:

```text
Feature Development
        |
        v
Merge into develop
        |
        v
Build and Verify
        |
        v
Run Required Database Migrations
        |
        v
Complete Qualification Checks
        |
        v
Merge develop into main
        |
        v
Push main to GitHub
        |
        v
Render Deployment
        |
        v
Production Verification
```

Before deployment, the project should successfully complete the applicable verification commands.

Frontend:

```bash
npm run build
npm run lint
```

Backend:

```bash
npm run build
npm run typecheck
npm test
```

---

# 16. Production Deployment Verification

After deployment, the backend can be checked using:

```text
https://sitetrack-api.onrender.com/api/health
```

A successful response should indicate that the SiteTrack API is running.

The frontend can be checked at:

```text
https://sitetrack-8nyy.onrender.com
```

Production verification should confirm that:

- The frontend loads successfully.
- The API health check succeeds.
- Login works.
- Authentication cookies are accepted.
- Role permissions are enforced.
- Frontend API requests succeed.
- The intended database schema is active.
- Important workflows operate as expected.
- The frontend and backend correspond to the intended release.

---

# 17. Recommended Production Smoke Test

After deployment, representative workflows should be checked without unnecessarily modifying production data.

Recommended checks include:

1. Authenticate using an active SiteTrack account.
2. Confirm the Dashboard loads.
3. Confirm role-based navigation is correct.
4. View Tools and Jobsites.
5. Confirm protected APIs reject users without the required permission.
6. Confirm Alerts load for an authorized user.
7. Confirm Reports load for an authorized user.
8. Confirm Audit Log access is restricted appropriately.
9. Confirm role-permission information loads for an authorized administrator.
10. Log out and confirm protected pages are no longer accessible.

More invasive workflow tests should use controlled test records when performed against the hosted database.

---

# 18. Current Hosting Services

SiteTrack currently uses:

| Service | Provider | Purpose |
|---|---|---|
| Frontend | Render | React Static Site |
| Backend | Render | Node.js / Express Web Service |
| Database | Neon | PostgreSQL |
| Source Control | GitHub | Repository and branch management |

This deployment approach separates presentation, application processing, and persistent storage while remaining practical for the SiteTrack academic project.

---

# 19. Backup and Recovery

The production database is hosted by Neon.

Database backup and recovery capabilities should be treated as part of production operations.

Before significant schema migrations, a recoverable database state should be maintained when practical.

A formal nonproduction backup-restoration qualification test remains planned future work for SiteTrack.

The current project does not claim that a complete disaster-recovery exercise has been performed.

---

# 20. Deployment Security

Production deployment security controls include:

- HTTPS
- HTTP-only authentication cookies
- JWT authentication
- Backend permission enforcement
- CORS origin restrictions
- Password hashing
- Environment variables for private configuration
- Parameterized SQL
- Separation of browser and database access
- Audit logging for important operations

Additional future production hardening may include:

- Rate limiting
- Expanded security-event logging
- Query monitoring
- Additional denial-of-service protections
- Formal backup-restoration exercises

---

# 21. Deployment Summary

The production SiteTrack environment separates the user interface, application server, and database into independent hosted services.

Render provides:

- React frontend hosting
- Node.js/Express API hosting

Neon provides:

- PostgreSQL database hosting

GitHub provides:

- Source control
- Branch management
- Release source

Production communication uses HTTPS between the browser and hosted services, while database access is restricted to the backend.

This deployment structure supports SiteTrack's MVC-based architecture, backend authorization model, centralized PostgreSQL storage, and continued future development.