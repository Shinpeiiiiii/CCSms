const PrerequisiteLoadingSkeleton = () => {
    return (
        <div className="flex flex-col gap-4">
            {[1, 2].map((idx) => (
                <div
                    key={idx}
                    style={{
                        border: "1px solid #E4E4E7",
                        borderRadius: "12px",
                        overflow: "hidden",
                        background: "#FFFFFF",
                    }}
                >
                    <div style={{ padding: "14px 20px", background: "#F4F4F5", height: "48px" }} />
                    <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div style={{ width: "120px", height: "18px", background: "#E4E4E7", borderRadius: "4px" }} />
                        <div style={{ height: "64px", background: "#FAFAFA", borderRadius: "10px", border: "1px solid #E4E4E7" }} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PrerequisiteLoadingSkeleton;
