import { Flame, Leaf, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { formatPrice } from '../utils/helpers';

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
    <div className="menu-item" style={{ opacity: isUnavailable ? 0.6 : 1 }}>
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
            <span className="menu-item-badge" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
              <Leaf size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
              Veg
            </span>
          )}
          {item.isSpicy && (
            <span className="menu-item-badge" style={{ backgroundColor: '#fee', color: '#dc2626' }}>
              <Flame size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
              Spicy
            </span>
          )}
          <span style={{ fontSize: '0.875rem', color: 'var(--medium-gray)' }}>
            {item.preparationTime} min
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className="menu-item-price">{formatPrice(item.price)}</p>

          {!isUnavailable ? (
            <div className="menu-item-controls">
              <button
                className="btn btn-small"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ borderRadius: '4px', padding: '0.25rem 0.75rem' }}
              >
                <Minus size={18} />
              </button>
              <span style={{ minWidth: '2rem', textAlign: 'center', fontWeight: '600' }}>
                {quantity}
              </span>
              <button
                className="btn btn-small"
                onClick={() => setQuantity(quantity + 1)}
                style={{ borderRadius: '4px', padding: '0.25rem 0.75rem' }}
              >
                <Plus size={18} />
              </button>
              <button
                className="btn btn-primary btn-small"
                onClick={handleAddToCart}
                style={{ borderRadius: '4px' }}
              >
                Add
              </button>
            </div>
          ) : (
            <span style={{ color: 'var(--error)', fontWeight: '600', fontSize: '0.875rem' }}>
              Not Available
            </span>
          )}
        </div>

        {showSpecialInstructions && !isUnavailable && (
          <div style={{ marginTop: '0.75rem' }}>
            <textarea
              placeholder="Add special instructions (e.g., Extra spicy, No onions)"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              style={{ minHeight: '60px' }}
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
