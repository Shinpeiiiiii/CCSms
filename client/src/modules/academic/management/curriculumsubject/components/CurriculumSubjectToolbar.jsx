import  SearchInput from "@/components/search/SearchInput";
import  PrimaryButton  from "@/components/buttons/PrimaryButton";


const CurriculumSubjectToolbar = ({
    search,
    setSearch,
    onAdd,
}) => {
    return(
        <div style={{display: "flex", justifyContent: "space-between", gap: 16,}}>
            <SearchInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Searh subject..."
            />
            <PrimaryButton onClick={onAdd}>
                Add Subject
            </PrimaryButton>
        </div>
    );
};

export default CurriculumSubjectToolbar;