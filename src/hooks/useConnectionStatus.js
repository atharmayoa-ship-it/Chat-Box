import { useEffect, useState } from "react";
import { getSocket } from "../socket/socket";

export function useConnectionStatus() {
  const [status, setStatus] = useState("connecting");

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    if (socket.connected) setStatus("connected");

    const handleConnect = () => setStatus("connected");
    const handleDisconnect = () => setStatus("disconnected");
    const handleConnectError = (err) => {
      setStatus(err.message === "unauthorized" ? "unauthorized" : "disconnected");
    };
    const handleReconnectAttempt = () => setStatus("connecting");

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.io.on("reconnect_attempt", handleReconnectAttempt);

    // Belt-and-suspenders: reconcile against the socket's own ground truth
    // periodically, in case an event was ever missed (e.g. during rapid
    // dev-server restarts) and the badge got stuck out of sync.
    const syncInterval = setInterval(() => {
      setStatus((current) => {
        if (socket.connected) return current === "connected" ? current : "connected";
        return current;
      });
    }, 3000);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.io.off("reconnect_attempt", handleReconnectAttempt);
      clearInterval(syncInterval);
    };
  }, []);

  return status;
}
