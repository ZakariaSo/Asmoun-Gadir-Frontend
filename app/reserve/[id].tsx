import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useActivity } from "../../hooks/useActivity";
import { createReservation } from "../../services/reservation";
import { useAuthStore } from "../../store/authStore";

export default function ReserveScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { user } = useAuthStore();
    const queryClient = useQueryClient();
    const { data: activity, isLoading: isLoadingActivity } = useActivity(Number(id));

    const [places, setPlaces] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const totalPrice = activity ? activity.price * places : 0;

    const handleIncrement = () => {
        if (activity && places < activity.availablePlaces) {
            setPlaces(prev => prev + 1);
        }
    };

    const handleDecrement = () => {
        if (places > 1) {
            setPlaces(prev => prev - 1);
        }
    };

    const handleConfirmBooking = async () => {
        if (!user) {
            Alert.alert("Erreur", "Vous devez être connecté pour réserver.");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await createReservation({
                activityId: Number(id),
                numberOfPlaces: places,
                touristId: user.id
            });

            console.log("Réservation créée:", result);

            // Invalider le cache pour forcer le rafraîchissement
            await queryClient.invalidateQueries({ queryKey: ["myReservations"] });
            
            // Également invalider les activités si nécessaire
            await queryClient.invalidateQueries({ queryKey: ["activity", Number(id)] });

            Alert.alert(
                "Succès !",
                "Votre réservation a été enregistrée avec succès.",
                [
                    {
                        text: "Retour",
                        style: "cancel",
                        onPress: () => router.back()
                    },
                    {
                        text: "Voir mes réservations",
                        onPress: () => {
                            // Ferme l'écran actuel puis navigue
                            router.back();
                            setTimeout(() => {
                                router.push("/(tabs)/reservations");
                            }, 300);
                        }
                    }
                ]
            );
        } catch (error: any) {
            console.error("Reservation error:", error.response?.data || error.message);
            const errorMessage = error.response?.data?.message || "Une erreur est survenue lors de la réservation.";
            Alert.alert("Erreur", errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingActivity) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );
    }

    if (!activity) {
        return (
            <View style={styles.centerContainer}>
                <Text>Activité introuvable</Text>
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
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                            <Ionicons name="close" size={28} color="#1f2937" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Réserver</Text>
                        <View style={{ width: 44 }} />
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        {/* Summary Card */}
                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryLabel}>Activité sélectionnée</Text>
                            <Text style={styles.activityTitle}>{activity.title}</Text>
                            <View style={styles.divider} />
                            <View style={styles.summaryInfoRow}>
                                <View style={styles.summaryInfoItem}>
                                    <Ionicons name="calendar-outline" size={16} color="#6b7280" />
                                    <Text style={styles.summaryInfoText}>
                                        {new Date(activity.dateStart).toLocaleDateString()}
                                    </Text>
                                </View>
                                <View style={styles.summaryInfoItem}>
                                    <Ionicons name="people-outline" size={16} color="#6b7280" />
                                    <Text style={styles.summaryInfoText}>
                                        {activity.availablePlaces} places dispo.
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Quantity Selector */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Combien de personnes ?</Text>
                            <View style={styles.counterContainer}>
                                <TouchableOpacity
                                    style={[styles.counterBtn, places <= 1 && styles.counterBtnDisabled]}
                                    onPress={handleDecrement}
                                    disabled={places <= 1}
                                >
                                    <Ionicons name="remove" size={24} color={places <= 1 ? "#9ca3af" : "#2563eb"} />
                                </TouchableOpacity>

                                <View style={styles.counterValueContainer}>
                                    <Text style={styles.counterValue}>{places}</Text>
                                    <Text style={styles.counterLabel}>{places > 1 ? "Personnes" : "Personne"}</Text>
                                </View>

                                <TouchableOpacity
                                    style={[styles.counterBtn, places >= activity.availablePlaces && styles.counterBtnDisabled]}
                                    onPress={handleIncrement}
                                    disabled={places >= activity.availablePlaces}
                                >
                                    <Ionicons name="add" size={24} color={places >= activity.availablePlaces ? "#9ca3af" : "#2563eb"} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Price Breakdown */}
                        <View style={styles.priceCard}>
                            <Text style={styles.priceTitle}>Récapitulatif</Text>
                            <View style={styles.priceRow}>
                                <Text style={styles.priceLabel}>{places} x {activity.price} MAD</Text>
                                <Text style={styles.priceValue}>{totalPrice} MAD</Text>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>Total à payer</Text>
                                <Text style={styles.totalValue}>{totalPrice} MAD</Text>
                            </View>
                        </View>
                    </ScrollView>

                    {/* Bottom Action */}
                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.confirmButton, isSubmitting && styles.disabledButton]}
                            onPress={handleConfirmBooking}
                            disabled={isSubmitting}
                        >
                            <LinearGradient
                                colors={["#2563eb", "#3b82f6"]}
                                style={styles.confirmButtonGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.confirmButtonText}>Confirmer la réservation</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
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
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1f2937",
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        justifyContent: "center",
        alignItems: "center",
    },
    scrollContent: {
        padding: 20,
    },
    summaryCard: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
    },
    summaryLabel: {
        fontSize: 12,
        color: "#6b7280",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 8,
    },
    activityTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1f2937",
        marginBottom: 12,
    },
    divider: {
        height: 1,
        backgroundColor: "#e5e7eb",
        marginVertical: 12,
    },
    summaryInfoRow: {
        flexDirection: "row",
        gap: 20,
    },
    summaryInfoItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    summaryInfoText: {
        fontSize: 14,
        color: "#4b5563",
    },
    section: {
        marginBottom: 32,
        alignItems: "center",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1f2937",
        marginBottom: 20,
    },
    counterContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderRadius: 24,
        padding: 12,
        width: "100%",
        justifyContent: "space-between",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    counterBtn: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    counterBtnDisabled: {
        backgroundColor: "#f3f4f6",
        opacity: 0.5,
    },
    counterValueContainer: {
        alignItems: "center",
    },
    counterValue: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#1f2937",
    },
    counterLabel: {
        fontSize: 12,
        color: "#6b7280",
        marginTop: -4,
    },
    priceCard: {
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.5)",
    },
    priceTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#1f2937",
        marginBottom: 16,
    },
    priceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    priceLabel: {
        color: "#6b7280",
        fontSize: 15,
    },
    priceValue: {
        fontWeight: "600",
        color: "#1f2937",
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#1f2937",
    },
    totalValue: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#2563eb",
    },
    footer: {
        padding: 20,
        backgroundColor: "transparent",
    },
    confirmButton: {
        borderRadius: 18,
        overflow: "hidden",
        shadowColor: "#2563eb",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    disabledButton: {
        opacity: 0.7,
    },
    confirmButtonGradient: {
        paddingVertical: 18,
        alignItems: "center",
        justifyContent: "center",
    },
    confirmButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});