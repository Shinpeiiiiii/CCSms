import DepartmentIcon from "../icons/DepartmentIcon"
import DashboardIcon from "../icons/DashboardIcon"
import ProgramsIcon from "../icons/ProgramsIcon"
import SubjectsIcon from "../icons/SubjectsIcon"
import SectionsIcon from "../icons/SectionsIcon"
import StudentsIcon from "../icons/StudentsIcon"
import AttendanceIcon from "../icons/AttendanceIcon"
import GradesIcon from "../icons/GradesIcon"
import ApplicationsIcon from "../icons/ApplicationsIcon"
import AccountsIcon from "../icons/AccountIcon"

const NAV_ITEMS = [
  {
    label: 'Dashboard', to: '/dashboard', role: ['admin', 'registrar', 'teacher'],
    icon: <DashboardIcon />
  },
  {
    label: 'Department',
    to: '/department',
    role: ['admin'],
    icon: <DepartmentIcon />
  },
  {
    label: 'Program',
    to: '/program',
    role: ['admin'],
    icon: <ProgramsIcon />
  },
  {
    label: 'Subject',
    to: '/subject',
    role: ['admin', 'registrar', 'teacher'],
    icon: <SubjectsIcon />
  },
  {
    label: 'Section',
    to: '/section',
    role: ['admin', 'registrar'],
    icon: <SectionsIcon />
  },
  {
    label: 'Student', to: '/student',
    icon: <StudentsIcon />
  },
  {
    label: 'Attendance', to: '/attendance', role: 'teacher',
    icon: <AttendanceIcon />
  },
  {
    label: 'Grade', to: '/grade',
    icon: <GradesIcon />
  },
  {
    label: 'Application', to: '/enrollment-review', role: ['registrar'],
    icon: <ApplicationsIcon />
  },
  {
    label: 'Account', to: '/account', role: 'admin',
    icon: <AccountsIcon />
  },
]

export default NAV_ITEMS