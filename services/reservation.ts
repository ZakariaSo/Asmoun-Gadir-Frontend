import api from "./api";

export const getMyReservations = async () => {
  const res = await api.get("/reservations/");
  return res.data.reservations || res.data;
};
export const createReservation = async (reservationData: {
  activityId: number;
  numberOfPlaces: number;
  touristId: number;
}) => {
  const res = await api.post("/reservations", reservationData);
  return res.data;
};
