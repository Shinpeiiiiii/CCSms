import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import DotsVerticalIcon from "../movingicons/dotsVerticalIcon";

import {
    MoreVertical,
    Pencil,
    History,
    Archive,
    Trash2,
    Upload,
} from "lucide-react";

const iconMap = {
    edit: Pencil,
    history: History,
    archive: Archive,
    publish: Upload,
    delete: Trash2,
};

const MENU_WIDTH = 200;
const MENU_ITEM_HEIGHT = 44;
const GAP = 6;
const VIEWPORT_PADDING = 2;

const ActionMenu = ({ actions = [] }) => {
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState({ top: 0, left: 0 });

    const triggerRef = useRef(null);
    const menuRef = useRef(null);
    const dotsIconRef = useRef(null);

    const calculatePosition = useCallback(() => {
        if (!triggerRef.current) return;

        const rect = triggerRef.current.getBoundingClientRect();
        const viewportW = window.innerWidth;
        const viewportH = window.innerHeight;
        const menuH = actions.length * MENU_ITEM_HEIGHT + 16;

        let top = rect.bottom + GAP;
        let left = rect.right - MENU_WIDTH;

        if (top + menuH > viewportH - VIEWPORT_PADDING) {
            top = rect.top - GAP - menuH;
        }

        if (left < VIEWPORT_PADDING) {
            left = VIEWPORT_PADDING;
        }

        if (left + MENU_WIDTH > viewportW - VIEWPORT_PADDING) {
            left = viewportW - VIEWPORT_PADDING - MENU_WIDTH;
        }

        setPos({ top, left });
    }, [actions.length]);

    useEffect(() => {
        if (!open) return;

        calculatePosition();

        const handleReposition = () => calculatePosition();
        window.addEventListener("resize", handleReposition);
        window.addEventListener("scroll", handleReposition, true);

        return () => {
            window.removeEventListener("resize", handleReposition);
            window.removeEventListener("scroll", handleReposition, true);
        };
    }, [open, calculatePosition]);

    useEffect(() => {
        if (!open) return;

        const handleClickOutside = (e) => {
            if (
                triggerRef.current &&
                !triggerRef.current.contains(e.target) &&
                menuRef.current &&
                !menuRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };

        const handleEscape = (e) => {
            if (e.key === "Escape") setOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [open]);

    return (
        <>
            <div ref={triggerRef} className="relative inline-block">
                <button
                    onClick={() => setOpen(!open)}
                    onMouseEnter={() => dotsIconRef.current?.startAnimation?.()}
                    onMouseLeave={() => dotsIconRef.current?.stopAnimation?.()}
                    className="w-8 h-8 border border-gray-200 bg-white cursor-pointer flex items-center justify-center hover:bg-gray-50 hover:border-gray-900 transition-colors"
                >
                    <DotsVerticalIcon ref={dotsIconRef} size={16} />
                </button>
            </div>

            {open &&
                createPortal(
                    <div
                        ref={menuRef}
                        className="min-w-50 bg-white text-gray-800 border border-gray-200 shadow-md overflow-hidden z-999 p-1.5"
                        style={{
                            position: "fixed",
                            top: pos.top,
                            left: pos.left,
                        }}
                    >
                        {actions.map((action, index) => {
                            const Icon =
                                iconMap[action.icon] || MoreVertical;

                            return (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setOpen(false);
                                        action.onClick();
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 border-none bg-white text-gray-700 cursor-pointer text-[13px] text-left hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                >
                                    <Icon size={15} strokeWidth={1.75} />
                                    {action.label}
                                </button>
                            );
                        })}
                    </div>,
                    document.body
                )}
        </>
    );
};

export default ActionMenu;
