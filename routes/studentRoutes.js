const express = require('express');
const router = express.Router();
const {registerStudent,studentLogin,updateStudent} = require('../controllers/studentController');

// Define the routes for students
router.post('/register', registerStudent);
router.post('/student-login', studentLogin);
router.put('/students/:id', updateStudent);
// router.get('/', studentController.getAllStudents);
// router.get('/:id', studentController.getStudentById);
// router.delete('/:id', studentController.deleteStudent);

module.exports = router;
