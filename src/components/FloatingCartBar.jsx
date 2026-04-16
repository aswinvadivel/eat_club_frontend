import { ArrowRight, ShoppingBag, Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';
import '../styles/FloatingCartBar.css';

const FloatingCartBar = () => {
  const { isAdmin } = useAuth();
  const { cart, cartItems, cartItemsCount, cartTotal, clearCart } = useCart();
  const location = useLocation();

  const shouldHide =
    isAdmin ||
    cartItemsCount <= 0 ||
    location.pathname === '/login' ||
    location.pathname === '/cart' ||
    location.pathname.startsWith('/admin-console');

  const total = useMemo(() => {
    const fromCart = Number(cartTotal ?? cart?.total);
    if (Number.isFinite(fromCart) && fromCart > 0) return fromCart;

    return (cartItems || []).reduce((sum, item) => {
      const line = Number(item?.totalPrice);
      if (Number.isFinite(line) && line > 0) return sum + line;

      const quantity = Number(item?.quantity ?? 0);
      const unit = Number(item?.unitPrice ?? item?.price ?? 0);
      return sum + (Number.isFinite(quantity) ? quantity : 0) * (Number.isFinite(unit) ? unit : 0);
    }, 0);
  }, [cartTotal, cart, cartItems]);

  const handleClearCart = async () => {
    if (!window.confirm('Clear all items from cart?')) {
      return;
    }

    try {
      await clearCart();
    } catch {
      // Keep silent in popup action; cart page already handles detailed errors.
    }
  };

  if (shouldHide) return null;

  return (
    <div className="floating-cart-bar" role="status" aria-live="polite">
      <div className="floating-cart-bar-content">
        <div className="floating-cart-bar-left">
          <div className="floating-cart-bag-icon">
            <ShoppingBag size={18} />
          </div>
          <div>
            <p className="floating-cart-count">{cartItemsCount} item{cartItemsCount > 1 ? 's' : ''} added</p>
            <p className="floating-cart-total">{formatPrice(total)}</p>
          </div>
        </div>

        <div className="floating-cart-actions">
          <button type="button" className="floating-cart-clear-btn" onClick={handleClearCart} title="Clear cart">
            <Trash2 size={16} />
          </button>

          <Link to="/cart" className="floating-cart-btn">
            View Cart <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FloatingCartBar;
