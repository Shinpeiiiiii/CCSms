const express = require('express')

const router = express.Router()

const {
    createProgram,
    getProgram,
    updateProgram,
    deleteProgram,
    getProgramById,
} = require('../controller/program.controller')

const authMiddleware = require('../../../../middlewares/auth.middleware')
const authorizeRoles = require('../../../../middlewares/role.middleware')

router.get("/", getProgram)
router.get("/:id", getProgramById)
// router.post("/", createProgram)
// router.put("/:id", updateProgram)
// router.delete("/:id", deleteProgram)


router.post(
    "/",
    authMiddleware,
    authorizeRoles("admin"),
    createProgram
)

router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    updateProgram
)

router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    deleteProgram
)

module.exports = router;