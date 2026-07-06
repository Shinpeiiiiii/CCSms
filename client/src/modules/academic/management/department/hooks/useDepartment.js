import { useMemo, useState } from "react";
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
} from "../api/department.api";

const useDepartment = () => {

    const queryClient = useQueryClient();

    const [search, setSearch] = useState("");

    /*
    ===============================
    Query
    ===============================
    */

    const {
        data: departments = [],
        isLoading: loading,
    } = useQuery({
        queryKey: ["departments"],
        queryFn: getDepartments,
    });

    /*
    ===============================
    Search
    ===============================
    */

    const filteredDepartments = useMemo(() => {

        if (!search.trim()) return departments;

        const keyword = search.toLowerCase();

        return departments.filter((department) =>
            department.departmentCode?.toLowerCase().includes(keyword) ||
            department.departmentName?.toLowerCase().includes(keyword) ||
            department.description?.toLowerCase().includes(keyword)
        );

    }, [departments, search]);

    /*
    ===============================
    Mutations
    ===============================
    */

    const create = useMutation({
        mutationFn: createDepartment,
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ["departments"],
            }),
    });

    const update = useMutation({
        mutationFn: ({ id, data }) =>
            updateDepartment(id, data),

        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ["departments"],
            }),
    });

    const remove = useMutation({
        mutationFn: deleteDepartment,

        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: ["departments"],
            }),
    });

    return {

        departments,
        filteredDepartments,

        loading,

        search,

        setSearch,

        create,

        update,

        remove,

    };

};

export default useDepartment;