function EmptyState({ icon = "💬", title, description }) {
  return (
    <div className="empty-state">
      <span className="empty-state-icon">{icon}</span>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
    </div>
  );
}

export default EmptyState;
