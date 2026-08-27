import { useCallback, useEffect, useState } from "react";
import { fetchConversations } from "../api/conversations";
import { getSocket } from "../socket/socket";

export function useConversations(token, activeId) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    if (!token) return;
    fetchConversations(token).then(({ conversations: list }) => {
      setConversations(list);
      setLoading(false);
    });
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const bumpConversation = (conversationId, patch) => {
      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === conversationId ? { ...conversation, ...patch } : conversation
        )
      );
    };

    const handleConversationUpdate = ({ conversationId, lastMessage }) => {
      bumpConversation(conversationId, { lastMessage });
    };

    const handleNewMessage = ({ conversationId, message }) => {
      setConversations((current) =>
        current.map((conversation) => {
          if (conversation.id !== conversationId) return conversation;
          const isActive = conversationId === activeId;
          return {
            ...conversation,
            lastMessage: message,
            unreadCount: isActive ? 0 : conversation.unreadCount + 1,
          };
        })
      );
    };

    const handlePresence = ({ userId, online, lastSeen }) => {
      setConversations((current) =>
        current.map((conversation) =>
          conversation.user.id === userId
            ? { ...conversation, user: { ...conversation.user, online, lastSeen } }
            : conversation
        )
      );
    };

    const handleReconnect = () => load();

    socket.on("conversation_update", handleConversationUpdate);
    socket.on("new_message", handleNewMessage);
    socket.on("presence", handlePresence);
    socket.on("connect", handleReconnect);

    return () => {
      socket.off("conversation_update", handleConversationUpdate);
      socket.off("new_message", handleNewMessage);
      socket.off("presence", handlePresence);
      socket.off("connect", handleReconnect);
    };
  }, [activeId, load]);

  const clearUnread = useCallback((conversationId) => {
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation
      )
    );
  }, []);

  return { conversations, loading, clearUnread };
}
