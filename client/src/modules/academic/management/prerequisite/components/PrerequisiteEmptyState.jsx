import { SearchX } from "lucide-react";

const PrerequisiteEmptyState = ({ search, onAdd }) => {
    return (
        <div
            style={{
                padding: "56px 24px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "#FFFFFF",
                borderRadius: "12px",
                border: "1px solid #E4E4E7",
            }}
        >
            <div
                style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "16px",
                    background: "#F4F4F5",
                    color: "#71717A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                }}
            >
                <SearchX size={26} strokeWidth={1.8} />
            </div>
            <h3
                style={{
                    fontFamily: "Sora, sans-serif",
                    fontSize: "1.125rem",
                    fontWeight: 700,
                    color: "#18181B",
                    margin: "0 0 6px 0",
                }}
            >
                No Prerequisites Found
            </h3>
            <p
                style={{
                    fontSize: "0.875rem",
                    color: "#71717A",
                    maxWidth: "380px",
                    margin: "0 0 20px 0",
                    lineHeight: 1.5,
                }}
            >
                {search
                    ? `No prerequisite rules match "${search}". Try adjusting your query or filter.`
                    : "There are currently no course prerequisite relationships established."}
            </p>
            <button
                onClick={onAdd}
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 18px",
                    background: "#18181B",
                    color: "#FFFFFF",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    transition: "opacity 0.2s",
                }}
            >
                Add First Prerequisite
            </button>
        </div>
    );
};

export default PrerequisiteEmptyState;
