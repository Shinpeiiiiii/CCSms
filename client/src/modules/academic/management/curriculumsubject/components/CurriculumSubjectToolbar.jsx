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
        <div className="flex flex-wrap items-center gap-3">
            <SearchInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search subjects..."
            />

            <div className="ml-auto flex flex-wrap items-center gap-2">
                <button
                    onClick={() => setViewMode(viewMode === "matrix" ? "list" : "matrix")}
                    className={`rounded-lg border px-4 py-2 text-[13px] font-semibold transition-colors ${
                        viewMode === "matrix"
                            ? "border-black bg-black text-white"
                            : "border-gray-300 bg-white text-gray-600 hover:border-black hover:text-black"
                    }`}
                >
                    {viewMode === "matrix" ? "List View" : "Matrix View"}
                </button>

                <button
                    onClick={onAutoStructure}
                    disabled={structuring}
                    className={`rounded-lg border px-4 py-2 text-[13px] font-semibold transition-colors ${
                        structuring
                            ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400"
                            : "border-black/70 bg-white text-black hover:bg-black hover:text-white"
                    }`}
                >
                    {structuring ? "Structuring..." : "Auto Structure"}
                </button>

                {onBatchAdd && (
                    <button
                        onClick={onBatchAdd}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-[13px] font-semibold text-gray-700 transition-colors hover:border-black hover:text-black"
                    >
                        Batch Add
                    </button>
                )}

                <PrimaryButton onClick={onAdd}>
                    Add Subject
                </PrimaryButton>
            </div>
        </div>
    );
};

export default CurriculumSubjectToolbar;