import React, { useRef, useEffect } from "react";

const MusicPlayer = ({ audioSrc, isPlaying, onPlay, onStop }) => {
  const audioRef = useRef(null);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
      onStop();
    } else {
      audioRef.current.play();
      onPlay();
    }
  };

  // Pause the audio if it is not the currently playing one
  useEffect(() => {
    if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Listen for the end of the audio and stop it
  useEffect(() => {
    const audioElement = audioRef.current;

    const handleAudioEnd = () => {
      onStop(); // Call the onStop callback to update the UI and state
    };

    if (audioElement) {
      audioElement.addEventListener("ended", handleAudioEnd);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener("ended", handleAudioEnd);
      }
    };
  }, [onStop]);

  return (
    <div>
      <audio ref={audioRef} src={audioSrc}></audio>
      <button onClick={togglePlayPause} className="tableButton px-2 mx-0">
        {isPlaying ? (
          <i className="fa-duotone fa-pause"></i>
        ) : (
          <i className="fa-duotone fa-play"></i>
        )}
      </button>
    </div>
  );
};

export default MusicPlayer;
