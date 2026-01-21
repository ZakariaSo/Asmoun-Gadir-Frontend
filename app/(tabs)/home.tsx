import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
    const router = useRouter();
    const { user } = useAuthStore();

    const quickActions = [
        {
            id: 1,
            title: "Activités",
            icon: "compass-outline",
            color: "#2563eb",
            route: "/(tabs)/activities",
        },
        {
            id: 2,
            title: "Réservations",
            icon: "calendar-outline",
            color: "#3b82f6",
            route: "/(tabs)/reservations",
        },
        {
            id: 3,
            title: "Profil",
            icon: "person-outline",
            color: "#60a5fa",
            route: "/(tabs)/profil",
        },
    ];

    return (
        <LinearGradient
            colors={["#eff6ff", "#dbeafe", "#bfdbfe"]}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <SafeAreaView style={styles.container}>
                <ScrollView style={styles.scrollView}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.greeting}>Bonjour,</Text>
                            <Text style={styles.userName}>
                                {user?.name || user?.email?.split("@")[0] || "Voyageur"}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.notificationButton}
                            onPress={() => { }}
                        >
                            <Ionicons name="notifications-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Welcome Card */}
                    <View style={styles.welcomeCard}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="compass" size={40} color="#2563eb" />
                        </View>
                        <Text style={styles.welcomeTitle}>Bienvenue sur Asmoun Gadir</Text>
                        <Text style={styles.welcomeText}>
                            Découvrez les meilleures activités et hébergements d'agadir
                        </Text>
                    </View>

                    {/* Quick Actions */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Accès rapide</Text>
                        <View style={styles.actionsGrid}>
                            {quickActions.map((action) => (
                                <TouchableOpacity
                                    key={action.id}
                                    style={styles.actionCard}
                                    onPress={() => router.push(action.route as any)}
                                >
                                    <View
                                        style={[
                                            styles.actionIcon,
                                            { backgroundColor: action.color },
                                        ]}
                                    >
                                        <Ionicons name={action.icon as any} size={28} color="#fff" />
                                    </View>
                                    <Text style={styles.actionTitle}>{action.title}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Stats Card */}
                    <View style={styles.statsCard}>
                        <Text style={styles.statsTitle}>Vos statistiques</Text>
                        <View style={styles.statsGrid}>
                            <View style={styles.statItem}>
                                <Ionicons name="calendar" size={24} color="#2563eb" />
                                <Text style={styles.statNumber}>0</Text>
                                <Text style={styles.statLabel}>Réservations</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Ionicons name="heart" size={24} color="#3b82f6" />
                                <Text style={styles.statNumber}>0</Text>
                                <Text style={styles.statLabel}>Favoris</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Ionicons name="star" size={24} color="#fbbf24" />
                                <Text style={styles.statNumber}>0</Text>
                                <Text style={styles.statLabel}>Avis</Text>
                            </View>
                        </View>
                    </View>
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
    scrollView: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        paddingTop: 10,
    },
    greeting: {
        fontSize: 16,
        color: "rgba(52, 51, 51, 0.9)",
        fontWeight: "300",
    },
    userName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#000",
        marginTop: 4,
    },
    notificationButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    welcomeCard: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        margin: 20,
        marginTop: 10,
        borderRadius: 20,
        padding: 30,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 8,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    welcomeTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
        textAlign: "center",
    },
    welcomeText: {
        fontSize: 15,
        color: "#666",
        textAlign: "center",
        lineHeight: 22,
    },
    section: {
        padding: 20,
        paddingTop: 0,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 16,
    },
    actionsGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    actionCard: {
        flex: 1,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 4,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    actionIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    actionTitle: {
        fontSize: 13,
        fontWeight: "600",
        color: "#333",
        textAlign: "center",
    },
    statsCard: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        margin: 20,
        marginTop: 0,
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 8,
    },
    statsTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 16,
    },
    statsGrid: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    statItem: {
        alignItems: "center",
    },
    statNumber: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginTop: 8,
    },
    statLabel: {
        fontSize: 13,
        color: "#666",
        marginTop: 4,
    },
});
