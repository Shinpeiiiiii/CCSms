import { useState, useCallback, useMemo } from 'react';
import { Calendar, Check, X, AlertCircle, Clock, Save, Search } from 'lucide-react';
import EmptyState from './EmptyState';

/* ── Avatar colours (same palette as StudentsTab) ── */
const AVATAR_COLORS = [
    '#6366f1', '#0ea5e9', '#334155', '#f59e0b',
    '#10b981', '#f43f5e', '#8b5cf6', '#06b6d4',
];

/* ── Status config (self-contained, no Tailwind) ── */
const STATUSES = [
    {
        key: 'Present',
        icon: Check,
        active: { backgroundColor: '#dcfce7', color: '#15803d', borderColor: '#86efac' },
    },
    {
        key: 'Late',
        icon: Clock,
        active: { backgroundColor: '#fef3c7', color: '#b45309', borderColor: '#fcd34d' },
    },
    {
        key: 'Absent',
        icon: X,
        active: { backgroundColor: '#fee2e2', color: '#dc2626', borderColor: '#fca5a5' },
    },
    {
        key: 'Excused',
        icon: AlertCircle,
        active: { backgroundColor: '#dbeafe', color: '#2563eb', borderColor: '#93c5fd' },
    },
];

const IDLE_STYLE = {
    backgroundColor: '#ffffff',
    color: '#9ca3af',
    borderColor: '#e5e7eb',
};

/* ── Per-row attendance controls ── */
const AttendanceRow = ({ student, index, status, onStatusChange }) => {
    const [hovered, setHovered] = useState(false);
    const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
    const initials = `${student?.firstName?.[0] || ''}${student?.lastName?.[0] || ''}`.toUpperCase();

    return (
        <div
            style={{
                borderBottom: '1px solid #f3f4f6',
                padding: '12px',
                borderRadius: '12px',
                backgroundColor: hovered ? '#f9fafb' : 'transparent',
                transition: 'background-color 150ms ease',
                animationDelay: `${index * 40}ms`,
            }}
            className="student-row"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Student identity row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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

                {/* Name + ID */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                        margin: 0,
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#111827',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}>
                        {student?.lastName}, {student?.firstName}
                    </p>
                    {student?.studentNumber && (
                        <p style={{
                            margin: 0,
                            marginTop: '2px',
                            fontSize: '0.75rem',
                            color: '#9ca3af',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}>
                            ID: {student.studentNumber}
                        </p>
                    )}
                </div>
            </div>

            {/* Status buttons row */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '10px',
                paddingLeft: '40px', // align under the name
            }}>
                {STATUSES.map(({ key, icon: Icon, active }) => {
                    const isActive = status === key;
                    const btnStyle = isActive ? active : IDLE_STYLE;
                    return (
                        <button
                            key={key}
                            onClick={() => onStatusChange(student?._id, key)}
                            style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px',
                                padding: '5px 0',
                                fontSize: '11px',
                                fontWeight: '600',
                                border: `1px solid ${btnStyle.borderColor}`,
                                borderRadius: '8px',
                                backgroundColor: btnStyle.backgroundColor,
                                color: btnStyle.color,
                                cursor: 'pointer',
                                transition: 'all 150ms ease',
                            }}
                        >
                            <Icon size={11} />
                            {key}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

/* ── Main AttendanceTab ── */
const AttendanceTab = ({
    students,
    attendanceData,
    attendanceLoading,
    selectedDate,
    onDateChange,
    onSave,
    saving,
}) => {
    const [search, setSearch] = useState('');

    const [records, setRecords] = useState(() => {
        const initial = {};
        (attendanceData?.students || []).forEach(s => {
            initial[s.student?._id] = {
                status: s.attendance?.status || 'Present',
                remarks: s.attendance?.remarks || '',
            };
        });
        return initial;
    });

    const handleStatusChange = useCallback((studentId, status) => {
        setRecords(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], status },
        }));
    }, []);

    const handleSave = useCallback(async () => {
        const recordsArray = Object.entries(records).map(([studentId, r]) => ({
            studentId,
            status: r.status,
            remarks: r.remarks,
        }));
        await onSave(recordsArray);
    }, [records, onSave]);

    const filtered = useMemo(() => {
        let list = students || [];
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(s =>
                `${s.student?.firstName} ${s.student?.lastName} ${s.student?.studentNumber}`
                    .toLowerCase().includes(q)
            );
        }
        return list;
    }, [students, search]);

    if (attendanceLoading) {
        return (
            <div>
                {/* toolbar skeleton */}
                <div style={{ padding: '12px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ width: '160px', height: '34px', borderRadius: '8px', backgroundColor: '#f3f4f6' }} />
                    <div style={{ width: '72px', height: '34px', borderRadius: '8px', backgroundColor: '#f3f4f6' }} />
                </div>
                {/* search skeleton */}
                <div style={{ padding: '12px 20px', borderBottom: '1px solid #f3f4f6' }}>
                    <div style={{ height: '36px', borderRadius: '8px', backgroundColor: '#f3f4f6' }} />
                </div>
                {/* row skeletons */}
                {[1, 2, 3].map(i => (
                    <div key={i} style={{ padding: '12px', margin: '0 8px', borderBottom: '1px solid #f9fafb' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                            <div style={{ width: '28px', height: '12px', borderRadius: '4px', backgroundColor: '#f3f4f6' }} />
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#f3f4f6', flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ height: '12px', width: '130px', borderRadius: '4px', backgroundColor: '#f3f4f6', marginBottom: '6px' }} />
                                <div style={{ height: '10px', width: '90px', borderRadius: '4px', backgroundColor: '#f3f4f6' }} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', paddingLeft: '40px' }}>
                            {[1, 2, 3, 4].map(j => (
                                <div key={j} style={{ flex: 1, height: '28px', borderRadius: '8px', backgroundColor: '#f3f4f6' }} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!students || students.length === 0) {
        return <EmptyState icon={Calendar} heading="No students to mark" />;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* ── Date picker + Save ── */}
            <div style={{
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #f3f4f6',
                flexShrink: 0,
                backgroundColor: '#fafafa',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={14} style={{ color: '#9ca3af' }} />
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={e => onDateChange(e.target.value)}
                        style={{
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            fontSize: '0.875rem',
                            color: '#111827',
                            outline: 'none',
                            backgroundColor: '#ffffff',
                        }}
                    />
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: saving ? '#6b7280' : '#0f172a',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '7px 16px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        transition: 'background-color 150ms ease',
                    }}
                >
                    <Save size={12} />
                    {saving ? 'Saving…' : 'Save'}
                </button>
            </div>

            {/* ── Search ── */}
            <div style={{
                padding: '12px 20px',
                borderBottom: '1px solid #f3f4f6',
                flexShrink: 0,
            }}>
                <div style={{ position: 'relative' }}>
                    <Search
                        size={15}
                        style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#9ca3af',
                            pointerEvents: 'none',
                        }}
                    />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search students..."
                        style={{
                            width: '100%',
                            backgroundColor: '#f9fafb',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            paddingLeft: '36px',
                            paddingRight: '12px',
                            paddingTop: '8px',
                            paddingBottom: '8px',
                            fontSize: '0.875rem',
                            color: '#374151',
                            outline: 'none',
                            boxSizing: 'border-box',
                        }}
                    />
                </div>
            </div>

            {/* ── Column header ── */}
            <div style={{ padding: '10px 20px 6px', flexShrink: 0 }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#9ca3af',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                }}>
                    <span style={{ width: '28px' }}>#</span>
                    <span>Student</span>
                </div>
            </div>

            {/* ── Student rows ── */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px 16px' }}>
                {filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#9ca3af', paddingTop: '40px' }}>
                        No students match your search.
                    </div>
                ) : (
                    filtered.map((s, idx) => (
                        <AttendanceRow
                            key={s._id}
                            student={s.student}
                            index={idx}
                            status={records[s.student?._id]?.status || 'Present'}
                            onStatusChange={handleStatusChange}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default AttendanceTab;
