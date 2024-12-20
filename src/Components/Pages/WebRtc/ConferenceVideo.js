import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useSessionCall } from "react-sipjs";
import { toast } from "react-toastify";
import { sendData } from "../../GlobalFunction/Socket";
import { generalPostFunction } from "../../GlobalFunction/globalFunction";

function ConferenceVideo({
  id,
  setIsScreenSharing,
  isScreenSharing,
  screenTogglehit,
  conferenceId,
  currentUser,
  isVideoOn,
  userName,
  sendMessage,
}) {
  const prevConferenceScreenShareStatus = useRef(null); // Ref to keep track of previous status
  const account = useSelector((state) => state.account);
  const extension = account?.extension?.extension || "";
  const remoteVideoRef = useRef(null);
  const memeber_id = useSelector((state) => state.memberId);
  const dummySession = useSelector((state) => state.dummySession);
  const conferenceScreenShareStatus = useSelector(
    (state) => state.conferenceScreenShareStatus
  );
  const localVideoRef = useRef(null);
  const includeVideo = true;
  const sessionCallData = useSessionCall(id) || {}; // Safeguard
  const { session } = sessionCallData || {}; // Safe destructuring
  // const [isScreenSharing, setIsScreenSharing] = useState(false);
  // Setting up remote media handler to show user remote stream
  const getLocalStream = async () => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: isVideoOn,
        audio: true,
      });
      // localVideoRef.current.srcObject = localStream;
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
            const pc = session.sessionDescriptionHandler?.peerConnection;

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
        session.sessionDescriptionHandler?.peerConnection
          ?.currentRemoteDescription;
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
      session.sessionDescriptionHandler.peerConnection
        ?.getSenders()
        .forEach((sender) => {
          if (sender.track.kind === "video") {
            if (isVideoOn) {
              sender.track.stop();
              console.log("Inside track change");
              
              sender.replaceTrack(localStream.getVideoTracks()[0]);
            } else {
              sender.track.stop();
              session.sessionDescriptionHandler.peerConnection.removeTrack(
                sender
              );
            }
          }
        });
      sendMessage({
        action: "screenShare",
        user: userName || "dummy",
        sharedMessage: false,
        room_id: conferenceId,
      });
      setIsScreenSharing(false);
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });

        session.sessionDescriptionHandler?.peerConnection
          ?.getSenders()
          .forEach((sender) => {
            console.log("sender", sender);
            if (isVideoOn) {
              if (sender.track.kind === "video") {
                sender.replaceTrack(screenStream.getVideoTracks()[0]);
              }
            } else {
              sender.replaceTrack(screenStream.getVideoTracks()[0]);
            }
          });

        const parsedData = {
          action: "vid-floor",
          room_id: conferenceId,
          member: `${currentUser?.id} force`,
        };
        generalPostFunction(`conference/action`, parsedData)
          .then((res) => {
            console.log("res", res);
          })
          .catch((err) => {
            console.log("err", err);
          });
        sendMessage({
          action: "screenShare",
          user: userName || "dummy",
          sharedMessage: true,
          room_id: conferenceId,
        });
        setIsScreenSharing(true);
      } catch (error) {
        console.error("Error sharing screen: ", error);
        toast.error("Unable to share screen.");
      }
    }
    // }
  };

  useEffect(() => {
    if (screenTogglehit > 0) {
      toggleScreenShare();
    }
  }, [screenTogglehit]);

  // useEffect(() => {
  //   if (conferenceScreenShareStatus) {
  //     console.log("conferenceScreenShareStatus", conferenceScreenShareStatus);
  //     if (conferenceId == conferenceScreenShareStatus.room_id) {
  //       toast.success(
  //         `${conferenceScreenShareStatus.user} has ${
  //           conferenceScreenShareStatus.sharedMessage == true
  //             ? "shared"
  //             : "stopped"
  //         } screen share.`
  //       );
  //     }
  //   }
  // }, [conferenceScreenShareStatus]);

  useEffect(() => {
    if (conferenceScreenShareStatus) {
      console.log("conferenceScreenShareStatus", conferenceScreenShareStatus);

      // Only show the toast if the screen share status has changed
      const hasStatusChanged =
        prevConferenceScreenShareStatus.current?.room_id !==
          conferenceScreenShareStatus.room_id ||
        prevConferenceScreenShareStatus.current?.sharedMessage !==
          conferenceScreenShareStatus.sharedMessage;

      if (
        conferenceId === conferenceScreenShareStatus.room_id &&
        hasStatusChanged
      ) {
        toast.success(
          `${conferenceScreenShareStatus.user} has ${
            conferenceScreenShareStatus.sharedMessage === true
              ? "shared"
              : "stopped"
          } screen share.`
        );

        // Update the ref to the latest conferenceScreenShareStatus
        prevConferenceScreenShareStatus.current = conferenceScreenShareStatus;
      }
    }
  }, [conferenceScreenShareStatus]);

  // To reset the toastShownRef when conferenceScreenShareStatus changes (or when you need to reset)
  // useEffect(() => {
  //   toastShownRef.current = false;
  // }, [conferenceScreenShareStatus]);

  return (
    <>
      <video ref={remoteVideoRef} autoPlay alt="" className="videoElement" />
    </>
  );
}

export default ConferenceVideo;
