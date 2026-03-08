import React, { useEffect, useMemo, useState } from 'react';
import { fetchPodcasts } from '../services/api';
import PodcastCard from '../components/PodcastCard';
import MiniPlayer from '../components/MiniPlayer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

const Home = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchPodcasts({ _limit: 12, _sort: 'rating', _order: 'desc' });
        setPodcasts(data);
        setQueue(data.slice(0, 5));
        setError(null);
      } catch (error) {
        console.error('Error fetching podcasts:', error);
        setError('Failed to load podcasts');
        setPodcasts([]);
        setQueue([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const featured = useMemo(() => podcasts.slice(0, 6), [podcasts]);
  const recommendations = useMemo(() => podcasts.slice(6, 12), [podcasts]);

  if (loading) {
    return (
      <div className="container py-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4 text-center">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3" style={{ background: 'var(--podcast-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Discover Amazing Podcasts
        </h1>
        <p className="lead text-muted">Best Episodes of the week just for you</p>
      </div>
      
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h3 className="mb-0 fw-bold">
          <i className="fa-solid fa-fire text-warning me-2"></i>Spotlight
        </h3>
      </div>
      {featured.length > 0 && (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={16}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          breakpoints={{
            576: { slidesPerView: 2 },
            992: { slidesPerView: 3 },
          }}
        >
          {featured.map(p => (
            <SwiperSlide key={p.id}>
              <PodcastCard podcast={p} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {recommendations.length > 0 && (
        <>
          <div className="d-flex align-items-center justify-content-between mt-5 mb-4">
            <h3 className="mb-0 fw-bold">
              <i className="fa-solid fa-brain text-primary me-2"></i>Listen Next
            </h3>
          </div>
          <div className="row g-3">
            {recommendations.map(p => (
              <div key={p.id} className="col-12 col-sm-6 col-lg-4">
                <PodcastCard podcast={p} />
              </div>
            ))}
          </div>
        </>
      )}

      {queue.length > 0 && <MiniPlayer queue={queue} />}
    </div>
  );
};

export default Home;