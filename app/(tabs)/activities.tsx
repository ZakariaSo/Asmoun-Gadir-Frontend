import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useActivities } from "../../hooks/useActivities";
import { Activity } from "../../types/activity";

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "adventure":
    case "aventure":
      return "compass";
    case "culture":
    case "cultural":
      return "library";
    case "nature":
      return "leaf";
    case "sport":
    case "sports":
      return "fitness";
    case "food":
    case "gastronomie":
      return "restaurant";
    case "music":
    case "musique":
      return "musical-notes";
    case "beach":
    case "plage":
      return "sunny";
    case "desert":
      return "sunny-outline";
    case "city":
    case "ville":
      return "business";
    default:
      return "star";
  }
};

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case "adventure":
    case "aventure":
      return "#f59e0b";
    case "culture":
    case "cultural":
      return "#8b5cf6";
    case "nature":
      return "#10b981";
    case "sport":
    case "sports":
      return "#ef4444";
    case "food":
    case "gastronomie":
      return "#f97316";
    case "music":
    case "musique":
      return "#ec4899";
    case "beach":
    case "plage":
      return "#06b6d4";
    case "desert":
      return "#eab308";
    case "city":
    case "ville":
      return "#6366f1";
    default:
      return "#2563eb";
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
};

const ActivityCard = ({ item, onPress }: { item: Activity; onPress: () => void }) => {
  const categoryColor = getCategoryColor(item.category);
  const placesLeft = item.availablePlaces;
  const isAlmostFull = placesLeft <= 3 && placesLeft > 0;
  const isFull = placesLeft === 0 || item.status === "full";

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      {/* Category Header */}
      <View style={[styles.categoryHeader, { backgroundColor: categoryColor }]}>
        <View style={styles.categoryInfo}>
          <Ionicons name={getCategoryIcon(item.category) as any} size={20} color="#fff" />
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        {isFull ? (
          <View style={styles.fullBadge}>
            <Text style={styles.fullBadgeText}>Complet</Text>
          </View>
        ) : isAlmostFull ? (
          <View style={styles.almostFullBadge}>
            <Text style={styles.almostFullText}>Plus que {placesLeft}!</Text>
          </View>
        ) : null}
      </View>

      {/* Content */}
      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>

        {/* Info Grid */}
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={16} color="#6b7280" />
            <Text style={styles.infoText}>{formatDate(item.dateStart)}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={16} color="#6b7280" />
            <Text style={styles.infoText}>{formatDuration(item.duration)}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="location-outline" size={16} color="#6b7280" />
            <Text style={styles.infoText} numberOfLines={1}>{item.meetingPoint}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="people-outline" size={16} color="#6b7280" />
            <Text style={styles.infoText}>{item.availablePlaces}/{item.totalPlaces} places</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.cardFooter}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>À partir de</Text>
            <Text style={styles.price}>{item.price} <Text style={styles.currency}>MAD</Text></Text>
          </View>
          <TouchableOpacity
            style={[styles.bookButton, isFull && styles.bookButtonDisabled]}
            disabled={isFull}
            onPress={onPress}
          >
            <LinearGradient
              colors={isFull ? ["#9ca3af", "#9ca3af"] : ["#2563eb", "#3b82f6"]}
              style={styles.bookButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.bookButtonText}>
                {isFull ? "Complet" : "Réserver"}
              </Text>
              {!isFull && <Ionicons name="arrow-forward" size={16} color="#fff" />}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const EmptyState = () => (
  <View style={styles.emptyContainer}>
    <View style={styles.emptyIconContainer}>
      <Ionicons name="compass-outline" size={80} color="#bfdbfe" />
    </View>
    <Text style={styles.emptyTitle}>Aucune activité disponible</Text>
    <Text style={styles.emptyText}>
      De nouvelles activités seront bientôt disponibles. Revenez plus tard !
    </Text>
  </View>
);

const LoadingState = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#2563eb" />
    <Text style={styles.loadingText}>Chargement des activités...</Text>
  </View>
);

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <View style={styles.emptyContainer}>
    <View style={styles.emptyIconContainer}>
      <Ionicons name="cloud-offline-outline" size={80} color="#fca5a5" />
    </View>
    <Text style={styles.emptyTitle}>Erreur de chargement</Text>
    <Text style={styles.emptyText}>
      Impossible de charger les activités. Vérifiez votre connexion internet.
    </Text>
    <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
      <Ionicons name="refresh" size={20} color="#2563eb" />
      <Text style={styles.retryText}>Réessayer</Text>
    </TouchableOpacity>
  </View>
);

export default function ActivitiesScreen() {
  const { data, isLoading, error, refetch, isRefetching } = useActivities();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = data?.filter((activity) =>
    activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const publishedActivities = filteredData?.filter(
    (activity) => activity.status === "published" || activity.status === "full"
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
          <View>
            <Text style={styles.headerTitle}>Activités</Text>
            <Text style={styles.headerSubtitle}>
              Découvrez nos expériences uniques
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#6b7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher une activité..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Content */}
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState onRetry={refetch} />
        ) : !publishedActivities || publishedActivities.length === 0 ? (
          <EmptyState />
        ) : (
          <FlatList
            data={publishedActivities}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ActivityCard
                item={item}
                onPress={() => router.push(`/activity/${item.id}`)}
              />
            )}
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
    padding: 20,
    paddingTop: 10,
    paddingBottom: 0,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#6b7280",
    marginTop: 4,
  },
  searchContainer: {
    padding: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1f2937",
  },
  listContent: {
    padding: 20,
    paddingTop: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    overflow: "hidden",
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    textTransform: "capitalize",
  },
  fullBadge: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  fullBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  almostFullBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  almostFullText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  cardContent: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    width: "45%",
  },
  infoText: {
    fontSize: 13,
    color: "#6b7280",
    flex: 1,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: "#9ca3af",
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
  },
  currency: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  bookButton: {
    borderRadius: 14,
    overflow: "hidden",
  },
  bookButtonDisabled: {
    opacity: 0.7,
  },
  bookButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  bookButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
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
    marginBottom: 24,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  retryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2563eb",
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
