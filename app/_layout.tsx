import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

const queryClient = new QueryClient();

const Layaout: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              gestureEnabled: true,
              animation: "slide_from_right",
            }}
          />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

export default Layaout;
