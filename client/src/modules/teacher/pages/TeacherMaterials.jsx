import { useEffect, useState, useMemo, lazy, Suspense } from 'react';
import { BookMarked, Trash2, Download, ExternalLink, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import DashboardLayout from '@/shared/layouts/DashboardLayout';
import Card from '@/components/cards/Cards';
import { getMySchedule } from '../services/teacher.service';
import {
    getMyMaterials,
    getMaterialsBySubject,
    deleteMaterial,
    uploadMaterial,
    addLinkMaterial,
} from '@/modules/materials/services/material.service';
import {
    getFileTypeConfig,
    formatFileSize,
} from '@/modules/materials/constants/materials.config';

const UploadMaterialForm = lazy(() => import('../components/UploadMaterialForm'));

const TeacherMaterials = () => {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [showUpload, setShowUpload] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const [matRes, schedRes] = await Promise.all([
                    getMyMaterials(),
                    getMySchedule(),
                ]);
                setMaterials(matRes.data || []);

                const uniqueSubjects = {};
                (schedRes.data || []).forEach((s) => {
                    if (s.subject?._id) {
                        uniqueSubjects[s.subject._id] = s.subject;
                    }
                });
                setSubjects(Object.values(uniqueSubjects));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filteredMaterials = useMemo(() => {
        if (selectedSubject === 'all') return materials;
        return materials.filter((m) => m.subject?._id === selectedSubject);
    }, [materials, selectedSubject]);

    const handleUpload = async ({ type, data }) => {
        try {
            if (type === 'file') {
                await uploadMaterial(data);
            } else {
                await addLinkMaterial(data);
            }
            toast.success('Material added successfully');
            setShowUpload(false);
            const res = await getMyMaterials();
            setMaterials(res.data || []);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add material');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this material?')) return;
        try {
            await deleteMaterial(id);
            setMaterials((prev) => prev.filter((m) => m._id !== id));
            toast.success('Material deleted');
        } catch (err) {
            toast.error('Failed to delete material');
        }
    };

    const handleDownload = (material) => {
        if (material.fileUrl) {
            window.open(material.fileUrl, '_blank');
        } else if (material.filePath) {
            window.open(material.filePath, '_blank');
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="p-6 space-y-4">
                    <div className="h-8 w-48 bg-gray-100 border border-gray-200" />
                    <div className="h-64 bg-gray-100 border border-gray-200" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <Card
                        title="Materials Library"
                        subtitle="Upload and manage teaching materials for your subjects."
                        actions={
                            <button
                                onClick={() => setShowUpload(true)}
                                className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
                            >
                                <Plus size={14} />
                                Add Material
                            </button>
                        }
                    />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3">
                    <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-900 transition-colors bg-white"
                    >
                        <option value="all">All Subjects</option>
                        {subjects.map((s) => (
                            <option key={s._id} value={s._id}>
                                {s.subjectCode} — {s.subjectName}
                            </option>
                        ))}
                    </select>
                    <span className="text-xs text-gray-500">
                        {filteredMaterials.length} material{filteredMaterials.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {/* Materials Table */}
                <Card>
                    {filteredMaterials.length === 0 ? (
                        <div className="p-10 text-center">
                            <BookMarked size={40} className="mx-auto mb-3 text-gray-300" />
                            <p className="text-sm text-gray-500">No materials yet</p>
                            <p className="text-xs text-gray-400 mt-1">
                                Click "Add Material" to upload files or add links.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="text-left px-5 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-12">
                                            Type
                                        </th>
                                        <th className="text-left px-5 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                                            Title
                                        </th>
                                        <th className="text-left px-5 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                                            Subject
                                        </th>
                                        <th className="text-left px-5 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="text-center px-5 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-20">
                                            Size
                                        </th>
                                        <th className="text-center px-5 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-20">
                                            Downloads
                                        </th>
                                        <th className="text-right px-5 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-24">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredMaterials.map((mat) => {
                                        const typeConfig = getFileTypeConfig(mat.fileType);
                                        const TypeIcon = typeConfig.icon;
                                        return (
                                            <tr key={mat._id} className="hover:bg-gray-50/50">
                                                <td className="px-5 py-3">
                                                    <div
                                                        className={`w-8 h-8 flex items-center justify-center border ${typeConfig.bgColor} ${typeConfig.borderColor} ${typeConfig.color}`}
                                                    >
                                                        <TypeIcon size={14} />
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <p className="text-sm font-medium text-gray-900 truncate max-w-[250px]">
                                                        {mat.title}
                                                    </p>
                                                    {mat.description && (
                                                        <p className="text-[11px] text-gray-500 truncate max-w-[250px] mt-0.5">
                                                            {mat.description}
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="px-5 py-3">
                                                    <span className="text-xs text-gray-600">
                                                        {mat.subject?.subjectCode || '—'}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <span className="text-[11px] font-medium text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5">
                                                        {mat.category}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3 text-center text-xs text-gray-500">
                                                    {mat.fileSize ? formatFileSize(mat.fileSize) : '—'}
                                                </td>
                                                <td className="px-5 py-3 text-center text-xs text-gray-500">
                                                    {mat.downloads}
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <button
                                                            onClick={() => handleDownload(mat)}
                                                            className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors"
                                                            title="Open / Download"
                                                        >
                                                            {mat.fileUrl ? (
                                                                <ExternalLink size={14} />
                                                            ) : (
                                                                <Download size={14} />
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(mat._id)}
                                                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
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

            {/* Upload Modal */}
            {showUpload && (
                <Suspense fallback={null}>
                    <UploadMaterialForm
                        subjects={subjects}
                        onSubmit={handleUpload}
                        onClose={() => setShowUpload(false)}
                    />
                </Suspense>
            )}
        </DashboardLayout>
    );
};

export default TeacherMaterials;
