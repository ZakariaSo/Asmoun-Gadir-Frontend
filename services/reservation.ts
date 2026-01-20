import api from "./api";

export const getMyReservations = async () => {
  const res = await api.get("/reservations/my");
  return res.data;
};
export const createReservation = async (reservationData: { activityId: number; numberOfPlaces: number }) => {
  const res = await api.post("/reservations", reservationData);
  return res.data;
};
