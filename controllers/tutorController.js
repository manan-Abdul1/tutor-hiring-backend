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


module.exports = {
  registerTutor,
};
