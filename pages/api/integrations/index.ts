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
        const result = await pool.query('SELECT * FROM integrations')
        res.status(200).json(result.rows)
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch integrations' })
      }
      break

    case 'POST':
      try {
        const { platform, credentials } = req.body
        const result = await pool.query(
          'INSERT INTO integrations (platform, credentials) VALUES ($1, $2) RETURNING *',
          [platform, credentials]
        )
        res.status(201).json(result.rows[0])
      } catch (error) {
        res.status(500).json({ error: 'Failed to create integration' })
      }
      break

    case 'DELETE':
      try {
        const { id } = req.query
        await pool.query('DELETE FROM integrations WHERE id = $1', [id])
        res.status(200).json({ message: 'Integration deleted successfully' })
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete integration' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 