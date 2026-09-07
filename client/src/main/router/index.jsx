import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import useAuthStore from '../../modules/auth/state/auth-store'
import RoleProtectedRoute from '../../shared/components/RoleProtectedRoute'

// Public pages (eager)
import Home from '@/modules/home/Home'
import Enrollment from '@/modules/home/components/Enrollment'
import TrackApplication from '@/modules/home/pages/TrackApplication'

// Auth pages
import Login from '@/modules/auth/pages/Login'
import ChangePassword from '@/modules/auth/pages/ChangePassword'
import ForgotPassword from '@/modules/auth/pages/ForgotPassword'
import ActivateAccount from '@/modules/auth/pages/ActivateAccount'

// Protected pages — code-split on demand
const Dashboard = React.lazy(() => import('@/modules/dashboard/pages/Dashboard'))
const Students = React.lazy(() => import('@/modules/students/pages/Students'))
const Enrollmentform = React.lazy(() => import('@/modules/enrollmentform/pages/EnrollmentForm'))
const Accounts = React.lazy(() => import('@/modules/accounts/pages/Accounts'))
const Department = React.lazy(() => import('@/modules/academic/management/department/pages/Department'))
const Program = React.lazy(() => import('@/modules/academic/management/program/pages/Program'))
const Subject = React.lazy(() => import('@/modules/academic/management/subject/pages/Subject'))
const Curriculum = React.lazy(() => import('@/modules/academic/management/curriculum/pages/Curriculum'))
const CurriculumSubject = React.lazy(() => import('@/modules/academic/management/curriculumsubject/pages/CurriculumSubject'))
const Prerequisites = React.lazy(() => import('@/modules/academic/management/prerequisite/pages/Prerequisite'))
const EnrollmentPeriod = React.lazy(() => import('@/modules/academic/management/enrollmentperiod/pages/EnrollmentPeriod'))
const Section = React.lazy(() => import('@/modules/academic/management/section/pages/Section'))
const Admission = React.lazy(() => import('@/modules/admission/pages/PendingApplication'))
const AcademicLoads = React.lazy(() => import('@/modules/academic/pages/AcademicLoads'))
const SectionSubjects = React.lazy(() => import('@/modules/academic/management/sectionSubject/pages/SectionSubjects'))
const TeacherSchedule = React.lazy(() => import('@/modules/teacher/pages/TeacherSchedule'))
const TeacherDashboard = React.lazy(() => import('@/modules/teacher/pages/TeacherDashboard'))
const TeacherGrades = React.lazy(() => import('@/modules/teacher/pages/TeacherGrades'))
const TeacherMaterials = React.lazy(() => import('@/modules/teacher/pages/TeacherMaterials'))
const Notifications = React.lazy(() => import('@/modules/teacher/pages/Notifications'))
const GradingSchemes = React.lazy(() => import('@/modules/grading/pages/GradingSchemes'))
const MySubjects = React.lazy(() => import('@/modules/students/pages/MySubjects'))
const StudentDashboard = React.lazy(() => import('@/modules/students/pages/StudentDashboard'))
const MyProfile = React.lazy(() => import('@/modules/students/pages/MyProfile'))
const MyGrades = React.lazy(() => import('@/modules/students/pages/MyGrades'))
const MySchedule = React.lazy(() => import('@/modules/students/pages/MySchedule'))
const MyAttendance = React.lazy(() => import('@/modules/students/pages/MyAttendance'))
const StudentMaterials = React.lazy(() => import('@/modules/students/pages/StudentMaterials'))

const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-100">
        <div className="text-sm text-gray-500">Loading...</div>
    </div>
)

const NotFound = () => (
    <div className="flex flex-col items-center justify-center min-h-100 p-8 text-center">
        <p className="text-4xl font-bold text-gray-900">404</p>
        <p className="mt-2 text-gray-500">The page you are looking for does not exist.</p>
        <Link to="/" className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700">Go to home</Link>
    </div>
)

// Role groups
const STAFF = ['admin', 'registrar', 'teacher']
const ADMIN = ['admin']
const REG = ['admin', 'registrar']
const ADMIN_REG_TEACHER = ['admin', 'registrar', 'teacher']
const ADMIN_TEACHER = ['admin', 'teacher']
const TEACHER = ['teacher']
const STUDENT = ['student']

const PUBLIC_ROUTES = [
    { path: '/login', element: <Login /> },
    { path: '/forgot-password', element: <ForgotPassword /> },
    { path: '/change-password', element: <ChangePassword /> },
    { path: '/activate-account', element: <ActivateAccount /> },
    { path: '/enrollmentform', element: <Enrollmentform /> },
    { path: '/enrollment', element: <Enrollment /> },
    { path: '/track', element: <TrackApplication /> },
]

const PROTECTED_ROUTES = [
    { path: '/dashboard', roles: STAFF, element: <Dashboard /> },
    { path: '/student', roles: STAFF, element: <Students /> },
    { path: '/department', roles: ADMIN_REG_TEACHER, element: <Department /> },
    { path: '/registrar/academic-loads', roles: REG, element: <AcademicLoads /> },
    { path: '/admission', roles: REG, element: <Admission /> },
    { path: '/teacher/schedule', roles: TEACHER, element: <TeacherSchedule /> },
    { path: '/teacher/dashboard', roles: TEACHER, element: <TeacherDashboard /> },
    { path: '/teacher/grades', roles: TEACHER, element: <TeacherGrades /> },
    { path: '/notifications', roles: ['admin', 'registrar', 'teacher', 'student'], element: <Notifications /> },
    { path: '/teacher/materials', roles: TEACHER, element: <TeacherMaterials /> },
    { path: '/student/materials', roles: STUDENT, element: <StudentMaterials /> },
    { path: '/account', roles: ADMIN, element: <Accounts /> },
    { path: '/program', roles: ADMIN_REG_TEACHER, element: <Program /> },
    { path: '/section', roles: ADMIN_REG_TEACHER, element: <Section /> },
    { path: '/subject', roles: ADMIN_REG_TEACHER, element: <Subject /> },
    { path: '/section-subject', roles: REG, element: <SectionSubjects /> },
    { path: '/curriculum', roles: ADMIN_REG_TEACHER, element: <Curriculum /> },
    { path: '/enrollmentperiod', roles: REG, element: <EnrollmentPeriod /> },
    { path: '/curriculum/:curriculumId/subjects', roles: REG, element: <CurriculumSubject /> },
    { path: '/prerequisites', roles: ADMIN, element: <Prerequisites /> },
    { path: '/academic/grading', roles: ADMIN, element: <GradingSchemes /> },
    { path: '/student/subjects', roles: STUDENT, element: <MySubjects /> },
    { path: '/student/dashboard', roles: STUDENT, element: <StudentDashboard /> },
    { path: '/student/profile', roles: STUDENT, element: <MyProfile /> },
    { path: '/student/grades', roles: STUDENT, element: <MyGrades /> },
    { path: '/student/schedule', roles: STUDENT, element: <MySchedule /> },
    { path: '/student/attendance', roles: STUDENT, element: <MyAttendance /> },
]

const Router = () => {
    const accessToken = useAuthStore((state) => state.accessToken)
    const user = useAuthStore((state) => state.user)

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={
                    accessToken ? (
                        user?.role === 'student' ?
                            <Navigate to="/student/dashboard" replace /> :
                            <Navigate to="/dashboard" replace />
                    ) : <Home />
                } />

                {PUBLIC_ROUTES.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={<Suspense fallback={<LoadingFallback />}>{route.element}</Suspense>}
                    />
                ))}

                {PROTECTED_ROUTES.map((route) => (
                    <Route
                        key={route.path + JSON.stringify(route.roles)}
                        path={route.path}
                        element={
                            <RoleProtectedRoute allowedRoles={route.roles}>
                                <Suspense fallback={<LoadingFallback />}>
                                    {route.element}
                                </Suspense>
                            </RoleProtectedRoute>
                        }
                    />
                ))}

                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Router
