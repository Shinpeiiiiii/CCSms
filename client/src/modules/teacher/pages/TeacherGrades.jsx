import { useEffect, useState, useCallback } from 'react';
import { BookOpen, Users, Clock, MapPin, ArrowLeft, Save, Plus, X, Upload, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';
import DashboardLayout from '@/shared/layouts/DashboardLayout';
import Card from '@/components/cards/Cards';
import { getMyClasses } from '../services/teacher.service';
import {
    getGradingConfig,
    updateGradingConfig,
    getClassEnrollments,
    getGradeItems,
    createGradeItem,
    updateGradeItem,
    deleteGradeItem,
    saveScores,
    listGroups,
    createGroup,
    updateGroup,
    deleteGroup,
    computeGrades,
    saveComputedGrades,
    importScores,
} from '@/modules/grading/services/grading.service';

const TERMS = [
    { key: 'prelim', label: 'Prelim' },
    { key: 'midterm', label: 'Midterm' },
    { key: 'finals', label: 'Finals' },
];

const formatTime = (t) => {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hour = parseInt(h, 10);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${m} ${suffix}`;
};

const Component = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState(null);

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

    if (loading) {
        return (
            <DashboardLayout>
                <div className="p-6 space-y-4">
                    <div className="h-8 w-48 bg-gray-100 border border-gray-200" />
                    <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-40 bg-gray-100 border border-gray-200" />
                        ))}
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (selectedClass) {
        return <Gradebook selectedClass={selectedClass} onBack={() => setSelectedClass(null)} />;
    }

    return (
        <DashboardLayout>
            <div className="">
                <Card title="Grade Book" subtitle="Select a class to manage assessment items and compute grades." />
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
                                onClick={() => setSelectedClass(cls)}
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
                                <p className="text-sm font-semibold text-gray-900 mt-3">{cls.subject?.subjectName || '—'}</p>
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
                                    <span className="text-[10px] text-gray-400 group-hover:text-gray-900 transition-colors">Manage grades →</span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

const Gradebook = ({ selectedClass, onBack }) => {
    const [enrollments, setEnrollments] = useState([]);
    const [config, setConfig] = useState(null);
    const [items, setItems] = useState([]);
    const [groups, setGroups] = useState([]);
    const [activeTerm, setActiveTerm] = useState('prelim');
    const [view, setView] = useState('items');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const sscId = selectedClass._id;

    const loadAll = useCallback(async () => {
        setLoading(true);
        try {
            const [enr, cfg, itms, grps] = await Promise.all([
                getClassEnrollments(sscId),
                getGradingConfig(sscId),
                getGradeItems(sscId),
                listGroups(sscId),
            ]);
            setEnrollments(enr.enrollments || enr.data?.enrollments || []);
            setConfig(cfg.data || cfg);
            setItems(itms.data || itms);
            setGroups(grps);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to load gradebook.');
        } finally {
            setLoading(false);
        }
    }, [sscId]);

    useEffect(() => {
        loadAll();
    }, [loadAll]);

    const handleCompute = async () => {
        setSaving(true);
        try {
            const res = await computeGrades(sscId);
            setResults(res.data || res);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to compute grades.');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveGrades = async () => {
        setSaving(true);
        try {
            const res = await saveComputedGrades(sscId);
            setResults(res.data || res);
            toast.success('Grades computed and saved.');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save grades.');
        } finally {
            setSaving(false);
        }
    };

    const info = selectedClass;

    return (
        <DashboardLayout>
            <div className="p-6 space-y-6 m-5">
                <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    <ArrowLeft size={16} />
                    Back to Classes
                </button>

                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Grade Book</h1>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <span className="font-semibold text-gray-900">
                                {info.subject?.subjectCode} — {info.subject?.subjectName}
                            </span>
                            <span className="bg-gray-100 border border-gray-200 px-2 py-0.5 font-medium">{info.section?.sectionCode}</span>
                            <span className="flex items-center gap-1">
                                <Clock size={11} />
                                {info.day} {formatTime(info.startTime)}–{formatTime(info.endTime)}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={handleCompute} disabled={saving} className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50">
                            <Save size={14} />
                            {saving ? 'Working...' : 'Preview'}
                        </button>
                        <button onClick={handleSaveGrades} disabled={saving} className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
                            <Save size={14} />
                            {saving ? 'Saving...' : 'Compute & Save'}
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2 border-b border-gray-200">
                    <TabBtn active={view === 'items'} onClick={() => setView('items')}>Assessment Items</TabBtn>
                    <TabBtn active={view === 'setup'} onClick={() => setView('setup')}>Grading Setup</TabBtn>
                    <TabBtn active={view === 'results'} onClick={() => setView('results')}>Results</TabBtn>
                </div>

                {loading ? (
                    <Card>
                        <div className="p-8 text-center text-sm text-gray-500">Loading gradebook...</div>
                    </Card>
                ) : (
                    <>
                        {view === 'items' && (
                            <ItemsView
                                sscId={sscId}
                                enrollments={enrollments}
                                items={items}
                                setItems={setItems}
                                groups={groups}
                                setGroups={setGroups}
                                activeTerm={activeTerm}
                                setActiveTerm={setActiveTerm}
                                config={config}
                            />
                        )}
                        {view === 'setup' && <SetupView sscId={sscId} config={config} setConfig={setConfig} />}
                        {view === 'results' && <ResultsView results={results} enrollments={enrollments} onPreview={handleCompute} />}
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

const TabBtn = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
            active ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'
        }`}
    >
        {children}
    </button>
);

const ItemsView = ({ sscId, enrollments, items, setItems, groups, setGroups, activeTerm, setActiveTerm, config }) => {
    const [showModal, setShowModal] = useState(false);
    const [showImport, setShowImport] = useState(false);
    const [expanded, setExpanded] = useState(null);

    const termItems = items.filter((i) => i.term === activeTerm);
    const configCategories = config?.categories || [];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {TERMS.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setActiveTerm(t.key)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                                activeTerm === t.key
                                    ? 'bg-gray-900 text-white border-gray-900'
                                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowImport(true)}
                        className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                        <Upload size={14} />
                        Import CSV
                    </button>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                        <Plus size={14} />
                        Add Item
                    </button>
                </div>
            </div>

            {configCategories.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 px-4 py-3">
                    <span className="font-semibold text-gray-700">Weights:</span>
                    {configCategories.map((c) => (
                        <span key={c.key} className="bg-white border border-gray-200 px-2 py-0.5">
                            {c.label} {c.weight}%
                        </span>
                    ))}
                </div>
            )}

            {termItems.length === 0 ? (
                <Card>
                    <div className="p-10 text-center">
                        <BookOpen size={32} className="mx-auto mb-2 text-gray-300" />
                        <p className="text-sm text-gray-500">No assessment items for {TERMS.find((t) => t.key === activeTerm)?.label}.</p>
                        <p className="text-xs text-gray-400 mt-1">Add a quiz, seatwork, activity, project, or exam.</p>
                    </div>
                </Card>
            ) : (
                <div className="space-y-3">
                    {termItems.map((item) => (
                        <ItemCard
                            key={item._id}
                            item={item}
                            expanded={expanded === item._id}
                            onToggle={() => setExpanded(expanded === item._id ? null : item._id)}
                            enrollments={enrollments}
                            groups={groups}
                            setGroups={setGroups}
                            setItems={setItems}
                        />
                    ))}
                </div>
            )}

            {showModal && (
                <ItemModal
                    sscId={sscId}
                    defaultTerm={activeTerm}
                    categories={configCategories}
                    onClose={() => setShowModal(false)}
                    onCreated={(item) => {
                        setItems((prev) => [...prev, item]);
                        setShowModal(false);
                    }}
                />
            )}

            {showImport && (
                <ImportModal
                    sscId={sscId}
                    activeTerm={activeTerm}
                    items={items}
                    onClose={() => setShowImport(false)}
                    onImported={() => setShowImport(false)}
                />
            )}
        </div>
    );
};

const ItemCard = ({ item, expanded, onToggle, enrollments, groups, setGroups, setItems }) => {
    const [values, setValues] = useState({});
    const [saving, setSaving] = useState(false);
    const isGroup = item.isGroup;

    const handleSave = async () => {
        setSaving(true);
        try {
            if (isGroup) {
                await saveScores({ gradeItem: item._id, baseScore: values._base });
            } else {
                const scores = Object.entries(values)
                    .filter(([k]) => k !== '_base')
                    .filter(([, v]) => v !== '' && v != null)
                    .map(([studentId, score]) => ({ student: studentId, score }));
                await saveScores({ gradeItem: item._id, scores });
            }
            toast.success('Scores saved.');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save scores.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Delete this item and all its scores?')) return;
        try {
            await deleteGradeItem(item._id);
            setItems((prev) => prev.filter((i) => i._id !== item._id));
            toast.success('Item deleted.');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete item.');
        }
    };

    const group = item.groupId ? groups.find((g) => g._id === item.groupId) : null;

    return (
        <Card>
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold uppercase text-white bg-gray-900 px-2 py-1">{item.category}</span>
                        <span className="text-sm font-semibold text-gray-900">{item.title}</span>
                        {isGroup && <span className="text-[10px] font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5">Group</span>}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">/{item.possible}</span>
                        <button onClick={onToggle} className="text-xs text-gray-400 hover:text-gray-700">
                            <ChevronDown size={16} className={expanded ? 'rotate-180 transition-transform' : 'transition-transform'} />
                        </button>
                        <button onClick={handleDelete} className="text-xs text-gray-400 hover:text-red-600">
                            <X size={14} />
                        </button>
                    </div>
                </div>

                {expanded && (
                    <div className="mt-4 space-y-4">
                        {isGroup ? (
                            <GroupEditor item={item} group={group} groups={groups} setGroups={setGroups} values={values} setValues={setValues} enrollments={enrollments} sscId={item.sectionSubject} />
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200">
                                            <th className="text-left px-3 py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Student #</th>
                                            <th className="text-left px-3 py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="text-center px-3 py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-24">Score</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {enrollments.map((e) => (
                                            <tr key={e._id}>
                                                <td className="px-3 py-2 text-xs text-gray-900 font-medium">{e.student?.studentNumber || '—'}</td>
                                                <td className="px-3 py-2 text-gray-900">
                                                    {e.student?.lastName}, {e.student?.firstName}
                                                </td>
                                                <td className="px-3 py-2 text-center">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max={item.possible}
                                                        value={values[e._id] ?? ''}
                                                        onChange={(ev) => setValues((prev) => ({ ...prev, [e._id]: ev.target.value }))}
                                                        className="w-20 text-center text-sm py-1 border border-gray-200 outline-none focus:border-gray-900"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="flex items-center justify-end gap-2">
                            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-gray-900 text-white px-4 py-1.5 text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
                                <Save size={14} />
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

const GroupEditor = ({ item, group, groups, setGroups, values, setValues, enrollments, sscId }) => {
    const [members, setMembers] = useState(group ? group.members.map((m) => String(m.student?._id || m.student)) : []);
    const [selected, setSelected] = useState('');

    if (!group) {
        return (
            <div className="text-sm text-gray-500">
                <p>This group project needs a group assigned. If no group is linked, assign members below.</p>
                {members.length === 0 ? (
                    <div className="mt-3 flex items-center gap-2">
                        <select value={selected} onChange={(e) => setSelected(e.target.value)} className="border border-gray-200 px-2 py-1 text-sm">
                            <option value="">Select student...</option>
                            {enrollments.map((e) => (
                                <option key={e._id} value={e._id}>
                                    {e.student?.lastName}, {e.student?.firstName}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={async () => {
                                if (!selected) return;
                                const newMembers = [...members, selected];
                                const grp = group || { sectionSubject: sscId, name: item.title, members: [] };
                                if (group) {
                                    const res = await updateGroup(group._id, {
                                        name: grp.name,
                                        members: newMembers.map((id) => ({ student: id })),
                                    });
                                    setGroups((prev) => prev.map((g) => (g._id === res._id ? { ...g, ...res } : g)));
                                } else {
                                    const res = await createGroup({ sectionSubject: sscId, name: item.title, memberIds: newMembers });
                                    setGroups((prev) => [...prev, res]);
                                }
                                setMembers(newMembers);
                                setSelected('');
                            }}
                            className="bg-gray-900 text-white px-3 py-1.5 text-xs font-medium hover:bg-gray-800"
                        >
                            Add member
                        </button>
                    </div>
                ) : null}
            </div>
        );
    }

    return (
        <div>
            <div className="mb-3 flex items-center gap-3">
                <label className="text-sm text-gray-600 font-medium">Group score:</label>
                <input
                    type="number"
                    min="0"
                    max={item.possible}
                    value={values._base ?? ''}
                    onChange={(e) => setValues((prev) => ({ ...prev, _base: e.target.value }))}
                    className="w-24 text-center text-sm py-1 border border-gray-200 outline-none focus:border-gray-900"
                    placeholder={`/ ${item.possible}`}
                />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="text-left px-3 py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Member</th>
                            <th className="text-center px-3 py-2 text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-32">Adjustment</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {group.members.map((m) => (
                            <tr key={String(m.student?._id || m.student)}>
                                <td className="px-3 py-2 text-gray-900">
                                    {m.student?.lastName}, {m.student?.firstName || '—'}
                                </td>
                                <td className="px-3 py-2 text-center">
                                    <input
                                        type="number"
                                        value={values[`adj_${String(m.student?._id || m.student)}`] ?? m.adjustment ?? 0}
                                        onChange={(e) =>
                                            setValues((prev) => ({
                                                ...prev,
                                                [`adj_${String(m.student?._id || m.student)}`]: e.target.value,
                                            }))
                                        }
                                        className="w-24 text-center text-sm py-1 border border-gray-200 outline-none focus:border-gray-900"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p className="text-xs text-gray-400 mt-2">Member final = group score + adjustment (capped at item total).</p>
            </div>
        </div>
    );
};

const ItemModal = ({ sscId, defaultTerm, categories, onClose, onCreated }) => {
    const [form, setForm] = useState({
        title: '',
        category: categories[0]?.key || '',
        possible: '',
        term: defaultTerm,
        isGroup: false,
    });

    const handleSubmit = async () => {
        if (!form.title || !form.possible) {
            toast.error('Title and max score are required.');
            return;
        }
        try {
            const payload = {
                sectionSubject: sscId,
                term: form.term,
                category: form.category,
                title: form.title,
                possible: Number(form.possible),
                isGroup: form.isGroup,
            };
            const res = await createGradeItem(payload);
            onCreated(res);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create item.');
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-gray-50 px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-base font-bold text-gray-900">Add Assessment Item</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
                        <X size={18} />
                    </button>
                </div>
                <div className="p-5 space-y-4">
                    <Field label="Title">
                        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full text-sm py-1.5 px-2 border border-gray-200 outline-none focus:border-gray-900" placeholder="e.g. Quiz 1" />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Category">
                            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full text-sm py-1.5 px-2 border border-gray-200 outline-none focus:border-gray-900">
                                {categories.map((c) => (
                                    <option key={c.key} value={c.key}>
                                        {c.label}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Term">
                            <select value={form.term} onChange={(e) => setForm({ ...form, term: e.target.value })} className="w-full text-sm py-1.5 px-2 border border-gray-200 outline-none focus:border-gray-900">
                                {TERMS.map((t) => (
                                    <option key={t.key} value={t.key}>
                                        {t.label}
                                    </option>
                                ))}
                            </select>
                        </Field>
                    </div>
                    <Field label="Max Score">
                        <input type="number" min="1" value={form.possible} onChange={(e) => setForm({ ...form, possible: e.target.value })} className="w-full text-sm py-1.5 px-2 border border-gray-200 outline-none focus:border-gray-900" placeholder="e.g. 20" />
                    </Field>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" checked={form.isGroup} onChange={(e) => setForm({ ...form, isGroup: e.target.checked })} />
                        Group project (group score + per-member adjustment)
                    </label>
                </div>
                <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-2">
                    <button onClick={onClose} className="border border-gray-300 text-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-50">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-800">
                        Create Item
                    </button>
                </div>
            </div>
        </div>
    );
};

const ImportModal = ({ sscId, activeTerm, items, onClose, onImported }) => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [csv, setCsv] = useState('');
    const [file, setFile] = useState(null);
    const [importing, setImporting] = useState(false);

    const termItems = items.filter((i) => i.term === activeTerm);

    const handleFile = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setFile(f);
        const reader = new FileReader();
        reader.onload = (ev) => setCsv(ev.target.result || '');
        reader.readAsText(f);
    };

    const handleImport = async () => {
        if (selectedItems.length === 0) {
            toast.error('Select at least one item to import into.');
            return;
        }
        if (!csv.trim()) {
            toast.error('Paste or upload CSV content.');
            return;
        }
        setImporting(true);
        try {
            const res = await importScores({ sectionSubject: sscId, itemIds: selectedItems, csv });
            const data = res.data || res;
            toast.success(
                data.message +
                    (data.errors?.length ? ` (${data.errors.length} issue${data.errors.length !== 1 ? 's' : ''})` : '')
            );
            onImported();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Import failed.');
        } finally {
            setImporting(false);
        }
    };

    const toggleItem = (id) =>
        setSelectedItems((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-gray-50 px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-base font-bold text-gray-900">Import Scores (CSV)</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
                        <X size={18} />
                    </button>
                </div>
                <div className="p-5 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            Import into items ({TERMS.find((t) => t.key === activeTerm)?.label})
                        </label>
                        <div className="space-y-1.5 max-h-36 overflow-y-auto border border-gray-200 rounded-lg p-2">
                            {termItems.length === 0 ? (
                                <p className="text-xs text-gray-400">No items for this term.</p>
                            ) : (
                                termItems.map((it) => (
                                    <label key={it._id} className="flex items-center gap-2 text-sm text-gray-700">
                                        <input type="checkbox" checked={selectedItems.includes(it._id)} onChange={() => toggleItem(it._id)} />
                                        {it.title} ({it.category})
                                    </label>
                                ))
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">CSV file</label>
                        <input type="file" accept=".csv,text/csv" onChange={handleFile} className="text-sm" />
                        <p className="text-xs text-gray-400 mt-1">
                            First column = student number or full name. One column per selected item, in the same order as the checkboxes above.
                        </p>
                    </div>
                </div>
                <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-2">
                    <button onClick={onClose} className="border border-gray-300 text-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-50">
                        Cancel
                    </button>
                    <button onClick={handleImport} disabled={importing} className="bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50">
                        {importing ? 'Importing...' : 'Import'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const Field = ({ label, children }) => (
    <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
        {children}
    </div>
);

const SetupView = ({ sscId, config, setConfig }) => {
    const [cats, setCats] = useState(
        (config?.categories || []).map((c) => ({ key: c.key, label: c.label, weight: c.weight }))
    );
    const [termWeights, setTermWeights] = useState(config?.termWeights || { prelim: 1 / 3, midterm: 1 / 3, finals: 1 / 3 });
    const [passing, setPassing] = useState(config?.passingGrade ?? 75);
    const [saving, setSaving] = useState(false);

    const total = cats.reduce((s, c) => s + (Number(c.weight) || 0), 0);

    const handleSave = async () => {
        if (total !== 100) {
            toast.error(`Weights must total 100% (currently ${total}%).`);
            return;
        }
        setSaving(true);
        try {
            const res = await updateGradingConfig(sscId, {
                categories: cats.map((c) => ({ key: c.key, label: c.label, weight: Number(c.weight) })),
                termWeights,
                passingGrade: Number(passing),
            });
            setConfig(res.data || res);
            toast.success('Grading setup saved.');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save setup.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card>
            <div className="p-5 space-y-5">
                <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3">Category Weights</h3>
                    <div className="space-y-2">
                        {cats.map((c, idx) => (
                            <div key={c.key} className="flex items-center gap-3">
                                <span className="w-32 text-sm text-gray-700">{c.label}</span>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={c.weight}
                                    onChange={(e) =>
                                        setCats((prev) => prev.map((x, i) => (i === idx ? { ...x, weight: Number(e.target.value) } : x)))
                                    }
                                    className="w-20 text-center text-sm py-1 border border-gray-200 outline-none focus:border-gray-900"
                                />
                                <span className="text-xs text-gray-400">%</span>
                            </div>
                        ))}
                    </div>
                    <p className={`text-xs mt-2 ${total === 100 ? 'text-gray-500' : 'text-red-600'}`}>Total: {total}%</p>
                </div>

                <div className="border-t border-gray-100 pt-4">
                    <h3 className="text-sm font-bold text-gray-900 mb-3">Term Weights (Final Grade)</h3>
                    <div className="grid grid-cols-3 gap-4 max-w-md">
                        {TERMS.map((t) => (
                            <div key={t.key}>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{t.label}</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="1"
                                    value={termWeights[t.key]}
                                    onChange={(e) => setTermWeights((prev) => ({ ...prev, [t.key]: Number(e.target.value) }))}
                                    className="w-full text-sm py-1 border border-gray-200 outline-none focus:border-gray-900 px-2"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                    <h3 className="text-sm font-bold text-gray-900 mb-3">Passing Grade</h3>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        value={passing}
                        onChange={(e) => setPassing(Number(e.target.value))}
                        className="w-24 text-sm py-1 border border-gray-200 outline-none focus:border-gray-900 px-2"
                    />
                </div>

                <div className="flex justify-end">
                    <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
                        <Save size={14} />
                        {saving ? 'Saving...' : 'Save Setup'}
                    </button>
                </div>
            </div>
        </Card>
    );
};

const ResultsView = ({ results, enrollments, onPreview }) => {
    if (!results) {
        return (
            <Card>
                <div className="p-10 text-center">
                    <p className="text-sm text-gray-500">No computed results yet.</p>
                    <p className="text-xs text-gray-400 mt-1">Click "Preview" to compute term grades and final grades.</p>
                </div>
            </Card>
        );
    }

    const rows = results?.data?.results || results?.results || [];

    return (
        <Card>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                            <th className="text-center px-4 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Prelim</th>
                            <th className="text-center px-4 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Midterm</th>
                            <th className="text-center px-4 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Finals</th>
                            <th className="text-center px-4 py-2.5 text-[11px] font-semibold text-gray-900 uppercase tracking-wider">Final</th>
                            <th className="text-center px-4 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Remarks</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {rows.map((r) => (
                            <tr key={r.enrollment?._id || r.student?._id}>
                                <td className="px-4 py-2.5 text-gray-900">
                                    {r.student?.lastName || r.enrollment?.student?.lastName}, {r.student?.firstName || r.enrollment?.student?.firstName}
                                </td>
                                <td className="px-4 py-2.5 text-center">{r.termGrades?.prelim ?? '—'}</td>
                                <td className="px-4 py-2.5 text-center">{r.termGrades?.midterm ?? '—'}</td>
                                <td className="px-4 py-2.5 text-center">{r.termGrades?.finals ?? '—'}</td>
                                <td className="px-4 py-2.5 text-center font-bold">
                                    {r.finalGrade ?? '—'}
                                </td>
                                <td className="px-4 py-2.5 text-center">
                                    {r.finalGrade != null ? (
                                        <span className={`text-[11px] font-medium px-2 py-0.5 ${r.finalGrade >= 75 ? 'text-green-700 bg-green-50 border border-green-200' : 'text-red-700 bg-red-50 border border-red-200'}`}>
                                            {r.finalGrade >= 75 ? 'Passed' : 'Failed'}
                                        </span>
                                    ) : (
                                        <span className="text-xs text-gray-400">—</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default Component;
