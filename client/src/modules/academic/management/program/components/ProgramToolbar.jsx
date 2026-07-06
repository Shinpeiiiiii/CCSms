import PrimaryButton from "../../../../../components/buttons/PrimaryButton";
import SearchBox from "../../../../../components/search/SearchInput"

const ProgramToolbar = ({
    search,
    setSearch,
    onAdd,
}) => {

    return (

        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
            }}
        >

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