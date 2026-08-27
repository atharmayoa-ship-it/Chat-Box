import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useConversations } from "../hooks/useConversations";
import { useMessages } from "../hooks/useMessages";
import { useTyping } from "../hooks/useTyping";
import { useConnectionStatus } from "../hooks/useConnectionStatus";
import { useStats } from "../hooks/useStats";
import ContactPanel from "../components/ContactPanel";
import TypingIndicator from "../components/TypingIndicator";
import EmptyState from "../components/EmptyState";
import { formatDateLabel, formatTime } from "../utils/datetime";
import { getInitials } from "../utils/initials";
import { avatarStyle } from "../utils/avatarColor";

const STATUS_LABEL = {
  connected: { text: "Connected", className: "connected" },
  connecting: { text: "Connecting…", className: "connecting" },
  disconnected: { text: "Connection lost — reconnecting…", className: "disconnected" },
  unauthorized: { text: "Session expired", className: "disconnected" },
};

const MESSAGE_STATUS_TICK = {
  sending: "Sending…",
  sent: "✓",
  delivered: "✓✓",
  read: "✓✓",
  failed: "⚠ Failed to send",
};

function Messages() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const connectionStatus = useConnectionStatus();

  const [activeId, setActiveId] = useState(null);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const messagesEndRef = useRef(null);

  const { conversations, loading: conversationsLoading, clearUnread } = useConversations(token, activeId);
  const { messages, loading: messagesLoading, sendMessage, markRead } = useMessages(
    token,
    activeId,
    user?.id
  );
  const { otherIsTyping, notifyTyping, stopTyping } = useTyping(activeId, user?.id);
  const messagesToday = useStats(token);

  useEffect(() => {
    if (connectionStatus === "unauthorized") {
      logout();
      navigate("/login", { replace: true });
    }
  }, [connectionStatus, logout, navigate]);

  useEffect(() => {
    if (!activeId && conversations.length > 0) {
      setActiveId(conversations[0].id);
    }
  }, [activeId, conversations]);

  useEffect(() => {
    setDraft("");
  }, [activeId]);

  useEffect(() => {
    if (!activeId || messages.length === 0) return;
    const lastMessage = messages[messages.length - 1];
    if (typeof lastMessage.id !== "number") return;
    markRead(lastMessage.id);
    clearUnread(activeId);
  }, [activeId, messages, markRead, clearUnread]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, otherIsTyping]);

  const sortedConversations = useMemo(
    () =>
      [...conversations].sort((a, b) => {
        const timeA = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
        const timeB = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
        return timeB - timeA;
      }),
    [conversations]
  );

  const filteredConversations = useMemo(
    () =>
      sortedConversations.filter((conversation) =>
        conversation.user.name.toLowerCase().includes(search.toLowerCase())
      ),
    [sortedConversations, search]
  );

  const activeConversation = conversations.find((conversation) => conversation.id === activeId);

  const totalConversations = conversations.length;
  const unreadTotal = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
  const onlineContacts = conversations.filter((c) => c.user.online).length;

  const handleSend = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    // socket.io-client buffers emits made while briefly disconnected and
    // flushes them automatically on reconnect, so sending doesn't need to be
    // gated on the connection badge — that badge is informational only.
    sendMessage(trimmed);
    setDraft("");
    stopTyping();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleDraftChange = (event) => {
    setDraft(event.target.value);
    if (event.target.value.trim()) notifyTyping();
  };

  const status = STATUS_LABEL[connectionStatus] || STATUS_LABEL.connecting;

  let lastDateLabel = null;

  return (
    <div className="app-shell">
      <header className="app-topbar">
        <div className="app-topbar-brand">
          <div className="logo-icon">C</div>
          <span>Chat Box</span>
        </div>

        <div className="stats-strip">
          <div className="stat-chip">
            <span className="stat-chip-icon">💬</span>
            <div className="stat-chip-text">
              <strong>{totalConversations}</strong>
              <span>Conversations</span>
            </div>
          </div>
          <div className="stat-chip">
            <span className="stat-chip-icon">✉️</span>
            <div className="stat-chip-text">
              <strong>{unreadTotal}</strong>
              <span>Unread</span>
            </div>
          </div>
          <div className="stat-chip">
            <span className="stat-chip-icon">🟢</span>
            <div className="stat-chip-text">
              <strong>{onlineContacts}</strong>
              <span>Online</span>
            </div>
          </div>
          <div className="stat-chip">
            <span className="stat-chip-icon">📈</span>
            <div className="stat-chip-text">
              <strong>{messagesToday}</strong>
              <span>Messages Today</span>
            </div>
          </div>
        </div>

        <div className="app-topbar-user">
          <span className={`connection-badge ${status.className}`}>● {status.text}</span>
          <div className="user-avatar" style={avatarStyle(user?.name)}>{getInitials(user?.name)}</div>
          <span>{user?.name}</span>
          <button
            className="logout-btn"
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="messages-page">
        <div className="messages-sidebar">
          <div className="messages-sidebar-header">
            <div>
              <h2>Messages</h2>
              <p>{totalConversations} conversations</p>
            </div>
          </div>

          <div className="message-search">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="conversation-list">
            {conversationsLoading && <p className="list-loading">Loading conversations…</p>}

            {!conversationsLoading && filteredConversations.length === 0 && (
              <EmptyState icon="🔎" title="No conversations found" />
            )}

            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                className={`conversation ${activeId === conversation.id ? "selected" : ""}`}
                onClick={() => setActiveId(conversation.id)}
              >
                <div className="conversation-avatar" style={avatarStyle(conversation.user.name)}>
                  {getInitials(conversation.user.name)}
                  {conversation.user.online && <span className="online-dot"></span>}
                </div>

                <div className="conversation-info">
                  <div className="conversation-top">
                    <strong>{conversation.user.name}</strong>
                    {conversation.unreadCount > 0 && (
                      <span className="unread-count">{conversation.unreadCount}</span>
                    )}
                  </div>

                  <span className="conversation-role">{conversation.user.role}</span>

                  <p>
                    {conversation.lastMessage
                      ? conversation.lastMessage.text
                      : "No messages yet"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="chat-window">
          {!activeConversation && (
            <EmptyState
              title="Select a conversation"
              description="Choose a conversation from the sidebar to start messaging."
            />
          )}

          {activeConversation && (
            <>
              <header className="chat-header">
                <div className="chat-person">
                  <div className="chat-avatar" style={avatarStyle(activeConversation.user.name)}>
                    {getInitials(activeConversation.user.name)}
                    {activeConversation.user.online && <span className="online-dot"></span>}
                  </div>

                  <div>
                    <h3>{activeConversation.user.name}</h3>
                    <span>{activeConversation.user.online ? "Online" : "Offline"}</span>
                  </div>
                </div>

                <div className="chat-actions">
                  <button disabled title="Not available in this demo">📞</button>
                  <button disabled title="Not available in this demo">⋮</button>
                </div>
              </header>

              <div className="messages-container">
                {messagesLoading && <p className="list-loading">Loading messages…</p>}

                {!messagesLoading && messages.length === 0 && (
                  <EmptyState title="No messages yet" description="Start the conversation." />
                )}

                {!messagesLoading &&
                  messages.map((item) => {
                    const label = formatDateLabel(item.createdAt);
                    const showLabel = label !== lastDateLabel;
                    lastDateLabel = label;
                    const isMine = item.senderId === user?.id;

                    return (
                      <div key={item.id}>
                        {showLabel && <div className="today-label">{label}</div>}
                        <div className={`message-row ${isMine ? "sent" : "received"}`}>
                          <div className="message-bubble">
                            <p>{item.text}</p>
                            <span>
                              {formatTime(item.createdAt)}
                              {isMine && ` · ${MESSAGE_STATUS_TICK[item.status] || ""}`}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                {otherIsTyping && <TypingIndicator name={activeConversation.user.name} />}

                <div ref={messagesEndRef} />
              </div>

              <div className="message-composer">
                <button className="attachment-btn" disabled title="Attachments are not enabled in this demo">
                  📎
                </button>

                <textarea
                  placeholder="Type a message..."
                  value={draft}
                  onChange={handleDraftChange}
                  onKeyDown={handleKeyDown}
                  onBlur={stopTyping}
                  rows="1"
                />

                <button
                  className="send-btn"
                  onClick={handleSend}
                  disabled={!draft.trim()}
                >
                  ➤
                </button>
              </div>
            </>
          )}
        </div>

        {activeConversation && <ContactPanel contact={activeConversation.user} />}
      </div>
    </div>
  );
}

export default Messages;
