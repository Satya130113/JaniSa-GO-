import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppHeader from "@/components/AppHeader";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function NotificationsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { notifications, markNotificationRead, markAllRead } = useApp();

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handlePress = useCallback(
    (id: string, postId?: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      markNotificationRead(id);
      if (postId) {
        router.push({ pathname: "/content/[id]", params: { id: postId } });
      }
    },
    [markNotificationRead, router]
  );

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
    markAllBtn: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: colors.surfaceSecondary,
    },
    markAllText: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
    },
    item: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 12,
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    iconBox: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
    },
    content: { flex: 1 },
    title: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      marginBottom: 3,
    },
    body: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      lineHeight: 18,
    },
    time: {
      fontSize: 11,
      fontFamily: "Inter_400Regular",
      marginTop: 4,
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primary,
      marginTop: 4,
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
    listContent: {
      paddingBottom: bottomPad + 16,
    },
  });

  return (
    <View style={styles.container}>
      <AppHeader />
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Notifications</Text>
        {notifications.some((n) => !n.read) && (
          <TouchableOpacity onPress={markAllRead} style={styles.markAllBtn}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handlePress(item.id, item.postId)}
            style={[
              styles.item,
              {
                backgroundColor: item.read
                  ? colors.background
                  : colors.primary + "08",
              },
            ]}
          >
            <View
              style={[
                styles.iconBox,
                {
                  backgroundColor: item.read
                    ? colors.surfaceSecondary
                    : colors.primary + "22",
                },
              ]}
            >
              <Feather
                name="bell"
                size={16}
                color={item.read ? colors.mutedForeground : colors.primary}
              />
            </View>
            <View style={styles.content}>
              <Text
                style={[
                  styles.title,
                  {
                    color: item.read ? colors.foreground : colors.primary,
                  },
                ]}
              >
                {item.title}
              </Text>
              <Text
                style={[styles.body, { color: colors.mutedForeground }]}
                numberOfLines={2}
              >
                {item.body}
              </Text>
              <Text style={[styles.time, { color: colors.mutedForeground }]}>
                {timeAgo(item.createdAt)}
              </Text>
            </View>
            {!item.read && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather
              name="bell-off"
              size={40}
              color={colors.mutedForeground}
            />
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        }
      />
    </View>
  );
}
