-- ============================================================
-- SiteTrack
-- Migration 003
-- Seed Existing Role Permissions
-- ============================================================


-- ============================================================
-- EQUIPMENT MANAGER
-- ============================================================

INSERT INTO role_permissions (
    role_id,
    permission_id
)
SELECT
    r.role_id,
    p.permission_id
FROM roles r
JOIN permissions p
    ON p.permission_key IN (
        'dashboard.view',

        'tools.view',
        'tools.create',
        'tools.edit',

        'jobsites.view',
        'jobsites.create',
        'jobsites.edit',

        'assignments.view',
        'assignments.checkout',
        'assignments.return',
        'assignments.transfer',

        'inspections.view',
        'inspections.create',

        'maintenance.view',
        'maintenance.create',
        'maintenance.return_approve',

        'alerts.view',
        'reports.view'
    )
WHERE r.name = 'Equipment Manager'
ON CONFLICT DO NOTHING;


-- ============================================================
-- MAINTENANCE TECHNICIAN
-- ============================================================

INSERT INTO role_permissions (
    role_id,
    permission_id
)
SELECT
    r.role_id,
    p.permission_id
FROM roles r
JOIN permissions p
    ON p.permission_key IN (
        'dashboard.view',

        'tools.view',

        'inspections.view',
        'inspections.create',

        'damage_reports.view',
        'damage_reports.create',

        'maintenance.view',
        'maintenance.complete',
        'maintenance.return_request',

        'alerts.view',
        'reports.view'
    )
WHERE r.name = 'Maintenance Technician'
ON CONFLICT DO NOTHING;


-- ============================================================
-- WORKER
-- ============================================================

INSERT INTO role_permissions (
    role_id,
    permission_id
)
SELECT
    r.role_id,
    p.permission_id
FROM roles r
JOIN permissions p
    ON p.permission_key IN (
        'dashboard.view',

        'tools.view',

        'assignments.view',
        'assignments.checkout',
        'assignments.return',
        'assignments.transfer',

        'inspections.view',
        'inspections.create',

        'damage_reports.view',
        'damage_reports.create'
    )
WHERE r.name = 'Worker'
ON CONFLICT DO NOTHING;


-- ============================================================
-- SAFETY PERSONNEL
-- ============================================================

INSERT INTO role_permissions (
    role_id,
    permission_id
)
SELECT
    r.role_id,
    p.permission_id
FROM roles r
JOIN permissions p
    ON p.permission_key IN (
        'dashboard.view',

        'tools.view',

        'inspections.view',
        'inspections.create',

        'damage_reports.view',
        'damage_reports.create',

        'alerts.view',
        'reports.view',

        'audit.view'
    )
WHERE r.name = 'Safety Personnel'
ON CONFLICT DO NOTHING;