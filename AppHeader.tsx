import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const HEADER_CONTENT_HEIGHT = 54;

export default function AppHeader() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    unreadCount,
    isDarkMode,
    toggleDarkMode,
    logoTapCount,
    incrementLogoTap,
    resetLogoTap,
    setIsAdminMode,
    isAdminMode,
  } = useApp();

  const topPad =
    Platform.OS === "web" ? 67 : insets.top;

  const handleLogoPress = () => {
    const newCount = logoTapCount + 1;
    incrementLogoTap();
    if (newCount >= 10) {
      resetLogoTap();
      router.push("/admin-login");
    }
  };

  const styles = StyleSheet.create({
    header: {
      backgroundColor: colors.header,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingTop: topPad,
    },
    inner: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      height: HEADER_CONTENT_HEIGHT,
    },
    logoArea: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    logoText: {
      fontSize: 20,
      fontFamily: "Inter_700Bold",
      color: colors.primary,
      letterSpacing: -0.5,
    },
    logoSub: {
      fontSize: 10,
      fontFamily: "Inter_600SemiBold",
      color: colors.mutedForeground,
      letterSpacing: 2,
      textTransform: "uppercase",
      marginTop: -2,
    },
    iconRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    iconBtn: {
      padding: 8,
      borderRadius: 20,
      position: "relative",
    },
    badge: {
      position: "absolute",
      top: 4,
      right: 4,
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    badgeText: {
      fontSize: 8,
      fontFamily: "Inter_700Bold",
      color: "#fff",
    },
    adminDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.trending,
      marginLeft: 4,
    },
  });

  return (
    <View style={styles.header}>
      <View style={styles.inner}>
        <TouchableOpacity onPress={handleLogoPress} style={styles.logoArea} activeOpacity={0.7}>
          <View>
            <Text style={styles.logoText}>JaniSa GO</Text>
            <Text style={styles.logoSub}>Broadcasting</Text>
          </View>
          {isAdminMode && <View style={styles.adminDot} />}
        </TouchableOpacity>

        <View style={styles.iconRow}>
          <TouchableOpacity
            onPress={toggleDarkMode}
            style={styles.iconBtn}
          >
            <Feather
              name={isDarkMode ? "sun" : "moon"}
              size={20}
              color={colors.foreground}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(tabs)/notifications")}
            style={styles.iconBtn}
          >
            <Feather name="bell" size={20} color={colors.foreground} />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {isAdminMode && (
            <TouchableOpacity
              onPress={() => router.push("/admin/")}
              style={styles.iconBtn}
            >
              <Feather name="shield" size={20} color={colors.trending} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

export { HEADER_CONTENT_HEIGHT };
