import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import useAuthStore from '../../modules/auth/state/auth-store'

import Home from '../../modules/home/Home'
import Login from '../../modules/auth/pages/Login'
import Dashboard from '../../modules/dashboard/pages/Dashboard'
import Register from '../../modules/auth/pages/Register'
import Students from '../../modules/students/pages/Students'
import Enrollmentform from '../../modules/enrollmentform/pages/EnrollmentForm'
import ProtectedRoute from '../../modules/auth/components/protected-route/Protected-Route'
import Enrollment from '../../modules/home/components/Enrollment'
import Accounts from '../../modules/accounts/pages/Accounts'
import RoleProtectedRoute from '../../shared/components/RoleProtectedRoute'
import EnrollmentReview from '../../modules/enrollment-review/pages/EnrollmentReview'
import Department from '../../modules/academic/management/department/pages/Department'
import Program from '../../modules/academic/management/program/pages/Program'
import Subject from '../../modules/academic/management/subject/pages/Subject'
import Curriculum from '@/modules/academic/management/curriculum/pages/Curriculum'
import CurriculumSubject from '../../modules/academic/management/curriculumsubject/pages/CurriculumSubject'
import DashboardLayout from '../../shared/layouts/DashboardLayout'

const Router = () => {
    const token = useAuthStore((state) => state.token)
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={token ? <Navigate to="/dashboard" replace /> : <Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/enrollmentform" element={<Enrollmentform />} />
                <Route path="/enrollment" element={<Enrollment />} />
                <Route path="/department" element={
                    <RoleProtectedRoute allowedRoles={['admin']}>
                        <Department />
                    </RoleProtectedRoute>
                } />
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }/>
                <Route path="/enrollment-review" element={
                    <RoleProtectedRoute allowedRoles={['registrar']}>
                        <EnrollmentReview />
                    </RoleProtectedRoute>
                } />
                <Route path="/attendance" element={
                    <RoleProtectedRoute allowedRoles={['teacher']}>
                    </RoleProtectedRoute>
                } />
                <Route path="/account" element={
                    <RoleProtectedRoute allowedRoles={['admin']}>
                        <Accounts />
                    </RoleProtectedRoute>
                } />
                <Route path="/student" element={
                    <ProtectedRoute>
                        <Students />
                    </ProtectedRoute>
                } />
                <Route path="/program" element={
                    <RoleProtectedRoute allowedRoles={['admin']}>
                        <Program />
                    </RoleProtectedRoute>
                } />
                <Route path="/subject" element={
                    <RoleProtectedRoute allowedRoles={['admin','registrar']}>
                        <Subject />
                    </RoleProtectedRoute>
                }
                />
                <Route path="/curriculum" element={
                    <RoleProtectedRoute allowedRoles={['admin','registrar']}>
                        <Curriculum />
                    </RoleProtectedRoute>
                }
                />
                <Route path="/curriculum/:curriculumId/subjects" element={
                    <RoleProtectedRoute allowedRoles={['admin', 'registrar']}>
                        <CurriculumSubject />
                    </RoleProtectedRoute>
                }
                />
            </Routes>
        </BrowserRouter>
    )
}

export default Router