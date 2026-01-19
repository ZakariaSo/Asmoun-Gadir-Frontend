import { useQuery } from "@tanstack/react-query";
import { getActivityById } from "../services/activity";

export const useActivity = (id: number) => {
  return useQuery({
    queryKey: ["activity", id],
    queryFn: () => getActivityById(id),
  });
};
