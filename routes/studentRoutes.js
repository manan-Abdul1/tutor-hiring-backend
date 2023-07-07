const express = require('express');
const router = express.Router();
const {registerStudent,studentLogin} = require('../controllers/studentController');

// Define the routes for students
router.post('/register', registerStudent);
router.post('/student-login', studentLogin);
// router.get('/', studentController.getAllStudents);
// router.get('/:id', studentController.getStudentById);
// router.put('/:id', studentController.updateStudent);
// router.delete('/:id', studentController.deleteStudent);

module.exports = router;
