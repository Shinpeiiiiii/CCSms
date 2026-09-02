import { motion } from 'framer-motion';
import { CalendarDays } from 'lucide-react';
import PanelHeader from './PanelHeader';
import StudentListItem from './StudentListItem';
import StatusBadge from './StatusBadge';
import EmptyState from './EmptyState';
import PanelSearchInput from './PanelSearchInput';
import SortSelect from './SortSelect';
import { STATUS_ICONS, STATUS_COLORS_SOLID, SECONDARY_PANEL_WIDTH } from '../constants/teacherSchedule.constants';
import { useMemo, useState } from 'react';

const SORT_OPTIONS = [
    { value: 'name-asc', label: 'Name A-Z' },
    { value: 'name-desc', label: 'Name Z-A' },
    { value: 'status', label: 'Status' },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.06, delayChildren: 0.15 },
    },
    exit: { opacity: 0, transition: { duration: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', damping: 22, stiffness: 300 },
    },
};

const HistoryDetailPanel = ({
    historyDetail,
    historyDetailLoading,
    onClose,
}) => {
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('name-asc');

    const historyStudents = useMemo(() => historyDetail?.students || [], [historyDetail]);

    const filteredStudents = useMemo(() => {
        let list = [...historyStudents];

        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(s =>
                `${s.student?.firstName} ${s.student?.lastName}`.toLowerCase().includes(q)
            );
        }

        list.sort((a, b) => {
            switch (sort) {
                case 'name-desc':
                    return `${b.student?.lastName} ${b.student?.firstName}`.localeCompare(`${a.student?.lastName} ${a.student?.firstName}`);
                case 'status':
                    return (a.attendance?.status || 'zzz').localeCompare(b.attendance?.status || 'zzz');
                default:
                    return `${a.student?.lastName} ${a.student?.firstName}`.localeCompare(`${b.student?.lastName} ${b.student?.firstName}`);
            }
        });

        return list;
    }, [historyStudents, search, sort]);

    const counts = useMemo(() => {
        const c = { Present: 0, Absent: 0, Late: 0, Excused: 0 };
        historyStudents.forEach(s => {
            if (s.attendance?.status) c[s.attendance.status]++;
        });
        return c;
    }, [historyStudents]);

    return (
        <motion.div
            className="fixed inset-y-0 right-0 w-full sm:w-105 bg-white shadow-2xl z-130"
            initial={{ x: SECONDARY_PANEL_WIDTH + 40, opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: SECONDARY_PANEL_WIDTH + 40, opacity: 0.5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 50 }}
        >
            <div className="flex flex-col h-full">
                {/* Header */}
                <PanelHeader onBack={onClose} onClose={onClose}>
                    {historyDetail && (
                        <>
                            <h2 className="text-base font-bold text-gray-900">
                                {historyDetail.sectionSubject?.subject?.subjectCode} — Attendance
                            </h2>
                            <p className="text-xs text-gray-500 mt-1.5">
                                {historyDetail.date && new Date(historyDetail.date + 'T00:00:00').toLocaleDateString('en-US', {
                                    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
                                })}
                            </p>
                        </>
                    )}
                </PanelHeader>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {historyDetailLoading ? (
                        <div>
                            {/* Summary skeleton */}
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
                                <div className="grid grid-cols-4 gap-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="border border-gray-200 p-3 text-center animate-pulse">
                                            <div className="w-4 h-4 bg-gray-200 mx-auto mb-1.5" />
                                            <div className="w-6 h-5 bg-gray-200 mx-auto mb-1" />
                                            <div className="w-10 h-2 bg-gray-200 mx-auto" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Search bar skeleton */}
                            <div className="px-6 py-3 border-b border-gray-100 flex items-center gap-3">
                                <div className="flex-1 h-9 bg-gray-100 border border-gray-200 animate-pulse" />
                                <div className="w-24 h-8 bg-gray-100 border border-gray-200 animate-pulse" />
                            </div>
                            {/* Student list skeleton */}
                            <div className="divide-y divide-gray-100">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="px-6 py-4 flex items-center gap-3.5 animate-pulse">
                                        <div className="w-8 h-8 bg-gray-200 shrink-0" />
                                        <div className="flex-1">
                                            <div className="w-32 h-3.5 bg-gray-200 mb-1.5" />
                                            <div className="w-20 h-2.5 bg-gray-100" />
                                        </div>
                                        <div className="w-14 h-5 bg-gray-200 shrink-0" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : !historyDetail ? (
                        <EmptyState icon={CalendarDays} heading="No records found" subtext="No attendance was taken on this date." />
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {/* Summary Stats */}
                            <motion.div variants={itemVariants} className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
                                <div className="grid grid-cols-4 gap-3">
                                    {Object.entries(counts).map(([status, count]) => {
                                        const Icon = STATUS_ICONS[status];
                                        const color = STATUS_COLORS_SOLID[status];
                                        return (
                                            <motion.div
                                                key={status}
                                                variants={itemVariants}
                                                whileHover={{ scale: 1.03 }}
                                                className={`border p-3 text-center ${color}`}
                                            >
                                                <Icon size={14} className="mx-auto mb-1" />
                                                <p className="text-lg font-bold text-gray-900">{count}</p>
                                                <p className="text-[10px] text-gray-500">{status}</p>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>

                            {/* Search + Sort */}
                            <motion.div variants={itemVariants} className="px-6 py-3 border-b border-gray-100 flex items-center gap-3">
                                <div className="flex-1">
                                    <PanelSearchInput
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        placeholder="Search students..."
                                    />
                                </div>
                                <SortSelect value={sort} onChange={e => setSort(e.target.value)} options={SORT_OPTIONS} />
                            </motion.div>

                            {/* Student List */}
                            {filteredStudents.length === 0 ? (
                                <div className="p-12 text-center text-sm text-gray-500">No students match your search.</div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {filteredStudents.map((s, idx) => (
                                        <motion.div key={s._id} variants={itemVariants}>
                                            <StudentListItem
                                                student={s.student}
                                                index={idx}
                                                rightContent={
                                                    <StatusBadge status={s.attendance?.status || 'No record'} size="xs" />
                                                }
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default HistoryDetailPanel;
