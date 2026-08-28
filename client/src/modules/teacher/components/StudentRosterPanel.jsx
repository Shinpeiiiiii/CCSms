import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    X,
    Search,
    ChevronDown,
    ChevronUp,
    Calendar,
    Users,
    Check,
    CalendarDays,
} from 'lucide-react';
import { formatTime } from '../constants/teacherSchedule.constants';

const TABS = [
    { id: 'students', label: 'Students', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: Check },
    { id: 'history', label: 'History', icon: CalendarDays },
];

const AVATAR_COLORS = [
    'bg-indigo-500',
    'bg-sky-500',
    'bg-slate-700',
    'bg-amber-500',
    'bg-emerald-500',
    'bg-rose-500',
    'bg-violet-500',
    'bg-cyan-500',
    'bg-pink-500',
    'bg-teal-500',
];

const SORT_OPTIONS = [
    { value: 'name-asc', label: 'Name A-Z' },
    { value: 'name-desc', label: 'Name Z-A' },
    { value: 'id', label: 'Student ID' },
    { value: 'status', label: 'Status' },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.04, delayChildren: 0.1 },
    },
};

const rowVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', damping: 20, stiffness: 300 },
    },
};

const TabPill = ({ tab, isActive, onClick, count }) => (
    <button
        onClick={onClick}
        className="relative px-4 py-1.5 text-sm font-medium rounded-full transition-colors outline-none"
    >
        {isActive && (
            <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 bg-slate-900 rounded-full"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
        )}
        <span className="relative z-10 flex items-center gap-1.5" style={{ color: isActive ? '#fff' : '#6B7280' }}>
            {tab.label}
            {isActive && count != null && (
                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold bg-white/20 rounded-full">
                    {count}
                </span>
            )}
        </span>
    </button>
);

const StudentRow = ({ student, index, color, onClick }) => (
    <motion.div
        variants={rowVariants}
        whileHover={{ scale: 1.005 }}
        onClick={onClick}
        className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
    >
        <span className="w-8 text-xs font-medium text-gray-400 tabular-nums shrink-0">
            {String(index + 1).padStart(2, '0')}
        </span>
        <div
            className={`w-9 h-9 ${color} rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}
        >
            {student.initials}
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
                {student.last}, {student.first}
            </p>
            <p className="text-xs text-gray-400 truncate">
                ID: {student.id} &bull; {student.email}
            </p>
        </div>
        <span
            className={`px-2.5 py-0.5 text-[10px] font-semibold rounded-full shrink-0 ${
                student.status === 'Active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
            }`}
        >
            {student.status}
        </span>
    </motion.div>
);

const StudentRosterPanel = ({
    isOpen,
    onClose,
    students = [],
    classInfo = {},
    onTabChange,
    activeTab: controlledTab,
    attendanceContent,
    historyContent,
    onStudentClick,
}) => {
    const [internalTab, setInternalTab] = useState('students');
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('name-asc');
    const [sortOpen, setSortOpen] = useState(false);
    const sortRef = useRef(null);

    const activeTab = controlledTab || internalTab;

    const handleTabClick = (tabId) => {
        setInternalTab(tabId);
        onTabChange?.(tabId);
    };

    useEffect(() => {
        if (!sortOpen) return;
        const handleClick = (e) => {
            if (sortRef.current && !sortRef.current.contains(e.target)) {
                setSortOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [sortOpen]);

    useEffect(() => {
        if (!isOpen) {
            setSearch('');
            setSort('name-asc');
            setSortOpen(false);
            setInternalTab('students');
        }
    }, [isOpen]);

    const enrichedStudents = useMemo(() => {
        return students.map((s, i) => {
            const first = s.student?.firstName || s.first || '';
            const last = s.student?.lastName || s.last || '';
            return {
                id: s.student?.studentId || s.id || '',
                first,
                last,
                initials: `${first[0] || ''}${last[0] || ''}`.toUpperCase(),
                email: s.student?.email || s.email || '',
                status: s.status || 'Active',
                color: AVATAR_COLORS[i % AVATAR_COLORS.length],
                _raw: s,
            };
        });
    }, [students]);

    const filteredStudents = useMemo(() => {
        let list = [...enrichedStudents];
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(
                (s) =>
                    `${s.first} ${s.last} ${s.id} ${s.email}`
                        .toLowerCase()
                        .includes(q)
            );
        }
        list.sort((a, b) => {
            switch (sort) {
                case 'name-desc':
                    return `${b.last}${b.first}`.localeCompare(
                        `${a.last}${a.first}`
                    );
                case 'id':
                    return a.id.localeCompare(b.id);
                case 'status':
                    return a.status.localeCompare(b.status);
                default:
                    return `${a.last}${a.first}`.localeCompare(
                        `${b.last}${b.first}`
                    );
            }
        });
        return list;
    }, [enrichedStudents, search, sort]);

    const activeCount = enrichedStudents.filter(
        (s) => s.status === 'Active'
    ).length;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/30 z-[110]"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ x: '100%', opacity: 0.6 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 30,
                        }}
                        className="fixed inset-y-0 right-0 w-full sm:w-[440px] bg-white shadow-2xl z-[120] flex flex-col rounded-l-2xl overflow-hidden"
                    >
                        <div className="bg-gray-50 rounded-tl-2xl px-5 pt-4 pb-4 border-b border-gray-200 shrink-0">
                            <div className="flex items-center justify-between mb-3">
                                <button
                                    onClick={onClose}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    <ChevronLeft size={14} />
                                    Back to Classes
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="flex items-center gap-2 mb-2.5">
                                {classInfo.sectionCode && (
                                    <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-indigo-100 text-indigo-700 rounded-full">
                                        {classInfo.sectionCode}
                                    </span>
                                )}
                                {classInfo.room && (
                                    <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-gray-100 text-gray-600 rounded-full">
                                        {classInfo.room}
                                    </span>
                                )}
                            </div>

                            <h2 className="text-xl font-bold text-gray-900 mb-1.5">
                                {classInfo.subjectCode} — {classInfo.subjectName}
                            </h2>

                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <Calendar size={12} />
                                {classInfo.day}{' '}
                                {formatTime(classInfo.startTime)} –{' '}
                                {formatTime(classInfo.endTime)}
                            </div>
                        </div>

                        <div className="flex items-center gap-1 px-5 py-3 border-b border-gray-200 shrink-0">
                            {TABS.map((tab) => (
                                <TabPill
                                    key={tab.id}
                                    tab={tab}
                                    isActive={activeTab === tab.id}
                                    onClick={() => handleTabClick(tab.id)}
                                    count={
                                        tab.id === 'students'
                                            ? enrichedStudents.length
                                            : undefined
                                    }
                                />
                            ))}
                        </div>

                        <div className="flex-1 overflow-y-auto min-h-0">
                            {activeTab === 'students' && (
                                <>
                                    <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100">
                                        <div className="flex-1 relative">
                                            <Search
                                                size={14}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            />
                                            <input
                                                type="text"
                                                value={search}
                                                onChange={(e) =>
                                                    setSearch(e.target.value)
                                                }
                                                placeholder="Search students..."
                                                className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900/30 transition-all"
                                            />
                                        </div>
                                        <div className="relative" ref={sortRef}>
                                            <button
                                                onClick={() =>
                                                    setSortOpen(!sortOpen)
                                                }
                                                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                                            >
                                                {
                                                    SORT_OPTIONS.find(
                                                        (o) =>
                                                            o.value === sort
                                                    )?.label
                                                }
                                                {sortOpen ? (
                                                    <ChevronUp size={12} />
                                                ) : (
                                                    <ChevronDown size={12} />
                                                )}
                                            </button>
                                            <AnimatePresence>
                                                {sortOpen && (
                                                    <motion.div
                                                        initial={{
                                                            opacity: 0,
                                                            scale: 0.95,
                                                            y: -4,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            scale: 1,
                                                            y: 0,
                                                        }}
                                                        exit={{
                                                            opacity: 0,
                                                            scale: 0.95,
                                                            y: -4,
                                                        }}
                                                        transition={{
                                                            duration: 0.15,
                                                        }}
                                                        className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 shadow-lg rounded-lg z-10 overflow-hidden"
                                                    >
                                                        {SORT_OPTIONS.map(
                                                            (opt) => (
                                                                <button
                                                                    key={
                                                                        opt.value
                                                                    }
                                                                    onClick={() => {
                                                                        setSort(
                                                                            opt.value
                                                                        );
                                                                        setSortOpen(
                                                                            false
                                                                        );
                                                                    }}
                                                                    className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors ${
                                                                        sort ===
                                                                        opt.value
                                                                            ? 'bg-gray-50 text-gray-900'
                                                                            : 'text-gray-600 hover:bg-gray-50'
                                                                    }`}
                                                                >
                                                                    {opt.label}
                                                                </button>
                                                            )
                                                        )}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    <div className="flex items-center px-5 py-2 border-b border-gray-100">
                                        <span className="w-8 text-[10px] font-medium text-gray-400 tracking-wide uppercase">
                                            #
                                        </span>
                                        <span className="flex-1 text-[10px] font-medium text-gray-400 tracking-wide uppercase">
                                            Student
                                        </span>
                                    </div>

                                    <motion.div
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        {filteredStudents.length === 0 ? (
                                            <div className="p-12 text-center text-sm text-gray-500">
                                                No students match your search.
                                            </div>
                                        ) : (
                                            filteredStudents.map(
                                                (student, idx) => (
                                                    <StudentRow
                                                        key={student.id}
                                                        student={student}
                                                        index={idx}
                                                        color={student.color}
                                                        onClick={() =>
                                                            onStudentClick?.(
                                                                student._raw
                                                            )
                                                        }
                                                    />
                                                )
                                            )
                                        )}
                                    </motion.div>
                                </>
                            )}

                            {activeTab === 'attendance' && attendanceContent}

                            {activeTab === 'history' && historyContent}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default StudentRosterPanel;
