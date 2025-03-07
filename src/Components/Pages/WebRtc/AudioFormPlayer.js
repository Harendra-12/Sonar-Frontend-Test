import React, { useState, useRef } from "react";
import { AudioVisualizer } from "react-audio-visualize";

const AudioWaveform = ({ audioBlob }) => {
  const visualizerRef = useRef(null);

  return (
    <div>
      <AudioVisualizer
        ref={visualizerRef}
        blob={audioBlob}
        width={500}
        height={100}
        barWidth={2}
        gap={1}
        barColor="#f76565"
      />
    </div>
  );
};

export default AudioWaveform;
