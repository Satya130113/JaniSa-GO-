import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useCallback, useRef } from "react";
import {
  Animated,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import type { Post } from "@/context/AppContext";

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

export default function FeaturedCard({ post }: { post: Post }) {
  const colors = useColors();
  const router = useRouter();
  const { toggleReaction, userReactions } = useApp();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const reactions = userReactions[post.id] ?? new Set();

  const handlePress = useCallback(async () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.97, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
    if (post.link) {
      Linking.openURL(post.link);
    } else {
      router.push({ pathname: "/content/[id]", params: { id: post.id } });
    }
  }, [post, scaleAnim, router]);

  const styles = StyleSheet.create({
    card: {
      width: 280,
      borderRadius: colors.radius + 4,
      overflow: "hidden",
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      marginRight: 12,
    },
    image: {
      width: "100%",
      height: 160,
      backgroundColor: colors.surfaceSecondary,
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    featuredBadge: {
      position: "absolute",
      top: 12,
      left: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: colors.featured,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 20,
    },
    featuredText: {
      fontSize: 10,
      fontFamily: "Inter_700Bold",
      color: "#fff",
      textTransform: "uppercase",
    },
    body: { padding: 12 },
    category: {
      fontSize: 10,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 4,
    },
    title: {
      fontSize: 15,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      marginBottom: 6,
      lineHeight: 20,
    },
    desc: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 17,
      marginBottom: 10,
    },
    bottomRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    metrics: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    metricItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
    },
    metricText: {
      fontSize: 11,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
    },
    openBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: colors.primary,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 20,
    },
    openBtnText: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      color: "#fff",
    },
  });

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable onPress={handlePress} style={styles.card}>
        {post.thumbnail ? (
          <Image
            source={
              typeof post.thumbnail === "string"
                ? { uri: post.thumbnail }
                : post.thumbnail
            }
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.image, { justifyContent: "center", alignItems: "center" }]}>
            <Feather name="star" size={40} color={colors.primary} />
          </View>
        )}
        <View style={styles.featuredBadge}>
          <Feather name="star" size={10} color="#fff" />
          <Text style={styles.featuredText}>Featured</Text>
        </View>

        <View style={styles.body}>
          <Text style={styles.category}>{CATEGORY_LABELS[post.category]}</Text>
          <Text style={styles.title} numberOfLines={2}>{post.title}</Text>
          <Text style={styles.desc} numberOfLines={2}>{post.description}</Text>
          <View style={styles.bottomRow}>
            <View style={styles.metrics}>
              <View style={styles.metricItem}>
                <Feather name="eye" size={11} color={colors.mutedForeground} />
                <Text style={styles.metricText}>{formatCount(post.views)}</Text>
              </View>
              <View style={styles.metricItem}>
                <Feather name="heart" size={11} color={colors.like} />
                <Text style={styles.metricText}>{formatCount(post.likes)}</Text>
              </View>
            </View>
            <Pressable onPress={handlePress} style={styles.openBtn}>
              <Text style={styles.openBtnText}>
                {post.type === "video" ? "Watch" : "Open"}
              </Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
