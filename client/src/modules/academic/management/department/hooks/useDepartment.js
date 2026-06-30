import { useEffect, useState } from "react";
import { getDepartment } from "../services/department.services";

const useDepartment = () => {
    const [department, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadDepartment = async () => {
        try {
            const data = await getDepartment();
            setDepartments(data);
        } catch (error) {
            console.error("Failed to load departments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchDepartment = async () => {
            await loadDepartment();
        };

        fetchDepartment();
    }, []);

    return {
        department,
        loading,
        refreshDepartments: loadDepartment,
    };
};

export default useDepartment;