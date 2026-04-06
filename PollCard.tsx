import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import type { Post } from "@/context/AppContext";

interface Props {
  post: Post;
}

export default function PollCard({ post }: Props) {
  const colors = useColors();
  const { votedPolls, votePoll } = useApp();

  if (!post.poll) return null;

  const poll = post.poll;
  const votedOptionId = votedPolls[post.id];
  const hasVoted = !!votedOptionId;
  const showResults = hasVoted && poll.showResultsAfterVote;

  const styles = StyleSheet.create({
    container: {
      marginBottom: 12,
    },
    question: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      marginBottom: 10,
    },
    option: {
      borderRadius: 8,
      marginBottom: 8,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.border,
    },
    optionBar: {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      borderRadius: 8,
    },
    optionContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    optionText: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      flex: 1,
    },
    percentText: {
      fontSize: 12,
      fontFamily: "Inter_700Bold",
    },
    totalVotes: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginTop: 4,
    },
    votedCheck: {
      fontSize: 12,
      marginLeft: 4,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{poll.question}</Text>
      {poll.options.map((option) => {
        const percent =
          poll.totalVotes > 0
            ? Math.round((option.votes / poll.totalVotes) * 100)
            : 0;
        const isVoted = votedOptionId === option.id;
        const isWinning =
          showResults &&
          option.votes === Math.max(...poll.options.map((o) => o.votes));

        return (
          <TouchableOpacity
            key={option.id}
            onPress={() => !hasVoted && votePoll(post.id, option.id)}
            disabled={hasVoted}
            style={[
              styles.option,
              {
                borderColor: isVoted
                  ? colors.primary
                  : isWinning && showResults
                  ? colors.primary + "44"
                  : colors.border,
                backgroundColor: colors.surfaceSecondary,
              },
            ]}
          >
            {showResults && (
              <View
                style={[
                  styles.optionBar,
                  {
                    width: `${percent}%`,
                    backgroundColor: isVoted
                      ? colors.primary + "33"
                      : colors.primary + "18",
                  },
                ]}
              />
            )}
            <View style={styles.optionContent}>
              <Text
                style={[
                  styles.optionText,
                  {
                    color: isVoted ? colors.primary : colors.foreground,
                    fontFamily: isVoted
                      ? "Inter_600SemiBold"
                      : "Inter_500Medium",
                  },
                ]}
                numberOfLines={1}
              >
                {option.text}
                {isVoted ? " ✓" : ""}
              </Text>
              {showResults && (
                <Text
                  style={[
                    styles.percentText,
                    {
                      color: isVoted ? colors.primary : colors.mutedForeground,
                    },
                  ]}
                >
                  {percent}%
                </Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
      {showResults && (
        <Text style={styles.totalVotes}>{poll.totalVotes} votes total</Text>
      )}
      {!hasVoted && (
        <Text style={styles.totalVotes}>Tap to vote</Text>
      )}
    </View>
  );
}
