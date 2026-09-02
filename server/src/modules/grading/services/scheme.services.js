const GradingScheme = require('../models/gradingscheme.model');

const createScheme = async (data) => {
    const scheme = await GradingScheme.create(data);
    if (scheme.isDefault) {
        await GradingScheme.updateMany(
            { _id: { $ne: scheme._id } },
            { $set: { isDefault: false } }
        );
    }
    return scheme;
};

const listSchemes = async () => {
    return await GradingScheme.find().sort({ createdAt: -1 });
};

const updateScheme = async (id, data) => {
    const scheme = await GradingScheme.findById(id);
    if (!scheme) throw new Error('Grading scheme not found.');

    const { name, description, categories, termWeights, passingGrade, status, isDefault } = data;
    if (name !== undefined) scheme.name = name;
    if (description !== undefined) scheme.description = description;
    if (categories !== undefined) scheme.categories = categories;
    if (termWeights !== undefined) scheme.termWeights = termWeights;
    if (passingGrade !== undefined) scheme.passingGrade = passingGrade;
    if (status !== undefined) scheme.status = status;
    if (isDefault !== undefined) scheme.isDefault = isDefault;

    await scheme.save();

    if (scheme.isDefault) {
        await GradingScheme.updateMany(
            { _id: { $ne: scheme._id } },
            { $set: { isDefault: false } }
        );
    }

    return scheme;
};

const deleteScheme = async (id) => {
    const scheme = await GradingScheme.findById(id);
    if (!scheme) throw new Error('Grading scheme not found.');
    await GradingScheme.findByIdAndDelete(id);
    return { message: 'Grading scheme deleted.' };
};

const getDefaultScheme = async () => {
    const scheme = await GradingScheme.findOne({ isDefault: true });
    if (scheme) return scheme;
    return await GradingScheme.findOne().sort({ createdAt: -1 });
};

module.exports = {
    createScheme,
    listSchemes,
    updateScheme,
    deleteScheme,
    getDefaultScheme,
};
