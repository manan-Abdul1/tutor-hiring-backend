const mongoose = require('mongoose');

const formDataSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  timing: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  payment: {
    type: String,
    required: true,
  },
});

// Create a model based on the schema
const FormData = mongoose.model('FormData', formDataSchema);

module.exports = FormData;
