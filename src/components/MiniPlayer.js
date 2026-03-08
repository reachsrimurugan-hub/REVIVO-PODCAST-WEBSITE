import React, { useEffect, useRef, useState } from 'react';

const MiniPlayer = ({ queue = [], onNext }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef(null);

  const current = queue[currentIndex];

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentIndex]);

  const toggle = () => setIsPlaying(p => !p);
  const next = () => {
    const nextIndex = currentIndex + 1 < queue.length ? currentIndex + 1 : 0;
    setCurrentIndex(nextIndex);
    if (onNext) onNext(nextIndex);
  };

  if (!current) return null;

  return (
    <div className="sticky-miniplayer py-3">
      <div className="container d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-3">
          <img src={current.thumbnailUrl} width={48} height={48} alt={current.title} className="rounded" style={{ boxShadow: 'var(--podcast-shadow)' }} />
          <div>
            <div className="fw-semibold small">{current.title}</div>
            <div className="text-muted small">{current.host}</div>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-podcast btn-sm" onClick={toggle}>
            <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
          </button>
          <button className="btn btn-podcast-outline btn-sm" onClick={next}>
            <i className="fa-solid fa-forward"></i>
          </button>
        </div>
      </div>
      <audio ref={audioRef} src={current.audioPreviewUrl} onEnded={next} />
    </div>
  );
};

export default MiniPlayer;