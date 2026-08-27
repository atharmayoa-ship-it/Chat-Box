import { useEffect, useState } from "react";
import { getInitials } from "../utils/initials";
import { avatarStyle } from "../utils/avatarColor";

const RING_DURATION_MS = 2200;

function formatDuration(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function CallModal({ contact, onClose }) {
  const [phase, setPhase] = useState("ringing");
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const ringTimer = setTimeout(() => setPhase("connected"), RING_DURATION_MS);
    return () => clearTimeout(ringTimer);
  }, []);

  useEffect(() => {
    if (phase !== "connected") return;
    const interval = setInterval(() => setDuration((current) => current + 1), 1000);
    return () => clearInterval(interval);
  }, [phase]);

  return (
    <div className="call-modal-backdrop" onClick={onClose}>
      <div className="call-modal" onClick={(event) => event.stopPropagation()}>
        <div className="call-avatar-large" style={avatarStyle(contact.name)}>
          {getInitials(contact.name)}
        </div>
        <h3>{contact.name}</h3>
        <p className={`call-status ${phase}`}>
          {phase === "ringing" ? "Calling…" : formatDuration(duration)}
        </p>
        <button className="call-end-btn" onClick={onClose}>
          📞 End call
        </button>
      </div>
    </div>
  );
}

export default CallModal;
