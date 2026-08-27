import { useCallback, useEffect, useRef, useState } from "react";
import { getSocket } from "../socket/socket";

const STOP_DELAY_MS = 2000;

export function useTyping(conversationId, currentUserId) {
  const [otherIsTyping, setOtherIsTyping] = useState(false);
  const isTypingRef = useRef(false);
  const stopTimerRef = useRef(null);

  useEffect(() => {
    setOtherIsTyping(false);
  }, [conversationId]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !conversationId) return;

    const handleTyping = ({ conversationId: incomingId, userId, isTyping }) => {
      if (incomingId !== conversationId || userId === currentUserId) return;
      setOtherIsTyping(isTyping);
    };

    socket.on("typing", handleTyping);
    return () => socket.off("typing", handleTyping);
  }, [conversationId, currentUserId]);

  const stopTyping = useCallback(() => {
    const socket = getSocket();
    clearTimeout(stopTimerRef.current);
    if (isTypingRef.current && socket && conversationId) {
      socket.emit("typing:stop", { conversationId });
    }
    isTypingRef.current = false;
  }, [conversationId]);

  const notifyTyping = useCallback(() => {
    const socket = getSocket();
    if (!socket || !conversationId) return;

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socket.emit("typing:start", { conversationId });
    }

    clearTimeout(stopTimerRef.current);
    stopTimerRef.current = setTimeout(stopTyping, STOP_DELAY_MS);
  }, [conversationId, stopTyping]);

  useEffect(() => stopTyping, [conversationId, stopTyping]);

  return { otherIsTyping, notifyTyping, stopTyping };
}
