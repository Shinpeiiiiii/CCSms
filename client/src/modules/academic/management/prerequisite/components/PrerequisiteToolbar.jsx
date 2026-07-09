import { SearchInput } from "@/components/search";
import { PrimaryButton } from "@/components/buttons";

const PrerequisiteToolbar = ({
    search, setSearch, onAdd,
}) => {
    return(
        <div>
            <SearchInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search prerequisites..."
            />

            <PrimaryButton onClick={onAdd}>
                Add Prerequisite
            </PrimaryButton>
        </div>
    )
}

export default PrerequisiteToolbar;