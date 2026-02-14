"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { chatService } from "@/lib/services/chat.service";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/auth");
      return;
    }

    initializeChat();
  }, [user, loading, router]);

  const initializeChat = async () => {
    if (!user) return;

    try {
      // Try to get the latest chat session
      const latestSession = await chatService.getLatestChatSession(user.id);

      if (latestSession) {
        router.push(`/chat/${latestSession.id}`);
      } else {
        // Create a new chat session
        const newSession = await chatService.createChatSession(user.id);
        router.push(`/chat/${newSession.id}`);
      }
    } catch (error) {
      console.error("Failed to initialize chat:", error);
    }
  };

  return null;
}
