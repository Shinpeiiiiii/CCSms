import { useState, useRef } from "react";
import { Pencil } from "lucide-react";
import { SecondaryButton } from "../buttons";
import TrashIcon from "../movingicons/trashIcon";

const ActionButtons = ({
    onEdit,
    onDelete,
    editLabel = "Edit",
    deleteLabel = "Delete",
    onHistory,
    customButtons = [],
}) => {
    const [editHovered, setEditHovered] = useState(false);
    const [deleteHovered, setDeleteHovered] = useState(false);
    const trashIconRef = useRef(null);
    return (
        <div style={{ display: 'flex', gap: 10, flexWrap: "wrap", alignItems: "center"}}>
            {onEdit && (
                <button
                    onClick={onEdit}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        padding: '6px 14px',
                        borderRadius: 100,
                        border: '1px solid #FFE082',
                        background: editHovered 
                            ? '#FFF8E1' 
                            : 'transparent',
                        color: '#B06000', // darker amber for readability on light bg
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={() => setEditHovered(true)}
                    onMouseLeave={() => setEditHovered(false)}
                >
                    <Pencil size={13} />
                    <span>{editLabel}</span>
                </button>
            )}
            
            {onHistory && (
                <SecondaryButton onClick={onHistory}>
                    History
                </SecondaryButton>
            )}

            {customButtons.map((button, index) => {
                const Icon = button.icon;

                return(
                    <button
                        key={index}
                        onClick={button.onClick}
                        disabled={button.disabled}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                            padding: "6px 14px",
                            borderRadius: 100,

                            border: `1px solid ${button.borderColor || "#DADCE0"}`,
                            background: button.background || "transparent",
                            color: button.color || "#202124",

                            fontSize: "0.8125rem",
                            fontWeight: 600,

                            cursor: button.disabled
                                ? "not-allowed"
                                : "pointer",

                            opacity: button.disabled ? 0.5 : 1,

                            transition: "0.2s",
                        }}
                    >

                        {Icon && <Icon size={13} />}

                        <span>{button.label}</span>

                    </button>
                )
            })}  
            {onDelete && (
                <button
                    onClick={onDelete}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        padding: "6px 14px",
                        borderRadius: 100,
                        border: "1px solid #FAD2CF",
                        background: deleteHovered
                            ? "#FCE8E6"
                            : "transparent",
                        color: "#C5221F",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "0.2s",
                    }}
                    onMouseEnter={() => {
                        setDeleteHovered(true);
                        trashIconRef.current?.startAnimation();
                    }}
                    onMouseLeave={() => {
                        setDeleteHovered(false);
                        trashIconRef.current?.stopAnimation();
                    }}
                >
                    <TrashIcon
                        ref={trashIconRef}
                        size={13}
                    />

                    <span>{deleteLabel}</span>

                </button>
            )}
        </div>
    );
};

export default ActionButtons;