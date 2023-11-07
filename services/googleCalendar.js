const fs = require('fs');
const { google } = require('googleapis');

let oAuth2Client;

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
// const oAuth2Client = new google.auth.OAuth2(
//   'YOUR_CLIENT_ID', // Replace with your client ID
//   'YOUR_CLIENT_SECRET', // Replace with your client secret
//   'YOUR_REDIRECT_URI' // Replace with your redirect URI
// );


// Initialize the OAuth2 client
function initializeClient(credentials) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]
  );
}

// Get the access URL for user authorization
function getAccessUrl() {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  return authUrl;
}

// Get an access token using the authorization code
async function getAccessToken(code) {
  try {
    const token = await oAuth2Client.getToken(code);
    return token.tokens;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// List events from the user's Google Calendar
async function listEvents(token) {
  try {
    oAuth2Client.setCredentials(token);
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items;
  } catch (error) {
    console.error('Error listing events:', error);
    throw error;
  }
}

// Create a new event in the user's Google Calendar
async function createEvent(params, token) {
  try {
    oAuth2Client.setCredentials(token);
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    const event = {
      'summary': params?.name,
      'location': params?.location,
      'description': params?.description,
      'start': {
        'dateTime': `${params?.date}T${params.startTime}:00+05:30`,
        'timeZone': 'Asia/Karachi',
      },
      'end': {
        'dateTime': `${params?.date}T${params?.endTime}:00+05:30`,
        'timeZone': 'Asia/Karachi',
      },
      'attendees': [{ 'email': params?.attendees }],
      'colorId': '1',
      'conferenceData': {
        'conferenceSolution': {
          'key': {
            'type': 'hangoutsMeet'
          }
        },
        'createRequest': {
          'requestId': `random69`
        }
      },
      'reminders': {
        'useDefault': false,
        'overrides': [
          { 'method': 'email', 'minutes': 24 * 60 },
          { 'method': 'popup', 'minutes': 10 },
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}

// Load credentials and initialize the client
fs.readFile('credentials.json', (err, content) => {
  if (err) {
    console.error('Error loading client secret file:', err);
    throw err;
  }
  initializeClient(JSON.parse(content));
});

module.exports = { getAccessUrl, getAccessToken, listEvents, createEvent };
