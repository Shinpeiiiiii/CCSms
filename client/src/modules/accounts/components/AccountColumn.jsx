import ActionButtons from "@/components/actions/ActionButton";

const AccountColumns = ({ openEdit, openDelete }) => [
    {
        header: "Name",
        render: (account) => `${account.firstName} ${account.lastName}`,
    },
    {
        header: "Email",
        accessor: "email",
    },
    {
        header: "Role",
        render: (account) => account.role?.charAt(0).toUpperCase() + account.role?.slice(1),
    },
    {
        header: "Status",
        render: (account) => (
            <span
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "2px 10px",
                    borderRadius: 100,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    background: account.isActive ? "#E6F4EA" : "#FCE8E6",
                    color: account.isActive ? "#137333" : "#C5221F",
                }}
            >
                {account.isActive ? "Active" : "Inactive"}
            </span>
        ),
    },
    {
        header: "Actions",
        render: (account) => (
            <ActionButtons
                onEdit={() => openEdit(account)}
                onDelete={() => openDelete(account)}
            />
        ),
    },
];

export default AccountColumns
