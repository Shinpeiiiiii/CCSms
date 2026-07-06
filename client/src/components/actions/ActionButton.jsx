import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

const ActionButtons = ({
    onEdit,
    onDelete,
    editLabel = "Edit",
    deleteLabel = "Delete",
}) => {
    const [editHovered, setEditHovered] = useState(false);
    const [deleteHovered, setDeleteHovered] = useState(false);

    return (
        <div style={{ display: 'flex', gap: 10 }}>
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

            <button
                onClick={onDelete}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: '6px 14px',
                    borderRadius: 100,
                    border: '1px solid #FAD2CF',
                    background: deleteHovered 
                        ? '#FCE8E6' 
                        : 'transparent',
                    color: '#C5221F', // darker red for readability on light bg
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                }}
                onMouseEnter={() => setDeleteHovered(true)}
                onMouseLeave={() => setDeleteHovered(false)}
            >
                <Trash2 size={13} />
                <span>{deleteLabel}</span>
            </button>
        </div>
    );
};

export default ActionButtons;