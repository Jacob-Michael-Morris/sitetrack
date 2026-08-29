# SiteTrack

Welcome to the repository for **SiteTrack**, a web-based application designed to improve how construction companies manage tools, equipment assignments, inspections, damage reports, maintenance, alerts, and jobsites.

SiteTrack provides a React frontend and a Node.js/Express REST API backed by a hosted PostgreSQL database. The project is designed to provide a centralized system for tracking equipment availability, condition, location, maintenance status, and service history across multiple construction jobsites. The frontend and backend will most likely be hosted later in the project.

---

## Table of Contents

1. [Technologies](#technologies)
2. [Repository Structure](#repository-structure)
3. [System Architecture](#system-architecture)
4. [Setup Instructions](#setup-instructions)
   - [Prerequisites](#prerequisites)
   - [1. Clone the Repository](#1-clone-the-repository)
   - [2. Install the Backend](#2-install-the-backend)
   - [3. Configure the Backend](#3-configure-the-backend)
   - [4. Start the Backend](#4-start-the-backend)
   - [5. Install the Frontend](#5-install-the-frontend)
   - [6. Start the Frontend](#6-start-the-frontend)
   - [7. Log In](#7-log-in)
5. [Development Workflow](#development-workflow)
   - [Before Making Changes](#before-making-changes)
   - [Save Your Work to GitHub](#save-your-work-to-github)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Security](#security)

---

## Technologies

### Frontend

- **Framework:** React
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** CSS
- **Hosting:** Render

### Backend

- **Runtime:** Node.js
- **Framework:** Express
- **Language:** TypeScript
- **API Style:** REST / JSON
- **Authentication:** JWT with HTTP-only cookies
- **Authorization:** Role-Based Access Control (RBAC)
- **Hosting:** Render

### Database

- **Database:** PostgreSQL
- **Hosting:** Neon


### Development and Source Control

- **Editor:** Visual Studio Code
- **Source Control:** Git
- **Repository Hosting:** GitHub

---

## Repository Structure

```text
sitetrack/
├── client/                         # React / TypeScript frontend
│   └── src/
│       ├── components/             # Reusable interface components
│       ├── context/                # Authentication context
│       ├── pages/                  # Application pages
│       ├── services/               # REST API communication
│       ├── types/                  # TypeScript interfaces and types
│       └── utils/                  # Frontend utility functions
│
├── server/                         # Node.js / Express backend
│   ├── src/
│   │   ├── controllers/            # HTTP request and response handling
│   │   ├── database/               # PostgreSQL connection and schema
│   │   ├── middleware/             # Authentication and RBAC middleware
│   │   ├── models/                 # Object-oriented domain models
│   │   ├── routes/                 # REST API routes
│   │   ├── scripts/                # Database and account setup scripts
│   │   └── services/               # Business logic and database operations
│   │
│   ├── .env.example                # Example environment configuration
│   └── package.json                # Backend dependencies
│
├── docs/                           # Project and API documentation
├── .gitignore                      # Files excluded from Git
└── README.md                       # Project setup and documentation
```

---

## System Architecture

SiteTrack uses an object-oriented architecture with responsibilities divided between routes, controllers, services, and domain models.

The backend generally follows this structure:

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Domain Model
  ↓
PostgreSQL
```

### Routes

Routes define REST API endpoints and connect incoming requests to the appropriate controller.

### Controllers

Controllers handle HTTP requests and responses.

### Services

Services contain application workflows, business operations, and database access.

### Domain Models

SiteTrack uses object-oriented domain classes to encapsulate validation rules, state, and business behavior.

Major domain models include:

- Tool
- Jobsite
- User
- Tool Assignment
- Inspection
- Damage Report
- Work Order
- Alert
- Audit Log

SiteTrack also uses authentication middleware and Role-Based Access Control to limit system functions based on each user's assigned role.

---

# Setup Instructions

These instructions explain how to set up SiteTrack on a new computer.

## Prerequisites

Install the following programs before starting:

1. **Visual Studio Code**
2. **Git**
3. **Node.js**

You do **not** need to install PostgreSQL

SiteTrack uses a hosted PostgreSQL database through **Neon**, so we can both connect to the same development database.

---

## 1. Clone the Repository

Open a terminal and run:

```bash
git clone https://github.com/Jacob-Michael-Morris/sitetrack.git
```

Enter the project folder:

```bash
cd sitetrack
```

---

## 2. Install the Backend

Enter the `server` folder:

```bash
cd server
```

Install the required Node.js packages:

```bash
npm install
```

---

## 3. Configure the Backend

Inside the `server` folder, create a file named:

```text
.env
```

Use the provided file below as a guide:

```text
server/.env.example
```

The required environment-variable values I will provide privately and will **not** be uploaded to GitHub.

The `.env` file contains private information such as:

- Neon database connection information
- JWT secret
- Administrative account configuration
- Development account configuration

Do **not** upload or commit the `.env` file to GitHub!

The `.env` file should be excluded through `.gitignore`.

---

## 4. Start the Backend

From the `server` folder, run:

```bash
npm run dev
```

Leave this terminal open while using SiteTrack.

The SiteTrack REST API normally runs at:

```text
http://localhost:3000
```

You can verify that the API is running by opening:

```text
http://localhost:3000/api/health
```

---

## 5. Install the Frontend

Open a **second terminal**.

Navigate to the SiteTrack project and enter the `client` folder:

```bash
cd sitetrack/client
```

If your terminal is already inside the SiteTrack project folder, simply run:

```bash
cd client
```

Install the frontend packages:

```bash
npm install
```

---

## 6. Start the Frontend

From the `client` folder, run:

```bash
npm run dev
```

Leave this terminal open.

Vite will display the address of the development website.

It will normally be:

```text
http://localhost:5173
```

Open that address in a web browser.

---

## 7. Log In

Use the admin account that I will provide to you.

---

# Development Workflow - Read before making any changes!

SiteTrack uses separate branches to keep the stable version of the application protected.

The general branch structure is:

```text
main
  ↑
develop
  ↑
feature branches
```

### `main`

The stable version of SiteTrack.

Do **not** make normal development changes directly on `main`.

### `develop`

The shared development/integration branch.

Completed feature branches are merged into `develop` before eventually being merged into `main`.

### Feature Branches

Create your own feature branch when making changes.

---

## Before Making Changes

### 1. Switch to `develop`

```bash
git checkout develop
```

### 2. Download the latest changes

```bash
git pull
```

### 3. Create your own feature branch

```bash
git checkout -b feature/name-of-work
```

For example:

```bash
git checkout -b feature/testing-fixes
```

Make your changes only on your feature branch.

---

## Save Your Work to GitHub

When you are finished working, save your changes:

```bash
git add .
```

Commit the changes:

```bash
git commit -m "Describe what was changed"
```

Push the feature branch to GitHub:

```bash
git push -u origin feature/name-of-work
```

Then create a **Pull Request** on GitHub to merge the feature branch into:

```text
develop
```

### Important

If you are unsure about a merge, **do not merge anything directly into `main`**.

The `main` branch should remain the stable version of SiteTrack!

---

# Testing

SiteTrack testing will include the major application workflows and each supported user role.

Testing areas include:

- Authentication
- Role-Based Access Control
- Tool registration and editing
- Jobsite management
- Tool checkout
- Tool return
- Tool transfer
- Inspections
- Damage reports
- Maintenance work orders
- Return-to-service workflow
- Alerts
- Audit logging
- Dashboard information
- Reports
- CSV export
- Invalid input handling
- Unauthorized-access handling

Formal testing documentation and automated testing may be expanded as development continues.

---

# Deployment

SiteTrack currently uses a hosted **Neon PostgreSQL database**.

The development environment currently consists of:

```text
React Frontend
      ↓
Node.js / Express REST API
      ↓
Neon PostgreSQL
```

The React frontend and Node.js/Express backend are deployed together on Render. Render deploys the branch configured for the service after changes are pushed and merged.

Before deploying the return-to-service approval workflow for the first time, run the idempotent database migration from the `server` folder:

```bash
npm run migrate:return-service
```

The migration adds approval-request fields and the protected return-to-service decision history table. It must complete before the updated server starts handling requests.

The hosted application follows this production architecture:

The planned production architecture will be:

```text
Hosted React Frontend
        ↓
Hosted Node.js / Express API
        ↓
Hosted PostgreSQL Database
```

Free or free-tier hosting options will be preferred where possible, while still using technologies that are commonly used in modern web-development environments.

---

# Security

SiteTrack uses several security controls, including:

- JWT authentication
- HTTP-only authentication cookies
- Role-Based Access Control
- Protected REST API routes
- Password hashing
- User activity auditing
- Environment variables for private configuration

There are plans changes in the future such as https-only

## Never Commit Private Information

Never commit any of the following to GitHub:

- Database passwords
- Neon connection strings
- JWT secrets
- Account passwords
- `.env` files

Private configuration belongs in:

```text
server/.env
```

A safe template may be stored in:

```text
server/.env.example
```

The `.env.example` file must contain only placeholder or blank values never add any real credentials.

---

## Repository

GitHub:

```text
https://github.com/Jacob-Michael-Morris/sitetrack
```
