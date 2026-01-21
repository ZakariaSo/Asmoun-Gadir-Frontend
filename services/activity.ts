import { Activity } from "../types/activity";
import api from "./api";

const transformActivity = (item: any): Activity => ({
  ...item,
  title: item.title || item.titre,
  description: item.description || item.description,
  category: item.category || item.catégorie,
  dateStart: item.dateStart || item.date_debut || item.dateDebut,
  totalPlaces: item.totalPlaces || item.nombre_places_total || item.nombrePlacesTotal,
  availablePlaces: item.availablePlaces || item.places_disponibles || item.placesDisponibles,
  price: item.price || item.prix,
  status: item.status || item.statut,
});

export const getActivities = async (): Promise<Activity[]> => {
  const res = await api.get("/activities");
  const data = res.data.activities || res.data;
  if (Array.isArray(data)) {
    return data.map(transformActivity);
  }
  return data;
};

export const getActivityById = async (id: number): Promise<Activity> => {
  const res = await api.get(`/activities/${id}`);
  return transformActivity(res.data);
};
