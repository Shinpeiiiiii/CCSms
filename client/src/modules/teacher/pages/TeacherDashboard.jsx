import { BookOpen, Users, GraduationCap, Clock, MapPin, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import useAuthStore from '@/modules/auth/state/auth-store';
import DashboardLayout from '@/shared/layouts/DashboardLayout';
import Card from '@/components/cards/Cards';
import { getMyDashboard } from '../services/teacher.service';
import { QUERY_KEYS } from '@/constants/queryKey';

const formatTime = (t) => {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hour = parseInt(h, 10);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${m} ${suffix}`;
};

const TeacherDashboard = () => {
    const user = useAuthStore((s) => s.user);
    const { data: dashboard = {}, isLoading: loading } = useQuery({
        queryKey: QUERY_KEYS.MY_DASHBOARD,
        queryFn: getMyDashboard,
        select: (data) => data?.data || data || {},
        refetchOnWindowFocus: true,
    });

    if (loading) {
        return (
            <DashboardLayout>
                <div className="p-6 space-y-4">
                    <div className="h-24 bg-gray-100 border border-gray-200" />
                    <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-20 bg-gray-100 border border-gray-200" />
                        ))}
                    </div>
                    <div className="h-48 bg-gray-100 border border-gray-200" />
                </div>
            </DashboardLayout>
        );
    }

    const stats = dashboard?.stats || { totalSubjects: 0, totalSections: 0, totalUnits: 0, totalStudents: 0 };
    const todayClasses = dashboard?.todayClasses || [];

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <DashboardLayout>
            <div className="p-6 space-y-6">
                {/* Welcome Banner */}
                <div className="bg-gray-900 text-white p-6">
                    <h1 className="text-2xl font-bold">
                        Welcome back, {user?.firstName}!
                    </h1>
                    <p className="mt-1 text-gray-400 text-sm">
                        {today}
                    </p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-gray-200 p-4">
                        <div className="flex items-center gap-3">
                            <BookOpen size={18} className="text-gray-400" />
                            <div>
                                <p className="text-[11px] text-gray-500 uppercase tracking-wide font-medium">Subjects</p>
                                <p className="text-xl font-bold text-gray-900">{stats.totalSubjects}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-200 p-4">
                        <div className="flex items-center gap-3">
                            <Users size={18} className="text-gray-400" />
                            <div>
                                <p className="text-[11px] text-gray-500 uppercase tracking-wide font-medium">Sections</p>
                                <p className="text-xl font-bold text-gray-900">{stats.totalSections}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-200 p-4">
                        <div className="flex items-center gap-3">
                            <GraduationCap size={18} className="text-gray-400" />
                            <div>
                                <p className="text-[11px] text-gray-500 uppercase tracking-wide font-medium">Total Students</p>
                                <p className="text-xl font-bold text-gray-900">{stats.totalStudents}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-200 p-4">
                        <div className="flex items-center gap-3">
                            <Clock size={18} className="text-gray-400" />
                            <div>
                                <p className="text-[11px] text-gray-500 uppercase tracking-wide font-medium">Total Units</p>
                                <p className="text-xl font-bold text-gray-900">{stats.totalUnits}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Today's Classes */}
                <Card
                    title="Today's Classes"
                    subtitle={
                        todayClasses.length > 0
                            ? `${todayClasses.length} class${todayClasses.length !== 1 ? 'es' : ''} scheduled`
                            : 'No classes scheduled for today'
                    }
                >
                    {todayClasses.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {todayClasses.map((cls) => (
                                <div key={cls._id} className="px-5 py-3.5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-gray-900 text-white w-10 h-10 flex items-center justify-center text-xs font-bold shrink-0">
                                            {cls.subject?.subjectCode?.slice(0, 4) || '—'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {cls.subject?.subjectCode} — {cls.subject?.subjectName}
                                            </p>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Clock size={11} />
                                                    {formatTime(cls.startTime)}–{formatTime(cls.endTime)}
                                                </span>
                                                {cls.room && (
                                                    <span className="flex items-center gap-1">
                                                        <MapPin size={11} />
                                                        {cls.room}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1">
                                                    <Users size={11} />
                                                    {cls.studentCount} students
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-medium text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5 shrink-0">
                                        {cls.section?.sectionCode || '—'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <Calendar size={32} className="mx-auto mb-2 text-gray-300" />
                            <p className="text-sm text-gray-500">No classes today</p>
                            <p className="text-xs text-gray-400 mt-1">Enjoy your free day!</p>
                        </div>
                    )}
                </Card>

                {/* Quick Links */}
                <Card title="Quick Access">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-5">
                        <a
                            href="/teacher/schedule"
                            className="border border-gray-200 p-4 hover:bg-gray-50 transition-colors group"
                        >
                            <Calendar size={18} className="text-gray-400 group-hover:text-gray-900 transition-colors" />
                            <p className="font-medium text-sm text-gray-900 mt-2">My Schedule</p>
                            <p className="text-xs text-gray-500 mt-0.5">View your weekly schedule, student rosters, and take attendance.</p>
                        </a>
                        <a
                            href="/teacher/grades"
                            className="border border-gray-200 p-4 hover:bg-gray-50 transition-colors group"
                        >
                            <GraduationCap size={18} className="text-gray-400 group-hover:text-gray-900 transition-colors" />
                            <p className="font-medium text-sm text-gray-900 mt-2">Grade Book</p>
                            <p className="text-xs text-gray-500 mt-0.5">Enter and manage grades.</p>
                        </a>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default TeacherDashboard;
