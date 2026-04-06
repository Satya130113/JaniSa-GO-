import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppHeader from "@/components/AppHeader";
import ContentCard from "@/components/ContentCard";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import type { Category } from "@/context/AppContext";

const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: "brawlstars", label: "Brawl Stars", icon: "target" },
  { id: "bgmi", label: "BGMI", icon: "crosshair" },
  { id: "mlbb", label: "MLBB", icon: "zap" },
  { id: "others", label: "Others", icon: "grid" },
];

const CATEGORY_COLORS: Record<Category, string> = {
  all: "#A855F7",
  brawlstars: "#FFD700",
  bgmi: "#FF6B35",
  mlbb: "#A855F7",
  others: "#22C55E",
};

const BANNERS: Partial<Record<Category, any>> = {
  brawlstars: require("@/assets/images/brawl_stars_banner.png"),
  bgmi: require("@/assets/images/bgmi_banner.png"),
  mlbb: require("@/assets/images/mlbb_banner.png"),
};

export default function CategoriesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { posts } = useApp();
  const [activeCategory, setActiveCategory] = useState<Category>("brawlstars");

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const filtered = posts.filter((p) => p.category === activeCategory);
  const catColor = CATEGORY_COLORS[activeCategory];
  const banner = BANNERS[activeCategory];

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    tabRow: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    tab: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 8,
    },
    tabText: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
    },
    banner: {
      width: "100%",
      height: 140,
      backgroundColor: colors.surfaceSecondary,
    },
    bannerOverlay: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: 16,
      backgroundColor: "rgba(0,0,0,0.4)",
    },
    bannerTitle: {
      fontSize: 22,
      fontFamily: "Inter_700Bold",
      color: "#fff",
    },
    bannerCount: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: "rgba(255,255,255,0.8)",
      marginTop: 2,
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
      paddingTop: 8,
    },
  });

  const activeTabLabel =
    CATEGORIES.find((c) => c.id === activeCategory)?.label ?? "";

  return (
    <View style={styles.container}>
      <AppHeader />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabRow}
      >
        {CATEGORIES.map((cat) => {
          const isActive = cat.id === activeCategory;
          const cc = CATEGORY_COLORS[cat.id];
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setActiveCategory(cat.id)}
              style={[
                styles.tab,
                {
                  backgroundColor: isActive ? cc + "22" : colors.surfaceSecondary,
                  borderWidth: isActive ? 1 : 0,
                  borderColor: isActive ? cc : "transparent",
                },
              ]}
            >
              <Feather
                name={cat.icon as any}
                size={14}
                color={isActive ? cc : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.tabText,
                  { color: isActive ? cc : colors.mutedForeground },
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ContentCard post={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          banner ? (
            <View style={{ marginBottom: 8 }}>
              <Image
                source={banner}
                style={styles.banner}
                resizeMode="cover"
              />
              <View style={styles.bannerOverlay}>
                <Text style={styles.bannerTitle}>{activeTabLabel}</Text>
                <Text style={styles.bannerCount}>
                  {filtered.length} posts
                </Text>
              </View>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="inbox" size={40} color={colors.mutedForeground} />
            <Text style={styles.emptyText}>No content in this category</Text>
          </View>
        }
      />
    </View>
  );
}
