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

async function getGoogleAnalyticsProperties(auth: OAuth2Client) {
  const analyticsAdmin = google.analyticsadmin({ version: 'v1beta', auth });
  
  try {
    // First get the accounts
    const accountsResponse = await analyticsAdmin.accounts.list();
    const accounts = accountsResponse.data.accounts || [];

    // For each account, get its properties
    const accountsWithProperties = await Promise.all(accounts.map(async (account) => {
      try {
        const propertiesResponse = await analyticsAdmin.properties.list({
          filter: `parent:${account.name}`,
          showDeleted: false
        });

        return {
          id: account.name!,
          name: account.displayName || 'Unnamed Account',
          properties: (propertiesResponse.data.properties || []).map(property => ({
            id: property.name!,
            name: property.displayName || 'Unnamed Property',
            type: 'GA4 Property'
          }))
        };
      } catch (error) {
        console.error(`Error fetching properties for account ${account.name}:`, error);
        return {
          id: account.name!,
          name: account.displayName || 'Unnamed Account',
          properties: []
        };
      }
    }));

    return accountsWithProperties;
  } catch (error) {
    console.error('Error fetching GA4 accounts:', error);
    throw error;
  }
}

async function getGoogleAdsAccounts(auth: OAuth2Client) {
  const ads = google.ads({
    version: 'v14',
    auth,
  });

  try {
    const response = await ads.customers.list();
    return response.data.results?.map(customer => ({
      id: customer.id!,
      name: customer.descriptiveName || 'Unnamed Account',
      type: 'Ads Account'
    })) || [];
  } catch (error) {
    console.error('Error fetching Google Ads accounts:', error);
    throw error;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code, state, error } = req.query;

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error);
    return res.redirect(302, '/integrations?status=error&error=' + encodeURIComponent(error as string));
  }
  
  if (!code || typeof code !== 'string') {
    return res.redirect(302, '/integrations?status=error&error=no_code');
  }

  try {
    // Parse state data
    const stateData = state ? JSON.parse(state as string) : {};
    const { service, connectionName, syncInterval, selectedTables } = stateData;

    // Exchange the authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Fetch available accounts based on service
    let accounts = [];
    if (service === 'google-analytics') {
      accounts = await getGoogleAnalyticsProperties(oauth2Client);
    } else if (service === 'google-ads') {
      accounts = await getGoogleAdsAccounts(oauth2Client);
    }

    // Store tokens securely (you should implement this)
    // await storeTokens(service, tokens, connectionName);

    // Return accounts data to client
    const successUrl = `/integrations?service=${service}&status=success&accounts=${encodeURIComponent(JSON.stringify({
      accounts,
      connectionName,
      syncInterval,
      selectedTables
    }))}`;
    
    res.redirect(302, successUrl);
  } catch (error) {
    console.error('OAuth callback error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.redirect(302, `/integrations?status=error&error=${encodeURIComponent(errorMessage)}`);
  }
} 