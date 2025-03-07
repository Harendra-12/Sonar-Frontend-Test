import React, { useState, useEffect } from 'react';
import { AudioVisualizer } from 'react-audio-visualize';

const AudioPlayer = ({ audioUrl }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioSrc, setAudioSrc] = useState(null);

  useEffect(() => {
    const loadAudio = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const corsProxy = 'https://corsproxy.io/?'; 
        const proxiedUrl = audioUrl 
        const response = await fetch(proxiedUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch audio: ${response.status} ${response.statusText}`);
        }
        
        const blob = await response.blob();
        const objectURL = URL.createObjectURL(blob);
        
        setAudioBlob(blob); 
        setAudioSrc(objectURL);  
      } catch (err) {
        console.error('Error loading audio:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (audioUrl) {
      loadAudio();
    }
    
    // Cleanup function to prevent memory leaks
    return () => {
      if (audioSrc) {
        URL.revokeObjectURL(audioSrc);
      }
    };
  }, [audioUrl]);
  if (isLoading) {
    return <div>Loading audio...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {audioBlob && (
        <div>
          <AudioVisualizer
            blob={audioBlob}
            width={600}
            height={200}
            barWidth={2}
            gap={1}
            barColor="#3498db"
            barPlayedColor="#2ecc71"
          />
          <audio controls>
            <source src={audioSrc} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
