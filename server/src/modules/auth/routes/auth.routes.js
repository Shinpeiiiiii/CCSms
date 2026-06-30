const express = require('express')

const register = require('../controllers/register.controller')
const login = require('../controllers/login.controller')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)

module.exports = router