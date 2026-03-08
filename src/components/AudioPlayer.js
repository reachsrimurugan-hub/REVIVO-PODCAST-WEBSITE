import React, { useEffect, useRef, useState } from 'react';

const AudioPlayer = ({ url }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // For now, let's use a simple HTML5 audio player instead of WaveSurfer
    // to avoid potential compatibility issues
    setIsLoaded(true);
  }, [url]);

  if (error) {
    return <div className="text-danger">Error loading audio: {error}</div>;
  }

  return (
    <div className="w-100">
      <audio controls className="w-100" src={url}>
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;