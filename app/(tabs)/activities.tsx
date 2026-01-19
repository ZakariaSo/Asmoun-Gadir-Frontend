import { useRouter } from "expo-router";
import React from "react";
import { Button, FlatList, Text, View } from "react-native";
import { useActivities } from "../../hooks/useActivities";

export default function ActivitiesScreen() {
  const { data, isLoading, error } = useActivities();
  const router = useRouter();

  if (isLoading) return <Text>Chargement...</Text>;
  if (error) return <Text>Erreur de chargement</Text>;

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 18 }}>{item.title}</Text>
          <Text>{item.price} MAD</Text>

          <Button
            title="Voir détail"
            onPress={() => router.push(`/activity/${item.id}`)}
          />
        </View>
      )}
    />
  );
}
