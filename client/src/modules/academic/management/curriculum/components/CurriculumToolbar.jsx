import SearchInput from "../../../../../components/search/SearchInput";
import PrimaryButton from "../../../../../components/buttons/PrimaryButton";

const CurriculumToolbar = ({
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

        </div>

    );

};

export default CurriculumToolbar;