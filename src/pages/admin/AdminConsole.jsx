
const AdminConsole = () => {
  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', backgroundColor: 'var(--light-gray)', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="container">
        <h1>Admin Console</h1>
        <div style={{ backgroundColor: 'var(--card-bg)', padding: '2rem', borderRadius: 'var(--border-radius-md)', marginTop: '2rem', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-sm)' }}>
          <h2>📊 Dashboard</h2>
          <p>Admin dashboard coming soon...</p>
          <p style={{ color: 'var(--medium-gray)' }}>
            You can manage restaurants, menu items, orders, and view analytics here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminConsole;
