import { Bell, Check, CheckCheck, Trash2, Info, AlertTriangle, CheckCircle, BookOpen } from 'lucide-react';
import { toast } from 'react-toastify';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '@/shared/layouts/DashboardLayout';
import Card from '@/components/cards/Cards';
import { getMyNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification, getUnreadNotificationCount } from '../services/teacher.service';
import { QUERY_KEYS } from '@/constants/queryKey';

const TYPE_CONFIG = {
    info: { icon: Info, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    warning: { icon: AlertTriangle, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    success: { icon: CheckCircle, color: 'text-green-600 bg-green-50 border-green-200' },
    assignment: { icon: BookOpen, color: 'text-purple-600 bg-purple-50 border-purple-200' },
};

const formatRelativeTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const Notifications = () => {
    const queryClient = useQueryClient();

    const { data: notifications = [], isLoading: loading } = useQuery({
        queryKey: QUERY_KEYS.NOTIFICATIONS,
        queryFn: getMyNotifications,
        select: (data) => data?.data || data || [],
    });

    const { data: unreadData = { count: 0 } } = useQuery({
        queryKey: QUERY_KEYS.UNREAD_NOTIFICATION_COUNT,
        queryFn: getUnreadNotificationCount,
        refetchInterval: 30000,
    });

    const unreadCount = unreadData?.count || 0;

    const invalidateAll = () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.UNREAD_NOTIFICATION_COUNT });
    };

    const markReadMutation = useMutation({
        mutationFn: markNotificationRead,
        onSuccess: invalidateAll,
    });

    const markAllReadMutation = useMutation({
        mutationFn: markAllNotificationsRead,
        onSuccess: () => {
            invalidateAll();
            toast.success('All notifications marked as read');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteNotification,
        onSuccess: invalidateAll,
    });

    const handleMarkRead = async (id) => {
        try {
            await markReadMutation.mutateAsync(id);
        } catch (err) {
            console.error(err);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllReadMutation.mutateAsync();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteMutation.mutateAsync(id);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="p-6 space-y-4">
                    <div className="h-8 w-48 bg-gray-100 border border-gray-200" />
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 bg-gray-100 border border-gray-200" />
                    ))}
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-6 space-y-6">
                {/* Header */}
                <Card
                    title="Notifications"
                    subtitle={unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up'}
                    actions={
                        unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="flex items-center gap-2 border border-gray-200 text-gray-700 px-3 py-1.5 text-xs font-medium hover:bg-gray-50 transition-colors"
                            >
                                <CheckCheck size={14} />
                                Mark all read
                            </button>
                        )
                    }
                />

                {/* Notification List */}
                <Card>
                    {notifications.length === 0 ? (
                        <div className="p-10 text-center">
                            <Bell size={40} className="mx-auto mb-3 text-gray-300" />
                            <p className="text-sm text-gray-500">No notifications yet</p>
                            <p className="text-xs text-gray-400 mt-1">You'll see updates about assignments and schedule changes here.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {notifications.map((notif) => {
                                const typeConf = TYPE_CONFIG[notif.type] || TYPE_CONFIG.info;
                                const Icon = typeConf.icon;

                                return (
                                    <div
                                        key={notif._id}
                                        className={`px-5 py-4 flex items-start gap-4 transition-colors ${
                                            !notif.read ? 'bg-blue-50/30' : ''
                                        }`}
                                    >
                                        <div className={`w-8 h-8 flex items-center justify-center shrink-0 border ${typeConf.color}`}>
                                            <Icon size={14} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className={`text-sm font-semibold ${notif.read ? 'text-gray-700' : 'text-gray-900'}`}>
                                                    {notif.title}
                                                </p>
                                                {!notif.read && (
                                                    <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                                            <p className="text-[11px] text-gray-400 mt-1">{formatRelativeTime(notif.createdAt)}</p>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            {!notif.read && (
                                                <button
                                                    onClick={() => handleMarkRead(notif._id)}
                                                    className="p-1.5 text-gray-400 hover:text-green-600 transition-colors"
                                                    title="Mark as read"
                                                >
                                                    <Check size={14} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(notif._id)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default Notifications;
