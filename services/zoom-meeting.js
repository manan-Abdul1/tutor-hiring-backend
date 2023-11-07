const apiKey = 'OIpoYsPTQmehVkeIgj09Mg';
const apiSecret = 'dWgb8FaR8lvlTEPSUBlWjcdVXVUggW2C';
const { ZoomSDK } = require('@zoomus/websdk');

const sdk = new ZoomSDK({
    clientId: apiKey,
    clientSecret: apiSecret,
});

const jwtToken = sdk.generateJWTToken({
    iss: apiKey,
    exp: Math.floor(Date.now() / 1000) + (60 * 60), // Token expires in 1 hour
});

const axios = require('axios');

axios.post('https://api.zoom.us/v2/users/me/meetings', {
    topic: 'Meeting Topic',
    type: 2,
    start_time: '2022-03-01T12:00:00Z',
    duration: 60,
    settings: {
        join_before_host: true,
        mute_upon_entry: true,
        waiting_room: true,
    },
}, {
    headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
    },
})
    .then(response => {
        console.log('Meeting created successfully:', response.data);
        const meetingLink = response.data.join_url;
        console.log('Meeting Link:', meetingLink);
    })
    .catch(error => {
        console.error('Error creating meeting:', error.response.data);
    });
