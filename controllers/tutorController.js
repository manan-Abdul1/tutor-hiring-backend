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
// Tutors login
const tutorsLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the tutor exists
    const tutor = await Tutor.findOne({ email });

    // If tutor is not found, return error
    if (!tutor) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare the provided password with the stored password
    if (tutor.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Return the tutor details
    const { name, email: tutorEmail, _id } = tutor;
    res.json({ tutor: { name, email: tutorEmail, id: _id } });
  } catch (error) {
    console.error('Error during tutor login:', error);
    res.status(500).json({ message: 'An error occurred during tutor login' });
  }
};


module.exports = {
  registerTutor,
  tutorsLogin
};
