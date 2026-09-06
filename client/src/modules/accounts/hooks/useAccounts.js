import { useCallback } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../constants/queryKey";
import { getAccounts, createAccount, updateAccount, deleteAccount } from "../services/account.services";

const useAccounts = () => {
    const queryClient = useQueryClient();

    const {
        data: accounts = [],
        isLoading: loading,
    } = useQuery({
        queryKey: QUERY_KEYS.ACCOUNTS,
        queryFn: getAccounts,
    });

    const refreshAccounts = useCallback(
        () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACCOUNTS }),
        [queryClient]
    );

    const create = useMutation({
        mutationFn: createAccount,
        onSuccess: refreshAccounts,
    });

    const update = useMutation({
        mutationFn: ({ id, data }) => updateAccount(id, data),
        onSuccess: refreshAccounts,
    });

    const remove = useMutation({
        mutationFn: deleteAccount,
        onSuccess: refreshAccounts,
    });

    return {
        accounts,
        loading,
        refreshAccounts,
        create,
        update,
        remove,
    };
};

export default useAccounts;