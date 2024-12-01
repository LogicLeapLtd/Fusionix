import { NextApiRequest, NextApiResponse } from 'next'
import { Pool } from 'pg'
import { parse as parseSql } from 'pgsql-ast-parser'

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : undefined
})

// List of allowed query types for better security
const ALLOWED_QUERY_TYPES = ['SELECT', 'WITH', 'CREATE', 'INSERT', 'UPDATE', 'DELETE']

// Validate and sanitize SQL query
function validateQuery(query: string): { isValid: boolean; error?: string; queryType?: string } {
  try {
    // Parse the SQL query
    const ast = parseSql(query)
    
    // Check if query type is allowed
    const queryType = ast[0]?.type?.toUpperCase()
    if (!ALLOWED_QUERY_TYPES.includes(queryType)) {
      return {
        isValid: false,
        error: `Query type '${queryType}' is not allowed. Allowed types: ${ALLOWED_QUERY_TYPES.join(', ')}`,
        queryType
      }
    }

    return { isValid: true, queryType }
  } catch (err) {
    return {
      isValid: false,
      error: 'Invalid SQL syntax'
    }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
    return
  }

  const { query } = req.body

  if (!query) {
    res.status(400).json({ 
      error: 'Query is required',
      details: {
        type: 'validation_error',
        message: 'No SQL query provided'
      }
    })
    return
  }

  // Log query attempt
  console.log('\n--- SQL Query Execution ---')
  console.log('Query:', query)

  // Validate query
  const validation = validateQuery(query)
  if (!validation.isValid) {
    console.log('Validation Error:', validation.error)
    res.status(400).json({ 
      error: validation.error,
      details: {
        type: 'validation_error',
        queryType: validation.queryType,
        message: validation.error
      }
    })
    return
  }

  const startTime = Date.now()
  console.log('Query Type:', validation.queryType)
  console.log('Starting execution at:', new Date(startTime).toISOString())

  try {
    // Execute query
    const result = await pool.query(query)
    const executionTime = Date.now() - startTime
    
    console.log('Execution successful')
    console.log('Time taken:', `${executionTime}ms`)
    console.log('Rows affected:', result.rowCount)

    // Format response based on query type
    const queryType = validation.queryType
    if (queryType === 'SELECT' || queryType === 'WITH') {
      const response = {
        columns: result.fields.map(field => field.name),
        rows: result.rows,
        rowCount: result.rowCount,
        executionTime: `${executionTime}ms`,
        details: {
          type: 'query_success',
          queryType,
          columnsCount: result.fields.length,
          message: `Retrieved ${result.rowCount} rows in ${executionTime}ms`
        }
      }
      console.log('Columns:', response.columns)
      res.status(200).json(response)
    } else {
      const response = {
        message: `${queryType} executed successfully`,
        rowCount: result.rowCount,
        executionTime: `${executionTime}ms`,
        details: {
          type: 'query_success',
          queryType,
          message: `${queryType} affected ${result.rowCount} rows in ${executionTime}ms`
        }
      }
      console.log('Operation result:', response.message)
      res.status(200).json(response)
    }
  } catch (error) {
    const executionTime = Date.now() - startTime
    console.error('Query Error:', error)
    console.log('Failed after:', `${executionTime}ms`)

    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to execute query',
      details: {
        type: 'execution_error',
        queryType: validation.queryType,
        message: error instanceof Error ? error.message : 'Unknown error',
        executionTime: `${executionTime}ms`
      }
    })
  } finally {
    console.log('--- End SQL Query Execution ---\n')
  }
} 