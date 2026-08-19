import { BookOpen } from "lucide-react";

const PrerequisiteHeader = () => {
    return (
        <div className="mb-6">
            <h1
                className="m-0"
                style={{
                    fontFamily: "Sora, sans-serif",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "#18181B",
                    letterSpacing: "-0.02em",
                }}
            >
                Subject Prerequisites
            </h1>
            <p
                className="m-0 mt-1"
                style={{
                    fontSize: "0.875rem",
                    color: "#71717A",
                    lineHeight: 1.5,
                }}
            >
                Configure and oversee course dependency structures, prerequisites, and corequisites across all academic programs.
            </p>
        </div>
    );
};

export default PrerequisiteHeader;
