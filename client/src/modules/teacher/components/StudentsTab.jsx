import { useMemo, useState } from 'react';
import { Users, Search } from 'lucide-react';
import SortSelect from './SortSelect';
import StudentListItem from './StudentListItem';
import StatusBadge from './StatusBadge';
import EmptyState from './EmptyState';

const SORT_OPTIONS = [
    { value: 'name-asc', label: 'Name A-Z' },
    { value: 'name-desc', label: 'Name Z-A' },
    { value: 'number', label: 'Student ID' },
    { value: 'status', label: 'Status' },
];

const StudentsTab = ({ students, loading }) => {
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('name-asc');

    const filtered = useMemo(() => {
        let list = [...students];

        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(s =>
                `${s.student?.firstName} ${s.student?.lastName} ${s.student?.studentNumber} ${s.student?.email}`
                    .toLowerCase().includes(q)
            );
        }

        list.sort((a, b) => {
            switch (sort) {
                case 'name-desc':
                    return `${b.student?.lastName} ${b.student?.firstName}`.localeCompare(`${a.student?.lastName} ${a.student?.firstName}`);
                case 'number':
                    return (a.student?.studentNumber || '').localeCompare(b.student?.studentNumber || '');
                case 'status':
                    return (a.student?.status || '').localeCompare(b.student?.status || '');
                default:
                    return `${a.student?.lastName} ${a.student?.firstName}`.localeCompare(`${b.student?.lastName} ${b.student?.firstName}`);
            }
        });

        return list;
    }, [students, search, sort]);

    if (loading) {
        return (
            <div>
                <div style={{ padding: '12px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', gap: '8px' }}>
                    <div style={{ flex: 1, height: '36px', borderRadius: '8px', backgroundColor: '#f3f4f6' }} />
                    <div style={{ width: '96px', height: '36px', borderRadius: '8px', backgroundColor: '#f3f4f6' }} />
                </div>
                <div style={{ padding: '10px 20px 6px', display: 'flex', alignItems: 'center', fontSize: '11px', fontWeight: '600', color: '#9ca3af', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    <span style={{ width: '28px' }}>#</span>
                    <span>Student</span>
                </div>
                {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', margin: '0 8px', borderBottom: '1px solid #f9fafb' }}>
                        <div style={{ width: '28px', height: '12px', borderRadius: '4px', backgroundColor: '#f3f4f6' }} />
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#f3f4f6', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                            <div style={{ height: '12px', width: '120px', borderRadius: '4px', backgroundColor: '#f3f4f6', marginBottom: '6px' }} />
                            <div style={{ height: '10px', width: '180px', borderRadius: '4px', backgroundColor: '#f3f4f6' }} />
                        </div>
                        <div style={{ width: '56px', height: '24px', borderRadius: '9999px', backgroundColor: '#f3f4f6' }} />
                    </div>
                ))}
            </div>
        );
    }

    if (students.length === 0) {
        return <EmptyState icon={Users} heading="No students enrolled" subtext="Students will appear once assigned to this section." />;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Search + Sort */}
            <div style={{
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexShrink: 0,
                borderBottom: '1px solid #f3f4f6',
            }}>
                <div style={{ flex: 1, position: 'relative' }}>
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
                <SortSelect value={sort} onChange={e => setSort(e.target.value)} options={SORT_OPTIONS} />
            </div>

            {/* Column header */}
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

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px 16px' }}>
                {filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#9ca3af', paddingTop: '40px' }}>
                        No students match your search.
                    </div>
                ) : (
                    filtered.map((s, idx) => (
                        <StudentListItem
                            key={s._id}
                            student={s.student}
                            index={idx}
                            rightContent={<StatusBadge status={s.student?.status || 'Active'} />}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default StudentsTab;
