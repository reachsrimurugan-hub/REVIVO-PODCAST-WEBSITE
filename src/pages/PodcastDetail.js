import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPodcastById } from '../services/api';
import AudioPlayer from '../components/AudioPlayer';

const mockEpisodes = (pod) => Array.from({ length: 8 }).map((_, i) => ({
  id: `${pod?.id}-ep-${i+1}`,
  title: `${pod?.title} — Episode ${i+1}`,
  audioUrl: pod?.audioPreviewUrl,
  duration: `${20 + i} min`
}));

const PodcastDetail = () => {
  const { id } = useParams();
  const [podcast, setPodcast] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPodcastById(id);
        setPodcast(data);
      } catch (error) {
        console.error('Error fetching podcast:', error);
        setPodcast(null);
      }
    })();
  }, [id]);

  if (!podcast) return <div className="container py-4">Loading...</div>;

  const episodes = mockEpisodes(podcast);

  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-md-4">
          <img src={podcast.thumbnailUrl} alt={podcast.title} className="img-fluid rounded shadow" />
        </div>
        <div className="col-md-8">
          <h2>{podcast.title}</h2>
          <p className="text-muted">{podcast.host} · {podcast.category} · {podcast.language}</p>
          <div className="d-flex gap-3 mb-3">
            <div className="text-warning"><i className="fa-solid fa-star"></i> {podcast.rating}</div>
            <div><i className="fa-solid fa-calendar"></i> {new Date(podcast.releaseDate).toLocaleDateString()}</div>
          </div>
          <AudioPlayer url={podcast.audioPreviewUrl} />

          <div className="mt-4">
            <h5>About this podcast</h5>
            <div className="revivo-card p-3 rounded">
              <p>{podcast.description}</p>
                              <div className="d-flex flex-wrap gap-2 mt-2">
                  {['AI', 'Technology', 'Innovation', 'Trends'].map(t => (
                    <span key={t} className="badge bg-secondary">#{t}</span>
                  ))}
                </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PodcastDetail;