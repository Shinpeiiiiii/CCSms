import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, X, Calendar } from 'lucide-react';
import TabBar from './TabBar';
import StudentsTab from './StudentsTab';
import AttendanceTab from './AttendanceTab';
import AttendanceHistory from '../components/AttendanceHistory';
import { formatTime } from '../constants/teacherSchedule.constants';

const TABS = [
    { id: 'students', label: 'Students' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'history', label: 'History' },
];

const tabVariants = {
    enter: (direction) => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction) => ({
        x: direction > 0 ? -300 : 300,
        opacity: 0,
    }),
};

const SchedulePanel = ({
    panelOpen,
    historyPanelOpen,
    selectedEntry,
    activeTab,
    onTabChange,
    onClose,
    students,
    rosterLoading,
    attendanceData,
    attendanceLoading,
    selectedDate,
    onDateChange,
    onSaveAttendance,
    saving,
    onHistoryDateSelect,
}) => {
    const prevTabIndex = useRef(null);
    const [direction, setDirection] = useState(1);

    const currentTabIndex = TABS.findIndex(t => t.id === activeTab);

    const handleAnimationComplete = () => {
        prevTabIndex.current = currentTabIndex;
    };

    const handleTabChange = (tabId) => {
        const targetIndex = TABS.findIndex(t => t.id === tabId);
        if (prevTabIndex.current === null) {
            prevTabIndex.current = 0;
        }
        setDirection(targetIndex >= prevTabIndex.current ? 1 : -1);
        onTabChange(tabId);
    };

    const x = panelOpen
        ? historyPanelOpen ? -420 : 0
        : '100%';

    return (
        <motion.div
            style={{ backgroundColor: '#ffffff' }}
            className="fixed inset-y-0 right-0 w-full sm:w-1/2 shadow-2xl z-120 flex flex-col overflow-hidden"
            initial={{ x: '100%' }}
            animate={{ x }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
            {/* ─── Header ─── */}
            <div
                style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}
                className="px-5 pt-5 pb-5 shrink-0"
            >
                {/* Nav row */}
                <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
                    
                    
                </div>

                {selectedEntry && (
                    <>
                        {/* Badges row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 5px 5px' }}>
                            {selectedEntry.section?.sectionCode && (
                                <span style={{
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    backgroundColor: '#e0e7ff',
                                    color: '#4338ca',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                }}>
                                    Section: {selectedEntry.section.sectionCode}
                                </span>
                            )}
                            {selectedEntry.room && (
                                <span style={{
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    backgroundColor: '#f3f4f6',
                                    color: '#4b5563',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                }}>
                                    Room: {selectedEntry.room}
                                </span>
                            )}
                        </div>

                        {/* Subject title */}
                        <h1 style={{
                            fontSize: '1.25rem',
                            fontWeight: '700',
                            color: '#111827',
                            marginBottom: '8px',
                            lineHeight: '1.35',
                            padding: '5px 5px 5px',
                        }}>
                            Subject: {selectedEntry.subject?.subjectCode} — {selectedEntry.subject?.subjectName}
                        </h1>

                        {/* Schedule line */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '0.875rem',
                            color: '#6b7280',
                            padding: '5px 5px 5px',
                        }}>
                            <Calendar size={15} />
                            {selectedEntry.day} {formatTime(selectedEntry.startTime)} – {formatTime(selectedEntry.endTime)}
                        </div>
                    </>
                )}
            </div>

            {/* ─── Tab Bar ─── */}
            {selectedEntry && (
                <div
                    style={{ borderBottom: '1px solid #e5e7eb', padding: '16px 20px 12px' }}
                    className="shrink-0"
                >
                    <TabBar
                        tabs={TABS}
                        activeTab={activeTab}
                        onTabChange={handleTabChange}
                        count={students?.length}
                    />
                </div>
            )}

            {/* ─── Tab Content with Swipe ─── */}
            <div className="flex-1 overflow-hidden min-h-0 relative">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={activeTab}
                        custom={direction}
                        variants={tabVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        onAnimationComplete={handleAnimationComplete}
                        transition={{ type: 'spring', stiffness: 900, damping: 60 }}
                        className="absolute inset-0 overflow-y-auto"
                    >
                        {activeTab === 'students' && (
                            <StudentsTab students={students} loading={rosterLoading} />
                        )}
                        {activeTab === 'attendance' && (
                            <AttendanceTab
                                students={attendanceData?.students || []}
                                attendanceData={attendanceData}
                                attendanceLoading={attendanceLoading}
                                selectedDate={selectedDate}
                                onDateChange={onDateChange}
                                onSave={onSaveAttendance}
                                saving={saving}
                            />
                        )}
                        {activeTab === 'history' && selectedEntry && (
                            <AttendanceHistory
                                sectionSubjectId={selectedEntry._id}
                                onDateSelect={onHistoryDateSelect}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default SchedulePanel;
