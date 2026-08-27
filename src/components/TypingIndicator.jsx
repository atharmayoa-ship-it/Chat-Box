function TypingIndicator({ name }) {
  return (
    <div className="typing-indicator">
      <span className="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </span>
      {name} is typing…
    </div>
  );
}

export default TypingIndicator;
