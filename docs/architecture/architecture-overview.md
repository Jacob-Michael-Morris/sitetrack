# SiteTrack Architecture Overview

## Purpose

This document describes the implemented architecture of SiteTrack, including the major application layers, components, interfaces, technologies, repository structure, and deployment model.

SiteTrack is a web-based construction tool and maintenance management system designed to provide centralized tracking of tools, jobsites, assignments, inspections, damage reports, maintenance activities, users, role permissions, alerts, reports, and audit history.

---

# 1. Architecture Style

SiteTrack uses a client-server architecture and applies Model-View-Controller (MVC) principles.

The system separates:

- User interface responsibilities
- HTTP request handling
- Authentication and authorization
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
|      React Web Client       |
|            View             |
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
| Services / Domain Logic     |
|            Model            |
+-----------------------------+
              |
     Parameterized SQL
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
- Displaying validation and error messages
- Presenting operational status
- Presenting reports
- Displaying alerts
- Displaying audit history where authorized

The frontend is organized primarily by functional domain under:

```text
client/src/
```

Major frontend areas include:

```text
client/src/
|-- administration/
|-- alerts/
|-- audit/
|-- inspection-maintenance/
|-- jobsite-tool-operations/
|-- session-navigation/
`-- shared/
```

---

## 2.2 Controller

Controller responsibilities are implemented through Express routes and controllers.

Routes:

- Define REST endpoints
- Require authentication
- Require specific permissions where appropriate
- Direct requests to the correct controller

Controllers:

- Receive HTTP requests
- Read request parameters and bodies
- Call application services
- Return HTTP and JSON responses
- Translate application errors into safe API responses

The typical request flow is:

```text
Client Request
      |
      v
Express Route
      |
      v
Authentication
      |
      v
Permission Check
      |
      v
Controller
      |
      v
Service / Domain Logic
```

Backend code is organized by business domain rather than placing all routes or controllers into one global folder.

---

## 2.3 Model

The Model contains SiteTrack's business logic, validation, workflow rules, and data operations.

It is implemented through:

- Domain-specific services
- Domain models
- Validation rules
- Workflow rules
- Database queries
- Transactional application logic

Major domain areas include:

- Tools
- Jobsites
- Assignments
- Inspections
- Damage Reports
- Maintenance Work Orders
- Return-to-Service Decisions
- Users
- Roles
- Permissions
- Alerts
- Audit Logs
- Reports

PostgreSQL provides persistent storage for these functions.

---

# 3. Major Functional Areas

SiteTrack is organized around two primary business subsystems and several shared services.

## 3.1 Jobsite and Tool Operations

The Jobsite and Tool Operations area manages the operational use of tools across jobsites.

Responsibilities include:

- Tool registration
- Tool editing
- Tool status
- Tool availability
- Jobsite registration
- Jobsite editing
- Jobsite status
- Tool checkout
- Tool return
- Tool transfer
- Current assignments
- Movement history

Application and database rules prevent invalid conditions such as:

- Multiple active assignments for one tool
- Checkout of blocked or unavailable tools
- Assignment to inactive jobsites
- Duplicate active assignment activity

Frontend code is located primarily under:

```text
client/src/jobsite-tool-operations/
```

Backend code is located primarily under:

```text
server/src/jobsite-tool-operations/
```

---

## 3.2 Inspection and Maintenance Management

The Inspection and Maintenance Management area manages tool condition, inspections, damage, repair, and return-to-service activity.

Responsibilities include:

- Recording inspections
- Tracking next inspection dates
- Validating inspection dates
- Blocking tools after failed inspections
- Recording damage reports
- Blocking damaged tools
- Creating maintenance work orders
- Assigning Maintenance Technicians
- Completing repair work
- Requesting return-to-service review
- Approving or denying return-to-service requests
- Preserving return-to-service decision history

A completed repair does not automatically return a tool to service.

The tool remains blocked until the required approval workflow is completed.

The application also prevents the user who completed a repair from approving that same repair for return to service.

Frontend code is located primarily under:

```text
client/src/inspection-maintenance/
```

Backend code is located primarily under:

```text
server/src/inspection-maintenance/
```

---

# 4. Shared Services

## 4.1 Authentication and Role-Based Access Control

SiteTrack uses authentication and Role-Based Access Control to control access to system functions.

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

Authorization is enforced by backend middleware.

SiteTrack also uses database-backed permissions rather than relying only on hard-coded role names.

The authorization relationship is:

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

Examples of permissions include:

```text
tools.view
tools.create
assignments.checkout
inspections.create
maintenance.complete
maintenance.return_approve
audit.view
users.edit
roles.manage
```

Frontend navigation and controls can also adjust according to the current user's permissions, but backend permission enforcement remains authoritative.

Authentication and RBAC code is located primarily under:

```text
server/src/authentication-rbac/
```

and:

```text
client/src/session-navigation/
client/src/administration/
```

---

## 4.2 Alerts

The Alerts component provides operational notifications associated with important events.

Alerts can be generated from events such as:

- Damage reports
- Inspection activity
- Maintenance activity
- Return-to-service activity
- Tool status changes

Alerts are stored in PostgreSQL and displayed through the SiteTrack interface.

Frontend code is located under:

```text
client/src/alerts/
```

Backend code is located under:

```text
server/src/alerts/
```

---

## 4.3 Audit Logging

SiteTrack records important system and user actions in an audit log.

Audit information supports traceability by recording information such as:

- Acting user
- Action
- Entity type
- Entity identifier
- Description
- Timestamp

Audit activity can include:

- Tool changes
- Jobsite activity
- Assignment activity
- Inspections
- Damage reports
- Maintenance actions
- Return-to-service decisions
- Administrative changes
- Role-permission changes

Frontend code is located under:

```text
client/src/audit/
```

Backend code is located under:

```text
server/src/audit/
```

---

## 4.4 Reports

The Reports component provides operational views of SiteTrack data.

Implemented report categories include:

- Tool Inventory
- Current Assignments
- Maintenance History
- Inspection Status
- Damage History

Report access is protected by backend permissions.

Backend reporting code is located under:

```text
server/src/reports/
```

Frontend reporting functions are part of the administration interface.

---

## 4.5 Dashboard

The Dashboard provides summary information for the SiteTrack interface.

Dashboard access requires authentication and the appropriate permission.

Backend dashboard code is located under:

```text
server/src/dashboard/
```

Frontend dashboard functionality is part of:

```text
client/src/administration/
```

---

# 5. Central Data Store

PostgreSQL provides SiteTrack's centralized persistent data store.

The production database is hosted through Neon.

Major stored entities include:

- Roles
- Permissions
- Role Permissions
- Users
- Jobsites
- Tools
- Tool Assignments
- Inspections
- Damage Reports
- Work Orders
- Return-to-Service Decisions
- Alerts
- Audit Logs

Database access is performed by the backend using SQL.

The React frontend never connects directly to PostgreSQL.

Database files are located under:

```text
server/src/database/
```

The primary schema is located at:

```text
server/src/database/schema.sql
```

---

# 6. Minor and Supporting Components

Several supporting components are used within the SiteTrack architecture.

These include:

- Shared TypeScript types
- API service modules
- Authentication context
- Role and permission utilities
- Request utilities
- Error classes
- Validation logic
- Database connection pooling
- Database migration scripts
- Administration scripts
- Responsive navigation components
- Status display components
- CSV/report utilities
- Configuration utilities

These support the main architecture but are not treated as separate top-level business subsystems.

---

# 7. Interfaces

## 7.1 User to Web Client

Protocol:

```text
HTTPS
```

Users access SiteTrack through supported desktop, tablet, or mobile web browsers.

The production frontend is hosted through Render.

---

## 7.2 Web Client to REST API

Protocol and format:

```text
HTTPS
JSON / REST
```

The React frontend sends authenticated API requests to the Node.js/Express backend.

Authentication cookies are included with protected requests.

---

## 7.3 Backend to Database

Interface:

```text
PostgreSQL connection
Parameterized SQL
```

The backend communicates with PostgreSQL through the Node.js PostgreSQL driver.

Database credentials remain in backend configuration and are not exposed to browser clients.

---

# 8. Backend Request Flow

A typical protected SiteTrack request follows this path:

```text
React Client
     |
     v
REST Endpoint
     |
     v
Authentication Middleware
     |
     v
Permission Middleware
     |
     v
Controller
     |
     v
Service / Domain Logic
     |
     v
PostgreSQL
```

Each layer has a distinct responsibility.

Routes define the interface.

Authentication determines who is making the request.

Permission checks determine whether that user is allowed to perform the requested action.

Controllers manage HTTP input and output.

Services and domain logic implement workflow rules.

PostgreSQL stores the resulting data.

---

# 9. Repository Mapping

The implemented architecture maps to the repository as follows:

```text
client/src/
|
|-- administration/
|   Administration, dashboard, reports, users, and roles
|
|-- alerts/
|   Alert presentation and client API access
|
|-- audit/
|   Audit history presentation
|
|-- inspection-maintenance/
|   Inspection, damage, maintenance, and return-to-service UI
|
|-- jobsite-tool-operations/
|   Tool, jobsite, and assignment UI
|
|-- session-navigation/
|   Authentication and application navigation
|
`-- shared/
    Shared frontend types, components, configuration, and utilities
```

```text
server/src/
|
|-- alerts/
|   Alert routes and application logic
|
|-- audit/
|   Audit-log routes and logic
|
|-- authentication-rbac/
|   Authentication, users, roles, permissions, and RBAC
|
|-- dashboard/
|   Dashboard API
|
|-- database/
|   PostgreSQL connection, schema, and database support
|
|-- errors/
|   Application error definitions
|
|-- inspection-maintenance/
|   Inspections, damage reports, maintenance, and return-to-service
|
|-- jobsite-tool-operations/
|   Tools, jobsites, and assignments
|
|-- reports/
|   Reporting endpoints
|
|-- scripts/
|   Database migration and administration scripts
|
`-- server.ts
    Express application entry point
```

---

# 10. Deployment Architecture

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

Production frontend:

```text
https://sitetrack-8nyy.onrender.com
```

Production backend:

```text
https://sitetrack-api.onrender.com
```

API health endpoint:

```text
https://sitetrack-api.onrender.com/api/health
```

---

# 11. Security Architecture

SiteTrack includes security controls across the application layers.

Implemented controls include:

- HTTPS for production browser communication
- JWT authentication
- HTTP-only authentication cookies
- Backend authentication middleware
- Database-backed RBAC permissions
- Server-side permission checks
- Password hashing
- Parameterized SQL
- CORS origin restrictions
- Environment variables for private configuration
- Audit logging
- Separation of duties in return-to-service approval

Authorization is enforced before protected controller and service operations are executed.

The system does not rely solely on hidden frontend controls for access protection.

---

# 12. Data Integrity Architecture

Data integrity is enforced through both PostgreSQL and application logic.

Database controls include:

- Primary keys
- Foreign keys
- Unique user emails
- Unique tool serial numbers
- Unique role names
- Unique permission keys
- Role-permission constraints
- One active assignment per tool
- Return-to-service decision constraints
- Required fields
- Default values

Application controls include:

- Validation
- Authentication
- Permission checks
- Tool-blocking rules
- Assignment rules
- Inspection-date rules
- Duplicate active work-order prevention
- Return-to-service state validation
- Separation of duties

This combination prevents invalid workflows from depending on only one layer of the application.

---

# 13. Architecture Summary

SiteTrack separates presentation, control, business behavior, authorization, and persistent storage so that each area has a clear responsibility.

The React frontend provides the View.

Express routes and controllers provide Controller behavior.

Services and domain-specific application logic provide Model behavior.

PostgreSQL provides centralized persistent storage.

The implementation is organized by functional domain to support modularity and separation of concerns.

The major business areas are Jobsite and Tool Operations and Inspection and Maintenance Management, while authentication/RBAC, alerts, audit logging, dashboard functions, reports, and database services provide shared capabilities.

This structure supports maintainability, security, traceability, responsive access, and future expansion without requiring major changes to the overall SiteTrack architecture.