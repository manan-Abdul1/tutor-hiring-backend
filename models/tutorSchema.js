const mongoose = require('mongoose');

const tutorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  cnic: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  timing: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  currentTeachInstitute: {
    type: String,
  },
  alumni: {
    type: String,
    required: true,
  },
  education: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  // language: {
  //   type: String,
  //   required: true,
  // },
  classes: {
    type: [String],
    required: true,
  },
  subjects: {
    type: [String],
    required: true,
  },
  allSubjectFee: {
    type: Number,
    required: true,
  },
  perSubjectFee: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    enum: ['physical', 'online', 'both'],
    required: true,
  },
  role: {
    type: String,
    default: 'tutor',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 5,
  },
  profileImageUrl: {
    type: String,
    required: false,
    default: function () {
      // Check the gender and set the default image URL accordingly
      if (this.gender === 'male') {
        return 'https://thetutors.pk/avatars/user.png';
      } else {
        return 'https://thetutors.pk/avatars/female-user.png';
      }
    },
  },
});

const Tutor = mongoose.model('Tutor', tutorSchema);

module.exports = Tutor;
