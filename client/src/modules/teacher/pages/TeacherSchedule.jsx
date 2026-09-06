import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { QUERY_KEYS } from '@/constants/queryKey';

const TeacherSchedule = () => {
    const queryClient = useQueryClient();

    // Main panel
    const [panelOpen, setPanelOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [activeTab, setActiveTab] = useState('students');

    // Attendance
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [saving, setSaving] = useState(false);

    // Secondary panel (history detail)
    const [historyPanelOpen, setHistoryPanelOpen] = useState(false);
    const [historySelectedDate, setHistorySelectedDate] = useState(null);

    const { data: schedule = [], isLoading: loading } = useQuery({
        queryKey: QUERY_KEYS.MY_SCHEDULE,
        queryFn: getMySchedule,
        select: (data) => data?.data || data || [],
        refetchOnWindowFocus: true,
    });

    const selectedEntryId = selectedEntry?._id;

    const { data: roster, isLoading: rosterLoading } = useQuery({
        queryKey: QUERY_KEYS.CLASS_STUDENTS(selectedEntryId),
        queryFn: () => getClassStudents(selectedEntryId),
        enabled: !!selectedEntryId && panelOpen && activeTab === 'students',
        select: (data) => data?.data || data,
    });

    const { data: attendanceData, isLoading: attendanceLoading } = useQuery({
        queryKey: ['attendance', selectedEntryId, selectedDate],
        queryFn: () => getAttendanceByDate(selectedEntryId, selectedDate),
        enabled: !!selectedEntryId && panelOpen && activeTab === 'attendance',
        select: (data) => data?.data || data,
    });

    const { data: historyDetail, isLoading: historyDetailLoading } = useQuery({
        queryKey: ['attendance-history', selectedEntryId, historySelectedDate],
        queryFn: () => getAttendanceByDate(selectedEntryId, historySelectedDate),
        enabled: !!selectedEntryId && !!historySelectedDate && historyPanelOpen,
        select: (data) => data?.data || null,
    });

    const saveAttendanceMutation = useMutation({
        mutationFn: markAttendance,
        onSuccess: () => {
            toast.success('Attendance saved successfully');
            queryClient.invalidateQueries({ queryKey: ['attendance', selectedEntryId, selectedDate] });
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to save attendance');
        },
    });

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

    const handleEntryClick = useCallback((entry) => {
        setSelectedEntry(entry);
        setActiveTab('students');
        setPanelOpen(true);
        setHistoryPanelOpen(false);
    }, []);

    const handleTabChange = useCallback((tab) => {
        if (!selectedEntry) return;
        setActiveTab(tab);
        if (tab !== 'history') {
            setHistoryPanelOpen(false);
        }
    }, [selectedEntry]);

    const handleDateChange = useCallback((newDate) => {
        setSelectedDate(newDate);
    }, []);

    const handleSaveAttendance = useCallback(async (recordsArray) => {
        if (!selectedEntry) return;
        setSaving(true);
        try {
            await saveAttendanceMutation.mutateAsync({
                sectionSubjectId: selectedEntry._id,
                date: selectedDate,
                records: recordsArray,
            });
        } finally {
            setSaving(false);
        }
    }, [selectedEntry, selectedDate, saveAttendanceMutation]);

    const handleHistoryDateSelect = useCallback(async (dateKey) => {
        if (!selectedEntry) return;
        setHistoryPanelOpen(true);
        setHistorySelectedDate(dateKey);
    }, [selectedEntry]);

    const closeHistoryPanel = useCallback(() => {
        setHistoryPanelOpen(false);
        setHistorySelectedDate(null);
    }, []);

    const closePanel = useCallback(() => {
        setPanelOpen(false);
        setSelectedEntry(null);
        setHistoryPanelOpen(false);
        setHistorySelectedDate(null);
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
