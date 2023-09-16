const Tutor = require('../models/tutorSchema');

//Register a Tutor
const registerTutor = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    // Check if the tutor with the same email already exists
    const existingTutor = await Tutor.findOne({ email });
    if (existingTutor) {
      return res.status(400).json({ message: 'Tutor with the same email already exists', ok: false });
    }

    // Check if the password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Password and confirmPassword do not match', ok: false });
    }

    // Create a new tutor
    const tutor = new Tutor({ ...req.body, confirmPassword: undefined });

    // Save the tutor to the database
    await tutor.save();
    res.status(201).json({ tutor, message: 'Tutor registered successfully', ok: true });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred during tutor registration', ok: false });
  }
};


//Login
const tutorsLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the tutor exists
    const existingTutor = await Tutor.findOne({ email });
    // If tutor is not found, return error
    if (!existingTutor) {
      return res.status(401).json({ message: 'Tutor does not exist', ok: false });
    }

    // Compare the provided password with the stored password
    if (password !== existingTutor.password) {
      return res.status(401).json({ message: 'Invalid email or password', ok: false });
    }
    const returningTutorData = await Tutor.findOne({ email }).select('-password');
    // Return the tutor details
    res.json({ tutor:returningTutorData, ok: true });
  } catch (error) {
    console.error('Error during tutor login:', error);
    res.status(500).json({ message: 'An error occurred during tutor login', ok: false, status: 500 });
  }
};

// get all teachers
const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Tutor.find({ role: 'tutor' });
    res.status(200).json({ teachers, message: 'Teachers retrieved successfully', ok: true });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving teachers', ok: false });
  }
};
// Get Teacher By ID using query parameter
const getTeacherById = async (req, res) => {
  try {
    const id = req.query._id;
    const teacher = await Tutor.findOne({ _id: id });

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found', ok: false });
    }

    res.status(200).json({ teacher, message: 'Teacher retrieved successfully', ok: true });
  } catch (error) {
    console.error('Error retrieving teacher by ID:', error);
    res.status(500).json({ message: 'Error retrieving teacher', ok: false });
  }
};


// update teacher
const updateTeacher = async (req, res) => {
  try {
    const teachers = await Tutor.find({ role: 'tutor' });
    res.status(200).json({ teachers, message: 'Teachers retrieved successfully', ok: true });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving teachers', ok: false });
  }
};




module.exports = {
  registerTutor,
  tutorsLogin,
  getAllTeachers,
  getTeacherById
};
