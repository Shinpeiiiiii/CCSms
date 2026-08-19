require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Import the Express app
const app = require('../../../app');

// Import all required models
const User = require('../../auth/models/User');
const Student = require('../models/Student');
const Section = require('../../academic/section/models/section.models');
const Curriculum = require('../../academic/curriculum/models/curriculum.models');
const Program = require('../../academic/programs/model/Program');
const Department = require('../../academic/department/models/Department');
const AcademicYear = require('../../academic/academicyear/models/academicyear.model');
const EnrollmentPeriod = require('../../academic/enrollmentperiod/models/enrollmentperiod.model');
const StudentApplication = require('../../studentapplications/models/studentapplication.models');

const { connectRedis, redisClient } = require('../../../config/redis');

// Utility for delaying if needed
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function runTests() {
    console.log('\n=========================================');
    console.log('STARTING SECTION ASSIGNMENT ENDPOINT TESTS');
    console.log('=========================================\n');

    // 1. Setup Redis gracefully
    try {
        await connectRedis();
    } catch (err) {
        console.log('Redis startup skipped (not required for these tests):', err.message);
    }

    // 2. Start express server on a random port
    const server = app.listen(0);
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}/api/students`;
    console.log(`Test server running on: http://localhost:${port}`);

    // Track created IDs for cleanup
    const cleanups = {
        users: [],
        students: [],
        applications: [],
        sections: [],
        curriculums: [],
        programs: [],
        departments: [],
        academicYears: [],
        enrollmentPeriods: []
    };

    let testUserAdmin, testUserStudent;
    let testAcademicYear;
    let testEnrollmentPeriod;
    let testDept;
    let testProgramA, testProgramB;
    let testCurriculumA, testCurriculumB;
    let testSectionA, testSectionB;
    let testApplication;
    let testStudent;

    // Tokens
    let adminToken, studentToken;

    try {
        // --- SEED DATABASE DATA ---
        console.log('Seeding test data...');
        const suffix = Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

        // 1. Creators / Users
        testUserAdmin = await User.create({
            firstName: 'Admin',
            lastName: 'Test',
            email: `admin.${suffix}@test.com`,
            password: 'password123',
            role: 'admin'
        });
        cleanups.users.push(testUserAdmin._id);

        testUserStudent = await User.create({
            firstName: 'Student',
            lastName: 'Test',
            email: `student.${suffix}@test.com`,
            password: 'password123',
            role: 'student'
        });
        cleanups.users.push(testUserStudent._id);

        // Sign tokens
        adminToken = jwt.sign(
            { id: testUserAdmin._id.toString(), role: testUserAdmin.role, tokenVersion: testUserAdmin.tokenVersion },
            process.env.JWT_SECRET
        );
        studentToken = jwt.sign(
            { id: testUserStudent._id.toString(), role: testUserStudent.role, tokenVersion: testUserStudent.tokenVersion },
            process.env.JWT_SECRET
        );

        // 2. Academic Year
        testAcademicYear = await AcademicYear.create({
            academicYearCode: `AY-${suffix}`,
            academicYearName: `AY ${suffix} Name`,
            startDate: new Date('2026-06-01'),
            endDate: new Date('2027-03-31'),
            status: 'Active',
            createdBy: testUserAdmin._id
        });
        cleanups.academicYears.push(testAcademicYear._id);

        // 3. Enrollment Period
        testEnrollmentPeriod = await EnrollmentPeriod.create({
            enrollmentPeriodName: `EP ${suffix}`,
            academicYear: testAcademicYear._id,
            startDate: new Date('2026-05-01'),
            endDate: new Date('2026-05-30'),
            status: 'Open',
            createdBy: testUserAdmin._id
        });
        cleanups.enrollmentPeriods.push(testEnrollmentPeriod._id);

        // 4. Department
        testDept = await Department.create({
            departmentCode: `DEPT-${suffix}`,
            departmentName: `Department ${suffix}`,
            departmentHead: 'Head of Dept',
            createdBy: testUserAdmin._id
        });
        cleanups.departments.push(testDept._id);

        // 5. Programs
        testProgramA = await Program.create({
            programCode: `PROGA-${suffix}`,
            programName: `Program A ${suffix}`,
            department: testDept._id,
            programLevel: 'College',
            durationYears: 4,
            createdBy: testUserAdmin._id
        });
        cleanups.programs.push(testProgramA._id);

        testProgramB = await Program.create({
            programCode: `PROGB-${suffix}`,
            programName: `Program B ${suffix}`,
            department: testDept._id,
            programLevel: 'College',
            durationYears: 4,
            createdBy: testUserAdmin._id
        });
        cleanups.programs.push(testProgramB._id);

        // 6. Curriculums
        testCurriculumA = await Curriculum.create({
            curriculumCode: `CURRA-${suffix}`,
            curriculumName: `Curriculum A ${suffix}`,
            program: testProgramA._id,
            academicYear: testAcademicYear._id,
            totalYears: 4,
            status: 'Published',
            createdBy: testUserAdmin._id
        });
        cleanups.curriculums.push(testCurriculumA._id);

        testCurriculumB = await Curriculum.create({
            curriculumCode: `CURRB-${suffix}`,
            curriculumName: `Curriculum B ${suffix}`,
            program: testProgramB._id,
            academicYear: testAcademicYear._id,
            totalYears: 4,
            status: 'Published',
            createdBy: testUserAdmin._id
        });
        cleanups.curriculums.push(testCurriculumB._id);

        // 7. Sections
        testSectionA = await Section.create({
            sectionCode: `SECA-${suffix}`,
            sectionName: `Section A ${suffix}`,
            curriculum: testCurriculumA._id,
            academicYear: testAcademicYear._id,
            yearLevel: 1,
            capacity: 35,
            createdBy: testUserAdmin._id
        });
        cleanups.sections.push(testSectionA._id);

        testSectionB = await Section.create({
            sectionCode: `SECB-${suffix}`,
            sectionName: `Section B ${suffix}`,
            curriculum: testCurriculumB._id,
            academicYear: testAcademicYear._id,
            yearLevel: 2,
            capacity: 35,
            createdBy: testUserAdmin._id
        });
        cleanups.sections.push(testSectionB._id);

        // 8. Application
        testApplication = await StudentApplication.create({
            applicationNumber: `APP-${suffix}`,
            email: `student.${suffix}@test.com`,
            enrollmentPeriod: testEnrollmentPeriod._id,
            academicYear: testAcademicYear._id,
            status: 'Approved'
        });
        cleanups.applications.push(testApplication._id);

        // 9. Student
        testStudent = await Student.create({
            application: testApplication._id,
            user: testUserStudent._id,
            studentNumber: `SN-${suffix}`,
            firstName: 'Student',
            lastName: 'Test',
            sex: 'Male',
            birthDate: new Date('2000-01-01'),
            email: `student.${suffix}@test.com`,
            contactNumber: '09123456789',
            address: '123 Test St.',
            program: testProgramA._id
        });
        cleanups.students.push(testStudent._id);

        console.log('Database seeded successfully.\n');

        // --- TEST CASE 1: Successful Section Assignment ---
        console.log('Test Case 1: Successful Section Assignment (Program matches)');
        const res1 = await fetch(`${baseUrl}/${testStudent._id}/assign-section`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({
                sectionId: testSectionA._id.toString()
            })
        });
        const data1 = await res1.json();
        console.log('Status Code:', res1.status);
        console.log('Response Body:', JSON.stringify(data1, null, 2));

        if (res1.status !== 200 || !data1.success || data1.data.section._id.toString() !== testSectionA._id.toString()) {
            throw new Error('Test Case 1 Failed!');
        }
        console.log('✓ Test Case 1 Passed.\n');

        // --- TEST CASE 2: Program Mismatch ---
        console.log('Test Case 2: Program Mismatch (Section B belongs to Program B, student is Program A)');
        const res2 = await fetch(`${baseUrl}/${testStudent._id}/assign-section`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({
                sectionId: testSectionB._id.toString()
            })
        });
        const data2 = await res2.json();
        console.log('Status Code:', res2.status);
        console.log('Response Body:', JSON.stringify(data2, null, 2));

        if (res2.status !== 400 || data2.success || !data2.message.includes('students program')) {
            throw new Error('Test Case 2 Failed!');
        }
        console.log('✓ Test Case 2 Passed.\n');

        // --- TEST CASE 3: Student Not Found ---
        console.log('Test Case 3: Student Not Found');
        const fakeStudentId = new mongoose.Types.ObjectId().toString();
        const res3 = await fetch(`${baseUrl}/${fakeStudentId}/assign-section`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({
                sectionId: testSectionA._id.toString()
            })
        });
        const data3 = await res3.json();
        console.log('Status Code:', res3.status);
        console.log('Response Body:', JSON.stringify(data3, null, 2));

        if (res3.status !== 400 || data3.success || !data3.message.includes('Not found')) {
            throw new Error('Test Case 3 Failed!');
        }
        console.log('✓ Test Case 3 Passed.\n');

        // --- TEST CASE 4: Section Not Found ---
        console.log('Test Case 4: Section Not Found');
        const fakeSectionId = new mongoose.Types.ObjectId().toString();
        const res4 = await fetch(`${baseUrl}/${testStudent._id}/assign-section`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({
                sectionId: fakeSectionId
            })
        });
        const data4 = await res4.json();
        console.log('Status Code:', res4.status);
        console.log('Response Body:', JSON.stringify(data4, null, 2));

        if (res4.status !== 400 || data4.success || !data4.message.includes('Section not found')) {
            throw new Error('Test Case 4 Failed!');
        }
        console.log('✓ Test Case 4 Passed.\n');

        // --- TEST CASE 5: Unauthorized Access (No Token) ---
        console.log('Test Case 5: Unauthorized Access (No Token)');
        const res5 = await fetch(`${baseUrl}/${testStudent._id}/assign-section`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sectionId: testSectionA._id.toString()
            })
        });
        const data5 = await res5.json();
        console.log('Status Code:', res5.status);
        console.log('Response Body:', JSON.stringify(data5, null, 2));

        if (res5.status !== 401 || !data5.message.includes('No token provided')) {
            throw new Error('Test Case 5 Failed!');
        }
        console.log('✓ Test Case 5 Passed.\n');

        // --- TEST CASE 6: Forbidden Access (Student Role) ---
        console.log('Test Case 6: Forbidden Access (Student Role trying to assign section)');
        const res6 = await fetch(`${baseUrl}/${testStudent._id}/assign-section`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${studentToken}`
            },
            body: JSON.stringify({
                sectionId: testSectionA._id.toString()
            })
        });
        const data6 = await res6.json();
        console.log('Status Code:', res6.status);
        console.log('Response Body:', JSON.stringify(data6, null, 2));

        if (res6.status !== 403 || !data6.message.includes('Access Denied')) {
            throw new Error('Test Case 6 Failed!');
        }
        console.log('✓ Test Case 6 Passed.\n');

        console.log('=========================================');
        console.log('ALL TEST CASES COMPLETED SUCCESSFULLY!');
        console.log('=========================================');

    } catch (error) {
        console.error('\n❌ Test execution failed with error:', error);
        process.exitCode = 1;
    } finally {
        console.log('\nCleaning up seeded test database entries...');
        
        // Cleanup all seeded documents
        try {
            if (cleanups.students.length) await Student.deleteMany({ _id: { $in: cleanups.students } });
            if (cleanups.applications.length) await StudentApplication.deleteMany({ _id: { $in: cleanups.applications } });
            if (cleanups.sections.length) await Section.deleteMany({ _id: { $in: cleanups.sections } });
            if (cleanups.curriculums.length) await Curriculum.deleteMany({ _id: { $in: cleanups.curriculums } });
            if (cleanups.programs.length) await Program.deleteMany({ _id: { $in: cleanups.programs } });
            if (cleanups.departments.length) await Department.deleteMany({ _id: { $in: cleanups.departments } });
            if (cleanups.enrollmentPeriods.length) await EnrollmentPeriod.deleteMany({ _id: { $in: cleanups.enrollmentPeriods } });
            if (cleanups.academicYears.length) await AcademicYear.deleteMany({ _id: { $in: cleanups.academicYears } });
            if (cleanups.users.length) await User.deleteMany({ _id: { $in: cleanups.users } });
            console.log('Database cleanup completed.');
        } catch (cleanupErr) {
            console.error('Error during cleanup:', cleanupErr.message);
        }

        // Close server and database connection
        server.close(() => {
            console.log('Test server closed.');
        });
        
        if (redisClient && redisClient.isOpen) {
            await redisClient.quit();
            console.log('Redis client closed.');
        }

        await mongoose.disconnect();
        console.log('Database connection disconnected.');
        
        process.exit(process.exitCode || 0);
    }
}

runTests();
