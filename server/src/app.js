const dotenv = require('dotenv')
const express = require('express')
const cors = require('cors')
const connectDB = require('./database/mongodb')
const authRoutes = require('./modules/auth/routes/auth.routes')
const cookieParser = require("cookie-parser")
dotenv.config()
console.log('DIRECT CHECK:', process.env.ENABLE_TURNSTILE, process.env.NODE_ENV)


const studentRoutes = require('./modules/students/routes/student.routes')
const accountRoutes = require('./modules/accounts/routes/account.routes')
const departmentRoutes = require('./modules/academic/department/routes/department.routes')
const programRoutes = require('./modules/academic/programs/routes/program.routes')
const academicYearRoutes = require('./modules/academic/academicyear/routes/academicyear.routes')
const enrollmentPeriodRoutes = require('./modules/academic/enrollmentperiod/routes/enrollmentperiod.routes')
const subjectRoutes = require('./modules/academic/subject/routes/subject.routes')
const subjectAssignmentRoutes = require('./modules/academic/subject/routes/subjectassignment.routes')
const sectionRoutes = require('./modules/academic/section/routes/section.routes')
const curriculumRoutes = require('./modules/academic/curriculum/routes/curriculum.routes')
const curriculumsubjectRoutes = require('./modules/academic/curriculum/routes/curriculum.subject.routes')
const teacherassignmentRoutes = require('./modules/teacherassignment/routes/teacherassignment.routes')
const userRoutes = require('./modules/accounts/routes/account.routes')
const prerequisiteRoutes = require('./modules/academic/prerequisites/routes/prerequisites.routes')
const studentSubjectRoutes = require('./modules/studentsubject/routes/studentsubject.route')
const sectionSubjectRoutes = require('./modules/sectionsubject/routes/sectionsubject.routes')

const studentApplicationRoutes = require('./modules/studentapplications/routes/studentapplication.routes')

const verificationRoutes = require("./modules/verification/routes/verification.routes")
const sectionsubjectModel = require('./modules/sectionsubject/models/sectionsubject.model')
connectDB()
const app = express()
app.use(cookieParser());
const allowedOrigins = [
    "http://localhost:5173",
    "https://college-portal.seddy012345.workers.dev",
    "https://ccsms.seddy012345.workers.dev",
]

app.use(cors({
    origin: (origin, callback) => {
        const allowed = !origin || allowedOrigins.includes(origin)
        if (allowed) {
            callback(null, true)
        } else {
            console.log('CORS blocked origin:', origin)
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
}));

app.set("trust proxy", 1);
app.use(express.json());

app.get('/api/health', (req,res) => res.status(200).json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/department', departmentRoutes);
app.use('/api/program', programRoutes);
app.use('/api/academicyear', academicYearRoutes);
app.use('/api/enrollmentperiod', enrollmentPeriodRoutes);
app.use('/api/subject', subjectRoutes);
app.use('/api/curriculum', curriculumRoutes);

app.use('/api/subjectassignment', subjectAssignmentRoutes);
app.use('/api/section', sectionRoutes);
app.use('/api', curriculumsubjectRoutes);
app.use('/api/teacherassignment', teacherassignmentRoutes);
//console.log("Error prere: ",prerequisiteRoutes);
app.use('/api/prerequisite', prerequisiteRoutes);
app.use('/api/verification',verificationRoutes);
app.use('/api/student-applications', studentApplicationRoutes);
app.use('/api/student-subject',studentSubjectRoutes);
app.use('/api/section-subject', sectionSubjectRoutes);



module.exports = app;