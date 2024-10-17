import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSessionCall } from 'react-sipjs';

function VideoCall() {
    const callProgressId = useSelector((state) => state.callProgressId);
    const { session } = useSessionCall(callProgressId);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    useEffect(() => {
        const getLocalStream = async () => {
            if (navigator && navigator.mediaDevices) {
                try {
                    const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = localStream;
                    }
                    return localStream;
                } catch (error) {
                    console.error("Error accessing media devices.", error);
                }
            }
        };

        if (session) {
            getLocalStream().then((localStream) => {
                if (localVideoRef.current) {
                    // Add local tracks to the session
                    localStream.getTracks().forEach(track => {
                        session.sessionDescriptionHandler.peerConnection.addTrack(track, localStream);
                    });
                }

                // Handle remote tracks when they're added
                session.sessionDescriptionHandler.peerConnection.ontrack = (event) => {
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = event.streams[0];
                    }
                };
            });

            // Cleanup on unmount
            return () => {
                // Optional: Handle cleanup if needed
            };
        }
    }, [session]);

    if (session?._state === "Established") {
        console.log("Established", session);
    }

    return (
        <main className="mainContentA">
            <div className='caller'>
                <div className='container-fluid'>
                    <div className="row header">
                        <div className="col-4"></div>
                        <div className="col-4 text-center">
                            <h5><span>00:24</span></h5>
                        </div>
                        <div className="col-4 d-none d-xl-flex justify-content-end">
                            <button className="appPanelButtonColor" effect="ripple">
                                <i className="fa-thin fa-gear"></i>
                            </button>
                            <button className="appPanelButtonColor ms-2" effect="ripple">
                                <i className="fa-thin fa-arrows-maximize"></i>
                            </button>
                        </div>
                    </div>
                    <video ref={remoteVideoRef} autoPlay className="userProfileContainer" />
                    <video ref={localVideoRef} autoPlay muted className="primaryUserWindow" />
                    <div className="row footer">
                        {/* Buttons for call control */}
                    </div>
                </div>
            </div>
        </main>
    );
}

export default VideoCall;
