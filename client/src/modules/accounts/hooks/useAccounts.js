import { useEffect, useState } from "react";
import { getAccounts } from "../services/account.services";

const useAccounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadAccounts = async () => {
        try {
            const data = await getAccounts();
            console.log('data:', data);
            setAccounts(data);
        } catch (error) {
            console.error("Failed to load accounts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAccounts();
    }, []);

    return {
        accounts,
        loading,
        refreshAccounts: loadAccounts,
    };
};

export default useAccounts
