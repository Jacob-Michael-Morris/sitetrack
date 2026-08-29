import pool from '../database/pool.js'

import {
  Jobsite
} from '../models/Jobsite.js'

import type {
  JobsiteInput
} from '../models/Jobsite.js'

import {
  createAuditLog
} from './audit-logs.service.js'

export class JobsiteService {
  async getAll() {
    const result = await pool.query(
      `SELECT *
       FROM jobsites
       ORDER BY jobsite_id`
    )

    return result.rows
  }

  async getById(id: number) {
    const result = await pool.query(
      `SELECT *
       FROM jobsites
       WHERE jobsite_id = $1`,
      [id]
    )

    return result.rows[0]
  }

  async create(
    input: Omit<JobsiteInput, 'status'> & {
      status?: string
    },
    userId: number
  ) {
    const jobsite = new Jobsite({
      ...input,
      status: input.status || 'Active'
    })

    const client =
      await pool.connect()

    try {
      await client.query('BEGIN')

      const result =
        await client.query(
          `INSERT INTO jobsites
            (
              name,
              location,
              status,
              start_date,
              end_date,
              description
            )
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING *`,
          [
            jobsite.name,
            jobsite.location,
            jobsite.status,
            jobsite.startDate,
            jobsite.endDate,
            jobsite.description
          ]
        )

      const createdJobsite =
        result.rows[0]

      await createAuditLog(
        {
          user_id: userId,
          action: 'JOBSITE_CREATED',
          entity_type: 'Jobsite',
          entity_id:
            createdJobsite.jobsite_id,
          description:
            `Jobsite "${createdJobsite.name}" was created.`
        },
        client
      )

      await client.query('COMMIT')

      return createdJobsite
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  async update(
    id: number,
    input: JobsiteInput,
    userId: number
  ) {
    const jobsite =
      new Jobsite(input)

    const client =
      await pool.connect()

    try {
      await client.query('BEGIN')

      const result =
        await client.query(
          `UPDATE jobsites
           SET
             name = $1,
             location = $2,
             status = $3,
             start_date = $4,
             end_date = $5,
             description = $6,
             updated_at = CURRENT_TIMESTAMP
           WHERE jobsite_id = $7
           RETURNING *`,
          [
            jobsite.name,
            jobsite.location,
            jobsite.status,
            jobsite.startDate,
            jobsite.endDate,
            jobsite.description,
            id
          ]
        )

      const updatedJobsite =
        result.rows[0]

      if (!updatedJobsite) {
        await client.query('ROLLBACK')
        return undefined
      }

      await createAuditLog(
        {
          user_id: userId,
          action: 'JOBSITE_UPDATED',
          entity_type: 'Jobsite',
          entity_id:
            updatedJobsite.jobsite_id,
          description:
            `Jobsite "${updatedJobsite.name}" was updated.`
        },
        client
      )

      await client.query('COMMIT')

      return updatedJobsite
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }
}

export const jobsiteService =
  new JobsiteService()