import { Trash2 } from "lucide-react";

const BulkActionBar = ({
    selectedCount,
    onClear,
    actions = [],
}) => {
    if (!selectedCount) return null;

    return (
        <div className="flex items-center gap-3 px-5 py-2.5 mb-3 rounded-xl border border-indigo-300/30 bg-gradient-to-br from-indigo-50 to-indigo-100 text-sm">
            <span className="font-semibold text-indigo-700 bg-indigo-200 px-2.5 py-0.5 rounded-full text-[13px]">
                {selectedCount} selected
            </span>

            <div className="flex items-center gap-2 ml-auto">
                {actions.map((action, index) => {
                    const Icon = action.icon || Trash2;
                    return (
                        <button
                            key={index}
                            onClick={action.onClick}
                            disabled={action.disabled}
                            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-medium text-white border-none cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                action.variant === "danger"
                                    ? "bg-red-600 hover:bg-red-700"
                                    : "bg-indigo-500 hover:bg-indigo-600"
                            }`}
                        >
                            <Icon size={14} />
                            {action.label}
                        </button>
                    );
                })}

                <button
                    onClick={onClear}
                    className="flex items-center px-3 py-1.5 rounded-lg border border-zinc-300 bg-white text-[13px] font-medium text-zinc-600 cursor-pointer transition-colors hover:bg-zinc-100"
                >
                    Clear
                </button>
            </div>
        </div>
    );
};

export default BulkActionBar;
