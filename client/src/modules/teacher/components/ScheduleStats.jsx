import { BookOpen, Calendar, Clock } from 'lucide-react';

const STAT_CONFIG = [
    { key: 'uniqueSubjects', label: 'Subjects', icon: BookOpen },
    { key: 'uniqueSections', label: 'Sections', icon: Calendar },
    { key: 'totalUnits', label: 'Total Units', icon: Clock },
];

const ScheduleStats = ({ stats }) => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STAT_CONFIG.map(({ key, label, icon: Icon }) => (
            <div key={key} className="bg-white border border-gray-200 p-5">
                <div className="flex items-center gap-3">
                    <Icon size={18} className="text-gray-400" />
                    <div>
                        <p className="text-[11px] text-gray-500 uppercase tracking-wide font-medium">{label}</p>
                        <p className="text-xl font-bold text-gray-900">{stats[key]}</p>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

export default ScheduleStats;
