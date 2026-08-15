import { CheckCircle2 } from "lucide-react";
import ActionButtons from "../../../../../components/actions/ActionButton";

const PrerequisiteNodeCard = ({ item, onEdit, onDelete }) => {
    const subjectCode = item.subject?.subjectCode || "—";
    const subjectName = item.subject?.subjectName || "Unknown Subject";
    const requiredCode = item.requiredSubject?.subjectCode || "—";
    const requiredName = item.requiredSubject?.subjectName || "Unknown Subject";
    const isCorequisite = item.type === "Corequisite";

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "16px",
                padding: "14px 18px",
                border: "1px solid #E4E4E7",
                borderRadius: "10px",
                background: "#FFFFFF",
                transition: "border-color 0.15s ease",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#D4D4D8";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#E4E4E7";
            }}
        >
            {/* Flow Visual: Target Subject -> Requires -> Required Subject */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1, minWidth: "300px" }}>
                {/* Target Subject Node */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span
                        style={{
                            background: "#18181B",
                            color: "#FFFFFF",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            padding: "4px 9px",
                            borderRadius: "6px",
                            letterSpacing: "0.03em",
                        }}
                    >
                        {subjectCode}
                    </span>
                    <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "#18181B" }}>
                        {subjectName}
                    </span>
                </div>

                {/* Visual Arrow Indicator */}
                <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#71717A", flexShrink: 0 }}>
                    <span style={{ fontSize: "0.6875rem", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.05em", color: "#A1A1AA" }}>
                        requires
                    </span>
                    <span style={{ color: "#D4D4D8" }}>→</span>
                </div>

                {/* Required Subject Node */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span
                        style={{
                            background: "#FFFFFF",
                            color: "#18181B",
                            border: "1px solid #E4E4E7",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            padding: "4px 9px",
                            borderRadius: "6px",
                            letterSpacing: "0.03em",
                        }}
                    >
                        {requiredCode}
                    </span>
                    <span style={{ fontWeight: 500, fontSize: "0.875rem", color: "#3F3F46" }}>
                        {requiredName}
                    </span>
                </div>
            </div>

            {/* Right Badges & Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                {/* Relationship Type Pill */}
                <span
                    style={{
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        background: isCorequisite ? "#18181B" : "#F4F4F5",
                        color: isCorequisite ? "#FFFFFF" : "#3F3F46",
                        border: isCorequisite ? "1px solid #18181B" : "1px solid #E4E4E7",
                    }}
                >
                    {item.type || "Prerequisite"}
                </span>

                {/* Minimum Grade Pill */}
                <span
                    style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#3F3F46",
                        background: "#FAFAFA",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        border: "1px solid #E4E4E7",
                    }}
                >
                    Min. {item.minimumGrade != null ? `${item.minimumGrade}%` : "—"}
                </span>

                {/* Active Status Indicator */}
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <CheckCircle2 size={13} color="#18181B" strokeWidth={2.2} />
                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#18181B" }}>
                        {item.status || "Active"}
                    </span>
                </div>

                {/* Action Buttons */}
                <ActionButtons
                    onEdit={() => onEdit(item)}
                    onDelete={() => onDelete(item)}
                />
            </div>
        </div>
    );
};

export default PrerequisiteNodeCard;
