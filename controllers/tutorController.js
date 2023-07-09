const Tutor = require('../models/tutorSchema');

const registerTutor = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      cnic,
      password,
      confirmPassword,
      address,
      gender,
      age,
      timing,
      experience,
      currentTeachInstitute,
      alumni,
      education,
      city,
      bio,
      language,
      classes,
      subjects,
      allSubjectFee,
      perSubjectFee,
      location,
    } = req.body;
    // Check if the tutor with the same email already exists
    const existingTutor = await Tutor.findOne({ email });
    if (existingTutor) {
      return res.status(400).json({ error: 'Tutor with the same email already exists' });
    }

    // Create a new tutor
    const tutor = new Tutor({
      name,
      phone,
      email,
      cnic,
      password,
      address,
      gender,
      age,
      timing,
      experience,
      currentTeachInstitute,
      alumni,
      education,
      city,
      bio,
      language,
      classes,
      subjects,
      allSubjectFee,
      perSubjectFee,
      location,
    });

    // Save the tutor to the database
    await tutor.save();

    res.status(201).json(tutor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Student login
const tutorsLogin = async (req, res) => {
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



module.exports = {
  registerTutor,
};
