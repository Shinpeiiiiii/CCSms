const express = require('express')

const router = express.Router()

const {
    createAccount,
    getAccount,
    getAccountById
} = require ('../controller/account.controller')

const authorizeMiddleware = require('../../../middlewares/auth.middleware')
const authorizeRoles = require('../../../middlewares/role.middleware')
const authMiddleware = require('../../../middlewares/auth.middleware')



router.post('/create',authorizeMiddleware,authorizeRoles('admin'),createAccount)
router.get('/', authMiddleware, authorizeRoles('admin'), getAccount)
router.get('/:id', authMiddleware, authorizeRoles('admin'), getAccountById)

module.exports = router