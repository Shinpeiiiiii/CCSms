# Teacher Portal — Teacher Module Expansion Plan

## Context

The Teacher Portal currently has a schedule page (`/teacher/schedule`) and a generic admin dashboard that shows hardcoded stats. Teachers have no way to see their students, enter grades, or get a personalized dashboard. The `StudentSubject` model already has `finalGrade` and `remarks` fields that are never written to. This plan adds three new features to make the teacher side functional and modern.

---

## Phase 1: Teacher Dashboard (`/teacher/dashboard`)

### Goal
Replace the generic admin dashboard with a teacher-specific landing page showing today's classes, aggregate stats, and quick navigation.

### Backend — `server/src/modules/sectionsubject/services/sectionsubject.services.js`

Add `getTeacherDashboard(teacherId)`:
- Query `SectionSubject.find({ instructor: teacherId, status: "Scheduled" })` with populated `subject` and `section`
- For each, count `StudentSubject.countDocuments({ section, subject, status: "Loaded" })`
- Derive: `totalSubjects` (unique), `totalSections` (unique), `totalUnits` (sum of subject.units), `totalStudents` (sum of all counts)
- Derive: `todayClasses` — filter by `day === today's weekday` (e.g. `"Monday"`), sorted by `startTime`
- Return `{ stats: { totalSubjects, totalSections, totalUnits, totalStudents }, todayClasses, allClasses }`

### Backend — `server/src/modules/sectionsubject/controller/sectionsubject.controller.js`

Add `getMyDashboard` handler: extracts `req.user.id`, calls `getTeacherDashboard`, returns JSON.

### Backend — `server/src/modules/sectionsubject/routes/sectionsubject.routes.js`

Add `GET /my-dashboard` with `authorizeRoles('teacher')`. Place before `/:sectionId` param route.

### Frontend — `client/src/modules/teacher/services/teacher.service.js`

Add `getMyDashboard()` → `GET /api/section-subject/my-dashboard`.

### Frontend — `client/src/modules/teacher/pages/TeacherDashboard.jsx` (NEW)

Structure (follows `StudentDashboard.jsx` pattern — Tailwind, no inline styles):
- `<DashboardLayout>` wrapper
- **Welcome banner**: `bg-gray-900 text-white p-6` — "Welcome back, {firstName}!" with today's date
- **Stats row**: 4-col grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4`) — Subjects, Sections, Total Students, Total Units. Each card: `bg-white border border-gray-200 p-5` with icon + value + label
- **Today's Classes** section: if `todayClasses.length > 0`, render a list of class cards (each shows subject code, name, time, room, section). If empty, show "No classes today" empty state
- **Quick Links** section: 3-col grid linking to My Schedule, My Classes, Grade Book — same pattern as `StudentDashboard.jsx` Quick Actions

### Router & Navigation

- Register route in `client/src/main/router/index.jsx`: `path: '/teacher/dashboard'` with `RoleProtectedRoute allowedRoles={['teacher']}` → `TeacherDashboard`
- Update `client/src/modules/auth/config/navigation.jsx`: set teacher dashboard route to `/teacher/dashboard`

---

## Phase 2: My Classes — Class Roster (`/teacher/classes`)

### Goal
Teachers can see all their assigned classes as cards, click one to view the full student roster.

### Backend — `server/src/modules/sectionsubject/services/sectionsubject.services.js`

Add two functions:

1. `getTeacherClasses(teacherId)`:
   - Query `SectionSubject.find({ instructor: teacherId, status: "Scheduled" })` with populated `subject` and `section`
   - For each, count `StudentSubject.countDocuments({ section: ss.section._id, subject: ss.subject._id, status: "Loaded" })`
   - Return array of `{ _id, subject, section, day, startTime, endTime, room, studentCount }`

2. `getClassStudents(sectionSubjectId)`:
   - Find the SectionSubject by `_id` to get `section` and `subject` ObjectIds
   - Query `StudentSubject.find({ section, subject, status: "Loaded" }).populate("student")`
   - Return `{ sectionSubject: { subject, section, day, startTime, endTime, room }, students: [...] }` where each student has `studentNumber`, `firstName`, `lastName`, `email`, `status`, `yearLevel`, `studentType`

### Backend — `server/src/modules/sectionsubject/controller/sectionsubject.controller.js`

Add `getMyClasses` and `getClassStudents` handlers.

### Backend — `server/src/modules/sectionsubject/routes/sectionsubject.routes.js`

- `GET /my-classes` with `authorizeRoles('teacher')` — before `/:sectionId`
- `GET /:sectionId/students` with `authorizeRoles('teacher')` — after paramless routes

### Frontend — `client/src/modules/teacher/services/teacher.service.js`

- `getMyClasses()` → `GET /api/section-subject/my-classes`
- `getClassStudents(sectionSubjectId)` → `GET /api/section-subject/${sectionSubjectId}/students`

### Frontend — `client/src/modules/teacher/pages/TeacherClasses.jsx` (NEW)

Two views (toggle via state):

**Card Grid View** (default):
- Header: "My Classes" with subtitle
- Grid of class cards (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`), each `bg-white border border-gray-200 p-5`:
  - Subject code + name
  - Section code + name
  - Schedule: day + time range
  - Room
  - Student count badge ("24 students")
  - Click → sets `selectedClass` to show roster

**Roster View** (when `selectedClass` set):
- Back button ("← Back to Classes")
- Header with subject code, section, schedule info
- Table: Student #, Name, Email, Year Level, Student Type, Status
- Empty state if no students

### Router & Navigation

- Register `/teacher/classes` route → `TeacherClasses`
- Add nav item: "My Classes" with `BookOpen` icon → `/teacher/classes`

---

## Phase 3: Grade Book (`/teacher/grades`)

### Goal
Teachers select a class, see all students, and enter/update final grades. Auto-compute remarks.

### Backend — `server/src/modules/sectionsubject/services/sectionsubject.services.js`

Add two functions:

1. `getClassGrades(sectionSubjectId)`:
   - Find SectionSubject → get `section` and `subject`
   - Query `StudentSubject.find({ section, subject }).populate("student")`
   - Return `{ sectionSubject: { subject, section, day, startTime, endTime, room }, grades: [{ _id, student: { studentNumber, firstName, lastName }, finalGrade, remarks, status, units }] }`

2. `updateGrades(sectionSubjectId, gradesArray)`:
   - `gradesArray`: `[{ studentSubjectId, finalGrade }]`
   - For each: compute `remarks` — grade >= 75 → "Passed", < 75 → "Failed", null → null
   - Compute `status` — grade entered → "Completed", grade < 75 → "Failed"
   - `StudentSubject.updateOne()` for each
   - Return updated records

### Backend — `server/src/modules/sectionsubject/controller/sectionsubject.controller.js`

Add `getClassGrades` and `updateGrades` handlers.

### Backend — `server/src/modules/sectionsubject/routes/sectionsubject.routes.js`

- `GET /:sectionId/grades` with `authorizeRoles('teacher')`
- `PATCH /:sectionId/grades` with `authorizeRoles('teacher')` — body: `{ grades: [{ studentSubjectId, finalGrade }] }`

### Frontend — `client/src/modules/teacher/services/teacher.service.js`

- `getClassGrades(sectionSubjectId)` → `GET /api/section-subject/${sectionSubjectId}/grades`
- `updateGrades(sectionSubjectId, grades)` → `PATCH /api/section-subject/${sectionSubjectId}/grades`

### Frontend — `client/src/modules/teacher/pages/TeacherGrades.jsx` (NEW)

Two views:

**Class Select View** (default):
- Header: "Grade Book" with subtitle
- Grid of class cards — subject, section, student count
- Click → sets `selectedClass`

**Grade Entry View** (when class selected):
- Back button
- Header: subject + section + schedule
- Table: Student #, Name, Grade (number input), Remarks (auto-computed badge), Status
- Grade input: `<input type="number" min="0" max="100" step="0.01">` — `border border-gray-200` square, `#111827` focus
- Remarks: green badge "Passed" if >= 75, red badge "Failed" if < 75, "—" if null
- "Save Grades" button (`bg-gray-900 text-white`) — saves changed records only
- Toast on save via `react-toastify`
- Empty state if no students

### Router & Navigation

- Register `/teacher/grades` route → `TeacherGrades`
- Add nav item: "Grade Book" with `GraduationCap` icon → `/teacher/grades`

---

## Files to Create

| File | Type |
|---|---|
| `client/src/modules/teacher/pages/TeacherDashboard.jsx` | New page |
| `client/src/modules/teacher/pages/TeacherClasses.jsx` | New page |
| `client/src/modules/teacher/pages/TeacherGrades.jsx` | New page |

## Files to Modify

| File | Changes |
|---|---|
| `server/src/modules/sectionsubject/services/sectionsubject.services.js` | Add 5 service functions |
| `server/src/modules/sectionsubject/controller/sectionsubject.controller.js` | Add 5 handler functions |
| `server/src/modules/sectionsubject/routes/sectionsubject.routes.js` | Add 5 routes |
| `client/src/modules/teacher/services/teacher.service.js` | Add 5 API functions |
| `client/src/main/router/index.jsx` | Add 3 routes |
| `client/src/modules/auth/config/navigation.jsx` | Update teacher nav items |

## Verification

- `npm run build` in client — must be clean
- Login as teacher → sidebar shows Dashboard, My Classes, My Schedule, Grade Book
- Dashboard shows today's classes and stats
- My Classes shows cards with student counts, click opens roster
- Grade Book shows classes, click opens grade entry, enter grades, save, verify remarks auto-compute
- Existing pages still work
