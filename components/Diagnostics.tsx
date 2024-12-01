import React from 'react'
import { Box, Typography, Button, Grid } from '@mui/material'
import { useDevMode } from '../contexts/DevModeContext'

export const DiagnosticsComponent: React.FC = () => {
  const { addNotification } = useDevMode()

  const runDiagnosticTest = (testName: string) => {
    console.log(`Running ${testName} test...`)
    // Simulate test running
    setTimeout(() => {
      addNotification({
        message: `${testName} test completed successfully`,
        type: 'success'
      })
    }, 1000)
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        System Diagnostics
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ 
            bgcolor: 'background.paper', 
            p: 3, 
            borderRadius: 2,
            boxShadow: 1
          }}>
            <Typography variant="h6" gutterBottom>
              Database Connection Tests
            </Typography>
            <Button 
              variant="outlined" 
              onClick={() => runDiagnosticTest('Database Connection')}
              sx={{ mr: 2, mb: 2 }}
            >
              Test Connection
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => runDiagnosticTest('Query Performance')}
              sx={{ mb: 2 }}
            >
              Test Query Performance
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ 
            bgcolor: 'background.paper', 
            p: 3, 
            borderRadius: 2,
            boxShadow: 1
          }}>
            <Typography variant="h6" gutterBottom>
              API Integration Tests
            </Typography>
            <Button 
              variant="outlined" 
              onClick={() => runDiagnosticTest('API Endpoints')}
              sx={{ mr: 2, mb: 2 }}
            >
              Test Endpoints
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => runDiagnosticTest('Authentication')}
              sx={{ mb: 2 }}
            >
              Test Auth
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ 
            bgcolor: 'background.paper', 
            p: 3, 
            borderRadius: 2,
            boxShadow: 1
          }}>
            <Typography variant="h6" gutterBottom>
              System Health
            </Typography>
            <Button 
              variant="outlined" 
              onClick={() => runDiagnosticTest('Memory Usage')}
              sx={{ mr: 2, mb: 2 }}
            >
              Check Memory
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => runDiagnosticTest('Cache Status')}
              sx={{ mr: 2, mb: 2 }}
            >
              Check Cache
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => runDiagnosticTest('Error Logging')}
              sx={{ mb: 2 }}
            >
              Test Error Logging
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
} 