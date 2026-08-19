import { MoreVertical } from "lucide-react";
import { useState } from "react";

const ActionDropdown = ({
    curriculum,
    onEdit,
    onPublish,
    onArchive,
}) => {

    const [open, setOpen] = useState(false);

    return (

        <div
            style={{
                position: "relative",
            }}
        >

            <button

                onClick={() => setOpen(!open)}

                style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                }}

            >

                <MoreVertical size={18} />

            </button>

            {
                open && (

                    <div

                        style={{

                            position: "absolute",
                            right: 0,
                            top: 28,
                            width: 180,
                            background: "#fff",
                            border: "1px solid #ddd",
                            borderRadius: 10,
                            boxShadow: "0 10px 30px rgba(0,0,0,.1)",
                            zIndex: 100,

                        }}

                    >

                        {
                            curriculum.status === "Draft" && (
                                <>
                                    <MenuItem
                                        onClick={onEdit}
                                    >
                                        Edit
                                    </MenuItem>

                                    <MenuItem
                                        onClick={onPublish}
                                    >
                                        Publish
                                    </MenuItem>

                                    <MenuItem
                                        onClick={onArchive}
                                    >
                                        Archive
                                    </MenuItem>
                                </>
                            )
                        }

                        {
                            curriculum.status === "Published" && (
                                <MenuItem
                                    onClick={onArchive}
                                >
                                    Archive
                                </MenuItem>
                            )
                        }

                    </div>

                )
            }

        </div>

    );

};

const MenuItem = ({
    children,
    onClick,
}) => (

    <button

        onClick={onClick}

        style={{

            width: "100%",
            padding: "12px 16px",
            background: "white",
            border: "none",
            cursor: "pointer",
            textAlign: "left",

        }}

    >

        {children}

    </button>

);

export default ActionDropdown;