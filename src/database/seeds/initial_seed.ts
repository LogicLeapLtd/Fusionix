import pg from 'pg'
import { hash } from 'bcrypt'
import dotenv from 'dotenv'
const { Pool } = pg

dotenv.config()

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB,
})

async function seedDatabase() {
  try {
    // Create users
    const hashedPassword = await hash('admin123', 10)
    await pool.query(`
      INSERT INTO users (email, password, name) 
      VALUES ($1, $2, $3) 
      ON CONFLICT (email) DO NOTHING
    `, ['admin@fusionix.com', hashedPassword, 'Admin User'])

    // Add more seeding logic here
    console.log('Database seeded successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Seeding failed:', error)
    process.exit(1)
  }
}

// Modern ESM way to check if file is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
} 