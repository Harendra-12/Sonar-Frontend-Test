/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSessionCall, useSIPProvider } from "modify-react-sipjs";
import { SessionState } from "sip.js";
import { toast } from "react-toastify";
import { CallTimer } from "./CallTimer";

/**
 * ActiveCallSidePanel
 * This component is used to show the active call list in the side panel of the phone dashboard.
 * It shows the destination number and the status of the call.
 * If the call is established, it shows the answered time and the call duration.
 * If the call is ringing, it shows the "Answer" and "Reject" buttons.
 * If the call is on hold, it shows the "Resume" button.
 * @param {string} sessionId - The id of the session.
 * @param {number} chennel - The channel number of the call.
 * @param {string} mode - The mode of the call, "audio" or "video".
 * @param {string} destination - The destination number of the call.
 * @param {function} setHangupRefresh - The function to set the hangup refresh flag.
 * @param {number} hangupRefresh - The hangup refresh flag.
 * @param {function} setSelectedModule - The function to set the selected module.
 * @param {boolean} isMicOn - The flag to check if the microphone is on.
 * @param {array} globalSession - The array of all the sessions.
 */
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
  accountDetails,
  didAll,
  audioRef,
}) {
  const { sessions } = useSIPProvider();
  const dispatch = useDispatch();
  const callProgressId = useSelector((state) => state.callProgressId);
  const previewDialer = useSelector((state) => state.previewDialer);
  const { session, timer, hold, unhold, decline, hangup } =
    useSessionCall(sessionId);
  // const audioRef = useRef(null);
  const [playMusic, setPlayMusic] = useState(false);
  const [holdProcessing, setHoldProcessing] = useState(false);
  //Keep track for previous call progress Id
  const [prevCallProgressId, setPrevCallProgressId] = useState(callProgressId);
  const refreshCalls = useSelector((state) => state.refreshCalls);
  const activeCall = useSelector((state) => state.activeCall);
  const [callExtraInfo, setCallExtraInfo] = useState({
    info: "",
    type: "",
  });

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
          // hold(prevSession.id);
          holdCall("hold", prevSession.id);
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

    audioRef?.current?.pause();

    setTimeout(() => {
      dispatch({
        type: "SET_CALLREFRESH",
        refreshCalls: refreshCalls + 1,
      });
    }, 3000);

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
          if (
            item2.phone_code + item2.phone_number === item.destination &&
            item.state === "Established"
          ) {
            dispatch({
              type: "SET_AGENT_DEPOSITION",
              agentDeposition: true,
            });
            dispatch({
              type: "SET_DEPOSIT_OPTIONS",
              desposiTionOptions: item2,
            });
            dispatch({
              type: "REMOVE_PREVIEWDIALER",
              phone_number: item2.phone_number,
            });
          }
        });
        // if(item.destination){

        // }
      }
    });
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
  };

  const canHold = session && session._state === SessionState.Established;

  async function holdCall(type, id) {
    const currentSession = sessions[id];
    if (canHold) {
      if (type === "hold" && !holdProcessing) {
        setHoldProcessing(true);
        var sessionDescriptionHandlerOptions =
          currentSession.sessionDescriptionHandlerOptionsReInvite;
        sessionDescriptionHandlerOptions.hold = true;
        currentSession.sessionDescriptionHandlerOptionsReInvite =
          sessionDescriptionHandlerOptions;
        var options = {
          requestDelegate: {
            onAccept: function () {
              if (
                currentSession &&
                currentSession.sessionDescriptionHandler &&
                currentSession.sessionDescriptionHandler.peerConnection
              ) {
                var pc =
                  currentSession.sessionDescriptionHandler.peerConnection;
                // Stop all the inbound streams
                pc.getReceivers().forEach(function (RTCRtpReceiver) {
                  if (RTCRtpReceiver.track)
                    RTCRtpReceiver.track.enabled = false;
                });
              }
              currentSession.isOnHold = true;
              dispatch({
                type: "SET_SESSIONS",
                sessions: globalSession.map((item) =>
                  item.id === currentSession.id
                    ? { ...item, state: "OnHold" }
                    : item
                ),
              });
              setHoldProcessing(false);
            },
            onReject: function () {
              currentSession.isOnHold = false;
              setHoldProcessing(false);
            },
          },
        };
        currentSession.invite(options).catch(function (error) {
          currentSession.isOnHold = false;
          console.warn("Error attempting to put the call on hold:", error);
        });
      }
    } else {
      toast.warn("Call has not been established");
    }
  }

  useEffect(() => {
    if (destination.length < 5) {
      const filteredExtension = accountDetails?.extensions?.filter(
        (acc) => acc?.extension == destination
      );
      const username = accountDetails?.users?.filter(
        (acc) => acc?.extension_id == filteredExtension[0]?.id
      );
      setCallExtraInfo({
        info: username[0]?.username || destination,
        type: "user",
      });
    } else {
      const isNumberPresent = activeCall.find(
        (item) => item.cid_num == destination || item.did_tag == destination
      );
      setCallExtraInfo({
        info: isNumberPresent?.did_tag || destination,
        type: "did",
      });
    }
  }, [accountDetails, didAll, activeCall]);

  return (
    <>
      {isHeld ? (
        <div
          onClick={() => handleActiveCall(session._id, destination)}
          className="col-12 callItem hold"
        >
          <div className="profilepicHolder">{chennel + 1}</div>
          <div className="callContent">
            <h4>
              {callExtraInfo.type == "user" ? callExtraInfo.info : destination}
            </h4>
            {callExtraInfo.type == "did" && <h5>{callExtraInfo.info}</h5>}
            {/* <h5>01:20</h5> */}
            {timer?.answeredAt && (
              <CallTimer
                startAt={timer.answeredAt}
                isEnd={session.state === SessionState.Terminated}
              />
            )}
            {/* <span className="float-end" style={{ fontSize: 12 }}>Line {chennel + 1}</span> */}
          </div>
          <div className="callBtnGrp my-auto ms-auto">
            <button
              className="appPanelButtonCaller bg-warning"
              // onClick={() => holdCall("unhold")}
            >
              <i className="fa-solid fa-pause"></i>
            </button>
            <button
              className="appPanelButtonCaller bg-danger me-0"
              onClick={hangup}
            >
              <i className="fa-solid fa-phone-hangup"></i>
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
            <h4>
              {callExtraInfo.type == "user" ? callExtraInfo.info : destination}
            </h4>
            {callExtraInfo.type == "did" && <h5>{callExtraInfo.info}</h5>}
            <h5>Incoming...</h5>
          </div>
          <div className="callBtnGrp my-auto ms-auto">
            <button
              className="appPanelButtonCaller"
              style={{ background: "#1ac444" }}
              onClick={(e) => handleAnswerCall(e, "audio")}
            >
              <i className="fa-solid fa-phone"></i>
            </button>
            <button
              className="appPanelButtonCaller bg-danger me-0"
              onClick={decline}
            >
              <i className="fa-solid fa-phone-hangup"></i>
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
            <h4>
              {callExtraInfo.type == "user" ? callExtraInfo.info : destination}
            </h4>
            {callExtraInfo.type == "did" && <h5>{callExtraInfo.info}</h5>}
            {timer?.answeredAt && (
              <CallTimer
                startAt={timer.answeredAt}
                isEnd={session.state === SessionState.Terminated}
              />
            )}
            {/* <span className="float-end" style={{ fontSize: 12 }}>Line {chennel + 1}</span> */}
          </div>
          <div className="callBtnGrp my-auto ms-auto">
            <button className="appPanelButtonCaller bg-danger" onClick={hangup}>
              <i className="fa-solid fa-phone-hangup"></i>
            </button>
          </div>
        </div>
      )}
      {/* </div> */}

      {/* <audio ref={audioRef}></audio> */}
    </>
  );
}

export default ActiveCallSidePanel;

// const CallTimer = ({ answeredAt }) => {
//   const [timeElapsed, setTimeElapsed] = useState(0); // time in seconds

//   useEffect(() => {
//     if (!answeredAt) return; // If there's no answeredAt, do nothing

//     const answeredTime = new Date(answeredAt).getTime();

//     const timerInterval = setInterval(() => {
//       const currentTime = Date.now();
//       const elapsedSeconds = Math.floor((currentTime - answeredTime) / 1000);
//       setTimeElapsed(elapsedSeconds);
//     }, 1000);

//     return () => clearInterval(timerInterval); // Clean up on unmount
//   }, [answeredAt]);

//   const minutes = Math.floor(timeElapsed / 60);
//   const seconds = timeElapsed % 60;

//   return (
//     <h5>
//       {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
//     </h5>
//   );
// };
