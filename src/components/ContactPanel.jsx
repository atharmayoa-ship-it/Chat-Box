import { formatLastSeen } from "../utils/datetime";
import { getInitials } from "../utils/initials";
import { avatarStyle } from "../utils/avatarColor";

function ContactPanel({ contact }) {
  if (!contact) return null;

  return (
    <aside className="contact-panel">
      <div className="contact-panel-header">
        <div className="contact-avatar-large" style={avatarStyle(contact.name)}>
          {getInitials(contact.name)}
        </div>
        <h3>{contact.name}</h3>
        <span className={`contact-status ${contact.online ? "online" : "offline"}`}>
          {contact.online ? "● Online" : `○ Last seen ${formatLastSeen(contact.lastSeen)}`}
        </span>
      </div>

      <div className="contact-panel-section">
        <h4>Contact Information</h4>

        <div className="contact-field">
          <span>Email</span>
          <p>{contact.email}</p>
        </div>

        <div className="contact-field">
          <span>Role</span>
          <p>{contact.role}</p>
        </div>
      </div>
    </aside>
  );
}

export default ContactPanel;
