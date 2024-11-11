import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSessionCall } from 'react-sipjs';
import { toast } from "react-toastify";
import { SessionState } from "sip.js";

function VideoCall({ setHangupRefresh, hangupRefresh, setSelectedModule }) {
    const dispatch = useDispatch();
    const globalSession = useSelector((state) => state.sessions);
    const callProgressId = useSelector((state) => state.callProgressId);
    const { session } = useSessionCall(callProgressId);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    
    const includeVideo = true; 
    const MaxVideoBandwidth = 500;
    
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [isVideoMuted, setIsVideoMuted] = useState(false);
    const [isHeld, setIsHeld] = useState(false); // Track hold state

    const toggleAudio = () => {
        const localStream = localVideoRef.current.srcObject;
        const audioTracks = localStream.getAudioTracks();
        audioTracks.forEach(track => track.enabled = !track.enabled);
        setIsAudioMuted(prev => !prev);
    };

    const toggleVideo = () => {
        const localStream = localVideoRef.current.srcObject;
        const videoTracks = localStream.getVideoTracks();
        videoTracks.forEach(track => track.enabled = !track.enabled);
        setIsVideoMuted(prev => !prev);
    };

    const holdCall = () => {
        if (session) {
            const localStream = localVideoRef.current.srcObject;
            const audioTracks = localStream.getAudioTracks();
            const videoTracks = localStream.getVideoTracks();

            audioTracks.forEach(track => track.enabled = false);
            videoTracks.forEach(track => track.enabled = false);
            
            setIsHeld(true);
            dispatch({
                type: "SET_SESSIONS",
                sessions: globalSession.map(item => 
                    item.id === session.id ? { ...item, state: "OnHold" } : item
                ),
            });

            console.log("Call is on hold");
        } else {
            toast.warn("Call has not been established");
        }
    };

    const unholdCall = () => {
        if (session) {
            const options = {
                requestDelegate: {
                    onAccept: () => {
                        const localStream = localVideoRef.current.srcObject;
                        const audioTracks = localStream.getAudioTracks();
                        const videoTracks = localStream.getVideoTracks();

                        audioTracks.forEach(track => track.enabled = true);
                        videoTracks.forEach(track => track.enabled = true);

                        setIsHeld(false);
                        dispatch({
                            type: "SET_SESSIONS",
                            sessions: globalSession.map(item => 
                                item.id === session.id ? { ...item, state: "Established" } : item
                            ),
                        });

                        console.log("Call is off hold");
                    },
                    onReject: () => {
                        console.warn("Failed to unhold the call");
                    }
                }
            };

            session.invite(options).catch(error => {
                console.warn("Error attempting to unhold the call", error);
            });
        } else {
            toast.warn("Call has not been established");
        }
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
                <button onClick={toggleAudio} className="appPanelButtonCaller">
                    {!isAudioMuted ? <i className="fa-thin fa-microphone" /> : <i className="fa-thin fa-microphone-slash" />}
                </button>
                <button onClick={toggleVideo} className="appPanelButtonCaller">
                    {!isVideoMuted ? <i className="fa-thin fa-video" /> : <i className="fa-thin fa-video-slash" />}
                </button>
                <button onClick={isHeld ? unholdCall : holdCall} className="appPanelButtonCaller">
                    <i className={`fa-thin ${isHeld ? 'fa-play' : 'fa-pause'}`} />
                </button>
                <button
                    onClick={() => {
                        session.hangup();
                        setHangupRefresh(hangupRefresh + 1);
                        setSelectedModule("callDetails");
                    }}
                    className="appPanelButtonCaller bg-danger"
                >
                    <i className="fa-thin fa-phone-hangup" />
                </button>
            </div>
        </main>
    );
}

export default VideoCall;
