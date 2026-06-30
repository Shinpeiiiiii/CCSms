const express = require('express')

const router = express.Router()

const {
    createAccount,
} = require ('../controller/account.controller')

const authorizeMiddleware = require('../../../middlewares/auth.middleware')
const authorizeRoles = require('../../../middlewares/role.middleware')



router.post('/create',authorizeMiddleware,authorizeRoles('admin'),createAccount)

module.exports = router