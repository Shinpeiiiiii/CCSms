import { 
  LayoutDashboard, 
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
    icon: <LayoutDashboard size={18} />
  },
  {
    label: 'Department',
    to: '/department',
    role: ['admin'],
    icon: <Building2 size={18} />
  },
  {
    label: 'Program',
    to: '/program',
    role: ['admin'],
    icon: <GraduationCap size={18} />
  },
  {
    label: 'Subject',
    to: '/subject',
    role: ['admin', 'registrar', 'teacher'],
    icon: <BookOpen size={18} />
  },
  {
    label: 'Curriculum',
    to: '/curriculum',
    role: ['admin', 'registrar', 'teacher'],
    icon: <ScrollText size={18} />
  },
  {
    label: 'Section',
    to: '/section',
    role: ['admin', 'registrar'],
    icon: <Grid3x3 size={18} />
  },
  {
    label: 'Student', 
    to: '/student',
    icon: <Users size={18} />
  },
  {
    label: 'Prerequisites', 
    to: '/prerequisites', 
    role: 'admin',
    icon: <Clock size={18} />
  },
  {
    label: 'Attendance', 
    to: '/attendance', 
    role: 'teacher',
    icon: <Clock size={18} />
  },
  {
    label: 'Grade', 
    to: '/grade',
    icon: <Star size={18} />
  },
  {
    label: 'Application', 
    to: '/enrollment-review', 
    role: ['registrar'],
    icon: <FileText size={18} />
  },
  {
    label: 'Account', 
    to: '/account', 
    role: 'admin',
    icon: <UserCog size={18} />
  },
]

export default NAV_ITEMS