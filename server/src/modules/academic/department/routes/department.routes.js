const express = require('express')

const router = express.Router()

const {

    createDepartment,
    getDepartment,
    updateDepartment,
    deleteDepartment,

} = require('../controller/department.controller')

const authMiddleware = require('../../../../middlewares/auth.middleware')

const authorizeRoles = require('../../../../middlewares/role.middleware')

/*
=========================================
View Departments
Admin
Registrar
=========================================
*/

router.get(
    '/',
    authMiddleware,
    authorizeRoles('admin', 'registrar'),
    getDepartment
)

/*
=========================================
Create Department
Admin
=========================================
*/

router.post(
    '/',
    authMiddleware,
    authorizeRoles('admin'),
    createDepartment
)

/*
=========================================
Update Department
Admin
=========================================
*/

router.put(
    '/:id',
    authMiddleware,
    authorizeRoles('admin'),
    updateDepartment
)

/*
=========================================
Delete Department
Admin
=========================================
*/

router.delete(
    '/:id',
    authMiddleware,
    authorizeRoles('admin'),
    deleteDepartment
)

module.exports = router