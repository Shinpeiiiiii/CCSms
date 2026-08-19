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

            <div className="border rounded-lg p-8 text-center text-muted-foreground">

                {loading ? "Loading..." : "No section subjects found."}

            </div>

        );

    }

    return (

        <div style={{ overflowX: "auto" }}>

            <table className="w-full border rounded-lg">

                <thead>

                    <tr>

                        <th style={{ padding: 12, textAlign: "left", borderBottom: "1px solid #E8EAED" }}>Code</th>

                        <th style={{ padding: 12, textAlign: "left", borderBottom: "1px solid #E8EAED" }}>Subject</th>

                        <th style={{ padding: 12, textAlign: "left", borderBottom: "1px solid #E8EAED" }}>Semester</th>

                        <th style={{ padding: 12, textAlign: "left", borderBottom: "1px solid #E8EAED" }}>Units</th>

                        <th style={{ padding: 12, textAlign: "left", borderBottom: "1px solid #E8EAED" }}>Instructor</th>

                        <th style={{ padding: 12, textAlign: "left", borderBottom: "1px solid #E8EAED" }}>Room</th>

                        <th style={{ padding: 12, textAlign: "left", borderBottom: "1px solid #E8EAED" }}>Day</th>

                        <th style={{ padding: 12, textAlign: "left", borderBottom: "1px solid #E8EAED" }}>Start</th>

                        <th style={{ padding: 12, textAlign: "left", borderBottom: "1px solid #E8EAED" }}>End</th>

                        <th style={{ padding: 12, textAlign: "left", borderBottom: "1px solid #E8EAED" }}>Status</th>

                        <th style={{ padding: 12, textAlign: "left", borderBottom: "1px solid #E8EAED" }}></th>

                        <th style={{ padding: 12, textAlign: "left", borderBottom: "1px solid #E8EAED" }}></th>

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
