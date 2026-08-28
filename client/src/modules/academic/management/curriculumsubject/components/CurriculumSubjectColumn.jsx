import { Pencil, Trash2 } from "lucide-react";

const CurriculumSubjectColumn = ({ onEdit, onDelete }) => [
    {
        header: "Code",
        render: (row) => (
            <span className="font-semibold text-gray-900 text-[13px]">
                {row.subject?.subjectCode || "-"}
            </span>
        ),
    },
    {
        header: "Subject",
        render: (row) => (
            <span className="text-gray-600 text-[13px]">
                {row.subject?.subjectName || "-"}
            </span>
        ),
    },
    {
        header: "Units",
        render: (row) => (
            <span className="text-gray-500 text-[13px] tabular-nums">
                {row.subject?.units || "-"}
            </span>
        ),
    },
    {
        header: "Year",
        render: (row) => (
            <span className="text-gray-500 text-[13px] tabular-nums">
                {row.yearLevel}
            </span>
        ),
    },
    {
        header: "Sem",
        render: (row) => (
            <span className="text-gray-500 text-[13px] tabular-nums">
                {row.semester}
            </span>
        ),
    },
    {
        header: "Type",
        render: (row) => (
            <span
                className={`inline-block px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                    row.isRequired
                        ? "bg-gray-900 text-white"
                        : "border border-gray-300 text-gray-500"
                }`}
            >
                {row.isRequired ? "Required" : "Elective"}
            </span>
        ),
    },
    {
        header: "Order",
        render: (row) => (
            <span className="text-gray-400 text-[13px] tabular-nums">
                {row.displayOrder}
            </span>
        ),
    },
    {
        header: "",
        render: (row) => (
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onEdit(row)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    title="Edit"
                >
                    <Pencil size={14} />
                </button>
                <button
                    onClick={() => onDelete(row)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        ),
    },
];

export default CurriculumSubjectColumn;
