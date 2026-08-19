import { BookOpen, Plus } from "lucide-react";
import PrerequisiteNodeCard from "./PrerequisiteNodeCard";

const PrerequisiteCurriculumCard = ({
    curriculumId,
    curriculumGroup,
    onOpenCreateForCurriculum,
    onEditItem,
    onDeleteItem,
}) => {
    const curriculumName =
        curriculumGroup.curriculum?.curriculumName ||
        curriculumGroup.curriculum?.name ||
        "Curriculum";
    const yearEntries = Object.entries(curriculumGroup.years);
    const totalCurriculumItems = yearEntries.reduce((acc, [_, yGroup]) => {
        return acc + Object.values(yGroup.semester).reduce((sAcc, items) => sAcc + items.length, 0);
    }, 0);

    return (
        <div
            style={{
                border: "1px solid #E4E4E7",
                borderRadius: "12px",
                overflow: "hidden",
                background: "#FFFFFF",
            }}
        >
            {/* Curriculum Header */}
            <div
                style={{
                    padding: "14px 20px",
                    background: "#FFFFFF",
                    borderBottom: "1px solid #E4E4E7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <BookOpen size={18} strokeWidth={2} color="#71717A" />
                    <span
                        style={{
                            fontFamily: "Sora, sans-serif",
                            fontWeight: 700,
                            fontSize: "0.9375rem",
                            color: "#18181B",
                            letterSpacing: "-0.01em",
                        }}
                    >
                        {curriculumName}
                    </span>
                    <span
                        style={{
                            fontSize: "0.75rem",
                            fontWeight: 500,
                            background: "#F4F4F5",
                            color: "#71717A",
                            padding: "2px 10px",
                            borderRadius: "9999px",
                            border: "1px solid #E4E4E7",
                        }}
                    >
                        {totalCurriculumItems} {totalCurriculumItems === 1 ? "rule" : "rules"}
                    </span>
                </div>

                <button
                    onClick={() => onOpenCreateForCurriculum(curriculumId)}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "8px 14px",
                        background: "black",
                        color: "#FFFFFF",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        border: "1px solid #D4D4D8",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "black";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "black";
                    }}
                >
                    <Plus size={15} strokeWidth={2.2} />
                    Add Prerequisite
                </button>
            </div>

            {/* Year Level Sections */}
            {yearEntries.map(([yearKey, yearGroup]) => (
                <div key={yearKey} style={{ padding: "20px" }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "14px",
                            paddingLeft: "8px",
                        }}
                    >
                        <div
                            style={{
                                width: "3px",
                                height: "16px",
                                background: "#D4D4D8",
                                borderRadius: "2px",
                            }}
                        />
                        <span
                            style={{
                                fontWeight: 600,
                                fontSize: "0.8125rem",
                                color: "#18181B",
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                            }}
                        >
                            {yearKey}
                        </span>
                    </div>

                    {/* Semester Sections */}
                    {Object.entries(yearGroup.semester).map(([semKey, items]) => (
                        <div key={semKey} style={{ marginBottom: "16px", paddingLeft: "12px" }}>
                            <div
                                style={{
                                    fontWeight: 500,
                                    fontSize: "0.75rem",
                                    color: "#71717A",
                                    marginBottom: "10px",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.04em",
                                }}
                            >
                                {semKey}
                            </div>

                            {/* Prerequisite Node Cards */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {items.map((item) => (
                                    <PrerequisiteNodeCard
                                        key={item._id}
                                        item={item}
                                        onEdit={onEditItem}
                                        onDelete={onDeleteItem}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default PrerequisiteCurriculumCard;
