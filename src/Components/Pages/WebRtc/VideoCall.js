import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSessionCall } from 'react-sipjs';
import { toast } from "react-toastify";
import { SessionState } from "sip.js";

function VideoCall({ setHangupRefresh, hangupRefresh, setSelectedModule }) {
    const dispatch = useDispatch();
    const globalSession = useSelector((state) => state.sessions || []); // Safeguard
    const callProgressId = useSelector((state) => state.callProgressId || ""); // Safeguard

    const sessionCallData = useSessionCall(callProgressId) || {}; // Safeguard
    const { session } = sessionCallData; // Safe destructuring

    const [isAudioMuted, setIsAudioMuted] = useState(true);
    const [isVideoMuted, setIsVideoMuted] = useState(true);
    const localVideoRef = useRef(null);
    const minimize = useSelector((state) => state.minimize || false); // Safeguard
    const remoteVideoRef = useRef(null);

    // Safeguard for sessionCallData properties
    const {
        isHeld = false,
        isMuted = false,
        hangup = () => {},
        hold = () => {},
        unhold = () => {},
    } = sessionCallData;

    const includeVideo = true; 
    const canHold = session && session._state === SessionState.Established;

    const holdCall = (type) => {
        if (canHold) {
            if (type === "hold") {
                hold();
                dispatch({
                    type: "SET_SESSIONS",
                    sessions: globalSession.map((item) =>
                        item.id === session.id ? { ...item, state: "OnHold" } : item
                    ),
                });
            } else if (type === "unhold") {
                unhold();
                dispatch({
                    type: "SET_SESSIONS",
                    sessions: globalSession.map((item) =>
                        item.id === session.id ? { ...item, state: "Established" } : item
                    ),
                });
            }
        } else {
            toast.warn("Call has not been established");
        }
    };

    const getLocalStream = async () => {
        try {
            const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localVideoRef.current.srcObject = localStream;
            return localStream;
        } catch (error) {
            console.error("Error accessing media devices:", error);
            return null;
        }
    };

    useEffect(() => {
        let isMounted = true;

        if (session) {
            getLocalStream().then((localStream) => {
                if (localStream) {
                    localStream.getTracks().forEach((track) => {
                        session.sessionDescriptionHandler.peerConnection.addTrack(track, localStream);
                    });

                    if (includeVideo) {
                        const localVideoStream = new MediaStream();
                        const pc = session.sessionDescriptionHandler.peerConnection;

                        pc.getSenders().forEach((sender) => {
                            if (sender.track) {
                                localVideoStream.addTrack(sender.track);
                            }
                        });

                        if (localVideoRef.current) {
                            localVideoRef.current.srcObject = localVideoStream;
                            localVideoRef.current.onloadedmetadata = () => {
                                localVideoRef.current.play();
                            };
                        }
                    }
                }
            });

            session.sessionDescriptionHandler.peerConnection.ontrack = (event) => {
                if (!isMounted) return;

                const remoteStream = remoteVideoRef.current.srcObject || new MediaStream();
                remoteStream.addTrack(event.track);

                if (event.track.kind === 'video') {
                    remoteVideoRef.current.srcObject = remoteStream;
                    remoteVideoRef.current.onloadedmetadata = () => {
                        remoteVideoRef.current.play();
                    };
                } else if (event.track.kind === 'audio') {
                    const audioElement = new Audio();
                    audioElement.srcObject = remoteStream;
                    audioElement.play().catch((error) => {
                        console.error("Error playing audio:", error);
                    });
                }
            };

            return () => {
                isMounted = false;
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = null;
                }
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = null;
                }
            };
        } else {
            console.warn("Session is closed or null");
        }
    }, [session]);

    const toggleVideo = () => {
        if (localVideoRef.current) {
            const localStream = localVideoRef.current.srcObject;
            const videoTracks = localStream.getVideoTracks();
            videoTracks.forEach((track) => {
                track.enabled = !isVideoMuted;
            });
            setIsVideoMuted((prev) => !prev);
        }
    };

    const toggleAudio = () => {
        if (localVideoRef.current) {
            const localStream = localVideoRef.current.srcObject;
            const audioTracks = localStream.getAudioTracks();
            audioTracks.forEach((track) => {
                track.enabled = !isAudioMuted;
            });
            setIsAudioMuted((prev) => !prev);
        }
    };

    const handleMaximize = () => {
        dispatch({
            type: "SET_MINIMIZE",
            minimize: false
        });
    };

    const handleHangup = () => {
        if (session) {
            hangup();
            const updatedSession = globalSession.filter(
                (item) => item.id !== callProgressId
            );
            dispatch({
                type: "SET_SESSIONS",
                sessions: updatedSession,
            });
            setHangupRefresh(hangupRefresh + 1);
            setSelectedModule("callDetails");
        } else {
            console.warn("Attempted to hang up, but session is invalid");
        }
    };

    return (
        <main className="mainContentA videoCall">
            <div className={minimize ? "caller minimize" : 'caller'}>
                <div className='container-fluid'>
                    {minimize ? <div onClick={handleMaximize} className="appPanelButtonCaller"><i className="fa-thin fa-expand" /></div> : ""}
                    <video ref={remoteVideoRef} autoPlay className="userProfileContainer" />
                    <video ref={localVideoRef} autoPlay muted className="primaryUserWindow" />
                </div>
                <div className="row footer">
                    <button onClick={toggleAudio} className="appPanelButtonCaller">
                        {!isAudioMuted ? (
                            <i className="fa-thin fa-microphone-slash" />
                        ) : (
                            <i className="fa-thin fa-microphone" />
                        )}
                    </button>
                    <button onClick={toggleVideo} className="appPanelButtonCaller">
                        {!isVideoMuted ? (
                            <i className="fa-thin fa-video-slash" />
                        ) : (
                            <i className="fa-thin fa-video" />
                        )}
                    </button>
                    <button className="appPanelButtonCaller" effect="ripple">
                        <i className="fa-thin fa-user-plus" />
                    </button>

                    <button
                        onClick={
                            isHeld ? () => holdCall("unhold") : () => holdCall("hold")
                        }
                        className={
                            isHeld ? "appPanelButtonCaller active" : "appPanelButtonCaller"
                        }
                        effect="ripple"
                    >
                        <i className="fa-thin fa-pause" />
                    </button>
                    <button
                        onClick={handleHangup}
                        className="appPanelButtonCaller bg-danger"
                        effect="ripple"
                    >
                        <i className="fa-thin fa-phone-hangup" />
                    </button>
                </div>
            </div>
        </main>
    );
}

export default VideoCall;
