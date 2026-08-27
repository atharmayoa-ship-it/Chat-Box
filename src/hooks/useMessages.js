import { useCallback, useEffect, useRef, useState } from "react";
import { fetchMessages } from "../api/conversations";
import { getSocket } from "../socket/socket";

let tempIdCounter = 0;
const nextTempId = () => `temp-${Date.now()}-${tempIdCounter++}`;

export function useMessages(token, conversationId, currentUserId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const conversationIdRef = useRef(conversationId);
  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  const load = useCallback(() => {
    if (!token || !conversationId) return;
    setLoading(true);
    fetchMessages(token, conversationId).then(({ messages: list }) => {
      setMessages(list);
      setLoading(false);
    });
  }, [token, conversationId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !conversationId) return;

    const handleNewMessage = ({ conversationId: incomingId, message }) => {
      if (incomingId !== conversationIdRef.current) return;
      setMessages((current) =>
        current.some((m) => m.id === message.id) ? current : [...current, message]
      );
    };

    const handleAck = ({ tempId, message }) => {
      if (message.conversationId !== conversationIdRef.current) return;
      setMessages((current) => {
        if (current.some((m) => m.id === message.id)) {
          return current.filter((m) => m.id !== tempId);
        }
        return current.map((m) => (m.id === tempId ? message : m));
      });
    };

    const handleStatus = ({ messageId, status, upTo }) => {
      setMessages((current) =>
        current.map((m) => {
          if (upTo) {
            return m.id <= messageId && m.senderId === currentUserId ? { ...m, status } : m;
          }
          return m.id === messageId ? { ...m, status } : m;
        })
      );
    };

    const handleError = ({ tempId }) => {
      if (!tempId) return;
      setMessages((current) => current.map((m) => (m.id === tempId ? { ...m, status: "failed" } : m)));
    };

    const handleReconnect = () => load();

    socket.on("new_message", handleNewMessage);
    socket.on("message_ack", handleAck);
    socket.on("message_status", handleStatus);
    socket.on("error", handleError);
    socket.on("connect", handleReconnect);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("message_ack", handleAck);
      socket.off("message_status", handleStatus);
      socket.off("error", handleError);
      socket.off("connect", handleReconnect);
    };
  }, [conversationId, currentUserId, load]);

  const sendMessage = useCallback(
    (text) => {
      const socket = getSocket();
      if (!socket || !conversationId) return;

      const tempId = nextTempId();
      const optimisticMessage = {
        id: tempId,
        conversationId,
        senderId: currentUserId,
        text,
        status: "sending",
        createdAt: new Date().toISOString(),
      };

      setMessages((current) => [...current, optimisticMessage]);
      socket.emit("send_message", { conversationId, text, tempId });
    },
    [conversationId, currentUserId]
  );

  const markRead = useCallback(
    (lastMessageId) => {
      const socket = getSocket();
      if (!socket || !conversationId || !lastMessageId) return;
      socket.emit("mark_read", { conversationId, lastMessageId });
    },
    [conversationId]
  );

  return { messages, loading, sendMessage, markRead };
}
