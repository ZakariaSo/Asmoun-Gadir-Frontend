import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getProfile } from "../services/auth";
import { useAuthStore } from "../store/authStore";

export const useProfile = () => {
    const { token, setUser } = useAuthStore();

    const query = useQuery({
        queryKey: ["profile"],
        queryFn: getProfile,
        enabled: !!token,
    });

    useEffect(() => {
        if (query.data) {
            // Check if the response is nested { user: { ... } } or flat
            const userData = query.data.user || query.data;
            if (userData && userData.email) {
                setUser(userData);
            }
        }
    }, [query.data, setUser]);

    return query;
};
