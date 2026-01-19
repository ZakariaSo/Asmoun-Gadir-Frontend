export type Activity = {
  id: number;
  title: string;
  description: string;
  category: string;
  dateStart: string;
  duration: number;
  meetingPoint: string;
  totalPlaces: number;
  availablePlaces: number;
  price: number;
  status: "draft" | "published" | "full" | "cancelled";
};
