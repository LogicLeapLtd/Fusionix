import type { NextApiRequest, NextApiResponse } from 'next'
import { Pool } from 'pg'
import jwt from 'jsonwebtoken'
import { hash, compare } from 'bcrypt'

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB,
})

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const { action, email, password } = req.body

  try {
    switch (action) {
      case 'login':
        const user = await pool.query(
          'SELECT * FROM users WHERE email = $1',
          [email]
        )

        if (user.rows.length === 0) {
          return res.status(401).json({ error: 'Invalid credentials' })
        }

        const validPassword = await compare(password, user.rows[0].password)
        if (!validPassword) {
          return res.status(401).json({ error: 'Invalid credentials' })
        }

        const token = jwt.sign(
          { userId: user.rows[0].id, email },
          JWT_SECRET,
          { expiresIn: '24h' }
        )

        res.status(200).json({ token })
        break

      case 'register':
        const hashedPassword = await hash(password, 10)
        const newUser = await pool.query(
          'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
          [email, hashedPassword]
        )

        const newToken = jwt.sign(
          { userId: newUser.rows[0].id, email },
          JWT_SECRET,
          { expiresIn: '24h' }
        )

        res.status(201).json({ token: newToken })
        break

      default:
        res.status(400).json({ error: 'Invalid action' })
    }
  } catch (error) {
    res.status(500).json({ 
      error: 'Authentication failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
} 