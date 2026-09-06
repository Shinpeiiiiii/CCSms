export const QUERY_KEYS = {

    DEPARTMENTS: ['departments'],
    DEPARTMENT_DETAIL: (id) => ['departments', id],

    PROGRAMS: ['programs'],
    PROGRAM_DETAIL: (id) => ['programs', id],

    SUBJECTS: ['subjects'],
    SUBJECT_DETAIL: (id) => ['subjects', id],
    SUBJECT_HISTORY: (id) => ['subjects', id, 'history'],

    SECTIONS: ['sections'],
    SECTION_DETAIL: (id) => ['sections', id],

    SECTION_SUBJECTS: ['section-subjects'],
    SECTION_SUBJECTS_BY_SECTION: (sectionId) => ['section-subjects', sectionId],

    CURRICULUMS: ['curriculums'],
    CURRICULUM_DETAIL: (id) => ['curriculums', id],
    CURRICULUM_HISTORY: (id) => ['curriculums', id, 'history'],
    CURRICULUM_TEMPLATES: ['curriculums', 'templates'],

    CURRICULUM_SUBJECTS: (curriculumId) => ['curriculum-subjects', curriculumId],
    CURRICULUM_SUBJECT_MAP: ['curriculum-subjects', 'map'],

    ACADEMIC_YEARS: ['academic-years'],
    ACADEMIC_YEAR_DETAIL: (id) => ['academic-years', id],

    PREREQUISITES: ['prerequisites'],
    PREREQUISITES_BY_SUBJECT: (subjectId) => ['prerequisites', subjectId],

    ENROLLMENT_PERIODS: ['enrollment-periods'],
    ENROLLMENT_ANNOUNCEMENT: ['enrollment-periods', 'announcement'],

    STUDENTS: ['students'],
    STUDENT_DETAIL: (id) => ['students', id],
    STUDENT_DASHBOARD: ['students', 'dashboard'],
    STUDENT_PROFILE: ['students', 'profile'],
    STUDENT_SUBJECTS: ['students', 'subjects'],
    STUDENT_SCHEDULE: ['students', 'schedule'],
    STUDENT_GRADES: ['students', 'grades'],
    STUDENT_ATTENDANCE: ['students', 'attendance'],

    TEACHERS: ['teachers'],
    MY_SCHEDULE: ['my-schedule'],
    MY_DASHBOARD: ['my-dashboard'],
    MY_CLASSES: ['my-classes'],
    CLASS_STUDENTS: (classId) => ['class-students', classId],
    CLASS_GRADES: (classId) => ['class-grades', classId],
    ATTENDANCE_CALENDAR: (classId, year, month) => ['attendance-calendar', classId, year, month],
    GRADE_CONFIG: (classId) => ['grade-config', classId],
    GRADE_ITEMS: (classId) => ['grade-items', classId],
    GRADE_GROUPS: (classId) => ['grade-groups', classId],

    ACCOUNTS: ['accounts'],
    ACCOUNT_DETAIL: (id) => ['accounts', id],
    TEACHER_LIST: ['accounts', 'teachers'],

    ENROLLMENT_APPLICATIONS: ['enrollment-applications'],
    ENROLLMENT_APPLICATION_DETAIL: (id) => ['enrollment-applications', id],
    PENDING_APPLICATIONS: ['student-applications', 'pending'],
    TRACK_APPLICATION: (number) => ['student-applications', 'track', number],

    NOTIFICATIONS: ['notifications'],
    UNREAD_NOTIFICATION_COUNT: ['notifications', 'unread-count'],

    DASHBOARD: ['dashboard'],

    GRADES_SCHEMES: ['grading', 'schemes'],

    MATERIALS: ['materials'],
    MY_MATERIALS: ['materials', 'my'],
    MATERIALS_BY_SUBJECT: (subjectId) => ['materials', subjectId],
    STUDENT_MATERIALS: ['materials', 'student'],

    FILTER_METADATA: ['filter-metadata'],

    REPORTS: ['reports'],

}
