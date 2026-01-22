import { Activity } from "./activity";

export type Reservation = {
  id: number;
  numberOfPlaces: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  activity?: Activity;
  touristId?: number;
  id_touriste?: number;
};
