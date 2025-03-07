import React, { useState, useEffect } from 'react';
import { AudioVisualizer } from 'react-audio-visualize';

const AudioPlayer = ({ audioUrl }) => {
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrlBlob, setAudioUrlBlob] = useState(null);

  useEffect(() => {
    const fetchAudio = async () => {
      try {
        const response = await fetch(audioUrl);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch audio: ${response.status} ${response.statusText}`
          );
        }
        const blob = await response.blob();
        setAudioBlob(blob);
        setAudioUrlBlob(URL.createObjectURL(blob));
      } catch (error) {
        console.error("Error fetching audio:", error);
      }
    };

    if (audioUrl) fetchAudio();
  }, [audioUrl]);

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
            <source src={audioUrlBlob} type="audio/wav" />
          </audio>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
