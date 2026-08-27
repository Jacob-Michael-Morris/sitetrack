import pool from '../database/pool.js'

import {
  Jobsite
} from '../models/Jobsite.js'

import type {
  JobsiteInput
} from '../models/Jobsite.js'

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
    }
  ) {
    const jobsite = new Jobsite({
      ...input,
      status: input.status || 'Active'
    })

    const result = await pool.query(
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

    return result.rows[0]
  }

  async update(
    id: number,
    input: JobsiteInput
  ) {
    const jobsite =
      new Jobsite(input)

    const result = await pool.query(
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

    return result.rows[0]
  }
}

export const jobsiteService =
  new JobsiteService()