import { useEffect, useState, useMemo } from 'react';
import { BookMarked, Download, ExternalLink, ArrowLeft, BookOpen } from 'lucide-react';
import DashboardLayout from '@/shared/layouts/DashboardLayout';
import Card from '@/components/cards/Cards';
import { getStudentMaterials } from '@/modules/materials/services/material.service';
import {
    getFileTypeConfig,
    formatFileSize,
    CATEGORY_OPTIONS,
} from '@/modules/materials/constants/materials.config';

const StudentMaterials = () => {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('all');

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getStudentMaterials();
                setMaterials(res.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const subjectGroups = useMemo(() => {
        const groups = {};
        materials.forEach((m) => {
            const key = m.subject?._id;
            if (!key) return;
            if (!groups[key]) {
                groups[key] = {
                    subject: m.subject,
                    materials: [],
                };
            }
            groups[key].materials.push(m);
        });
        return Object.values(groups);
    }, [materials]);

    const filteredMaterials = useMemo(() => {
        if (!selectedSubject) return [];
        const group = subjectGroups.find(
            (g) => g.subject?._id === selectedSubject
        );
        if (!group) return [];
        if (categoryFilter === 'all') return group.materials;
        return group.materials.filter((m) => m.category === categoryFilter);
    }, [selectedSubject, subjectGroups, categoryFilter]);

    const selectedGroup = subjectGroups.find(
        (g) => g.subject?._id === selectedSubject
    );

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
                    <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-28 bg-gray-100 border border-gray-200" />
                        ))}
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // Materials list view
    if (selectedSubject && selectedGroup) {
        return (
            <DashboardLayout>
                <div className="p-6 space-y-6">
                    {/* Back */}
                    <button
                        onClick={() => {
                            setSelectedSubject(null);
                            setCategoryFilter('all');
                        }}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Subjects
                    </button>

                    {/* Header */}
                    <Card
                        title={`${selectedGroup.subject?.subjectCode} — ${selectedGroup.subject?.subjectName}`}
                        subtitle={`${selectedGroup.materials.length} material${selectedGroup.materials.length !== 1 ? 's' : ''} available`}
                    />

                    {/* Category Filter */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            onClick={() => setCategoryFilter('all')}
                            className={`px-3 py-1 text-xs font-medium border transition-colors ${
                                categoryFilter === 'all'
                                    ? 'bg-gray-900 text-white border-gray-900'
                                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            All
                        </button>
                        {CATEGORY_OPTIONS.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategoryFilter(cat)}
                                className={`px-3 py-1 text-xs font-medium border transition-colors ${
                                    categoryFilter === cat
                                        ? 'bg-gray-900 text-white border-gray-900'
                                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Materials Table */}
                    <Card>
                        {filteredMaterials.length === 0 ? (
                            <div className="p-10 text-center">
                                <BookMarked size={32} className="mx-auto mb-2 text-gray-300" />
                                <p className="text-sm text-gray-500">No materials found</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {filteredMaterials.map((mat) => {
                                    const typeConfig = getFileTypeConfig(mat.fileType);
                                    const TypeIcon = typeConfig.icon;
                                    return (
                                        <div
                                            key={mat._id}
                                            className="px-5 py-4 flex items-center gap-4"
                                        >
                                            <div
                                                className={`w-10 h-10 flex items-center justify-center border shrink-0 ${typeConfig.bgColor} ${typeConfig.borderColor} ${typeConfig.color}`}
                                            >
                                                <TypeIcon size={16} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {mat.title}
                                                </p>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                                    <span className="font-medium text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5">
                                                        {mat.category}
                                                    </span>
                                                    {mat.fileSize > 0 && (
                                                        <span>{formatFileSize(mat.fileSize)}</span>
                                                    )}
                                                    {mat.fileUrl && (
                                                        <span className="truncate max-w-[200px]">
                                                            {mat.fileUrl}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDownload(mat)}
                                                className="flex items-center gap-1.5 bg-gray-900 text-white px-3 py-1.5 text-xs font-medium hover:bg-gray-800 transition-colors shrink-0"
                                            >
                                                {mat.fileUrl ? (
                                                    <>
                                                        <ExternalLink size={12} />
                                                        Open
                                                    </>
                                                ) : (
                                                    <>
                                                        <Download size={12} />
                                                        Download
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </Card>
                </div>
            </DashboardLayout>
        );
    }

    // Subject cards view
    return (
        <DashboardLayout>
            <div className="p-6 space-y-6">
                <Card
                    title="Materials Library"
                    subtitle="Browse materials for your enrolled subjects."
                />

                {subjectGroups.length === 0 ? (
                    <Card>
                        <div className="p-10 text-center">
                            <BookOpen size={40} className="mx-auto mb-3 text-gray-300" />
                            <p className="text-sm text-gray-500">No materials available</p>
                            <p className="text-xs text-gray-400 mt-1">
                                Materials shared by your teachers will appear here.
                            </p>
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {subjectGroups.map((group) => (
                            <button
                                key={group.subject?._id}
                                onClick={() => setSelectedSubject(group.subject?._id)}
                                className="bg-white border border-gray-200 p-5 text-left hover:bg-gray-50 transition-colors group"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="bg-gray-900 text-white w-10 h-10 flex items-center justify-center text-xs font-bold shrink-0">
                                        {group.subject?.subjectCode?.slice(0, 4) || '—'}
                                    </div>
                                    <span className="text-[10px] font-medium text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5">
                                        {group.materials.length} material{group.materials.length !== 1 ? 's' : ''}
                                    </span>
                                </div>
                                <p className="text-sm font-semibold text-gray-900 mt-3">
                                    {group.subject?.subjectName || '—'}
                                </p>
                                <p className="text-[10px] text-gray-400 group-hover:text-gray-900 transition-colors mt-3">
                                    View materials →
                                </p>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default StudentMaterials;
