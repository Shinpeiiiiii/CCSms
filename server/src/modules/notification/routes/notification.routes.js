const express = require('express');
const router = express.Router();

const {
    getMyNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
} = require("../controllers/notification.controller");

const authMiddleware = require("../../../middlewares/auth.middleware");
const authorizeRoles = require("../../../middlewares/role.middleware");

router.use(authMiddleware);

router.get('/unread-count', authorizeRoles('admin', 'registrar', 'teacher', 'student'), getUnreadCount);
router.get('/', authorizeRoles('admin', 'registrar', 'teacher', 'student'), getMyNotifications);
router.patch('/:id/read', authorizeRoles('admin', 'registrar', 'teacher', 'student'), markAsRead);
router.patch('/read-all', authorizeRoles('admin', 'registrar', 'teacher', 'student'), markAllAsRead);
router.delete('/:id', authorizeRoles('admin', 'registrar', 'teacher', 'student'), deleteNotification);

module.exports = router;
