import { ChevronLeft, Clock, MapPin, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import MenuItem from '../components/MenuItem';
import { useCart } from '../context/CartContext';
import { menuItemAPI, restaurantAPI } from '../services/api';
import { MENU_CATEGORIES } from '../utils/constants';
import { handleApiError } from '../utils/helpers';

const Restaurant = () => {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showVegOnly, setShowVegOnly] = useState(false);

  const { addToCart, currentRestaurantId } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const [restaurantRes, menuRes] = await Promise.all([
          restaurantAPI.getById(restaurantId),
          menuItemAPI.getByRestaurant(restaurantId, { page: 0, size: 200 }),
        ]);

        setRestaurant(restaurantRes.data);
        setMenuItems(menuRes.data.content || []);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [restaurantId]);

  const filteredItems = menuItems.filter((item) => {
    const categoryMatch = selectedCategory === 'All' || item.category === selectedCategory;
    const vegMatch = !showVegOnly || item.isVegetarian;
    return categoryMatch && vegMatch;
  });

  const handleAddToCart = (itemId, restaurantId, quantity, specialInstructions) => {
    try {
      addToCart(itemId, restaurantId, quantity, specialInstructions);
      // Show success toast or notification
      alert(`Added ${quantity} item(s) to cart!`);
    } catch (err) {
      alert(handleApiError(err));
    }
  };

  if (loading) {
    return <Loading message="Loading restaurant details..." />;
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="alert alert-error">
          {error}
          <button
            className="btn btn-primary"
            onClick={() => navigate('/')}
            style={{ marginTop: '1rem' }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="empty-state">
          <h3>Restaurant not found</h3>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const defaultImage = 'https://via.placeholder.com/1200x300?text=' + encodeURIComponent(restaurant.restaurantName);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--light-gray)' }}>
      {/* Restaurant Header */}
      <div
        style={{
          backgroundImage: `url(${restaurant.imageUrl || defaultImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '300px',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}
        />
        <button
          onClick={() => navigate('/')}
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            backgroundColor: 'var(--card-bg)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        {/* Restaurant Info */}
        <div style={{ backgroundColor: 'var(--card-bg)', padding: '1.5rem', borderRadius: 'var(--border-radius-md)', marginBottom: '2rem', boxShadow: 'var(--shadow-md)', border: '1px solid var(--card-border)' }}>
          <h1 style={{ margin: '0 0 0.5rem 0' }}>{restaurant.restaurantName}</h1>
          <p style={{ color: 'var(--medium-gray)', margin: '0 0 1rem 0' }}>
            {restaurant.cuisineType}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            {restaurant.averageRating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Star size={20} fill="var(--primary-green)" color="var(--primary-green)" />
                <span style={{ fontWeight: '600' }}>{restaurant.averageRating.toFixed(1)} Rating</span>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={20} color="var(--primary-green)" />
              <span style={{ fontWeight: '600' }}>30 mins delivery</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={20} color="var(--primary-green)" />
              <span style={{ fontWeight: '600' }}>2.5 km away</span>
            </div>
          </div>

          <p style={{ color: 'var(--medium-gray)' }}>{restaurant.description}</p>
        </div>

        {currentRestaurantId && currentRestaurantId !== parseInt(restaurantId) && (
          <div className="alert alert-warning" style={{ marginBottom: '1.5rem' }}>
            You have items from another restaurant in your cart. You can only order from one restaurant at a time.
          </div>
        )}

        {/* Menu Filters */}
        <div style={{ backgroundColor: 'var(--card-bg)', padding: '1rem', borderRadius: 'var(--border-radius-md)', marginBottom: '2rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--card-border)' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={showVegOnly}
                onChange={(e) => setShowVegOnly(e.target.checked)}
              />
              <span>Vegetarian Only</span>
            </label>
          </div>
        </div>

        {/* Categories */}
        {menuItems.length > 0 && (
          <div style={{ marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', minWidth: 'min-content' }}>
              <button
                className={`btn ${selectedCategory === 'All' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setSelectedCategory('All')}
                style={{ borderRadius: '20px' }}
              >
                All
              </button>
              {MENU_CATEGORIES.map((category) => (
                <button
                  key={category}
                  className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setSelectedCategory(category)}
                  style={{ borderRadius: '20px' }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Menu Items */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-1">
            {filteredItems.map((item) => (
              <MenuItem
                key={item.itemId}
                item={item}
                restaurantId={parseInt(restaurantId)}
                onAddToCart={handleAddToCart}
                isUnavailable={item.isAvailable === false}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🍽️</div>
            <h3 className="empty-state-title">No items found</h3>
            <p className="empty-state-message">
              Try adjusting your filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurant;
