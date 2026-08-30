# SiteTrack Architecture Overview

## Purpose

This document describes the implemented architecture of SiteTrack, including the major application layers, components, interfaces, technologies, and deployment structure.

SiteTrack is a web-based construction tool and maintenance management system designed to provide centralized tracking of tools, jobsites, assignments, inspections, damage reports, maintenance activities, alerts, users, and audit history.

---

# 1. Architecture Style

SiteTrack uses a three-tier client-server architecture and applies Model-View-Controller (MVC) principles.

The system separates:

- User interface responsibilities
- HTTP request handling
- Business and workflow logic
- Persistent data storage

The high-level architecture is:

```text
+-----------------------------+
|            User             |
+-----------------------------+
              |
            HTTPS
              |
              v
+-----------------------------+
|    React Web Interface      |
|           View              |
+-----------------------------+
              |
         JSON / REST
              |
              v
+-----------------------------+
| Express Routes / Controllers|
|         Controller          |
+-----------------------------+
              |
              v
+-----------------------------+
| Services / Domain Models    |
|           Model             |
+-----------------------------+
              |
             SQL
              |
              v
+-----------------------------+
|     PostgreSQL Database     |
+-----------------------------+
```

---

# 2. Model-View-Controller Structure

## 2.1 View

The View is implemented using React and TypeScript.

Its responsibilities include:

- Displaying SiteTrack information
- Accepting user input
- Providing responsive layouts
- Displaying role-specific navigation
- Calling REST API services
- Displaying status and error messages
- Presenting reports and operational data

Examples of View elements include:

- Dashboard
- Tools
- Jobsites
- Assignments
- Inspections
- Damage Reports
- Maintenance
- Alerts
- Reports
- User Management
- Audit Log

Frontend source code is primarily located under:

```text
client/src/
```

---

## 2.2 Controller

The Controller portion of SiteTrack is primarily implemented through Express routes and controllers.

Routes define REST endpoints and apply authentication and authorization requirements.

Controllers receive HTTP requests, process request data, call the appropriate service operation, and return HTTP responses.

The typical request flow is:

```text
Client Request
      |
      v
Express Route
      |
      v
Authentication / RBAC
      |
      v
Controller
      |
      v
Service
```

Backend route files are located under:

```text
server/src/routes/
```

Controller files are located under:

```text
server/src/controllers/
```

---

## 2.3 Model

The Model contains SiteTrack's business logic, workflow rules, validation, and application data operations.

It is primarily implemented through:

- Services
- Domain models
- Validation rules
- PostgreSQL operations

Service files are located under:

```text
server/src/services/
```

Domain model files are located under:

```text
server/src/models/
```

Major domain areas include:

- Tools
- Jobsites
- Assignments
- Inspections
- Damage Reports
- Work Orders
- Users
- Roles
- Alerts
- Audit Logs

The PostgreSQL database provides persistent storage for application data.

---

# 3. Major Components

## 3.1 Responsive Web Interface

The Responsive Web Interface provides the primary user interaction point for SiteTrack.

Technology:

```text
React 19.2
TypeScript
Vite
CSS
```

Responsibilities include:

- User navigation
- Data entry
- Responsive desktop, tablet, and mobile layouts
- Role-specific interfaces
- REST API communication
- Status and error feedback

---

## 3.2 REST API and Validation Layer

The REST API provides communication between the frontend and backend application logic.

Technology:

```text
Node.js 24 LTS
Express
TypeScript
```

Responsibilities include:

- Receiving JSON/REST requests
- Validating request data
- Applying authentication
- Applying role-based authorization
- Routing requests to controllers
- Returning JSON responses

---

## 3.3 Tool and Jobsite Operations

This component manages the operational use of tools across jobsites.

Responsibilities include:

- Tool registration
- Tool editing
- Jobsite registration
- Jobsite status
- Tool checkout
- Tool return
- Tool transfer
- Current assignments
- Tool availability

Business rules prevent invalid operations such as assigning unavailable tools or assigning tools to inactive jobsites.

---

## 3.4 Inspection and Maintenance Management

This component manages tool condition, inspections, damage, repair, and return-to-service activities.

Responsibilities include:

- Recording inspections
- Tracking next inspection dates
- Blocking tools after failed inspections
- Recording damage reports
- Creating maintenance work orders
- Assigning maintenance technicians
- Completing repair work
- Requesting return-to-service review
- Approving or denying return-to-service requests

Tools remain blocked when required until an authorized return-to-service decision is completed.

---

## 3.5 Authentication and Role-Based Access Control

SiteTrack uses authentication and Role-Based Access Control to control access to application functions.

Authentication uses:

```text
JWT
HTTP-only cookies
```

Supported roles include:

- Administrator
- Equipment Manager
- Maintenance Technician
- Worker
- Safety Personnel

Authorization is enforced on the backend through Express middleware.

Frontend navigation and controls are also adjusted according to the current user's role.

---

## 3.6 Central Data Store

PostgreSQL provides SiteTrack's centralized persistent data store.

The production database is hosted through Neon.

Stored data includes:

- Users
- Roles
- Jobsites
- Tools
- Assignments
- Inspections
- Damage Reports
- Work Orders
- Return-to-Service Decisions
- Alerts
- Audit Logs

Database access is performed through backend services using SQL.

---

## 3.7 Alerts

The Alerts component provides system notifications associated with important operational events.

Alerts can be generated from events such as:

- Maintenance activity
- Damage reports
- Inspection events
- Return-to-service actions

Alerts are stored in PostgreSQL and displayed through the SiteTrack interface according to user access permissions.

---

## 3.8 Audit Logging

SiteTrack records important user and system actions in an audit log.

Audit information supports traceability by recording activity such as:

- User actions
- Tool changes
- Maintenance activity
- Administrative actions
- Return-to-service decisions

Audit records are stored in PostgreSQL.

Authorized users can review audit history through the SiteTrack interface.

---

# 4. Minor Components

Several supporting components are used within the major SiteTrack architecture.

These include:

- API service modules
- Authentication context
- Shared TypeScript types
- Role constants
- Request utilities
- Error handling
- Validation classes
- CSV export utilities
- Database connection pooling
- Database migration scripts
- Responsive navigation components
- Status display components

These components support the major architecture but are not treated as separate top-level subsystems.

---

# 5. Interfaces

## User to Web Interface

Protocol:

```text
HTTPS
```

Users access SiteTrack through supported desktop, tablet, or mobile web browsers.

---

## Web Interface to REST API

Protocol and format:

```text
HTTPS
JSON / REST
```

The React frontend sends API requests to the Node.js/Express backend.

---

## Backend to Database

Interface:

```text
SQL
PostgreSQL connection
```

The backend communicates with the PostgreSQL database through the Node.js PostgreSQL driver.

---

# 6. Deployment Architecture

The production SiteTrack system uses Render and Neon.

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

Production services:

Frontend:

```text
https://sitetrack-8nyy.onrender.com
```

Backend:

```text
https://sitetrack-api.onrender.com
```

API health endpoint:

```text
https://sitetrack-api.onrender.com/api/health
```

---

# 7. Repository Mapping

The architecture maps to the repository as follows:

```text
client/
    View

server/src/routes/
    Request routing

server/src/controllers/
    Controller

server/src/services/
    Application workflows and business operations

server/src/models/
    Domain models and validation

server/src/middleware/
    Authentication and authorization

server/src/database/
    PostgreSQL connection, schema, and migrations

docs/
    System documentation
```

---

# 8. Architecture Summary

SiteTrack separates presentation, control, business logic, and persistent storage so that each part of the system has a clear responsibility.

The React frontend acts as the primary View, Express routes and controllers perform Controller responsibilities, and services and domain models provide Model behavior. PostgreSQL provides persistent centralized storage.

This structure supports modularity, separation of concerns, role-based security, maintainability, and future expansion of SiteTrack without requiring major changes to the overall system architecture.