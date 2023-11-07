const HiringRequest = require('../models/hiringRequestSchema');
const Notification = require('../models/notificationSchema');
const Student = require('../models/studentSchema');
const Tutor = require('../models/tutorSchema');
const generateMeetLink = require('../services/googleMeetServices');
const { sendMeetingInvite } = require('../services/googleService');
const { sendEmail } = require('../services/mailServices');
const { v4: uuidv4 } = require('uuid');

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

    res.status(201).json({ ok:true, message: 'Hiring request created successfully', request: newRequest });
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

const getUserRequestsById = async (req, res) => {
  try {
    const studentId = req.query.id;

    const requests = await HiringRequest.find({ studentId }).populate('teacherId', '_id name');;

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

// const generateMeetLink = ({ meetingType }) => {

//   const uniqueId = uuidv4();

//   if (meetingType === 'online' || meetingType === 'both') {
//     // Customize the link with the user's name
//     return `https://meet.google.com/${uniqueId}`;
//   }

// };

const acceptRequest = async (req, res) => {
  try {
    const requestId = req.query.id;

    const updatedRequest = await HiringRequest.findByIdAndUpdate(
      requestId,
      { status: 'accepted' },
      { new: true }
    ).sort({createdAt:-1});
    console.log(updatedRequest,'updatedRequest')
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found', ok: false });
    }

    const studentId = updatedRequest.studentId;
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found', ok: false });
    }

    const studentEmail = student.email;
    const meetLink = sendMeetingInvite(updatedRequest.timing,updatedRequest.updatedAt);


    // const meetLink = generateMeetLink(updatedRequest.timing,updatedRequest.updatedAt);

    // Create a new notification for the student with the Meet link
    const newNotification = new Notification({
      userId: studentId,
      message: 'Your hiring request has been accepted.',
      eventType: 'request_accepted',
      eventDetails: {
        requestId: updatedRequest._id,
        meetingLink: meetLink, 
      },
      createdAt: new Date().toISOString(),
    });

    // Save the new notification to the database
    await newNotification.save();

    // Send an email to the student with the Meet link
    const emailSubject = 'Hiring Request Status Update';
    const emailMessage = `Your hiring request has been accepted. You can join the meeting using this link: ${meetLink}`;

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
    ).sort({createdAt:-1});

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

    const requests = await HiringRequest.find({ teacherId }).populate('studentId', '-password').sort({createdAt:-1});
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
    const requests = await HiringRequest.find({ studentId }).populate('teacherId', '_id name').sort({createdAt:-1});

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

const updateRequestStatusForUser = async (req, res) => {
  try {
    const requestId = req.query.id;

    const updatedRequest = await HiringRequest.findByIdAndUpdate(
      requestId,
      { status: 'completed' },
      { new: true }
    ).sort({createdAt:-1});

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found', ok: false });
    }

    const {studentId} = updatedRequest;
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found', ok: false });
    }

    const studentEmail = student.email;

    const tutorId = updatedRequest.teacherId;
    const tutor = await Tutor.findById(tutorId);

    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found', ok: false });
    }

    const tutorEmail = tutor.email;

    const newNotificationForTutor = new Notification({
      userId: tutorId,
      message: 'The hiring request has been completed.',
      eventType: 'request_completed',
      eventDetails: { requestId: updatedRequest._id },
      createdAt: new Date().toISOString(),
    });

    await newNotificationForTutor.save();

    const emailSubject = 'Hiring Request Status Update';
    const emailMessageForStudent = 'Your hiring request has been completed.';
    const emailMessageForTutor = 'The hiring request has been completed.';

    await Promise.all([
      sendEmail(studentEmail, emailSubject, emailMessageForStudent),
      sendEmail(tutorEmail, emailSubject, emailMessageForTutor),
    ]);

    res.status(200).json({
      updatedRequest,
      message: 'Request status updated successfully',
      ok: true,
    });
  } catch (error) {
    console.error('Error updating request status for user:', error);
    res.status(500).json({ message: 'Error updating request status', ok: false });
  }
};

const updateRequestStatusForTutor = async (req, res) => {
  try {
    const requestId = req.query.id;

    const updatedRequest = await HiringRequest.findByIdAndUpdate(
      requestId,
      { status: 'completed' },
      { new: true }
    ).sort({createdAt:-1});

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found', ok: false });
    }

    const studentId = updatedRequest.studentId;
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found', ok: false });
    }

    const studentEmail = student.email;


    const newNotificationForStudent = new Notification({
      userId: studentId,
      message: 'Your hiring request has been completed.',
      eventType: 'request_completed',
      eventDetails: { requestId: updatedRequest._id },
      createdAt: new Date().toISOString(),
    });

    await newNotificationForStudent.save();

    const tutorId = updatedRequest.teacherId;
    const tutor = await Tutor.findById(tutorId);

    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found', ok: false });
    }

    const tutorEmail = tutor.email;

    const emailSubject = 'Hiring Request Status Update';
    const emailMessageForStudent = 'Your hiring request has been completed.';
    const emailMessageForTutor = 'The hiring request has been completed.';

    await Promise.all([
      sendEmail(studentEmail, emailSubject, emailMessageForStudent),
      sendEmail(tutorEmail, emailSubject, emailMessageForTutor),
    ]);

    res.status(200).json({
      updatedRequest,
      message: 'Request status updated successfully',
      ok: true,
    });
  } catch (error) {
    console.error('Error updating request status for tutor:', error);
    res.status(500).json({ message: 'Error updating request status', ok: false });
  }
};

module.exports = {
  createHiringRequest,
  getTeacherRequestsById,
  getUserRequestsById,
  updateRequestStatus,
  acceptRequest,
  rejectRequest,
  getAcceptedRequestByTutor,
  getAcceptedUserRequests,
  updateRequestStatusForUser,
  updateRequestStatusForTutor
};
