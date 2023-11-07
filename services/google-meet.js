function generateApiKey() {
    const uuid = require('uuid');
  
    // Generate a UUID
    const apiKey = uuid.v4();
  
    return apiKey;
  }
  
  async function generateMeetLink(eventId, apiKey) {
    if (!apiKey) {
      throw new Error('API key is required.');
    }
  
    const response = await fetch(`https://meet.googleapis.com/v1/calls/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        eventId,
      }),
    });
  
    if (response.status === 200) {
      const meetingId = await response.json();
      return `https://meet.google.com/${meetingId}`;
    } else {
      console.error('Google Meet API Error:', response.status);
      const errorResponse = await response.text();
      console.error('Error Response:', errorResponse);
      throw new Error('Failed to generate Google Meet link.');
    }
  }
  
  // Example usage:
  
  const apiKey = generateApiKey();
  generateMeetLink('0i01rrfvmo3fh40ihg5iicsvg0', apiKey)
    .then((meetingLink) => {
      console.log('Meeting Link:', meetingLink);
    })
    .catch((error) => {
      console.error('Error:', error.message);
    });
  
  
  // Output: https://meet.google.com/unique-id
  