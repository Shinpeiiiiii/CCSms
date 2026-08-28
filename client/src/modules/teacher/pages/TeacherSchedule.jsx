import { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import DashboardLayout from '@/shared/layouts/DashboardLayout';
import Card from '@/components/cards/Cards';
import EmptyState from '../components/EmptyState';
import ScheduleStats from '../components/ScheduleStats';
import { ScheduleGrid, ScheduleList } from '../components/ScheduleGrid';
import SchedulePanel from '../components/SchedulePanel';
import HistoryDetailPanel from '../components/HistoryDetailPanel';
import {
    getMySchedule,
    getClassStudents,
    getAttendanceByDate,
    markAttendance,
} from '../services/teacher.service';

const TeacherSchedule = () => {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);

    // Main panel
    const [panelOpen, setPanelOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [activeTab, setActiveTab] = useState('students');

    // Students
    const [roster, setRoster] = useState(null);
    const [rosterLoading, setRosterLoading] = useState(false);

    // Attendance
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceData, setAttendanceData] = useState(null);
    const [attendanceLoading, setAttendanceLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Secondary panel (history detail)
    const [historyPanelOpen, setHistoryPanelOpen] = useState(false);
    const [historyDetail, setHistoryDetail] = useState(null);
    const [historyDetailLoading, setHistoryDetailLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getMySchedule();
                setSchedule(res.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const stats = useMemo(() => {
        const uniqueSubjects = new Set(schedule.map(s => s.subject?._id)).size;
        const uniqueSections = new Set(schedule.map(s => s.section?._id)).size;
        const totalUnits = schedule.reduce((sum, s) => sum + (s.subject?.totalUnits || 0), 0);
        return { uniqueSubjects, uniqueSections, totalUnits };
    }, [schedule]);

    const grid = useMemo(() => {
        const map = {};
        schedule.forEach(entry => {
            if (!entry.day || !entry.startTime) return;
            if (!map[entry.day]) map[entry.day] = [];
            map[entry.day].push(entry);
        });
        Object.keys(map).forEach(day => {
            map[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
        });
        return map;
    }, [schedule]);

    const handleEntryClick = useCallback(async (entry) => {
        setSelectedEntry(entry);
        setActiveTab('students');
        setPanelOpen(true);
        setHistoryPanelOpen(false);
        setHistoryDetail(null);
        setRosterLoading(true);
        setRoster(null);
        setAttendanceData(null);
        try {
            const res = await getClassStudents(entry._id);
            setRoster(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setRosterLoading(false);
        }
    }, []);

    const handleTabChange = useCallback(async (tab) => {
        if (!selectedEntry) return;
        setActiveTab(tab);
        if (tab !== 'history') {
            setHistoryPanelOpen(false);
            setHistoryDetail(null);
        }
        if (tab === 'attendance' && !attendanceData) {
            setAttendanceLoading(true);
            try {
                const res = await getAttendanceByDate(selectedEntry._id, selectedDate);
                setAttendanceData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setAttendanceLoading(false);
            }
        }
    }, [selectedEntry, attendanceData, selectedDate]);

    const handleDateChange = useCallback(async (newDate) => {
        setSelectedDate(newDate);
        if (selectedEntry && activeTab === 'attendance') {
            setAttendanceLoading(true);
            try {
                const res = await getAttendanceByDate(selectedEntry._id, newDate);
                setAttendanceData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setAttendanceLoading(false);
            }
        }
    }, [selectedEntry, activeTab]);

    const handleSaveAttendance = useCallback(async (recordsArray) => {
        if (!selectedEntry) return;
        setSaving(true);
        try {
            await markAttendance({
                sectionSubjectId: selectedEntry._id,
                date: selectedDate,
                records: recordsArray,
            });
            toast.success('Attendance saved successfully');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save attendance');
        } finally {
            setSaving(false);
        }
    }, [selectedEntry, selectedDate]);

    const handleHistoryDateSelect = useCallback(async (dateKey) => {
        if (!selectedEntry) return;
        setHistoryPanelOpen(true);
        setHistoryDetailLoading(true);
        setHistoryDetail(null);
        try {
            const res = await getAttendanceByDate(selectedEntry._id, dateKey);
            setHistoryDetail(res.data);
        } catch {
            setHistoryDetail(null);
        } finally {
            setHistoryDetailLoading(false);
        }
    }, [selectedEntry]);

    const closeHistoryPanel = useCallback(() => {
        setHistoryPanelOpen(false);
        setHistoryDetail(null);
    }, []);

    const closePanel = useCallback(() => {
        setPanelOpen(false);
        setSelectedEntry(null);
        setRoster(null);
        setAttendanceData(null);
        setHistoryPanelOpen(false);
        setHistoryDetail(null);
    }, []);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="p-6 space-y-4">
                    <div className="h-8 w-48 bg-gray-100 border border-gray-200" />
                    <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-20 bg-gray-100 border border-gray-200" />
                        ))}
                    </div>
                    <div className="h-96 bg-gray-100 border border-gray-200" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-6 space-y-6">
                <Card title="My Schedule" subtitle="Your weekly teaching schedule. Click a class to view students and take attendance." />
                <ScheduleStats stats={stats} />
                <ScheduleGrid schedule={schedule} grid={grid} onEntryClick={handleEntryClick} />
                <ScheduleList schedule={schedule} onEntryClick={handleEntryClick} />

                {schedule.length === 0 && (
                    <Card>
                        <EmptyState icon={Clock} heading="No schedule assigned yet." subtext="Contact your administrator to get assigned to section subjects." />
                    </Card>
                )}
            </div>

            {/* Overlay */}
            <motion.div
                className="fixed inset-0 bg-black/30 z-[110]"
                initial={{ opacity: 0 }}
                animate={{ opacity: panelOpen ? 1 : 0 }}
                transition={{ duration: 0.25 }}
                style={{ pointerEvents: panelOpen ? 'auto' : 'none' }}
                onClick={closePanel}
            />

            {/* Main Panel */}
            <SchedulePanel
                panelOpen={panelOpen}
                historyPanelOpen={historyPanelOpen}
                selectedEntry={selectedEntry}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                onClose={closePanel}
                students={roster?.students || []}
                rosterLoading={rosterLoading}
                attendanceData={attendanceData}
                attendanceLoading={attendanceLoading}
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
                onSaveAttendance={handleSaveAttendance}
                saving={saving}
                onHistoryDateSelect={handleHistoryDateSelect}
            />

            {/* Secondary Panel */}
            <AnimatePresence>
                {historyPanelOpen && (
                    <HistoryDetailPanel
                        historyPanelOpen={historyPanelOpen}
                        historyDetail={historyDetail}
                        historyDetailLoading={historyDetailLoading}
                        onClose={closeHistoryPanel}
                    />
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
};

export default TeacherSchedule;
