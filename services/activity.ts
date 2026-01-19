import { Activity } from "../types/activity";
import api from "./api";

export const getActivities = async (): Promise<Activity[]> => {
  const res = await api.get("/activities");
  return res.data;
};

export const getActivityById = async (id: number): Promise<Activity> => {
  const res = await api.get(`/activities/${id}`);
  return res.data;
};
