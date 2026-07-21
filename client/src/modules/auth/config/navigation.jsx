import LayoutDashboardIcon from '@/components/movingicons/layoutDashboardIcon'
import UserIcon from '@/components/movingicons/userIcon'
import UsersIcon from '@/components/movingicons/usersIcon'
import { 
  Building2, 
  GraduationCap, 
  BookOpen, 
  ScrollText, 
  Grid3x3, 
  Users, 
  Clock, 
  Star, 
  FileText, 
  UserCog 
} from 'lucide-react'

const NAV_ITEMS = [
  {
    label: 'Dashboard', 
    to: '/dashboard', 
    role: ['admin', 'registrar', 'teacher'],
    icon: LayoutDashboardIcon,
  },
  {
    label: 'Department',
    to: '/department',
    role: ['admin'],
    icon: Building2
  },
  {
    label: 'Program',
    to: '/program',
    role: ['admin'],
    icon: GraduationCap
  },
  {
    label: 'Subject',
    to: '/subject',
    role: ['admin', 'registrar', 'teacher'],
    icon: BookOpen
  },
  {
    label: 'Enrollment Period',
    to: '/enrollmentperiod',
    role: ['admin', 'registrar'],
    icon: ScrollText
  },
  {
    label: 'Curriculum',
    to: '/curriculum',
    role: ['admin', 'registrar', 'teacher'],
    icon: ScrollText
  },
  {
    label: 'Section',
    to: '/section',
    role: ['admin', 'registrar'],
    icon: Grid3x3
  },
  {
    label: 'Student', 
    to: '/student',
    role: ['admin','registrar'],
    icon: UserIcon,
  },
  {
    label: 'Academic Loads',
    to: '/registrar/academic-loads',
    role: ['admin', 'registrar'],
  },
  {
    label: 'Prerequisites', 
    to: '/prerequisites', 
    role: 'admin',
    icon: Clock
  },
  {
    label: 'Attendance', 
    to: '/attendance', 
    role: 'teacher',
    icon: Clock
  },
  {
    label: 'Grade', 
    to: '/grade',
    icon: Star
  },
  {
    label: 'Application', 
    to: '/admission', 
    role: ['registrar','admin'],
    icon: FileText
  },
  {
    label: 'Account', 
    to: '/account', 
    role: 'admin',
    icon: UsersIcon,
  },
]

export default NAV_ITEMS