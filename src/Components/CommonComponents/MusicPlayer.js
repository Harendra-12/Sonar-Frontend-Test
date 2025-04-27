import React, { useRef, useEffect } from "react";
import AudioWaveFormCommon from "../CommonComponents/AudioWaveformCommon"
/**
 * MusicPlayer
 * 
 * This component renders an audio player for a given audio source. It takes in
 * a few props to control the behavior of the player:
 * - `audioSrc`: The source of the audio file to play
 * - `isPlaying`: A boolean indicating whether the audio is currently playing
 * - `onPlay`: A callback to call when the audio starts playing
 * - `onStop`: A callback to call when the audio stops playing
 * - `controls`: A boolean indicating whether the audio element should have
 *   controls (such as a play/pause button and timeline)
 * 
 * The component also renders a play/pause button, which can be used to toggle
 * the playing state of the audio. When the audio ends, the component calls the
 * `onStop` callback to update the UI and state.
 */
const MusicPlayer = ({ audioSrc, isPlaying, onPlay, onStop, controls }) => {
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
      {/* <audio ref={audioRef} src={audioSrc} controls={controls}></audio> */}
      <AudioWaveFormCommon audioUrl={audioSrc} />
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
