import SearchInput from "@/components/search/SearchInput";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SelectField from "@/components/forms/SelectField";

const AccountToolbar = ({
    search,
    setSearch,
    onAdd,
    selectedRole,
    onRoleChange,
}) => {
    const roleOptions = [
        { value: "", label: "All Roles" },
        { value: "admin", label: "Admin" },
        { value: "registrar", label: "Registrar" },
        { value: "teacher", label: "Teacher" },
        { value: "student", label: "Student" },
    ];

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
            }}
        >
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", flex: 1 }}>
                <SearchInput
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search accounts..."
                />
                <div style={{ minWidth: 180, maxWidth: 220 }}>
                    <SelectField
                        name="roleFilter"
                        value={selectedRole}
                        onChange={onRoleChange}
                        options={roleOptions}
                        placeholder="Filter by role"
                    />
                </div>
            </div>

            <PrimaryButton onClick={onAdd}>
                Create Account
            </PrimaryButton>
        </div>
    );
};

export default AccountToolbar
