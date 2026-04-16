import { Mail, MapPin, Phone, User } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { getInitials, handleApiError } from '../utils/helpers';
import { validateProfileForm } from '../utils/validators';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationErrors = validateProfileForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await userAPI.updateProfile({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      });

      // Update local user state
      setUser(response.data);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', backgroundColor: 'var(--light-gray)', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <h1 style={{ marginBottom: '2rem' }}>My Profile</h1>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
            {success}
          </div>
        )}

        {/* Profile Header */}
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--border-radius)', textAlign: 'center', marginBottom: '2rem', boxShadow: 'var(--shadow)' }}>
          <div
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-green)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              fontWeight: '700',
              margin: '0 auto 1rem auto',
            }}
          >
            {getInitials(user?.name)}
          </div>
          <h2 style={{ margin: '0 0 0.5rem 0' }}>{user?.name}</h2>
          <p style={{ margin: 0, color: 'var(--medium-gray)', fontSize: '0.875rem' }}>
            {user?.role}
          </p>
        </div>

        {/* Profile Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: 'var(--border-radius)',
            boxShadow: 'var(--shadow)',
          }}
        >
          <div className="form-group">
            <label htmlFor="name">
              <User size={18} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Full Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <Mail size={18} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
            <p style={{ fontSize: '0.875rem', color: 'var(--medium-gray)', margin: '0.5rem 0 0 0' }}>
              Email cannot be changed
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              <Phone size={18} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Enter 10-digit phone number"
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="address">
              <MapPin size={18} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Delivery Address
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Enter your complete delivery address"
              rows={4}
            />
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            {!isEditing ? (
              <button
                type="button"
                className="btn btn-primary btn-large"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  type="submit"
                  className="btn btn-primary btn-large"
                  disabled={loading}
                  style={{ flex: 1 }}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-large"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user?.name || '',
                      email: user?.email || '',
                      phone: user?.phone || '',
                      address: user?.address || '',
                    });
                    setErrors({});
                  }}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>

        {/* Additional Info */}
        <div
          style={{
            backgroundColor: 'var(--light-green)',
            border: '1px solid var(--primary-green)',
            padding: '1.5rem',
            borderRadius: 'var(--border-radius)',
            marginTop: '2rem',
          }}
        >
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-green)' }}>
            ✅ Account Information
          </h3>
          <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--dark-gray)', fontSize: '0.875rem' }}>
            <li>Your account is verified and active</li>
            <li>You can place orders from any restaurant</li>
            <li>Keep your address updated for smooth deliveries</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
