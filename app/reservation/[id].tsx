import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useReservation } from "../../hooks/useReservation";
import { deleteReservation, updateReservation } from "../../services/reservation";

export default function ReservationDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { data: reservation, isLoading, error } = useReservation(Number(id));

    const [places, setPlaces] = useState(1);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (reservation) {
            setPlaces(reservation.numberOfPlaces);
        }
    }, [reservation]);

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );
    }

    if (error || !reservation) {
        return (
            <View style={styles.centerContainer}>
                <Ionicons name="alert-circle-outline" size={60} color="#ef4444" />
                <Text style={styles.errorText}>Erreur lors de la récupération de la réservation</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>Retour</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleUpdate = async () => {
        if (places === reservation.numberOfPlaces) {
            Alert.alert("Info", "Le nombre de places est déjà de " + places);
            return;
        }

        setIsUpdating(true);
        try {
            await updateReservation(Number(id), { numberOfPlaces: places });
            await queryClient.invalidateQueries({ queryKey: ["reservation", Number(id)] });
            await queryClient.invalidateQueries({ queryKey: ["myReservations"] });
            Alert.alert("Succès", "La réservation a été mise à jour.");
        } catch (e: any) {
            console.error("Update error:", e);
            const errorMsg = e.response?.data?.message || e.response?.data || e.message || "Erreur inconnue";
            Alert.alert("Erreur", `Impossible de mettre à jour la réservation: ${errorMsg}`);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            "Annuler la réservation",
            "Êtes-vous sûr de vouloir annuler cette réservation ?",
            [
                { text: "Non", style: "cancel" },
                {
                    text: "Oui, annuler",
                    style: "destructive",
                    onPress: async () => {
                        setIsDeleting(true);
                        try {
                            await deleteReservation(Number(id));
                            await queryClient.invalidateQueries({ queryKey: ["myReservations"] });
                            router.back();
                        } catch (e: any) {
                            console.error("Delete error:", e);
                            const errorMsg = e.response?.data?.message || e.response?.data || e.message || "Erreur inconnue";
                            Alert.alert("Erreur", `Impossible de supprimer la réservation: ${errorMsg}`);
                        } finally {
                            setIsDeleting(false);
                        }
                    },
                },
            ]
        );
    };

    return (
        <LinearGradient
            colors={["#eff6ff", "#dbeafe", "#bfdbfe"]}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                        <Ionicons name="arrow-back" size={24} color="#2563eb" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Détails Réservation</Text>
                    <View style={{ width: 44 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Activity Title Card */}
                    <View style={styles.card}>
                        <Text style={styles.activityTitle}>{reservation.activity?.title}</Text>
                        <View style={styles.statusRow}>
                            <View style={[styles.badge, { backgroundColor: "#dbeafe" }]}>
                                <Text style={styles.badgeText}>
                                    ID: #{reservation.id}
                                </Text>
                            </View>
                            <View style={[styles.badge, { backgroundColor: "#dcfce7" }]}>
                                <Text style={[styles.badgeText, { color: "#166534" }]}>
                                    {reservation.status}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Modification Card */}
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Modifier la réservation</Text>
                        <Text style={styles.label}>Nombre de places</Text>
                        <View style={styles.counterContainer}>
                            <TouchableOpacity
                                style={styles.counterButton}
                                onPress={() => setPlaces(Math.max(1, places - 1))}
                            >
                                <Ionicons name="remove" size={24} color="#2563eb" />
                            </TouchableOpacity>
                            <Text style={styles.counterText}>{places}</Text>
                            <TouchableOpacity
                                style={styles.counterButton}
                                onPress={() => setPlaces(places + 1)}
                            >
                                <Ionicons name="add" size={24} color="#2563eb" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.updateButton,
                                isUpdating && styles.disabledButton,
                            ]}
                            onPress={handleUpdate}
                            disabled={isUpdating}
                        >
                            <Text style={styles.updateButtonText}>
                                {isUpdating ? "Mise à jour..." : "Enregistrer les modifications"}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Summary Card */}
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Récapitulatif</Text>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Prix unitaire :</Text>
                            <Text style={styles.summaryValue}>{reservation.activity?.price} MAD</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Total :</Text>
                            <Text style={[styles.summaryValue, styles.totalText]}>
                                {reservation.activity?.price * places} MAD
                            </Text>
                        </View>
                    </View>

                    {/* Actions */}
                    <TouchableOpacity
                        style={[styles.deleteButton, isDeleting && styles.disabledButton]}
                        onPress={handleDelete}
                        disabled={isDeleting}
                    >
                        <Ionicons name="trash-outline" size={20} color="#fff" />
                        <Text style={styles.deleteButtonText}>
                            {isDeleting ? "Annulation..." : "Annuler la réservation"}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
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
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1f2937",
    },
    scrollContent: {
        padding: 20,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 24,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
    },
    activityTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#1f2937",
        marginBottom: 12,
    },
    statusRow: {
        flexDirection: "row",
        gap: 8,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#2563eb",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#374151",
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: "#6b7280",
        marginBottom: 12,
    },
    counterContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 30,
        marginBottom: 24,
    },
    counterButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#f3f4f6",
        justifyContent: "center",
        alignItems: "center",
    },
    counterText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1f2937",
    },
    updateButton: {
        backgroundColor: "#2563eb",
        borderRadius: 15,
        paddingVertical: 16,
        alignItems: "center",
    },
    updateButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 15,
        color: "#6b7280",
    },
    summaryValue: {
        fontSize: 15,
        fontWeight: "600",
        color: "#1f2937",
    },
    totalText: {
        fontSize: 18,
        color: "#2563eb",
        fontWeight: "bold",
    },
    deleteButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: "#ef4444",
        borderRadius: 15,
        paddingVertical: 16,
        marginTop: 10,
    },
    deleteButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    disabledButton: {
        opacity: 0.5,
    },
    errorText: {
        fontSize: 16,
        color: "#ef4444",
        textAlign: "center",
        marginVertical: 20,
    },
    backButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: "#2563eb",
        borderRadius: 10,
    },
    backButtonText: {
        color: "#fff",
        fontWeight: "600",
    },
});
