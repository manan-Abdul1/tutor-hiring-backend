const Joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = Joi.extend(joiPasswordExtendCore);

const tutorRegistrationValidator = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .label('Name')
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name should be minimum 2 characters',
      'string.max': 'Name should be maximum 50 characters',
    }),
  phone: Joi.string()
    .min(10)
    .max(15)
    .pattern(/^[0-9]+$/)
    .required()
    .label('Phone')
    .messages({
      'string.empty': 'Phone number is required',
      'string.min': 'Phone number should be minimum 10 characters',
      'string.max': 'Phone number should be maximum 15 characters',
      'string.pattern.base': 'Phone number should only contain numeric digits',
    }),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
    .required()
    .label('Email')
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Email entered must be a valid email',
    }),
  cnic: Joi.string()
    .required()
    .label('CNIC')
    .messages({
      'string.empty': 'CNIC is required',
    }),
  password: joiPassword
    .string()
    .min(8)
    .max(20)
    .minOfSpecialCharacters(2)
    .minOfLowercase(2)
    .minOfUppercase(2)
    .minOfNumeric(2)
    .noWhiteSpaces()
    // .onlyLatinCharacters()
    .required()
    .label('Password')
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password should be minimum 8 characters',
      'string.max': 'Password should be maximum 20 characters',
      'password.minOfSpecialCharacters': 'Password should contain at least 2 special characters',
      'password.minOfLowercase': 'Password should contain at least 2 lowercase characters',
      'password.minOfUppercase': 'Password should contain at least 2 uppercase characters',
      'password.noWhiteSpaces': 'Password should not contain white spaces',
      'password.minOfNumeric': 'Password should contain at least 2 numeric characters',
    }),
  address: Joi.string()
    .required()
    .label('Address')
    .messages({
      'string.empty': 'Address is required',
    }),
  gender: Joi.string()
    .required()
    .valid('male', 'female')
    .label('Gender')
    .messages({
      'string.empty': 'Gender is required',
      'any.only': 'Gender must be either male or female',
    }),
    age: Joi.number()
    .integer()
    .required()
    .min(18)
    .label('Age')
    .messages({
      'number.base': 'Age must be a number',
      'number.integer': 'Age must be an integer',
      'number.min': 'Age should be minimum 18',
    }),
  timing: Joi.string()
    .required()
    .label('Timing')
    .messages({
      'string.empty': 'Timing is required',
    }),
  experience: Joi.string()
    .required()
    .label('Experience')
    .messages({
      'string.empty': 'Experience is required',
    }),
  currentTeachInstitute: Joi.string(),
  alumni: Joi.string()
    .required()
    .label('Alumni'),
  education: Joi.string()
    .required()
    .label('Education'),
  city: Joi.string()
    .required()
    .label('City'),
  bio: Joi.string()
    .required()
    .label('Bio'),
    classes: Joi.array()
    .required()
    .label('Classes'),
    subjects: Joi.array()
    .required()
    .label('Subjects'),
    allSubjectFee: Joi.number()
    .required()
    .label('All Subject Fee')
    .messages({
      'number.base': 'All Subject Fee must be a number',
    }),
    perSubjectFee: Joi.number()
    .required()
    .label('Per Subject Fee')
    .messages({
      'number.base': 'Per Subject Fee must be a number',
    }),
  location: Joi.string()
    .valid('physical', 'online', 'both')
    .required()
    .label('Location')
    .messages({
      'string.empty': 'Location is required',
      'any.only': 'Location must be either physical, online, or both',
    }),
    confirmPassword: Joi.string()
    .allow()
    .label("confirmPassword"),
  
    profileImageUrl: Joi.string(),
  // Add more fields if necessary
});

module.exports = {
  tutorRegistrationValidator,
};
