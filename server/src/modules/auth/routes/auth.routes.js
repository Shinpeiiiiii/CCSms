const express = require('express')

const register = require('../controllers/register.controller')
const login = require('../controllers/login.controller')
const loginlimiter = require('../../../middlewares/loginlimiter')
const verifyTurnstile = require('../../../middlewares/turnstile.middleware')
const router = express.Router()
const refreshController = require('../../auth/controllers/refresh.controller')
const logout = require('../controllers/logout.controller')
const authenticateToken = require('../../../middlewares/auth.middleware')


router.post('/register', register)
router.post('/login', loginlimiter, verifyTurnstile, login)
router.post('/logout', authenticateToken,logout)
router.post('/refresh', refreshController)
module.exports = router