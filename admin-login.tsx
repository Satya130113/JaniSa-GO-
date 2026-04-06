import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const ADMIN_PASSWORD_HASH = "Satyam13JaniSa";

export default function AdminLoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setIsAdminMode } = useApp();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleLogin = async () => {
    if (!password.trim()) {
      setError("Please enter a password");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    if (password === ADMIN_PASSWORD_HASH) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsAdminMode(true);
      router.replace("/admin/");
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError("Invalid credentials");
      setPassword("");
    }
    setLoading(false);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    inner: {
      flex: 1,
      paddingHorizontal: 32,
      justifyContent: "center",
      paddingTop: topPad,
      paddingBottom: bottomPad,
    },
    closeBtn: {
      position: "absolute",
      top: topPad + 12,
      right: 20,
      padding: 8,
      zIndex: 10,
    },
    iconContainer: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: colors.primary + "22",
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      marginBottom: 24,
    },
    title: {
      fontSize: 24,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      textAlign: "center",
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      marginBottom: 40,
      lineHeight: 20,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surfaceSecondary,
      borderRadius: colors.radius,
      borderWidth: 1,
      borderColor: error ? colors.destructive : colors.border,
      marginBottom: 8,
      paddingHorizontal: 16,
    },
    input: {
      flex: 1,
      height: 52,
      fontSize: 16,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
      letterSpacing: 2,
    },
    errorText: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.destructive,
      marginBottom: 20,
    },
    loginBtn: {
      backgroundColor: colors.primary,
      borderRadius: colors.radius,
      height: 52,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 12,
    },
    loginBtnText: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: "#fff",
    },
    disclaimer: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      marginTop: 24,
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={() => router.back()}
      >
        <Feather name="x" size={22} color={colors.mutedForeground} />
      </TouchableOpacity>

      <View style={styles.inner}>
        <View style={styles.iconContainer}>
          <Feather name="shield" size={32} color={colors.primary} />
        </View>
        <Text style={styles.title}>Admin Access</Text>
        <Text style={styles.subtitle}>
          Secure admin portal for JaniSa GO content management.
        </Text>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Enter admin password"
            placeholderTextColor={colors.mutedForeground}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              setError("");
            }}
            autoCapitalize="none"
            autoCorrect={false}
            onSubmitEditing={handleLogin}
            returnKeyType="go"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{ padding: 4 }}
          >
            <Feather
              name={showPassword ? "eye-off" : "eye"}
              size={18}
              color={colors.mutedForeground}
            />
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          onPress={handleLogin}
          style={[
            styles.loginBtn,
            loading && { opacity: 0.7 },
          ]}
          disabled={loading}
        >
          <Text style={styles.loginBtnText}>
            {loading ? "Verifying..." : "Access Admin Panel"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Unauthorized access attempts are logged and monitored.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
