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
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    const { query } = req.body

    // Basic SQL injection prevention
    if (query.toLowerCase().includes('drop') || 
        query.toLowerCase().includes('delete')) {
      return res.status(403).json({ 
        error: 'DROP and DELETE operations are not allowed' 
      })
    }

    const result = await pool.query(query)
    res.status(200).json({
      rows: result.rows,
      rowCount: result.rowCount,
      fields: result.fields
    })
  } catch (error) {
    res.status(500).json({ 
      error: 'Query execution failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
} 