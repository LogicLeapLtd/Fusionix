import type { NextApiRequest, NextApiResponse } from 'next'
import { query } from '../../../database/utils/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const result = await query('SELECT NOW()')
    res.status(200).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed' })
  }
} 