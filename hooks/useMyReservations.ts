import { useQuery } from "@tanstack/react-query";
import { getMyReservations } from "../services/reservation";

export const useMyReservations = () => {
  return useQuery({
    queryKey: ["myReservations"],
    queryFn: getMyReservations,
  });
};
