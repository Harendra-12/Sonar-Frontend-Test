/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSessionCall } from "modify-react-sipjs";
import { SessionState } from "sip.js";
import { toast } from "react-toastify";

function ActiveCallSidePanel({
  sessionId,
  chennel,
  mode,
  destination,
  setHangupRefresh,
  hangupRefresh,
  setSelectedModule,
  isMicOn,
  globalSession,
}) {
  const dispatch = useDispatch();
  const callProgressId = useSelector((state) => state.callProgressId);
  const previewDialer = useSelector((state) => state.previewDialer);
  const { session, timer, hold, unhold, decline, hangup } =
    useSessionCall(sessionId);
  const audioRef = useRef(null);
  const [playMusic, setPlayMusic] = useState(false);
  //Keep track for previous call progress Id
  const [prevCallProgressId, setPrevCallProgressId] = useState(callProgressId);

  // useEffect(() => {
  //   const audioElement = audioRef.current;
  //   if (playMusic && audioElement) {
  //     audioElement.src = connectMusic; // Set the audio source
  //     audioElement.loop = false; // Ensure looping is disabled
  //     setTimeout(() => {
  //       audioElement.play().catch((error) => {
  //         console.error("Error playing the audio:", error);
  //       });
  //     }, 2000); // Play after 2 seconds
  //   } else if (!playMusic && audioElement) {
  //     audioElement.pause();
  //     audioElement.currentTime = 0; // Reset to the start
  //     audioElement.src = ""; // Clear the source for extra safety
  //   }

  //   // Cleanup when component unmounts
  //   return () => {
  //     if (audioElement) {
  //       audioElement.pause();
  //       audioElement.currentTime = 0;
  //       audioElement.src = ""; // Clear source to avoid dangling audio
  //     }
  //   };
  // }, [playMusic, connectMusic]); // Dependencies: playMusic, connectMusic

  useEffect(() => {
    if (session?._state === "Establishing") {
      setPlayMusic(true);
    } else {
      setPlayMusic(false);
    }
  }, [session?._state]);

  const currentSession = globalSession.find(
    (session) => session.id === sessionId
  );
  const isHeld = currentSession?.state === "OnHold";
  //Effect to handle when session state is changed
  useEffect(() => {
    //If callProgressId changes

    if (prevCallProgressId && prevCallProgressId !== callProgressId) {
      const prevSession = globalSession.find(
        (item) => item.id === prevCallProgressId
      );
      //Hold previous call
      if (
        prevSession &&
        session?._state === "Established" &&
        prevSession.mode !== "video"
      ) {
        setTimeout(() => {
          hold(prevSession.id);
        }, 2000);

        dispatch({
          type: "SET_SESSIONS",
          sessions: globalSession.map((item) =>
            item.id === prevSession.id ? { ...item, state: "OnHold" } : item
          ),
        });
      }
    }
    //update current callProgressId
    setPrevCallProgressId(callProgressId);
  }, [callProgressId]);

  if (session["_state"] === "Terminated") {
    // dispatch({
    //   type:"SET_VIDEOCALL",
    //   videoCall:false
    // })
    const updatedVideoCallMode = globalSession.find(
      (item) => item.id === callProgressId
    );
    if (updatedVideoCallMode?.mode === "video") {
      dispatch({
        type: "SET_VIDEOCALL",
        videoCall: false,
      });
    }
    const updatedSession = globalSession.filter(
      (item) => item.id !== session._id
    );
    dispatch({
      type: "SET_SESSIONS",
      sessions: updatedSession,
    });
    setHangupRefresh(hangupRefresh + 1);
    setSelectedModule("callDetails");
    if (callProgressId === session._id) {
      //check callprogressId in globalsession and if mode = video, change videocallState
      dispatch({
        type: "SET_CALLPROGRESSID",
        callProgressId: "",
      });
      dispatch({
        type: "SET_CALLPROGRESSDESTINATION",
        callProgressDestination: "",
      });
      dispatch({
        type: "SET_CALLPROGRESS",
        callProgress: false,
      });
    }
    // Checking if terminated call is from dialer or not
    globalSession.filter((item) => {
      if (item.id === session._id) {
        previewDialer.map((item2) => {
          if ((item2.phone_number === item.destination.slice(2)) && (item.state === "Established")) {
            dispatch({
              type: "SET_AGENT_DEPOSITION",
              agentDeposition: true
            })
            dispatch({
              type: "SET_DEPOSIT_OPTIONS",
              desposiTionOptions: item2
            })
            dispatch({
              type: "REMOVE_PREVIEWDIALER",
              phone_number: item2.phone_number
            })
          }
        })
        // if(item.destination){

        // }
      }
    })
  }

  function handleActiveCall(id, dest) {
    dispatch({
      type: "SET_CALLPROGRESSID",
      callProgressId: id,
    });
    dispatch({
      type: "SET_CALLPROGRESSDESTINATION",
      callProgressDestination: dest,
    });
    dispatch({
      type: "SET_CALLPROGRESS",
      callProgress: mode === "audio" ? true : false,
    });
    dispatch({
      type: "SET_VIDEOCALL",
      videoCall: mode === "video" ? true : false,
    });
  }

  // const callerExtension = session.incomingInviteRequest
  //   ? session?.incomingInviteRequest?.message?.from?._displayName
  //   : session?.outgoingInviteRequest?.message?.to?.uri?.normal?.user;

  const handleAnswerCall = async (e, mode) => {
    e.stopPropagation();
    if (!isMicOn) {
      toast.warn("Please turn on microphone");
      return;
    }
    const devices = await navigator.mediaDevices.enumerateDevices();
    const hasVideoInput = devices.some(
      (device) => device.kind === "videoinput"
    );

    if (mode === "video" && !hasVideoInput) {
      //need to check here if webcam is available or not ,
      //otherwise it will send 480-temporarily unavailable
      toast.warn("No webcam detected. Answering as audio call.");
      mode = "audio"; // Fallback to audio if no webcam is available
    }
    session.accept({
      sessionDescriptionHandlerOptions: {
        constraints: {
          audio: true,
          video: mode === "video" ? true : false,
        },
      },
    });

    // if mode is video then set_session mode changed to video in extesting session

    if (mode === "video") {
      dispatch({
        type: "SET_MINIMIZE",
        minimize: false,
      });
      const updatedSession = globalSession.find(
        (session) => session.id === sessionId
      );
      if (updatedSession) {
        updatedSession.mode = "video";
        dispatch({
          type: "SET_SESSIONS",
          sessions: [
            ...globalSession.filter((session) => session.id !== sessionId),
            updatedSession,
          ],
        });
      }
      handleActiveCall(updatedSession.id, updatedSession.destination);
    } else {
      const updatedSession = globalSession.find(
        (session) => session.id === sessionId
      );

      if (updatedSession) {
        updatedSession.state = "Established";

        dispatch({
          type: "SET_SESSIONS",
          sessions: [
            ...globalSession.filter((session) => session.id !== sessionId),
            updatedSession,
          ],
        });
      }
      handleActiveCall(updatedSession.id, updatedSession.destination);
    }

    setSelectedModule("onGoingCall");
    // setactivePage("call");

    // dispatch({
    //   type: "SET_CALLPROGRESSID",
    //   callProgressId: sessionId,
    // });
    // dispatch({
    //   type: "SET_VIDEOCALL",
    //   videoCall: mode === "video" ? true : false,
    // });
    // dispatch({
    //   type: "SET_CALLPROGRESSDESTINATION",
    //   callProgressDestination: callerExtension,
    // });
    // dispatch({
    //   type: "SET_CALLPROGRESS",
    //   callProgress: mode === "audio" ? true : false,
    // });
  };

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
  return (
    <>
      {isHeld ? (
        <div
          onClick={() => handleActiveCall(session._id, destination)}
          className="col-12 callItem hold"
        >
          <div className="profilepicHolder">{chennel + 1}</div>
          <div className="callContent">
            <h4>{destination}</h4>
            {/* <h5>01:20</h5> */}
            <CallTimer answeredAt={timer.answeredAt} />
            {/* <span className="float-end" style={{ fontSize: 12 }}>Line {chennel + 1}</span> */}
          </div>
          <div className="callBtnGrp my-auto ms-auto">
            <button
              className="appPanelButtonCaller bg-warning"
              // onClick={() => holdCall("unhold")}
            >
              <i class="fa-solid fa-pause"></i>
            </button>
            <button
              className="appPanelButtonCaller bg-danger me-0"
              onClick={hangup}
            >
              <i class="fa-solid fa-phone-hangup"></i>
            </button>
          </div>
        </div>
      ) : session?._state === "Initial" ? (
        <div
          onClick={() => handleActiveCall(session._id, destination)}
          className="col-12 callItem ringing"
        >
          <div className="profilepicHolder">{chennel + 1}</div>
          <div className="callContent">
            <h4>{destination}</h4>
            <h5>Incoming...</h5>
          </div>
          <div className="callBtnGrp my-auto ms-auto">
            <button
              className="appPanelButtonCaller"
              style={{ background: "#1ac444" }}
              onClick={(e) => handleAnswerCall(e, "audio")}
            >
              <i class="fa-solid fa-phone"></i>
            </button>
            <button
              className="appPanelButtonCaller bg-danger me-0"
              onClick={decline}
            >
              <i class="fa-solid fa-phone-hangup"></i>
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => handleActiveCall(session._id, destination)}
          className="col-12 callItem active"
        >
          <div className="profilepicHolder">{chennel + 1}</div>
          <div className="callContent">
            <h4>{destination}</h4>
            {/* <h5>01:20</h5> */}
            <CallTimer answeredAt={timer.receivedAt} />
            {/* <span className="float-end" style={{ fontSize: 12 }}>Line {chennel + 1}</span> */}
          </div>
          <div className="callBtnGrp my-auto ms-auto">
            <button className="appPanelButtonCaller bg-danger" onClick={hangup}>
              <i class="fa-solid fa-phone-hangup"></i>
            </button>
          </div>
        </div>
      )}
      {/* </div> */}

      <audio ref={audioRef}></audio>
    </>
  );
}

export default ActiveCallSidePanel;

const CallTimer = ({ answeredAt }) => {
  const [timeElapsed, setTimeElapsed] = useState(0); // time in seconds

  useEffect(() => {
    if (!answeredAt) return; // If there's no answeredAt, do nothing

    const answeredTime = new Date(answeredAt).getTime();

    const timerInterval = setInterval(() => {
      const currentTime = Date.now();
      const elapsedSeconds = Math.floor((currentTime - answeredTime) / 1000);
      setTimeElapsed(elapsedSeconds);
    }, 1000);

    return () => clearInterval(timerInterval); // Clean up on unmount
  }, [answeredAt]);

  const minutes = Math.floor(timeElapsed / 60);
  const seconds = timeElapsed % 60;

  return (
    <h5>
      {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </h5>
  );
};
