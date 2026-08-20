import { Router } from 'express'
import pool from '../database/pool.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tools ORDER BY tool_id'
    )

    res.json(result.rows)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Unable to retrieve tools'
    })
  }
})

export default router