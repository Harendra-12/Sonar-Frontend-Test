import { useDispatch, useSelector } from "react-redux";
import { ActionType } from "../../Redux/reduxActionType";

const SoundSettings = ({ audioRef, gainNodeRef }) => {
    // const state = useSelector((state) => state);
    const volume = useSelector((state) => state?.volume);
    const dispatch = useDispatch();

    const handleVolumeChange = (event) => {
        const value = parseFloat(event.target.value);
        dispatch({
            type: ActionType?.SET_VOLUME,
            payload: value,
        });
    };
    return (
        <>
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume ?? "1"}
                onChange={handleVolumeChange}
                style={{ width: '100%' }}
            />
            {/* <canvas id="visualizer"></canvas> */}
        </>
    );
};

export default SoundSettings;





// import React, { useEffect, useRef, useState } from "react";
// import ringtone from "../../assets/music/cellphone-ringing-6475.mp3";

// const SoundSettings = () => {
//     const audioRef = useRef(null);
//     const audioCtxRef = useRef(null);
//     const gainNodeRef = useRef(null);
//     const analyserRef = useRef(null);
//     const [volume, setVolume] = useState(1);
//     const [dataArray, setDataArray] = useState([]);

//     useEffect(() => {
//         if (!audioCtxRef.current) {
//             const audio = new Audio(ringtone);
//             audioRef.current = audio;
//             const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
//             audioCtxRef.current = audioCtx;

//             const track = audioCtx.createMediaElementSource(audio);
//             const gainNode = audioCtx.createGain();
//             gainNodeRef.current = gainNode;

//             const analyser = audioCtx.createAnalyser();
//             analyserRef.current = analyser;
//             analyser.fftSize = 256;


//             track.connect(gainNode).connect(analyser).connect(audioCtx.destination);
//         }
//     }, [ringtone]);

//     const handleVolumeChange = (event) => {
//         const value = parseFloat(event.target.value);
//         setVolume(value);
//         if (gainNodeRef.current) {
//             gainNodeRef.current.gain.value = value;
//         }
//     };

//     return (
//         <div>
//             <button onClick={() => audioRef.current?.play()}>Play</button>
//             <button onClick={() => audioRef.current?.pause()}>Pause</button>
//             <input
//                 type="range"
//                 min="0"
//                 max="1"
//                 step="0.01"
//                 value={volume}
//                 onChange={handleVolumeChange}
//             />
//             <canvas id="visualizer"></canvas>
//         </div>
//     );
// };

// export default SoundSettings;

