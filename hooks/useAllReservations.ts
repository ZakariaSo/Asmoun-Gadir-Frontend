import { useQuery } from "@tanstack/react-query";
import { getAllReservations } from "../services/reservation";

export const useAllReservations = () => {
    return useQuery({
        queryKey: ["allReservations"],
        queryFn: getAllReservations,
        staleTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });
};
