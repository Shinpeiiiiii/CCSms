import { Check, X, AlertCircle, Clock } from 'lucide-react';

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const TIME_SLOTS = [
    '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00',
];

export const STATUS_OPTIONS = ['Present', 'Absent', 'Late', 'Excused'];

export const STATUS_COLORS = {
    Present: 'text-green-700 bg-green-50 border-green-200',
    Absent: 'text-red-700 bg-red-50 border-red-200',
    Late: 'text-amber-700 bg-amber-50 border-amber-200',
    Excused: 'text-blue-700 bg-blue-50 border-blue-200',
};

export const STATUS_COLORS_SOLID = {
    Present: 'text-green-600 bg-green-50 border-green-200',
    Absent: 'text-red-600 bg-red-50 border-red-200',
    Late: 'text-amber-600 bg-amber-50 border-amber-200',
    Excused: 'text-blue-600 bg-blue-50 border-blue-200',
};

export const STATUS_ICONS = {
    Present: Check,
    Absent: X,
    Late: AlertCircle,
    Excused: Clock,
};

export const formatTime = (t) => {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hour = parseInt(h, 10);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${m} ${suffix}`;
};

export const timeToIndex = (t) => {
    if (!t) return -1;
    return TIME_SLOTS.indexOf(t);
};

export const PANEL_WIDTH = 600;
export const SECONDARY_PANEL_WIDTH = 420;
