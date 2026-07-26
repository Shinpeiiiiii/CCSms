import SectionSubjectRow from "./SectionSubjectRow";

export default function SectionSubjectTable({

    subjects,

    teachers,

    onSave,

    onDelete,

}) {

    if (!subjects.length) {

        return (

            <div className="border rounded-lg p-8 text-center text-muted-foreground">

                No section subjects found.

            </div>

        );

    }

    return (

        <table className="w-full border rounded-lg">

            <thead>

                <tr>

                    <th>Code</th>

                    <th>Subject</th>

                    <th>Instructor</th>

                    <th>Room</th>

                    <th>Day</th>

                    <th>Start</th>

                    <th>End</th>

                    <th></th>

                    <th></th>

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

    );

}