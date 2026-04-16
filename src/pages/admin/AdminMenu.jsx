
const AdminMenu = () => {
  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', backgroundColor: 'var(--light-gray)', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="container">
        <h1>Menu Management</h1>
        <div style={{ backgroundColor: 'var(--card-bg)', padding: '2rem', borderRadius: 'var(--border-radius-md)', marginTop: '2rem', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ color: 'var(--medium-gray)' }}>
            Add, edit, or remove menu items from your restaurant.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;
