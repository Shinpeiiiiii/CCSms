import { Search } from 'lucide-react';

const PanelSearchInput = ({ value, onChange, placeholder = 'Search...' }) => (
    <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all"
        />
    </div>
);

export default PanelSearchInput;
