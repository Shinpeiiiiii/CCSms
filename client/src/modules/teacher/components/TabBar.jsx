import { motion } from 'framer-motion';

const TabBar = ({ tabs, activeTab, onTabChange, count }) => (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '4px' }}>
        {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    style={{
                        position: 'relative',
                        padding: '6px 16px',
                        borderRadius: '9999px',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: isActive ? '#ffffff' : '#6b7280',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        outline: 'none',
                    }}
                >
                    {/* Animated dark pill background */}
                    {isActive && (
                        <motion.div
                            layoutId="activeTabPill"
                            style={{
                                position: 'absolute',
                                inset: 0,
                                backgroundColor: '#0f172a',
                                borderRadius: '9999px',
                                zIndex: 0,
                            }}
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                    )}
                    <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {tab.label}
                        {isActive && tab.id === 'students' && count != null && (
                            <span style={{
                                backgroundColor: 'rgba(255,255,255,0.25)',
                                color: '#ffffff',
                                fontSize: '11px',
                                fontWeight: '600',
                                padding: '2px 6px',
                                borderRadius: '9999px',
                                lineHeight: 1,
                            }}>
                                {count}
                            </span>
                        )}
                    </span>
                </button>
            );
        })}
    </div>
);

export default TabBar;
