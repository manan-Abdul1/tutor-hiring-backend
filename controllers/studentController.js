const Student = require('../models/studentSchema');

// Register a new student
const registerStudent = async (req, res) => {
  try {
    // Extract the registration data from the request body
    const { name, email, password } = req.body;

    // Check if the student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(500).json({ message: 'Student already exists', ok: false });
    }

    // Create a new student instance
    const student = new Student({ name, email, password, role });

    // Save the student to the database
    await student.save();

    res.status(201).json({ message: 'Student registered successfully', ok: true });
  } catch (error) {
    console.error('Error registering student:', error);
    res.status(500).json({ message: 'An error occurred during student registration', ok: false });
  }
};

// Student login
const studentLogin = async (req, res) => {
  try {
    const { email: studentEmail, password } = req.body;

    // Check if the student exists and the password is correct
    const student = await Student.findOne({ email: studentEmail });
    if (!student || student.password !== password) {
      return res.status(401).json({ message: "Invalid email or password", ok: false });
    }

    // Return the email, name, and ID of the student
    const { email, name, _id, role } = student;
    res.status(200).json({ email, name, id: _id, role, ok: true });
  } catch (error) {
    console.error("Error during student login:", error);
    res.status(500).json({ message: "An error occurred during student login", ok: false });
  }
};


// Controller function to update a student
const updateStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, password, email },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found", ok: false });
    }

    // Update email if a new email is provided
    if (email && email !== student.email) {
      student.email = email;
      await student.save();
    }

    res.status(200).json({ student, ok: true });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ message: "Error updating student", ok: false });
  }
};

// Controller function to get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json({ students, ok: true });
  } catch (error) {
    console.error("Error retrieving students:", error);
    res.status(500).json({ message: 'Error retrieving students', ok: false });
  }
};

// Controller function to get a student by ID
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found', ok: false });
    }
    res.status(200).json({ student, ok: true });
  } catch (error) {
    console.error("Error retrieving student:", error);
    res.status(500).json({ message: 'Error retrieving student', ok: false });
  }
};


// Controller function to handle student registration
const createStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student already exists', ok: false });
    }

    // Create a new student instance
    const student = new Student({ name, email, password });

    // Save the student to the database
    await student.save();

    res.status(201).json({ message: 'Student registered successfully', ok: true });
  } catch (error) {
    console.error('Error registering student:', error);
    res.status(500).json({ message: 'An error occurred during student registration', ok: false });
  }
};

// Controller function to delete a student
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndRemove(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found', ok: false });
    }
    res.status(200).json({ message: 'Student deleted', ok: true });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Error deleting student', ok: false });
  }
};

module.exports = {
  registerStudent,
  studentLogin,
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
