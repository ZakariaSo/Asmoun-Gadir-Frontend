import api from "./api";

export const getMyReservations = async () => {
  const res = await api.get("/reservations/my-reservations");
  const data = res.data.reservations || res.data;

  if (Array.isArray(data)) {
    return data.map((item: any) => ({
      ...item,
      numberOfPlaces: item.numberOfPlaces || item.nombre_participants || item.nombreParticipants,
      totalPrice: item.totalPrice || item.montant_total || item.montantTotal,
      status: item.status || item.statut,
      createdAt: item.createdAt || item.date_reservation || item.dateReservation,
      activity: item.activity || item.activité || (item.Activity ? {
        ...item.Activity,
        title: item.Activity.title || item.Activity.titre,
        price: item.Activity.price || item.Activity.prix,
      } : undefined)
    }));
  }

  return data;
};
export const createReservation = async (reservationData: {
  activityId: number;
  numberOfPlaces: number;
  touristId: number;
}) => {
  const res = await api.post("/reservations", reservationData);
  return res.data;
};
