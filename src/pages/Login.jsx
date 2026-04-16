import { Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { handleApiError, normalizeRole } from '../utils/helpers';
import { validateLoginForm } from '../utils/validators';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setErrors({});

    // Validate
    const validationErrors = isSignup
      ? validateLoginForm(email, password) // Note: would need validateSignupForm
      : validateLoginForm(email, password);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (isSignup && password !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    setLoading(true);

    try {
      let userData;
      if (isSignup) {
        userData = await signup({ name, email, password, role: 'USER' });
      } else {
        userData = await login({ email, password });
      }

      // Redirect based on role
      if (normalizeRole(userData?.role) === 'ADMIN') {
        navigate('/admin-console');
      } else {
        navigate('/');
      }
    } catch (err) {
      setApiError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="form-container">
        <h1 className="form-title">🍽️ EatClub</h1>

        <h2 className="form-subtitle">
          {isSignup ? 'Create Account' : 'Welcome Back'}
        </h2>

        {apiError && (
          <div className="alert alert-error">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="form-group-input-wrapper">
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="form-group-input-wrapper">
              <div className="form-group-icon">
                <Mail size={20} />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="form-group-input-wrapper">
              <div className="form-group-icon">
                <Lock size={20} />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
              />
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {isSignup && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="form-group-input-wrapper">
                <div className="form-group-icon">
                  <Lock size={20} />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                />
              </div>
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>
          )}

          <button
            type="submit"
            className="form-submit-btn"
            disabled={loading}
          >
            {loading ? 'Loading...' : isSignup ? 'Create Account' : 'Login'}
          </button>
        </form>

        <div className="form-footer">
          {isSignup ? (
            <>
              Already have an account?{' '}
              <button
                onClick={() => {
                  setIsSignup(false);
                  setErrors({});
                  setApiError('');
                  setName('');
                  setConfirmPassword('');
                }}
              >
                Login here
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button
                onClick={() => {
                  setIsSignup(true);
                  setErrors({});
                  setApiError('');
                }}
              >
                Sign up here
              </button>
            </>
          )}
        </div>

        {/* Demo Credentials */}
        {/* {!isSignup && (
          <div className="demo-credentials">
            <p className="demo-credentials-title">📝 Demo Credentials:</p>
            <p className="demo-credentials-item">
              <strong>User:</strong> rajesh.kumar@example.com / password123
            </p>
            <p className="demo-credentials-item">
              <strong>Admin:</strong> arjun.verma@restaurant.com / password123
            </p>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Login;
