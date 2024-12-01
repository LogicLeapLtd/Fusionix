import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REDIRECT_URI) {
  throw new Error('Missing required Google OAuth environment variables');
}

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Scopes for Google Analytics and Google Ads
const SCOPES = {
  'google-analytics': [
    'https://www.googleapis.com/auth/analytics.readonly',
    'https://www.googleapis.com/auth/analytics.edit',
  ],
  'google-ads': [
    'https://www.googleapis.com/auth/adwords',
  ],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { service } = req.query;
  const { connectionName, syncInterval, selectedTables } = req.body;
  
  if (!service || typeof service !== 'string' || !SCOPES[service as keyof typeof SCOPES]) {
    return res.status(400).json({ error: 'Invalid service' });
  }

  try {
    // Store connection details in session or database
    // This is where you'd typically save the setup configuration
    
    // Generate OAuth URL with additional state parameters
    const stateData = {
      service,
      connectionName,
      syncInterval,
      selectedTables
    };

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES[service as keyof typeof SCOPES],
      state: JSON.stringify(stateData),
      prompt: 'consent',
      include_granted_scopes: true
    });

    res.status(200).json({ authUrl: url });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ 
      error: 'Failed to generate auth URL',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 