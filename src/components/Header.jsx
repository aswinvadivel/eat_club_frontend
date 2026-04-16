import { LogOut, Menu, Moon, ShoppingCart, Sun, User, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { getInitials } from '../utils/helpers';
import '../styles/Header.css';

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartItemsCount } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          🍽️ EatClub
        </Link>

        {/* Desktop Navigation */}
        <nav className="header-nav">
          {!isAdmin && (
            <>
              <Link to="/">Browse</Link>
              <Link to="/orders">Orders</Link>
            </>
          )}
          {isAdmin && (
            <>
              <Link to="/admin-console">Dashboard</Link>
              <Link to="/admin-console/restaurants">Restaurants</Link>
            </>
          )}
        </nav>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun size={24} /> : <Moon size={24} />}
          </button>

          {user && (
            <>
              {!isAdmin && (
                <Link to="/cart" className="cart-badge">
                  <ShoppingCart size={24} />
                  {cartItemsCount > 0 && <span className="cart-badge-count">{cartItemsCount}</span>}
                </Link>
              )}

              <div className="user-menu">
                <div
                  className="user-avatar"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  title={user.name}
                >
                  {getInitials(user.name)}
                </div>

                {showUserMenu && (
                  <div className="user-dropdown">
                    <div style={{ padding: 'var(--spacing-lg)' }}>
                      <p style={{ margin: 0, fontWeight: 600, marginBottom: 'var(--spacing-sm)' }}>
                        {user.name}
                      </p>
                      <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--medium-gray)' }}>
                        {user.email}
                      </p>
                    </div>
                    <hr style={{ margin: '0', border: 'none', borderTop: '1px solid var(--border-color)' }} />
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User size={18} /> Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="logout-btn"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Mobile Menu Toggle */}
          {window.innerWidth < 768 && (
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              style={{
                backgroundColor: 'transparent',
                color: 'var(--dark-gray)',
                padding: 0,
              }}
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {showMobileMenu && window.innerWidth < 768 && (
        <nav
          style={{
            backgroundColor: 'var(--light-gray)',
            padding: '1rem',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          {!isAdmin && (
            <>
              <Link to="/" onClick={() => setShowMobileMenu(false)}>
                Browse
              </Link>
              <Link to="/orders" onClick={() => setShowMobileMenu(false)}>
                Orders
              </Link>
            </>
          )}
          {isAdmin && (
            <>
              <Link to="/admin-console" onClick={() => setShowMobileMenu(false)}>
                Dashboard
              </Link>
              <Link to="/admin-console/restaurants" onClick={() => setShowMobileMenu(false)}>
                Restaurants
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
