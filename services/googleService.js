const { sendEmail } = require('./mailServices'); 
const {
  getAccessUrl,
  getAccessToken,
  createEvent,
  listEvents,
} = require('./googleCalendar'); // Import the Google Calendar functions

// Generate a meeting link and send an email
async function sendMeetingInvite(params, code) {
  try {
    // Step 1: Get the access token using the authorization code
    const token = await getAccessToken(code);

    // Step 2: Generate a meeting link and create a Google Calendar event
    const event = {
      name: params?.name,
      location: 'KIIT University',
      description: params?.code,
      date: params?.date,
      startTime: params?.startTime,
      endTime: params?.endTime,
      attendees: params?.attendees,
    };

    const meetingLink = await createEvent(event, token);

    // Step 3: Send an email with the meeting link
    const emailSubject = 'Meeting Invitation';
    const emailMessage = `You are invited to a meeting. Join the meeting using this link: ${meetingLink}`;

    // Replace with the recipient's email address
    const recipientEmail = 'recipient@example.com';

    await sendEmail(recipientEmail, emailSubject, emailMessage);

    return { message: 'Meeting invite sent successfully', ok: true };
  } catch (error) {
    console.error('Error sending meeting invite:', error);
    throw error;
  }
}

module.exports = { sendMeetingInvite };
