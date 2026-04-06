import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PollCard from "@/components/PollCard";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const CATEGORY_LABELS: Record<string, string> = {
  all: "General",
  brawlstars: "Brawl Stars",
  bgmi: "BGMI",
  mlbb: "MLBB",
  others: "Others",
};

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(n);
}

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function ContentDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { posts, toggleReaction, userReactions } = useApp();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const post = posts.find((p) => p.id === id);
  const reactions = userReactions[id ?? ""] ?? new Set();

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: 16,
      paddingTop: topPad + 8,
      paddingBottom: 12,
      backgroundColor: colors.header,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backBtn: {
      padding: 4,
    },
    headerTitle: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      flex: 1,
    },
    scrollContent: {
      paddingBottom: bottomPad + 32,
    },
    thumbnail: {
      width: "100%",
      height: 220,
      backgroundColor: colors.surfaceSecondary,
    },
    body: {
      padding: 20,
    },
    categoryRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 12,
    },
    catBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
      backgroundColor: colors.primary + "22",
    },
    catText: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    trendingBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
      backgroundColor: colors.trending + "22",
    },
    trendingText: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      color: colors.trending,
    },
    title: {
      fontSize: 22,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      marginBottom: 10,
      lineHeight: 30,
    },
    description: {
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 23,
      marginBottom: 20,
    },
    metricsRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.border,
      marginBottom: 16,
    },
    metricItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
    metricText: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
    },
    timestamp: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginLeft: "auto" as any,
    },
    reactionRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 20,
    },
    reactionBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
    },
    reactionBtnText: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
    },
    openLinkBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: colors.primary,
      borderRadius: colors.radius,
      paddingVertical: 14,
      justifyContent: "center",
      marginTop: 8,
    },
    openLinkText: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: "#fff",
    },
    roomCodeBox: {
      backgroundColor: colors.surfaceSecondary,
      borderRadius: colors.radius,
      padding: 16,
      marginBottom: 16,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    roomCodeLabel: {
      fontSize: 12,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
    },
    roomCode: {
      fontSize: 20,
      fontFamily: "Inter_700Bold",
      color: colors.accent,
      letterSpacing: 3,
    },
    notFoundText: {
      fontSize: 16,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
      textAlign: "center",
      marginTop: 80,
    },
  });

  if (!post) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post Not Found</Text>
        </View>
        <Text style={styles.notFoundText}>This post could not be found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {post.title}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {post.thumbnail && (
          <Image
            source={
              typeof post.thumbnail === "string"
                ? { uri: post.thumbnail }
                : post.thumbnail
            }
            style={styles.thumbnail}
            resizeMode="cover"
          />
        )}
        <View style={styles.body}>
          <View style={styles.categoryRow}>
            <View style={styles.catBadge}>
              <Text style={styles.catText}>
                {CATEGORY_LABELS[post.category]}
              </Text>
            </View>
            {post.isTrending && (
              <View style={styles.trendingBadge}>
                <Feather name="trending-up" size={11} color={colors.trending} />
                <Text style={styles.trendingText}>Trending</Text>
              </View>
            )}
          </View>

          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.description}>{post.description}</Text>

          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Feather name="eye" size={14} color={colors.mutedForeground} />
              <Text style={styles.metricText}>{formatCount(post.views)} views</Text>
            </View>
            <View style={styles.metricItem}>
              <Feather name="heart" size={14} color={colors.like} />
              <Text style={styles.metricText}>{formatCount(post.likes)}</Text>
            </View>
            <Text style={styles.timestamp}>{timeAgo(post.publishedAt)}</Text>
          </View>

          {post.roomCode && (
            <View style={styles.roomCodeBox}>
              <Feather name="key" size={20} color={colors.accent} />
              <View>
                <Text style={styles.roomCodeLabel}>Room Code</Text>
                <Text style={styles.roomCode}>{post.roomCode}</Text>
              </View>
            </View>
          )}

          {post.type === "poll" && post.poll && (
            <PollCard post={post} />
          )}

          <View style={styles.reactionRow}>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                toggleReaction(post.id, "like");
              }}
              style={[
                styles.reactionBtn,
                {
                  backgroundColor: reactions.has("like") ? colors.like + "22" : "transparent",
                  borderColor: reactions.has("like") ? colors.like : colors.border,
                },
              ]}
            >
              <Feather
                name="heart"
                size={16}
                color={reactions.has("like") ? colors.like : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.reactionBtnText,
                  { color: reactions.has("like") ? colors.like : colors.mutedForeground },
                ]}
              >
                Like
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                toggleReaction(post.id, "fire");
              }}
              style={[
                styles.reactionBtn,
                {
                  backgroundColor: reactions.has("fire") ? colors.fire + "22" : "transparent",
                  borderColor: reactions.has("fire") ? colors.fire : colors.border,
                },
              ]}
            >
              <Text style={{ fontSize: 16 }}>🔥</Text>
              <Text
                style={[
                  styles.reactionBtnText,
                  { color: reactions.has("fire") ? colors.fire : colors.mutedForeground },
                ]}
              >
                Fire
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
              style={[
                styles.reactionBtn,
                { borderColor: colors.border },
              ]}
            >
              <Feather name="share-2" size={16} color={colors.mutedForeground} />
              <Text
                style={[styles.reactionBtnText, { color: colors.mutedForeground }]}
              >
                Share
              </Text>
            </TouchableOpacity>
          </View>

          {post.link && (
            <TouchableOpacity
              onPress={() => post.link && Linking.openURL(post.link)}
              style={styles.openLinkBtn}
            >
              <Feather name="external-link" size={18} color="#fff" />
              <Text style={styles.openLinkText}>
                {post.type === "video" ? "Watch on " + (post.platform === "youtube" ? "YouTube" : "Platform") : "Open Link"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
