
const AdminRestaurants = () => {
  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', backgroundColor: 'var(--light-gray)', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="container">
        <h1>Restaurants Management</h1>
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--border-radius)', marginTop: '2rem' }}>
          <p style={{ color: 'var(--medium-gray)' }}>
            Manage your restaurant details, images, cuisine types, and more.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminRestaurants;
