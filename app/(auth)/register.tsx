import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { register } from "../../services/auth";

export default function RegisterScreen() {
  const { control, handleSubmit } = useForm();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"tourist" | "accommodation">("tourist");

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const payload = { ...data, role: selectedRole };

      const res = await register(payload);

      router.replace("/(auth)/login");
    } catch (error: any) {
      console.error("Registration error:", error);
      alert("Erreur inscription");
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#eff6ff", "#dbeafe", "#bfdbfe"]}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Ionicons name="person-add" size={60} color="#1f22e4ff" />
              </View>
              <Text style={styles.title}>Rejoignez-nous</Text>
              <Text style={styles.subtitle}>Créez votre compte maintenant</Text>
            </View>

            {/* Form Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Inscription</Text>

              {/* Name Input */}
              <Controller
                control={control}
                name="name"
                rules={{ required: true }}
                render={({ field }) => (
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color="#2563eb"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Nom complet"
                      placeholderTextColor="#999"
                      onChangeText={field.onChange}
                      value={field.value}
                      autoCapitalize="words"
                    />
                  </View>
                )}
              />

              {/* Email Input */}
              <Controller
                control={control}
                name="email"
                rules={{ required: true }}
                render={({ field }) => (
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color="#2563eb"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      placeholderTextColor="#999"
                      onChangeText={field.onChange}
                      value={field.value}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                    />
                  </View>
                )}
              />

              {/* Password Input */}
              <Controller
                control={control}
                name="password"
                rules={{ required: true }}
                render={({ field }) => (
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color="#2563eb"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Mot de passe"
                      placeholderTextColor="#999"
                      secureTextEntry={!showPassword}
                      onChangeText={field.onChange}
                      value={field.value}
                      autoCapitalize="none"
                      autoComplete="password"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                    >
                      <Ionicons
                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                        size={20}
                        color="#999"
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />

              {/* Role Selection */}
              <Text style={styles.sectionLabel}>Type de compte</Text>
              <View style={styles.roleContainer}>
                <TouchableOpacity
                  style={[
                    styles.roleOption,
                    selectedRole === "tourist" && styles.roleOptionActive,
                  ]}
                  onPress={() => setSelectedRole("tourist")}
                >
                  <Ionicons
                    name="person"
                    size={24}
                    color={selectedRole === "tourist" ? "#fff" : "#2563eb"}
                  />
                  <Text
                    style={[
                      styles.roleOptionText,
                      selectedRole === "tourist" && styles.roleOptionTextActive,
                    ]}
                  >
                    Touriste
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.roleOption,
                    selectedRole === "accommodation" && styles.roleOptionActive,
                  ]}
                  onPress={() => setSelectedRole("accommodation")}
                >
                  <Ionicons
                    name="business"
                    size={24}
                    color={selectedRole === "accommodation" ? "#fff" : "#2563eb"}
                  />
                  <Text
                    style={[
                      styles.roleOptionText,
                      selectedRole === "accommodation" && styles.roleOptionTextActive,
                    ]}
                  >
                    Hébergement
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Terms and Conditions */}
              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                  En créant un compte, vous acceptez nos{" "}
                </Text>
                <TouchableOpacity>
                  <Text style={styles.termsLink}>conditions d'utilisation</Text>
                </TouchableOpacity>
              </View>

              {/* Register Button */}
              <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={["#2563eb", "#3b82f6"]}
                  style={styles.button}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {isLoading ? (
                    <Text style={styles.buttonText}>Inscription...</Text>
                  ) : (
                    <View style={styles.buttonContent}>
                      <Text style={styles.buttonText}>Créer un compte</Text>
                      <Ionicons name="checkmark-circle" size={20} color="#fff" />
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Login Link */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Déjà un compte ? </Text>
                <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                  <Text style={styles.loginLink}>Se connecter</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: "rgba(44, 43, 43, 0.9)",
    fontWeight: "300",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 30,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 25,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 15,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: "#333",
  },
  eyeIcon: {
    padding: 4,
  },
  termsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  termsText: {
    color: "#666",
    fontSize: 13,
    textAlign: "center",
  },
  termsLink: {
    color: "#2563eb",
    fontSize: 13,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  button: {
    borderRadius: 15,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: "#666",
    fontSize: 15,
  },
  loginLink: {
    color: "#2563eb",
    fontSize: 15,
    fontWeight: "bold",
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 10,
    marginTop: 10,
  },
  roleContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  roleOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  roleOptionActive: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  roleOptionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  roleOptionTextActive: {
    color: "#fff",
  },
});
