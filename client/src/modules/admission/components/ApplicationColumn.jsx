import { Eye, CheckCircle, XCircle, RotateCcw, Calendar, BookOpen } from 'lucide-react';

const ApplicationColumn = ({ onView, onApprove, onReject, onRevision, actionLoading }) => [
    {
        header: "Application No.",
        render: (app) => (
            <span style={{
                fontFamily: 'monospace',
                fontSize: 14,
                fontWeight: 600,
                color: '#2563EB',
                background: 'rgba(37,99,235,0.05)',
                padding: '2px 8px',
                borderRadius: 6,
                border: '1px solid rgba(37,99,235,0.1)',
            }}>
                {app.applicationNumber}
            </span>
        ),
    },
    {
        header: "Applicant",
        render: (app) => (
            <div>
                <span style={{ fontWeight: 500, color: '#202124', fontSize: 14 }}>
                    {app.lastName}, {app.firstName} {app.middleName ? `${app.middleName.charAt(0)}.` : ''}
                </span>
                <span style={{ color: '#5F6368', fontSize: 12, display: 'block' }}>{app.email}</span>
            </div>
        ),
    },
    {
        header: "Program",
        render: (app) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#3C4043' }}>
                <BookOpen size={16} style={{ color: '#9AA0A6', flexShrink: 0 }} />
                <span style={{ fontSize: 14, fontWeight: 500, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={app.program?.programName}>
                    {app.program?.programName || 'N/A'}
                </span>
            </div>
        ),
    },
    {
        header: "Student Type",
        render: (app) => {
            const type = app.studentType || 'Regular';
            const colors = {
                'Regular': { bg: 'rgba(16,185,129,0.1)', text: '#059669', border: 'rgba(16,185,129,0.2)' },
                'Transferee': { bg: 'rgba(139,92,246,0.1)', text: '#7C3AED', border: 'rgba(139,92,246,0.2)' },
                'Irregular': { bg: 'rgba(245,158,11,0.1)', text: '#D97706', border: 'rgba(245,158,11,0.2)' },
            };
            const c = colors[type] || colors['Regular'];
            return (
                <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '2px 10px',
                    borderRadius: 100,
                    fontSize: 12,
                    fontWeight: 500,
                    border: `1px solid ${c.border}`,
                    background: c.bg,
                    color: c.text,
                }}>
                    {type}
                </span>
            );
        },
    },
    {
        header: "Submitted",
        render: (app) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#5F6368', fontSize: 13 }}>
                <Calendar size={14} style={{ color: '#9AA0A6', flexShrink: 0 }} />
                <span>{new Date(app.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                })}</span>
            </div>
        ),
    },
    {
        header: "Actions",
        sortable: false,
        render: (app) => {
            const isProcessing = actionLoading === app._id;
            return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                    <button
                        onClick={() => onView(app)}
                        disabled={isProcessing}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '6px 12px',
                            borderRadius: 8,
                            border: '1px solid #DADCE0',
                            color: '#3C4043',
                            background: '#FFFFFF',
                            fontSize: 12,
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            opacity: isProcessing ? 0.5 : 1,
                        }}
                    >
                        <Eye size={13} style={{ color: '#5F6368' }} />
                        <span>View</span>
                    </button>
                    <button
                        onClick={() => onApprove(app._id)}
                        disabled={isProcessing}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '6px 12px',
                            borderRadius: 8,
                            border: 'none',
                            background: '#059669',
                            color: 'white',
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            opacity: isProcessing ? 0.5 : 1,
                        }}
                    >
                        <CheckCircle size={13} />
                        <span>Approve</span>
                    </button>
                    <button
                        onClick={() => onRevision(app._id)}
                        disabled={isProcessing}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '6px 12px',
                            borderRadius: 8,
                            border: 'none',
                            background: '#D97706',
                            color: 'white',
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            opacity: isProcessing ? 0.5 : 1,
                        }}
                    >
                        <RotateCcw size={13} />
                        <span>Revision</span>
                    </button>
                    <button
                        onClick={() => onReject(app._id)}
                        disabled={isProcessing}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '6px 12px',
                            borderRadius: 8,
                            border: 'none',
                            background: '#DC2626',
                            color: 'white',
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            opacity: isProcessing ? 0.5 : 1,
                        }}
                    >
                        <XCircle size={13} />
                        <span>Reject</span>
                    </button>
                </div>
            );
        },
    },
];

export default ApplicationColumn;
