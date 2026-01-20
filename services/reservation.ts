import api from "./api";

export const getMyReservations = async () => {
  const res = await api.get("/reservations/my");
  return res.data;
};
