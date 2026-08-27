import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function OwnerDashboard() {
  return (
    <div className="dashboard">
      <Sidebar />

      <div className="dashboard-content">
        <Topbar />

        <main className="main-content">
          <div className="page-heading">
            <div>
              <h1>Dashboard</h1>
              <p>Welcome back! Here's what's happening today.</p>
            </div>

            <button className="primary-btn">
              + Add User
            </button>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <span>Total Students</span>
              <h2>1,248</h2>
              <p>+12% this month</p>
            </div>

            <div className="stat-card">
              <span>Total Teachers</span>
              <h2>86</h2>
              <p>+5% this month</p>
            </div>

            <div className="stat-card">
              <span>Active Chats</span>
              <h2>342</h2>
              <p>+18% this week</p>
            </div>

            <div className="stat-card">
              <span>Messages Today</span>
              <h2>2,846</h2>
              <p>+24% today</p>
            </div>
          </div>

          <div className="dashboard-grid">
            <section className="dashboard-card">
              <div className="card-header">
                <h2>Recent Activity</h2>
                <button>View All</button>
              </div>

              <div className="activity">
                <div className="activity-avatar">AA</div>
                <div>
                  <strong>Ali Ahmed</strong>
                  <p>Started a conversation with Mr. Ahmed</p>
                </div>
                <span>5 min ago</span>
              </div>

              <div className="activity">
                <div className="activity-avatar">SK</div>
                <div>
                  <strong>Sarah Khan</strong>
                  <p>Joined Mathematics class</p>
                </div>
                <span>20 min ago</span>
              </div>

              <div className="activity">
                <div className="activity-avatar">HM</div>
                <div>
                  <strong>Hassan Malik</strong>
                  <p>Sent a new message</p>
                </div>
                <span>1 hour ago</span>
              </div>
            </section>

            <section className="dashboard-card">
              <div className="card-header">
                <h2>Quick Actions</h2>
              </div>

              <button className="action-btn">
                👨‍🎓 Manage Students
              </button>

              <button className="action-btn">
                👨‍🏫 Manage Teachers
              </button>

              <button className="action-btn">
                💬 View Messages
              </button>

              <button className="action-btn">
                ⚙️ Organization Settings
              </button>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default OwnerDashboard;