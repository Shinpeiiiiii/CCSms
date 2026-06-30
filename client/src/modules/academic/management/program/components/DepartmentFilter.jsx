import React from "react";

const DepartmentFilter = ({
    departments = [],
    selectedDepartmentId = "all",
    onSelectDepartment,
    programCounts = {},
    totalProgramsCount = 0,
    isMobile = false,
}) => {
    // Render list for Desktop Sidebar mode
    const renderDesktop = () => {
        return (
            <div
                style={{
                    background: "rgba(255, 255, 255, 0.025)",
                    border: "1px solid rgba(255, 255, 255, 0.07)",
                    borderRadius: 18,
                    backdropFilter: "blur(8px)",
                    padding: 20,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                }}
            >
                <div>
                    <h3
                        style={{
                            fontFamily: "Sora, sans-serif",
                            fontSize: "1.1rem",
                            fontWeight: 700,
                            color: "#F1F5F9",
                            letterSpacing: "-0.01em",
                        }}
                    >
                        Departments
                    </h3>
                    <p
                        style={{
                            fontSize: "0.75rem",
                            color: "#64748B",
                            marginTop: 4,
                        }}
                    >
                        Filter programs by department
                    </p>
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                        maxHeight: "65vh",
                        overflowY: "auto",
                        paddingRight: 4,
                    }}
                >
                    {/* "All Departments" Option */}
                    <button
                        onClick={() => onSelectDepartment("all")}
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "10px 14px",
                            borderRadius: 10,
                            cursor: "pointer",
                            textAlign: "left",
                            background: selectedDepartmentId === "all"
                                ? "rgba(99, 102, 241, 0.12)"
                                : "transparent",
                            border: "1px solid",
                            borderColor: selectedDepartmentId === "all"
                                ? "rgba(99, 102, 241, 0.35)"
                                : "transparent",
                            borderLeft: "4px solid",
                            borderLeftColor: selectedDepartmentId === "all"
                                ? "#6366F1"
                                : "transparent",
                            color: selectedDepartmentId === "all" ? "#F1F5F9" : "#94A3B8",
                            transition: "all 0.2s ease-in-out",
                            outline: "none",
                        }}
                        className="dept-filter-item"
                        onMouseEnter={(e) => {
                            if (selectedDepartmentId !== "all") {
                                e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                                e.currentTarget.style.color = "#F1F5F9";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (selectedDepartmentId !== "all") {
                                e.currentTarget.style.background = "transparent";
                                e.currentTarget.style.color = "#94A3B8";
                            }
                        }}
                    >
                        <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>
                            All Departments
                        </span>
                        <span
                            style={{
                                background: selectedDepartmentId === "all"
                                    ? "rgba(99, 102, 241, 0.25)"
                                    : "rgba(255, 255, 255, 0.05)",
                                border: "1px solid",
                                borderColor: selectedDepartmentId === "all"
                                    ? "rgba(99, 102, 241, 0.3)"
                                    : "rgba(255, 255, 255, 0.08)",
                                color: selectedDepartmentId === "all" ? "#E0E7FF" : "#94A3B8",
                                borderRadius: 20,
                                padding: "2px 8px",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                            }}
                        >
                            {totalProgramsCount}
                        </span>
                    </button>

                    {/* Departments List */}
                    {departments.map((dept) => {
                        const isSelected = selectedDepartmentId === dept._id;
                        const count = programCounts[dept._id] || 0;

                        return (
                            <button
                                key={dept._id}
                                onClick={() => onSelectDepartment(dept._id)}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    padding: "10px 14px",
                                    borderRadius: 10,
                                    cursor: "pointer",
                                    textAlign: "left",
                                    background: isSelected
                                        ? "rgba(99, 102, 241, 0.12)"
                                        : "transparent",
                                    border: "1px solid",
                                    borderColor: isSelected
                                        ? "rgba(99, 102, 241, 0.35)"
                                        : "transparent",
                                    borderLeft: "4px solid",
                                    borderLeftColor: isSelected
                                        ? "#6366F1"
                                        : "transparent",
                                    color: isSelected ? "#F1F5F9" : "#94A3B8",
                                    transition: "all 0.2s ease-in-out",
                                    outline: "none",
                                }}
                                className="dept-filter-item"
                                onMouseEnter={(e) => {
                                    if (!isSelected) {
                                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                                        e.currentTarget.style.color = "#F1F5F9";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isSelected) {
                                        e.currentTarget.style.background = "transparent";
                                        e.currentTarget.style.color = "#94A3B8";
                                    }
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        width: "100%",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontWeight: 700,
                                            fontSize: "0.8rem",
                                            color: isSelected ? "#A5B4FC" : "#64748B",
                                            letterSpacing: "0.05em",
                                        }}
                                    >
                                        {dept.departmentCode}
                                    </span>
                                    <span
                                        style={{
                                            background: isSelected
                                                ? "rgba(99, 102, 241, 0.25)"
                                                : "rgba(255, 255, 255, 0.05)",
                                            border: "1px solid",
                                            borderColor: isSelected
                                                ? "rgba(99, 102, 241, 0.3)"
                                                : "rgba(255, 255, 255, 0.08)",
                                            color: isSelected ? "#E0E7FF" : "#94A3B8",
                                            borderRadius: 20,
                                            padding: "2px 8px",
                                            fontSize: "0.75rem",
                                            fontWeight: 600,
                                        }}
                                    >
                                        {count}
                                    </span>
                                </div>
                                <span
                                    style={{
                                        fontSize: "0.85rem",
                                        fontWeight: 500,
                                        marginTop: 4,
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        width: "100%",
                                    }}
                                >
                                    {dept.departmentName}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Render horizontal scrolling pills for Mobile mode
    const renderMobile = () => {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    marginBottom: 16,
                    width: "100%",
                }}
            >
                <span
                    style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: "#64748B",
                    }}
                >
                    Departments
                </span>
                <div
                    style={{
                        display: "flex",
                        gap: 8,
                        overflowX: "auto",
                        paddingBottom: 8,
                        scrollbarWidth: "none", // Firefox
                        msOverflowStyle: "none", // IE/Edge
                    }}
                >
                    {/* "All" Pill */}
                    <button
                        onClick={() => onSelectDepartment("all")}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "8px 14px",
                            borderRadius: 20,
                            cursor: "pointer",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                            background: selectedDepartmentId === "all"
                                ? "#6366F1"
                                : "rgba(255, 255, 255, 0.03)",
                            border: "1px solid",
                            borderColor: selectedDepartmentId === "all"
                                ? "#6366F1"
                                : "rgba(255, 255, 255, 0.07)",
                            color: selectedDepartmentId === "all" ? "#FFFFFF" : "#94A3B8",
                            transition: "all 0.15s ease",
                            outline: "none",
                        }}
                    >
                        <span>All</span>
                        <span
                            style={{
                                background: selectedDepartmentId === "all"
                                    ? "rgba(0, 0, 0, 0.2)"
                                    : "rgba(255, 255, 255, 0.08)",
                                color: selectedDepartmentId === "all" ? "#FFFFFF" : "#64748B",
                                borderRadius: 10,
                                padding: "1px 6px",
                                fontSize: "0.7rem",
                                fontWeight: 700,
                            }}
                        >
                            {totalProgramsCount}
                        </span>
                    </button>

                    {/* Department Pills */}
                    {departments.map((dept) => {
                        const isSelected = selectedDepartmentId === dept._id;
                        const count = programCounts[dept._id] || 0;

                        return (
                            <button
                                key={dept._id}
                                onClick={() => onSelectDepartment(dept._id)}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 6,
                                    padding: "8px 14px",
                                    borderRadius: 20,
                                    cursor: "pointer",
                                    fontSize: "0.8rem",
                                    fontWeight: 600,
                                    whiteSpace: "nowrap",
                                    background: isSelected ? "#6366F1" : "rgba(255, 255, 255, 0.03)",
                                    border: "1px solid",
                                    borderColor: isSelected ? "#6366F1" : "rgba(255, 255, 255, 0.07)",
                                    color: isSelected ? "#FFFFFF" : "#94A3B8",
                                    transition: "all 0.15s ease",
                                    outline: "none",
                                }}
                            >
                                <span>{dept.departmentCode}</span>
                                <span
                                    style={{
                                        background: isSelected
                                            ? "rgba(0, 0, 0, 0.2)"
                                            : "rgba(255, 255, 255, 0.08)",
                                        color: isSelected ? "#FFFFFF" : "#64748B",
                                        borderRadius: 10,
                                        padding: "1px 6px",
                                        fontSize: "0.7rem",
                                        fontWeight: 700,
                                    }}
                                >
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    return isMobile ? renderMobile() : renderDesktop();
};

export default DepartmentFilter;
