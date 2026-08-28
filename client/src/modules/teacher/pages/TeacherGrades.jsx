import { useEffect, useState } from 'react';
import { BookOpen, Users, Clock, MapPin, ArrowLeft, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import DashboardLayout from '@/shared/layouts/DashboardLayout';
import Card from '@/components/cards/Cards';
import { getMyClasses, getClassGrades, updateGrades } from '../services/teacher.service';

const formatTime = (t) => {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hour = parseInt(h, 10);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${m} ${suffix}`;
};

const TeacherGrades = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState(null);
    const [gradesData, setGradesData] = useState(null);
    const [gradesLoading, setGradesLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editedGrades, setEditedGrades] = useState({});

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getMyClasses();
                setClasses(res.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleSelectClass = async (cls) => {
        setSelectedClass(cls);
        setGradesLoading(true);
        setEditedGrades({});
        try {
            const res = await getClassGrades(cls._id);
            setGradesData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setGradesLoading(false);
        }
    };

    const handleGradeChange = (studentSubjectId, value) => {
        const num = value === '' ? null : parseFloat(value);
        if (num !== null && (isNaN(num) || num < 0 || num > 100)) return;
        setEditedGrades((prev) => ({ ...prev, [studentSubjectId]: num }));
    };

    const getDisplayGrade = (g) => {
        if (editedGrades[g._id] !== undefined) return editedGrades[g._id];
        return g.finalGrade;
    };

    const getRemarks = (grade) => {
        if (grade === null || grade === undefined) return null;
        return grade >= 75 ? 'Passed' : 'Failed';
    };

    const hasChanges = Object.keys(editedGrades).length > 0;

    const handleSave = async () => {
        const gradesArray = Object.entries(editedGrades).map(([studentSubjectId, finalGrade]) => ({
            studentSubjectId,
            finalGrade,
        }));

        setSaving(true);
        try {
            await updateGrades(selectedClass._id, gradesArray);
            toast.success('Grades saved successfully');
            // Refresh grades data
            const res = await getClassGrades(selectedClass._id);
            setGradesData(res.data);
            setEditedGrades({});
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save grades');
        } finally {
            setSaving(false);
        }
    };

    const handleBack = () => {
        setSelectedClass(null);
        setGradesData(null);
        setEditedGrades({});
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="p-6 space-y-4">
                    <div className="h-8 w-48 bg-gray-100 border border-gray-200" />
                    <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-40 bg-gray-100 border border-gray-200" />
                        ))}
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // Grade Entry View
    if (selectedClass) {
        const grades = gradesData?.grades || [];
        const info = gradesData?.sectionSubject || selectedClass;

        return (
            <DashboardLayout>
                <div className="p-6 space-y-6 m-5 ">
                    {/* Back */}
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Classes
                    </button>

                    {/* Header */}
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                                Grade Book
                            </h1>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                <span className="font-semibold text-gray-900">
                                    {info.subject?.subjectCode} — {info.subject?.subjectName}
                                </span>
                                <span className="bg-gray-100 border border-gray-200 px-2 py-0.5 font-medium">
                                    {info.section?.sectionCode}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock size={11} />
                                    {info.day} {formatTime(info.startTime)}–{formatTime(info.endTime)}
                                </span>
                            </div>
                        </div>
                        {hasChanges && (
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                            >
                                <Save size={14} />
                                {saving ? 'Saving...' : 'Save Grades'}
                            </button>
                        )}
                    </div>

                    {/* Grades Table */}
                    <Card>
                        {gradesLoading ? (
                            <div className="p-8 text-center text-sm text-gray-500">Loading grades...</div>
                        ) : grades.length === 0 ? (
                            <div className="p-10 text-center">
                                <Users size={32} className="mx-auto mb-2 text-gray-300" />
                                <p className="text-sm text-gray-500">No students enrolled</p>
                                <p className="text-xs text-gray-400 mt-1">Students will appear here once they are loaded into this section.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200">
                                            <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Student #</th>
                                            <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="text-center px-4 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-28">Grade</th>
                                            <th className="text-center px-4 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-28">Remarks</th>
                                            <th className="text-center px-4 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {grades.map((g, idx) => {
                                            const displayGrade = getDisplayGrade(g);
                                            const remarks = getRemarks(displayGrade);
                                            const isEdited = editedGrades[g._id] !== undefined;

                                            return (
                                                <tr key={g._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                                                    <td className="px-4 py-2.5 text-gray-900 font-medium text-xs">
                                                        {g.student?.studentNumber || '—'}
                                                    </td>
                                                    <td className="px-4 py-2.5 text-gray-900">
                                                        {g.student?.lastName}, {g.student?.firstName}
                                                    </td>
                                                    <td className="px-4 py-2.5 text-center">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            step="0.01"
                                                            value={displayGrade ?? ''}
                                                            onChange={(e) => handleGradeChange(g._id, e.target.value)}
                                                            className={`w-20 text-center text-sm py-1 border outline-none transition-colors ${
                                                                isEdited
                                                                    ? 'border-amber-400 bg-amber-50'
                                                                    : 'border-gray-200 focus:border-gray-900'
                                                            }`}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2.5 text-center">
                                                        {remarks ? (
                                                            <span className={`text-[11px] font-medium px-2 py-0.5 ${
                                                                remarks === 'Passed'
                                                                    ? 'text-green-700 bg-green-50 border border-green-200'
                                                                    : 'text-red-700 bg-red-50 border border-red-200'
                                                            }`}>
                                                                {remarks}
                                                            </span>
                                                        ) : (
                                                            <span className="text-xs text-gray-400">—</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-2.5 text-center text-xs">
                                                        <span className={`px-2 py-0.5 font-medium ${
                                                            g.status === 'Completed'
                                                                ? 'text-green-700 bg-green-50 border border-green-200'
                                                                : g.status === 'Failed'
                                                                ? 'text-red-700 bg-red-50 border border-red-200'
                                                                : 'text-gray-500 bg-gray-100 border border-gray-200'
                                                        }`}>
                                                            {g.status || '—'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>
                </div>
            </DashboardLayout>
        );
    }

    // Class Select View
    return (
        <DashboardLayout>
            <div className="">
                {/* Header */}
                <Card
                    title="Grade Book"
                    subtitle="Select a class to enter or update student grades."
                />

                {/* Class Cards */}
                {classes.length === 0 ? (
                    <Card>
                        <div className="p-10 text-center">
                            <BookOpen size={40} className="mx-auto mb-3 text-gray-300" />
                            <p className="text-sm text-gray-500">No classes assigned.</p>
                            <p className="text-xs text-gray-400 mt-1">Contact your administrator to get assigned to section subjects.</p>
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {classes.map((cls) => (
                            <button
                                key={cls._id}
                                onClick={() => handleSelectClass(cls)}
                                className="bg-white border border-gray-200 p-5 text-left hover:bg-gray-50 transition-colors group"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="bg-gray-900 text-white w-10 h-10 flex items-center justify-center text-xs font-bold shrink-0">
                                        {cls.subject?.subjectCode?.slice(0, 4) || '—'}
                                    </div>
                                    <span className="text-[10px] font-medium text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5">
                                        {cls.section?.sectionCode || '—'}
                                    </span>
                                </div>
                                <p className="text-sm font-semibold text-gray-900 mt-3">
                                    {cls.subject?.subjectName || '—'}
                                </p>
                                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Clock size={11} />
                                        {cls.day} {formatTime(cls.startTime)}–{formatTime(cls.endTime)}
                                    </span>
                                    {cls.room && (
                                        <span className="flex items-center gap-1">
                                            <MapPin size={11} />
                                            {cls.room}
                                        </span>
                                    )}
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                                    <span className="flex items-center gap-1 text-xs text-gray-500">
                                        <Users size={11} />
                                        {cls.studentCount} student{cls.studentCount !== 1 ? 's' : ''}
                                    </span>
                                    <span className="text-[10px] text-gray-400 group-hover:text-gray-900 transition-colors">
                                        Enter grades →
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default TeacherGrades;
