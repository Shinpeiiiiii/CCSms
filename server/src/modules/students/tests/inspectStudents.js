require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('../models/Student');
const Section = require('../../academic/section/models/section.models');
const Program = require('../../academic/programs/model/Program');

async function inspect() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const students = await Student.find().limit(5).populate('program').populate('section');
        console.log('Total students in DB:', await Student.countDocuments());
        console.log('Sample Students:', JSON.stringify(students, null, 2));
        
        const sections = await Section.find().limit(5).populate('curriculum');
        console.log('Total sections in DB:', await Section.countDocuments());
        console.log('Sample Sections:', JSON.stringify(sections, null, 2));

        const programs = await Program.find().limit(5);
        console.log('Total programs in DB:', await Program.countDocuments());
        console.log('Sample Programs:', JSON.stringify(programs, null, 2));

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}
inspect();
