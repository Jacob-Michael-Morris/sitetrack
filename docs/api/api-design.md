# SiteTrack REST API

## Purpose

This document describes the REST API currently implemented by SiteTrack.

The API provides communication between the React frontend and the Node.js/Express backend. Requests and responses use JSON where application data is exchanged.

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

The health endpoint can be used to verify that the SiteTrack backend is running.

---

# 2. Authentication

SiteTrack uses JSON Web Tokens (JWT) stored in HTTP-only cookies.

Most application endpoints require an authenticated SiteTrack user.

Role-Based Access Control (RBAC) is applied to protected operations where specific user roles are required.

Supported roles include:

- Administrator
- Equipment Manager
- Maintenance Technician
- Worker
- Safety Personnel

---

# 3. Authentication Endpoints

Base route:

```text
/api/auth
```

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Authenticate a user and establish a session |
| POST | `/api/auth/logout` | End the current user session |
| GET | `/api/auth/me` | Return the currently authenticated user |

---

# 4. Dashboard

Base route:

```text
/api/dashboard
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard` | Retrieve dashboard information |

The dashboard provides summary information used by the main SiteTrack interface.

---

# 5. Tools

Base route:

```text
/api/tools
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tools` | Retrieve all tools |
| GET | `/api/tools/:id` | Retrieve a specific tool |
| POST | `/api/tools` | Create a new tool |
| PUT | `/api/tools/:id` | Update an existing tool |

## Tool Modification Access

Creating and updating tools is restricted to:

- Administrator
- Equipment Manager

Tool records include information such as:

- Name
- Serial number
- Category
- Status
- Condition
- Purchase date

---

# 6. Jobsites

Base route:

```text
/api/jobsites
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/jobsites` | Retrieve all jobsites |
| GET | `/api/jobsites/:id` | Retrieve a specific jobsite |
| POST | `/api/jobsites` | Create a new jobsite |
| PUT | `/api/jobsites/:id` | Update an existing jobsite |

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

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/assignments` | Retrieve assignment records |
| POST | `/api/assignments/checkout` | Check out a tool |
| POST | `/api/assignments/return` | Return a checked-out tool |
| POST | `/api/assignments/transfer` | Transfer an assigned tool |

Assignment workflows enforce business rules such as:

- A tool cannot have multiple active assignments.
- Unavailable or blocked tools cannot be checked out.
- Tools cannot be assigned to inactive jobsites.
- Duplicate assignment submissions are prevented.

---

# 8. Inspections

Base route:

```text
/api/inspections
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/inspections` | Retrieve all inspection records |
| GET | `/api/inspections/:id` | Retrieve a specific inspection |
| POST | `/api/inspections` | Record a new inspection |

## View Inspection Access

Inspection records can be viewed by:

- Administrator
- Equipment Manager
- Maintenance Technician
- Worker
- Safety Personnel

## Record Inspection Access

New inspections can be recorded by:

- Administrator
- Equipment Manager
- Maintenance Technician
- Worker

Safety Personnel have review-only access.

Inspection processing includes validation of inspection dates and tool condition.

A failed inspection can cause the affected tool to be blocked from normal assignment activity.

---

# 9. Damage Reports

Base route:

```text
/api/damage-reports
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/damage-reports` | Retrieve all damage reports |
| GET | `/api/damage-reports/:id` | Retrieve a specific damage report |
| POST | `/api/damage-reports` | Create a new damage report |

Damage-report processing can:

- Record damage severity and description
- Block the affected tool
- Associate damage with an inspection
- Generate maintenance activity
- Create a repair work order when an active one does not already exist
- Generate alerts and audit records

---

# 10. Work Orders and Maintenance

Base route:

```text
/api/work-orders
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/work-orders` | Retrieve all work orders |
| GET | `/api/work-orders/technicians` | Retrieve available Maintenance Technicians |
| GET | `/api/work-orders/:id` | Retrieve a specific work order |
| POST | `/api/work-orders` | Create a maintenance work order |
| PUT | `/api/work-orders/:id/complete` | Mark repair work as completed |
| PUT | `/api/work-orders/:id/return-request` | Request return-to-service review |
| PUT | `/api/work-orders/:id/return-decision` | Approve or deny return to service |

---

## View Maintenance Access

Work orders and Maintenance Technician information can be viewed by:

- Administrator
- Equipment Manager
- Maintenance Technician
- Safety Personnel

---

## Create Work Order

```http
POST /api/work-orders
```

Allowed roles:

- Administrator
- Equipment Manager

Creates a maintenance work order for a tool.

The system prevents duplicate active work orders where appropriate.

---

## Complete Repair

```http
PUT /api/work-orders/:id/complete
```

Allowed roles:

- Administrator
- Maintenance Technician

Marks repair work as completed.

The system records the user who completed the repair.

Completing the repair does not automatically return the tool to service.

---

## Request Return-to-Service Review

```http
PUT /api/work-orders/:id/return-request
```

Allowed roles:

- Administrator
- Maintenance Technician

Requests review of a completed repair before the tool can be returned to operational service.

A return-to-service request is only valid after repair work has been completed.

---

## Return-to-Service Decision

```http
PUT /api/work-orders/:id/return-decision
```

Allowed roles:

- Administrator
- Equipment Manager

Records an approval or denial decision.

The request body includes information such as:

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

The system prevents the user who completed the repair from approving their own return-to-service request.

Approval allows the tool to be returned to operational service when applicable.

Denial keeps the tool blocked until the required maintenance and review conditions are satisfied.

Return-to-service decisions are recorded in the database and generate appropriate audit and alert information.

---

# 11. Alerts

Base route:

```text
/api/alerts
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/alerts` | Retrieve alerts |
| GET | `/api/alerts/:id` | Retrieve a specific alert |
| PUT | `/api/alerts/read-all` | Mark all alerts as read |
| PUT | `/api/alerts/:id/read` | Mark a specific alert as read |

Alerts provide notifications related to operational and maintenance events.

Examples include:

- Damage reports
- Inspections
- Maintenance actions
- Return-to-service decisions
- Tool status changes

---

# 12. Audit Log

Base route:

```text
/api/audit-logs
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/audit-logs` | Retrieve SiteTrack audit history |

Audit-log access is restricted to:

- Administrator
- Safety Personnel

Audit records provide traceability for important system activity.

Records may include:

- User actions
- Tool changes
- Jobsite changes
- Assignment activity
- Maintenance activity
- Administrative actions
- Return-to-service decisions

---

# 13. Users

Base route:

```text
/api/users
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users` | Retrieve users |
| GET | `/api/users/:id` | Retrieve a specific user |
| POST | `/api/users` | Create a user |
| PUT | `/api/users/:id` | Update a user |

User records contain information such as:

- Name
- Email
- Assigned role
- Account status

Passwords are not stored as plain text.

---

# 14. Roles

Base route:

```text
/api/roles
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/roles` | Retrieve available SiteTrack roles |

SiteTrack currently supports:

- Administrator
- Equipment Manager
- Maintenance Technician
- Worker
- Safety Personnel

---

# 15. Reports

Base route:

```text
/api/reports
```

SiteTrack provides five report endpoints.

---

## Tool Inventory

```http
GET /api/reports/tool-inventory
```

Allowed roles:

- Administrator
- Equipment Manager
- Maintenance Technician
- Safety Personnel

Provides tool inventory and current status information.

---

## Current Assignments

```http
GET /api/reports/current-assignments
```

Allowed roles:

- Administrator
- Equipment Manager

Provides information about active tool assignments.

---

## Maintenance History

```http
GET /api/reports/maintenance-history
```

Allowed roles:

- Administrator
- Equipment Manager
- Maintenance Technician
- Safety Personnel

Provides historical maintenance and work-order information.

---

## Inspection Status

```http
GET /api/reports/inspection-status
```

Allowed roles:

- Administrator
- Equipment Manager
- Maintenance Technician
- Safety Personnel

Provides tool inspection status and inspection information.

---

## Damage History

```http
GET /api/reports/damage-history
```

Allowed roles:

- Administrator
- Equipment Manager
- Maintenance Technician
- Safety Personnel

Provides historical damage-report information.

---

# 16. HTTP Request Format

SiteTrack uses JSON for API request bodies.

Example:

```http
POST /api/damage-reports
Content-Type: application/json
```

Example JSON:

```json
{
  "tool_id": 12,
  "description": "Damaged electrical cord",
  "severity": "High"
}
```

Authentication cookies are included with requests made by the SiteTrack frontend.

---

# 17. HTTP Response Format

Successful API responses generally return JSON.

Example:

```json
{
  "status": "ok"
}
```

Responses that retrieve records may return either a single JSON object or an array of objects.

Application errors may return a JSON message such as:

```json
{
  "message": "Unable to complete the requested operation."
}
```

The frontend displays useful API error messages while avoiding unnecessary exposure of internal server details.

---

# 18. Common HTTP Status Codes

SiteTrack may use standard HTTP status codes including:

| Status | Meaning |
|---|---|
| `200 OK` | Request completed successfully |
| `201 Created` | Resource created successfully |
| `204 No Content` | Request succeeded without a response body |
| `400 Bad Request` | Invalid request or business-rule violation |
| `401 Unauthorized` | Authentication is required |
| `403 Forbidden` | User does not have permission |
| `404 Not Found` | Requested resource was not found |
| `409 Conflict` | Request conflicts with current system state |
| `500 Internal Server Error` | Unexpected server error |

---

# 19. API Architecture

The SiteTrack API follows this general request flow:

```text
React Frontend
      |
      v
REST API Route
      |
      v
Authentication / RBAC Middleware
      |
      v
Controller
      |
      v
Service
      |
      v
Domain Model
      |
      v
PostgreSQL
```

Routes define the HTTP interface.

Controllers manage request and response handling.

Services implement application workflows and database operations.

Domain models provide validation and business behavior.

PostgreSQL provides persistent application storage.

---

# 20. API Summary

The implemented SiteTrack API supports:

- User authentication
- Dashboard information
- Tool management
- Jobsite management
- Tool checkout, return, and transfer
- Inspections
- Damage reporting
- Maintenance work orders
- Maintenance Technician selection
- Repair completion
- Return-to-service review and approval
- Alerts
- Audit history
- User management
- Roles
- Operational reports

The API is designed to keep business rules and authorization checks on the server rather than relying solely on frontend restrictions.