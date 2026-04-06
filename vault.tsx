import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppHeader from "@/components/AppHeader";
import ContentCard from "@/components/ContentCard";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function VaultScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { posts } = useApp();

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const vaultPosts = posts.filter((p) => p.views >= 2000 || p.fires >= 200);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 13,
      fontFamily: "Inter_700Bold",
      color: colors.mutedForeground,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    badge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: colors.primary + "22",
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 20,
    },
    badgeText: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
    },
    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 80,
    },
    emptyText: {
      fontSize: 16,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
      marginTop: 12,
    },
    emptySubText: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 4,
    },
    listContent: {
      paddingBottom: bottomPad + 16,
      paddingTop: 8,
    },
    sectionText: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      paddingHorizontal: 20,
      paddingBottom: 8,
      lineHeight: 18,
    },
  });

  return (
    <View style={styles.container}>
      <AppHeader />
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Content Vault</Text>
        <View style={styles.badge}>
          <Feather name="archive" size={11} color={colors.primary} />
          <Text style={styles.badgeText}>{vaultPosts.length} clips</Text>
        </View>
      </View>
      <FlatList
        data={vaultPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ContentCard post={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          vaultPosts.length > 0 ? (
            <Text style={styles.sectionText}>
              Top-performing content permanently archived here.
            </Text>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="archive" size={40} color={colors.mutedForeground} />
            <Text style={styles.emptyText}>Vault is empty</Text>
            <Text style={styles.emptySubText}>
              Top-performing content appears here.
            </Text>
          </View>
        }
      />
    </View>
  );
}
