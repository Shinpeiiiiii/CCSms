const express = require('express')

const register = require('../controllers/register.controller')
const login = require('../controllers/login.controller')
const loginlimiter = require('../../../middlewares/loginlimiter')

const router = express.Router()

router.post('/register', register)
router.post('/login', loginlimiter, login)

module.exports = router