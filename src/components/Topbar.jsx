function Topbar() {
  return (
    <header className="topbar">
      <div>
        <strong>Good afternoon, Admin 👋</strong>
        <span>Tuesday, August 25, 2026</span>
      </div>

      <div className="topbar-actions">
        <button>🔔</button>

        <div className="profile">
          <div className="user-avatar">AO</div>

          <div>
            <strong>Admin Owner</strong>
            <span>Owner</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;