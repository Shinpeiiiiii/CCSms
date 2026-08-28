import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const SortSelect = ({ value, onChange, options }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const current = options.find(o => o.value === value);

    useEffect(() => {
        if (!open) return;
        const handleClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [open]);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
                <span>{current?.label}</span>
                <ChevronDown size={14} />
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-1.5 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10"
                    >
                        {options.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => { onChange({ target: { value: opt.value } }); setOpen(false); }}
                                className={`w-full text-left px-3 py-1.5 text-sm transition-colors ${
                                    value === opt.value ? 'bg-gray-50 text-gray-900 font-medium' : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SortSelect;
