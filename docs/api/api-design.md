# SiteTrack REST API

## Purpose

This document describes the REST API currently implemented by SiteTrack.

The API provides communication between the React frontend and the Node.js/Express backend. Requests and responses use JSON where application data is exchanged.

Authentication and authorization are enforced by the backend. Most protected operations require both an authenticated user and the permission associated with the requested function.

---

# 1. Base URLs

## Local Development

```text
http://localhost:3000/api
```

## Production

```text
https://sitetrack-api.onrender.com/api
```

## Health Check

```http
GET /api/health
```

The health endpoint verifies that the SiteTrack backend is running.

Example response:

```json
{
  "status": "ok",
  "message": "SiteTrack API is running"
}
```

---

# 2. Authentication and Authorization

SiteTrack uses JSON Web Tokens (JWT) stored in HTTP-only cookies.

Most application endpoints require an authenticated SiteTrack user.

Backend authorization uses Role-Based Access Control (RBAC) with database-backed permissions.

SiteTrack currently supports the following roles:

- Administrator
- Equipment Manager
- Maintenance Technician
- Worker
- Safety Personnel

Permissions are assigned to roles through the database and can be managed by an authorized administrator.

Examples of permission keys include:

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

Frontend navigation may hide functions that the current user cannot access, but authorization is also enforced independently by the backend.

---

# 3. Authentication Endpoints

Base route:

```text
/api/auth
```

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/login` | Authenticate a user and establish a session | Public |
| POST | `/api/auth/logout` | End the current session | Public |
| GET | `/api/auth/me` | Return the currently authenticated user | Authenticated |

## Login

```http
POST /api/auth/login
```

Successful authentication establishes the SiteTrack session using an HTTP-only authentication cookie.

Inactive users and invalid credentials are rejected.

## Logout

```http
POST /api/auth/logout
```

Logout clears the authentication session.

## Current User

```http
GET /api/auth/me
```

Returns information about the currently authenticated SiteTrack user.

---

# 4. Dashboard

Base route:

```text
/api/dashboard
```

| Method | Endpoint | Description | Required Permission |
|---|---|---|---|
| GET | `/api/dashboard` | Retrieve dashboard information | `dashboard.view` |

The dashboard provides summary information used by the primary SiteTrack interface.

---

# 5. Tools

Base route:

```text
/api/tools
```

| Method | Endpoint | Description | Required Permission |
|---|---|---|---|
| GET | `/api/tools` | Retrieve all tools | `tools.view` |
| GET | `/api/tools/:id` | Retrieve a specific tool | `tools.view` |
| POST | `/api/tools` | Create a new tool | `tools.create` |
| PUT | `/api/tools/:id` | Update an existing tool | `tools.edit` |

Tool records include information such as:

- Name
- Serial number
- Category
- Status
- Condition
- Purchase date

Tool serial numbers must be unique.

Tool status and condition are also affected by SiteTrack assignment, inspection, damage, and maintenance workflows.

---

# 6. Jobsites

Base route:

```text
/api/jobsites
```

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/jobsites` | Retrieve all jobsites | Authenticated |
| GET | `/api/jobsites/:id` | Retrieve a specific jobsite | Authenticated |
| POST | `/api/jobsites` | Create a new jobsite | `jobsites.create` |
| PUT | `/api/jobsites/:id` | Update an existing jobsite | `jobsites.edit` |

Jobsite records include information such as:

- Name
- Location
- Status
- Start date
- End date
- Description

Inactive jobsites cannot be used for new tool assignments.

---

# 7. Tool Assignments

Base route:

```text
/api/assignments
```

| Method | Endpoint | Description | Required Permission |
|---|---|---|---|
| GET | `/api/assignments` | Retrieve assignment records | `assignments.view` |
| POST | `/api/assignments/checkout` | Check out a tool | `assignments.checkout` |
| POST | `/api/assignments/return` | Return a checked-out tool | `assignments.return` |
| POST | `/api/assignments/transfer` | Transfer an assigned tool | `assignments.transfer` |

Assignment workflows enforce business rules including:

- A tool cannot have more than one active assignment.
- Blocked or unavailable tools cannot be checked out.
- Tools cannot be assigned to inactive jobsites.
- Duplicate active assignment submissions are prevented.
- Assignment history is preserved after return.
- Transfers update the current assignment while retaining movement history.

---

# 8. Inspections

Base route:

```text
/api/inspections
```

| Method | Endpoint | Description | Required Permission |
|---|---|---|---|
| GET | `/api/inspections` | Retrieve all inspection records | `inspections.view` |
| GET | `/api/inspections/:id` | Retrieve a specific inspection | `inspections.view` |
| POST | `/api/inspections` | Record a new inspection | `inspections.create` |

Inspection processing includes validation of:

- Tool reference
- Inspection result
- Tool condition
- Inspection dates
- Next inspection date

The next inspection date cannot be in the past.

A failed inspection can remove the affected tool from normal operational availability.

Inspection results are retained in the tool's history.

---

# 9. Damage Reports

Base route:

```text
/api/damage-reports
```

| Method | Endpoint | Description | Required Permission |
|---|---|---|---|
| GET | `/api/damage-reports` | Retrieve all damage reports | `damage_reports.view` |
| GET | `/api/damage-reports/:id` | Retrieve a specific damage report | `damage_reports.view` |
| POST | `/api/damage-reports` | Create a new damage report | `damage_reports.create` |

Damage-report processing can:

- Record damage severity
- Record damage description
- Associate damage with a tool
- Associate damage with an inspection
- Remove the affected tool from service
- Create a maintenance work order when an active one does not already exist
- Generate alerts
- Generate audit records

Damage reports remain part of the permanent equipment history.

---

# 10. Work Orders and Maintenance

Base route:

```text
/api/work-orders
```

| Method | Endpoint | Description | Required Permission |
|---|---|---|---|
| GET | `/api/work-orders` | Retrieve all work orders | `maintenance.view` |
| GET | `/api/work-orders/technicians` | Retrieve available Maintenance Technicians | `maintenance.view` |
| GET | `/api/work-orders/:id` | Retrieve a specific work order | `maintenance.view` |
| POST | `/api/work-orders` | Create a maintenance work order | `maintenance.create` |
| PUT | `/api/work-orders/:id/complete` | Mark repair work as completed | `maintenance.complete` |
| PUT | `/api/work-orders/:id/return-request` | Request return-to-service review | `maintenance.return_request` |
| PUT | `/api/work-orders/:id/return-decision` | Approve or deny return to service | `maintenance.return_approve` |

## Create Work Order

```http
POST /api/work-orders
```

Creates a maintenance work order for a tool.

The system prevents duplicate active work orders where appropriate.

Work orders may originate from damage reports or other maintenance needs.

---

## Complete Repair

```http
PUT /api/work-orders/:id/complete
```

Records completion of repair work.

The system records the user who completed the repair.

Completing a repair does not automatically return the tool to operational service.

The tool remains blocked until the required return-to-service process is completed.

---

## Request Return-to-Service Review

```http
PUT /api/work-orders/:id/return-request
```

Requests review of completed repair work before the tool can return to operational service.

A return-to-service request is only valid after repair completion.

The tool remains blocked while the approval request is pending.

---

## Return-to-Service Decision

```http
PUT /api/work-orders/:id/return-decision
```

Records an approval or denial decision.

Example request:

```json
{
  "decision": "Approved",
  "reason": "Repair verified and tool passed review."
}
```

Valid decisions are:

```text
Approved
Denied
```

The user who completed the repair cannot approve the same repair for return to service.

An approved decision allows the maintenance block to clear when no other blocking condition remains.

A denied decision keeps the tool blocked until the required maintenance and approval conditions are satisfied.

Return-to-service decisions are retained in the database and can generate related alerts and audit records.

---

# 11. Alerts

Base route:

```text
/api/alerts
```

| Method | Endpoint | Description | Required Permission |
|---|---|---|---|
| GET | `/api/alerts` | Retrieve alerts | `alerts.view` |
| GET | `/api/alerts/:id` | Retrieve a specific alert | `alerts.view` |
| PUT | `/api/alerts/read-all` | Mark all alerts as read | `alerts.view` |
| PUT | `/api/alerts/:id/read` | Mark a specific alert as read | `alerts.view` |

Alerts provide notifications related to operational and maintenance events.

Examples include:

- Damage reports
- Inspection events
- Maintenance actions
- Return-to-service actions
- Tool status changes

---

# 12. Audit Log

Base route:

```text
/api/audit-logs
```

| Method | Endpoint | Description | Required Permission |
|---|---|---|---|
| GET | `/api/audit-logs` | Retrieve SiteTrack audit history | `audit.view` |

Audit records provide traceability for important SiteTrack activity.

Records can include information such as:

- Acting user
- Action performed
- Entity type
- Entity identifier
- Description
- Timestamp

Audit activity can include:

- Tool changes
- Jobsite activity
- Assignment activity
- Inspection activity
- Damage reports
- Maintenance activity
- Administrative changes
- Return-to-service decisions
- Role-permission changes

---

# 13. Users

Base route:

```text
/api/users
```

| Method | Endpoint | Description | Required Permission |
|---|---|---|---|
| GET | `/api/users` | Retrieve users | `users.view` |
| GET | `/api/users/:id` | Retrieve a specific user | `users.view` |
| POST | `/api/users` | Create a user | `users.create` |
| PUT | `/api/users/:id` | Update a user | `users.edit` |

User records include information such as:

- Name
- Email
- Assigned role
- Account status

User email addresses must be unique.

User accounts can be activated or deactivated.

Passwords are stored as password hashes and are not returned through normal user API responses.

---

# 14. Roles and Permissions

Base route:

```text
/api/roles
```

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/roles` | Retrieve SiteTrack roles | Authenticated |
| GET | `/api/roles/permissions` | Retrieve all defined permissions | `roles.manage` |
| GET | `/api/roles/:id/permissions` | Retrieve permissions assigned to a role | `roles.manage` |
| PUT | `/api/roles/:id/permissions` | Update permissions assigned to a role | `roles.manage` |

SiteTrack currently defines the following roles:

- Administrator
- Equipment Manager
- Maintenance Technician
- Worker
- Safety Personnel

Role permissions are stored in PostgreSQL using the `permissions` and `role_permissions` tables.

The Administrator role initially receives all defined permissions.

Authorized administrators can view and modify permissions for SiteTrack roles.

Examples of configurable permission categories include:

- Dashboard
- Tools
- Jobsites
- Assignments
- Inspections
- Damage Reports
- Maintenance
- Alerts
- Reports
- Audit Log
- Users
- Roles

Changing a role's permission assignments changes the operations available to users assigned that role.

---

# 15. Reports

Base route:

```text
/api/reports
```

All report endpoints require:

```text
reports.view
```

## Tool Inventory

```http
GET /api/reports/tool-inventory
```

Provides tool inventory and current status information.

---

## Current Assignments

```http
GET /api/reports/current-assignments
```

Provides information about active tool assignments.

---

## Maintenance History

```http
GET /api/reports/maintenance-history
```

Provides historical maintenance and work-order information.

---

## Inspection Status

```http
GET /api/reports/inspection-status
```

Provides tool inspection status and inspection information.

---

## Damage History

```http
GET /api/reports/damage-history
```

Provides historical damage-report information.

---

# 16. Permission Enforcement

Protected SiteTrack endpoints use backend authentication and authorization middleware.

The general request flow is:

```text
Request
   |
   v
Authentication Check
   |
   v
Permission Check
   |
   v
Controller
   |
   v
Application Service
   |
   v
PostgreSQL
```

A request without a valid authenticated session can return:

```text
401 Unauthorized
```

An authenticated user who does not have the required permission can receive:

```text
403 Forbidden
```

This prevents access control from depending only on frontend navigation or hidden buttons.

---

# 17. HTTP Request Format

SiteTrack uses JSON for API request bodies where application data is submitted.

Example:

```http
POST /api/damage-reports
Content-Type: application/json
```

Example request body:

```json
{
  "tool_id": 12,
  "description": "Damaged electrical cord",
  "severity": "High"
}
```

Authenticated browser requests include the SiteTrack authentication cookie.

The React frontend sends requests with browser credentials when authentication is required.

---

# 18. HTTP Response Format

Successful API responses generally return JSON.

Example:

```json
{
  "status": "ok"
}
```

Responses retrieving records may return either:

- A JSON object
- An array of JSON objects

Application errors may return a response such as:

```json
{
  "message": "Unable to complete the requested operation."
}
```

The frontend displays useful API error messages while avoiding unnecessary exposure of internal server information.

---

# 19. Common HTTP Status Codes

SiteTrack uses standard HTTP status codes including:

| Status | Meaning |
|---|---|
| `200 OK` | Request completed successfully |
| `201 Created` | Resource created successfully |
| `204 No Content` | Request succeeded without a response body |
| `400 Bad Request` | Invalid request or business-rule violation |
| `401 Unauthorized` | Authentication is required |
| `403 Forbidden` | User does not have the required permission |
| `404 Not Found` | Requested resource was not found |
| `409 Conflict` | Request conflicts with the current system state |
| `500 Internal Server Error` | Unexpected server error |

Business-rule failures use safe API responses rather than exposing internal server or database details.

---

# 20. API Security

SiteTrack includes several controls around API access.

These include:

- HTTPS in the production environment
- JWT authentication
- HTTP-only authentication cookies
- Backend authentication middleware
- Database-backed role permissions
- Backend permission checks
- Password hashing
- Parameterized SQL
- Environment variables for private configuration
- CORS restrictions
- Audit logging for important operations
- Separation of duties for return-to-service approval

Production CORS behavior limits authenticated browser requests to the configured SiteTrack frontend origin.

---

# 21. API Architecture

The SiteTrack API follows this general request flow:

```text
React Frontend
      |
      v
REST API Route
      |
      v
Authentication / Permission Middleware
      |
      v
Controller
      |
      v
Service / Domain Logic
      |
      v
Parameterized SQL
      |
      v
PostgreSQL
```

Routes define the HTTP interface and required authorization.

Controllers manage request and response handling.

Application services and domain logic implement SiteTrack workflows and validation.

PostgreSQL provides persistent application storage.

---

# 22. Backend Organization

The implemented backend is organized primarily by functional domain.

```text
server/src/
|-- alerts/
|-- audit/
|-- authentication-rbac/
|   |-- authentication/
|   |-- roles/
|   `-- users/
|-- dashboard/
|-- database/
|-- errors/
|-- inspection-maintenance/
|   |-- damage-reports/
|   |-- inspections/
|   `-- maintenance/
|-- jobsite-tool-operations/
|   |-- assignments/
|   |-- jobsites/
|   `-- tools/
|-- reports/
|-- scripts/
`-- server.ts
```

This organization keeps routes, controllers, services, domain models, and supporting logic grouped with the functional area they support.

---

# 23. API Summary

The implemented SiteTrack REST API supports:

- User authentication
- Session management
- Dashboard information
- Tool management
- Jobsite management
- Tool checkout
- Tool return
- Tool transfer
- Assignment history
- Inspections
- Damage reporting
- Maintenance work orders
- Maintenance Technician selection
- Repair completion
- Return-to-service requests
- Return-to-service approval and denial
- Alerts
- Audit history
- User management
- Role management
- Configurable role permissions
- Operational reports

The API is designed so that business rules and authorization are enforced by the backend rather than relying solely on frontend restrictions.