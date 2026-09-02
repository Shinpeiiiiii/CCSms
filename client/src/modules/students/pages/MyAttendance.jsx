import { useEffect, useState } from 'react';
import { CalendarCheck, CheckCircle, XCircle, Clock, AlertCircle, ClipboardList } from 'lucide-react';
import { toast } from 'react-toastify';

import { getMyAttendance } from '../services/student.service';
import DashboardLayout from '@/shared/layouts/DashboardLayout';

const statusBadge = (status) => {
    if (status === 'Present') return 'text-green-700 bg-green-50 border border-green-200';
    if (status === 'Late') return 'text-amber-700 bg-amber-50 border border-amber-200';
    if (status === 'Absent') return 'text-red-700 bg-red-50 border border-red-200';
    if (status === 'Excused') return 'text-blue-700 bg-blue-50 border border-blue-200';
    return 'text-gray-500 bg-gray-100 border border-gray-200';
};

const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const MyAttendance = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getMyAttendance();
                setData(res.data || res);
            } catch (err) {
                console.error(err);
                toast.error('Failed to load attendance.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const totals = data?.totals || {};
    const subjects = data?.subjects || [];
    const records = data?.records || [];

    return (
        <DashboardLayout>
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Attendance</h1>
                    <p className="text-gray-500 text-sm">View your attendance record and rate.</p>
                </div>

                {loading ? (
                    <div className="bg-white border border-gray-200 p-8 text-center text-gray-500 text-sm">Loading attendance...</div>
                ) : (
                    <>
                        {/* Summary cards */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="bg-white border border-gray-200 px-5 py-4">
                                <p className="text-[11px] text-gray-500 uppercase tracking-wide font-medium flex items-center gap-1"><CheckCircle size={13} /> Present</p>
                                <p className="text-2xl font-bold text-gray-900">{totals.Present || 0}</p>
                            </div>
                            <div className="bg-white border border-gray-200 px-5 py-4">
                                <p className="text-[11px] text-gray-500 uppercase tracking-wide font-medium flex items-center gap-1"><Clock size={13} /> Late</p>
                                <p className="text-2xl font-bold text-gray-900">{totals.Late || 0}</p>
                            </div>
                            <div className="bg-white border border-gray-200 px-5 py-4">
                                <p className="text-[11px] text-gray-500 uppercase tracking-wide font-medium flex items-center gap-1"><XCircle size={13} /> Absent</p>
                                <p className="text-2xl font-bold text-gray-900">{totals.Absent || 0}</p>
                            </div>
                            <div className="bg-white border border-gray-200 px-5 py-4">
                                <p className="text-[11px] text-gray-500 uppercase tracking-wide font-medium flex items-center gap-1"><AlertCircle size={13} /> Excused</p>
                                <p className="text-2xl font-bold text-gray-900">{totals.Excused || 0}</p>
                            </div>
                            <div className="bg-gray-900 border border-gray-900 px-5 py-4">
                                <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium flex items-center gap-1"><CalendarCheck size={13} /> Attendance Rate</p>
                                <p className="text-2xl font-bold text-white">{data?.attendanceRate != null ? `${data.attendanceRate}%` : '—'}</p>
                            </div>
                        </div>

                        {/* Per subject */}
                        {subjects.length > 0 && (
                            <div className="bg-white border border-gray-200 overflow-hidden">
                                <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
                                    <h2 className="text-sm font-bold text-gray-900">By Subject</h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                                                <th className="px-4 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Days</th>
                                                <th className="px-4 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Present</th>
                                                <th className="px-4 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Late</th>
                                                <th className="px-4 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Absent</th>
                                                <th className="px-4 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Excused</th>
                                                <th className="px-4 py-3 text-center text-[11px] font-semibold text-gray-900 uppercase tracking-wider">Rate</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {subjects.map((s, i) => (
                                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-3">
                                                        <p className="font-medium text-gray-900 text-sm">{s.sectionSubject?.subject?.subjectCode}</p>
                                                        <p className="text-gray-500 text-xs">{s.sectionSubject?.subject?.subjectName}</p>
                                                    </td>
                                                    <td className="px-4 py-3 text-center text-gray-600 text-sm">{s.days}</td>
                                                    <td className="px-4 py-3 text-center text-green-700 text-sm font-medium">{s.Present}</td>
                                                    <td className="px-4 py-3 text-center text-amber-700 text-sm font-medium">{s.Late}</td>
                                                    <td className="px-4 py-3 text-center text-red-700 text-sm font-medium">{s.Absent}</td>
                                                    <td className="px-4 py-3 text-center text-blue-700 text-sm font-medium">{s.Excused}</td>
                                                    <td className="px-4 py-3 text-center text-gray-900 text-sm font-semibold">{s.rate != null ? `${s.rate}%` : '—'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Recent records */}
                        {records.length > 0 && (
                            <div className="bg-white border border-gray-200 overflow-hidden">
                                <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
                                    <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2"><ClipboardList size={15} /> Recent Records</h2>
                                </div>
                                <ul className="divide-y divide-gray-100">
                                    {records.map((r) => (
                                        <li key={r._id} className="px-5 py-3 flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{r.subject?.subjectCode} · {r.subject?.subjectName}</p>
                                                <p className="text-xs text-gray-500">{formatDate(r.date)}</p>
                                            </div>
                                            <span className={`px-2 py-0.5 text-xs font-medium ${statusBadge(r.status)}`}>{r.status}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

export default MyAttendance;
