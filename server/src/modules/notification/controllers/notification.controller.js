const notificationService = require("../services/notification.services");

const getMyNotifications = async (req, res) => {
    try {
        const data = await notificationService.getMyNotifications(req.user.id);
        return res.status(200).json({ success: true, data });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

const getUnreadCount = async (req, res) => {
    try {
        const count = await notificationService.getUnreadCount(req.user.id);
        return res.status(200).json({ success: true, data: { count } });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        const data = await notificationService.markAsRead(req.params.id, req.user.id);
        return res.status(200).json({ success: true, data });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        const data = await notificationService.markAllAsRead(req.user.id);
        return res.status(200).json({ success: true, data });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

const deleteNotification = async (req, res) => {
    try {
        const data = await notificationService.deleteNotification(req.params.id, req.user.id);
        return res.status(200).json({ success: true, data });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    getMyNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
};
