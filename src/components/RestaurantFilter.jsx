import { Filter, Search } from 'lucide-react';
import { useState } from 'react';
import { CUISINE_TYPES, SORT_OPTIONS } from '../utils/constants';
import '../styles/RestaurantFilter.css';

const RestaurantFilter = ({ onFilterChange, onSearchChange, onSortChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [sortBy, setSortBy] = useState('relevance');
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearchChange(value);
  };

  const handleCuisineChange = (cuisine) => {
    setSelectedCuisine(cuisine);
    onFilterChange({ cuisine, isVegetarian });
  };

  const handleVegetarianChange = (e) => {
    const checked = e.target.checked;
    setIsVegetarian(checked);
    onFilterChange({ cuisine: selectedCuisine, isVegetarian: checked });
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    onSortChange(value);
  };

  return (
    <div className="filter-panel">
      {/* Search Bar */}
      <div className="form-group">
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search restaurants..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Sort */}
      <div className="form-group">
        <label>Sort By</label>
        <select value={sortBy} onChange={handleSortChange}>
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filters Toggle (Mobile) */}
      <button
        className="filter-toggle-btn"
        onClick={() => setShowFilters(!showFilters)}
      >
        <Filter size={20} />
        Filters
      </button>

      {/* Filters Section */}
      <div className={`filters-content ${showFilters ? 'show' : ''}`}>
        {/* Cuisine Types */}
        <div className="form-group">
          <label>Cuisine Types</label>
          <div className="filter-buttons">
            {CUISINE_TYPES.map((cuisine) => (
              <button
                key={cuisine}
                className={`filter-button ${selectedCuisine === cuisine ? 'active' : ''}`}
                onClick={() => handleCuisineChange(cuisine)}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>

        {/* Dietary Preferences */}
        <div className="form-group">
          <div className="vegetarian-filter">
            <input
              type="checkbox"
              id="veg-filter"
              checked={isVegetarian}
              onChange={handleVegetarianChange}
            />
            <label htmlFor="veg-filter">Pure Vegetarian</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantFilter;
