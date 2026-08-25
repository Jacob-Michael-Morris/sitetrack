# SiteTrack REST API Design

Base URL:

/api


# Authentication

POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me


# Users

GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id


# Roles

GET    /api/roles
GET    /api/roles/:id
POST   /api/roles
PUT    /api/roles/:id
DELETE /api/roles/:id


# Jobsites

GET    /api/jobsites
GET    /api/jobsites/:id
POST   /api/jobsites
PUT    /api/jobsites/:id
DELETE /api/jobsites/:id

GET /api/jobsites/:id/tools


# Tool Categories

GET    /api/tool-categories
GET    /api/tool-categories/:id
POST   /api/tool-categories
PUT    /api/tool-categories/:id
DELETE /api/tool-categories/:id


# Tools

GET    /api/tools
GET    /api/tools/:id
POST   /api/tools
PUT    /api/tools/:id
DELETE /api/tools/:id

GET /api/tools/:id/history
GET /api/tools/:id/inspections
GET /api/tools/:id/maintenance
GET /api/tools/:id/damage-reports


# Tool Assignments

GET  /api/assignments
GET  /api/assignments/:id

POST /api/assignments/checkout
POST /api/assignments/return
POST /api/assignments/transfer

GET /api/tools/:id/assignments
GET /api/users/:id/assignments


# Inspections

GET    /api/inspections
GET    /api/inspections/:id
POST   /api/inspections
PUT    /api/inspections/:id
DELETE /api/inspections/:id

GET /api/inspections/overdue
GET /api/inspections/upcoming


# Damage Reports

GET    /api/damage-reports
GET    /api/damage-reports/:id
POST   /api/damage-reports
PUT    /api/damage-reports/:id

GET /api/tools/:id/damage-reports


# Maintenance Schedules

GET    /api/maintenance-schedules
GET    /api/maintenance-schedules/:id
POST   /api/maintenance-schedules
PUT    /api/maintenance-schedules/:id
DELETE /api/maintenance-schedules/:id

GET /api/maintenance-schedules/upcoming
GET /api/maintenance-schedules/overdue


# Work Orders

GET    /api/work-orders
GET    /api/work-orders/:id
POST   /api/work-orders
PUT    /api/work-orders/:id

GET /api/tools/:id/work-orders

PUT /api/work-orders/:id/assign
PUT /api/work-orders/:id/complete
PUT /api/work-orders/:id/close


# Alerts

GET    /api/alerts
GET    /api/alerts/:id
POST   /api/alerts

PUT /api/alerts/:id/read
PUT /api/alerts/read-all

DELETE /api/alerts/:id


# Audit Log

GET /api/audit-logs
GET /api/audit-logs/:id
GET /api/users/:id/audit-logs
GET /api/tools/:id/audit-logs


# Dashboard

GET /api/dashboard
GET /api/dashboard/summary
GET /api/dashboard/tool-status
GET /api/dashboard/jobsite-summary
GET /api/dashboard/recent-alerts


# Reports

GET /api/reports/tool-inventory
GET /api/reports/current-assignments
GET /api/reports/maintenance-history
GET /api/reports/inspection-status
GET /api/reports/damage-history
