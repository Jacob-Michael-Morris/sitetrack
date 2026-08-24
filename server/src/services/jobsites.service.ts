import pool from '../database/pool.js'

export async function getAllJobsites() {
  const result = await pool.query(
    'SELECT * FROM jobsites ORDER BY jobsite_id'
  )

  return result.rows
}

export async function getJobsiteById(id: number) {
  const result = await pool.query(
    'SELECT * FROM jobsites WHERE jobsite_id = $1',
    [id]
  )

  return result.rows[0]
}

export async function createJobsite(jobsite: {
  name: string
  location: string
  status: string
  start_date: string | null
  end_date: string | null
  description: string
}) {
  const result = await pool.query(
    `INSERT INTO jobsites
      (name, location, status, start_date, end_date, description)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      jobsite.name,
      jobsite.location,
      jobsite.status,
      jobsite.start_date,
      jobsite.end_date,
      jobsite.description
    ]
  )

  return result.rows[0]
}

export async function updateJobsite(
  id: number,
  jobsite: {
    name: string
    location: string
    status: string
    start_date: string | null
    end_date: string | null
    description: string
  }
) {
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
      jobsite.start_date,
      jobsite.end_date,
      jobsite.description,
      id
    ]
  )

  return result.rows[0]
}