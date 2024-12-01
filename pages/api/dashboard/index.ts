import type { NextApiRequest, NextApiResponse } from 'next'
import { Pool } from 'pg'

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB,
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      try {
        const { userId } = req.query
        const result = await pool.query(
          'SELECT * FROM dashboards WHERE user_id = $1',
          [userId]
        )
        res.status(200).json(result.rows)
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch dashboard data' })
      }
      break

    case 'PUT':
      try {
        const { dashboardId, layout, widgets } = req.body
        const result = await pool.query(
          'UPDATE dashboards SET layout = $1, widgets = $2 WHERE id = $3 RETURNING *',
          [layout, widgets, dashboardId]
        )
        res.status(200).json(result.rows[0])
      } catch (error) {
        res.status(500).json({ error: 'Failed to update dashboard' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 