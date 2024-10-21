import React, { useRef, useEffect, useState } from 'react';
import { useDispatch,useSelector } from 'react-redux';
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

    const applyBandwidthLimits = () => {
        const pc = session.sessionDescriptionHandler.peerConnection;
        if (MaxVideoBandwidth > -1) {
            pc.getSenders().forEach((sender) => {
                if (sender.track && sender.track.kind === "video") {
                    const parameters = sender.getParameters();
                    if (!parameters.encodings) parameters.encodings = [{}];
                    parameters.encodings[0].maxBitrate = MaxVideoBandwidth * 1000;

                    console.log("Applying limit for Bandwidth to:", MaxVideoBandwidth + " kbps");

                    sender.setParameters(parameters).catch((e) => {
                        console.warn("Cannot apply Bandwidth Limits", e);
                    });
                }
            });
        }
    };

    useEffect(() => {
        if (session) {
            getLocalStream().then((localStream) => {
                if (localStream) {
                    // Add audio and video tracks to the peer connection
                    localStream.getTracks().forEach((track) => {
                        session.sessionDescriptionHandler.peerConnection.addTrack(track, localStream);
                    });

                    // Preview local stream
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

                    // Apply Bandwidth Limits
                    applyBandwidthLimits();
                }
            });

            // Handle remote tracks when they're added (for incoming calls)
            session.sessionDescriptionHandler.peerConnection.ontrack = (event) => {
                console.log("Remote track received:", event.track);

                const remoteStream = remoteVideoRef.current.srcObject || new MediaStream();
                remoteStream.addTrack(event.track); // Add the received track to the remote stream

                if (event.track.kind === 'video') {
                    remoteVideoRef.current.srcObject = remoteStream;
                    remoteVideoRef.current.onloadedmetadata = () => {
                        remoteVideoRef.current.play();
                        console.log("Remote video stream set.");
                    };
                } else if (event.track.kind === 'audio') {
                    const audioElement = new Audio();
                    audioElement.srcObject = remoteStream; // Set the stream containing the audio
                    audioElement.play().catch((error) => {
                        console.error("Error playing audio:", error);
                    });
                }
            };

            // Log the SDP for debugging
            const remoteDescription = session.sessionDescriptionHandler.peerConnection.currentRemoteDescription;
            console.log("Remote SDP:", remoteDescription);

            return () => {
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

    return (
        <main className="mainContentA">
            <div className='caller'>
                <div className='container-fluid'>
                    <video ref={remoteVideoRef} autoPlay className="userProfileContainer" />
                    <video ref={localVideoRef} autoPlay muted className="primaryUserWindow" />

                </div>
            </div>
            <div className="row footer">
                {/* <button
                    onClick={
                        isMuted ? () => muteCall("unmute") : () => muteCall("mute")
                    }
                    className={
                        isMuted ? "appPanelButtonCaller active" : "appPanelButtonCaller"
                    }
                    effect="ripple"
                >
                    <i className="fa-thin fa-microphone-slash" />
                </button> */}
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
                    onClick={() => {
                        hangup();
                        setHangupRefresh(hangupRefresh + 1);
                        setSelectedModule("callDetails");
                    }}
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
