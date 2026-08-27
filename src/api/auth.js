import { apiRequest } from "./http";

export function login(email, password) {
  return apiRequest("/api/auth/login", { method: "POST", body: { email, password } });
}

export function fetchCurrentUser(token) {
  return apiRequest("/api/auth/me", { token });
}
