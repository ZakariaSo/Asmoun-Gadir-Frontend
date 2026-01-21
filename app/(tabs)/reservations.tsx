import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMyReservations } from "../../hooks/useMyReservations";
import { Reservation } from "../../types/reservation";

const getStatusColor = (status: string) => {
  const s = status?.toLowerCase();
  switch (s) {
    case "confirmed":
    case "confirmé":
    case "confirme":
      return "#10b981";
    case "pending":
    case "en_attente":
    case "en attente":
      return "#f59e0b";
    case "cancelled":
    case "annulé":
    case "annule":
      return "#ef4444";
    default:
      return "#6b7280";
  }
};

const getStatusLabel = (status: string) => {
  const s = status?.toLowerCase();
  switch (s) {
    case "confirmed":
    case "confirmé":
    case "confirme":
      return "Confirmée";
    case "pending":
    case "en_attente":
    case "en attente":
      return "En attente";
    case "cancelled":
    case "annulé":
    case "annule":
      return "Annulée";
    default:
      return status;
  }
};

const getStatusIcon = (status: string) => {
  const s = status?.toLowerCase();
  switch (s) {
    case "confirmed":
    case "confirmé":
    case "confirme":
      return "checkmark-circle";
    case "pending":
    case "en_attente":
    case "en attente":
      return "time";
    case "cancelled":
    case "annulé":
    case "annule":
      return "close-circle";
    default:
      return "help-circle";
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const ReservationCard = ({ item }: { item: Reservation }) => {
  const statusColor = getStatusColor(item.status);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.reservationNumber}>
          <Ionicons name="ticket-outline" size={20} color="#2563eb" />
          <Text style={styles.reservationId}>
            {item.activity?.title || `Réservation #${item.id}`}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
          <Ionicons name={getStatusIcon(item.status) as any} size={14} color={statusColor} />
          <Text style={[styles.statusText, { color: statusColor }]}>
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="people-outline" size={18} color="#2563eb" />
            </View>
            <View>
              <Text style={styles.infoLabel}>Places</Text>
              <Text style={styles.infoValue}>{item.numberOfPlaces}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="wallet-outline" size={18} color="#2563eb" />
            </View>
            <View>
              <Text style={styles.infoLabel}>Total</Text>
              <Text style={styles.infoValue}>{item.totalPrice} MAD</Text>
            </View>
          </View>
        </View>

        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={16} color="#6b7280" />
          <Text style={styles.dateText}>
            Réservé le {formatDate(item.createdAt)}
          </Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Voir détails</Text>
          <Ionicons name="chevron-forward" size={16} color="#2563eb" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const LoadingState = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#2563eb" />
    <Text style={styles.loadingText}>Chargement de vos réservations...</Text>
  </View>
);

export default function ReservationsScreen() {
  const router = useRouter();
  const { data, isLoading, refetch, isRefetching } = useMyReservations();


  useFocusEffect(
    useCallback(() => {
      console.log("ReservationsScreen focused - refreshing data");
      refetch();
    }, [refetch])
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="calendar-outline" size={80} color="#bfdbfe" />
      </View>
      <Text style={styles.emptyTitle}>Aucune réservation</Text>
      <Text style={styles.emptyText}>
        Vous n'avez pas encore effectué de réservation. Explorez nos activités pour commencer !
      </Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => router.push("/(tabs)/home")}
      >
        <LinearGradient
          colors={["#2563eb", "#3b82f6"]}
          style={styles.exploreButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Ionicons name="compass-outline" size={20} color="#fff" />
          <Text style={styles.exploreButtonText}>Explorer les activités</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient
      colors={["#eff6ff", "#dbeafe", "#bfdbfe"]}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mes Réservations</Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={() => refetch()}
          >
            <Ionicons name="refresh-outline" size={24} color="#2563eb" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        {isLoading ? (
          <LoadingState />
        ) : !data || data.length === 0 ? (
          <EmptyState />
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <ReservationCard item={item} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetch}
                tintColor="#2563eb"
              />
            }
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  reservationNumber: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reservationId: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  cardContent: {
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(37, 99, 235, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 12,
  },
  dateText: {
    fontSize: 14,
    color: "#6b7280",
  },
  cardActions: {
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    padding: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563eb",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  exploreButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  exploreButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
  },
});