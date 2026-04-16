import { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import RestaurantCard from '../components/RestaurantCard';
import RestaurantFilter from '../components/RestaurantFilter';
import { restaurantAPI } from '../services/api';
import { filterRestaurants, handleApiError, searchRestaurants, sortRestaurants } from '../utils/helpers';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilters, setCurrentFilters] = useState({ cuisine: 'All', isVegetarian: false });
  const [currentSort, setCurrentSort] = useState('relevance');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await restaurantAPI.getAll({ page: 0, size: 50 });
        setRestaurants(response.data.content || []);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...restaurants];

    // Apply search
    if (searchQuery) {
      result = searchRestaurants(result, searchQuery);
    }

    // Apply filters
    result = filterRestaurants(result, currentFilters);

    // Apply sorting
    result = sortRestaurants(result, currentSort);

    setFilteredRestaurants(result);
  }, [restaurants, searchQuery, currentFilters, currentSort]);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filters) => {
    setCurrentFilters(filters);
  };

  const handleSortChange = (sortValue) => {
    setCurrentSort(sortValue);
  };

  if (loading) {
    return <Loading message="Finding restaurants near you..." />;
  }

  return (
    <div className="page-shell home-page">
      <div className="container">
        {/* Hero Section */}
        <div className="home-hero">
          <h1 className="home-title">
            Order Food Online
          </h1>
          <p className="home-subtitle">
            Browse through your favorite restaurants and discover new cuisines
          </p>
        </div>

        {error && (
          <div className="alert alert-error home-alert">
            {error}
          </div>
        )}

        {/* Filters and Search */}
        <RestaurantFilter
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          onSortChange={handleSortChange}
        />

        {/* Results */}
        {filteredRestaurants.length > 0 ? (
          <>
            <p className="home-results-count">
              Found <strong>{filteredRestaurants.length}</strong> restaurants
            </p>
            <div className="grid grid-2 home-grid">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.restaurantId} restaurant={restaurant} />
              ))}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3 className="empty-state-title">No restaurants found</h3>
            <p className="empty-state-message">
              Try adjusting your filters or search query
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
