import api from "./api";

export const login = async (data: { email: string; password: string }) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const register = async (data: {
  email: string;
  password: string;
  name: string;
  role: "tourist" | "accommodation";
}) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};
export const getProfile = async () => {
  const res = await api.get("/users/profile");
  console.log("Profile data:", res.data);
  return res.data;
};
