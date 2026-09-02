import { useEffect, useState } from 'react';
import { GraduationCap, TrendingUp, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

import { getMyGrades } from '../services/student.service';
import DashboardLayout from '@/shared/layouts/DashboardLayout';

const gradeColor = (g) => {
    if (g == null) return 'text-gray-400';
    return g >= 75 ? 'text-green-700' : 'text-red-600';
};

const remarksBadge = (remarks) => {
    if (remarks === 'Passed') return 'text-green-700 bg-green-50 border border-green-200';
    if (remarks === 'Failed') return 'text-red-700 bg-red-50 border border-red-200';
    if (remarks === 'Incomplete') return 'text-amber-700 bg-amber-50 border border-amber-200';
    return 'text-gray-500 bg-gray-100 border border-gray-200';
};

const MyGrades = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getMyGrades();
                setData(res.data || res);
            } catch (err) {
                console.error(err);
                toast.error('Failed to load grades.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <DashboardLayout>
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Grades</h1>
                    <p className="text-gray-500 text-sm">
                        View your term grades and semester final grades.
                    </p>
                </div>

                {loading ? (
                    <div className="bg-white border border-gray-200 p-8 text-center text-gray-500 text-sm">Loading grades...</div>
                ) : !data || !data.semesters?.length ? (
                    <div className="bg-white border border-gray-200 p-10 text-center text-gray-500">
                        <GraduationCap className="mx-auto mb-3 text-gray-300" size={40} />
                        <p className="text-sm">No grades available yet.</p>
                    </div>
                ) : (
                    <>
                        {/* GPA summary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white border border-gray-200 px-5 py-4">
                                <p className="text-[11px] text-gray-500 uppercase tracking-wide font-medium">Overall GPA</p>
                                <p className="text-3xl font-bold text-gray-900">{data.overallGpa ?? '—'}</p>
                            </div>
                            <div className="bg-white border border-gray-200 px-5 py-4 flex items-center gap-3">
                                <TrendingUp className="text-gray-400" size={20} />
                                <div>
                                    <p className="text-[11px] text-gray-500 uppercase tracking-wide font-medium">Student</p>
                                    <p className="text-sm font-semibold text-gray-900">{data.student?.fullName}</p>
                                    <p className="text-xs text-gray-500">{data.student?.studentNumber} · {data.student?.program}</p>
                                </div>
                            </div>
                        </div>

                        {/* Semesters */}
                        {data.semesters.map((sem) => (
                            <div key={sem.semester} className="bg-white border border-gray-200 overflow-hidden">
                                <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                                    <h2 className="text-sm font-bold text-gray-900">
                                        Semester {sem.semester}
                                    </h2>
                                    <div className="text-xs text-gray-500">
                                        {sem.units} units · <span className="font-semibold text-gray-900">Semester GPA {sem.gpa ?? '—'}</span>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                                                <th className="px-4 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Units</th>
                                                <th className="px-4 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Prelim</th>
                                                <th className="px-4 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Midterm</th>
                                                <th className="px-4 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Finals</th>
                                                <th className="px-4 py-3 text-center text-[11px] font-semibold text-gray-900 uppercase tracking-wider">Final</th>
                                                <th className="px-4 py-3 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Remarks</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {sem.subjects.map((s) => (
                                                <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-3">
                                                        <p className="font-medium text-gray-900 text-sm">{s.subject?.subjectCode}</p>
                                                        <p className="text-gray-500 text-xs">{s.subject?.subjectName}</p>
                                                    </td>
                                                    <td className="px-4 py-3 text-center text-gray-600 text-sm">{s.units}</td>
                                                    <td className={`px-4 py-3 text-center font-medium text-sm ${gradeColor(s.prelimGrade)}`}>{s.prelimGrade ?? '—'}</td>
                                                    <td className={`px-4 py-3 text-center font-medium text-sm ${gradeColor(s.midtermGrade)}`}>{s.midtermGrade ?? '—'}</td>
                                                    <td className={`px-4 py-3 text-center font-medium text-sm ${gradeColor(s.finalsGrade)}`}>{s.finalsGrade ?? '—'}</td>
                                                    <td className={`px-4 py-3 text-center font-bold text-sm ${gradeColor(s.finalGrade)}`}>{s.finalGrade ?? '—'}</td>
                                                    <td className="px-4 py-3 text-center">
                                                        {s.remarks ? (
                                                            <span className={`px-2 py-0.5 text-xs font-medium ${remarksBadge(s.remarks)}`}>{s.remarks}</span>
                                                        ) : (
                                                            <span className="text-xs text-gray-400">—</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}

                        <p className="flex items-center gap-1.5 text-xs text-gray-400">
                            <AlertCircle size={13} />
                            Final grade = ⅓ Prelim + ⅓ Midterm + ⅓ Finals. GPA is weighted by units.
                        </p>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

export default MyGrades;
