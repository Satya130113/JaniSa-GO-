import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import type { Category, ContentType } from "@/context/AppContext";

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "all", label: "General" },
  { id: "brawlstars", label: "Brawl Stars" },
  { id: "bgmi", label: "BGMI" },
  { id: "mlbb", label: "MLBB" },
  { id: "others", label: "Others" },
];

const TYPES: { id: ContentType; label: string; icon: string }[] = [
  { id: "text", label: "Text", icon: "type" },
  { id: "link", label: "Link", icon: "link" },
  { id: "video", label: "Video", icon: "play-circle" },
  { id: "poll", label: "Poll", icon: "bar-chart-2" },
];

export default function NewPostScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { addPost } = useApp();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("all");
  const [type, setType] = useState<ContentType>("text");
  const [link, setLink] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", "", ""]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Title is required";
    if (!description.trim()) e.description = "Description is required";
    if (type === "poll" && !pollQuestion.trim()) e.pollQuestion = "Poll question required";
    if (type === "poll" && pollOptions.filter((o) => o.trim()).length < 2)
      e.pollOptions = "At least 2 options required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePublish = () => {
    if (!validate()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const platform = link.includes("youtube.com") || link.includes("youtu.be")
      ? "youtube"
      : link.includes("instagram.com")
      ? "instagram"
      : "other";

    const videoId = platform === "youtube"
      ? (link.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/)?.[1] ?? undefined)
      : undefined;

    const newPost = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: title.trim(),
      description: description.trim(),
      category,
      type,
      link: link.trim() || undefined,
      platform: link ? platform : undefined,
      videoId,
      roomCode: roomCode.trim() || undefined,
      featured: isFeatured,
      pinned: isPinned,
      isTrending,
      views: 0,
      likes: 0,
      fires: 0,
      tags: [],
      publishedAt: Date.now(),
      poll:
        type === "poll"
          ? {
              question: pollQuestion.trim(),
              options: pollOptions
                .filter((o) => o.trim())
                .map((o, i) => ({
                  id: String.fromCharCode(97 + i),
                  text: o.trim(),
                  votes: 0,
                })),
              showResultsAfterVote: true,
              totalVotes: 0,
            }
          : undefined,
    };

    addPost(newPost);
    router.back();
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
    publishBtn: {
      backgroundColor: colors.primary,
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 7,
    },
    publishText: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: "#fff",
    },
    scrollContent: {
      padding: 20,
      paddingBottom: bottomPad + 40,
    },
    label: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
      color: colors.mutedForeground,
      marginBottom: 6,
      marginTop: 14,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    input: {
      backgroundColor: colors.surfaceSecondary,
      borderRadius: colors.radius,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 14,
      paddingVertical: 10,
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
    },
    textArea: {
      minHeight: 80,
      paddingTop: 12,
      textAlignVertical: "top",
    },
    errorText: {
      fontSize: 12,
      color: colors.destructive,
      marginTop: 4,
      fontFamily: "Inter_400Regular",
    },
    chipRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    chip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    chipText: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
    },
    toggleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    toggleLabel: {
      fontSize: 14,
      fontFamily: "Inter_500Medium",
      color: colors.foreground,
    },
    pollOptionRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 8,
    },
    addOptionBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 8,
      marginTop: 4,
    },
    addOptionText: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={22} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Post</Text>
          <TouchableOpacity onPress={handlePublish} style={styles.publishBtn}>
            <Text style={styles.publishText}>Publish</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={[styles.input, errors.title && { borderColor: colors.destructive }]}
          placeholder="Post title..."
          placeholderTextColor={colors.mutedForeground}
          value={title}
          onChangeText={setTitle}
        />
        {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea, errors.description && { borderColor: colors.destructive }]}
          placeholder="Short description..."
          placeholderTextColor={colors.mutedForeground}
          value={description}
          onChangeText={setDescription}
          multiline
        />
        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

        <Text style={styles.label}>Category</Text>
        <View style={styles.chipRow}>
          {CATEGORIES.map((c) => (
            <TouchableOpacity
              key={c.id}
              onPress={() => setCategory(c.id)}
              style={[
                styles.chip,
                {
                  backgroundColor:
                    category === c.id ? colors.primary + "22" : colors.surfaceSecondary,
                  borderWidth: category === c.id ? 1 : 0,
                  borderColor: colors.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: category === c.id ? colors.primary : colors.mutedForeground },
                ]}
              >
                {c.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Content Type</Text>
        <View style={styles.chipRow}>
          {TYPES.map((t) => (
            <TouchableOpacity
              key={t.id}
              onPress={() => setType(t.id)}
              style={[
                styles.chip,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  backgroundColor:
                    type === t.id ? colors.accent + "22" : colors.surfaceSecondary,
                  borderWidth: type === t.id ? 1 : 0,
                  borderColor: colors.accent,
                },
              ]}
            >
              <Feather
                name={t.icon as any}
                size={13}
                color={type === t.id ? colors.accent : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.chipText,
                  { color: type === t.id ? colors.accent : colors.mutedForeground },
                ]}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {(type === "link" || type === "video") && (
          <>
            <Text style={styles.label}>Link URL</Text>
            <TextInput
              style={styles.input}
              placeholder="https://..."
              placeholderTextColor={colors.mutedForeground}
              value={link}
              onChangeText={setLink}
              autoCapitalize="none"
              keyboardType="url"
            />
          </>
        )}

        {type === "text" && (
          <>
            <Text style={styles.label}>Room Code (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. BGMI2024X"
              placeholderTextColor={colors.mutedForeground}
              value={roomCode}
              onChangeText={setRoomCode}
              autoCapitalize="characters"
            />
          </>
        )}

        {type === "poll" && (
          <>
            <Text style={styles.label}>Poll Question</Text>
            <TextInput
              style={[
                styles.input,
                errors.pollQuestion && { borderColor: colors.destructive },
              ]}
              placeholder="Ask the community..."
              placeholderTextColor={colors.mutedForeground}
              value={pollQuestion}
              onChangeText={setPollQuestion}
            />
            {errors.pollQuestion && (
              <Text style={styles.errorText}>{errors.pollQuestion}</Text>
            )}
            <Text style={styles.label}>Poll Options</Text>
            {errors.pollOptions && (
              <Text style={styles.errorText}>{errors.pollOptions}</Text>
            )}
            {pollOptions.map((opt, i) => (
              <View key={i} style={styles.pollOptionRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder={`Option ${i + 1}`}
                  placeholderTextColor={colors.mutedForeground}
                  value={opt}
                  onChangeText={(v) => {
                    const updated = [...pollOptions];
                    updated[i] = v;
                    setPollOptions(updated);
                  }}
                />
                {pollOptions.length > 2 && (
                  <TouchableOpacity
                    onPress={() =>
                      setPollOptions(pollOptions.filter((_, j) => j !== i))
                    }
                  >
                    <Feather name="x" size={18} color={colors.destructive} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            {pollOptions.length < 6 && (
              <TouchableOpacity
                onPress={() => setPollOptions([...pollOptions, ""])}
                style={styles.addOptionBtn}
              >
                <Feather name="plus" size={14} color={colors.primary} />
                <Text style={styles.addOptionText}>Add Option</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        <Text style={styles.label}>Options</Text>
        <View style={{ gap: 2 }}>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Feature this post</Text>
            <Switch
              value={isFeatured}
              onValueChange={setIsFeatured}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Pin to top</Text>
            <Switch
              value={isPinned}
              onValueChange={setIsPinned}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor="#fff"
            />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Mark as trending</Text>
            <Switch
              value={isTrending}
              onValueChange={setIsTrending}
              trackColor={{ false: colors.border, true: colors.trending }}
              thumbColor="#fff"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
