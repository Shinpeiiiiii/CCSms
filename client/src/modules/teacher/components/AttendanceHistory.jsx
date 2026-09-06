import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAttendanceCalendar } from '../services/teacher.service';
import { QUERY_KEYS } from '@/constants/queryKey';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();
const getFirstDayOfMonth = (year, month) => {
    const day = new Date(year, month - 1, 1).getDay();
    return day === 0 ? 6 : day - 1;
};

const getDateKey = (year, month, day) =>
    `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

const STATUS_DOT_COLORS = {
    green: 'bg-green-500',
    red: 'bg-red-500',
    amber: 'bg-amber-500',
    blue: 'bg-blue-500',
};

const getDotColor = (entry) => {
    if (!entry || entry.count === 0) return null;
    const presentRate = entry.Present / entry.count;
    const lateRate = entry.Late / entry.count;
    const absentRate = entry.Absent / entry.count;
    if (presentRate >= 0.7) return STATUS_DOT_COLORS.green;
    if (absentRate >= 0.4) return STATUS_DOT_COLORS.red;
    if (lateRate >= 0.3) return STATUS_DOT_COLORS.amber;
    return STATUS_DOT_COLORS.blue;
};

const AttendanceHistory = ({ sectionSubjectId, onDateSelect }) => {
    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [selectedDate, setSelectedDate] = useState(null);

    const { data: calendarData = [], isLoading: calendarLoading } = useQuery({
        queryKey: QUERY_KEYS.ATTENDANCE_CALENDAR(sectionSubjectId, year, month),
        queryFn: () => getAttendanceCalendar(sectionSubjectId, year, month),
        enabled: !!sectionSubjectId,
        select: (res) => res.data || [],
    });

    const handleDateClick = useCallback((dateKey) => {
        setSelectedDate(dateKey);
        if (onDateSelect) onDateSelect(dateKey);
    }, [onDateSelect]);

    const prevMonth = () => {
        setSelectedDate(null);
        if (month === 1) { setMonth(12); setYear(y => y - 1); }
        else { setMonth(m => m - 1); }
    };

    const nextMonth = () => {
        setSelectedDate(null);
        if (month === 12) { setMonth(1); setYear(y => y + 1); }
        else { setMonth(m => m + 1); }
    };

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const calendarMap = {};
    calendarData.forEach(d => { calendarMap[d.date] = d; });

    const todayKey = getDateKey(now.getFullYear(), now.getMonth() + 1, now.getDate());

    return (
        <div className="flex flex-col">
            {/* Calendar Header */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <button onClick={prevMonth} className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors">
                        <ChevronLeft size={16} />
                    </button>
                    <div className="text-center">
                        <p className="text-sm font-semibold text-gray-900">
                            {MONTHS[month - 1]} {year}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                            {calendarData.length} session{calendarData.length !== 1 ? 's' : ''} recorded
                        </p>
                    </div>
                    <button onClick={nextMonth} className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors">
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="px-6 py-4">
                {calendarLoading ? (
                    <div className="py-8 text-center text-xs text-gray-500">Loading...</div>
                ) : (
                    <div className="grid grid-cols-7 gap-0">
                        {DAYS.map(d => (
                            <div key={d} className="py-1.5 text-center text-[10px] font-medium text-gray-400">
                                {d}
                            </div>
                        ))}
                        {Array.from({ length: firstDay }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square" />
                        ))}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const dateKey = getDateKey(year, month, day);
                            const entry = calendarMap[dateKey];
                            const isToday = dateKey === todayKey;
                            const isSelected = dateKey === selectedDate;
                            const hasRecord = !!entry;
                            const dotColor = getDotColor(entry);

                            return (
                                <motion.button
                                    key={day}
                                    onClick={() => hasRecord && handleDateClick(dateKey)}
                                    disabled={!hasRecord}
                                    whileTap={hasRecord ? { scale: 0.88 } : {}}
                                    animate={isSelected ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                    className={`aspect-square flex flex-col items-center justify-center text-xs relative transition-colors ${
                                        isSelected
                                            ? 'bg-gray-900 text-white'
                                            : isToday
                                                ? 'bg-gray-100 text-gray-900 font-semibold'
                                                : hasRecord
                                                    ? 'text-gray-900 hover:bg-gray-50 cursor-pointer'
                                                    : 'text-gray-300 cursor-default'
                                    }`}
                                >
                                    <span className="leading-none">{day}</span>
                                    {hasRecord && dotColor && (
                                        <span className={`w-1.5 h-1.5 ${dotColor} mt-0.5 ${isSelected ? 'opacity-70' : ''}`} />
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="px-6 pb-4 flex items-center gap-4 text-[10px] text-gray-500">
                <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500" />
                    Mostly present
                </span>
                <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-amber-500" />
                    Mostly late
                </span>
                <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-red-500" />
                    Mostly absent
                </span>
            </div>

            {calendarData.length > 0 && (
                <div className="px-6 pb-4">
                    <p className="text-[10px] text-gray-400 text-center">
                        Click a highlighted date to view details
                    </p>
                </div>
            )}
        </div>
    );
};

export default AttendanceHistory;
