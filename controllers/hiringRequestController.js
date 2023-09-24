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
const getTeacherRequestsById = async (req, res) => {
  try {
    const teacherId = req.query.id;

    // const requests = await HiringRequest.find({ teacherId });
    const requests = await HiringRequest.find({ teacherId }).populate('studentId');

    if (!requests || requests.length === 0) {
      return res.status(404).json({ message: 'No requests found', ok: false });
    }

    res.status(200).json({
      requests,
      message: 'Requests retrieved successfully',
      ok: true,
    });
  } catch (error) {
    console.error('Error retrieving teacher requests by teacherId:', error);
    res.status(500).json({ message: 'Error retrieving requests', ok: false });
  }
};




module.exports = {
  createHiringRequest,
  getTeacherRequestsById
};
