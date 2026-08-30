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

The frontend and backend are deployed separately so that each service can be built, configured, and maintained independently.

---

# 2. Source Repository

SiteTrack source code is stored in GitHub.

Repository:

```text
https://github.com/Jacob-Michael-Morris/sitetrack
```

The primary deployment branch is:

```text
main
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

Completed work is integrated into `develop` before being merged into `main`.

---

# 3. Frontend Deployment

The SiteTrack frontend is deployed as a Render Static Site.

Technology:

```text
React
TypeScript
Vite
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

Render uses the `client` directory as the frontend project root.

The frontend build installs dependencies and creates the Vite production build.

Typical build command:

```bash
npm install && npm run build
```

Publish directory:

```text
dist
```

The production frontend communicates with the SiteTrack REST API using a Vite environment variable.

Example:

```text
VITE_API_BASE_URL=https://sitetrack-api.onrender.com/api
```

---

# 4. Client-Side Routing

SiteTrack uses client-side routing.

Because the frontend is deployed as a static site, Render must direct application routes back to:

```text
/index.html
```

This allows URLs handled by the React application to work correctly when users refresh the page or navigate directly to a route.

The rewrite configuration follows the general pattern:

```text
/*  ->  /index.html
```

---

# 5. Backend Deployment

The SiteTrack REST API is deployed as a Render Web Service.

Technology:

```text
Node.js 24 LTS
Express
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

# 6. Backend Build and Start Configuration

Render uses the `server` directory as the backend project root.

The backend TypeScript source is compiled before the application starts.

Build command:

```bash
npm install --include=dev && npm run build
```

Start command:

```bash
npm start
```

The compiled application is started from the generated `dist` directory.

The Node.js server listens on the port provided by the hosting environment.

The server also binds to:

```text
0.0.0.0
```

so that Render can expose the application publicly.

---

# 7. Environment Configuration

Private production configuration is stored using Render environment variables rather than being included in the GitHub repository.

Backend environment variables include configuration such as:

- PostgreSQL connection information
- JWT secret
- Production environment mode
- Frontend origin
- Application account configuration

The backend uses:

```text
NODE_ENV=production
```

The allowed frontend origin is configured through:

```text
CLIENT_URL
```

This allows the backend CORS configuration to accept authenticated requests from the deployed SiteTrack frontend.

---

# 8. Database Deployment

SiteTrack uses PostgreSQL hosted through Neon.

Database provider:

```text
Neon
```

The backend connects to Neon using the PostgreSQL connection information stored in the backend environment configuration.

The production database stores:

- Roles
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

The database is not directly accessed by the frontend.

All application database operations pass through the SiteTrack backend.

---

# 9. Production Communication

SiteTrack uses HTTPS for production browser communication.

## User to Frontend

```text
HTTPS
```

## Frontend to Backend

```text
HTTPS
JSON / REST
```

## Backend to Database

```text
PostgreSQL connection
SQL
```

This architecture prevents the browser from directly accessing PostgreSQL or database credentials.

---

# 10. Authentication in Production

SiteTrack uses JWT authentication with HTTP-only cookies.

The deployed frontend sends authenticated requests to the deployed backend using browser credentials.

Production authentication requires coordination between:

- Frontend origin
- Backend CORS configuration
- Cookie security settings
- HTTPS

The authentication cookie is protected from direct JavaScript access by using the HTTP-only setting.

Role-Based Access Control is enforced by backend middleware after authentication.

---

# 11. Deployment Process

SiteTrack is configured so production deployments originate from the `main` branch.

The normal deployment process is:

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
Merge develop into main
        |
        v
Push main to GitHub
        |
        v
Render Deployment
```

The frontend Static Site and backend Web Service are configured to deploy from the production branch.

When automatic deployment does not begin as expected, Render also supports manually deploying the latest commit.

---

# 12. Deployment Verification

After a production deployment, the backend can be checked using:

```text
https://sitetrack-api.onrender.com/api/health
```

A successful response confirms that the SiteTrack API is running.

The frontend can be checked at:

```text
https://sitetrack-8nyy.onrender.com
```

Production verification should also confirm that the frontend and backend are running the same intended release.

Important workflows can then be checked through the deployed application.

---

# 13. Current Hosting Services

SiteTrack currently uses:

| Service | Provider | Purpose |
|---|---|---|
| Frontend | Render | React Static Site |
| Backend | Render | Node.js / Express Web Service |
| Database | Neon | PostgreSQL |
| Source Control | GitHub | Repository and branch management |

This deployment approach allows SiteTrack to use commonly used web technologies while remaining suitable for a small academic software project.

---

# 14. Deployment Summary

The production SiteTrack environment separates the user interface, application server, and database into independent hosted services.

Render provides the public-facing React frontend and Node.js/Express REST API, while Neon provides centralized PostgreSQL storage.

The production system communicates using HTTPS between the browser and hosted services, while application data is accessed only through the backend API.

This deployment structure keeps presentation, application processing, and persistent storage separated while supporting SiteTrack's MVC-based architecture.