import { Navigate, Outlet, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';

// Styles
import './App.css';
import './styles/Pages.css';
import './styles/theme.css';

// Pages - User
import Cart from './pages/Cart';
import Home from './pages/Home';
import Login from './pages/Login';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Restaurant from './pages/Restaurant';

// Admin Pages
import AdminConsole from './pages/admin/AdminConsole';
import AdminMenu from './pages/admin/AdminMenu';
import AdminRestaurants from './pages/admin/AdminRestaurants';

const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <div className="app-layout">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />

              {/* Protected User Routes */}
              <Route element={<ProtectedRoute requiredRole="USER" />}>
                <Route element={<><Header /><Outlet /></>}>
                  <Route path="/" element={<Home />} />
                  <Route path="/restaurant/:restaurantId" element={<Restaurant />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>
              </Route>

              {/* Protected Admin Routes */}
              <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
                <Route element={<><Header /><Outlet /></>}>
                  <Route path="/admin-console" element={<AdminConsole />} />
                  <Route path="/admin-console/restaurants" element={<AdminRestaurants />} />
                  <Route path="/admin-console/menu/:restaurantId" element={<AdminMenu />} />
                </Route>
              </Route>

              {/* Default redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
