import api from "./api";

const transformUser = (user: any) => {
  if (!user) return null;
  return {
    ...user,
    // Map backend 'type' to frontend 'role'
    role: (user.type === "hébergement" || user.type === "accommodation") ? "accommodation" :
      (user.type === "touriste" || user.type === "tourist") ? "tourist" :
        (user.type === "admin" || user.type === "administrateur") ? "admin" :
          user.role || user.type,
    // Map backend 'name' to frontend 'name'
    name: user.name || user.nom,
  };
};

export const login = async (data: { email: string; password: string }) => {
  const res = await api.post("/auth/login", data);
  console.log("Raw Login Response:", res.data);
  return {
    ...res.data,
    user: transformUser(res.data.user || res.data),
  };
};

export const register = async (data: {
  email: string;
  password: string;
  name: string;
  role: "tourist" | "accommodation";
}) => {
  const payload = {
    email: data.email,
    password: data.password,
    name: data.name,
    nom: data.name,
    type: data.role === "accommodation" ? "hébergement" : "touriste",
    role: data.role === "accommodation" ? "organisateur" : "touriste",
  };
  console.log("Sending Register Payload:", payload);
  const res = await api.post("/auth/register", payload);

  console.log("Register Response:", res.data);
  return res.data;
};

export const getProfile = async () => {
  const res = await api.get("/users/profile");
  console.log("Raw Profile Response:", res.data);
  const userData = res.data.user || res.data;
  return transformUser(userData);
};
