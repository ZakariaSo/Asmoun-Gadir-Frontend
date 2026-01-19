import { useQuery } from "@tanstack/react-query";
import { getActivities } from "../services/activity";

export const useActivities = () => {
  return useQuery({
    queryKey: ["activities"],
    queryFn: getActivities,
  });
};
