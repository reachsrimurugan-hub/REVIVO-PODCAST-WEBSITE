import React from 'react';
import { useNavigate } from 'react-router-dom';

const PodcastCard = ({ podcast }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/podcasts/${podcast.id}`);
  };

  return (
    <div className="card card-podcast h-100 clickable" onClick={handleCardClick}>
      <div className="position-relative">
        <img src={podcast.thumbnailUrl} className="card-img-top" alt={podcast.title} />
        {podcast.badge && (
          <span className={`badge badge-podcast position-absolute top-0 end-0 m-2 ${
            podcast.badge === 'Trending' ? 'badge-trending' : 
            podcast.badge === 'New' ? 'badge-new' : 'badge-editors-pick'
          }`}>
            {podcast.badge}
          </span>
        )}
      </div>
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title mb-1 text-truncate">{podcast.title}</h5>
        </div>
        <p className="card-text text-muted small mb-3">{podcast.host} · {podcast.category}</p>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center text-warning">
            <i className="fa-solid fa-star me-1"></i>
            <span className="fw-semibold">{podcast.rating}</span>
          </div>
          <div className="text-muted small">
            <i className="fa-solid fa-play me-1"></i>Listen
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodcastCard;