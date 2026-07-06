import { useState } from "react";
import PrimaryButton from "../buttons/PrimaryButton";

const FormActions = ({
    loading = false,
    submitLabel = "Save",
    cancelLabel,
    onCancel,
}) => {
    const [cancelHovered, setCancelHovered] = useState(false);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
                marginTop: 24,
            }}
        >
            {onCancel && (
                <button
                    type="button"
                    onClick={onCancel}
                    onMouseEnter={() => setCancelHovered(true)}
                    onMouseLeave={() => setCancelHovered(false)}
                    style={{
                        padding: "10px 24px",
                        borderRadius: 100,
                        border: "1px solid #DADCE0",
                        background: cancelHovered ? "#F1F3F4" : "#FFFFFF",
                        color: "#5F6368",
                        cursor: "pointer",
                        fontWeight: 500,
                        fontSize: "0.875rem",
                        transition: "all 0.2s",
                        outline: "none",
                    }}
                >
                    {cancelLabel || "Cancel"}
                </button>
            )}

            <PrimaryButton
                type="submit"
                loading={loading}
            >
                {submitLabel}
            </PrimaryButton>
        </div>
    );
};

export default FormActions;