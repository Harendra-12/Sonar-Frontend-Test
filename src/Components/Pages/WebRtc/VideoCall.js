import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSessionCall } from 'react-sipjs';
import { toast } from "react-toastify";
import {
    SessionState,
} from "sip.js";

function VideoCall({ setHangupRefresh, hangupRefresh, setSelectedModule }) {
    const dispatch = useDispatch();
    const globalSession = useSelector((state) => state.sessions);
    const callProgressId = useSelector((state) => state.callProgressId);
    const { session } = useSessionCall(callProgressId);
    const [isAudioMuted, setIsAudioMuted] = useState(true);
    const [isVideoMuted, setIsVideoMuted] = useState(true);
    const localVideoRef = useRef(null);
    const minimize = useSelector((state) => state.minimize);
    const remoteVideoRef = useRef(null);
    const {
        isHeld,
        isMuted,
        hangup,
        hold,
        mute,
        unhold,
        unmute,
        timer,
    } = useSessionCall(callProgressId);

    const includeVideo = true; // Include video in the call
    const MaxVideoBandwidth = 500; // Max bandwidth in kbps
    const canHold = session && session._state === SessionState.Established;
    const canMute = session && session._state === SessionState.Established;
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
            console.log("Local stream obtained:", localStream);
            localVideoRef.current.srcObject = localStream;
            return localStream;
        } catch (error) {
            console.error("Error accessing media devices:", error);
            return null;
        }
    };

    useEffect(() => {
        let isMounted = true; // Track whether the component is mounted

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
                if (!isMounted) return; // Check if the component is still mounted

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

            const remoteDescription = session.sessionDescriptionHandler.peerConnection.currentRemoteDescription;
            console.log("Remote SDP:", remoteDescription);

            return () => {
                isMounted = false; // Mark component as unmounted
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = null;
                }
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = null;
                }
            };
        }
    }, [session]);


    const toggleVideo = () => {
        const localStream = localVideoRef.current.srcObject;
        const videoTracks = localStream.getVideoTracks();
        videoTracks.forEach((track) => {
            track.enabled = !isVideoMuted; // Toggle video track
        });
        setIsVideoMuted((prev) => !prev); // Update state
    };

    const toggleAudio = () => {
        const localStream = localVideoRef.current.srcObject;
        const audioTracks = localStream.getAudioTracks();
        audioTracks.forEach((track) => {
            track.enabled = !isAudioMuted; // Toggle audio track
        });
        setIsAudioMuted((prev) => !prev); // Update state
    };

    function handleMaximize() {
        dispatch({
            type: "SET_MINIMIZE",
            minimize: false
        })
    }

    function handleHangup() {
        const updatedSession = globalSession.filter(
            (item) => item.id !== callProgressId
        );
        dispatch({
            type: "SET_SESSIONS",
            sessions: updatedSession,
        });
        setHangupRefresh(hangupRefresh + 1);
        setSelectedModule("callDetails");
        hangup();
    }
console.log("minimize",minimize)
    return (
        <main className="mainContentA videoCall">
            <div className={minimize ? "caller-small" : 'caller'}>
                <div className='container-fluid'>
                    {minimize ? <div onClick={handleMaximize}></div> : ""}
                    <video ref={remoteVideoRef} autoPlay className="userProfileContainer" />
                    <video ref={localVideoRef} autoPlay muted className="primaryUserWindow" />
                </div>
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
        </main>
    );
}

export default VideoCall;
