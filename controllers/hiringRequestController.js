const HiringRequest = require('../models/hiringRequestSchema'); 

// Handle the POST request to create a new hiring request
const createHiringRequest = async (req, res) => {
  try {
    const { studentId, teacherId, location, timing, topic, payment } = req.body;

    // Create a new hiring request
    const newRequest = new HiringRequest({
      studentId,
      teacherId,
      location,
      timing: new Date(timing),
      topic,
      payment,
      status: 'pending',
      createdAt: new Date().toISOString(), 
    });

    // Save the request to the database
    await newRequest.save();

    // Respond with a success message or the newly created request
    res.status(201).json({ message: 'Hiring request created successfully', request: newRequest });
  } catch (error) {
    console.error('Error creating hiring request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createHiringRequest,
};
