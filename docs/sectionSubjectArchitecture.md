# SectionSubject Module Documentation

## 1. Overview

The `SectionSubject` module manages the **actual subject offerings assigned to a specific section**.

A curriculum defines the subjects that students are expected to take. A section subject represents how those subjects are delivered to a particular section during an academic period.

For example:

> The curriculum requires **Programming 1** for first-year BSIT students.

The corresponding `SectionSubject` record defines:

> **Programming 1** is offered to **BSIT-1A**, taught by a specific instructor, in a specific room, on a scheduled day and time.

The `SectionSubject` module acts as the bridge between:

* Curriculum planning
* Section management
* Faculty teaching assignments
* Student schedules
* Student academic loads
* Grade encoding

---

# 2. Purpose

The module is responsible for converting curriculum requirements into actual class offerings.

The main responsibilities are:

1. Generate subjects for a section.
2. Connect subjects to a specific section.
3. Assign an instructor.
4. Assign a room.
5. Configure the class day.
6. Configure the class start and end times.
7. Manage the status of a section subject.
8. Provide schedule information to students.
9. Provide teaching-load information to instructors.
10. Support future class-list and grade-encoding features.

---

# 3. Academic Architecture

The SectionSubject module is part of the following academic workflow:

```text
Program
   │
   ▼
Curriculum
   │
   ▼
CurriculumSubject
   │
   ▼
Section
   │
   ▼
SectionSubject
   │
   ├─────────────────┐
   ▼                 ▼
Instructor      StudentSubject
                     │
                     ▼
                   Grade
```

Each module has a different responsibility.

| Module              | Responsibility                                      |
| ------------------- | --------------------------------------------------- |
| `Program`           | Defines an academic degree program                  |
| `Curriculum`        | Defines the academic plan for a program             |
| `CurriculumSubject` | Defines the subjects required by a curriculum       |
| `Section`           | Groups students by academic year and year level     |
| `SectionSubject`    | Represents an actual subject offering for a section |
| `StudentSubject`    | Represents a student's academic subject record      |
| `Grade`             | Stores academic performance                         |

---

# 4. CurriculumSubject vs SectionSubject

Although both modules are related to subjects, they have different purposes.

## CurriculumSubject

A `CurriculumSubject` defines an academic requirement.

Example:

```text
Subject:
Programming 1

Year Level:
1

Semester:
1

Curriculum:
BSIT Curriculum 2024
```

At this stage:

* No section is assigned.
* No instructor is assigned.
* No room is assigned.
* No schedule exists.
* No student is assigned.

The record only defines what students are expected to study.

---

## SectionSubject

A `SectionSubject` defines an actual class offering.

Example:

```text
Section:
BSIT-1A

Subject:
Programming 1

Instructor:
Juan Dela Cruz

Room:
Computer Laboratory 2

Day:
Monday

Start Time:
08:00

End Time:
10:00
```

At this stage, the subject has become an actual class that can be viewed by students and instructors.

---

# 5. SectionSubject Generation Flow

The registrar generates section subjects after creating a section.

```text
Create Curriculum
       │
       ▼
Add Curriculum Subjects
       │
       ▼
Create Section
       │
       ▼
Select Section
       │
       ▼
Generate Section Subjects
       │
       ▼
Configure Instructor and Schedule
```

The detailed generation process is:

```text
Section
   │
   ├── Curriculum
   │
   └── Year Level
          │
          ▼
Find matching CurriculumSubject records
          │
          ▼
Create SectionSubject records
```

The system uses the selected section's academic information to determine which subjects should be generated.

---

# 6. Example Generation

Assume the following section exists:

```text
Section Code:
BSIT-1A

Curriculum:
BSIT Curriculum 2024

Year Level:
1

Academic Year:
2026–2027
```

The curriculum contains the following first-year subjects:

| Subject Code | Subject                         |
| ------------ | ------------------------------- |
| IT101        | Introduction to Computing       |
| IT102        | Computer Programming 1          |
| IT103        | Mathematics in the Modern World |
| IT104        | Understanding the Self          |

After generation, the system creates a SectionSubject record for each matching subject.

```text
BSIT-1A
├── Introduction to Computing
├── Computer Programming 1
├── Mathematics in the Modern World
└── Understanding the Self
```

Initially, the generated records may not have instructors or schedules.

The registrar configures these values afterward.

---

# 7. Data Model

A SectionSubject record should conceptually contain the following information:

```javascript
{
    section: ObjectId,

    subject: ObjectId,

    instructor: ObjectId,

    room: String,

    day: String,

    startTime: String,

    endTime: String,

    status: String,

    createdBy: ObjectId,

    updatedBy: ObjectId,

    createdAt: Date,

    updatedAt: Date,
}
```

## Field Descriptions

| Field        | Description                                    |
| ------------ | ---------------------------------------------- |
| `section`    | The section that owns the subject offering     |
| `subject`    | The subject being offered                      |
| `instructor` | The teacher assigned to the subject            |
| `room`       | The classroom or laboratory                    |
| `day`        | The scheduled meeting day                      |
| `startTime`  | The class starting time                        |
| `endTime`    | The class ending time                          |
| `status`     | The current availability or state of the class |
| `createdBy`  | The user who created or generated the record   |
| `updatedBy`  | The user who last updated the record           |
| `createdAt`  | The date when the record was created           |
| `updatedAt`  | The date when the record was last updated      |

---

# 8. Backend Architecture

The backend follows a modular architecture.

```text
src/
└── modules/
    └── sectionSubject/
        ├── controllers/
        │   └── sectionSubject.controller.js
        │
        ├── models/
        │   └── sectionSubject.model.js
        │
        ├── routes/
        │   └── sectionSubject.routes.js
        │
        └── services/
            └── sectionSubject.service.js
```

## Model

The model defines:

* The section relationship
* The subject relationship
* The instructor relationship
* Room information
* Schedule information
* Status information

The model is responsible only for data structure and database-level rules.

---

## Service

The service contains the module's business logic.

Main service functions:

```javascript
generateSectionSubjects(sectionId);

getSectionSubjects(sectionId);

updateSectionSubject(id, payload);
```

The service is responsible for:

* Finding the section.
* Finding matching curriculum subjects.
* Preventing duplicate section subjects.
* Creating section-subject records.
* Retrieving section subjects.
* Updating instructors and schedules.

---

## Controller

The controller handles:

* HTTP requests
* Request parameters
* Request bodies
* Service calls
* HTTP responses
* Error responses

The controller should not contain complex academic business logic.

Example flow:

```text
Frontend Request
       │
       ▼
Controller
       │
       ▼
Service
       │
       ▼
Database
       │
       ▼
Service Result
       │
       ▼
Controller Response
```

---

## Routes

The SectionSubject module provides routes for generation, retrieval, and updates.

### Generate Section Subjects

```http
POST /api/section-subject/generate/:sectionId
```

Purpose:

Generate section-subject records using the selected section's curriculum and year level.

---

### Get Section Subjects

```http
GET /api/section-subject/:sectionId
```

Purpose:

Retrieve all generated subjects for a section.

The response should include populated:

* Subject information
* Instructor information
* Optional section information

---

### Update Section Subject

```http
PATCH /api/section-subject/:id
```

Purpose:

Update the actual class offering.

The registrar can update:

* Instructor
* Room
* Day
* Start time
* End time
* Status

Example request body:

```json
{
    "instructor": "teacher-object-id",
    "room": "Computer Laboratory 2",
    "day": "Monday",
    "startTime": "08:00",
    "endTime": "10:00",
    "status": "Active"
}
```

---

# 9. Duplicate Prevention

A section should not receive the same subject more than once.

The following combination should be unique:

```text
Section + Subject
```

Example:

```text
BSIT-1A + Programming 1
```

Only one SectionSubject record should exist for this combination.

A database-level unique index may be used:

```javascript
sectionSubjectSchema.index(
    {
        section: 1,
        subject: 1,
    },
    {
        unique: true,
    }
);
```

This prevents duplicate records even if the generation endpoint is called multiple times.

---

# 10. Frontend Architecture

The frontend follows a component-based structure.

```text
src/
└── modules/
    └── academic/
        └── sectionSubject/
            ├── pages/
            │   └── SectionSubjects.jsx
            │
            ├── components/
            │   ├── SectionSelector.jsx
            │   ├── SectionSubjectTable.jsx
            │   └── SectionSubjectRow.jsx
            │
            └── services/
                └── sectionSubject.service.js
```

---

## SectionSubjects.jsx

Responsibilities:

* Load available sections.
* Load available teachers.
* Store the selected section.
* Load section subjects.
* Generate section subjects.
* Save section-subject updates.
* Pass data to child components.

The page acts as the main container.

---

## SectionSelector.jsx

Responsibilities:

* Display the section dropdown.
* Allow the registrar to select a section.
* Provide the Generate Subjects button.

The component should not call backend APIs directly.

---

## SectionSubjectTable.jsx

Responsibilities:

* Display generated section subjects.
* Render table headers.
* Render one row for each SectionSubject record.
* Display an empty state when no subjects exist.

The component should not contain API logic.

---

## SectionSubjectRow.jsx

Responsibilities:

* Select an instructor.
* Enter or update the room.
* Select a class day.
* Set the start time.
* Set the end time.
* Save changes for one SectionSubject record.

Each row represents one actual class offering.

---

## sectionSubject.service.js

The frontend service communicates with the backend.

Main functions:

```javascript
generateSectionSubjects(sectionId);

getSectionSubjects(sectionId);

updateSectionSubject(id, payload);
```

The frontend service should contain API calls but should not contain UI logic.

---

# 11. User Roles and Permissions

| Role      | Permission                           |
| --------- | ------------------------------------ |
| Admin     | Full access                          |
| Registrar | Generate and manage section subjects |
| Teacher   | View assigned teaching load          |
| Student   | View section schedule                |

Recommended access rules:

```text
Admin
├── Generate section subjects
├── View section subjects
├── Update section subjects
└── Manage section-subject status

Registrar
├── Generate section subjects
├── View section subjects
├── Assign instructors
├── Configure schedules
└── Update section subjects

Teacher
└── View assigned section subjects

Student
└── View the schedule of their assigned section
```

---

# 12. Relationship with StudentSubject

The recommended academic flow is:

```text
Student
   │
   ▼
Section
   │
   ▼
SectionSubject
   │
   ▼
StudentSubject
```

The SectionSubject represents the actual class offering.

The StudentSubject represents the student's academic participation in that offering.

This design allows the student to inherit:

* Subject information
* Instructor
* Room
* Schedule
* Section context

The schedule should not be copied into every StudentSubject record.

---

# 13. Student Schedule Integration

The Student Schedule module will use the following flow:

```text
Logged-in Student
        │
        ▼
Student Section
        │
        ▼
SectionSubject
        │
        ▼
Subject + Instructor + Room + Schedule
```

The student can view:

* Subject code
* Subject title
* Instructor
* Room
* Day
* Start time
* End time

The Student Schedule module should read from SectionSubject instead of creating a separate schedule record.

---

# 14. Faculty Teaching Load Integration

The Faculty Teaching Load module will use:

```text
Logged-in Teacher
        │
        ▼
SectionSubject
        │
        ▼
Assigned Classes
```

The teacher can view:

* Section
* Subject
* Room
* Day
* Start time
* End time

No additional teaching-load model is required for the initial implementation.

---

# 15. Class List Integration

The future Teacher Class List module may use:

```text
Teacher
   │
   ▼
SectionSubject
   │
   ▼
Section
   │
   ▼
Students
```

The teacher can select an assigned class and view the students enrolled in the related section.

---

# 16. Grade Encoding Integration

The future Grade Encoding workflow may use:

```text
Teacher
   │
   ▼
SectionSubject
   │
   ▼
StudentSubject
   │
   ▼
Grade
```

The teacher selects an assigned SectionSubject and enters grades for the students connected to that class.

---

# 17. Current Features

| Feature                       | Status   |
| ----------------------------- | -------- |
| Section creation              | Complete |
| CurriculumSubject setup       | Complete |
| SectionSubject model          | Complete |
| Generate section subjects     | Complete |
| Retrieve section subjects     | Complete |
| Update section subjects       | Complete |
| Teacher lookup                | Complete |
| Section selection             | Complete |
| Section-subject table         | Complete |
| Instructor assignment         | Complete |
| Room assignment               | Complete |
| Day assignment                | Complete |
| Start and end time assignment | Complete |
| Student Schedule              | Next     |
| Faculty Teaching Load         | Planned  |
| Teacher Class List            | Planned  |
| Grade Encoding                | Planned  |

---

# 18. Validation Requirements

Before moving to the Student Schedule module, the following should be tested.

## Generation

* Select a section with no generated subjects.
* Generate section subjects.
* Generate again.
* Confirm that duplicate records are not created.

## Updates

* Assign an instructor.
* Assign a room.
* Assign a day.
* Assign a start time.
* Assign an end time.
* Save the record.
* Refresh the page.
* Confirm that the values remain.

## Section Filtering

* Select a different section.
* Confirm that only the selected section's subjects are displayed.

## Authorization

* Confirm that an admin can manage section subjects.
* Confirm that a registrar can manage section subjects.
* Confirm that a teacher cannot update section subjects.
* Confirm that a student cannot update section subjects.

## Invalid Data

Test:

* Invalid section ID
* Invalid SectionSubject ID
* Invalid instructor ID
* Missing section
* Missing subject
* Unauthorized request

---

# 19. Future Enhancements

The following features are useful but are not required before implementing the Student Schedule.

## Multiple Meeting Days

Current structure:

```text
Monday
08:00–10:00
```

Future structure:

```text
Monday
08:00–09:30

Wednesday
08:00–09:30
```

A future `ScheduleSlot` model may be introduced:

```text
SectionSubject
       │
       ▼
ScheduleSlot
       ├── Day
       ├── Start Time
       ├── End Time
       └── Room
```

---

## Schedule Conflict Detection

The system may prevent:

* An instructor from teaching two classes at the same time.
* A room from being assigned to two classes at the same time.
* A section from having overlapping classes.

---

## Room Management Module

The current room field may use free text:

```text
Computer Laboratory 2
```

A future Room module may provide:

```text
Room
├── Room Code
├── Building
├── Capacity
└── Room Type
```

---

## Bulk Updates

The registrar may edit multiple rows and use:

```text
Save All
```

This may require a bulk update endpoint.

---

## Expanded Status Values

Possible future statuses:

```text
Draft
Scheduled
Active
Cancelled
Completed
```

---

# 20. Summary

The SectionSubject module is the central representation of an **actual class offering**.

It transforms curriculum requirements into section-level classes that contain:

* A section
* A subject
* An instructor
* A room
* A meeting day
* A start time
* An end time
* A status

The complete workflow is:

```text
Program
   │
   ▼
Curriculum
   │
   ▼
CurriculumSubject
   │
   ▼
Section
   │
   ▼
Generate SectionSubjects
   │
   ▼
Assign Instructor and Schedule
   │
   ├──────────────────┐
   ▼                  ▼
Student Schedule   Faculty Teaching Load
   │
   ▼
StudentSubject
   │
   ▼
Grades
```

The SectionSubject module is the bridge between **academic curriculum planning** and **actual academic delivery**.
