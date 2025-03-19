import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

const AudioWaveform = ({ audioUrl }) => {
    const waveformRef = useRef(null);
    const wavesurfer = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!waveformRef.current) return;

        // Initialize WaveSurfer
        wavesurfer.current = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: "#4F46E5",
            progressColor: "#2563EB",
            barWidth: 2,
            responsive: true,
            height: 100,
            cursorWidth: 1,
            cursorColor: "#D1D5DB",
        });

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
                wavesurfer.current.destroy();
            }
        };
    }, [audioUrl]);

    const togglePlay = () => {
        if (!error && wavesurfer.current.isReady) {
            setIsPlaying(!isPlaying);
            wavesurfer.current.playPause();
        }
    };

    return (
        <div className="p-4 border rounded-md">
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <div ref={waveformRef} className="w-full"></div>
            <button
                className={`mt-2 px-4 py-2 text-white rounded ${
                    error || !wavesurfer.current?.isReady ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500'
                }`}
                onClick={togglePlay}
                disabled={error || !wavesurfer.current?.isReady}
            >
                {isPlaying ? "Pause" : "Play"}
            </button>
        </div>
    );
};

export default AudioWaveform;