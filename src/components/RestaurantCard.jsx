import { Clock, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getRestaurantId, truncateText } from '../utils/helpers';
import '../styles/RestaurantCard.css';

const RestaurantCard = ({ restaurant }) => {
  const restaurantId = getRestaurantId(restaurant);
  const restaurantName = restaurant?.restaurantName || restaurant?.name || 'Restaurant';
  const defaultImage = 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1200';
  const targetPath = restaurantId ? `/restaurant/${restaurantId}` : '/';
  
  return (
    <Link to={targetPath} className="restaurant-link" aria-disabled={!restaurantId}>
      <div className="restaurant-card">
        <div className="restaurant-image">
          <img 
            src={restaurant.imageUrl || defaultImage} 
            alt={restaurantName}
            onError={(e) => {
              e.target.src = defaultImage;
            }}
          />
        </div>
        
        <div className="restaurant-info">
          <div className="restaurant-header">
            <h3 className="restaurant-name">{restaurantName}</h3>
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
