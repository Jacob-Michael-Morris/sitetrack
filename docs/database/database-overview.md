# SiteTrack Database Overview

## Purpose

This document describes the PostgreSQL database used by SiteTrack, including the major tables, relationships, constraints, and data responsibilities.

SiteTrack uses a centralized PostgreSQL database hosted through Neon. The database stores information related to users, roles, jobsites, tools, assignments, inspections, damage reports, maintenance work orders, return-to-service decisions, alerts, and audit history.

---

# 1. Database Technology

SiteTrack uses:

```text
PostgreSQL
```

The production PostgreSQL database is hosted through:

```text
Neon
```

The Node.js/Express backend communicates with PostgreSQL using SQL through the PostgreSQL Node.js driver.

The database schema is maintained in:

```text
server/src/database/schema.sql
```

---

# 2. Database Tables

The SiteTrack database contains the following major tables:

1. `roles`
2. `users`
3. `jobsites`
4. `tools`
5. `tool_assignments`
6. `inspections`
7. `damage_reports`
8. `work_orders`
9. `return_service_decisions`
10. `alerts`
11. `audit_logs`

---

# 3. Roles

The `roles` table defines the user roles supported by SiteTrack.

## Table: `roles`

| Column | Type | Description |
|---|---|---|
| `role_id` | INTEGER | Primary key |
| `name` | VARCHAR(100) | Unique role name |
| `description` | TEXT | Description of the role |

SiteTrack currently defines the following roles:

- Administrator
- Equipment Manager
- Maintenance Technician
- Worker
- Safety Personnel

Each user is assigned one role through the `users.role_id` foreign key.

---

# 4. Users

The `users` table stores SiteTrack user accounts.

## Table: `users`

| Column | Type | Description |
|---|---|---|
| `user_id` | INTEGER | Primary key |
| `role_id` | INTEGER | Foreign key to `roles` |
| `name` | VARCHAR(150) | User's name |
| `email` | VARCHAR(255) | Unique user email |
| `password_hash` | VARCHAR(255) | Hashed password |
| `is_active` | BOOLEAN | Indicates whether the account is active |
| `created_at` | TIMESTAMP | Account creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

## Relationship

```text
roles
  |
  | 1
  |
  | many
  v
users
```

A role can be assigned to multiple users, while each user has one assigned role.

---

# 5. Jobsites

The `jobsites` table stores information about construction jobsites.

## Table: `jobsites`

| Column | Type | Description |
|---|---|---|
| `jobsite_id` | INTEGER | Primary key |
| `name` | VARCHAR(150) | Jobsite name |
| `location` | VARCHAR(255) | Jobsite location |
| `status` | VARCHAR(50) | Jobsite status |
| `start_date` | DATE | Optional start date |
| `end_date` | DATE | Optional end date |
| `description` | TEXT | Additional jobsite information |
| `created_at` | TIMESTAMP | Record creation timestamp |
| `updated_at` | TIMESTAMP | Record update timestamp |

The default jobsite status is:

```text
Active
```

Jobsites are referenced by tool assignments and alerts.

---

# 6. Tools

The `tools` table stores SiteTrack equipment and tool records.

## Table: `tools`

| Column | Type | Description |
|---|---|---|
| `tool_id` | INTEGER | Primary key |
| `name` | VARCHAR(150) | Tool name |
| `serial_number` | VARCHAR(150) | Unique serial number |
| `category` | VARCHAR(100) | Tool category |
| `status` | VARCHAR(50) | Current tool status |
| `condition` | VARCHAR(50) | Current tool condition |
| `purchase_date` | DATE | Optional purchase date |
| `created_at` | TIMESTAMP | Record creation timestamp |
| `updated_at` | TIMESTAMP | Record update timestamp |

The default tool values are:

```text
status: Available
condition: Good
```

Tools are central to most SiteTrack workflows and are referenced by:

- Tool assignments
- Inspections
- Damage reports
- Work orders
- Alerts

---

# 7. Tool Assignments

The `tool_assignments` table records tool checkout, assignment, return, and transfer activity.

## Table: `tool_assignments`

| Column | Type | Description |
|---|---|---|
| `assignment_id` | INTEGER | Primary key |
| `tool_id` | INTEGER | Foreign key to `tools` |
| `jobsite_id` | INTEGER | Foreign key to `jobsites` |
| `assigned_at` | TIMESTAMP | Assignment timestamp |
| `released_at` | TIMESTAMP | Time the assignment ended |
| `status` | VARCHAR(50) | Assignment status |
| `notes` | TEXT | Optional assignment notes |

The default assignment status is:

```text
Checked Out
```

An assignment is considered active while:

```text
released_at IS NULL
```

## Active Assignment Constraint

SiteTrack includes the following unique partial index:

```text
one_active_assignment_per_tool
```

This prevents a tool from having more than one active assignment at the same time.

Conceptually:

```text
Tool
 |
 +---- Active Assignment ---- Jobsite
```

A tool cannot be checked out to multiple active jobsites simultaneously.

---

# 8. Inspections

The `inspections` table records tool inspection results.

## Table: `inspections`

| Column | Type | Description |
|---|---|---|
| `inspection_id` | INTEGER | Primary key |
| `tool_id` | INTEGER | Foreign key to `tools` |
| `inspection_date` | TIMESTAMP | Date and time of inspection |
| `result` | VARCHAR(50) | Inspection result |
| `condition` | VARCHAR(50) | Recorded tool condition |
| `notes` | TEXT | Optional inspection notes |
| `next_inspection_date` | DATE | Scheduled next inspection |

Each inspection belongs to one tool.

```text
tools
  |
  | 1
  |
  | many
  v
inspections
```

Inspection records can also be associated with damage reports.

---

# 9. Damage Reports

The `damage_reports` table records damage identified for SiteTrack tools.

## Table: `damage_reports`

| Column | Type | Description |
|---|---|---|
| `damage_report_id` | INTEGER | Primary key |
| `tool_id` | INTEGER | Foreign key to `tools` |
| `inspection_id` | INTEGER | Optional foreign key to `inspections` |
| `description` | TEXT | Description of the damage |
| `severity` | VARCHAR(50) | Damage severity |
| `status` | VARCHAR(50) | Current report status |
| `reported_at` | TIMESTAMP | Time damage was reported |
| `resolved_at` | TIMESTAMP | Time damage was resolved |
| `notes` | TEXT | Optional notes |

The default damage report status is:

```text
Open
```

A damage report always references a tool and may optionally reference the inspection during which the damage was identified.

Damage reports may also be connected to maintenance work orders.

---

# 10. Work Orders

The `work_orders` table stores maintenance and repair activities.

## Table: `work_orders`

| Column | Type | Description |
|---|---|---|
| `work_order_id` | INTEGER | Primary key |
| `tool_id` | INTEGER | Foreign key to `tools` |
| `damage_report_id` | INTEGER | Optional foreign key to `damage_reports` |
| `description` | TEXT | Description of required work |
| `priority` | VARCHAR(50) | Work-order priority |
| `status` | VARCHAR(50) | Current work-order status |
| `assigned_to` | VARCHAR(150) | Assigned maintenance technician |
| `completed_by` | INTEGER | Foreign key to the user completing the repair |
| `return_requested_by` | INTEGER | Foreign key to the user requesting return-to-service review |
| `return_requested_at` | TIMESTAMP | Time return-to-service review was requested |
| `opened_at` | TIMESTAMP | Work-order creation timestamp |
| `completed_at` | TIMESTAMP | Repair completion timestamp |
| `notes` | TEXT | Optional maintenance notes |

Default values are:

```text
priority: Medium
status: Open
```

Each work order belongs to one tool.

A work order may optionally originate from a damage report.

The `completed_by` and `return_requested_by` fields provide traceability to SiteTrack users involved in the maintenance workflow.

---

# 11. Return-to-Service Decisions

The `return_service_decisions` table records approval and denial decisions made after maintenance has been completed.

## Table: `return_service_decisions`

| Column | Type | Description |
|---|---|---|
| `decision_id` | INTEGER | Primary key |
| `work_order_id` | INTEGER | Foreign key to `work_orders` |
| `approver_user_id` | INTEGER | Foreign key to `users` |
| `decision` | VARCHAR(20) | Approved or Denied |
| `reason` | TEXT | Reason for the decision |
| `block_disposition` | VARCHAR(50) | Resulting tool-blocking disposition |
| `decided_at` | TIMESTAMP | Decision timestamp |

The database restricts `decision` to:

```text
Approved
Denied
```

A work order can have multiple return-to-service decision records over time.

```text
work_orders
     |
     | 1
     |
     | many
     v
return_service_decisions
```

The decision table provides a persistent history of approval activity rather than storing only the most recent decision.

---

# 12. Alerts

The `alerts` table stores operational notifications generated by SiteTrack.

## Table: `alerts`

| Column | Type | Description |
|---|---|---|
| `alert_id` | INTEGER | Primary key |
| `tool_id` | INTEGER | Optional foreign key to `tools` |
| `jobsite_id` | INTEGER | Optional foreign key to `jobsites` |
| `alert_type` | VARCHAR(100) | Type of alert |
| `message` | TEXT | Alert message |
| `severity` | VARCHAR(50) | Alert severity |
| `is_read` | BOOLEAN | Indicates whether the alert has been read |
| `created_at` | TIMESTAMP | Creation timestamp |
| `resolved_at` | TIMESTAMP | Resolution timestamp |

The default value for `is_read` is:

```text
FALSE
```

An alert may reference a tool, a jobsite, or both depending on the event that generated it.

---

# 13. Audit Logs

The `audit_logs` table records important user and system activity.

## Table: `audit_logs`

| Column | Type | Description |
|---|---|---|
| `audit_log_id` | INTEGER | Primary key |
| `user_id` | INTEGER | Optional foreign key to `users` |
| `action` | VARCHAR(100) | Action performed |
| `entity_type` | VARCHAR(100) | Type of affected entity |
| `entity_id` | INTEGER | Identifier of affected entity |
| `description` | TEXT | Description of the action |
| `created_at` | TIMESTAMP | Audit timestamp |

Audit logs provide traceability for important system activities.

The optional `user_id` identifies the user responsible for an action when applicable.

---

# 14. Major Database Relationships

The major relationships in SiteTrack can be summarized as:

```text
Roles
  |
  v
Users
  |
  +--------------------+
  |                    |
  v                    v
Work Orders      Return-Service Decisions


Jobsites
   |
   v
Tool Assignments
   ^
   |
 Tools
   |
   +----------+-------------+-------------+
   |          |             |             |
   v          v             v             v
Assignments Inspections Damage Reports Work Orders
                         |       |
                         |       v
                         +--> Work Orders


Tools --------> Alerts
Jobsites -----> Alerts

Users --------> Audit Logs
```

---

# 15. Tool Lifecycle Data

The database supports the major SiteTrack tool lifecycle:

```text
Tool Registered
      |
      v
Tool Available
      |
      v
Tool Assignment
      |
      v
Inspection
      |
      +-------------------+
      |                   |
    Passed              Failed
                          |
                          v
                   Damage / Block
                          |
                          v
                     Work Order
                          |
                          v
                  Repair Completed
                          |
                          v
              Return-to-Service Review
                          |
                    +-----+-----+
                    |           |
                 Approved     Denied
```

Different database tables preserve the history of each stage rather than storing the entire lifecycle in a single record.

---

# 16. Data Integrity

The SiteTrack schema uses several database-level controls to protect data integrity.

These include:

- Primary keys on all major tables
- Foreign-key relationships between related entities
- Unique user email addresses
- Unique tool serial numbers
- Unique role names
- Default values for operational statuses
- A unique partial index preventing multiple active assignments for one tool
- A check constraint limiting return-to-service decisions to Approved or Denied
- Required fields through `NOT NULL` constraints

Additional business rules are enforced by the backend application layer.

---

# 17. Database Responsibility

PostgreSQL acts as the centralized persistent data store for SiteTrack.

The database itself is responsible for:

- Persistent application data
- Entity relationships
- Referential integrity
- Unique identifiers
- Database constraints
- Historical records

The Node.js/Express application layer remains responsible for higher-level workflow rules, validation, authentication, authorization, and business operations.

This separation keeps persistent storage centralized while allowing application behavior to remain within the SiteTrack Model layer.