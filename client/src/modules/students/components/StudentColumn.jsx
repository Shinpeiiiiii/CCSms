const StudentColumn = ({ openAssignModal, handleDelete, selectedStudentIds, handleSelectAll, toggleSelectStudent, isAllSelected, deleteId }) => [
    {
        header: "",
        sortable: false,
        renderHeader: () => (
            <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleSelectAll}
                style={{ cursor: 'pointer', accentColor: '#6366F1', width: 15, height: 15 }}
                title="Select all filtered students"
            />
        ),
        render: (student) => {
            const isSelected = selectedStudentIds.includes(student._id);
            return (
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelectStudent(student._id)}
                    style={{ cursor: 'pointer', accentColor: '#6366F1', width: 15, height: 15 }}
                />
            );
        },
    },
    {
        header: "Name",
        render: (student) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    flexShrink: 0,
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#A5B4FC',
                    fontSize: 12,
                    fontWeight: 700,
                }}>
                    {student.firstName?.[0] || '?'}
                </div>
                <div>
                    <span style={{ color: '#202124', fontWeight: 500, fontSize: 14, display: 'block' }}>
                        {[student.firstName, student.middleName, student.lastName].filter(Boolean).join(' ')}
                    </span>
                    {student.studentNumber && (
                        <span style={{ color: '#5F6368', fontSize: 11 }}>#{student.studentNumber}</span>
                    )}
                </div>
            </div>
        ),
    },
    {
        header: "Email",
        accessor: "email",
    },
    {
        header: "Academic Program",
        render: (student) => (
            <span style={{
                background: 'rgba(99,102,241,0.1)',
                color: '#6366F1',
                padding: '3px 10px',
                borderRadius: 100,
                fontSize: 12,
                fontWeight: 500,
            }}>
                {student.program?.programCode || student.program?.programName || student.degreeProgram || '—'}
            </span>
        ),
    },
    {
        header: "Section",
        render: (student) => {
            if (student.section) {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{
                            background: 'rgba(16,185,129,0.1)',
                            color: '#059669',
                            padding: '3px 10px',
                            borderRadius: 100,
                            fontSize: 12,
                            fontWeight: 600,
                            border: '1px solid rgba(16,185,129,0.2)'
                        }}>
                            {student.section.sectionCode || student.section.sectionName}
                        </span>
                        <button
                            onClick={() => openAssignModal(student)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#6366F1',
                                padding: 2,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                            title="Change Section"
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                        </button>
                    </div>
                );
            }
            return (
                <button
                    onClick={() => openAssignModal(student)}
                    style={{
                        background: 'rgba(99,102,241,0.08)',
                        border: '1px solid rgba(99,102,241,0.2)',
                        color: '#6366F1',
                        padding: '4px 10px',
                        borderRadius: 8,
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                        transition: 'all 0.2s',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4
                    }}
                >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Assign
                </button>
            );
        },
    },
    {
        header: "Year Level",
        render: (student) => student.yearLevel || '—',
    },
    {
        header: "Actions",
        sortable: false,
        render: (student) => {
            const isDeleting = deleteId === student._id;
            return (
                <button
                    onClick={() => handleDelete(student._id)}
                    disabled={isDeleting}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.2)',
                        color: '#DC2626',
                        padding: '6px 12px',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                        transition: 'all 0.2s',
                        opacity: isDeleting ? 0.5 : 1,
                    }}
                    type="button"
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6M14 11v6" />
                    </svg>
                    {isDeleting ? '...' : 'Delete'}
                </button>
            );
        },
    },
];

export default StudentColumn;
