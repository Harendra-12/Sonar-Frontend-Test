import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSessionCall, useSIPProvider } from 'react-sipjs';

function VideoCall() {
    const callProgressId = useSelector((state) => state.callProgressId);
    const {
       
        session,
       
      } = useSessionCall(callProgressId);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
  console.log("session",session);
  
    // Set the local and remote video streams when they become available
    useEffect(() => {
        if (session) {
          // Set local video stream
          const localStream = session.getMediaStreams()[0]; // Assuming getMediaStreams gives you the right stream
          if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
          }
    
          // Event listener for remote streams
          const remoteStreamHandler = (event) => {
            const remoteStreams = event.streams; // Get the remote streams from the event
            if (remoteVideoRef.current && remoteStreams.length > 0) {
              remoteVideoRef.current.srcObject = remoteStreams[0];
            }
          };
    
          // Attach the remote stream handler to the session
          session.on('trackAdded', remoteStreamHandler);
    
          // Cleanup on unmount
          return () => {
            session.off('trackAdded', remoteStreamHandler); // Remove the event listener
          };
        }
      }, [session]);

    return (
        <>
        <style>
            {`
                .caller .header
                {
                    position: absolute;
                    top: 30px;
                    left: 0;
                    width: 100%;
                }
                .caller .footer{
                    position: absolute;
                    bottom: 30px;
                    left: 0;
                    width: 100%;
                }
            `}
        </style>
            <main
                className="mainContentA"
            // style={{
            //   marginRight: sessions.length > 0 && Object.keys(sessions).length > 0 ? '250px' : '0',
            // }}
            >

                <div className='caller'>
                    <div className='container-fluid'>
                        <div class="row header">
                            <div class="col-4"></div>
                            <div class="col-4 text-center">
                                <h5><span>00:24</span></h5>
                            </div>
                            <div class="col-4 d-none d-xl-flex justify-content-end">
                                <button class="appPanelButtonColor" effect="ripple">
                                    <i class="fa-thin fa-gear"></i>
                                </button>
                                <button class="appPanelButtonColor ms-2" effect="ripple">
                                    <i class="fa-thin fa-arrows-maximize"></i>
                                </button>
                            </div>
                        </div>
                        <video ref={remoteVideoRef} autoPlay className="userProfileContainer" />
                        <video ref={localVideoRef} autoPlay muted className="primaryUserWindow" />
                        <div class="row footer">
                            <button class="appPanelButtonCaller" effect="ripple">
                                <i class="fa-thin fa-microphone-slash"></i>
                            </button>
                            <button class="appPanelButtonCaller" effect="ripple">
                                <i class="fa-thin fa-grid"></i>
                            </button>
                            <button class="appPanelButtonCaller" effect="ripple">
                                <i class="fa-thin fa-user-plus"></i>
                            </button>
                            <button class="appPanelButtonCaller" effect="ripple">
                                <i class="fa-thin fa-phone-arrow-up-right"></i>
                            </button>
                            <button class=" appPanelButtonCaller " effect="ripple">P</button>
                            <button class="appPanelButtonCaller" effect="ripple">
                                <i class="fa-thin fa-pause"></i>
                            </button>
                            <button class="appPanelButtonCaller bg-danger" effect="ripple">
                                <i class="fa-thin fa-phone-hangup"></i>
                            </button>
                        </div>
                    </div>
                </div>


                {/* PLEASE REMOVE THIS CODE */}
               
                {/* PLEASE REMOVE THIS */}
            </main>
        </>
    );
}

export default VideoCall;
