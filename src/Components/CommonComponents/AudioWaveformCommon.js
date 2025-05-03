import Tippy from "@tippyjs/react";
import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import Hover from 'wavesurfer.js/dist/plugins/hover.esm.js'
import AudioTranscribe from "./AudioTranscribe";
import { featureUnderdevelopment } from "../GlobalFunction/globalFunction";
import { Rnd } from "react-rnd";

const AudioWaveformCommon = ({ audioUrl }) => {
    console.log("Inside waveform");

    const [transcribeLink, setTranscribeLink] = useState()
    const waveformRef = useRef(null);
    const wavesurfer = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState(null);
    const [playBackSpeed, setPlayBackSpeed] = useState(1);

    const [currentTime, setCurrentTime] = useState("0:00");
    const [duration, setDuration] = useState("0:00");

    const [size, setSize] = useState({ width: 'auto', height: 450 });
    const [position, setPosition] = useState({ x: 600, y: 300 });

    const hover = Hover.create({
        lineColor: '#ff0000',
        lineWidth: 2,
        labelBackground: '#555',
        labelColor: '#fff',
        labelSize: '11px',
    });

    useEffect(() => {
        if (!waveformRef.current) return;

        // Initialize WaveSurfer
        wavesurfer.current = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: "#656666",
            progressColor: "#EE772F",
            barWidth: 2,
            // barGap: 1,
            responsive: true,
            height: 70,
            cursorWidth: 1,
            cursorColor: "#D1D5DB",
            plugins: [hover]
        });

        wavesurfer.current.on("decode", (dur) => setDuration(formatTime(dur)));
        wavesurfer.current.on("timeupdate", (time) => setCurrentTime(formatTime(time)));

        wavesurfer.current.on('ready', () => {
            wavesurfer.current.play();
            setIsPlaying(true);
        });
        wavesurfer.current.on('finish', () => {
            setIsPlaying(false);
        });
        wavesurfer.current.on('interaction', () => {
            wavesurfer.current.play();
            setIsPlaying(true);
        })


        // Fetch the audio file and convert to Blob
        const loadAudio = async () => {
            try {
                const response = await fetch(audioUrl, {
                    method: 'GET',
                    headers: {
                        // Add any necessary headers for your S3 presigned URL if required
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch audio');
                }

                const audioBlob = await response.blob();
                const blobUrl = URL.createObjectURL(audioBlob);

                // Load the Blob URL into WaveSurfer
                wavesurfer.current.load(blobUrl);

                // Clean up the Blob URL when component unmounts
                return () => URL.revokeObjectURL(blobUrl);
            } catch (err) {
                setError('Error loading audio: ' + err.message);
                console.error(err);
            }
        };

        loadAudio();

        // Cleanup WaveSurfer instance
        return () => {
            if (wavesurfer.current) {
                wavesurfer.current.stop();       // 👈 stop the audio
                wavesurfer.current.destroy();    // 👈 destroy the instance
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
            if (wavesurfer.current.isPlaying()) {
                setIsPlaying(false);
                wavesurfer.current.playPause();
            } else {
                setIsPlaying(true);
                wavesurfer.current.playPause();
            }

        }
    };

    const togglePlay = () => {
        wavesurfer.current.playPause();
    };


    let preservePitch = true
    const speeds = [0.25, 0.5, 1, 2, 4]

    const handlePitchPreserve = (e) => {
        if (wavesurfer.current) {
            preservePitch = e.target.checked
            wavesurfer.current.setPlaybackRate(wavesurfer.current.getPlaybackRate(), preservePitch)
        }
    }

    const handleSpeedChange = () => {
        if (wavesurfer.current) {
            wavesurfer.current.setPlaybackRate(playBackSpeed, preservePitch)
            wavesurfer.current.play();
        }
    }

    const handleAudioDownload = (src) => {
        const link = document.createElement("a");
        link.href = src;
        link.download = "audio-file.wav";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        handleSpeedChange()
    }, [playBackSpeed])

    return (
        <div className="row py-3 mx-auto" style={{ width: '100%' }}>
            {error ? <div className="text-red-500 my-2">{error}</div> :
                (
                    <>
                        <div className="col-xxl-6 col-lg-12">
                            <div ref={waveformRef} style={{ position: "relative", backgroundColor: 'var(--ele-color)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                                <div style={{ position: "absolute", left: 0, top: '50%', transform: 'translateY(-50%)', fontSize: "11px", background: "rgba(0, 0, 0, 0.75)", padding: "2px", color: "#ddd", zIndex: 3 }}>{currentTime}</div>
                                <div style={{ position: "absolute", right: 0, top: '50%', transform: 'translateY(-50%)', fontSize: "11px", background: "rgba(0, 0, 0, 0.75)", padding: "2px", color: "#ddd", zIndex: 3 }}>{duration}</div>
                            </div>
                        </div>
                        <div className="col-xxl-6 col-lg-12">
                            <div className="customAudioControls" style={{ width: 'auto' }}>
                                {/* <button
                                className={`mt-2 px-4 py-2 text-white rounded ${error || !wavesurfer.current?.isReady ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500'
                                    }`}
                                onClick={togglePlay}
                                disabled={error || !wavesurfer.current?.isReady}
                            >
                                {isPlaying ? "Pause" : "Play"}
                            </button> */}
                                <button className="clearButton2 xl" onClick={handlePlayPause}>
                                    <i className={`fa-solid fa-${isPlaying ? 'pause' : 'play'}`}></i>
                                </button>
                                <div className="d-flex align-items-center">
                                    <div>
                                        <div className="d-flex justify-content-between">
                                            <label class="form-label mb-0">0.5x</label>
                                            <label class="form-label mb-0 fw-bold">{playBackSpeed}x</label>
                                            <label class="form-label mb-0">4x</label>
                                        </div>
                                        <input type="range" class="form-range" min="0.5" max="4" step="0.5" onChange={(e) => setPlayBackSpeed(e.target.value)} value={playBackSpeed} />
                                    </div>
                                    <div class="form-check d-none">
                                        <input class="form-check-input" type="checkbox" onChange={(e) => handlePitchPreserve(e)} defaultChecked={true} />
                                        <label class="form-check-label">
                                            Preserve Pitch
                                        </label>
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
                        {audioUrl === transcribeLink &&
                            (
                                <Rnd
                                    size={{ width: size.width, height: size.height }}
                                    position={{ x: position.x, y: position.y }}
                                    onDragStop={(e, d) => setPosition({ x: d.x, y: d.y })}
                                    onResizeStop={(e, direction, ref, delta, position) => {
                                        setSize({
                                            width: ref.style.width,
                                            height: ref.style.height,
                                        });
                                        setPosition(position);
                                    }}
                                    minWidth={"300px"}
                                    minHeight={"450px"}
                                    // maxWidth={"600px"}
                                    // maxHeight={"600px"}
                                    maxWidth={"500px"}
                                    maxHeight={"450px"}
                                    style={{ position: 'fixed' }}
                                    dragHandleClassName="drag-handle" // Specify draggable area
                                >
                                    <div className="col-12 drag-handle">
                                        <AudioTranscribe url={transcribeLink} />
                                    </div>
                                </Rnd>
                            )}
                    </>
                )
            }
        </div >
    );
};

export default AudioWaveformCommon;