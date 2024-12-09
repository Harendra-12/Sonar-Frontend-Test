import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSessionCall } from "react-sipjs";
import { toast } from "react-toastify";
import { SessionState } from "sip.js";

function VideoCall({
  setHangupRefresh,
  hangupRefresh,
  setSelectedModule,
  setCloseVideoCall,
  callProgressId,
}) {
  const dispatch = useDispatch();
  const [hideDialpad, setHideDialpad] = useState(false);
  const [destNumber, setDestNumber] = useState("");
  const globalSession = useSelector((state) => state.sessions || []); // Safeguard
  // const callProgressId = useSelector((state) => state.callProgressId || ""); // Safeguard
  const sessionCallData = useSessionCall(callProgressId) || {}; // Safeguard
  const { session } = sessionCallData || {}; // Safe destructuring
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const localVideoRef = useRef(null);
  const minimize = useSelector((state) => state.minimize || false); // Safeguard
  const remoteVideoRef = useRef(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const screenShareRef = useRef(null);

  // Safeguard for sessionCallData properties
  const {
    isHeld = false,
    isMuted = false,
    hangup = () => { },
    hold = () => { },
    unhold = () => { },
  } = sessionCallData;

  useEffect(() => {
    if (callProgressId === "") {
      // handleHangup()
      console.log("callProgressId is empty");
      setCloseVideoCall(true);
    }
  }, [callProgressId]);

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
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
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
            session.sessionDescriptionHandler.peerConnection.addTrack(
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

      session.sessionDescriptionHandler.peerConnection.ontrack = (event) => {
        if (!isMounted) return; // Check if the component is still mounted

        const remoteStream =
          remoteVideoRef.current.srcObject || new MediaStream();
        remoteStream.addTrack(event.track);

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
        session.sessionDescriptionHandler.peerConnection
          .currentRemoteDescription;
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
  console.log(remoteVideoRef.current);
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
      minimize: false,
    });
  };
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      try {
        const localStream = await getLocalStream();
        session.sessionDescriptionHandler.peerConnection
          .getSenders()
          .forEach((sender) => {
            if (sender.track && sender.track.kind === "video") {
              sender.replaceTrack(localStream.getVideoTracks()[0]);
            }
          });
        setIsScreenSharing(false);
      } catch (error) {
        console.error("Error while stopping screen share:", error);
      }
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
  
        let videoSenderFound = false;
  
        session.sessionDescriptionHandler.peerConnection
          .getSenders()
          .forEach((sender) => {
            if (sender.track && sender.track.kind === "video") {
              sender.replaceTrack(screenStream.getVideoTracks()[0]);
              videoSenderFound = true;
            }
          });
  
        // If no video sender exists (audio-only call), add the screen share track
        if (!videoSenderFound) {
          const pc = session.sessionDescriptionHandler.peerConnection;
          pc.addTrack(screenStream.getVideoTracks()[0], screenStream);
        }
  
        setIsScreenSharing(true);
      } catch (error) {
        console.error("Error while starting screen share:", error);
        toast.error("Unable to share screen.");
      }
    }
  };
  
  
  // const toggleScreenShare = async () => {
  //   if (isScreenSharing) {
  //     const localStream = await getLocalStream();
  //     session.sessionDescriptionHandler.peerConnection
  //       .getSenders()
  //       .forEach((sender) => {
  //         if (sender.track.kind === "video") {
  //           sender.replaceTrack(localStream.getVideoTracks()[0]);
  //         }
  //       });
  //     setIsScreenSharing(false);
  //   } else {
  //     try {
  //       const screenStream = await navigator.mediaDevices.getDisplayMedia({
  //         video: true,
  //         audio: true,
  //       });

  //       session.sessionDescriptionHandler.peerConnection
  //         .getSenders()
  //         .forEach((sender) => {
  //           if (sender.track.kind === "video") {
  //             sender.replaceTrack(screenStream.getVideoTracks()[0]);
  //           }
  //         });
  //       setIsScreenSharing(true);
  //     } catch (error) {
  //       console.error("Error sharing screen: ", error);
  //       toast.error("Unable to share screen.");
  //     }
  //   }
  // };
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

  useEffect(() => {
    if (callProgressId === "") {
      // handleHangup()
      console.log("callProgressId is empty");
      setCloseVideoCall(true);
    }
  }, [callProgressId]);

  const handleDigitPress = (digit) => {
    if (session) {
      const dtmfSender = session.sessionDescriptionHandler.peerConnection
        .getSenders()
        .find((sender) => sender.dtmf);
      if (dtmfSender && dtmfSender.dtmf) {
        dtmfSender.dtmf.insertDTMF(digit);
      } else {
        console.error("DTMF sender not available");
      }
    } else {
      console.error("No active session found");
    }
  };

  // console.log("sessionssss", session);
  return (
    <main className="mainContentA videoCall">
      <div className={minimize ? "caller minimize mt-0" : "caller mt-0"}>
        <div className="container-fluid">
          {minimize ? (
            <div onClick={handleMaximize} className="appPanelButtonCaller">
              <i className="fa-thin fa-expand" />
            </div>
          ) : (
            ""
          )}
          <video
            ref={remoteVideoRef}
            autoPlay
            className="userProfileContainer"
          />
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className="primaryUserWindow"
          />
        </div>
        {hideDialpad ? (
          <div id="dialPad" className="inCall">
            <div className="container h-100">
              <div className="row align-items-center justify-content-center h-100">
                <div className="col-xl-5 col-md-6 col-11 dialPadContainer p-2">
                  <div className="d-flex justify-content-end pt-1 pb-1 px-2">
                    <div
                      onClick={() => setHideDialpad(false)}
                      style={{ cursor: "pointer" }}
                    >
                      <i className="fa-regular fa-xmark fs-5 text-white" />
                    </div>
                  </div>
                  <div className="mb-2"></div>
                  <div>
                    <input
                      type="text"
                      placeholder=""
                      className="dialerInput"
                      disabled={true}
                      value={destNumber}
                    />
                  </div>

                  <div className="dialerWrap mt-2">
                    <div
                      className="col-4"
                      onClick={() => {
                        setDestNumber(destNumber + "1");
                        handleDigitPress(1);
                      }}
                    >
                      <h4>1</h4>
                      <h6>&nbsp;</h6>
                    </div>
                    <div
                      className="col-4"
                      onClick={() => {
                        setDestNumber(destNumber + "2");
                        handleDigitPress(2);
                      }}
                    >
                      <h4>2</h4>
                      <h6>ABC</h6>
                    </div>
                    <div
                      className="col-4"
                      onClick={() => {
                        setDestNumber(destNumber + "3");
                        handleDigitPress(3);
                      }}
                    >
                      <h4>3</h4>
                      <h6>DEF</h6>
                    </div>
                    <div
                      className="col-4"
                      onClick={() => {
                        setDestNumber(destNumber + "4");
                        handleDigitPress(4);
                      }}
                    >
                      <h4>4</h4>
                      <h6>GHI</h6>
                    </div>
                    <div
                      className="col-4"
                      onClick={() => {
                        setDestNumber(destNumber + "5");
                        handleDigitPress(5);
                      }}
                    >
                      <h4>5</h4>
                      <h6>JKL</h6>
                    </div>
                    <div
                      className="col-4"
                      onClick={() => {
                        setDestNumber(destNumber + "6");
                        handleDigitPress(6);
                      }}
                    >
                      <h4>6</h4>
                      <h6>MNO</h6>
                    </div>
                    <div
                      className="col-4"
                      onClick={() => {
                        setDestNumber(destNumber + "7");
                        handleDigitPress(7);
                      }}
                    >
                      <h4>7</h4>
                      <h6>PQRS</h6>
                    </div>
                    <div
                      className="col-4"
                      onClick={() => {
                        setDestNumber(destNumber + "8");
                        handleDigitPress(8);
                      }}
                    >
                      <h4>8</h4>
                      <h6>TUV</h6>
                    </div>
                    <div
                      className="col-4"
                      onClick={() => {
                        setDestNumber(destNumber + "9");
                        handleDigitPress(9);
                      }}
                    >
                      <h4>9</h4>
                      <h6>WXYZ</h6>
                    </div>
                    <div
                      className="col-4"
                      onClick={() => {
                        setDestNumber(destNumber + "*");
                        handleDigitPress("*");
                      }}
                    >
                      <h4>
                        <i className="fa-light fa-asterisk" />
                      </h4>
                    </div>
                    <div
                      className="col-4"
                      onClick={() => {
                        setDestNumber(destNumber + "0");
                        handleDigitPress(0);
                      }}
                    >
                      <h4>0</h4>
                      <h6>+</h6>
                    </div>
                    <div
                      className="col-4"
                      onClick={() => {
                        setDestNumber(destNumber + "#");
                        handleDigitPress("#");
                      }}
                    >
                      <h4>
                        <i className="fa-light fa-hashtag" />
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
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
          <button onClick={toggleScreenShare} className="appPanelButtonCaller">
            {isScreenSharing ? (
              <i className="fa-thin fa-desktop-slash" />
            ) : (
              <i className="fa-thin fa-desktop" />
            )}
          </button>
          <button
            onClick={() => {
              setHideDialpad(!hideDialpad);
            }}
            className={
              hideDialpad
                ? "appPanelButtonCaller active"
                : "appPanelButtonCaller"
            }
            effect="ripple"
          >
            <i className="fa-thin fa-grid" />
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
