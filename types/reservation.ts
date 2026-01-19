export type Reservation = {
  id: number;
  numberOfPlaces: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
};
