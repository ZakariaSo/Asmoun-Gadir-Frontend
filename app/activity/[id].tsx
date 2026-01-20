import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useActivity } from "../../hooks/useActivity";

const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function ActivityDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { data, isLoading, error } = useActivity(Number(id));

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Chargement de l'activité...</Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
        <Text style={styles.errorText}>Activité introuvable</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <LinearGradient
        colors={["#eff6ff", "#dbeafe", "#bfdbfe"]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>Détails</Text>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="share-social-outline" size={24} color="#1f2937" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Category & Status */}
          <View style={styles.badgeRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{data.category}</Text>
            </View>
            {data.availablePlaces === 0 && (
              <View style={styles.fullBadge}>
                <Text style={styles.fullBadgeText}>Complet</Text>
              </View>
            )}
          </View>

          {/* Title */}
          <Text style={styles.title}>{data.title}</Text>

          {/* Quick Info Grid */}
          <View style={styles.infoGrid}>
            <View style={styles.infoBox}>
              <Ionicons name="calendar" size={20} color="#2563eb" />
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>{formatDate(data.dateStart)}</Text>
            </View>
            <View style={styles.infoBox}>
              <Ionicons name="time" size={20} color="#2563eb" />
              <Text style={styles.infoLabel}>Durée</Text>
              <Text style={styles.infoValue}>{formatDuration(data.duration)}</Text>
            </View>
            <View style={styles.infoBox}>
              <Ionicons name="location" size={20} color="#2563eb" />
              <Text style={styles.infoLabel}>Point de rencontre</Text>
              <Text style={styles.infoValue}>{data.meetingPoint}</Text>
            </View>
            <View style={styles.infoBox}>
              <Ionicons name="people" size={20} color="#2563eb" />
              <Text style={styles.infoLabel}>Disponibilité</Text>
              <Text style={styles.infoValue}>{data.availablePlaces} / {data.totalPlaces} places</Text>
            </View>
          </View>

          {/* Description Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{data.description}</Text>
          </View>
        </ScrollView>

        {/* Footer / Booking Bar */}
        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Prix total</Text>
            <Text style={styles.price}>{data.price} <Text style={styles.currency}>MAD</Text></Text>
          </View>
          <TouchableOpacity
            style={[styles.bookButton, data.availablePlaces === 0 && styles.disabledButton]}
            onPress={() => router.push(`/reserve/${data.id}`)}
            disabled={data.availablePlaces === 0}
          >
            <LinearGradient
              colors={data.availablePlaces === 0 ? ["#9ca3af", "#6b7280"] : ["#2563eb", "#3b82f6"]}
              style={styles.bookButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.bookButtonText}>
                {data.availablePlaces === 0 ? "Complet" : "Réserver maintenant"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6b7280",
  },
  errorText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
  },
  backButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: "#2563eb",
    borderRadius: 10,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 10,
  },
  iconButton: {
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
    elevation: 2,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  categoryBadge: {
    backgroundColor: "rgba(37, 99, 235, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(37, 99, 235, 0.2)",
  },
  categoryText: {
    color: "#2563eb",
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  fullBadge: {
    backgroundColor: "#fee2e2",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  fullBadgeText: {
    color: "#ef4444",
    fontSize: 14,
    fontWeight: "600",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 24,
    lineHeight: 34,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 32,
  },
  infoBox: {
    width: "48%",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  infoLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 8,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1f2937",
  },
  section: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#4b5563",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 13,
    color: "#6b7280",
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1f2937",
  },
  currency: {
    fontSize: 14,
    color: "#6b7280",
  },
  bookButton: {
    flex: 1.5,
    borderRadius: 16,
    overflow: "hidden",
    marginLeft: 20,
  },
  disabledButton: {
    opacity: 0.8,
  },
  bookButtonGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
