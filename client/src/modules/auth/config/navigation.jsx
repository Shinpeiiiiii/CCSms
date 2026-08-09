import LayoutDashboardIcon from '@/components/movingicons/layoutDashboardIcon'
import LayersIcon from '@/components/movingicons/layersIcon'
import UserIcon from '@/components/movingicons/userIcon'
import UsersIcon from '@/components/movingicons/usersIcon'
import {
  GraduationCap,
  BookOpen,
  ScrollText,
  Grid3x3,
  Clock,
  Star,
  FileText,
  Building2,
} from 'lucide-react'

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    to: '/dashboard',
    role: ['admin', 'registrar', 'teacher'],
    icon: LayoutDashboardIcon,
  },
  {
    label: 'Dashboard',
    role: ['student'],
    to: '/student/dashboard',
  },
  {
    label: 'My Subjects',
    role: ['student'],
    to: '/student/subjects',
  },
  {
    label: 'My Profile',
    role: ['student'],
    to: '/student/profile',
  },
  {
    label: 'Department',
    to: '/department',
    role: ['admin'],
    icon: LayersIcon,
    group: 'Administration',
  },
  {
    label: 'Account',
    to: '/account',
    role: 'admin',
    icon: UsersIcon,
    group: 'Administration',
  },
  {
    label: 'Program',
    to: '/program',
    role: ['admin'],
    icon: GraduationCap,
    group: 'Academic',
  },
  {
    label: 'Subject',
    to: '/subject',
    role: ['admin', 'registrar', 'teacher'],
    icon: BookOpen,
    group: 'Academic',
  },
  {
    label: 'Enrollment Period',
    to: '/enrollmentperiod',
    role: ['admin', 'registrar'],
    icon: ScrollText,
    group: 'Academic',
  },
  {
    label: 'Curriculum',
    to: '/curriculum',
    role: ['admin', 'registrar', 'teacher'],
    icon: ScrollText,
    group: 'Academic',
  },
  {
    label: 'Sections',
    to: '/section',
    role: ['admin', 'registrar'],
    icon: Grid3x3,
    group: 'Academic',
  },
  {
    label: 'Section Subjects',
    to: '/section-subject',
    role: ['admin', 'registrar'],
    group: 'Academic',
  },
  {
    label: 'Academic Loads',
    to: '/registrar/academic-loads',
    role: ['admin', 'registrar'],
    group: 'Academic',
  },
  {
    label: 'Prerequisites',
    to: '/prerequisites',
    role: 'admin',
    icon: Clock,
    group: 'Academic',
  },
  {
    label: 'Students',
    to: '/student',
    role: ['admin', 'registrar'],
    icon: UserIcon,
    group: 'Students',
  },
  {
    label: 'Grades',
    to: '/grade',
    icon: Star,
    group: 'Students',
  },
  {
    label: 'Applications',
    to: '/admission',
    role: ['registrar', 'admin'],
    icon: FileText,
    group: 'Students',
  },
  {
    label: 'Attendance',
    to: '/attendance',
    role: 'teacher',
    icon: Clock,
  },
]

export default NAV_ITEMS