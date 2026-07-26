export const ROLES = {
    ADMIN: 'admin',
    REGISTRAR: 'registrar',
    TEACHER: 'teacher',
    STUDENT: 'student',
}

export const DEFAULT_ROUTE_BY_ROLE = {
    [ROLES.STUDENT]: '/student/dashboard',
    [ROLES.ADMIN]: '/dashboard',
    [ROLES.REGISTRAR]: '/dashboard',
    [ROLES.TEACHER]: '/dashboard',
}

export const getDefaultRouteForRole = (role) => DEFAULT_ROUTE_BY_ROLE[role] ?? '/dashboard'