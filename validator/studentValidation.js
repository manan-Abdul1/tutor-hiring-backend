const Joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = Joi.extend(joiPasswordExtendCore);

const userSignUpValidator = Joi.object({
  name: Joi.string()
    .min(2)
    .max(20)
    .pattern(/^[a-zA-Z ,.'-]{2,20}$/)
    .required()
    .label('First Name')
    .messages({
      'string.empty': 'First Name is not allowed to be empty',
      'string.min': 'First Name should be minimum 2 characters',
      'string.max': 'First Name should be maximum 20 characters',
      'string.pattern.base': 'First Name should only contain alphabets',
    }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: false },
    })
    .required()
    .label('Email')
    .messages({
      'string.empty': 'Email is not allowed to be empty',
      'string.email': 'Email entered must be a valid email',
    }),
  password: joiPassword
    .string()
    .minOfSpecialCharacters(2)
    .minOfLowercase(2)
    .minOfUppercase(2)
    .minOfNumeric(2)
    .noWhiteSpaces()
    .onlyLatinCharacters()
    .required()
    .label('Password')
    .messages({
      'string.empty': 'Password is not allowed to be empty',
      'string.min': 'Password should be minimum 8 characters',
      'string.max': 'Password should be maximum 20 characters',
      'password.minOfUppercase': 'Password should contain at least 2 uppercase characters',
      'password.minOfSpecialCharacters': 'Password should contain at least 2 special characters',
      'password.minOfLowercase': 'Password should contain at least 2 lowercase characters',
      'password.minOfNumeric': 'Password should contain at least 2 numeric characters',
      'password.noWhiteSpaces': 'Password should not contain white spaces',
    }),
  
});

const userLoginValidator = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: false },
    })
    .required()
    .label('Email')
    .messages({
      'string.empty': 'Email is not allowed to be empty',
      'string.email': 'Email entered must be a valid email',
    }),
  password: Joi.string()
    .min(8)
    .max(20)
    .required()
    .label('Password')
    .messages({
      'string.min': 'Password should be minimum 8 characters',
      'string.max': 'Password should be maximum 20 characters',
    }),
});

module.exports = {
  userSignUpValidator,
  userLoginValidator,
};
