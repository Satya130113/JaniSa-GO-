import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useApp } from "@/context/AppContext";

export default function AdminLayout() {
  const { isAdminMode } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!isAdminMode) {
      router.replace("/");
    }
  }, [isAdminMode, router]);

  if (!isAdminMode) return null;

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Admin Panel", headerShown: false }}
      />
      <Stack.Screen
        name="new-post"
        options={{ title: "New Post", headerShown: false }}
      />
    </Stack>
  );
}
