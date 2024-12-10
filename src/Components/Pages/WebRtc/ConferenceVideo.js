import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { useSessionCall } from 'react-sipjs';
import { toast } from 'react-toastify';

function ConferenceVideo({id,setIsScreenSharing,isScreenSharing,screenTogglehit}) {
    const remoteVideoRef = useRef(null);
    const dummySession = useSelector((state) => state.dummySession);

    console.log("screenTogglehit",screenTogglehit);
    
    const localVideoRef = useRef(null);
    const includeVideo = true;
    const sessionCallData = useSessionCall(id) || {}; // Safeguard
    const { session } = sessionCallData || {}; // Safe destructuring
    // const [isScreenSharing, setIsScreenSharing] = useState(false);
      // Setting up remote media handler to show user remote stream
  const getLocalStream = async () => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });
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
            session.sessionDescriptionHandler?.peerConnection?.addTrack(
              track,
              localStream
            );
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
      if (!isMounted) return;


      session.sessionDescriptionHandler.peerConnection.ontrack = (event) => {
        if (!isMounted) return; // Check if the component is still mounted

        const remoteStream =
          remoteVideoRef.current?.srcObject || new MediaStream();
        remoteStream?.addTrack(event.track);

        if (event.track.kind === "video") {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.onloadedmetadata = () => {
            remoteVideoRef.current.play();
          };
        } else if (event.track.kind === "audio") {
          const audioElement = new Audio();
          audioElement.srcObject = remoteStream;
          audioElement.play().catch((error) => {
            console.error("Error playing audio:", error);
          });
        }
      };

      const remoteDescription =
        session.sessionDescriptionHandler?.peerConnection?.currentRemoteDescription;
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


// Toggle screen share
const toggleScreenShare = async () => {
  if (isScreenSharing) {
    const localStream = await getLocalStream();
    session.sessionDescriptionHandler.peerConnection?.getSenders()
      .forEach((sender) => {
        if (sender.track.kind === "video") {
          sender.replaceTrack(localStream.getVideoTracks()[0]);
        }
      });
    setIsScreenSharing(false);
  } else {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      session.sessionDescriptionHandler.peerConnection?.getSenders()
        .forEach((sender) => {
            console.log("sender",sender);
            
        //   if (sender.track.kind === "video") {
            sender.replaceTrack(screenStream.getVideoTracks()[0]);
        //   }
        });
      setIsScreenSharing(true);
    } catch (error) {
      console.error("Error sharing screen: ", error);
      toast.error("Unable to share screen.");
    }
  }
};




useEffect(()=>{
    if(screenTogglehit>0){
        toggleScreenShare();
    }
  
},[screenTogglehit])

return (
    <>
        <video ref={remoteVideoRef} autoPlay alt="" className="videoElement" />
    </>
  );
}

export default ConferenceVideo
