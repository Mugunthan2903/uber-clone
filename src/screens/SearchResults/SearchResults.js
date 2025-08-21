import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setDestination } from '../../store/slices/locationSlice';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import './SearchResults.css';

const SearchResults = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { destination } = useSelector(state => state.location);

  const searchResults = [
    { 
      name: 'The Mozart Prague', 
      address: 'Karolíny Světlé 34, 110 00 Staré Město, Czechia',
      distance: '0.8 km',
      type: 'Hotel'
    },
    { 
      name: 'Prague Castle', 
      address: 'Hradčany, 119 08 Praha 1, Czechia',
      distance: '2.3 km',
      type: 'Tourist Attraction'
    },
    { 
      name: 'Charles Bridge', 
      address: 'Karlův most, 110 00 Praha 1, Czechia',
      distance: '1.1 km',
      type: 'Landmark'
    },
    { 
      name: 'Old Town Square', 
      address: 'Staroměstské nám., 110 00 Staré Město, Czechia',
      distance: '0.5 km',
      type: 'Historic Square'
    }
  ];

  const handleStartAgain = () => {
    navigate('/');
  };

  const handleBack = () => {
    navigate('/search');
  };

  const handleSelectLocation = (location) => {
    dispatch(setDestination(location.name));
    navigate('/availability');
  };

  return (
    <div className="search-results">
      <Header showStartAgain={true} onStartAgain={handleStartAgain} />
      
      <div className="search-results-content">
        <div className="search-header">
          <h1 className="search-title">Search Results</h1>
          <p className="search-query">Showing results for "{destination}"</p>
        </div>
        
        <div className="results-list">
          {searchResults.map((result, index) => (
            <div 
              key={index} 
              className="result-item"
              onClick={() => handleSelectLocation(result)}
            >
              <div className="result-icon">
                <img 
                  src="/assets/location-blue.svg" 
                  alt="Location" 
                  className="location-icon"
                />
              </div>
              <div className="result-info">
                <div className="result-header">
                  <h3 className="result-name">{result.name}</h3>
                  <span className="result-distance">{result.distance}</span>
                </div>
                <p className="result-address">{result.address}</p>
                <span className="result-type">{result.type}</span>
              </div>
              <div className="result-arrow">
                <img 
                  src="/assets/Right-Chevron-Icon.svg" 
                  alt="Select" 
                  className="chevron-icon"
                />
              </div>
            </div>
          ))}
        </div>

        {searchResults.length === 0 && (
          <div className="no-results">
            <img 
              src="/assets/No-Results-Icon-Image.svg" 
              alt="No Results" 
              className="no-results-icon"
            />
            <h3>No results found</h3>
            <p>Try adjusting your search or check the spelling</p>
          </div>
        )}
      </div>
      
      <div className="search-results-footer">
        <div className="uber-logo-footer">
          <img 
            src="/assets/uber-logo.svg" 
            alt="Uber Logo" 
            className="uber-logo-footer-img"
          />
        </div>
        <div className="footer-buttons">
          <Button variant="secondary" onClick={handleBack}>
            ← Back to Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;