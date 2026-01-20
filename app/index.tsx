import SplashScreen from "@/components/SplashScreen";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import React from "react";

const Index: React.FC = () => {
  const router = useRouter();
  const { token } = useAuthStore();

  const handleFinish = () => {
    // Rediriger vers home si l'utilisateur est connecté, sinon vers login
    if (token) {
      router.replace("/(tabs)/home");
    } else {
      router.replace("/(auth)/login");
    }
  };

  return <SplashScreen onFinish={handleFinish} />;
};

export default Index;