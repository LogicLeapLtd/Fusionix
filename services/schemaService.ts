import { CompletionContext, CompletionResult } from '@codemirror/autocomplete'
import { Diagnostic } from '@codemirror/lint'
import { EditorState, Text } from '@codemirror/state'

export interface TableSchema {
  name: string
  columns: Array<{
    name: string
    type: string
    nullable: boolean
    isPrimary?: boolean
    isForeign?: boolean
    references?: {
      table: string
      column: string
    }
  }>
}

export interface DatabaseSchema {
  tables: TableSchema[]
}

// Mock schema for demonstration - this would be fetched from your API
const MOCK_SCHEMAS: Record<string, DatabaseSchema> = {
  quickbooks: {
    tables: [
      {
        name: 'invoice_line',
        columns: [
          { name: 'id', type: 'integer', nullable: false, isPrimary: true },
          { name: 'sales_item_line_detail_item_ref_name', type: 'varchar', nullable: true },
          { name: 'amount', type: 'decimal', nullable: false },
          { name: 'created_at', type: 'timestamp', nullable: false },
          { name: 'updated_at', type: 'timestamp', nullable: false }
        ]
      },
      {
        name: 'customers',
        columns: [
          { name: 'id', type: 'integer', nullable: false, isPrimary: true },
          { name: 'name', type: 'varchar', nullable: false },
          { name: 'email', type: 'varchar', nullable: true },
          { name: 'created_at', type: 'timestamp', nullable: false }
        ]
      }
    ]
  },
  stripe: {
    tables: [
      {
        name: 'charges',
        columns: [
          { name: 'id', type: 'varchar', nullable: false, isPrimary: true },
          { name: 'amount', type: 'integer', nullable: false },
          { name: 'currency', type: 'varchar', nullable: false },
          { name: 'customer_id', type: 'varchar', nullable: true },
          { name: 'created', type: 'timestamp', nullable: false }
        ]
      }
    ]
  }
}

export class SchemaService {
  private currentSchema: string = 'quickbooks'
  private schemas: Record<string, DatabaseSchema> = MOCK_SCHEMAS

  setCurrentSchema(schema: string) {
    this.currentSchema = schema
  }

  getCurrentSchema(): DatabaseSchema {
    return this.schemas[this.currentSchema]
  }

  getTableNames(): string[] {
    return this.getCurrentSchema().tables.map(t => t.name)
  }

  getColumnsForTable(tableName: string): TableSchema['columns'] {
    return this.getCurrentSchema().tables.find(t => t.name === tableName)?.columns || []
  }

  getAllColumns(): Array<{ table: string; column: TableSchema['columns'][0] }> {
    return this.getCurrentSchema().tables.flatMap(table => 
      table.columns.map(column => ({ table: table.name, column }))
    )
  }

  // SQL Keywords for autocompletion
  private static SQL_KEYWORDS = [
    'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'LIKE', 'IS', 'NULL',
    'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'OFFSET', 'JOIN', 'LEFT JOIN',
    'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'ON', 'AS', 'DISTINCT', 'COUNT',
    'SUM', 'AVG', 'MIN', 'MAX', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END'
  ]

  // Function types for autocompletion
  private static SQL_FUNCTIONS = [
    'COUNT(*)', 'SUM()', 'AVG()', 'MIN()', 'MAX()', 'COALESCE()', 'NULLIF()',
    'CURRENT_TIMESTAMP', 'CURRENT_DATE', 'EXTRACT()', 'TO_CHAR()', 'LENGTH()'
  ]

  getCompletions(context: CompletionContext): CompletionResult | null {
    const word = context.matchBefore(/\w*/)
    if (!word) return null

    const options: Array<{ label: string; type: string; info?: string }> = []

    // Add SQL keywords
    SchemaService.SQL_KEYWORDS.forEach(keyword => {
      if (keyword.toLowerCase().includes(word.text.toLowerCase())) {
        options.push({ label: keyword, type: 'keyword' })
      }
    })

    // Add SQL functions
    SchemaService.SQL_FUNCTIONS.forEach(func => {
      if (func.toLowerCase().includes(word.text.toLowerCase())) {
        options.push({ label: func, type: 'function' })
      }
    })

    // Add table names
    this.getTableNames().forEach(table => {
      if (table.toLowerCase().includes(word.text.toLowerCase())) {
        options.push({ 
          label: table, 
          type: 'type',
          info: `Table: ${table}\nColumns: ${this.getColumnsForTable(table)
            .map(c => `${c.name} (${c.type})`)
            .join(', ')}`
        })
      }
    })

    // Add column names
    this.getAllColumns().forEach(({ table, column }) => {
      if (column.name.toLowerCase().includes(word.text.toLowerCase())) {
        options.push({ 
          label: column.name,
          type: 'property',
          info: `${table}.${column.name} (${column.type})${column.nullable ? ' nullable' : ''}`
        })
      }
    })

    return {
      from: word.from,
      options,
      span: /^\w*$/
    }
  }

  lint(state: EditorState): Diagnostic[] {
    if (!state || !state.doc) {
      return []
    }

    let text: string
    if (typeof state.doc === 'string') {
      text = state.doc
    } else if (state.doc instanceof Text) {
      text = state.doc.toString()
    } else {
      // Fallback for other cases
      try {
        text = String(state.doc)
      } catch {
        return []
      }
    }

    const diagnostics: Diagnostic[] = []
    const tables = this.getTableNames()
    
    // Split the text into words, handling SQL-specific delimiters
    const words = text.split(/[\s,();]+/).filter(Boolean)

    let inFromClause = false
    let inJoinClause = false

    words.forEach((word, index) => {
      const upperWord = word.toUpperCase()

      // Track if we're in a FROM or JOIN clause
      if (upperWord === 'FROM') {
        inFromClause = true
        inJoinClause = false
      } else if (upperWord.includes('JOIN')) {
        inJoinClause = true
        inFromClause = false
      } else if (['WHERE', 'GROUP', 'ORDER', 'HAVING'].includes(upperWord)) {
        inFromClause = false
        inJoinClause = false
      }

      // Check table names in FROM and JOIN clauses
      if ((inFromClause || inJoinClause) && 
          !this.SQL_KEYWORDS.includes(upperWord) &&
          word.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
        
        if (!tables.includes(word)) {
          // Find the position of the word in the original text
          const pos = text.indexOf(word)
          if (pos !== -1) {
            diagnostics.push({
              from: pos,
              to: pos + word.length,
              severity: 'error',
              message: `Unknown table: "${word}". Available tables: ${tables.join(', ')}`
            })
          }
        }
      }

      // Check column references
      if (!inFromClause && !inJoinClause && 
          word.includes('.') && 
          !word.startsWith('"') && 
          !word.startsWith("'")) {
        const [tableName, columnName] = word.split('.')
        if (tables.includes(tableName)) {
          const columns = this.getColumnsForTable(tableName)
          if (!columns.some(col => col.name === columnName)) {
            const pos = text.indexOf(word)
            if (pos !== -1) {
              diagnostics.push({
                from: pos,
                to: pos + word.length,
                severity: 'error',
                message: `Unknown column: "${columnName}" in table "${tableName}"`
              })
            }
          }
        }
      }
    })

    return diagnostics
  }
}

export const schemaService = new SchemaService() 