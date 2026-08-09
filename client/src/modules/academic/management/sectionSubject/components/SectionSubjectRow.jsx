import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

const DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
];

const STATUSES = [
    "Scheduled",
    "Cancelled",
];

export default function SectionSubjectRow({
    subject,
    teachers,
    onSave,
    onDelete,
}) {

    const [form, setForm] = useState({
        instructor: subject.instructor?._id || "",
        room: subject.room || "",
        day: subject.day || "",
        startTime: subject.startTime || "",
        endTime: subject.endTime || "",
        status: subject.status || "Scheduled",
    });

    useEffect(() => {
        setForm({
            instructor: subject.instructor?._id || "",
            room: subject.room || "",
            day: subject.day || "",
            startTime: subject.startTime || "",
            endTime: subject.endTime || "",
            status: subject.status || "Scheduled",
        });
    }, [subject]);

    const handleChange = (field, value) => {
        setForm(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <tr className="border-b">

            <td className="p-2">
                {subject.subject?.subjectCode}
            </td>

            <td className="p-2">
                {subject.subject?.subjectName}
            </td>

            <td className="p-2">
                {subject.semester ?? "-"}
            </td>

            <td className="p-2">
                {subject.subject?.totalUnits || subject.subject?.lectureUnits || subject.subject?.laboratoryUnits || "-"}
            </td>

            <td className="p-2 w-56">

                <Select
                    value={form.instructor}
                    onValueChange={(value) =>
                        handleChange("instructor", value)
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Teacher" />
                    </SelectTrigger>

                    <SelectContent>

                        {teachers.map((teacher) => (

                            <SelectItem
                                key={teacher._id}
                                value={teacher._id}
                            >
                                {teacher.firstName} {teacher.lastName}
                            </SelectItem>

                        ))}

                    </SelectContent>

                </Select>

            </td>

            <td className="p-2">

                <Input
                    value={form.room}
                    onChange={(e) =>
                        handleChange("room", e.target.value)
                    }
                />

            </td>

            <td className="p-2">

                <Select
                    value={form.day}
                    onValueChange={(value) =>
                        handleChange("day", value)
                    }
                >

                    <SelectTrigger>
                        <SelectValue placeholder="Day" />
                    </SelectTrigger>

                    <SelectContent>

                        {DAYS.map((day) => (

                            <SelectItem
                                key={day}
                                value={day}
                            >
                                {day}
                            </SelectItem>

                        ))}

                    </SelectContent>

                </Select>

            </td>

            <td className="p-2">

                <Input
                    type="time"
                    value={form.startTime}
                    onChange={(e) =>
                        handleChange("startTime", e.target.value)
                    }
                />

            </td>

            <td className="p-2">

                <Input
                    type="time"
                    value={form.endTime}
                    onChange={(e) =>
                        handleChange("endTime", e.target.value)
                    }
                />

            </td>

            <td className="p-2">

                <Select
                    value={form.status}
                    onValueChange={(value) =>
                        handleChange("status", value)
                    }
                >

                    <SelectTrigger>
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>

                    <SelectContent>

                        {STATUSES.map((status) => (

                            <SelectItem
                                key={status}
                                value={status}
                            >
                                {status}
                            </SelectItem>

                        ))}

                    </SelectContent>

                </Select>

            </td>

            <td className="p-2">

                <Button
                    size="sm"
                    onClick={() =>
                        onSave(subject._id, form)
                    }
                >
                    Save
                </Button>

            </td>

            <td className="p-2">

                <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete?.(subject._id)}
                >
                    Delete
                </Button>

            </td>

        </tr>
    );
}
