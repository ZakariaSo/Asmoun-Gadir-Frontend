import api from "./api";

const transformReservation = (item: any) => ({
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
});

export const getMyReservations = async () => {
  const res = await api.get("/reservations/my-reservations");
  const data = res.data.reservations || res.data;

  if (Array.isArray(data)) {
    return data.map(transformReservation);
  }

  return data;
};

export const createReservation = async (reservationData: {
  activityId: number;
  numberOfPlaces: number;
  touristId: number;
}) => {
  const payload = {
    activityId: reservationData.activityId,
    numberOfPlaces: reservationData.numberOfPlaces,
    touristId: reservationData.touristId,
  };
  const res = await api.post("/reservations", payload);
  return res.data;
};

export const getReservationById = async (id: number) => {
  const path = `/reservations/${id}`;
  console.log(`DEBUG - GET Request to: ${path}`);
  try {
    const res = await api.get(path);
    console.log(`DEBUG - GET Success:`, res.data);
    return transformReservation(res.data);
  } catch (error: any) {
    console.error(`DEBUG - GET Error on ${path}:`, error.response?.data || error.message);
    throw error;
  }
};

export const updateReservation = async (id: number, reservationData: {
  numberOfPlaces: number;
}) => {
  const path = `/reservations/${id}`;
  const payload = {
    numberOfPlaces: reservationData.numberOfPlaces,
  };
  console.log(`DEBUG - PUT Request to: ${path} with payload:`, payload);
  try {
    const res = await api.put(path, payload);
    console.log(`DEBUG - PUT Success (Update):`, res.data);
    return transformReservation(res.data);
  } catch (error: any) {
    console.error(`DEBUG - PUT Error on ${path}:`, error.response?.data || error.message);
    throw error;
  }
};


export const deleteReservation = async (id: number) => {
  const path = `/reservations/${id}`;
  console.log(`DEBUG - DELETE Request to: ${path}`);
  try {
    const res = await api.delete(path);
    console.log(`DEBUG - DELETE Success:`, res.data);
    return res.data;
  } catch (error: any) {
    console.error(`DEBUG - DELETE Error on ${path}:`, error.response?.data || error.message);
    throw error;
  }
};


export const getAllReservations = async () => {
  const res = await api.get("/reservations");
  const data = res.data.reservations || res.data;

  if (Array.isArray(data)) {
    return data.map(transformReservation);
  }

  return data;
};

export const validateReservation = async (id: number) => {
  const path = `/reservations/${id}`;
  console.log(`DEBUG - PATCH Request to: ${path}`);
  try {
    const res = await api.patch(path, { status: "confirmed" });
    console.log(`DEBUG - PATCH Success:`, res.data);
    return transformReservation(res.data);
  } catch (error: any) {
    console.error(`DEBUG - PATCH Error on ${path}:`, error.response?.data || error.message);
    throw error;
  }
};

