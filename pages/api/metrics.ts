import type { NextApiRequest, NextApiResponse } from 'next'
import { Metric } from '../../hooks/useMetrics'

// TODO: Replace with actual database queries
const mockMetrics: Metric[] = [
  { 
    title: 'Total Revenue',
    value: '$24,567',
    change: '+12.5%',
    trend: 'up',
    timeframe: 'vs last month'
  },
  {
    title: 'Active Users',
    value: '1,234',
    change: '+23.1%',
    trend: 'up',
    timeframe: 'vs last month'
  },
  {
    title: 'Conversion Rate',
    value: '2.4%',
    change: '-0.3%',
    trend: 'down',
    timeframe: 'vs last month'
  }
]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Metric[]>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
    return
  }

  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // TODO: Replace with actual database query
    res.status(200).json(mockMetrics)
  } catch (error) {
    console.error('Error fetching metrics:', error)
    res.status(500).end('Internal Server Error')
  }
} 