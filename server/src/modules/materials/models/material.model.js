const mongoose = require('mongoose');
const { MATERIAL_CATEGORIES } = require('../constants/material.constants');

const materialSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: 200,
        },
        description: {
            type: String,
            default: '',
            trim: true,
            maxlength: 1000,
        },
        subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject',
            required: [true, 'Subject is required'],
        },
        category: {
            type: String,
            enum: MATERIAL_CATEGORIES,
            default: 'Other',
        },
        fileType: {
            type: String,
            default: 'other',
        },
        filePath: {
            type: String,
            default: null,
        },
        fileUrl: {
            type: String,
            default: null,
        },
        fileName: {
            type: String,
            default: null,
        },
        fileSize: {
            type: Number,
            default: 0,
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Uploader is required'],
        },
        downloads: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    { timestamps: true }
);

materialSchema.index({ subject: 1, createdAt: -1 });
materialSchema.index({ uploadedBy: 1, createdAt: -1 });

const Material = mongoose.model('Material', materialSchema);

module.exports = Material;
