import { NextPage } from 'next'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import {
  PlayIcon,
  ClockIcon,
  DocumentTextIcon,
  XMarkIcon,
  CommandLineIcon,
  BookmarkIcon,
  SparklesIcon,
  FolderIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  TableCellsIcon,
  ArrowPathIcon,
  Bars3Icon
} from '@heroicons/react/24/outline'
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid'
import { useDevMode } from '../contexts/DevModeContext'
import { sql } from '@codemirror/lang-sql'
import { oneDark } from '@codemirror/theme-one-dark'
import { autocompletion, completionKeymap } from '@codemirror/autocomplete'
import { linter, lintKeymap } from '@codemirror/lint'
import { schemaService } from '../services/schemaService'
import { EditorView } from '@codemirror/view'

// Import CodeMirror dynamically to avoid SSR issues
const CodeMirror = dynamic(
  () => import('@uiw/react-codemirror').then(mod => mod.default),
  { ssr: false }
)

interface QueryResult {
  columns: string[]
  rows: any[]
  rowCount: number
  executionTime: string
}

interface QueryHistory {
  id: string
  query: string
  timestamp: string
  status: 'success' | 'error'
  isSaved?: boolean
  name?: string
}

interface SavedQuery {
  id: string
  name: string
  query: string
  timestamp: string
}

const SQLTerminal: NextPage = () => {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<QueryResult | null>(null)
  const [history, setHistory] = useState<QueryHistory[]>([])
  const [savedQueries, setSavedQueries] = useState<SavedQuery[]>([])
  const [showSavedQueries, setShowSavedQueries] = useState(false)
  const [selectedDatabase, setSelectedDatabase] = useState('quickbooks')
  const { isDevMode, toggleDevMode, addNotification } = useDevMode()

  // Update schema when database selection changes
  useEffect(() => {
    schemaService.setCurrentSchema(selectedDatabase)
  }, [selectedDatabase])

  // CodeMirror extensions
  const extensions = [
    sql(),
    oneDark,
    autocompletion({
      override: [schemaService.getCompletions.bind(schemaService)]
    }),
    linter(schemaService.lint.bind(schemaService)),
    EditorView.theme({
      '.cm-diagnostic': {
        padding: '2px 0',
      },
      '.cm-diagnostic-error': {
        borderBottom: '2px wavy #f87171',
      },
      '.cm-tooltip.cm-tooltip-autocomplete': {
        '& > ul > li': {
          padding: '4px 8px',
        },
        '& > ul > li[aria-selected]': {
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
        },
      },
      '.cm-completionIcon': {
        padding: '0 4px',
        opacity: '0.7',
      },
      '.cm-completionIcon-keyword': {
        color: '#93c5fd',
      },
      '.cm-completionIcon-function': {
        color: '#c084fc',
      },
      '.cm-completionIcon-type': {
        color: '#86efac',
      },
      '.cm-completionIcon-property': {
        color: '#fcd34d',
      },
      '.cm-completionDetail': {
        marginLeft: '8px',
        opacity: '0.5',
      },
      '.cm-completionInfo': {
        padding: '8px',
        maxWidth: '300px',
        maxHeight: '200px',
        overflow: 'auto',
      },
    })
  ]

  const handleSaveQuery = () => {
    if (!query.trim()) return

    const name = prompt('Enter a name for this query:')
    if (!name) return

    const savedQuery = {
      id: Date.now().toString(),
      name,
      query: query.trim(),
      timestamp: new Date().toISOString()
    }

    setSavedQueries(prev => [savedQuery, ...prev])
    addNotification({
      type: 'success',
      message: 'Query saved',
      details: `"${name}" has been saved to your queries`
    })
  }

  const handleLoadQuery = (savedQuery: SavedQuery) => {
    setQuery(savedQuery.query)
    setShowSavedQueries(false)
  }

  const executeQuery = async () => {
    if (!query.trim()) return

    setIsLoading(true)
    setError(null)

    addNotification({
      type: 'info',
      message: 'Executing SQL Query',
      details: query.trim()
    })

    try {
      const response = await fetch('/api/sql/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to execute query')
      }

      if (data.rows) {
        setResult(data)
      }
      
      const historyItem = {
        id: Date.now().toString(),
        query,
        timestamp: new Date().toISOString(),
        status: 'success' as const
      }
      setHistory(prev => [historyItem, ...prev])

      addNotification({
        type: 'success',
        message: data.details.message,
        details: data.details.queryType === 'SELECT' 
          ? `Columns: ${data.columns.join(', ')}`
          : `Query Type: ${data.details.queryType}`
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to execute query'
      setError(errorMessage)
      
      const historyItem = {
        id: Date.now().toString(),
        query,
        timestamp: new Date().toISOString(),
        status: 'error' as const
      }
      setHistory(prev => [historyItem, ...prev])

      addNotification({
        type: 'error',
        message: 'Query execution failed',
        details: errorMessage
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Top Navigation Bar */}
      <div className="h-16 border-b border-background-lighter bg-background flex items-center px-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center">
              <CommandLineIcon className="h-5 w-5 text-accent-blue" />
            </div>
            <h1 className="text-lg font-semibold text-text-primary">SQL Terminal</h1>
          </div>
          <div className="h-8 w-[1px] bg-background-lighter" />
          <div className="flex items-center gap-2 px-3 py-2 bg-background-lighter/50 rounded-lg border border-background-lighter hover:border-accent-blue/30 transition-colors cursor-pointer">
            <FolderIcon className="h-4 w-4 text-text-secondary" />
            <select 
              value={selectedDatabase}
              onChange={(e) => setSelectedDatabase(e.target.value)}
              className="bg-transparent text-sm text-text-primary border-none focus:ring-0 cursor-pointer"
            >
              <option value="quickbooks">Quickbooks</option>
              <option value="stripe">Stripe</option>
              <option value="shopify">Shopify</option>
            </select>
            <ChevronDownIcon className="h-4 w-4 text-text-secondary" />
          </div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={() => setShowSavedQueries(!showSavedQueries)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg text-sm
              transition-all duration-200
              ${showSavedQueries 
                ? 'bg-accent-blue/10 text-accent-blue' 
                : 'text-text-secondary hover:bg-background-lighter hover:text-text-primary'
              }
            `}
          >
            <BookmarkIcon className="h-4 w-4" />
            Saved Queries
          </button>
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-background-lighter hover:text-text-primary transition-colors"
          >
            <SparklesIcon className="h-4 w-4" />
            AI Assistant
          </button>
          <div className="h-8 w-[1px] bg-background-lighter" />
          <button className="p-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-background-lighter transition-colors">
            <Bars3Icon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Editor Section */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Editor Toolbar */}
          <div className="h-12 border-b border-background-lighter bg-background px-4 flex items-center gap-3">
            <button
              onClick={executeQuery}
              disabled={isLoading || !query.trim()}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm
                bg-accent-blue text-white hover:bg-accent-blue/90
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors
              `}
            >
              <PlayIcon className="h-4 w-4" />
              {isLoading ? 'Executing...' : 'Execute'}
            </button>
            <button
              onClick={handleSaveQuery}
              disabled={!query.trim()}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-background-lighter transition-colors"
            >
              <BookmarkIcon className="h-4 w-4" />
              Save
            </button>
            <div className="h-6 w-[1px] bg-background-lighter" />
            <button className="p-1.5 text-text-secondary hover:text-text-primary rounded-lg hover:bg-background-lighter transition-colors">
              <TableCellsIcon className="h-4 w-4" />
            </button>
            <button className="p-1.5 text-text-secondary hover:text-text-primary rounded-lg hover:bg-background-lighter transition-colors">
              <ArrowPathIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Query Editor */}
          <div className="flex-1 overflow-hidden">
            <CodeMirror
              value={query}
              height="100%"
              onChange={value => setQuery(value)}
              theme={oneDark}
              extensions={extensions}
              basicSetup={{
                lineNumbers: true,
                highlightActiveLineGutter: true,
                highlightActiveLine: true,
                bracketMatching: true,
                closeBrackets: true,
                autocompletion: true,
                foldGutter: true,
                indentOnInput: true,
                syntaxHighlighting: true,
              }}
            />
          </div>

          {/* Results Section */}
          {(result || error) && (
            <div className="h-1/2 border-t border-background-lighter flex flex-col">
              {/* Results Toolbar */}
              <div className="h-12 border-b border-background-lighter bg-background px-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {error ? (
                    <div className="flex items-center gap-2 text-accent-red">
                      <XMarkIcon className="h-4 w-4" />
                      <span className="text-sm font-medium">Error</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-accent-green">
                        <CheckCircleIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">Success</span>
                      </div>
                      <div className="h-6 w-[1px] bg-background-lighter" />
                      <span className="text-sm text-text-secondary">
                        {result?.rowCount} rows • {result?.executionTime}
                      </span>
                    </>
                  )}
                </div>
                {!error && (
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-background-lighter transition-colors">
                    <DocumentTextIcon className="h-4 w-4" />
                    Export
                  </button>
                )}
              </div>

              {/* Results Content */}
              <div className="flex-1 overflow-auto">
                {error ? (
                  <div className="p-4">
                    <p className="text-accent-red text-sm">{error}</p>
                  </div>
                ) : result && (
                  <table className="w-full border-collapse">
                    <thead className="bg-background sticky top-0">
                      <tr>
                        {result.columns.map(column => (
                          <th key={column} className="px-4 py-2 text-left text-xs font-medium text-text-secondary border-b border-background-lighter">
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.rows.map((row, i) => (
                        <tr key={i} className="hover:bg-background-lighter/50">
                          {result.columns.map(column => (
                            <td key={column} className="px-4 py-2 text-sm text-text-primary border-b border-background-lighter">
                              {row[column]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l border-background-lighter bg-background flex flex-col">
          {/* Saved Queries Panel */}
          {showSavedQueries && (
            <div className="flex-1 overflow-auto">
              <div className="p-4 border-b border-background-lighter">
                <div className="flex items-center gap-2">
                  <BookmarkIcon className="h-5 w-5 text-text-secondary" />
                  <h2 className="text-sm font-semibold text-text-primary">Saved Queries</h2>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {savedQueries.map(query => (
                  <div
                    key={query.id}
                    className="group p-3 rounded-lg bg-background-lighter/50 hover:bg-background-lighter transition-colors cursor-pointer"
                    onClick={() => handleLoadQuery(query)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-text-primary group-hover:text-accent-blue">
                        {query.name}
                      </span>
                      <span className="text-xs text-text-secondary">
                        {new Date(query.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary font-mono truncate">
                      {query.query}
                    </p>
                  </div>
                ))}
                {savedQueries.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-text-secondary">
                    <BookmarkIcon className="h-8 w-8 mb-2" />
                    <p className="text-sm">No saved queries yet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Query History */}
          <div className={`${showSavedQueries ? 'h-1/2' : 'flex-1'} flex flex-col border-t border-background-lighter`}>
            <div className="p-4 border-b border-background-lighter">
              <div className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5 text-text-secondary" />
                <h2 className="text-sm font-semibold text-text-primary">Query History</h2>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <div className="p-4 space-y-3">
                {history.map(item => (
                  <div
                    key={item.id}
                    className="group p-3 rounded-lg bg-background-lighter/50 hover:bg-background-lighter transition-colors cursor-pointer"
                    onClick={() => setQuery(item.query)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-text-secondary">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                      <span className={`
                        text-xs px-2 py-1 rounded-full
                        ${item.status === 'success' 
                          ? 'bg-accent-green/10 text-accent-green' 
                          : 'bg-accent-red/10 text-accent-red'
                        }
                      `}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary font-mono truncate group-hover:text-text-primary">
                      {item.query}
                    </p>
                  </div>
                ))}
                {history.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-text-secondary">
                    <ClockIcon className="h-8 w-8 mb-2" />
                    <p className="text-sm">No queries yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SQLTerminal 