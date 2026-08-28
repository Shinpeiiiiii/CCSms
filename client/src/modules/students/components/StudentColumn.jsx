const StudentColumn = ({ openAssignModal, handleDelete, selectedStudentIds, handleSelectAll, toggleSelectStudent, isAllSelected, deleteId }) => [
    {
        header: "",
        sortable: false,
        renderHeader: () => (
            <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleSelectAll}
                style={{ cursor: 'pointer', accentColor: '#111827', width: 15, height: 15 }}
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
                    style={{ cursor: 'pointer', accentColor: '#111827', width: 15, height: 15 }}
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
                    flexShrink: 0,
                    background: '#F3F4F6',
                    border: '1px solid #E5E7EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6B7280',
                    fontSize: 12,
                    fontWeight: 700,
                }}>
                    {student.firstName?.[0] || '?'}
                </div>
                <div>
                    <span style={{ color: '#111827', fontWeight: 500, fontSize: 13, display: 'block' }}>
                        {[student.firstName, student.middleName, student.lastName].filter(Boolean).join(' ')}
                    </span>
                    {student.studentNumber && (
                        <span style={{ color: '#9CA3AF', fontSize: 11 }}>#{student.studentNumber}</span>
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
                background: '#F3F4F6',
                color: '#374151',
                padding: '3px 10px',
                fontSize: 12,
                fontWeight: 500,
                border: '1px solid #E5E7EB',
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
                            background: '#F0FDF4',
                            color: '#16A34A',
                            padding: '3px 10px',
                            fontSize: 12,
                            fontWeight: 600,
                            border: '1px solid #BBF7D0',
                        }}>
                            {student.section.sectionCode || student.section.sectionName}
                        </span>
                        <button
                            onClick={() => openAssignModal(student)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#6B7280',
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
                        background: '#F9FAFB',
                        border: '1px solid #E5E7EB',
                        color: '#374151',
                        padding: '4px 10px',
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
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
                        background: '#FEF2F2',
                        border: '1px solid #FECACA',
                        color: '#DC2626',
                        padding: '5px 12px',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
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
