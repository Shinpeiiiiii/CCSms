import { Plus } from "lucide-react";
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
                        background: '#FFFFFF',
                        border: '1px solid #DADCE0',
                        borderRadius: 100,
                        padding: '10px 20px',
                        color: '#202124',
                        fontSize: '0.875rem',
                        outline: 'none',
                        transition: 'all 0.2s',
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = '#1A73E8';
                        e.target.style.boxShadow = '0 0 0 3px rgba(26, 115, 232, 0.12)';
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = '#DADCE0';
                        e.target.style.boxShadow = 'none';
                    }}
                />
            </div>

            <PrimaryButton
                onClick={onAdd}
            >   
                Add Department
            </PrimaryButton>
        </div>
    )
}

export default DepartmentToolbar;