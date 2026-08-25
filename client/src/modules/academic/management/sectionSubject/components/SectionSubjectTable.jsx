import SectionSubjectRow from "./SectionSubjectRow";

export default function SectionSubjectTable({
    subjects,
    teachers,
    onSave,
    onDelete,
    loading = false,
}) {

    if (!Array.isArray(subjects) || subjects.length === 0) {

        return (

            <div className="border rounded-lg p-8 text-center text-black">

                {loading ? "Loading..." : "No section subjects found."}

            </div>

        );

    }

    return (
        <div style={{ overflowX: "auto" }}>
            <table className="w-full border rounded-lg text-black">
                <thead>
                    <tr>
                        <th style={{ padding: 12, textAlign: "left", borderBottom: "1px solid #000000", color: "#000" }}>Code</th>
                        <th style={{ padding: 12, textAlign: "left", borderBottom: "1px solid #000000", color: "#000" }}>Subject</th>
                        <th style={{ padding: 12, textAlign: "left", borderBottom: "1px solid #000000", color: "#000" }}>Semester</th>
                        <th style={{ padding: 12, textAlign: "left", borderBottom: "1px solid #000000", color: "#000" }}>Units</th>
                        <th style={{ padding: 12, textAlign: "left", borderBottom: "1px solid #000000", color: "#000" }}>Instructor</th>
                        <th style={{ padding: 12, textAlign: "left", borderBottom: "1px solid #000000", color: "#000" }}>Room</th>
                        <th style={{ padding: 12, textAlign: "left", borderBottom: "1px solid #000000", color: "#000" }}>Day</th>
                        <th style={{ padding: 12, textAlign: "left", borderBottom: "1px solid #000000", color: "#000" }}>Start</th>
                        <th style={{ padding: 12, textAlign: "left", borderBottom: "1px solid #000000", color: "#000" }}>End</th>
                        <th style={{ padding: 12, textAlign: "left", borderBottom: "1px solid #000000", color: "#000" }}>Status</th>
                        <th style={{ padding: 12, textAlign: "left", borderBottom: "1px solid #000000", color: "#000" }}></th>
                        <th style={{ padding: 12, textAlign: "left", borderBottom: "1px solid #000000", color: "#000" }}></th>
                    </tr>
                </thead>
                <tbody>
                    {subjects.map(subject => (
                        <SectionSubjectRow
                            key={subject._id}
                            subject={subject}
                            teachers={teachers}
                            onSave={onSave}
                            onDelete={onDelete}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
