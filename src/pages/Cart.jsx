import { ChevronLeft, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { useCart } from '../context/CartContext';
import { orderAPI, restaurantAPI } from '../services/api';
import { formatPrice, handleApiError } from '../utils/helpers';

const Cart = () => {
  const { cartItems, cart, updateCartItem, removeFromCart, clearCart } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [error, setError] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!cart?.restaurantId) {
      setLoading(false);
      return;
    }

    const fetchRestaurant = async () => {
      try {
        const response = await restaurantAPI.getById(cart.restaurantId);
        setRestaurant(response.data);
      } catch (err) {
        console.error('Error fetching restaurant:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [cart?.restaurantId]);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const tax = subtotal * 0.05; // 5% tax
  const deliveryCharge = 40;
  const total = subtotal + tax + deliveryCharge;

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateCartItem(itemId, newQuantity);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!deliveryAddress.trim()) {
      setError('Please enter delivery address');
      return;
    }

    if (!phoneNumber.trim() || phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setOrderLoading(true);

    try {
      const response = await orderAPI.create({
        deliveryAddress,
        phoneNumber,
        paymentMethod,
      });

      // Success
      alert('Order placed successfully!');
      clearCart();
      navigate(`/orders/${response.data.orderId}`);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Loading cart..." />;
  }

  if (cartItems.length === 0) {
    return (
      <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <h3 className="empty-state-title">Your cart is empty</h3>
          <p className="empty-state-message">
            Add some delicious items to your cart
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/')}
            style={{ marginTop: '1rem' }}
          >
            Continue Browsing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', backgroundColor: 'var(--light-gray)', paddingTop: '1.5rem', paddingBottom: '2rem' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <ChevronLeft size={24} />
          </button>
          <h1>Your Cart</h1>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', '@media (max-width: 768px)': { gridTemplateColumns: '1fr' } }}>
          {/* Cart Items */}
          <div>
            {restaurant && (
              <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: 'var(--border-radius)', marginBottom: '1.5rem', boxShadow: 'var(--shadow)' }}>
                <p style={{ margin: 0, color: 'var(--medium-gray)', fontSize: '0.875rem' }}>
                  FROM
                </p>
                <h3 style={{ margin: '0.5rem 0 0 0' }}>{restaurant.restaurantName}</h3>
              </div>
            )}

            {cartItems.map((item) => (
              <div
                key={item.cartItemId}
                style={{
                  backgroundColor: 'white',
                  padding: '1rem',
                  borderRadius: 'var(--border-radius)',
                  marginBottom: '1rem',
                  boxShadow: 'var(--shadow)',
                  display: 'flex',
                  gap: '1rem',
                }}
              >
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.25rem 0' }}>{item.itemName}</h4>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--medium-gray)' }}>
                    {item.specialInstructions && `Special: ${item.specialInstructions}`}
                  </p>
                  <p style={{ margin: '0.5rem 0 0 0', fontWeight: '600' }}>
                    {formatPrice(item.price)}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleQuantityChange(item.cartItemId, item.quantity - 1)}
                    style={{
                      backgroundColor: 'var(--light-gray)',
                      border: 'none',
                      borderRadius: '4px',
                      width: '30px',
                      height: '30px',
                      cursor: 'pointer',
                    }}
                  >
                    −
                  </button>
                  <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: '600' }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item.cartItemId, item.quantity + 1)}
                    style={{
                      backgroundColor: 'var(--light-gray)',
                      border: 'none',
                      borderRadius: '4px',
                      width: '30px',
                      height: '30px',
                      cursor: 'pointer',
                    }}
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'var(--error)',
                      cursor: 'pointer',
                      marginLeft: '0.5rem',
                    }}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={() => {
                if (confirm('Clear entire cart? This action cannot be undone.')) {
                  clearCart();
                  navigate('/');
                }
              }}
              className="btn btn-outline"
              style={{ width: '100%', marginTop: '1rem' }}
            >
              Clear Cart
            </button>
          </div>

          {/* Checkout */}
          <div>
            {/* Bill Summary */}
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--border-radius)', marginBottom: '1.5rem', boxShadow: 'var(--shadow)' }}>
              <h3 style={{ margin: '0 0 1rem 0' }}>Bill Details</h3>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span>Tax (5%)</span>
                <span>{formatPrice(tax)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span>Delivery Charge</span>
                <span>{formatPrice(deliveryCharge)}</span>
              </div>

              <hr style={{ margin: '0.75rem 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '1.125rem' }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary-green)' }}>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Checkout Form */}
            <form onSubmit={handlePlaceOrder} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow)' }}>
              <h3 style={{ margin: '0 0 1rem 0' }}>
                {showCheckout ? 'Delivery Details' : 'Review Order'}
              </h3>

              {!showCheckout ? (
                <button
                  type="button"
                  className="btn btn-primary btn-large"
                  onClick={() => setShowCheckout(true)}
                >
                  Proceed to Checkout
                </button>
              ) : (
                <>
                  <div className="form-group">
                    <label>Delivery Address *</label>
                    <textarea
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Enter your delivery address"
                      minLength="10"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter 10-digit phone number"
                      minLength="10"
                      maxLength="10"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Payment Method *</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      required
                    >
                      <option value="UPI">UPI</option>
                      <option value="DEBIT_CARD">Debit Card</option>
                      <option value="CREDIT_CARD">Credit Card</option>
                      <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-large"
                    disabled={orderLoading}
                  >
                    {orderLoading ? 'Placing Order...' : `Place Order - ${formatPrice(total)}`}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline btn-large"
                    onClick={() => setShowCheckout(false)}
                  >
                    Back
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
