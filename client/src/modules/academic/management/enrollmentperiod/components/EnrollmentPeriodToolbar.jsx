import SearchField from "../../../../../components/search/SearchInput";
import { PrimaryButton } from "../../../../../components/buttons";

const EnrollmentPeriodToolbar = ({
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
                width: "100%",
                flexWrap: "wrap",
            }}
        >
            <div
                style={{
                    flex: 1,
                    minWidth: 260,
                    maxWidth: 400,
                }}
            >
                <SearchField
                    placeholder="Search enrollment period..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <PrimaryButton onClick={onAdd}>
                + New Enrollment Period
            </PrimaryButton>
        </div>
    );
};

export default EnrollmentPeriodToolbar;