const Tutor = require('../models/tutorSchema');
const Joi = require('joi');

const tutorRegistrationSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().required(),
  cnic: Joi.string().required(),
  password: Joi.string().min(8).max(20).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
  address: Joi.string().required(),
  gender: Joi.string().valid('male', 'female').required(),
  age: Joi.number().integer().min(18).required(),
  timing: Joi.string().required(),
  experience: Joi.string().required(),
  currentTeachInstitute: Joi.string().optional(),
  alumni: Joi.string().required(),
  education: Joi.string().required(),
  city: Joi.string().required(),
  bio: Joi.string().required(),
  classes: Joi.array().items(Joi.string()).required(),
  subjects: Joi.array().items(Joi.string()).required(),
  allSubjectFee: Joi.number().required(),
  perSubjectFee: Joi.number().required(),
  location: Joi.string().valid('physical', 'online', 'both').required(),
  role: Joi.string().default('tutor'),
  isVerified: Joi.boolean().default(false),
  rating: Joi.number().default(5),
  profileImageUrl: Joi.string().optional(),
});

// Define custom error messages for Joi validation
const validationOptions  = {
  abortEarly: false,
  messages: {
    'any.required': '{#label} is required',
    'string.email': 'Invalid email format',
    'string.min': '{#label} should be at least {#limit} characters',
    'string.max': '{#label} should not exceed {#limit} characters',
    'number.integer': '{#label} should be an integer',
    'number.min': '{#label} should be at least {#limit}',
    'array.base': '{#label} should be an array',
    'array.includesRequiredBoth': 'Each item in {#label} is required',
  },
};




const registerTutor = async (req, res) => {
  try {
    // Validate the tutor registration data against the Joi schema
    const { error, value } = tutorRegistrationSchema.validate(req.body, validationOptions);

    // Check if validation failed
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({ messages: errorMessages, ok: false });
    }

    // Check if the tutor with the same email already exists
    const existingTutor = await Tutor.findOne({ email: value.email });
    if (existingTutor) {
      return res.status(400).json({ message: 'Tutor with the same email already exists', ok: false });
    }

    // Create a new tutor
    const tutor = new Tutor(value);

    // Save the tutor to the database
    await tutor.save();

    res.status(201).json({ tutor, message: 'Tutor registered successfully', ok: true });
  } catch (error) {
    // Handle other errors (e.g., database errors)
    res.status(500).json({ message: 'An error occurred during tutor registration', ok: false });
  }
};


module.exports = { registerTutor, tutorRegistrationSchema, validationOptions };



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
    const id = req.query.id;
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
