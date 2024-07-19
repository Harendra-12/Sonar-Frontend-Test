import React, { useRef, useState } from 'react';

const MusicPlayer = ({ audioSrc }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      <audio ref={audioRef} src={audioSrc}></audio>
      <button onClick={togglePlayPause} className='appPanelButton2 px-2 mx-0'>
        {isPlaying ?  <i className="fa-duotone fa-pause"></i> : <i className="fa-duotone fa-play"></i>}
      </button>
    </div>
  );
};

export default MusicPlayer;
