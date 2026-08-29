export const ADMIN =
  'Administrator'

export const EQUIPMENT_MANAGER =
  'Equipment Manager'

export const MAINTENANCE_TECHNICIAN =
  'Maintenance Technician'

export const WORKER =
  'Worker'

export const SAFETY_PERSONNEL =
  'Safety Personnel'

export const JOBSITE_ROLES: string[] = [
  ADMIN,
  EQUIPMENT_MANAGER
]

export const ASSIGNMENT_ROLES: string[] = [
  ADMIN,
  EQUIPMENT_MANAGER,
  WORKER
]

export const INSPECTION_ROLES: string[] = [
  ADMIN,
  EQUIPMENT_MANAGER,
  MAINTENANCE_TECHNICIAN,
  WORKER,
  SAFETY_PERSONNEL
]

export const DAMAGE_REPORT_ROLES: string[] = [
  ADMIN,
  MAINTENANCE_TECHNICIAN,
  WORKER,
  SAFETY_PERSONNEL
]

export const MAINTENANCE_ROLES: string[] = [
  ADMIN,
  EQUIPMENT_MANAGER,
  MAINTENANCE_TECHNICIAN,
  SAFETY_PERSONNEL
]

export const ALERT_ROLES: string[] = [
  ADMIN,
  EQUIPMENT_MANAGER,
  MAINTENANCE_TECHNICIAN,
  SAFETY_PERSONNEL
]

export const REPORT_ROLES: string[] = [
  ADMIN,
  EQUIPMENT_MANAGER,
  MAINTENANCE_TECHNICIAN,
  SAFETY_PERSONNEL
]

export function hasAllowedRole(
  role: string | undefined,
  allowedRoles: string[]
) {
  return Boolean(
    role &&
    allowedRoles.includes(role)
  )
}