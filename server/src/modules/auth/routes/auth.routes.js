const express = require('express')

const register = require('../controllers/register.controller')
const {login, changePassword} = require('../controllers/login.controller')
const checkEmail = require('../controllers/check-email.controller')
const { requestReset, confirmReset } = require('../controllers/forgot-password.controller')
const loginlimiter = require('../../../middlewares/loginlimiter')
const verifyTurnstile = require('../../../middlewares/turnstile.middleware')
const router = express.Router()
const refreshController = require('../../auth/controllers/refresh.controller')
const logout = require('../controllers/logout.controller')
const authenticateToken = require('../../../middlewares/auth.middleware')


router.post('/register', register)
router.post('/login', loginlimiter, verifyTurnstile, login)
router.get('/check-email', checkEmail)
router.post('/logout', authenticateToken,logout)
router.post('/refresh', refreshController)
router.patch('/change-password', authenticateToken, changePassword)
router.post('/forgot-password', requestReset)
router.post('/reset-password', confirmReset)


module.exports = router