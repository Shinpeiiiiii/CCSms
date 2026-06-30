import PrimaryButton from "../buttons/PrimaryButton";


const FormActions = ({
    loading = false,
    submitLabel = "Save",
    cancelLabel,
    onCancel,
}) => {

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
                    style={{
                        padding: "10px 24px",
                        borderRadius: 100,
                        border: "1px solid rgba(255,255,255,.12)",
                        background: "transparent",
                        color: "#CBD5E1",
                        cursor: "pointer",
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