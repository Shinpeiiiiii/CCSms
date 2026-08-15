import { SearchInput } from "@/components/search";

const PrerequisiteToolbar = ({
    search, setSearch,
}) => {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <SearchInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by subject, code, or type..."
                style={{
                    borderRadius: "10px",
                    borderColor: "#E4E4E7",
                }}
            />
           
        </div>
    );
};

export default PrerequisiteToolbar;
