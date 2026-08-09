import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const SIZE_STYLES = {
    sm: "px-4 py-2 text-[11px] gap-2",
    md: "px-5 py-2.5 text-xs gap-2",
    lg: "px-6 py-3 text-sm gap-2.5",
};

const VARIANT_STYLES = {
    primary: {
        base: "bg-[#111111] text-[#F5F5F5] border-[#2A2A2A]",
        hover:
            "hover:bg-[#181818] hover:border-[#3A3A3A] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.04)]",
        active: "active:bg-[#0D0D0D]",
    },

    outline: {
        base: "bg-transparent text-white border-[#2F2F2F]",
        hover: "hover:bg-white/5 hover:border-[#505050]",
        active: "active:bg-white/10",
    },

    ghost: {
        base: "bg-transparent text-[#D4D4D4] border-transparent",
        hover: "hover:bg-white/5",
        active: "active:bg-white/10",
    },

    destructive: {
        base: "bg-[#B91C1C] text-white border-[#B91C1C]",
        hover: "hover:bg-[#991B1B]",
        active: "active:bg-[#7F1D1D]",
    },
};

const PrimaryButton = forwardRef(
    (
        {
            children,
            type = "button",
            onClick,
            disabled = false,
            loading = false,
            loadingText = "Loading...",
            variant = "primary",
            size = "md",
            icon: Icon,
            iconPosition = "left",
            fullWidth = false,
            className = "",
            ...props
        },
        ref
    ) => {
        const isDisabled = disabled || loading;

        const styles =
            VARIANT_STYLES[variant] ?? VARIANT_STYLES.primary;

        const sizeClasses =
            SIZE_STYLES[size] ?? SIZE_STYLES.md;

        return (
            <motion.button
                ref={ref}
                type={type}
                onClick={onClick}
                disabled={isDisabled}
                aria-disabled={isDisabled}
                aria-busy={loading}
                whileHover={
                    !isDisabled
                        ? {
                              y: -1,
                          }
                        : undefined
                }
                whileTap={
                    !isDisabled
                        ? {
                              scale: 0.985,
                          }
                        : undefined
                }
                transition={{
                    duration: 0.18,
                    ease: "easeOut",
                }}
                className={cn(
                    "inline-flex items-center justify-center",
                    "select-none shrink-0 whitespace-nowrap",
                    "border",

                    "font-medium uppercase",
                    "tracking-[0.18em]",
                    "leading-none",

                    "transition-all duration-200 ease-out",

                    "focus-visible:outline-none",
                    "focus-visible:ring-1",
                    "focus-visible:ring-white/20",

                    sizeClasses,

                    fullWidth ? "w-full" : "w-fit",

                    !isDisabled && [
                        styles.base,
                        styles.hover,
                        styles.active,
                        "cursor-pointer",
                    ],

                    isDisabled &&
                        "bg-[#181818] text-[#7A7A7A] border-[#262626] cursor-not-allowed",

                    className
                )}
                {...props}
            >
                {loading ? (
                    <>
                        <Loader2
                            size={14}
                            strokeWidth={2}
                            className="animate-spin"
                        />
                        <span>{loadingText}</span>
                    </>
                ) : (
                    <>
                        {Icon && iconPosition === "left" && (
                            <Icon
                                size={14}
                                strokeWidth={1.8}
                                className="opacity-90"
                            />
                        )}

                        <span>{children}</span>

                        {Icon && iconPosition === "right" && (
                            <Icon
                                size={14}
                                strokeWidth={1.8}
                                className="opacity-90"
                            />
                        )}
                    </>
                )}
            </motion.button>
        );
    }
);

PrimaryButton.displayName = "PrimaryButton";

export default PrimaryButton;