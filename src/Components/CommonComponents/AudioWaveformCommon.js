import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import Hover from "wavesurfer.js/dist/plugins/hover.esm.js";
import AudioTranscribe from "./AudioTranscribe";
import { Rnd } from "react-rnd";

const AudioWaveformCommon = ({ audioUrl, peaksData }) => {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const [playBackSpeed, setPlayBackSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [bufferPercent, setBufferPercent] = useState(0);

  const [transcribeLink, setTranscribeLink] = useState();
  const [size, setSize] = useState({ width: 'auto', height: 'auto' });
  const [position, setPosition] = useState({ x: 550, y: -200 });

  const hover = Hover.create({
    lineColor: '#ff0000',
    lineWidth: 2,
    labelBackground: '#555',
    labelColor: '#fff',
    labelSize: '11px',
  });

  useEffect(() => {
    if (!waveformRef.current) return;

    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#656666",
      progressColor: "#EE772F",
      barWidth: 2,
      responsive: true,
      height: 70,
      cursorWidth: 1,
      cursorColor: "#D1D5DB",
      backend: "WebAudio", // ✅ Enables streaming
      plugins: [hover],
    });

    wavesurfer.current.on("decode", (dur) => setDuration(formatTime(dur)));
    wavesurfer.current.on("timeupdate", (time) => setCurrentTime(formatTime(time)));
    wavesurfer.current.on("ready", () => {
      setIsPlaying(true);
      wavesurfer.current.play();
      if (!peaksData?.peaks?.length) {
        const generatedPeaks = wavesurfer.current.exportPeaks();
        console.log("Generated Peaks:", generatedPeaks);
      }
    });

    wavesurfer.current.on("finish", () => setIsPlaying(false));
    wavesurfer.current.on("interaction", () => {
      wavesurfer.current.play();
      setIsPlaying(true);
    });

    // 🔄 Buffering progress
    wavesurfer.current.on("loading", (percent) => {
      setBufferPercent(percent);
    });

    try {
      if (peaksData?.peaks?.length) {
        wavesurfer.current.load(audioUrl, peaksData.peaks);
      } else {
        wavesurfer.current.load(audioUrl);
      }
    } catch (err) {
      setError("Error loading audio: " + err.message);
      console.error(err);
    }

    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.stop();
        wavesurfer.current.destroy();
        wavesurfer.current = null;
      }
    };
  }, [audioUrl]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.round(seconds) % 60;
    return `${minutes}:${secondsRemainder.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    if (wavesurfer.current) {
      setIsPlaying(!wavesurfer.current.isPlaying());
      wavesurfer.current.playPause();
    }
  };

  const handleSpeedChange = () => {
    if (wavesurfer.current) {
      wavesurfer.current.setPlaybackRate(parseFloat(playBackSpeed), true);
    }
  };

  const handleAudioDownload = (src) => {
    const link = document.createElement("a");
    link.href = src;
    link.download = "audio-file.wav";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    handleSpeedChange();
  }, [playBackSpeed]);

  return (
    <div className="row py-3 mx-auto" style={{ width: "100%" }}>
      {error ? (
        <div className="text-danger my-2">{error}</div>
      ) : (
        <>
          <div className="col-xxl-6 col-lg-12 mb-2">
            <div
              ref={waveformRef}
              style={{
                position: "relative",
                backgroundColor: "var(--ele-color)",
                border: "1px solid var(--border-color)",
                borderRadius: "10px",
              }}
            >
              <div style={timeStyle}>{currentTime}</div>
              <div style={{ ...timeStyle, right: 0, left: "auto" }}>{duration}</div>
              <div style={bufferStyle}>Buffering: {bufferPercent}%</div>
            </div>
          </div>
          <div className="col-xxl-6 col-lg-12">
            <div className="customAudioControls" style={{ width: "auto" }}>
              <button className="clearButton2 xl" onClick={handlePlayPause}>
                <i className={`fa-solid fa-${isPlaying ? "pause" : "play"}`}></i>
              </button>
              <div className="d-flex align-items-center">
                <div>
                  <div className="d-flex justify-content-between">
                    <label className="form-label mb-0">0.5x</label>
                    <label className="form-label mb-0 fw-bold">{playBackSpeed}x</label>
                    <label className="form-label mb-0">4x</label>
                  </div>
                  <input
                    type="range"
                    className="form-range"
                    min="0.5"
                    max="4"
                    step="0.5"
                    onChange={(e) => setPlayBackSpeed(e.target.value)}
                    value={playBackSpeed}
                  />
                </div>
              </div>
              <div>
                <button className="clearButton2 xl" onClick={() => setTranscribeLink(audioUrl)}>
                  <i className={`fa-solid fa-language`}></i>
                </button>
                <button className="clearButton2 xl ms-2" onClick={() => handleAudioDownload(audioUrl)}>
                  <i className={`fa-solid fa-download`}></i>
                </button>
              </div>
            </div>
          </div>
          {audioUrl === transcribeLink && (
            <Rnd
              size={{ width: size.width, height: size.height }}
              position={{ x: position.x, y: position.y }}
              onDragStop={(e, d) => setPosition({ x: d.x, y: d.y })}
              onResizeStop={(e, direction, ref, delta, position) => {
                setSize({ width: ref.style.width, height: ref.style.height });
                setPosition(position);
              }}
              minWidth={"300px"}
              maxWidth={"600px"}
              maxHeight={"450px"}
              style={{ position: "fixed", zIndex: '999' }}
              dragHandleClassName="drag-handle"
            >
              <div className="col-12 drag-handle">
                <AudioTranscribe url={transcribeLink} setTranscribeLink={setTranscribeLink} />
              </div>
            </Rnd>
          )}
        </>
      )}
    </div>
  );
};

const timeStyle = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  fontSize: "11px",
  background: "rgba(0, 0, 0, 0.75)",
  padding: "2px",
  color: "#ddd",
  zIndex: 3,
  left: 0,
};

const bufferStyle = {
  position: "absolute",
  bottom: "5px",
  left: "50%",
  transform: "translateX(-50%)",
  fontSize: "11px",
  background: "rgba(0, 0, 0, 0.75)",
  padding: "2px 6px",
  color: "#fff",
  borderRadius: "4px",
  zIndex: 3,
};

export default AudioWaveformCommon;
