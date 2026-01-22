import { useQuery } from "@tanstack/react-query";
import { getReservationById } from "../services/reservation";

export const useReservation = (id: number) => {
    return useQuery({
        queryKey: ["reservation", id],
        queryFn: () => getReservationById(id),
        enabled: !!id,
    });
};
