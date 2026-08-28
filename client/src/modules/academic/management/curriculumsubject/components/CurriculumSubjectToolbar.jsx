import SearchInput from "@/components/search/SearchInput";
import PrimaryButton from "@/components/buttons/PrimaryButton";

const CurriculumSubjectToolbar = ({
    search,
    setSearch,
    onAdd,
    viewMode,
    setViewMode,
    onAutoStructure,
    structuring = false,
    onBatchAdd,
}) => {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <SearchInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search subjects..."
                style={{ width: 260 }}
            />

            <div className="ml-auto flex items-center gap-1.5">
                <button
                    onClick={() => setViewMode(viewMode === "matrix" ? "list" : "matrix")}
                    className={`px-3 py-1.5 text-[12px] font-medium border transition-colors ${
                        viewMode === "matrix"
                            ? "border-gray-900 bg-gray-900 text-white"
                            : "border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-700"
                    }`}
                >
                    {viewMode === "matrix" ? "List" : "Matrix"}
                </button>

                <div className="w-px h-4 bg-gray-200 mx-1" />

                <button
                    onClick={onAutoStructure}
                    disabled={structuring}
                    className={`px-3 py-1.5 text-[12px] font-medium border transition-colors ${
                        structuring
                            ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:text-gray-900"
                    }`}
                >
                    {structuring ? "Structuring..." : "Auto Structure"}
                </button>

                <button
                    onClick={onBatchAdd}
                    className="px-3 py-1.5 text-[12px] font-medium border border-gray-200 bg-white text-gray-600 transition-colors hover:border-gray-400 hover:text-gray-900"
                >
                    Batch Add
                </button>

                <div className="w-px h-4 bg-gray-200 mx-1" />

                <PrimaryButton onClick={onAdd} size="sm">
                    Add Subject
                </PrimaryButton>
            </div>
        </div>
    );
};

export default CurriculumSubjectToolbar;
