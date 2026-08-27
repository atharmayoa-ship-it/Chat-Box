import { useCallback, useEffect, useState } from "react";
import { fetchStats } from "../api/conversations";
import { getSocket } from "../socket/socket";

export function useStats(token) {
  const [messagesToday, setMessagesToday] = useState(0);

  const refresh = useCallback(() => {
    if (!token) return;
    fetchStats(token).then(({ messagesToday: count }) => setMessagesToday(count));
  }, [token]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on("new_message", refresh);
    socket.on("message_ack", refresh);

    return () => {
      socket.off("new_message", refresh);
      socket.off("message_ack", refresh);
    };
  }, [refresh]);

  return messagesToday;
}
