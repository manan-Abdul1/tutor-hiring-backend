const { google } = require('googleapis');
const { v4: uuidv4 } = require('uuid');

// Load your service account JSON key file (downloaded in step 1)
const keyFile = require('../connection/credentials.json');
const apiKey="AIzaSyDVjc7QlmB-0D9JsW43mk9RE7l_KWAu3qs"

// Initialize the Google Calendar API client
const calendar = google.calendar({
  version: 'v3',
  auth: new google.auth.GoogleAuth({
    credentials: keyFile,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  }),
});

// Define event details
const eventDetails = {
  summary: 'Meeting Name',
  description: 'Meeting Description',
  start: {
    dateTime: '2023-10-01T09:00:00', // Replace with your desired date and time
    timeZone: 'Asia/Karachi', // Corrected time zone format
  },
  end: {
    dateTime: '2023-10-01T10:00:00', // Replace with your desired end time
    timeZone: 'Asia/Karachi', // Corrected time zone format
  },
};

// Create a Google Calendar event
// Create a Google Calendar event
calendar.events.insert(
    {
      calendarId: 'primary', // Use 'primary' for the primary calendar
      resource: eventDetails,
    },
    async (err, res) => {
      if (err) {
        console.error('Error creating event:', err);
        return;
      }
  
      console.log('Full Response:', res); // Log the entire response
  
      // Extract the Hangouts Meet link from the response
      const meetingLink = res.data.hangoutLink;
  
      console.log('Meeting Link:', meetingLink);
  
      // You can use the 'meetingLink' as needed
    }
  );
  
