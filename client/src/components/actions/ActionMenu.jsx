import { useState, useRef, useEffect } from "react";
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

const ActionMenu = ({ actions = [] }) => {
    const [open, setOpen] = useState(false);

    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
    }, []);

    return (
        <div
            ref={menuRef}
            style={{
                position: "relative",
                display: "inline-block",
            }}
        >
            <button
                onClick={() => setOpen(!open)}
                style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    border: "1px solid #E5E7EB",
                    background: "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <MoreVertical size={18} />
            </button>

            {open && (
                <div
                    style={{
                        position: "absolute",
                        right: 0,
                        top: 42,
                        minWidth: 180,
                        background: "#fff",
                        border: "1px solid #E5E7EB",
                        borderRadius: 10,
                        boxShadow:
                            "0 8px 25px rgba(0,0,0,.12)",
                        overflow: "hidden",
                        zIndex: 999,
                    }}
                >
                    {actions.map((action, index) => {
                        const Icon =
                            iconMap[action.icon] ||
                            MoreVertical;

                        return (
                            <button
                                key={index}
                                onClick={() => {
                                    setOpen(false);
                                    action.onClick();
                                }}
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    padding: "11px 16px",
                                    border: "none",
                                    background: "white",
                                    cursor: "pointer",
                                    fontSize: 14,
                                    textAlign: "left",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.background =
                                        "#F3F4F6")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.background =
                                        "#fff")
                                }
                            >
                                <Icon size={16} />

                                {action.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ActionMenu;