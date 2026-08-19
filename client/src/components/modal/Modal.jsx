import { useEffect } from "react";
import { X } from "lucide-react";

const Modal = ({
    isOpen,
    onClose = () => {},
    title,
    children,
    footer,
    size = "md",
}) => {
    const handleClose = () => {
        if (typeof onClose === "function") {
            onClose();
        }
    };

    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                handleClose();
            }
        };

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, handleClose]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: "max-w-[440px]",
        md: "max-w-[680px]",
        lg: "max-w-[900px]",
        xl: "max-w-[1140px]",
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/32 backdrop-blur-sm p-4">
            <div
                className={`w-full bg-white border border-zinc-200 rounded-2xl shadow-lg overflow-hidden flex flex-col ${sizeClasses[size] || sizeClasses.md}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-[18px]">
                    <h2 className="font-sora text-xl font-bold text-zinc-900 m-0">
                        {title}
                    </h2>

                    <button
                        onClick={handleClose}
                        className="bg-transparent border-none text-zinc-500 w-8 h-8 rounded-full inline-flex items-center justify-center cursor-pointer transition-all hover:bg-zinc-100 hover:text-zinc-900"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-6 overflow-y-auto max-h-[calc(100vh-200px)] text-zinc-700">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="border-t border-zinc-200 px-6 py-4 flex justify-end gap-3">
                        {footer}
                    </div>
                )}
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.97); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default Modal;
