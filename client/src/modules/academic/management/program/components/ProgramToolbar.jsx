import PrimaryButton from "../../../../../components/buttons/PrimaryButton";
import SearchBox from "../../../../../components/search/SearchInput"
const ProgramToolbar = ({
    search,
    setSearch,
    onAdd,
}) => {

    return (
        <div className="flex justify-between gap-4">
            <SearchBox
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search program..."
            />
            <PrimaryButton
                onClick={onAdd}
            >
                Add Program
            </PrimaryButton>
        </div>
    );
};

export default ProgramToolbar;