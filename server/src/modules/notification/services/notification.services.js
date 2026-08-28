const Notification = require("../models/notification.model");

const createNotification = async ({ recipient, sender, title, message, type, link }) => {
    return await Notification.create({
        recipient,
        sender: sender || null,
        title,
        message,
        type: type || "info",
        link: link || null,
    });
};

const getMyNotifications = async (userId) => {
    return await Notification.find({ recipient: userId })
        .populate("sender", "firstName lastName")
        .sort({ createdAt: -1 })
        .limit(50);
};

const getUnreadCount = async (userId) => {
    return await Notification.countDocuments({ recipient: userId, read: false });
};

const markAsRead = async (notificationId, userId) => {
    const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, recipient: userId },
        { read: true },
        { new: true }
    );
    if (!notification) {
        throw new Error("Notification not found.");
    }
    return notification;
};

const markAllAsRead = async (userId) => {
    await Notification.updateMany(
        { recipient: userId, read: false },
        { read: true }
    );
    return { message: "All notifications marked as read." };
};

const deleteNotification = async (notificationId, userId) => {
    const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        recipient: userId,
    });
    if (!notification) {
        throw new Error("Notification not found.");
    }
    return { message: "Notification deleted." };
};

module.exports = {
    createNotification,
    getMyNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
};
