import { useEffect, useRef, useState } from "react";

function ChatMenu({ contactVisible, onToggleContact, muted, onToggleMute, onClearChat }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const runAndClose = (action) => () => {
    action();
    setOpen(false);
  };

  return (
    <div className="chat-menu" ref={menuRef}>
      <button onClick={() => setOpen((current) => !current)} title="More options">
        ⋮
      </button>

      {open && (
        <div className="chat-menu-dropdown">
          <button onClick={runAndClose(onToggleContact)}>
            {contactVisible ? "Hide contact info" : "View contact info"}
          </button>
          <button onClick={runAndClose(onToggleMute)}>
            {muted ? "Unmute notifications" : "Mute notifications"}
          </button>
          <button className="chat-menu-danger" onClick={runAndClose(onClearChat)}>
            Clear chat
          </button>
        </div>
      )}
    </div>
  );
}

export default ChatMenu;
