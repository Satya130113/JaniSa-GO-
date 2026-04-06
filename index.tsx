import { Feather } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppHeader from "@/components/AppHeader";
import ContentCard from "@/components/ContentCard";
import FeaturedCard from "@/components/FeaturedCard";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { posts } = useApp();
  const [refreshing, setRefreshing] = useState(false);

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const featuredPosts = posts.filter((p) => p.featured);
  const pinnedPosts = posts.filter((p) => p.pinned && !p.featured);
  const regularPosts = posts.filter((p) => !p.featured && !p.pinned);
  const allFeedPosts = [...pinnedPosts, ...regularPosts];

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 12,
    },
    sectionTitle: {
      fontSize: 13,
      fontFamily: "Inter_700Bold",
      color: colors.mutedForeground,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    featuredList: {
      paddingLeft: 16,
      paddingRight: 4,
      paddingBottom: 4,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 4,
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
    },
  });

  const FeaturedSection = (
    <View>
      {featuredPosts.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured</Text>
            <Feather name="star" size={14} color={colors.primary} />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
          >
            {featuredPosts.map((post) => (
              <FeaturedCard key={post.id} post={post} />
            ))}
          </ScrollView>
          <View style={styles.divider} />
        </>
      )}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Latest Drops</Text>
        <Feather name="zap" size={14} color={colors.primary} />
      </View>
    </View>
  );

  if (allFeedPosts.length === 0 && featuredPosts.length === 0) {
    return (
      <View style={styles.container}>
        <AppHeader />
        <View style={styles.emptyState}>
          <Feather name="inbox" size={40} color={colors.mutedForeground} />
          <Text style={styles.emptyText}>No content yet</Text>
          <Text style={styles.emptySubText}>Check back soon for new drops!</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader />
      <FlatList
        data={allFeedPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ContentCard post={item} />}
        ListHeaderComponent={FeaturedSection}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      />
    </View>
  );
}
