import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const PrimaryButton = forwardRef(
    (
        {
            children,
            type = "button",
            onClick,
            disabled = false,
            loading = false,
            className = "",
            ...props
        },
        ref
    ) => {
        const isDisabled = disabled || loading;

        return (
            <button
                ref={ref}
                type={type}
                onClick={onClick}
                disabled={isDisabled}
                className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 shrink-0 whitespace-nowrap w-fit self-center",
                    "text-sm font-semibold transition-all duration-200 ease-out border",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5]/30 focus-visible:ring-offset-2",
                    !isDisabled &&
                        "bg-white text-[#3C4043] border-[#DADCE0] shadow-[0_1px_2px_rgba(60,64,67,0.08)] hover:shadow-[0_1px_3px_rgba(60,64,67,0.15),0_1px_2px_rgba(60,64,67,0.10)] hover:border-[#C6C9CC] active:bg-[#F8F9FA] active:shadow-none cursor-pointer",
                    isDisabled &&
                        "bg-white text-gray-400 border-gray-200 shadow-none cursor-not-allowed",
                    className
                )}
                {...props}
            >
                {loading ? (
                    <>
                        <Loader2 size={16} className="animate-spin text-[#185FA5]" />
                        <span>Loading...</span>
                    </>
                ) : (
                    children
                )}
            </button>
        );
    }
);

PrimaryButton.displayName = "PrimaryButton";

export default PrimaryButton;