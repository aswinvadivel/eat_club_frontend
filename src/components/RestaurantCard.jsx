import { Clock, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { truncateText } from '../utils/helpers';
import '../styles/RestaurantCard.css';

const RestaurantCard = ({ restaurant }) => {
  const defaultImage = 'https://via.placeholder.com/400x200?text=' + encodeURIComponent(restaurant.restaurantName);
  
  return (
    <Link to={`/restaurant/${restaurant.restaurantId}`} className="restaurant-link">
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
          <p className="restaurant-summary">
            {truncateText(restaurant.description, 60)}
          </p>
          
          <div className="restaurant-meta">
            <div>
              <Clock size={16} />
              <span>30 mins</span>
            </div>
            {restaurant.totalOrders && (
              <div>
                {restaurant.totalOrders} orders
              </div>
            )}
            <div>
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
