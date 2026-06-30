const express = require('express')
const cors = require('cors')
const connectDB = require('./database/mongodb')
const authRoutes = require('./modules/auth/routes/auth.routes')
const dotenv = require('dotenv')
dotenv.config()

const studentRoutes = require('./modules/students/routes/student.routes')
const enrollmentRoutes = require('./modules/enrollment/routes/enrollment.routes')
const accountRoutes = require('./modules/accounts/routes/account.routes')
const departmentRoutes = require('./modules/academic/department/routes/department.routes')
const programRoutes = require('./modules/academic/programs/routes/program.routes')
connectDB()
const app = express()

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/enrollment', enrollmentRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/department', departmentRoutes);
app.use('/api/program', programRoutes);

module.exports = app;