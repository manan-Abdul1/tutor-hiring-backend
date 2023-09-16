const Tutor = require('../models/tutorSchema');

//Register a Tutor
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
      return res.status(400).json({ message: 'Tutor with the same email already exists', ok: false });
    }

    // Check if the password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Password and confirmPassword do not match', ok: false });
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
      role: 'tutor'
    });

    // Save the tutor to the database
    await tutor.save();

    res.status(201).json({ message: 'Tutor registered successfully', ok: true });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred during tutor registration', ok: false });
  }
};


//Login
const tutorsLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the tutor exists
    const tutor = await Tutor.findOne({ email });

    // If tutor is not found, return error
    if (!tutor) {
      return res.status(401).json({ message: 'Invalid email or password', ok: false, status: 401 });
    }

    // Compare the provided password with the stored password
    if (tutor.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password', ok: false, status: 401 });
    }

    // Return the tutor details
    const { name, email: tutorEmail, _id, role } = tutor;
    res.json({ name, email: tutorEmail, id: _id , role, ok: true, status: 200 });
  } catch (error) {
    console.error('Error during tutor login:', error);
    res.status(500).json({ message: 'An error occurred during tutor login', ok: false, status: 500 });
  }
};



module.exports = {
  registerTutor,
  tutorsLogin
};
