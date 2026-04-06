import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(n);
}

export default function AdminDashboard() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    posts,
    notifications,
    setIsAdminMode,
    deletePost,
    pinPost,
    featurePost,
  } = useApp();
  const [filter, setFilter] = useState<"all" | "featured" | "pinned">("all");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const totalViews = posts.reduce((acc, p) => acc + p.views, 0);
  const totalLikes = posts.reduce((acc, p) => acc + p.likes, 0);
  const totalFires = posts.reduce((acc, p) => acc + p.fires, 0);

  const filteredPosts =
    filter === "featured"
      ? posts.filter((p) => p.featured)
      : filter === "pinned"
      ? posts.filter((p) => p.pinned)
      : posts;

  const handleLogout = () => {
    setIsAdminMode(false);
    router.replace("/");
  };

  const handleDelete = (id: string, title: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert("Delete Post", `Delete "${title}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deletePost(id),
      },
    ]);
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      backgroundColor: colors.header,
      paddingTop: topPad,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerInner: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 14,
    },
    headerTitle: {
      fontSize: 18,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    headerSub: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.trending,
    },
    logoutBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: colors.destructive + "22",
    },
    logoutText: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
      color: colors.destructive,
    },
    statsRow: {
      flexDirection: "row",
      paddingHorizontal: 16,
      paddingVertical: 16,
      gap: 8,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 12,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    statValue: {
      fontSize: 20,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      marginTop: 4,
    },
    statLabel: {
      fontSize: 11,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    filterRow: {
      flexDirection: "row",
      paddingHorizontal: 16,
      gap: 8,
      marginBottom: 8,
    },
    filterBtn: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    filterText: {
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
    },
    newPostBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: colors.primary,
      borderRadius: 20,
      paddingHorizontal: 14,
      paddingVertical: 8,
      marginHorizontal: 16,
      marginBottom: 12,
      justifyContent: "center",
    },
    newPostText: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: "#fff",
    },
    postItem: {
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      marginHorizontal: 16,
      marginBottom: 8,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    postTitle: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      marginBottom: 4,
      flex: 1,
    },
    postMeta: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    postActionsRow: {
      flexDirection: "row",
      gap: 8,
      marginTop: 10,
    },
    actionBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 12,
    },
    actionBtnText: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
    },
    listContent: {
      paddingBottom: bottomPad + 16,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <View>
            <Text style={styles.headerTitle}>Admin Panel</Text>
            <Text style={styles.headerSub}>JaniSa GO — Admin Mode Active</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Feather name="log-out" size={14} color={colors.destructive} />
            <Text style={styles.logoutText}>Exit</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Feather name="eye" size={16} color={colors.primary} />
                <Text style={styles.statValue}>{formatCount(totalViews)}</Text>
                <Text style={styles.statLabel}>Total Views</Text>
              </View>
              <View style={styles.statCard}>
                <Feather name="heart" size={16} color={colors.like} />
                <Text style={styles.statValue}>{formatCount(totalLikes)}</Text>
                <Text style={styles.statLabel}>Likes</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={{ fontSize: 16 }}>🔥</Text>
                <Text style={styles.statValue}>{formatCount(totalFires)}</Text>
                <Text style={styles.statLabel}>Fires</Text>
              </View>
              <View style={styles.statCard}>
                <Feather name="file-text" size={16} color={colors.mutedForeground} />
                <Text style={styles.statValue}>{posts.length}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => router.push("/admin/new-post")}
              style={styles.newPostBtn}
            >
              <Feather name="plus" size={16} color="#fff" />
              <Text style={styles.newPostText}>Create New Post</Text>
            </TouchableOpacity>

            <View style={styles.filterRow}>
              {(["all", "featured", "pinned"] as const).map((f) => (
                <TouchableOpacity
                  key={f}
                  onPress={() => setFilter(f)}
                  style={[
                    styles.filterBtn,
                    {
                      backgroundColor:
                        filter === f
                          ? colors.primary + "22"
                          : colors.surfaceSecondary,
                      borderWidth: filter === f ? 1 : 0,
                      borderColor: colors.primary,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      {
                        color:
                          filter === f ? colors.primary : colors.mutedForeground,
                      },
                    ]}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.postItem}>
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
              <Text style={styles.postTitle} numberOfLines={2}>
                {item.title}
              </Text>
            </View>
            <Text style={styles.postMeta}>
              {item.category.toUpperCase()} · {item.type} · {item.views} views
            </Text>
            <View style={styles.postActionsRow}>
              <TouchableOpacity
                onPress={() => featurePost(item.id, !item.featured)}
                style={[
                  styles.actionBtn,
                  {
                    backgroundColor: item.featured
                      ? colors.primary + "22"
                      : colors.surfaceSecondary,
                  },
                ]}
              >
                <Feather
                  name="star"
                  size={12}
                  color={item.featured ? colors.primary : colors.mutedForeground}
                />
                <Text
                  style={[
                    styles.actionBtnText,
                    {
                      color: item.featured ? colors.primary : colors.mutedForeground,
                    },
                  ]}
                >
                  {item.featured ? "Unfeature" : "Feature"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => pinPost(item.id, !item.pinned)}
                style={[
                  styles.actionBtn,
                  {
                    backgroundColor: item.pinned
                      ? colors.accent + "22"
                      : colors.surfaceSecondary,
                  },
                ]}
              >
                <Feather
                  name="bookmark"
                  size={12}
                  color={item.pinned ? colors.accent : colors.mutedForeground}
                />
                <Text
                  style={[
                    styles.actionBtnText,
                    {
                      color: item.pinned ? colors.accent : colors.mutedForeground,
                    },
                  ]}
                >
                  {item.pinned ? "Unpin" : "Pin"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(item.id, item.title)}
                style={[
                  styles.actionBtn,
                  { backgroundColor: colors.destructive + "18" },
                ]}
              >
                <Feather name="trash-2" size={12} color={colors.destructive} />
                <Text
                  style={[styles.actionBtnText, { color: colors.destructive }]}
                >
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}
