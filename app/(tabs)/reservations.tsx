import React from "react";
import { FlatList, Text, View } from "react-native";
import { useMyReservations } from "../../hooks/useMyReservations";

export default function BookingsScreen() {
  const { data, isLoading } = useMyReservations();

  if (isLoading) return <Text>Chargement...</Text>;

  if (!data || data.length === 0) return <Text>Aucune réservation</Text>;

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={{ padding: 16 }}>
          <Text>Places : {item.numberOfPlaces}</Text>
          <Text>Total : {item.totalPrice} MAD</Text>
          <Text>Status : {item.status}</Text>
        </View>
      )}
    />
  );
}
