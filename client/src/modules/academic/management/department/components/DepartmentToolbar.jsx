import PrimaryButton from "../../../../../components/buttons/PrimaryButton";

const DepartmentToolbar = ({
    search,
    setSearch,
    onAdd,
}) => {

    return (
        <div 
            style={{ 
                display: 'flex', 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                gap: 16,
                flexWrap: 'wrap',
            }}
        >
            <div style={{ flex: 1, minWidth: 260 }}>
                <input
                    type="text"
                    placeholder="Search department..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 100,
                        padding: '10px 20px',
                        color: '#F1F5F9',
                        fontSize: '0.875rem',
                        outline: 'none',
                        transition: 'all 0.2s',
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = 'rgba(99, 102, 241, 0.6)';
                        e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.12)';
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                        e.target.style.boxShadow = 'none';
                    }}
                />
            </div>

            <PrimaryButton
                onClick={onAdd}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Department
            </PrimaryButton>
        </div>
    )
}

export default DepartmentToolbar;