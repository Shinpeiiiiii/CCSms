import { useState, useRef, useEffect, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
];

function groupSectionsByProgram(sections) {
    const map = new Map();
    sections.forEach((s) => {
        const programName =
            s.curriculum?.program?.programName || "General";
        if (!map.has(programName)) {
            map.set(programName, []);
        }
        map.get(programName).push(s);
    });
    return Array.from(map.entries()).map(([program, items]) => ({
        program,
        items,
    }));
}

export default function SectionSelector({
    sections,
    selectedSection,
    onSectionChange,
    onGenerate,
    loading,
}) {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    const selectedSectionData = useMemo(
        () => sections.find((s) => s._id === selectedSection),
        [sections, selectedSection]
    );

    const grouped = useMemo(() => {
        const keyword = search.toLowerCase().trim();
        const filtered = sections.filter((s) => {
            if (!keyword) return true;
            return (
                s.sectionCode?.toLowerCase().includes(keyword) ||
                s.curriculum?.program?.programName
                    ?.toLowerCase()
                    .includes(keyword)
            );
        });
        return groupSectionsByProgram(filtered);
    }, [sections, search]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (sectionId) => {
        onSectionChange(sectionId);
        setOpen(false);
        setSearch("");
    };

    return (
        <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1 max-w-xl" ref={containerRef}>
                <label className="text-sm font-medium mb-2 block">
                    Select Section
                </label>

                <div className="relative">
                    <Input
                        ref={inputRef}
                        value={open ? search : selectedSectionData?.sectionCode || ""}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setOpen(true);
                        }}
                        onFocus={() => setOpen(true)}
                        placeholder="Search section or program..."
                        className="pr-10"
                    />

                    <button
                        type="button"
                        onClick={() => {
                            setOpen((prev) => !prev);
                            if (!open) {
                                setSearch("");
                                inputRef.current?.focus();
                            }
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </button>
                </div>

                {open && (
                    <div
                        className="absolute z-50 mt-1 w-full max-h-72 overflow-y-auto rounded-lg border bg-white shadow-lg"
                        style={{
                            maxWidth: "28rem",
                        }}
                    >
                        {grouped.length === 0 ? (
                            <div className="p-4 text-sm text-gray-500 text-center">
                                No sections found.
                            </div>
                        ) : (
                            grouped.map((group) => (
                                <div key={group.program}>
                                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 border-b">
                                        {group.program}
                                    </div>
                                    {group.items.map((section) => (
                                        <button
                                            key={section._id}
                                            type="button"
                                            onClick={() =>
                                                handleSelect(section._id)
                                            }
                                            className={`w-full text-left px-3 py-2 text-sm hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer border-0 bg-transparent ${
                                                selectedSection ===
                                                    section._id
                                                    ? "bg-indigo-50 text-indigo-700 font-medium"
                                                    : "text-gray-700"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>
                                                    {section.sectionCode}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {section.enrolledCount ?? 0}/
                                                    {section.capacity}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            <Button
                onClick={onGenerate}
                disabled={!selectedSection || loading}
                className="mb-0.5"
            >
                Generate Subjects
            </Button>
        </div>
    );
}
