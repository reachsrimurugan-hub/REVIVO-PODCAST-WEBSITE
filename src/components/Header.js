import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { fetchPodcasts } from '../services/api';

const Header = ({ onToggleTheme, isDark }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  // Search suggestions effect
  useEffect(() => {
    const id = setTimeout(async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      try {
        const results = await fetchPodcasts();
        // Filter suggestions based on title matches
        const filtered = results.filter(podcast =>
          podcast.title.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);
        setSuggestions(filtered);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 200);
    return () => clearTimeout(id);
  }, [query]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    setSuggestions([]);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleSuggestionClick = (podcastId) => {
    setShowSuggestions(false);
    setSuggestions([]);
    setQuery('');
    navigate(`/podcasts/${podcastId}`);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold">
          <i className="fa-solid fa-podcast me-2"></i>Revivo
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#revivoNav" aria-controls="revivoNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="revivoNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink to="/" end className="nav-link fw-semibold">
                <i className="fa-solid fa-home me-1"></i>Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/podcasts" className="nav-link fw-semibold">
                <i className="fa-solid fa-podcast me-1"></i>Podcasts
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/contact" className="nav-link fw-semibold">
                <i className="fa-solid fa-envelope me-1"></i>Feedback
              </NavLink>
            </li>
          </ul>

          {/* Search Bar */}
          <div className="d-flex align-items-center gap-3">
            <div className="position-relative">
              <form className="d-flex" onSubmit={handleSearchSubmit} role="search">
                <div className="input-group">
                  <input
                    className="form-control"
                    type="search"
                    placeholder="Search podcasts..."
                    aria-label="Search podcasts"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.trim().length >= 2 && setShowSuggestions(true)}
                  />
                  <button className="btn" type="submit">
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </button>
                </div>
              </form>

              {/* Search Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="position-absolute bg-white shadow rounded w-100 mt-1" style={{ zIndex: 1050, top: '100%' }}>
                  {suggestions.map(s => (
                    <div
                      key={s.id}
                      className="d-flex align-items-center p-2 clickable border-bottom"
                      onClick={() => handleSuggestionClick(s.id)}
                      style={{ minHeight: '50px' }}
                    >
                      <img src={s.thumbnailUrl} alt={s.title} width={32} height={32} className="rounded me-2" />
                      <div className="flex-grow-1">
                        <div className="fw-semibold small text-dark">{s.title}</div>
                        <div className="text-muted small">{s.category}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showSuggestions && query.trim().length >= 2 && suggestions.length === 0 && (
                <div className="position-absolute bg-white shadow rounded w-100 mt-1 p-2 text-muted small" style={{ zIndex: 1050, top: '100%' }}>
                  No podcasts found matching "{query}"
                </div>
              )}
            </div>

            <button className="btn btn-podcast-outline" onClick={onToggleTheme}>
              <i className={`fa-solid ${isDark ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;