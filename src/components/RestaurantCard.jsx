import { Clock, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { truncateText } from '../utils/helpers';

const RestaurantCard = ({ restaurant }) => {
  const defaultImage = 'https://via.placeholder.com/400x200?text=' + encodeURIComponent(restaurant.restaurantName);
  
  return (
    <Link to={`/restaurant/${restaurant.restaurantId}`} style={{ textDecoration: 'none' }}>
      <div className="restaurant-card">
        <div className="restaurant-image">
          <img 
            src={restaurant.imageUrl || defaultImage} 
            alt={restaurant.restaurantName}
            onError={(e) => {
              e.target.src = defaultImage;
            }}
          />
        </div>
        
        <div className="restaurant-info">
          <div className="restaurant-header">
            <h3 className="restaurant-name">{restaurant.restaurantName}</h3>
            {restaurant.averageRating && (
              <div className="restaurant-rating">
                <Star size={16} fill="white" />
                {restaurant.averageRating.toFixed(1)}
              </div>
            )}
          </div>
          
          <p className="restaurant-cuisine">{restaurant.cuisineType}</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--medium-gray)', marginBottom: '0.75rem' }}>
            {truncateText(restaurant.description, 60)}
          </p>
          
          <div className="restaurant-meta">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Clock size={16} />
              <span>30 mins</span>
            </div>
            {restaurant.totalOrders && (
              <div style={{ color: 'var(--medium-gray)' }}>
                {restaurant.totalOrders} orders
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={16} />
              <span>Nearby</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
