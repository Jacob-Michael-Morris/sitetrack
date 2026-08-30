# SiteTrack

**SiteTrack** is a web-based tool and maintenance management system designed for construction companies operating across multiple jobsites.

The system provides a centralized way to manage tools, equipment assignments, inspections, damage reports, maintenance work orders, alerts, service history, and equipment status.

SiteTrack uses a responsive React frontend, a Node.js/Express REST API, and a PostgreSQL database. The application is deployed using Render for the frontend and backend and Neon for PostgreSQL.

---

## Table of Contents

1. [Technologies](#technologies)
2. [Repository Structure](#repository-structure)
3. [System Architecture](#system-architecture)
4. [Development Workflow](#development-workflow)
5. [Deployment](#deployment)
6. [Security](#security)
7. [Repository](#repository)

---

# Technologies

## Frontend

- **Framework:** React 19.2
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** CSS
- **Hosting:** Render Static Site

## Backend

- **Runtime:** Node.js 24 LTS
- **Framework:** Express
- **Language:** TypeScript
- **API Style:** JSON / REST
- **Authentication:** JWT with HTTP-only cookies
- **Authorization:** Role-Based Access Control (RBAC)
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
|   |   |-- components/             # Reusable interface components
|   |   |-- constants/              # Shared frontend constants
|   |   |-- context/                # Authentication context
|   |   |-- pages/                  # Application pages
|   |   |-- services/               # REST API communication
|   |   |-- types/                  # TypeScript interfaces and types
|   |   `-- utils/                  # Frontend utility functions
|   |
|   `-- package.json                # Frontend dependencies and scripts
|
|-- server/                         # Node.js / Express backend
|   |-- src/
|   |   |-- controllers/            # HTTP request and response handling
|   |   |-- database/               # Database connection, schema, migrations
|   |   |-- errors/                 # Application error classes
|   |   |-- middleware/             # Authentication and RBAC middleware
|   |   |-- models/                 # Domain models and business rules
|   |   |-- routes/                 # REST API routes
|   |   |-- scripts/                # Database and maintenance scripts
|   |   `-- services/               # Business logic and database operations
|   |
|   `-- package.json                # Backend dependencies and scripts
|
|-- docs/                           # Project documentation
|   |-- api/                        # API documentation
|   |-- architecture/               # Architecture documentation
|   |-- database/                   # Database documentation
|   `-- testing/                    # Testing documentation
|
|-- .gitignore                      # Files excluded from Git
`-- README.md                       # Main project documentation
```

---

# System Architecture

SiteTrack uses a three-tier client-server architecture and follows Model-View-Controller (MVC) principles to separate the user interface, request handling, application logic, and persistent data.

```text
User
 |
HTTPS
 |
React Web Interface
(View)
 |
JSON / REST
 |
Express Routes and Controllers
(Controller)
 |
Application Services and Domain Models
(Model)
 |
SQL
 |
PostgreSQL
```

## View

The React frontend serves as the View layer. It provides the responsive user interface, displays application data, accepts user input, and presents functions based on the user's assigned role.

## Controller

Express routes and controllers serve as the Controller layer. They receive REST API requests, enforce authentication and authorization requirements, validate requests, and direct processing to the appropriate application functions.

## Model

Services and domain models make up the Model layer. They contain SiteTrack's application logic, workflow rules, validation behavior, and database operations.

Major SiteTrack functional areas include:

- Tools
- Jobsites
- Tool Assignments
- Inspections
- Damage Reports
- Maintenance Work Orders
- Return-to-Service Approval
- Users and Roles
- Alerts
- Audit Logs
- Reports

PostgreSQL acts as the centralized persistent data store shared by these functions.

SiteTrack also uses authentication middleware and Role-Based Access Control to restrict application functions according to each user's assigned role.

---

# Development Workflow

SiteTrack uses separate Git branches to keep development work separated from the stable production version.

```text
feature branch
      |
      v
   develop
      |
      v
     main
```

## `main`

`main` contains the stable production version of SiteTrack.

Normal development changes should not be made directly on `main`.

## `develop`

`develop` is the shared development and integration branch.

Completed feature branches are merged into `develop` before being merged into `main`.

## Feature Branches

New development work should normally be completed on a feature branch.

Example:

```text
feature/testing-fixes
```

A typical workflow is:

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

The feature branch can then be reviewed and merged into `develop`.

Once the integrated changes are verified, `develop` can be merged into `main` for production deployment.

---

# Deployment

SiteTrack is deployed using separate hosted frontend, backend, and database services.

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

The React frontend is deployed as a **Render Static Site**.

Production application:

```text
https://sitetrack-8nyy.onrender.com
```

## Backend

The Node.js/Express REST API is deployed as a **Render Web Service**.

Production API:

```text
https://sitetrack-api.onrender.com
```

API health endpoint:

```text
https://sitetrack-api.onrender.com/api/health
```

## Database

SiteTrack uses a PostgreSQL database hosted through **Neon**.

The database provides centralized storage for tools, jobsites, users, assignments, inspections, damage reports, maintenance records, alerts, audit history, and other application data.

---

# Security

SiteTrack includes several security controls:

- HTTPS for production communication
- JWT authentication
- HTTP-only authentication cookies
- Role-Based Access Control
- Protected REST API routes
- Password hashing
- Server-side authorization
- User activity auditing
- Environment variables for private configuration

Role-Based Access Control limits system functions according to each user's assigned responsibilities.

SiteTrack currently supports the following user roles:

- Administrator
- Equipment Manager
- Maintenance Technician
- Worker
- Safety Personnel

---

# Repository

GitHub repository:

```text
https://github.com/Jacob-Michael-Morris/sitetrack
```