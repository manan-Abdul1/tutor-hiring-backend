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

    // Perform any necessary validation or checks here before creating the tutor

    const tutor = await Tutor.create({
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
    });

    res.status(201).json(tutor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registerTutor,
};
