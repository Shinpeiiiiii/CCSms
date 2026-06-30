import SearchInput from "../../../../../components/search/SearchInput";
import PrimaryButton from "../../../../../components/buttons/PrimaryButton";

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
                alignItems: "center",
                gap: 16,
                flexWrap: "wrap",
            }}
        >

            <SearchInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search programs..."
            />

            <PrimaryButton onClick={onAdd}>
                + Add Program
            </PrimaryButton>

        </div>

    );

};

export default ProgramToolbar;