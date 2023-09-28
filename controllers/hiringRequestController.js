const HiringRequest = require('../models/hiringRequestSchema');
const Student = require('../models/studentSchema');
const Tutor = require('../models/tutorSchema');
const { sendEmail } = require('../services/mailServices');

// Handle the POST request to create a new hiring request
const createHiringRequest = async (req, res) => {
  try {
    const { studentId, teacherId, location, timing, topic, payment } = req.body;

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
    
    await newRequest.save();
    
    const { email } = await Tutor.findOne({ _id: teacherId });
    const recipientEmail = email;
    const emailSubject = 'New Hiring Request';
    const emailMessage = 'You have a new Request';

    await sendEmail(recipientEmail, emailSubject, emailMessage);

    res.status(201).json({ message: 'Hiring request created successfully', request: newRequest });
  } catch (error) {
    console.error('Error creating hiring request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getTeacherRequestsById = async (req, res) => {
  try {
    const teacherId = req.query.id;

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

// Update request status by request ID and teacher ID
const updateRequestStatus = async (req, res) => {
  try {
    console.log(req.body)
    console.log(req.query, 'req.query')
    const requestId = req.query.id;
    console.log(requestId, 'requestId')
    const { status, teacherId } = req.body;

    const isRequestBelongsToTeacher = await checkIfRequestBelongsToTeacher(requestId, teacherId);

    if (!isRequestBelongsToTeacher) {
      return res.status(403).json({ message: 'You do not have permission to update this request', ok: false });
    }

    const updatedRequest = await HiringRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found', ok: false });
    }

    res.status(200).json({
      updatedRequest,
      message: 'Request status updated successfully',
      ok: true,
    });
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({ message: 'Error updating request status', ok: false });
  }
};

// Check if the request belongs to the teacher
const checkIfRequestBelongsToTeacher = async (requestId, teacherId) => {
  try {
    const request = await HiringRequest.findById(requestId);

    if (!request || request.teacherId.toString() !== teacherId) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking request ownership:', error);
    return false; 
  }
};

const acceptRequest = async (req, res) => {
  try {
    const requestId = req.query.id;

    const updatedRequest = await HiringRequest.findByIdAndUpdate(
      requestId,
      { status: 'accepted' },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found', ok: false });
    }
    const studentId = updatedRequest.studentId;
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found', ok: false });
    }

    const studentEmail = student.email;
      
    const emailSubject = 'Hiring Request Status Update';
    const emailMessage = `Your hiring request has been accepted.`;

    await sendEmail(studentEmail, emailSubject, emailMessage);

    res.status(200).json({
      updatedRequest,
      message: 'Request accepted successfully',
      ok: true,
    });
  } catch (error) {
    console.error('Error accepting request:', error);
    res.status(500).json({ message: 'Error accepting request', ok: false });
  }
};

const rejectRequest = async (req, res) => {
  try {
    const requestId = req.query.id;

    const updatedRequest = await HiringRequest.findByIdAndUpdate(
      requestId,
      { status: 'rejected' },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found', ok: false });
    }
    const studentId = updatedRequest.studentId;
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found', ok: false });
    }

    const studentEmail = student.email; 
    const emailSubject = 'Hiring Request Status Update';
    const emailMessage = `Your hiring request has been rejected.`;

    await sendEmail(studentEmail, emailSubject, emailMessage);

    res.status(200).json({
      updatedRequest,
      message: 'Request rejected successfully',
      ok: true,
    });
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({ message: 'Error rejecting request', ok: false });
  }
};

const getAcceptedRequest = async (req, res) => {
  try {
    const teacherId = req.query.id;

    const requests = await HiringRequest.find({ teacherId });
    const acceptedRequests = requests.filter(req=>req.status==="accepted");
    if (!acceptedRequests  || acceptedRequests.length === 0) {
      return res.status(404).json({ message: 'No requests found', ok: false });
    }

    res.status(200).json({
      acceptedRequests,
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
  getTeacherRequestsById,
  updateRequestStatus,
  acceptRequest,
  rejectRequest,
  getAcceptedRequest
};
