const HiringRequest = require('../models/hiringRequestSchema');
const Notification = require('../models/notificationSchema');
const Student = require('../models/studentSchema');
const Tutor = require('../models/tutorSchema');
const { sendEmail } = require('../services/mailServices');

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

    // Save the hiring request to the database
    await newRequest.save();

    // Create a notification for the teacher
    const notification = new Notification({
      userId: teacherId,
      message: 'You have a new hiring request',
      eventType: 'new_hiring_request',
      eventDetails: { requestId: newRequest._id },
    });

    // Save the notification to the database
    await notification.save();

    // Send an email notification to the teacher (optional)
    const { email } = await Tutor.findOne({ _id: teacherId });
    const recipientEmail = email;
    const emailSubject = 'New Hiring Request';
    const emailMessage = 'You have a new hiring request';

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

    const requests = await HiringRequest.find({ teacherId }).populate('studentId', '-password');;

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

    // Create a new notification for the student
    const newNotification = new Notification({
      userId: studentId, // Student's ID
      message: 'Your hiring request has been accepted.', // Notification message
      eventType: 'request_accepted', // Event type for request acceptance
      eventDetails: { requestId: updatedRequest._id }, // Event details with request ID
      createdAt: new Date().toISOString(), // Timestamp
    });

    // Save the new notification to the database
    await newNotification.save();

    // Send an email to the student
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

    // Create a new notification for the student
    const newNotification = new Notification({
      userId: studentId, // Student's ID
      message: 'Your hiring request has been rejected.', // Notification message
      eventType: 'request_rejected', // Event type for request rejection
      eventDetails: { requestId: updatedRequest._id }, // Event details with request ID
      createdAt: new Date().toISOString(), // Timestamp
    });

    // Save the new notification to the database
    await newNotification.save();

    // Send an email to the student
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

const getAcceptedRequestByTutor = async (req, res) => {
  try {
    const teacherId = req.query.id;

    const requests = await HiringRequest.find({ teacherId }).populate('studentId', '-password');;
    const acceptedRequests = requests.filter(req => req.status === "accepted");
    if (!acceptedRequests || acceptedRequests.length === 0) {
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

const getAcceptedUserRequests = async (req, res) => {
  try {
    const studentId = req.query.id; 
    const requests = await HiringRequest.find({ studentId }).populate('teacherId', '_id');

    const acceptedRequests = requests.filter(req => req.status === "accepted");

    if (!acceptedRequests || acceptedRequests.length === 0) {
      return res.status(404).json({ message: 'No accepted requests found', ok: false });
    }

    res.status(200).json({
      acceptedRequests,
      message: 'Accepted requests retrieved successfully',
      ok: true,
    });
  } catch (error) {
    console.error('Error retrieving accepted requests by studentId:', error);
    res.status(500).json({ message: 'Error retrieving accepted requests', ok: false });
  }
};
module.exports = {
  createHiringRequest,
  getTeacherRequestsById,
  updateRequestStatus,
  acceptRequest,
  rejectRequest,
  getAcceptedRequestByTutor,
  getAcceptedUserRequests
};
