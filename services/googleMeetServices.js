const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

const clientID = '400464990383-v4k3kkhsmt34ass5jasp31a3vnav9cev.apps.googleusercontent.co'; 
const clientSecret = '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'; 
const redirectURI = 'http://localhost:3000/'; 

const oauth2Client = new OAuth2Client(clientID, clientSecret, redirectURI);

const generateMeetLink = async (startTime, endTime) => {
  try {
    // Create a Google Meet event
    const event = {
      summary: "Meeting with Student",
      start: {
        dateTime: startTime,
        timeZone: "Asia/Karachi", // Set to your desired time zone
      },
      end: {
        dateTime: endTime,
        timeZone: "Asia/Karachi", // Set to your desired time zone
      },
      conferenceData: {
        createRequest: {
          requestId: "SOME_UNIQUE_ID",
        },
      },
    };

    // Insert the event into Google Calendar
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const response = await calendar.events.insert({
      calendarId: "primary", // Use 'primary' for the user's primary calendar
      resource: event,
    });

    const meetLink = response.data.hangoutLink;
    return meetLink;
  } catch (error) {
    console.error('Error generating Meet link:', error);
    throw error;
  }
};

module.exports = generateMeetLink;
