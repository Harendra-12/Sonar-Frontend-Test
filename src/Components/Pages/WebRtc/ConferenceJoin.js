import React, { useEffect, useRef, useState } from 'react'
import { generalGetFunction, generalPostFunction } from '../../GlobalFunction/globalFunction';
import { useNavigate } from 'react-router-dom';
import CircularLoader from '../../Loader/CircularLoader';
import ContentLoader from '../../Loader/ContentLoader';
import { toast } from 'react-toastify';
import ConferenceLoader from '../../Loader/ConferenceLoader';

function ConferenceJoin() {
    // getting the value of querry type
    const urlParams = new URLSearchParams(window.location.search);
    const conferenceId = urlParams.get('type');
    const [name, setName] = useState('')
    const [pin, setPin] = useState('')
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [videoEnable, setVideoEnable] = useState(true)
    const videoRef = useRef(null);           // Reference to the video element
    const streamRef = useRef(null);          // Reference to store the media stream  
    useEffect(() => {
        // Start the camera on component mount
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error("Error accessing the camera:", error);
            }
        };

        startCamera();

        // Cleanup on unmount
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    const toggleVideo = () => {
        if (streamRef.current) {
            streamRef.current.getVideoTracks().forEach((track) => {
                track.enabled = !track.enabled; // Toggle video track
            });
            setVideoEnable((prev) => !prev); // Update the state
        }
    };


    async function joinConference() {
        if (name === "") {
            toast.error("Please enter your name");
        } else if (pin === "") {
            toast.error("Please enter your pin");
        } else {


            // Request microphone access
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

                // Proceed only if microphone access is granted
                if (mediaStream) {
                    setLoading(true);
                    const parsedData = {
                        name: name,
                        room_id: conferenceId.split("/")[1],
                        pin: pin,
                    };
                    const apiData = await generalPostFunction(`/conference/create`, parsedData);
                    if (apiData.status) {
                        setLoading(false);
                        navigate("/conference-join", {
                            state: { state: apiData.data, pin: pin },
                        });
                    } else {
                        setLoading(false);
                        toast.error("Failed to join the conference");
                    }
                } else {
                    setLoading(false);
                    toast.error("Microphone access denied. Please grant microphone access to proceed.");
                }
            } catch (error) {
                setLoading(false);
                toast.error("Failed to access microphone. Please ensure your microphone is working and try again.");
            }
        }
    }

    return (
        <>
            <style>
                {`#sidenNav{
                    display:none;
                }`}
            </style>
            {loading ? <ConferenceLoader /> :
                <main className="login">
                    <div className="container position-relative h-100">
                        <div className="loginWrapper2">
                            <div className="row h-100 justify-content-evenly">
                                <div className='col-xl-5 position-relative'>
                                    <div className="col-xl-12 h-100 position-relative d-flex align-items-center">
                                        <div className="content col-xl-7 mx-auto py-5">
                                            <h3>Join conference</h3>
                                            <p>Enter your name to join conference</p>
                                            <div className="border-bottom my-4"></div>
                                            <form className="loginForm">
                                                <div className="col-xl-12 m-auto">
                                                    <label>Name</label>
                                                    <div className="position-relative">
                                                        <i className="fa-thin fa-user" />
                                                        <input
                                                            type="text"
                                                            placeholder="Enter your name"
                                                            className="loginFormItem"
                                                            value={name}
                                                            onChange={(e) => setName(e.target.value)}
                                                        />
                                                    </div>
                                                    <label>Pin</label>
                                                    <div className="position-relative">
                                                        <i className="fa-thin fa-user" />
                                                        <input
                                                            type="text"
                                                            placeholder="Enter your pin"
                                                            className="loginFormItem"
                                                            value={pin}
                                                            onChange={(e) => setPin(e.target.value)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <button
                                                            className="formSubmit"
                                                            type="button"
                                                            effect="ripple"
                                                            onClick={() => joinConference()}
                                                        >
                                                            Join
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                        <div className="text-center position-absolute w-100" style={{ bottom: 0, left: '50%', transform: 'translate(-50%, -50%)' }}><p style={{ color: 'var(--webUtilGray)', fontSize: 12, marginBottom: 0 }}>2024 AnglePBX. All rights Reserved</p></div>
                                    </div>
                                </div>
                                <div className='col-xl-6 d-xl-block d-none my-auto'>
                                    <div className="loginImgWrapper h-auto bg-transparent">
                                        <div className="content" style={{ padding: '25px' }}>
                                            <div className='conferenceJoinVideo'>
                                                <video
                                                    ref={videoRef}
                                                    autoPlay
                                                    playsInline
                                                    style={{
                                                        transform: "scaleX(-1)", // Flip the video horizontally
                                                    }}
                                                ></video>
                                                <div className='buttonGroup' >
                                                    <button className='clearButton2 xl white'>
                                                        <i class="fa-light fa-microphone"></i>
                                                    </button>
                                                    <button className='clearButton2 xl white ms-3' onClick={toggleVideo}>
                                                        <i class={videoEnable ? "fa-light fa-camera" : "fa-light fa-camera-slash"}></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="loginWave">
                        <img src={require('../../assets/images/wave.png')} />
                    </div>
                </main>
            }
        </>
    )
}

export default ConferenceJoin