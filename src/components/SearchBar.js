import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPodcasts } from '../services/api';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

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

  const onSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    setSuggestions([]);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="position-relative">
      <form className="d-flex" onSubmit={onSubmit} role="search">
        <input className="form-control me-2" type="search" placeholder="Search podcasts, moods, themes..." aria-label="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button className="btn btn-primary" type="submit"><i className="fa-solid fa-magnifying-glass"></i></button>
      </form>
      {showSuggestions && suggestions.length > 0 && (
        <div className="position-absolute bg-white shadow rounded w-100 mt-1" style={{ zIndex: 1050 }}>
          {suggestions.map(s => (
            <div key={s.id} className="d-flex align-items-center p-2 clickable" onClick={() => navigate(`/podcasts/${s.id}`)}>
              <img src={s.thumbnailUrl} alt={s.title} width={40} height={40} className="rounded me-2" />
              <div>
                <div className="fw-semibold">{s.title}</div>
                <div className="text-muted small">{s.category}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {showSuggestions && query.trim().length >= 2 && suggestions.length === 0 && (
        <div className="position-absolute bg-white shadow rounded w-100 mt-1 p-2 text-muted small" style={{ zIndex: 1050 }}>
          No podcasts found matching "{query}"
        </div>
      )}
    </div>
  );
};

export default SearchBar;