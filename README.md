# SiteTrack

**SiteTrack** is a responsive web-based jobsite tool and maintenance management system designed for construction companies operating across multiple jobsites.

The system provides a centralized way to manage tools, jobsites, equipment assignments, inspections, damage reports, maintenance work orders, return-to-service decisions, alerts, reports, users, role permissions, service history, and audit records.

SiteTrack uses a React/TypeScript frontend, a Node.js/Express REST API, and PostgreSQL. The deployed application uses Render for the frontend and backend and Neon for PostgreSQL.

---

## Table of Contents

1. [Implemented Features](#implemented-features)
2. [Technologies](#technologies)
3. [Repository Structure](#repository-structure)
4. [System Architecture](#system-architecture)
5. [Development Workflow](#development-workflow)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Security](#security)
9. [Planned Enhancements](#planned-enhancements)
10. [Documentation](#documentation)
11. [Repository](#repository)

---

# Implemented Features

Current SiteTrack functionality includes:

- User authentication and logout
- Role-Based Access Control (RBAC)
- Database-backed configurable role permissions
- User account creation, editing, activation, and deactivation
- Tool registration and editing
- Unique tool serial-number enforcement
- Jobsite management
- Tool checkout
- Tool return
- Tool transfer
- Tool assignment and movement history
- Prevention of multiple active assignments for one tool
- Prevention of checkout for blocked or unavailable tools
- Inspection recording
- Next-inspection date validation
- Failed-inspection tool blocking
- Damage reporting
- Damage-related tool blocking
- Maintenance work-order creation
- Maintenance Technician assignment
- Repair completion
- Return-to-service review requests
- Return-to-service approval and denial
- Separation of duties for return-to-service approval
- Alerts
- Audit logging
- Operational reports
- Responsive desktop and mobile layouts
- Basic accessibility support
- Server-side validation and authorization

---

# Technologies

## Frontend

- **Framework:** React 19.2
- **Language:** TypeScript
- **Build Tool:** Vite 8
- **Routing:** React Router
- **Styling:** CSS
- **Hosting:** Render Static Site

## Backend

- **Runtime:** Node.js
- **Framework:** Express 5
- **Language:** TypeScript
- **API Style:** JSON / REST
- **Authentication:** JWT with HTTP-only cookies
- **Authorization:** RBAC with database-backed permissions
- **Database Driver:** `pg`
- **Hosting:** Render Web Service

## Database

- **Database:** PostgreSQL
- **Hosting:** Neon

## Development and Source Control

- **Editor:** Visual Studio Code
- **Source Control:** Git
- **Repository Hosting:** GitHub

---

# Repository Structure

```text
sitetrack/
|-- client/                         # React / TypeScript frontend
|   |-- src/
|   |   |-- administration/         # Dashboard, reports, users, and roles
|   |   |-- alerts/                 # Alerts interface
|   |   |-- audit/                  # Audit-log interface
|   |   |-- inspection-maintenance/ # Inspections, damage, and maintenance
|   |   |-- jobsite-tool-operations/# Tools, jobsites, and assignments
|   |   |-- session-navigation/     # Authentication and navigation
|   |   `-- shared/                 # Shared frontend components and utilities
|   |
|   `-- package.json
|
|-- server/                         # Node.js / Express backend
|   |-- src/
|   |   |-- alerts/                 # Alert routes and logic
|   |   |-- audit/                  # Audit logging
|   |   |-- authentication-rbac/    # Authentication, users, roles, permissions
|   |   |-- dashboard/              # Dashboard API
|   |   |-- database/               # PostgreSQL schema and database support
|   |   |-- errors/                 # Application errors
|   |   |-- inspection-maintenance/ # Inspection, damage, and maintenance logic
|   |   |-- jobsite-tool-operations/# Tool, jobsite, and assignment logic
|   |   |-- reports/                # Reporting endpoints
|   |   |-- scripts/                # Migration and administration scripts
|   |   `-- server.ts               # Express application entry point
|   |
|   `-- package.json
|
|-- docs/
|   |-- api/
|   |   `-- api-design.md
|   |-- architecture/
|   |   `-- architecture-overview.md
|   |-- database/
|   |   `-- database-overview.md
|   |-- deployment/
|   |   `-- deployment-overview.md
|   `-- testing/
|       `-- punchlist-status.md
|
|-- .gitignore
|-- LICENSE
`-- README.md
```

---

# System Architecture

SiteTrack uses a client-server architecture and applies Model-View-Controller (MVC) principles.

```text
User
 |
HTTPS
 |
React Web Client
(View)
 |
JSON / REST
 |
Express API / Controllers
(Controller)
 |
Services / Domain Logic
(Model)
 |
Parameterized SQL
 |
PostgreSQL
```

The application is organized around two primary business areas.

## Jobsite and Tool Operations

This area manages:

- Tools
- Jobsites
- Checkout
- Return
- Transfer
- Assignments
- Tool availability
- Movement history

## Inspection and Maintenance Management

This area manages:

- Inspections
- Failed-inspection blocking
- Damage reports
- Maintenance work orders
- Repair completion
- Return-to-service requests
- Return-to-service approval and denial

Shared capabilities include:

- Authentication
- Role-Based Access Control
- Configurable permissions
- Alerts
- Audit logging
- Dashboard functions
- Reports
- PostgreSQL persistence

---

# Role-Based Access Control

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
Permissions
```

SiteTrack currently supports:

- Administrator
- Equipment Manager
- Maintenance Technician
- Worker
- Safety Personnel

Examples of permissions include:

```text
dashboard.view
tools.view
tools.create
tools.edit
jobsites.create
jobsites.edit
assignments.view
assignments.checkout
assignments.return
assignments.transfer
inspections.view
inspections.create
damage_reports.view
damage_reports.create
maintenance.view
maintenance.create
maintenance.complete
maintenance.return_request
maintenance.return_approve
alerts.view
reports.view
audit.view
users.view
users.create
users.edit
roles.manage
```

Frontend controls can change based on the current user's permissions, but authorization is also enforced independently by the backend.

---

# Development Workflow

SiteTrack uses separate Git branches to keep development work separated from production.

```text
feature branch
      |
      v
   develop
      |
      v
     main
```

## `develop`

`develop` is the shared development and integration branch.

New functionality and fixes are integrated and verified here before production release.

## `main`

`main` contains the production release.

Production deployment originates from this branch.

## Feature Branches

Feature branches can be created from `develop` for isolated development.

Example:

```text
feature/testing-fixes
```

Typical workflow:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/name-of-work
```

After completing the work:

```bash
git add .
git commit -m "Describe what was changed"
git push -u origin feature/name-of-work
```

After review and verification, changes can be merged into `develop` and later promoted to `main`.

---

# Testing

The final SiteTrack qualification cycle included:

- Client production build
- Client lint
- Server build
- Server TypeScript type-check
- Automated workflow-rule tests
- Authentication testing
- Authorization testing
- User and role administration testing
- Tool-management testing
- Checkout and return testing
- Inspection testing
- Damage-report testing
- Maintenance testing
- Return-to-service testing
- Alert and audit verification
- Responsive layout testing
- Basic accessibility testing
- API performance testing
- Connectivity and data-integrity testing

The automated workflow-rule suite completed:

```text
3 tests
3 passed
0 failed
```

A controlled local performance check executed 20 authenticated requests to:

```text
GET /api/tools
```

Results:

```text
Requests:                  20
Requests under 3 seconds:  20
Percentage under target:   100%
Average response time:     approximately 200.8 ms
Slowest response:          approximately 582.7 ms
```

The project performance target was at least 95 percent of ordinary requests completing within three seconds under the documented test profile.

All formal tests executed during the final qualification cycle passed.

Additional testing information is available in:

```text
docs/testing/punchlist-status.md
```

---

# Development Commands

## Frontend

From the `client` directory:

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

---

## Backend

From the `server` directory:

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

Type-check:

```bash
npm run typecheck
```

Automated tests:

```bash
npm test
```

Production start:

```bash
npm start
```

---

# Database Migrations

SiteTrack includes migration scripts for database features introduced during development.

Return-to-service migration:

```bash
npm run migrate:return-service
```

Role-permissions migration:

```bash
npm run migrate:role-permissions
```

The intended database should be backed up when practical before production migrations are applied.

---

# Deployment

SiteTrack is deployed using separate frontend, backend, and database services.

```text
User
 |
HTTPS
 |
Render Static Site
React Frontend
 |
JSON / REST over HTTPS
 |
Render Web Service
Node.js / Express API
 |
PostgreSQL Connection
 |
Neon PostgreSQL
```

## Frontend

Production application:

```text
https://sitetrack-8nyy.onrender.com
```

## Backend

Production API:

```text
https://sitetrack-api.onrender.com
```

API health endpoint:

```text
https://sitetrack-api.onrender.com/api/health
```

## Database

SiteTrack uses PostgreSQL hosted through Neon.

The browser never connects directly to PostgreSQL. All application data access occurs through the backend API.

---

# Security

Implemented SiteTrack security controls include:

- HTTPS for production browser communication
- JWT authentication
- HTTP-only authentication cookies
- Server-side authentication
- Database-backed RBAC permissions
- Server-side permission checks
- Password hashing
- Protected REST API routes
- Parameterized SQL
- CORS origin restrictions
- Environment variables for sensitive configuration
- Audit logging for important operations
- Separation of duties for return-to-service approval

A user who completes a repair cannot approve the same repair for return to service.

Sensitive server and database configuration is not stored in frontend code.

---

# Planned Enhancements

The current MVP does not claim completion of every capability described in the broader SiteTrack design.

Planned future work includes:

- End-to-end evidence and attachment upload
- Attachment file-type validation
- Attachment file-size enforcement
- Malware or file scanning
- Protected attachment storage and retrieval
- Production rate limiting
- Expanded authentication and security-event logging
- Query monitoring
- Additional denial-of-service protections
- Larger hosted load and stress tests
- Broader browser and device compatibility testing
- Formal WCAG 2.2 Level AA evaluation
- Documented nonproduction backup-restoration testing
- Expanded draft preservation during extended connectivity interruptions

---

# Documentation

Additional technical documentation is available under:

```text
docs/
```

## API

```text
docs/api/api-design.md
```

Describes the implemented REST API, endpoints, authentication, permissions, and response behavior.

## Architecture

```text
docs/architecture/architecture-overview.md
```

Describes SiteTrack's architecture, MVC structure, functional domains, shared services, security model, and repository organization.

## Database

```text
docs/database/database-overview.md
```

Describes PostgreSQL tables, relationships, constraints, RBAC data, and database responsibilities.

## Deployment

```text
docs/deployment/deployment-overview.md
```

Describes the Render and Neon production deployment environment.

## Testing

```text
docs/testing/punchlist-status.md
```

Describes final qualification results and future testing work.

---

# Repository

GitHub repository:

```text
https://github.com/Jacob-Michael-Morris/sitetrack
```