import { lazy } from "react";
import { ROLES } from '../../constants/roles';

//Public routes
const Home = lazy(() => import('../../modules/home/Home'))
const Login = lazy(() => import('../../modules/auth/pages/Login'))
const ForgotPassword = lazy(() => import('../../modules/auth/pages/ForgotPassword'))
const ChangePassword = lazy(() => import('../../modules/auth/pages/ChangePassword'))
const Enrollmentform = lazy(() => import('../../modules/enrollmentform/pages/EnrollmentForm'))
const Enrollment = lazy(() => import('../../modules/home/components/Enrollment'))
const TrackApplication = lazy(() => import('../../modules/home/pages/TrackApplication'))


// Protected routes
const Dashboard = lazy(() => import('../../modules/dashboard/pages/Dashboard'))
const Students = lazy(() => import('../../modules/students/pages/Students'))
const Accounts = lazy(() => import('../../modules/accounts/pages/Accounts'))
const Department = lazy(() => import('../../modules/academic/management/department/pages/Department'))
const Program = lazy(() => import('../../modules/academic/management/program/pages/Program'))
const Subject = lazy(() => import('../../modules/academic/management/subject/pages/Subject'))
const Curriculum = lazy(() => import('@/modules/academic/management/curriculum/pages/Curriculum'))
const CurriculumSubject = lazy(() => import('../../modules/academic/management/curriculumsubject/pages/CurriculumSubject'))
const Prerequisites = lazy(() => import('@/modules/academic/management/prerequisite/pages/Prerequisite'))
const EnrollmentPeriod = lazy(() => import('@/modules/academic/management/enrollmentperiod/pages/EnrollmentPeriod'))
const Section = lazy(() => import('@/modules/academic/management/section/pages/Section'))
const Admission = lazy(() => import('@/modules/admission/pages/PendingApplication'))
const AcademicLoads = lazy(() => import('@/modules/academic/pages/AcademicLoads'))
const MySubjects = lazy(() => import('@/modules/students/pages/MySubjects'))
const StudentDashboard = lazy(() => import('@/modules/students/pages/StudentDashboard'))
const NotFound = lazy(() => import('../../shared/layouts/NotFound'))


export const publicRoutes = [
  { path: '/login', element: Login },
  { path: '/forgot-password', element: ForgotPassword },
  { path: '/change-password', element: ChangePassword },
  { path: '/enrollmentform', element: Enrollmentform },
  { path: '/enrollment', element: Enrollment },
  { path: '/track', element: TrackApplication },
]

export const protectedRoutes = [
  { path: '/dashboard', element: Dashboard, roles: [ROLES.ADMIN, ROLES.TEACHER, ROLES.REGISTRAR] },
  { path: '/department', element: Department, roles: [ROLES.ADMIN, ROLES.REGISTRAR, ROLES.TEACHER] },
  { path: '/registrar/academic-loads', element: AcademicLoads, roles: [ROLES.ADMIN, ROLES.REGISTRAR] },
  { path: '/admission', element: Admission, roles: [ROLES.REGISTRAR, ROLES.ADMIN] },
  { path: '/account', element: Accounts, roles: [ROLES.ADMIN] },
  { path: '/student', element: Students, roles: [ROLES.ADMIN, ROLES.REGISTRAR] },
  { path: '/program', element: Program, roles: [ROLES.ADMIN, ROLES.TEACHER, ROLES.REGISTRAR] },
  { path: '/section', element: Section, roles: [ROLES.ADMIN, ROLES.REGISTRAR, ROLES.TEACHER] },
  { path: '/subject', element: Subject, roles: [ROLES.ADMIN, ROLES.REGISTRAR, ROLES.TEACHER] },
  { path: '/curriculum', element: Curriculum, roles: [ROLES.ADMIN, ROLES.REGISTRAR, ROLES.TEACHER] },
  { path: '/enrollmentperiod', element: EnrollmentPeriod, roles: [ROLES.ADMIN, ROLES.REGISTRAR] },
  { path: '/curriculum/:curriculumId/subjects', element: CurriculumSubject, roles: [ROLES.ADMIN, ROLES.REGISTRAR] },
  { path: '/prerequisites', element: Prerequisites, roles: [ROLES.ADMIN] },
  { path: '/student/subjects', element: MySubjects, roles: [ROLES.STUDENT] },
  { path: '/student/dashboard', element: StudentDashboard, roles: [ROLES.STUDENT] },

  // NOTE: /attendance had no element wired up in the original router —
  // add the Teacher attendance component here once it exists:
  // { path: '/attendance', element: Attendance, roles: [ROLES.TEACHER] },
]

export const NotFoundElement = NotFound