import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import type { Post } from "@/context/AppContext";
import PollCard from "./PollCard";

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

const CATEGORY_COLORS: Record<string, string> = {
  all: "#A855F7",
  brawlstars: "#FFD700",
  bgmi: "#FF6B35",
  mlbb: "#A855F7",
  others: "#22C55E",
};

const CATEGORY_LABELS: Record<string, string> = {
  all: "General",
  brawlstars: "Brawl Stars",
  bgmi: "BGMI",
  mlbb: "MLBB",
  others: "Others",
};

interface Props {
  post: Post;
  compact?: boolean;
}

export default function ContentCard({ post, compact = false }: Props) {
  const colors = useColors();
  const router = useRouter();
  const { toggleReaction, userReactions } = useApp();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [countdown, setCountdown] = useState<string | null>(null);

  const reactions = userReactions[post.id] ?? new Set();

  useEffect(() => {
    if (!post.countdownTo) return;
    const update = () => {
      const diff = post.countdownTo! - Date.now();
      if (diff <= 0) {
        setCountdown("Starting now!");
        return;
      }
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setCountdown(`${m}m ${s}s`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [post.countdownTo]);

  const handlePress = useCallback(async () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.97,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();

    if (post.type === "poll") return;

    if (post.link) {
      const url = post.link;
      if (post.platform === "instagram") {
        const igUrl = url.replace("https://www.instagram.com", "instagram://");
        const canOpen = await Linking.canOpenURL(igUrl).catch(() => false);
        if (canOpen) {
          Linking.openURL(igUrl);
        } else {
          Linking.openURL(url);
        }
      } else if (post.platform === "youtube") {
        const videoId = post.videoId;
        const ytUrl = videoId
          ? `youtube://watch?v=${videoId}`
          : url;
        const canOpen = await Linking.canOpenURL(ytUrl).catch(() => false);
        if (canOpen) {
          Linking.openURL(ytUrl);
        } else {
          Linking.openURL(url);
        }
      } else {
        Linking.openURL(url);
      }
    } else {
      router.push({ pathname: "/content/[id]", params: { id: post.id } });
    }
  }, [post, scaleAnim, router]);

  const handleReaction = useCallback(
    (reaction: "like" | "fire") => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      toggleReaction(post.id, reaction);
    },
    [post.id, toggleReaction]
  );

  const handleShare = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  const catColor = CATEGORY_COLORS[post.category] ?? colors.primary;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: colors.radius + 4,
      marginHorizontal: 16,
      marginBottom: 12,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.border,
    },
    thumbnail: {
      width: "100%",
      height: compact ? 140 : 180,
      backgroundColor: colors.surfaceSecondary,
    },
    body: {
      padding: compact ? 12 : 16,
    },
    topRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
      gap: 8,
    },
    catBadge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 20,
      backgroundColor: catColor + "22",
    },
    catText: {
      fontSize: 10,
      fontFamily: "Inter_600SemiBold",
      color: catColor,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    trendingBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 20,
      backgroundColor: colors.trending + "22",
    },
    trendingText: {
      fontSize: 10,
      fontFamily: "Inter_600SemiBold",
      color: colors.trending,
    },
    title: {
      fontSize: compact ? 15 : 17,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      marginBottom: 6,
      lineHeight: compact ? 20 : 24,
    },
    description: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 19,
      marginBottom: 12,
    },
    countdownRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: colors.primary + "18",
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 6,
      marginBottom: 10,
      alignSelf: "flex-start",
    },
    countdownText: {
      fontSize: 13,
      fontFamily: "Inter_700Bold",
      color: colors.primary,
    },
    roomCodeRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: colors.accent + "18",
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 8,
      marginBottom: 10,
    },
    roomCodeLabel: {
      fontSize: 11,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
    },
    roomCode: {
      fontSize: 14,
      fontFamily: "Inter_700Bold",
      color: colors.accent,
      letterSpacing: 2,
    },
    bottomRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    metricsRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    metricItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    metricText: {
      fontSize: 12,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
    },
    actionRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    reactionBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 20,
    },
    reactionText: {
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
    },
    timestamp: {
      fontSize: 11,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    openBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
    openBtnText: {
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
      color: "#fff",
    },
    pinnedBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
      backgroundColor: colors.accent + "22",
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 20,
    },
    pinnedText: {
      fontSize: 10,
      fontFamily: "Inter_600SemiBold",
      color: colors.accent,
    },
  });

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable onPress={handlePress} style={styles.container}>
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
          <View style={styles.topRow}>
            <View style={styles.catBadge}>
              <Text style={styles.catText}>
                {CATEGORY_LABELS[post.category]}
              </Text>
            </View>
            {post.isTrending && (
              <View style={styles.trendingBadge}>
                <Feather name="trending-up" size={10} color={colors.trending} />
                <Text style={styles.trendingText}>Trending</Text>
              </View>
            )}
            {post.pinned && (
              <View style={styles.pinnedBadge}>
                <Feather name="bookmark" size={10} color={colors.accent} />
                <Text style={styles.pinnedText}>Pinned</Text>
              </View>
            )}
          </View>

          <Text style={styles.title} numberOfLines={2}>
            {post.title}
          </Text>

          {!compact && (
            <Text style={styles.description} numberOfLines={2}>
              {post.description}
            </Text>
          )}

          {countdown && (
            <View style={styles.countdownRow}>
              <Feather name="clock" size={13} color={colors.primary} />
              <Text style={styles.countdownText}>{countdown}</Text>
            </View>
          )}

          {post.roomCode && (
            <View style={styles.roomCodeRow}>
              <Feather name="key" size={13} color={colors.accent} />
              <View>
                <Text style={styles.roomCodeLabel}>Room Code</Text>
                <Text style={styles.roomCode}>{post.roomCode}</Text>
              </View>
            </View>
          )}

          {post.type === "poll" && post.poll && (
            <PollCard post={post} />
          )}

          <View style={styles.bottomRow}>
            <View style={styles.metricsRow}>
              <View style={styles.metricItem}>
                <Feather name="eye" size={12} color={colors.mutedForeground} />
                <Text style={styles.metricText}>
                  {formatCount(post.views)}
                </Text>
              </View>
              <Text style={styles.timestamp}>{timeAgo(post.publishedAt)}</Text>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity
                onPress={() => handleReaction("like")}
                style={[
                  styles.reactionBtn,
                  {
                    backgroundColor: reactions.has("like")
                      ? colors.like + "22"
                      : "transparent",
                  },
                ]}
              >
                <Feather
                  name="heart"
                  size={14}
                  color={
                    reactions.has("like") ? colors.like : colors.mutedForeground
                  }
                />
                <Text
                  style={[
                    styles.reactionText,
                    {
                      color: reactions.has("like")
                        ? colors.like
                        : colors.mutedForeground,
                    },
                  ]}
                >
                  {formatCount(post.likes)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleReaction("fire")}
                style={[
                  styles.reactionBtn,
                  {
                    backgroundColor: reactions.has("fire")
                      ? colors.fire + "22"
                      : "transparent",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.reactionText,
                    { fontSize: 14 },
                  ]}
                >
                  🔥
                </Text>
                <Text
                  style={[
                    styles.reactionText,
                    {
                      color: reactions.has("fire")
                        ? colors.fire
                        : colors.mutedForeground,
                    },
                  ]}
                >
                  {formatCount(post.fires)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleShare}
                style={[styles.reactionBtn]}
              >
                <Feather
                  name="share-2"
                  size={14}
                  color={colors.mutedForeground}
                />
              </TouchableOpacity>

              {post.link && (
                <TouchableOpacity onPress={handlePress} style={styles.openBtn}>
                  <Text style={styles.openBtnText}>
                    {post.type === "video" ? "Watch" : "Open"}
                  </Text>
                  <Feather name="external-link" size={11} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
