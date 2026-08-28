import { ChevronLeft, X } from 'lucide-react';

const PanelHeader = ({ onBack, onClose, children }) => (
    <div className="bg-gray-50 px-5 pt-5 pb-4 border-b border-gray-200 shrink-0">
        <div className="flex items-center justify-between mb-4">
            <button
                onClick={onBack}
                className="flex items-center gap-1.5 pl-2.5 pr-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
                <ChevronLeft size={16} />
                Back to Classes
            </button>
            <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors"
            >
                <X size={16} />
            </button>
        </div>
        {children}
    </div>
);

export default PanelHeader;
