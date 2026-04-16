import { Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { handleApiError } from '../utils/helpers';
import { validateLoginForm } from '../utils/validators';

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
      if (isSignup) {
        await signup({ name, email, password, role: 'USER' });
      } else {
        await login({ email, password });
      }

      // Redirect based on role
      setTimeout(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData?.role === 'ADMIN') {
          navigate('/admin-console');
        } else {
          navigate('/');
        }
      }, 100);
    } catch (err) {
      setApiError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, var(--light-green) 0%, var(--light-gray) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="form-container">
        <h1 className="form-title">
          🍽️ EatClub
        </h1>

        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
          {isSignup ? 'Create Account' : 'Welcome Back'}
        </h2>

        {apiError && (
          <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={20}
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--medium-gray)',
                  pointerEvents: 'none',
                }}
              />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={20}
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--medium-gray)',
                  pointerEvents: 'none',
                }}
              />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {isSignup && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={20}
                  style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--medium-gray)',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-large"
            disabled={loading}
            style={{ marginTop: '1.5rem' }}
          >
            {loading ? 'Loading...' : isSignup ? 'Create Account' : 'Login'}
          </button>
        </form>

        <div className="form-footer">
          {isSignup ? (
            <>
              Already have an account?{' '}
              <button
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--primary-green)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  textDecoration: 'none',
                  padding: 0,
                }}
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
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--primary-green)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  textDecoration: 'none',
                  padding: 0,
                }}
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
        {!isSignup && (
          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'var(--light-green)', borderRadius: 'var(--border-radius)', border: '1px solid var(--primary-green)' }}>
            <p style={{ fontSize: '0.875rem', margin: 0, marginBottom: '0.5rem', fontWeight: '600' }}>
              📝 Demo Credentials:
            </p>
            <p style={{ fontSize: '0.8rem', margin: '0.25rem 0', color: 'var(--dark-gray)' }}>
              <strong>User:</strong> rajesh.kumar@example.com / password123
            </p>
            <p style={{ fontSize: '0.8rem', margin: '0.25rem 0', color: 'var(--dark-gray)' }}>
              <strong>Admin:</strong> arjun.verma@restaurant.com / password123
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
