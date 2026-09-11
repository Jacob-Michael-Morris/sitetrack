import type {
  Request,
  Response
} from 'express'

import {
  roleService
} from './roles.service.js'

import {
  createAuditLog
} from '../../audit/audit-logs.service.js'

export class RolesController {
  async getAll(
    req: Request,
    res: Response
  ) {
    try {
      const roles =
        await roleService.getAll()

      res.json(roles)
    } catch (error) {
      console.error(error)

      res.status(500).json({
        message:
          'Unable to retrieve roles'
      })
    }
  }

  async getAllPermissions(
    req: Request,
    res: Response
  ) {
    try {
      const permissions =
        await roleService
          .getAllPermissions()

      res.json(permissions)
    } catch (error) {
      console.error(error)

      res.status(500).json({
        message:
          'Unable to retrieve permissions'
      })
    }
  }

  async getRolePermissions(
    req: Request,
    res: Response
  ) {
    const roleId =
      Number(req.params.id)

    if (
      !Number.isInteger(roleId) ||
      roleId <= 0
    ) {
      res.status(400).json({
        message:
          'Invalid role ID'
      })
      return
    }

    try {
      const roles =
        await roleService.getAll()

      const role =
        roles.find(
          (item) =>
            item.role_id === roleId
        )

      if (!role) {
        res.status(404).json({
          message:
            'Role not found'
        })
        return
      }

      const permissions =
        await roleService
          .getRolePermissions(
            roleId
          )

      res.json({
        role,
        permissions
      })
    } catch (error) {
      console.error(error)

      res.status(500).json({
        message:
          'Unable to retrieve role permissions'
      })
    }
  }

  async updateRolePermissions(
    req: Request,
    res: Response
  ) {
    const roleId =
      Number(req.params.id)

    if (
      !Number.isInteger(roleId) ||
      roleId <= 0
    ) {
      res.status(400).json({
        message:
          'Invalid role ID'
      })
      return
    }

    const {
      permission_keys
    } = req.body

    if (
      !Array.isArray(
        permission_keys
      ) ||
      !permission_keys.every(
        (key) =>
          typeof key === 'string'
      )
    ) {
      res.status(400).json({
        message:
          'permission_keys must be an array of strings'
      })
      return
    }

    try {
      const roles =
        await roleService.getAll()

      const role =
        roles.find(
          (item) =>
            item.role_id === roleId
        )

      if (!role) {
        res.status(404).json({
          message:
            'Role not found'
        })
        return
      }

      const permissions =
        await roleService
          .updateRolePermissions(
            roleId,
            permission_keys
          )

      const auth =
        res.locals.auth as
          | {
              userId?: number
            }
          | undefined

      try {
        await createAuditLog({
          user_id:
            auth?.userId ?? null,
          action:
            'Update Role Permissions',
          entity_type:
            'Role',
          entity_id:
            roleId,
          description:
            `Updated permissions for role "${role.name}". ${permission_keys.length} permissions enabled.`
        })
      } catch (auditError) {
        console.error(
          'Unable to create role permission audit log:',
          auditError
        )
      }

      res.json({
        message:
          'Role permissions updated successfully',
        permissions
      })
    } catch (error) {
      if (
        error instanceof Error
      ) {
        if (
          error.message ===
          'Role not found'
        ) {
          res.status(404).json({
            message:
              error.message
          })
          return
        }

        if (
          error.message.startsWith(
            'Invalid permissions:'
          )
        ) {
          res.status(400).json({
            message:
              error.message
          })
          return
        }
      }

      console.error(error)

      res.status(500).json({
        message:
          'Unable to update role permissions'
      })
    }
  }
}

export const rolesController =
  new RolesController()