import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { login as loginRequest, fetchCurrentUser } from "../api/auth";
import { connectSocket, disconnectSocket } from "../socket/socket";

const AuthContext = createContext(null);

const STORAGE_KEY = "chatbox_token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY));
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!token) {
      setStatus("unauthenticated");
      return;
    }

    let cancelled = false;

    fetchCurrentUser(token)
      .then(({ user: fetchedUser }) => {
        if (cancelled) return;
        setUser(fetchedUser);
        connectSocket(token);
        setStatus("authenticated");
      })
      .catch(() => {
        if (cancelled) return;
        localStorage.removeItem(STORAGE_KEY);
        setToken(null);
        setStatus("unauthenticated");
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = async (email, password) => {
    const { token: newToken, user: loggedInUser } = await loginRequest(email, password);
    localStorage.setItem(STORAGE_KEY, newToken);
    setUser(loggedInUser);
    setToken(newToken);
    connectSocket(newToken);
    setStatus("authenticated");
  };

  const logout = () => {
    disconnectSocket();
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setUser(null);
    setStatus("unauthenticated");
  };

  const value = useMemo(
    () => ({ user, token, status, login, logout }),
    [user, token, status]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
