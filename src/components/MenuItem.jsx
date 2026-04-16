import { Flame, Leaf, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { formatPrice } from '../utils/helpers';
import '../styles/MenuItem.css';

const MenuItem = ({ item, onAddToCart, restaurantId, isUnavailable = false }) => {
  const [quantity, setQuantity] = useState(1);
  const [showSpecialInstructions, setShowSpecialInstructions] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const handleAddToCart = () => {
    onAddToCart(item.itemId, restaurantId, quantity, specialInstructions);
    setQuantity(1);
    setSpecialInstructions('');
    setShowSpecialInstructions(false);
  };

  const defaultImage = 'https://via.placeholder.com/200x150?text=' + encodeURIComponent(item.itemName);

  return (
    <div className={`menu-item ${isUnavailable ? 'unavailable' : ''}`}>
      <div className="menu-item-image">
        <img
          src={item.imageUrl || defaultImage}
          alt={item.itemName}
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />
      </div>

      <div className="menu-item-content">
        <h4 className="menu-item-name">{item.itemName}</h4>
        <p className="menu-item-description">{item.description}</p>

        <div className="menu-item-meta">
          {item.isVegetarian && (
            <span className="menu-item-badge vegetarian">
              <Leaf size={14} />
              Veg
            </span>
          )}
          {item.isSpicy && (
            <span className="menu-item-badge spicy">
              <Flame size={14} />
              Spicy
            </span>
          )}
          <span>{item.preparationTime} min</span>
        </div>

        <div className="menu-item-footer">
          <p className="menu-item-price">{formatPrice(item.price)}</p>

          {!isUnavailable ? (
            <div className="quantity-control">
              <button
                className="quantity-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus size={16} />
              </button>
              <span className="quantity-display">{quantity}</span>
              <button
                className="quantity-btn"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus size={16} />
              </button>
              <button
                className="add-to-cart-btn"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
          ) : (
            <span className="unavailable-badge">
              Not Available
            </span>
          )}
        </div>

        {showSpecialInstructions && !isUnavailable && (
          <div className="special-instructions">
            <label>Special Instructions</label>
            <textarea
              placeholder="Add special instructions (e.g., Extra spicy, No onions)"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
            />
          </div>
        )}

        {!isUnavailable && (
          <button
            style={{
              marginTop: '0.5rem',
              backgroundColor: 'transparent',
              color: 'var(--primary-green)',
              fontSize: '0.875rem',
              padding: 0,
              fontWeight: '500',
            }}
            onClick={() => setShowSpecialInstructions(!showSpecialInstructions)}
          >
            {showSpecialInstructions ? 'Hide' : 'Add'} special instructions
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuItem;
