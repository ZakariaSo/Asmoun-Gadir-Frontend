import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Button, Text, View } from "react-native";
import { useActivity } from "../../hooks/useActivity";

export default function ActivityDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { data, isLoading } = useActivity(Number(id));

  if (isLoading) return <Text>Chargement...</Text>;
  if (!data) return <Text>Activité introuvable</Text>;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>{data.title}</Text>
      <Text>{data.description}</Text>
      <Text>{data.price} MAD</Text>

      <Button
        title="Réserver"
        onPress={() => router.push(`/reserve/${data.id}`)}
      />
    </View>
  );
}
