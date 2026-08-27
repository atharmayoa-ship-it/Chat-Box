function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">E</div>

        <div>
          <h2>EduConnect</h2>
          <span>Admin Portal</span>
        </div>
      </div>

      <nav>
        <p className="nav-title">MAIN MENU</p>

        <a className="active">📊 Dashboard</a>
        <a>👨‍🎓 Students</a>
        <a>👨‍🏫 Teachers</a>
        <a>💬 Messages</a>
        <a>📚 Classes</a>

        <p className="nav-title">MANAGEMENT</p>

        <a>📈 Reports</a>
        <a>🔔 Notifications</a>
        <a>⚙️ Settings</a>
      </nav>

      <div className="sidebar-user">
        <div className="user-avatar">AO</div>

        <div>
          <strong>Admin Owner</strong>
          <span>Company Owner</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;