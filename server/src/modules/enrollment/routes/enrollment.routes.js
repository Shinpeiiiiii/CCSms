const express = require('express')

const router = express.Router()


const authMiddleware = require('../../../middlewares/auth.middleware')
const authorizeRoles = require('../../../middlewares/role.middleware')

const {
    createApplication, getApplications, updateApplicationStatus
} = require('../controllers/enrollment.controller')

router.post(
    '/', createApplication
)

router.get(
    '/', authMiddleware, authorizeRoles('registrar', 'admin'), getApplications
)

router.put(
    '/:id/status', authMiddleware, authorizeRoles('registrar', 'admin'), updateApplicationStatus
)

module.exports = router