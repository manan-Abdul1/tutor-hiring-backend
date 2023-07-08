const Student = require('../models/studentSchema');

// Register a new student
const registerStudent = async (req, res) => {
    try {
      // Extract the registration data from the request body
      const { name, email, password } = req.body;
  
      // Check if the student already exists
      const existingStudent = await Student.findOne({ email });
      if (existingStudent) {
        return res.status(400).json({ message: 'Student already exists' });
      }
  
      // Create a new student instance
      const student = new Student({ name, email, password });
  
      // Save the student to the database
      await student.save();
  
      res.status(201).json({ message: 'Student registered successfully' });
    } catch (error) {
      console.error('Error registering student:', error);
      res.status(500).json({ message: 'An error occurred during student registration' });
    }
  };
// Student login
const studentLogin = async (req, res) => {
  try {
    const { email: studentEmail, password } = req.body;

    // Check if the student exists and the password is correct
    const student = await Student.findOne({ email: studentEmail });
    if (!student || student.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Return the email, name, and ID of the student
    const { email, name, _id } = student;
    res.json({ email, name, id: _id });
  } catch (error) {
    console.error("Error during student login:", error);
    res.status(500).json({ message: "An error occurred during student login" });
  }
};

// Controller function to update a student
const updateStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, password,email },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Update email if a new email is provided
    if (email && email !== student.email) {
      student.email = email;
      await student.save();
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Error updating student" });
  }
};

  
// Controller function to get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving students' });
  }
};

// Controller function to get a student by ID
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving student' });
  }
};

// Controller function to handle student registration
const createStudent = async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // Check if the student already exists
      const existingStudent = await Student.findOne({ email });
      if (existingStudent) {
        return res.status(400).json({ message: 'Student already exists' });
      }
  
      // Create a new student instance
      const student = new Student({ name, email, password });
  
      // Save the student to the database
      await student.save();
  
      res.status(201).json({ message: 'Student registered successfully' });
    } catch (error) {
      console.error('Error registering student:', error);
      res.status(500).json({ message: 'An error occurred during student registration' });
    }
  };
  


// Controller function to delete a student
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndRemove(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student' });
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
