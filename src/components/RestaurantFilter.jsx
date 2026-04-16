import { Filter, Search } from 'lucide-react';
import { useState } from 'react';
import { CUISINE_TYPES, SORT_OPTIONS } from '../utils/constants';

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
      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <Search 
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
            type="text"
            placeholder="Search restaurants..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={{
              paddingLeft: '2.5rem',
            }}
          />
        </div>
      </div>

      {/* Sort */}
      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <label className="filter-label">Sort By</label>
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
        className="btn btn-secondary"
        style={{
          display: window.innerWidth < 768 ? 'flex' : 'none',
          width: '100%',
          justifyContent: 'center',
          gap: '0.5rem',
          marginBottom: '1rem',
        }}
        onClick={() => setShowFilters(!showFilters)}
      >
        <Filter size={20} />
        Filters
      </button>

      {/* Filters Section */}
      <div
        style={{
          display: window.innerWidth < 768 ? (showFilters ? 'block' : 'none') : 'block',
        }}
      >
        {/* Cuisine Types */}
        <div className="filter-section" style={{ marginBottom: '1.5rem' }}>
          <label className="filter-label">Cuisine Types</label>
          <div className="filter-options">
            {CUISINE_TYPES.map((cuisine) => (
              <label key={cuisine} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="cuisine"
                  value={cuisine}
                  checked={selectedCuisine === cuisine}
                  onChange={() => handleCuisineChange(cuisine)}
                  style={{ marginRight: '0.5rem' }}
                />
                <span>{cuisine}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Dietary Preferences */}
        <div className="filter-section">
          <label className="filter-label">Dietary Preferences</label>
          <div className="filter-options">
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isVegetarian}
                onChange={handleVegetarianChange}
                style={{ marginRight: '0.5rem' }}
              />
              <span>Pure Vegetarian</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantFilter;
