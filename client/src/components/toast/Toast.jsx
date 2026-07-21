// components/Toast.jsx
import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'; // or use inline SVGs

const icons = {
  success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
  error: <AlertCircle className="w-5 h-5 text-red-400" />,
  info: <Info className="w-5 h-5 text-sky-400" />
};

export const Toast = ({ message, type = 'info', onDismiss, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl shadow-black/20 animate-in slide-in-from-right-4 fade-in duration-300">
      {icons[type]}
      <p className="text-sm text-slate-200 font-medium">{message}</p>
      <button 
        onClick={onDismiss}
        className="ml-2 p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};