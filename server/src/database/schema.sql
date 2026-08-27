CREATE TABLE IF NOT EXISTS roles (
  role_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT
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
  opened_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  notes TEXT
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

INSERT INTO roles (name, description)
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