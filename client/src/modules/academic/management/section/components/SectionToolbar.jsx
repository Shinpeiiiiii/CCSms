import SearchField from "../../../../../components/search/SearchInput";
import { PrimaryButton } from "../../../../../components/buttons";

const SectionToolbar = ({
    search,
    setSearch,
    onAdd,
}) => {
    return (
        <div
            style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
            }}
        >
            <SearchField
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search sections..."
            />
            <PrimaryButton onClick={onAdd}>
                Add Section
            </PrimaryButton>
        </div>
    );
};

export default SectionToolbar;