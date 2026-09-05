CREATE TABLE IF NOT EXISTS permissions (
    permission_id SERIAL PRIMARY KEY,
    permission_key VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id INTEGER NOT NULL
        REFERENCES roles(role_id)
        ON DELETE CASCADE,

    permission_id INTEGER NOT NULL
        REFERENCES permissions(permission_id)
        ON DELETE CASCADE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (
        role_id,
        permission_id
    )
);

CREATE INDEX IF NOT EXISTS
    idx_role_permissions_role_id
ON role_permissions(role_id);

CREATE INDEX IF NOT EXISTS
    idx_role_permissions_permission_id
ON role_permissions(permission_id);


INSERT INTO permissions (
    permission_key,
    category,
    display_name,
    description,
    sort_order
)
VALUES
    (
        'dashboard.view',
        'Dashboard',
        'View Dashboard',
        'Allows access to the SiteTrack dashboard.',
        10
    ),

    (
        'tools.view',
        'Tools',
        'View Tools',
        'Allows viewing tools and tool details.',
        20
    ),
    (
        'tools.create',
        'Tools',
        'Register Tools',
        'Allows new tools to be registered.',
        21
    ),
    (
        'tools.edit',
        'Tools',
        'Edit Tools',
        'Allows existing tools to be edited.',
        22
    ),

    (
        'jobsites.view',
        'Jobsites',
        'View Jobsites',
        'Allows viewing jobsites.',
        30
    ),
    (
        'jobsites.create',
        'Jobsites',
        'Create Jobsites',
        'Allows new jobsites to be created.',
        31
    ),
    (
        'jobsites.edit',
        'Jobsites',
        'Edit Jobsites',
        'Allows existing jobsites to be edited.',
        32
    ),

    (
        'assignments.view',
        'Assignments',
        'View Assignments',
        'Allows viewing current tool assignments.',
        40
    ),
    (
        'assignments.checkout',
        'Assignments',
        'Check Out Tools',
        'Allows tools to be checked out.',
        41
    ),
    (
        'assignments.return',
        'Assignments',
        'Return Tools',
        'Allows checked-out tools to be returned.',
        42
    ),
    (
        'assignments.transfer',
        'Assignments',
        'Transfer Tools',
        'Allows tools to be transferred between jobsites.',
        43
    ),

    (
        'inspections.view',
        'Inspections',
        'View Inspections',
        'Allows viewing inspection records.',
        50
    ),
    (
        'inspections.create',
        'Inspections',
        'Record Inspections',
        'Allows new inspections to be recorded.',
        51
    ),

    (
        'damage_reports.view',
        'Damage Reports',
        'View Damage Reports',
        'Allows viewing damage reports.',
        60
    ),
    (
        'damage_reports.create',
        'Damage Reports',
        'Create Damage Reports',
        'Allows new damage reports to be submitted.',
        61
    ),

    (
        'maintenance.view',
        'Maintenance',
        'View Maintenance',
        'Allows viewing maintenance work orders.',
        70
    ),
    (
        'maintenance.create',
        'Maintenance',
        'Create Work Orders',
        'Allows maintenance work orders to be created.',
        71
    ),
    (
        'maintenance.complete',
        'Maintenance',
        'Complete Work Orders',
        'Allows maintenance work orders to be completed.',
        72
    ),
    (
        'maintenance.return_request',
        'Maintenance',
        'Request Return to Service',
        'Allows a repaired tool to be submitted for return-to-service approval.',
        73
    ),
    (
        'maintenance.return_approve',
        'Maintenance',
        'Approve Return to Service',
        'Allows return-to-service requests to be approved or denied.',
        74
    ),

    (
        'alerts.view',
        'Alerts',
        'View Alerts',
        'Allows viewing SiteTrack alerts.',
        80
    ),

    (
        'reports.view',
        'Reports',
        'View Reports',
        'Allows access to SiteTrack reports.',
        90
    ),

    (
        'audit.view',
        'Audit Log',
        'View Audit Log',
        'Allows viewing the SiteTrack audit log.',
        100
    ),

    (
        'users.view',
        'Users',
        'View Users',
        'Allows viewing user accounts.',
        110
    ),
    (
        'users.create',
        'Users',
        'Create Users',
        'Allows new user accounts to be created.',
        111
    ),
    (
        'users.edit',
        'Users',
        'Edit Users',
        'Allows existing user accounts to be edited.',
        112
    ),

    (
        'roles.manage',
        'Roles',
        'Manage Roles',
        'Allows role permissions to be configured.',
        120
    )

ON CONFLICT (permission_key)
DO NOTHING;


INSERT INTO role_permissions (
    role_id,
    permission_id
)
SELECT
    roles.role_id,
    permissions.permission_id
FROM roles
CROSS JOIN permissions
WHERE roles.name = 'Administrator'
ON CONFLICT DO NOTHING;