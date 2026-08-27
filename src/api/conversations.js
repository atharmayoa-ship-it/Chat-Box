import { apiRequest } from "./http";

export function fetchConversations(token) {
  return apiRequest("/api/conversations", { token });
}

export function fetchMessages(token, conversationId, { beforeId } = {}) {
  const query = beforeId ? `?beforeId=${beforeId}` : "";
  return apiRequest(`/api/conversations/${conversationId}/messages${query}`, { token });
}

export function fetchStats(token) {
  return apiRequest("/api/stats", { token });
}
