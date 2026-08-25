const express = require('express')

const router = express.Router()

const {
    getTeachers,
    createAccount,
    activateAccount,
    updateAccount,
    deleteAccount,
    getAccount,
    getAccountById
} = require ('../controller/account.controller')

const authorizeMiddleware = require('../../../middlewares/auth.middleware')
const authorizeRoles = require('../../../middlewares/role.middleware')
const authMiddleware = require('../../../middlewares/auth.middleware')

router.get('/', authMiddleware, authorizeRoles('admin'), getAccount)
router.get('/teachers', authMiddleware, authorizeRoles('admin','registrar'), getTeachers)
router.get('/:id', authMiddleware, authorizeRoles('admin'), getAccountById)


module.exports = router