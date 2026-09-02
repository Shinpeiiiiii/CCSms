import { useEffect, useState } from 'react';
import { Calendar, MapPin, User } from 'lucide-react';
import { toast } from 'react-toastify';

import { getMySchedule } from '../services/student.service';
import DashboardLayout from '@/shared/layouts/DashboardLayout';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const DAY_COLORS = {
    Monday: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Tuesday: 'bg-sky-50 text-sky-700 border-sky-200',
    Wednesday: 'bg-amber-50 text-amber-700 border-amber-200',
    Thursday: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Friday: 'bg-rose-50 text-rose-700 border-rose-200',
};

const formatTime = (t) => {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hour = parseInt(h, 10);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${m} ${suffix}`;
};

const MySchedule = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getMySchedule();
                setData(res.data || res);
            } catch (err) {
                console.error(err);
                toast.error('Failed to load schedule.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const schedule = data?.schedule || [];
    const byDay = {};
    DAYS.forEach((d) => (byDay[d] = []));
    schedule.forEach((s) => {
        if (byDay[s.day]) byDay[s.day].push(s);
    });
    DAYS.forEach((d) => byDay[d].sort((a, b) => a.startTime.localeCompare(b.startTime)));

    return (
        <DashboardLayout>
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Schedule</h1>
                    <p className="text-gray-500 text-sm">
                        {data?.section ? `Section ${data.section.sectionCode || data.section.sectionName}` : 'No section assigned.'}
                        {data?.semester ? ` · Semester ${data.semester}` : ''}
                    </p>
                </div>

                {loading ? (
                    <div className="bg-white border border-gray-200 p-8 text-center text-gray-500 text-sm">Loading schedule...</div>
                ) : schedule.length === 0 ? (
                    <div className="bg-white border border-gray-200 p-10 text-center text-gray-500">
                        <Calendar className="mx-auto mb-3 text-gray-300" size={40} />
                        <p className="text-sm">No schedule available.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {DAYS.map((day) => (
                            <div key={day} className="bg-white border border-gray-200 overflow-hidden flex flex-col">
                                <div className={`px-4 py-3 border-b border-gray-200 flex items-center gap-2 ${DAY_COLORS[day] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                                    <p className="text-sm font-bold">{day}</p>
                                </div>
                                <div className="p-3 space-y-3 flex-1">
                                    {byDay[day].length === 0 ? (
                                        <p className="text-xs text-gray-400 text-center py-4">No classes</p>
                                    ) : (
                                        byDay[day].map((c) => (
                                            <div key={c._id} className="border border-gray-100 bg-gray-50 rounded-lg p-3">
                                                <p className="text-xs font-bold text-gray-900">{c.subject?.subjectCode}</p>
                                                <p className="text-[11px] text-gray-500 mt-0.5">{c.subject?.subjectName}</p>
                                                <div className="flex items-center gap-1.5 mt-2 text-[11px] text-gray-500">
                                                    <Calendar size={11} />
                                                    {formatTime(c.startTime)}–{formatTime(c.endTime)}
                                                </div>
                                                {c.room && (
                                                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-500">
                                                        <MapPin size={11} />
                                                        {c.room}
                                                    </div>
                                                )}
                                                {c.instructor && (
                                                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-500">
                                                        <User size={11} />
                                                        {c.instructor.firstName} {c.instructor.lastName}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default MySchedule;
