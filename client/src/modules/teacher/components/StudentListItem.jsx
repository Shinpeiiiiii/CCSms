import { useState } from 'react';

const AVATAR_COLORS = [
    '#6366f1', // indigo-500
    '#0ea5e9', // sky-500
    '#334155', // slate-700
    '#f59e0b', // amber-500
    '#10b981', // emerald-500
    '#f43f5e', // rose-500
    '#8b5cf6', // violet-500
    '#06b6d4', // cyan-500
];

const StudentListItem = ({ student, index, rightContent }) => {
    const [hovered, setHovered] = useState(false);
    const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
    const initials = `${student?.firstName?.[0] || ''}${student?.lastName?.[0] || ''}`.toUpperCase();

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="student-row"
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                borderRadius: '12px',
                backgroundColor: hovered ? '#f9fafb' : 'transparent',
                cursor: 'pointer',
                transition: 'background-color 150ms ease',
                animationDelay: `${index * 45}ms`,
                borderBottom: '1px solid #f3f4f6',
            }}
        >
            {/* Row number */}
            <span style={{ width: '28px', fontSize: '12px', color: '#9ca3af', fontWeight: '500', flexShrink: 0 }}>
                {String(index + 1).padStart(2, '0')}
            </span>

            {/* Avatar */}
            <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: '700',
                flexShrink: 0,
            }}>
                {initials}
            </div>

            {/* Name + meta */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#111827',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    margin: 0,
                }}>
                    {student?.lastName}, {student?.firstName}
                </p>
                {(student?.studentNumber || student?.email) && (
                    <p style={{
                        fontSize: '0.75rem',
                        color: '#9ca3af',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        margin: 0,
                        marginTop: '2px',
                    }}>
                        {student?.studentNumber && `ID: ${student.studentNumber}`}
                        {student?.studentNumber && student?.email && ' \u2022 '}
                        {student?.email}
                    </p>
                )}
            </div>

            {/* Right slot */}
            {rightContent}
        </div>
    );
};

export default StudentListItem;
