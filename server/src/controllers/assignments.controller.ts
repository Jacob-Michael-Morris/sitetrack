import type {
  Request,
  Response
} from 'express'

import {
  AssignmentDomainError
} from '../models/ToolAssignment.js'

import {
  assignmentService
} from '../services/assignments.service.js'

export class AssignmentsController {
  async getAll(
    req: Request,
    res: Response
  ) {
    try {
      const assignments =
        await assignmentService.getAll()

      res.json(assignments)
    } catch (error) {
      console.error(error)

      res.status(500).json({
        message:
          'Unable to retrieve assignments'
      })
    }
  }

  async checkout(
    req: Request,
    res: Response
  ) {
    try {
      const userId = Number(
        res.locals.auth.userId
      )

      const assignment =
        await assignmentService.checkout(
          req.body,
          userId
        )

      res.status(201).json(
        assignment
      )
    } catch (error) {
      console.error(error)

      if (
        error instanceof
        AssignmentDomainError
      ) {
        res.status(400).json({
          message: error.message
        })
        return
      }

      res.status(500).json({
        message:
          'Unable to check out tool'
      })
    }
  }

  async returnAssignment(
    req: Request,
    res: Response
  ) {
    try {
      const userId = Number(
        res.locals.auth.userId
      )

      const assignment =
        await assignmentService.return(
          req.body,
          userId
        )

      res.json(assignment)
    } catch (error) {
      console.error(error)

      if (
        error instanceof
        AssignmentDomainError
      ) {
        res.status(400).json({
          message: error.message
        })
        return
      }

      res.status(500).json({
        message:
          'Unable to return tool'
      })
    }
  }

  async transfer(
    req: Request,
    res: Response
  ) {
    try {
      const userId = Number(
        res.locals.auth.userId
      )

      const assignment =
        await assignmentService.transfer(
          req.body,
          userId
        )

      res.json(assignment)
    } catch (error) {
      console.error(error)

      if (
        error instanceof
        AssignmentDomainError
      ) {
        res.status(400).json({
          message: error.message
        })
        return
      }

      res.status(500).json({
        message:
          'Unable to transfer tool'
      })
    }
  }
}

export const assignmentsController =
  new AssignmentsController()