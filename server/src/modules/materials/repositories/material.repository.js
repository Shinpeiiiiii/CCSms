const Material = require('../models/material.model');

const MaterialRepository = {
    async create(data) {
        return Material.create(data);
    },

    async findById(id) {
        return Material.findById(id);
    },

    async findBySubject(subjectId) {
        return Material.find({ subject: subjectId }).sort({ createdAt: -1 });
    },

    async findByUploader(userId) {
        return Material.find({ uploadedBy: userId })
            .populate('subject', 'subjectCode subjectName')
            .sort({ createdAt: -1 });
    },

    async findBySubjects(subjectIds) {
        return Material.find({ subject: { $in: subjectIds } })
            .populate('subject', 'subjectCode subjectName')
            .sort({ createdAt: -1 });
    },

    async incrementDownloads(id) {
        return Material.findByIdAndUpdate(
            id,
            { $inc: { downloads: 1 } },
            { new: true }
        );
    },

    async deleteById(id) {
        return Material.findByIdAndDelete(id);
    },

    async countBySubject(subjectId) {
        return Material.countDocuments({ subject: subjectId });
    },

    async countBySubjects(subjectIds) {
        return Material.aggregate([
            { $match: { subject: { $in: subjectIds } } },
            { $group: { _id: '$subject', count: { $sum: 1 } } },
        ]);
    },
};

module.exports = MaterialRepository;
