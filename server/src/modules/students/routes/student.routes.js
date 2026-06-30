const express = require('express')


const {
    createStudent,
    getStudents,
    deleteStudent,
    updateStudent
} = require('../controllers/student.controller')

const router = express.Router()


router.post('/', createStudent)
router.get('/', getStudents)
router.delete('/:id', deleteStudent)
router.put('/:id', updateStudent)

module.exports = router