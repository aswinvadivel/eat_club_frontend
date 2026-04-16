export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(price);
};

export const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const calculateDeliveryTime = (estimatedDeliveryTime, createdAt) => {
  if (!estimatedDeliveryTime) return '30 mins';
  const minutes = Math.round((estimatedDeliveryTime - createdAt) / 60000);
  return `${minutes} mins`;
};

export const truncateText = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

export const generateOrderId = () => {
  const date = new Date();
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const random = Math.floor(Math.random() * 10000);
  return `ORD-${dateStr}-${String(random).padStart(4, '0')}`;
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const formatSearchQuery = (query) => {
  return query.trim().toLowerCase();
};

export const searchRestaurants = (restaurants, query) => {
  const q = formatSearchQuery(query);
  if (!q) return restaurants;
  
  return restaurants.filter((r) =>
    r.restaurantName.toLowerCase().includes(q) ||
    r.description.toLowerCase().includes(q) ||
    r.cuisineType.toLowerCase().includes(q)
  );
};

export const filterRestaurants = (restaurants, filters) => {
  let result = [...restaurants];
  
  if (filters.cuisine && filters.cuisine !== 'All') {
    result = result.filter((r) => r.cuisineType === filters.cuisine);
  }
  
  if (filters.isVegetarian) {
    // For restaurants, we'd need to check if they have vegetarian options
    // This is a simplified version
    result = result.filter((r) => r.cuisineType !== 'Meat Heavy');
  }
  
  return result;
};

export const sortRestaurants = (restaurants, sortBy) => {
  const sorted = [...restaurants];
  
  switch (sortBy) {
    case 'rating':
      return sorted.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    case 'delivery-time':
      return sorted.sort((a, b) => (a.deliveryTime || 30) - (b.deliveryTime || 30));
    case 'price-low':
      return sorted; // Would need more data
    case 'price-high':
      return sorted; // Would need more data
    case 'relevance':
    default:
      return sorted;
  }
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const handleApiError = (error) => {
  if (error.response?.status === 401) {
    return 'Please log in again';
  }
  if (error.response?.status === 403) {
    return 'You do not have permission for this action';
  }
  if (error.response?.status === 404) {
    return 'Resource not found';
  }
  if (error.response?.status === 400) {
    return error.response?.data?.message || 'Invalid request';
  }
  if (error.response?.status === 409) {
    return error.response?.data?.message || 'Resource already exists';
  }
  return error.response?.data?.message || error.message || 'Something went wrong';
};

export const normalizeRole = (role) => {
  if (!role) return '';
  return String(role).replace(/^ROLE_/i, '').toUpperCase();
};
