CREATE TABLE IF NOT EXISTS roles (
  role_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS permissions (
  permission_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  permission_key VARCHAR(100) UNIQUE NOT NULL,
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

CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  role_id INTEGER NOT NULL REFERENCES roles(role_id),
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS jobsites (
  jobsite_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  location VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Active',
  start_date DATE,
  end_date DATE,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tools (
  tool_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  serial_number VARCHAR(150) UNIQUE NOT NULL,
  category VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Available',
  condition VARCHAR(50) NOT NULL DEFAULT 'Good',
  purchase_date DATE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tool_assignments (
  assignment_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tool_id INTEGER NOT NULL REFERENCES tools(tool_id),
  jobsite_id INTEGER NOT NULL REFERENCES jobsites(jobsite_id),
  assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  released_at TIMESTAMP,
  status VARCHAR(50) NOT NULL DEFAULT 'Checked Out',
  notes TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS one_active_assignment_per_tool
ON tool_assignments(tool_id)
WHERE released_at IS NULL;

CREATE TABLE IF NOT EXISTS inspections (
  inspection_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tool_id INTEGER NOT NULL REFERENCES tools(tool_id),
  inspection_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  result VARCHAR(50) NOT NULL,
  condition VARCHAR(50) NOT NULL,
  notes TEXT,
  next_inspection_date DATE
);

CREATE TABLE IF NOT EXISTS damage_reports (
  damage_report_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tool_id INTEGER NOT NULL REFERENCES tools(tool_id),
  inspection_id INTEGER REFERENCES inspections(inspection_id),
  description TEXT NOT NULL,
  severity VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Open',
  reported_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS work_orders (
  work_order_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tool_id INTEGER NOT NULL REFERENCES tools(tool_id),
  damage_report_id INTEGER REFERENCES damage_reports(damage_report_id),
  description TEXT NOT NULL,
  priority VARCHAR(50) NOT NULL DEFAULT 'Medium',
  status VARCHAR(50) NOT NULL DEFAULT 'Open',
  assigned_to VARCHAR(150),
  completed_by INTEGER REFERENCES users(user_id),
  return_requested_by INTEGER REFERENCES users(user_id),
  return_requested_at TIMESTAMP,
  opened_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS return_service_decisions (
  decision_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  work_order_id INTEGER NOT NULL REFERENCES work_orders(work_order_id),
  approver_user_id INTEGER NOT NULL REFERENCES users(user_id),
  decision VARCHAR(20) NOT NULL
    CHECK (
      decision IN (
        'Approved',
        'Denied'
      )
    ),
  reason TEXT NOT NULL,
  block_disposition VARCHAR(50) NOT NULL,
  decided_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS alerts (
  alert_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tool_id INTEGER REFERENCES tools(tool_id),
  jobsite_id INTEGER REFERENCES jobsites(jobsite_id),
  alert_type VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  severity VARCHAR(50) NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
  audit_log_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id INTEGER,
  description TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO roles (
  name,
  description
)
VALUES
  (
    'Administrator',
    'Full administrative access to SiteTrack.'
  ),
  (
    'Equipment Manager',
    'Manages tools, jobsites, assignments, alerts, and related reports.'
  ),
  (
    'Maintenance Technician',
    'Manages inspections, damage reports, maintenance, alerts, and related reports.'
  ),
  (
    'Worker',
    'Uses tool assignment and damage reporting functions.'
  ),
  (
    'Safety Personnel',
    'Reviews inspections, damage reports, alerts, and safety-related reports.'
  )
ON CONFLICT (name) DO NOTHING;

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
    1
  ),
  (
    'tools.view',
    'Tools',
    'View Tools',
    'Allows users to view tools and tool details.',
    2
  ),
  (
    'tools.create',
    'Tools',
    'Register Tools',
    'Allows users to register new tools.',
    3
  ),
  (
    'tools.edit',
    'Tools',
    'Edit Tools',
    'Allows users to edit existing tools.',
    4
  ),
  (
    'jobsites.view',
    'Jobsites',
    'View Jobsites',
    'Allows users to view jobsites and jobsite details.',
    5
  ),
  (
    'jobsites.create',
    'Jobsites',
    'Create Jobsites',
    'Allows users to create new jobsites.',
    6
  ),
  (
    'jobsites.edit',
    'Jobsites',
    'Edit Jobsites',
    'Allows users to edit existing jobsites.',
    7
  ),
  (
    'assignments.view',
    'Assignments',
    'View Assignments',
    'Allows users to view current tool assignments.',
    8
  ),
  (
    'assignments.checkout',
    'Assignments',
    'Check Out Tools',
    'Allows users to check tools out to jobsites.',
    9
  ),
  (
    'assignments.return',
    'Assignments',
    'Return Tools',
    'Allows users to return checked-out tools.',
    10
  ),
  (
    'assignments.transfer',
    'Assignments',
    'Transfer Tools',
    'Allows users to transfer tools between jobsites.',
    11
  ),
  (
    'inspections.view',
    'Inspections',
    'View Inspections',
    'Allows users to view inspection records.',
    12
  ),
  (
    'inspections.create',
    'Inspections',
    'Record Inspections',
    'Allows users to record tool inspections.',
    13
  ),
  (
    'damage_reports.view',
    'Damage Reports',
    'View Damage Reports',
    'Allows users to view damage reports.',
    14
  ),
  (
    'damage_reports.create',
    'Damage Reports',
    'Create Damage Reports',
    'Allows users to report damaged tools.',
    15
  ),
  (
    'maintenance.view',
    'Maintenance',
    'View Maintenance',
    'Allows users to view maintenance work orders.',
    16
  ),
  (
    'maintenance.create',
    'Maintenance',
    'Create Work Orders',
    'Allows users to create maintenance work orders.',
    17
  ),
  (
    'maintenance.complete',
    'Maintenance',
    'Complete Repairs',
    'Allows users to complete maintenance work orders.',
    18
  ),
  (
    'maintenance.return_request',
    'Maintenance',
    'Request Return to Service',
    'Allows users to request return-to-service approval.',
    19
  ),
  (
    'maintenance.return_approve',
    'Maintenance',
    'Approve Return to Service',
    'Allows users to approve or deny return-to-service requests.',
    20
  ),
  (
    'alerts.view',
    'Alerts',
    'View Alerts',
    'Allows users to view and manage alerts.',
    21
  ),
  (
    'reports.view',
    'Reports',
    'View Reports',
    'Allows users to access SiteTrack reports.',
    22
  ),
  (
    'audit.view',
    'Audit Log',
    'View Audit Log',
    'Allows users to view SiteTrack audit history.',
    23
  ),
  (
    'users.view',
    'Users',
    'View Users',
    'Allows users to view user accounts.',
    24
  ),
  (
    'users.create',
    'Users',
    'Create Users',
    'Allows users to create user accounts.',
    25
  ),
  (
    'users.edit',
    'Users',
    'Edit Users',
    'Allows users to edit user accounts.',
    26
  ),
  (
    'roles.manage',
    'Roles',
    'Manage Roles',
    'Allows users to configure permissions for SiteTrack roles.',
    27
  )
ON CONFLICT (permission_key) DO NOTHING;

INSERT INTO role_permissions (
  role_id,
  permission_id
)
SELECT
  r.role_id,
  p.permission_id
FROM roles r
CROSS JOIN permissions p
WHERE
  r.name = 'Administrator'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (
  role_id,
  permission_id
)
SELECT
  r.role_id,
  p.permission_id
FROM roles r
CROSS JOIN permissions p
WHERE
  r.name = 'Equipment Manager'
  AND p.permission_key IN (
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
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (
  role_id,
  permission_id
)
SELECT
  r.role_id,
  p.permission_id
FROM roles r
CROSS JOIN permissions p
WHERE
  r.name = 'Maintenance Technician'
  AND p.permission_key IN (
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
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (
  role_id,
  permission_id
)
SELECT
  r.role_id,
  p.permission_id
FROM roles r
CROSS JOIN permissions p
WHERE
  r.name = 'Worker'
  AND p.permission_key IN (
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
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (
  role_id,
  permission_id
)
SELECT
  r.role_id,
  p.permission_id
FROM roles r
CROSS JOIN permissions p
WHERE
  r.name = 'Safety Personnel'
  AND p.permission_key IN (
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
ON CONFLICT DO NOTHING;