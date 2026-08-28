import SearchInput from "../../../../../components/search/SearchInput";
import PrimaryButton from "../../../../../components/buttons/PrimaryButton";

const CurriculumToolbar = ({
    search,
    setSearch,
    onAdd,
    onFromTemplate,
    onImport,
}) => {

    return (

        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
            }}
        >

            <SearchInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search curriculum..."
            />

            <PrimaryButton
                onClick={onAdd}
            >
                Add Curriculum
            </PrimaryButton>

            {onFromTemplate && (
                <button
                    onClick={onFromTemplate}
                    className="border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-900 hover:text-zinc-900"
                >
                    From Template
                </button>
            )}

            {onImport && (
                <button
                    onClick={onImport}
                    className="border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-900 hover:text-zinc-900"
                >
                    Import
                </button>
            )}

        </div>

    );

};

export default CurriculumToolbar;