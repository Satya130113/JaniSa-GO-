import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type Category = "all" | "brawlstars" | "bgmi" | "mlbb" | "others";

export type ContentType = "text" | "link" | "video" | "image" | "poll";

export type Reaction = "like" | "fire";

export interface Poll {
  question: string;
  options: { id: string; text: string; votes: number }[];
  showResultsAfterVote: boolean;
  totalVotes: number;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  category: Category;
  type: ContentType;
  thumbnail?: string;
  link?: string;
  videoId?: string;
  platform?: "youtube" | "instagram" | "other";
  featured: boolean;
  pinned: boolean;
  views: number;
  likes: number;
  fires: number;
  tags: string[];
  scheduledAt?: number;
  publishedAt: number;
  roomCode?: string;
  countdownTo?: number;
  isTrending?: boolean;
  poll?: Poll;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  postId?: string;
  read: boolean;
  createdAt: number;
}

interface VotedPolls {
  [postId: string]: string;
}

interface AppContextValue {
  posts: Post[];
  notifications: Notification[];
  votedPolls: VotedPolls;
  userReactions: Record<string, Set<Reaction>>;
  isAdminMode: boolean;
  isDarkMode: boolean;
  unreadCount: number;
  logoTapCount: number;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  toggleReaction: (postId: string, reaction: Reaction) => void;
  votePoll: (postId: string, optionId: string) => void;
  setIsAdminMode: (v: boolean) => void;
  toggleDarkMode: () => void;
  incrementLogoTap: () => void;
  resetLogoTap: () => void;
  addPost: (post: Post) => void;
  editPost: (id: string, updates: Partial<Post>) => void;
  deletePost: (id: string) => void;
  pinPost: (id: string, pinned: boolean) => void;
  featurePost: (id: string, featured: boolean) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const SEED_POSTS: Post[] = [
  {
    id: "1",
    title: "JaniSa GO is LIVE!",
    description:
      "Welcome to the official JaniSa GO broadcasting hub. Stay tuned for exclusive content drops, match room codes, and the latest gaming highlights.",
    category: "all",
    type: "text",
    featured: true,
    pinned: true,
    views: 2840,
    likes: 432,
    fires: 218,
    tags: ["announcement"],
    publishedAt: Date.now() - 1000 * 60 * 30,
    isTrending: true,
  },
  {
    id: "2",
    title: "BGMI Room Code Drop",
    description:
      "Custom room starting in 15 minutes! Join now for classic matches. Winners get featured on the channel.",
    category: "bgmi",
    type: "text",
    featured: false,
    pinned: false,
    views: 1204,
    likes: 189,
    fires: 97,
    tags: ["room", "bgmi"],
    publishedAt: Date.now() - 1000 * 60 * 90,
    roomCode: "BGMI2024X",
    countdownTo: Date.now() + 1000 * 60 * 15,
    isTrending: true,
  },
  {
    id: "3",
    title: "Top Brawl Stars Clips of the Week",
    description:
      "Watch the most insane plays from this week's Brawl Stars sessions. Road to Masters!",
    category: "brawlstars",
    type: "video",
    thumbnail: require("@/assets/images/brawl_stars_banner.png"),
    link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    platform: "youtube",
    videoId: "dQw4w9WgXcQ",
    featured: true,
    pinned: false,
    views: 3421,
    likes: 567,
    fires: 301,
    tags: ["highlights", "brawlstars"],
    publishedAt: Date.now() - 1000 * 60 * 180,
    isTrending: true,
  },
  {
    id: "4",
    title: "MLBB Ranked Push — Live",
    description:
      "Grinding to Mythic this season. Come watch and learn the best meta picks right now.",
    category: "mlbb",
    type: "video",
    thumbnail: require("@/assets/images/mlbb_banner.png"),
    link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    platform: "youtube",
    videoId: "dQw4w9WgXcQ",
    featured: false,
    pinned: false,
    views: 987,
    likes: 143,
    fires: 88,
    tags: ["mlbb", "ranked"],
    publishedAt: Date.now() - 1000 * 60 * 240,
  },
  {
    id: "5",
    title: "Community Poll: Next Tournament Game",
    description: "Help decide the next tournament format for JaniSa GO!",
    category: "all",
    type: "poll",
    featured: false,
    pinned: false,
    views: 1876,
    likes: 221,
    fires: 112,
    tags: ["poll", "community"],
    publishedAt: Date.now() - 1000 * 60 * 360,
    poll: {
      question: "Which game should we host the next tournament on?",
      options: [
        { id: "a", text: "Brawl Stars", votes: 342 },
        { id: "b", text: "BGMI", votes: 289 },
        { id: "c", text: "MLBB", votes: 198 },
        { id: "d", text: "Free Fire", votes: 87 },
      ],
      showResultsAfterVote: true,
      totalVotes: 916,
    },
  },
  {
    id: "6",
    title: "BGMI Chicken Dinner Clutch",
    description:
      "1v4 clutch in final zone. Watch till the end — this one's insane.",
    category: "bgmi",
    type: "video",
    thumbnail: require("@/assets/images/bgmi_banner.png"),
    link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    platform: "youtube",
    videoId: "dQw4w9WgXcQ",
    featured: false,
    pinned: false,
    views: 5200,
    likes: 890,
    fires: 445,
    tags: ["clutch", "bgmi", "highlights"],
    publishedAt: Date.now() - 1000 * 60 * 60 * 12,
    isTrending: false,
  },
];

const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    title: "New Content Drop!",
    body: "JaniSa GO is LIVE — check out the latest updates.",
    postId: "1",
    read: false,
    createdAt: Date.now() - 1000 * 60 * 30,
  },
  {
    id: "n2",
    title: "BGMI Room Code Dropping Soon",
    body: "Custom room starts in 15 minutes. Don't miss it!",
    postId: "2",
    read: false,
    createdAt: Date.now() - 1000 * 60 * 90,
  },
  {
    id: "n3",
    title: "Weekly Highlights Are Up",
    body: "Top Brawl Stars clips of the week — go watch now!",
    postId: "3",
    read: true,
    createdAt: Date.now() - 1000 * 60 * 180,
  },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS);
  const [notifications, setNotifications] =
    useState<Notification[]>(SEED_NOTIFICATIONS);
  const [votedPolls, setVotedPolls] = useState<VotedPolls>({});
  const [userReactions, setUserReactions] = useState<
    Record<string, Set<Reaction>>
  >({});
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [logoTapCount, setLogoTapCount] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem("janisa_voted_polls").then((v) => {
      if (v) setVotedPolls(JSON.parse(v));
    });
    AsyncStorage.getItem("janisa_dark_mode").then((v) => {
      if (v !== null) setIsDarkMode(v === "true");
    });
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const toggleReaction = useCallback((postId: string, reaction: Reaction) => {
    setUserReactions((prev) => {
      const existing = new Set(prev[postId] ?? []);
      if (existing.has(reaction)) {
        existing.delete(reaction);
      } else {
        existing.add(reaction);
      }
      return { ...prev, [postId]: existing };
    });
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const hadReaction = userReactions[postId]?.has(reaction);
        if (reaction === "like") {
          return { ...p, likes: p.likes + (hadReaction ? -1 : 1) };
        }
        return { ...p, fires: p.fires + (hadReaction ? -1 : 1) };
      })
    );
  }, [userReactions]);

  const votePoll = useCallback(
    (postId: string, optionId: string) => {
      if (votedPolls[postId]) return;
      const newVoted = { ...votedPolls, [postId]: optionId };
      setVotedPolls(newVoted);
      AsyncStorage.setItem("janisa_voted_polls", JSON.stringify(newVoted));
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id !== postId || !p.poll) return p;
          const updatedOptions = p.poll.options.map((o) =>
            o.id === optionId ? { ...o, votes: o.votes + 1 } : o
          );
          return {
            ...p,
            poll: {
              ...p.poll,
              options: updatedOptions,
              totalVotes: p.poll.totalVotes + 1,
            },
          };
        })
      );
    },
    [votedPolls]
  );

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => {
      AsyncStorage.setItem("janisa_dark_mode", String(!prev));
      return !prev;
    });
  }, []);

  const incrementLogoTap = useCallback(() => {
    setLogoTapCount((prev) => prev + 1);
  }, []);

  const resetLogoTap = useCallback(() => {
    setLogoTapCount(0);
  }, []);

  const addPost = useCallback((post: Post) => {
    setPosts((prev) => [post, ...prev]);
    setNotifications((prev) => [
      {
        id: "n" + Date.now(),
        title: "New Drop: " + post.title,
        body: post.description.slice(0, 80),
        postId: post.id,
        read: false,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
  }, []);

  const editPost = useCallback((id: string, updates: Partial<Post>) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  }, []);

  const deletePost = useCallback((id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const pinPost = useCallback((id: string, pinned: boolean) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, pinned } : p)));
  }, []);

  const featurePost = useCallback((id: string, featured: boolean) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, featured } : p)));
  }, []);

  return (
    <AppContext.Provider
      value={{
        posts,
        notifications,
        votedPolls,
        userReactions,
        isAdminMode,
        isDarkMode,
        unreadCount,
        logoTapCount,
        setPosts,
        setNotifications,
        markNotificationRead,
        markAllRead,
        toggleReaction,
        votePoll,
        setIsAdminMode,
        toggleDarkMode,
        incrementLogoTap,
        resetLogoTap,
        addPost,
        editPost,
        deletePost,
        pinPost,
        featurePost,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
