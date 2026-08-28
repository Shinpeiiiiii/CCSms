import { Clock, MapPin, Calendar } from 'lucide-react';
import Card from '@/components/cards/Cards';
import { DAYS, TIME_SLOTS, formatTime, timeToIndex } from '../constants/teacherSchedule.constants';

const ScheduleGrid = ({ schedule, grid, onEntryClick }) => (
    <Card title="Weekly Grid">
        <div className="overflow-x-auto">
            <table className="w-full min-w-200 border-collapse">
                <thead>
                    <tr>
                        <th className="w-24 bg-gray-50 border-b border-r border-gray-200 px-2 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                            Time
                        </th>
                        {DAYS.map(day => (
                            <th key={day} className="bg-gray-50 border-b border-r border-gray-200 last:border-r-0 px-2 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                                {day.slice(0, 3)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {TIME_SLOTS.map((slot) => (
                        <tr key={slot}>
                            <td className="border-b border-r border-gray-100 px-2 py-1.5 text-[10px] text-gray-400 font-medium text-right align-top pt-2">
                                {formatTime(slot)}
                            </td>
                            {DAYS.map(day => {
                                const entry = (grid[day] || []).find(e => e.startTime === slot);
                                if (entry) {
                                    const startIdx = timeToIndex(entry.startTime);
                                    const endIdx = timeToIndex(entry.endTime);
                                    const span = Math.max(1, endIdx - startIdx);
                                    return (
                                        <td
                                            key={day}
                                            rowSpan={span}
                                            className="border-b border-r border-gray-100 last:border-r-0 p-1 align-top"
                                        >
                                            <button
                                                onClick={() => onEntryClick(entry)}
                                                className="bg-gray-900 text-white p-2.5 h-full min-h-[60px] w-full text-left cursor-pointer hover:ring-2 hover:ring-gray-400 hover:ring-offset-1 transition-all duration-150"
                                            >
                                                <p className="text-[12px] font-semibold leading-tight">
                                                    {entry.subject?.subjectCode || '—'}
                                                </p>
                                                <p className="text-[10px] text-gray-300 mt-0.5 leading-tight truncate">
                                                    {entry.subject?.subjectName || '—'}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gray-400">
                                                    <span className="flex items-center gap-0.5">
                                                        <Clock size={9} />
                                                        {formatTime(entry.startTime)}–{formatTime(entry.endTime)}
                                                    </span>
                                                </div>
                                                {entry.room && (
                                                    <div className="flex items-center gap-0.5 mt-0.5 text-[10px] text-gray-400">
                                                        <MapPin size={9} />
                                                        {entry.room}
                                                    </div>
                                                )}
                                                <p className="text-[10px] text-gray-500 mt-1">
                                                    {entry.section?.sectionCode || '—'}
                                                </p>
                                            </button>
                                        </td>
                                    );
                                }
                                return <td key={day} className="border-b border-r border-gray-100 last:border-r-0" />;
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </Card>
);

const ScheduleList = ({ schedule, onEntryClick }) => (
    <Card title="Schedule List">
        <div className="md:hidden divide-y divide-gray-100">
            {schedule.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">No schedule assigned yet.</div>
            ) : (
                schedule.map(entry => (
                    <button
                        key={entry._id}
                        onClick={() => onEntryClick(entry)}
                        className="w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{entry.subject?.subjectCode || '—'}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{entry.subject?.subjectName || '—'}</p>
                            </div>
                            <span className="text-[10px] font-medium text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5">
                                {entry.section?.sectionCode || '—'}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                                <Calendar size={11} />
                                {entry.day || '—'}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock size={11} />
                                {formatTime(entry.startTime)}–{formatTime(entry.endTime)}
                            </span>
                            {entry.room && (
                                <span className="flex items-center gap-1">
                                    <MapPin size={11} />
                                    {entry.room}
                                </span>
                            )}
                        </div>
                    </button>
                ))
            )}
        </div>
    </Card>
);

export { ScheduleGrid, ScheduleList };
