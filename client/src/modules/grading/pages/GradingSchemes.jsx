import { useEffect, useState } from 'react';
import { Plus, X, Save, Star, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import DashboardLayout from '@/shared/layouts/DashboardLayout';
import Card from '@/components/cards/Cards';
import { listSchemes, createScheme, updateScheme, deleteScheme } from '../services/grading.service';

const DEFAULT_CATEGORY = { key: '', label: '', weight: 0 };

const GradingSchemes = () => {
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [active, setActive] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await listSchemes();
                setSchemes(res.data || res || []);
            } catch (err) {
                console.error(err);
                toast.error('Failed to load grading schemes.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleCreate = async () => {
        try {
            const res = await createScheme({
                name: 'New Grading Scheme',
                description: '',
                categories: [
                    { key: 'QUIZ', label: 'Quiz', weight: 20 },
                    { key: 'SEATWORK', label: 'Seatwork', weight: 15 },
                    { key: 'ACTIVITY', label: 'Activity', weight: 15 },
                    { key: 'LAB', label: 'Lab', weight: 10 },
                    { key: 'PROJECT', label: 'Project', weight: 20 },
                    { key: 'EXAM', label: 'Exam', weight: 20 },
                ],
                termWeights: { prelim: 1 / 3, midterm: 1 / 3, finals: 1 / 3 },
                passingGrade: 75,
                status: 'Draft',
            });
            setSchemes((prev) => [res.data || res, ...prev]);
            setActive(res.data || res);
            toast.success('Scheme created.');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create scheme.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this grading scheme?')) return;
        try {
            await deleteScheme(id);
            setSchemes((prev) => prev.filter((s) => s._id !== id));
            if (active?._id === id) setActive(null);
            toast.success('Scheme deleted.');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete scheme.');
        }
    };

    return (
        <DashboardLayout>
            <div className="p-6 space-y-6">
                <Card title="Grading Schemes" subtitle="Define the institution-wide grading components, weights, and term mapping." />

                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-gray-900">Schemes</h2>
                    <button onClick={handleCreate} className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors">
                        <Plus size={14} />
                        New Scheme
                    </button>
                </div>

                {loading ? (
                    <Card>
                        <div className="p-8 text-center text-sm text-gray-500">Loading schemes...</div>
                    </Card>
                ) : schemes.length === 0 ? (
                    <Card>
                        <div className="p-10 text-center">
                            <p className="text-sm text-gray-500">No grading schemes yet.</p>
                            <p className="text-xs text-gray-400 mt-1">Create one to define categories and weights for classes.</p>
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {schemes.map((s) => (
                            <button
                                key={s._id}
                                onClick={() => setActive(s)}
                                className={`bg-white border p-5 text-left transition-colors ${
                                    active?._id === s._id ? 'border-gray-900 ring-1 ring-gray-900' : 'border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-gray-900">{s.name}</span>
                                        {s.isDefault && <Star size={14} className="text-amber-500 fill-amber-500" />}
                                    </div>
                                    <span className={`text-[10px] font-medium px-2 py-0.5 ${
                                        s.status === 'Published' ? 'text-green-700 bg-green-50 border border-green-200'
                                        : s.status === 'Archived' ? 'text-gray-500 bg-gray-100 border border-gray-200'
                                        : 'text-amber-700 bg-amber-50 border border-amber-200'
                                    }`}>
                                        {s.status}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    {s.categories?.length} categories · passing {s.passingGrade}
                                </p>
                            </button>
                        ))}
                    </div>
                )}

                {active && <SchemeEditor scheme={active} onSave={(updated) => setSchemes((prev) => prev.map((s) => (s._id === updated._id ? updated : s)))} onDelete={handleDelete} />}
            </div>
        </DashboardLayout>
    );
};

const SchemeEditor = ({ scheme, onSave, onDelete }) => {
    const [name, setName] = useState(scheme.name || '');
    const [status, setStatus] = useState(scheme.status || 'Draft');
    const [isDefault, setIsDefault] = useState(scheme.isDefault || false);
    const [passing, setPassing] = useState(scheme.passingGrade ?? 75);
    const [termWeights, setTermWeights] = useState(scheme.termWeights || { prelim: 1 / 3, midterm: 1 / 3, finals: 1 / 3 });
    const [cats, setCats] = useState((scheme.categories || []).map((c) => ({ key: c.key, label: c.label, weight: c.weight })));
    const [saving, setSaving] = useState(false);

    const total = cats.reduce((s, c) => s + (Number(c.weight) || 0), 0);

    const updateCat = (idx, field, value) =>
        setCats((prev) => prev.map((c, i) => (i === idx ? { ...c, [field]: field === 'weight' ? Number(value) : value } : c)));

    const handleSave = async () => {
        if (!name.trim()) {
            toast.error('Scheme name is required.');
            return;
        }
        if (total !== 100) {
            toast.error(`Category weights must total 100% (currently ${total}%).`);
            return;
        }
        setSaving(true);
        try {
            const res = await updateScheme(scheme._id, {
                name,
                status,
                isDefault,
                passingGrade: Number(passing),
                termWeights,
                categories: cats.map((c) => ({ key: c.key.toUpperCase(), label: c.label, weight: Number(c.weight) })),
            });
            const updated = res.data || res;
            onSave(updated);
            toast.success('Grading scheme saved.');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save scheme.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card>
            <div className="p-5 space-y-5">
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-gray-900">Edit Scheme</h3>
                    <button onClick={() => onDelete(scheme._id)} className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700">
                        <Trash2 size={14} />
                        Delete
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Name</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full text-sm py-1.5 px-2 border text-black border-gray-200 outline-none focus:border-gray-900" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full text-sm py-1.5 px-2 border text-black border-gray-200 outline-none focus:border-gray-900">
                            <option>Draft</option>
                            <option>Published</option>
                            <option>Archived</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Passing Grade</label>
                        <input type="number" value={passing} onChange={(e) => setPassing(Number(e.target.value))} className="w-full text-sm py-1.5 px-2 border text-black border-gray-200 outline-none focus:border-gray-900" />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />
                    <span className="text-sm text-gray-700">Set as default scheme</span>
                </div>

                <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-bold text-gray-900">Category Weights</h4>
                        <button
                            onClick={() => setCats((prev) => [...prev, { ...DEFAULT_CATEGORY }])}
                            className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900"
                        >
                            <Plus size={13} />
                            Add Category
                        </button>
                    </div>
                    <div className="space-y-2">
                        {cats.map((c, idx) => (
                            <div key={idx} className="grid grid-cols-[1fr_1fr_100px_32px] gap-2 items-center">
                                <input value={c.key} onChange={(e) => updateCat(idx, 'key', e.target.value)} placeholder="KEY" className="w-full text-sm py-1.5 px-2 border text-black border-gray-200 outline-none focus:border-gray-900 uppercase" />
                                <input value={c.label} onChange={(e) => updateCat(idx, 'label', e.target.value)} placeholder="Label" className="w-full text-sm py-1.5 px-2 border text-black border-gray-200 outline-none focus:border-gray-900" />
                                <input type="number" min="0" max="100" value={c.weight} onChange={(e) => updateCat(idx, 'weight', e.target.value)} placeholder="%" className="w-full text-sm py-1.5 px-2 border text-black border-gray-200 outline-none focus:border-gray-900" />
                                <button onClick={() => setCats((prev) => prev.filter((_, i) => i !== idx))} className="text-gray-400 hover:text-red-600">
                                    <X size={15} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <p className={`text-xs mt-2 ${total === 100 ? 'text-gray-500' : 'text-red-600'}`}>Total: {total}%</p>
                </div>

                <div className="border-t border-gray-100 pt-4">
                    <h4 className="text-sm font-bold text-gray-900 mb-3">Term Weights (Final Grade)</h4>
                    <div className="grid grid-cols-3 gap-4 max-w-md">
                        {['prelim', 'midterm', 'finals'].map((t) => (
                            <div key={t}>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{t}</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="1"
                                    value={termWeights[t]}
                                    onChange={(e) => setTermWeights((prev) => ({ ...prev, [t]: Number(e.target.value) }))}
                                    className="w-full text-sm py-1.5 px-2 border text-black border-gray-200 outline-none focus:border-gray-900"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
                        <Save size={14} />
                        {saving ? 'Saving...' : 'Save Scheme'}
                    </button>
                </div>
            </div>
        </Card>
    );
};

export default GradingSchemes;
