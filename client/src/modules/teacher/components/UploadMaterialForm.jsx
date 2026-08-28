import { useState } from 'react';
import { Upload, Link2, X } from 'lucide-react';
import { CATEGORY_OPTIONS } from '@/modules/materials/constants/materials.config';

const UploadMaterialForm = ({ subjects, onSubmit, onClose }) => {
    const [mode, setMode] = useState('file');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [subject, setSubject] = useState('');
    const [category, setCategory] = useState('Other');
    const [file, setFile] = useState(null);
    const [url, setUrl] = useState('');
    const [dragActive, setDragActive] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !subject) return;
        if (mode === 'file' && !file) return;
        if (mode === 'link' && !url) return;

        setSubmitting(true);
        try {
            if (mode === 'file') {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('title', title);
                formData.append('description', description);
                formData.append('subject', subject);
                formData.append('category', category);
                await onSubmit({ type: 'file', data: formData });
            } else {
                await onSubmit({
                    type: 'link',
                    data: { url, title, description, subject, category },
                });
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 z-[120] flex items-center justify-center p-4">
            <div className="bg-white border border-gray-200 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                    <h2 className="text-base font-semibold text-gray-900">
                        Add Material
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-gray-900 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Mode Toggle */}
                <div className="px-5 pt-4">
                    <div className="flex gap-0 border border-gray-200">
                        <button
                            onClick={() => setMode('file')}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium transition-colors ${
                                mode === 'file'
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <Upload size={13} />
                            Upload File
                        </button>
                        <button
                            onClick={() => setMode('link')}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium transition-colors ${
                                mode === 'link'
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <Link2 size={13} />
                            Add Link
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Title *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Introduction to Algorithms - 3rd Ed."
                            className="w-full border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-900 transition-colors"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Optional notes about this material..."
                            rows={2}
                            className="w-full border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-900 transition-colors resize-none"
                        />
                    </div>

                    {/* Subject + Category */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Subject *
                            </label>
                            <select
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-900 transition-colors bg-white"
                                required
                            >
                                <option value="">Select subject</option>
                                {subjects.map((s) => (
                                    <option key={s._id} value={s._id}>
                                        {s.subjectCode} — {s.subjectName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-900 transition-colors bg-white"
                            >
                                {CATEGORY_OPTIONS.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* File Upload */}
                    {mode === 'file' && (
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                File *
                            </label>
                            <div
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                className={`border-2 border-dashed p-6 text-center transition-colors ${
                                    dragActive
                                        ? 'border-gray-900 bg-gray-50'
                                        : 'border-gray-200 hover:border-gray-400'
                                }`}
                            >
                                {file ? (
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-900">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {(file.size / 1024 / 1024).toFixed(1)} MB
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setFile(null)}
                                            className="text-xs text-red-500 hover:text-red-700 mt-1"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        <Upload size={24} className="mx-auto text-gray-400" />
                                        <p className="text-sm text-gray-500">
                                            Drag and drop or{' '}
                                            <label className="text-gray-900 font-medium cursor-pointer hover:underline">
                                                browse
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    onChange={handleFileChange}
                                                    accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.mp4,.zip,.rar"
                                                />
                                            </label>
                                        </p>
                                        <p className="text-[10px] text-gray-400">
                                            PDF, DOC, PPT, Images, Video, Archive (max 50MB)
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Link URL */}
                    {mode === 'link' && (
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                URL *
                            </label>
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://youtube.com/... or https://docs.google.com/..."
                                className="w-full border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-900 transition-colors"
                                required
                            />
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors disabled:opacity-50"
                        >
                            {submitting ? 'Adding...' : 'Add Material'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadMaterialForm;
