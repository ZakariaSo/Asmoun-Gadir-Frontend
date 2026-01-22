import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProfile } from "../../hooks/useProfile";

export default function ProfilScreen() {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const { refetch, isRefetching } = useProfile();

    const handleLogout = () => {
        Alert.alert(
            "Déconnexion",
            "Êtes-vous sûr de vouloir vous déconnecter ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Déconnexion",
                    style: "destructive",
                    onPress: () => {
                        logout();
                        router.replace("/(auth)/login");
                    },
                },
            ]
        );
    };

    const menuItems = [
        {
            id: 1,
            title: "Mes informations",
            icon: "person-outline",
            color: "#2563eb",
        },
        {
            id: 2,
            title: "Mes réservations",
            icon: "calendar-outline",
            color: "#3b82f6",
            route: "/(tabs)/reservations",
        },
        {
            id: 3,
            title: "Favoris",
            icon: "heart-outline",
            color: "#60a5fa",
        },
        {
            id: 4,
            title: "Paramètres",
            icon: "settings-outline",
            color: "#2563eb",
        },
        {
            id: 5,
            title: "Aide & Support",
            icon: "help-circle-outline",
            color: "#3b82f6",
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
                <ScrollView
                    style={styles.scrollView}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefetching}
                            onRefresh={() => refetch()}
                            tintColor="#2563eb"
                        />
                    }
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Mon Profil</Text>
                    </View>

                    {/* Profile Card */}
                    <View style={styles.profileCard}>
                        <View style={styles.avatarContainer}>
                            <View style={styles.avatar}>
                                <Ionicons name="person" size={50} color="#2563eb" />
                            </View>
                            <View style={styles.statusBadge}>
                                <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                            </View>
                        </View>
                        <Text style={styles.userName}>
                            {user?.name || user?.email?.split("@")[0] || "Utilisateur"}
                        </Text>
                        <Text style={styles.userEmail}>{user?.email || ""}</Text>
                        <View style={styles.roleBadge}>
                            <Text style={styles.roleText}>
                                {user?.role === "accommodation" ? "Prestataire Hébergement" :
                                    user?.role === "tourist" ? "Touriste" :
                                        user?.role || "Utilisateur"}
                            </Text>
                        </View>
                    </View>

                    {/* Menu Items */}
                    <View style={styles.menuSection}>
                        {menuItems.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.menuItem}
                                onPress={() => item.route && router.push(item.route as any)}
                            >
                                <View style={styles.menuItemLeft}>
                                    <View
                                        style={[styles.menuIcon, { backgroundColor: item.color }]}
                                    >
                                        <Ionicons name={item.icon as any} size={22} color="#fff" />
                                    </View>
                                    <Text style={styles.menuItemText}>{item.title}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#999" />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Logout Button */}
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={24} color="#ef4444" />
                        <Text style={styles.logoutText}>Déconnexion</Text>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Version 1.0.0</Text>
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
        padding: 20,
        paddingTop: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#000",
    },
    profileCard: {
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
    avatarContainer: {
        position: "relative",
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: "#2563eb",
    },
    statusBadge: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#fff",
        borderRadius: 12,
    },
    userName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4,
        textTransform: "capitalize",
    },
    userEmail: {
        fontSize: 15,
        color: "#666",
        marginBottom: 12,
    },
    roleBadge: {
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
    },
    roleText: {
        color: "#2563eb",
        fontSize: 13,
        fontWeight: "600",
    },
    menuSection: {
        margin: 20,
        marginTop: 0,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    menuItemLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    menuIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },
    menuItemText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        margin: 20,
        marginTop: 10,
        borderRadius: 16,
        padding: 18,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#ef4444",
        marginLeft: 8,
    },
    footer: {
        alignItems: "center",
        padding: 20,
    },
    footerText: {
        fontSize: 13,
        color: "rgba(255, 255, 255, 0.7)",
    },
});
