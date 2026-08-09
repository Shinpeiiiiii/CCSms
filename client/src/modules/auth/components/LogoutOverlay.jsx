import { Loader2 } from 'lucide-react';

const LogoutOverlay = () => {
  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-[99999] animate-[fadeIn_0.2s_ease-in-out]">
      <div className="bg-white border border-slate-200 px-10 py-8 rounded-xl flex flex-col items-center gap-4 w-[90%] max-w-[320px] shadow-sm animate-[scaleIn_0.2s_ease-in-out]">
        {/* Spinner */}
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
          <Loader2 size={20} className="animate-spin" strokeWidth={1.75} />
        </div>

        <div>
          <h3 className="font-sora text-base font-semibold text-slate-900 m-0 tracking-[-0.01em]">
            Signing Out
          </h3>
          <p className="text-slate-400 text-sm mt-1.5 mb-0">
            Securing your session...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogoutOverlay;