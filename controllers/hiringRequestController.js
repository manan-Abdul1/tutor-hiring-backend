const HiringRequest = require("../models/hiringRequestSchema");
const Notification = require("../models/notificationSchema");
const Student = require("../models/studentSchema");
const Tutor = require("../models/tutorSchema");
const { sendEmail } = require("../services/mailServices");

// Handle the POST request to create a new hiring request
const createHiringRequest = async (req, res) => {
  try {
    const {
      studentId,
      teacherId,
      location,
      timing,
      topic,
      payment,
      message,
      preferredLocation,
    } = req.body;

    // Create a new hiring request
    const newRequest = new HiringRequest({
      studentId,
      teacherId,
      location,
      timing: new Date(timing),
      topic,
      payment,
      message,
      preferredLocation,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    // Save the hiring request to the database
    await newRequest.save();

    // Create a notification for the teacher
    const notification = new Notification({
      userId: teacherId,
      message: `Hi ${tutorName}\n\n,
      You have a new hiring request from a student. Here are the details:\n
      - Location: ${location}\n
      - Timing: ${timing}\n
      - Topic: ${topic}\n
      - Payment: ${payment}\n
      - Message: ${message}\n`,
      eventType: "new_hiring_request",
      eventDetails: { requestId: newRequest._id },
    });

    // Save the notification to the database
    await notification.save();

    // Send an email notification to the teacher (optional)
    const { email, name: tutorName } = await Tutor.findOne({ _id: teacherId });
    const recipientEmail = email;

    const emailSubject = "New Hiring Request";
    const emailMessage = `Hi ${tutorName},<br><br>
    You have a new hiring request from a student. Here are the details:<br><br>
    - Location: ${location}<br>
    - Timing: ${timing}<br>
    - Topic: ${topic}<br>
    - Payment: ${payment}<br>
    - Message: ${message}<br><br>
    Please login to your account to respond to this request.<br><br>
    Best regards,<br>
    Private Tutor Hiring System`;

    await sendEmail(recipientEmail, emailSubject, emailMessage);

    res.status(201).json({
      ok: true,
      message: "Hiring request created successfully",
      request: newRequest,
    });
  } catch (error) {
    console.error("Error creating hiring request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getTeacherRequestsById = async (req, res) => {
  try {
    const teacherId = req.query.id;

    const requests = await HiringRequest.find({ teacherId })
      .populate("studentId", "-password")
      .populate("teacherId", "_id name") // Populate the teacherId field with name
      .sort({ createdAt: -1 });

    if (!requests || requests.length === 0) {
      return res.status(404).json({ message: "No requests found", ok: false });
    }

    res.status(200).json({
      requests,
      message: "Requests retrieved successfully",
      ok: true,
    });
  } catch (error) {
    console.error("Error retrieving teacher requests by teacherId:", error);
    res.status(500).json({ message: "Error retrieving requests", ok: false });
  }
};

const getUserRequestsById = async (req, res) => {
  try {
    const studentId = req.query.id;

    const requests = await HiringRequest.find({ studentId })
      .populate("studentId", "-password")
      .populate("teacherId", "_id name") // Populate the teacherId field with name
      .sort({ createdAt: -1 });

    if (!requests || requests.length === 0) {
      return res.status(404).json({ message: "No requests found", ok: false });
    }

    res.status(200).json({
      requests,
      message: "Requests retrieved successfully",
      ok: true,
    });
  } catch (error) {
    console.error("Error retrieving teacher requests by teacherId:", error);
    res.status(500).json({ message: "Error retrieving requests", ok: false });
  }
};

// Update request status by request ID and teacher ID
const updateRequestStatus = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.query, "req.query");
    const requestId = req.query.id;
    console.log(requestId, "requestId");
    const { status, teacherId } = req.body;

    const isRequestBelongsToTeacher = await checkIfRequestBelongsToTeacher(
      requestId,
      teacherId
    );

    if (!isRequestBelongsToTeacher) {
      return res.status(403).json({
        message: "You do not have permission to update this request",
        ok: false,
      });
    }

    const updatedRequest = await HiringRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found", ok: false });
    }

    res.status(200).json({
      updatedRequest,
      message: "Request status updated successfully",
      ok: true,
    });
  } catch (error) {
    console.error("Error updating request status:", error);
    res
      .status(500)
      .json({ message: "Error updating request status", ok: false });
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
    console.error("Error checking request ownership:", error);
    return false;
  }
};

const acceptRequest = async (req, res) => {
  try {
    const requestId = req.query.id;
    const videoId = req.body.videoId;

    const updatedRequest = await HiringRequest.findByIdAndUpdate(
      requestId,
      { status: 'accepted', videoId: videoId },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found", ok: false });
    }

    const studentId = updatedRequest.studentId;
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found", ok: false });
    }

    const studentEmail = student.email;

    const tutorId = updatedRequest.teacherId;
    const tutor = await Tutor.findById(tutorId);

    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found", ok: false });
    }

    const tutorName = tutor ? tutor.name : "Unknown Tutor";

    // Create a new notification for the student
    const newNotification = new Notification({
      userId: studentId,
      message: `Hi ${studentName},\n\nYour hiring request with ${tutorName} has been accepted.`,
      eventType: "request_accepted",
      eventDetails: { requestId: updatedRequest._id },
      createdAt: new Date().toISOString(),
    });

    // Save the new notification to the database
    await newNotification.save();

    // Send an email to the student
    const emailSubject = "Hiring Request Status Update";
    const emailMessage = `
      Hi ${student.name},<br><br>

      We are excited to inform you that your hiring request has been accepted!<br>

      Details of the accepted request:<br>
      - Tutor: ${tutorName}<br>
      - Location: ${updatedRequest.location}<br>
      - Timing: ${updatedRequest.timing}<br>
      - Topic: ${updatedRequest.topic}<br>
      - Payment: ${updatedRequest.payment}<br>
      - Message: ${updatedRequest.message}<br><br>

      Feel free to contact your tutor for further coordination. Thank you for using Private Tutor Hiring System.<br>

      Best regards,<br>
      Private Tutor Hiring System Team<br>
    `;

    await sendEmail(studentEmail, emailSubject, emailMessage);

    res.status(200).json({
      updatedRequest,
      message: "Request accepted successfully",
      ok: true,
    });
  } catch (error) {
    console.error("Error accepting request:", error);
    res.status(500).json({ message: "Error accepting request", ok: false });
  }
};

const rejectRequest = async (req, res) => {
  try {
    const requestId = req.query.id;

    const updatedRequest = await HiringRequest.findByIdAndUpdate(
      requestId,
      { status: "rejected" },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found", ok: false });
    }

    const studentId = updatedRequest.studentId;
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found", ok: false });
    }

    const studentEmail = student.email;
    const studentName = student.name; // Add this line to get the student's name

    const tutorId = updatedRequest.teacherId;
    const tutor = await Tutor.findById(tutorId);

    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found", ok: false });
    }

    const tutorName = tutor.name; // Add this line to get the tutor's name

    // Create a new notification for the student
    const newNotification = new Notification({
      userId: studentId,
      message: `Hi ${studentName},\n\nYour hiring request with ${tutorName} has been rejected.`,
      eventType: "request_rejected",
      eventDetails: { requestId: updatedRequest._id },
      createdAt: new Date().toISOString(),
    });

    // Save the new notification to the database
    await newNotification.save();

    // Send an email to the student
    const emailSubject = "Hiring Request Status Update";
    const emailMessage = `
      Hi ${studentName},<br><br>

      We regret to inform you that your hiring request with ${tutorName} has been rejected.<br>

      Request details:<br>
      - Location: ${updatedRequest.location}<br>
      - Timing: ${updatedRequest.timing}<br>
      - Topic: ${updatedRequest.topic}<br>
      - Payment: ${updatedRequest.payment}<br>
      - Message: ${updatedRequest.message}<br><br>

      Thank you for using Private Tutor Hiring System.<br><br>

      Best regards,<br>
      Private Tutor Hiring System Team<br>
    `;

    await sendEmail(studentEmail, emailSubject, emailMessage);

    res.status(200).json({
      updatedRequest,
      message: "Request rejected successfully",
      ok: true,
    });
  } catch (error) {
    console.error("Error rejecting request:", error);
    res.status(500).json({ message: "Error rejecting request", ok: false });
  }
};

const getAcceptedRequestByTutor = async (req, res) => {
  try {
    const teacherId = req.query.id;

    const requests = await HiringRequest.find({ teacherId })
      .populate("studentId", "-password")
      .sort({ createdAt: -1 });
    const acceptedRequests = requests.filter(
      (req) => req.status === "accepted"
    );
    if (!acceptedRequests || acceptedRequests.length === 0) {
      return res.status(404).json({ message: "No requests found", ok: false });
    }

    res.status(200).json({
      acceptedRequests,
      message: "Requests retrieved successfully",
      ok: true,
    });
  } catch (error) {
    console.error("Error retrieving teacher requests by teacherId:", error);
    res.status(500).json({ message: "Error retrieving requests", ok: false });
  }
};

const getAcceptedUserRequests = async (req, res) => {
  try {
    const studentId = req.query.id;
    const requests = await HiringRequest.find({ studentId })
      .populate("teacherId", "_id name")
      .sort({ createdAt: -1 });

    const acceptedRequests = requests.filter(
      (req) => req.status === "accepted"
    );

    if (!acceptedRequests || acceptedRequests.length === 0) {
      return res
        .status(404)
        .json({ message: "No accepted requests found", ok: false });
    }

    res.status(200).json({
      acceptedRequests,
      message: "Accepted requests retrieved successfully",
      ok: true,
    });
  } catch (error) {
    console.error("Error retrieving accepted requests by studentId:", error);
    res
      .status(500)
      .json({ message: "Error retrieving accepted requests", ok: false });
  }
};

const updateRequestStatusForUser = async (req, res) => {
  try {
    const requestId = req.query.id;

    const updatedRequest = await HiringRequest.findByIdAndUpdate(
      requestId,
      { status: "completed" },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found", ok: false });
    }

    const { studentId } = updatedRequest;
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found", ok: false });
    }

    const studentEmail = student.email;
    const studentName = student.name || "Unknown Student";

    const tutorId = updatedRequest.teacherId;
    const tutor = await Tutor.findById(tutorId);

    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found", ok: false });
    }

    const tutorEmail = tutor.email;
    const tutorName = tutor.name || "Unknown Tutor";

    const newNotificationForTutor = new Notification({
      userId: tutorId,
      message: `Hi ${tutorName},\n\nYour Tutoring Session with ${studentName} has been completed.\n Thank you for using our Private Tutor Hiring System. Blessings!<br><br>Best regards,<br>Private Tutor Hiring System Team`,
      eventType: "request_completed",
      eventDetails: { requestId: updatedRequest._id },
      createdAt: new Date().toISOString(),
    });

    await newNotificationForTutor.save();

    const emailSubject = "Hiring Request Status Update";
    const emailMessageForStudent = `Hi ${studentName},<br><br>Your Tutoring Session has been completed. Thank you for using our Private Tutor Hiring System. Blessings!<br><br>Best regards,<br>Private Tutor Hiring System Team`;
    const emailMessageForTutor = `Hi ${tutorName},<br><br>Your Tutoring Session with ${studentName} has been completed. Thank you for using our Private Tutor Hiring System. Blessings!<br><br>Best regards,<br>Private Tutor Hiring System Team`;

    await Promise.all([
      sendEmail(studentEmail, emailSubject, emailMessageForStudent),
      sendEmail(tutorEmail, emailSubject, emailMessageForTutor),
    ]);

    res.status(200).json({
      updatedRequest,
      message: "Request status updated successfully",
      ok: true,
    });
  } catch (error) {
    console.error("Error updating request status for user:", error);
    res
      .status(500)
      .json({ message: "Error updating request status", ok: false });
  }
};
const updateRequestStatusForTutor = async (req, res) => {
  try {
    const requestId = req.query.id;

    const updatedRequest = await HiringRequest.findByIdAndUpdate(
      requestId,
      { status: "completed" },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found", ok: false });
    }

    const studentId = updatedRequest.studentId;
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found", ok: false });
    }

    const studentEmail = student.email;
    const studentName = student.name || "Unknown Student";

    const tutorId = updatedRequest.teacherId;
    const tutor = await Tutor.findById(tutorId);

    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found", ok: false });
    }

    const tutorEmail = tutor.email;
    const tutorName = tutor.name || "Unknown Tutor";

    const newNotificationForStudent = new Notification({
      userId: studentId,
      message: `Hi ${studentName},\n\nYour Tutoring Session with ${tutorName} has been completed.\n Thank you for using our Private Tutor Hiring System. Blessings!<br><br>Best regards,<br>Private Tutor Hiring System Team`,
      eventType: "request_completed",
      eventDetails: { requestId: updatedRequest._id },
      createdAt: new Date().toISOString(),
    });

    await newNotificationForStudent.save();

    const emailSubject = "Hiring Request Status Update";
    const emailMessageForStudent = `Hi ${studentName},<br><br>Your Tutoring Session with ${tutorName} has been completed. Thank you for using our Private Tutor Hiring System. Blessings!<br><br>Best regards,<br>Private Tutor Hiring System Team`;
    const emailMessageForTutor = `Hi ${tutorName},<br><br>The Tutoring Session with ${studentName} has been completed. Thank you for using our Private Tutor Hiring System. Blessings!<br><br>Best regards,<br>Private Tutor Hiring System Team`;

    await Promise.all([
      sendEmail(studentEmail, emailSubject, emailMessageForStudent),
      sendEmail(tutorEmail, emailSubject, emailMessageForTutor),
    ]);

    res.status(200).json({
      updatedRequest,
      message: "Request status updated successfully",
      ok: true,
    });
  } catch (error) {
    console.error("Error updating request status for tutor:", error);
    res
      .status(500)
      .json({ message: "Error updating request status", ok: false });
  }
};
const updateRequestVideoStatus = async (req, res) => {
  try {
    const videoId = req.query.videoId;

    const updatedRequest = await HiringRequest.findOneAndUpdate(
      { videoId },
      { isVideoEnded: true },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found', ok: false });
    }

    res.status(200).json({
      updatedRequest,
      message: 'Video has been successfully ended.',
      ok: true,
    });
  } catch (error) {
    console.error('Error updating request status for tutor:', error);
    res.status(500).json({ message: 'Error updating request status', ok: false });
  }
};
const checkVideoStatus = async (req, res) => {
  try {
    const videoId = req.query.videoId;

    // Find the hiring request associated with the videoId
    const hiringRequest = await HiringRequest.findOne({ videoId });
    
    // Check if the hiring request exists
    if (!hiringRequest) {
      return res.status(404).json({ message: 'Video not found.', ok: false });
    }
    
    // Check if the video has been ended
    if (!hiringRequest.isVideoEnded) {
      return res.status(200).json({ message: 'Video has not been ended.', ok: true, isVideoEnded: false });
    }

    // If the video has been ended
    res.status(200).json({ message: 'Video has been ended.', ok: true, isVideoEnded: true });
  } catch (error) {
    console.error('Error checking video status:', error);
    res.status(500).json({ message: 'Error checking video status', ok: false });
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
  updateRequestStatusForTutor,
  updateRequestVideoStatus,
  checkVideoStatus
};
