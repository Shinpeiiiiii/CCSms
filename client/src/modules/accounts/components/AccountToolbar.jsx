import SearchInput from "@/components/search/SearchInput";
import PrimaryButton from "@/components/buttons/PrimaryButton";

const AccountToolbar = ({
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
                placeholder="Search accounts..."
            />

            <PrimaryButton onClick={onAdd}>
                Create Account
            </PrimaryButton>
        </div>
    );
};

export default AccountToolbar
