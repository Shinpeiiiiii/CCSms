import SearchBox from "../../../../../components/search/SearchInput";
import PrimaryButton from "../../../../../components/buttons/PrimaryButton";

const SubjectToolbar = ({
    search,
    setSearch,
    onAdd,
}) => {

    return (

        <div className="flex justifyy-between gap-4">

            <SearchBox
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search subject..."
            />

            <PrimaryButton
                onClick={onAdd}
            >
                Add Subject
            </PrimaryButton>

        </div>

    );

};

export default SubjectToolbar;