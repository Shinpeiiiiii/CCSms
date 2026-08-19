import SearchField from "../../../../../components/search/SearchInput";
import PrimaryButton from "@/components/buttons/PrimaryButton";

const EnrollmentPeriodToolbar = ({
    search,
    setSearch,
    onAdd,
}) => {
    return (
        <div className="flex justify-between gap-4">
                <SearchField
                    placeholder="Search enrollment period..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                 <PrimaryButton onClick={onAdd}>
                    New Enrollment Period
                </PrimaryButton>
        </div>
    );
};

export default EnrollmentPeriodToolbar;