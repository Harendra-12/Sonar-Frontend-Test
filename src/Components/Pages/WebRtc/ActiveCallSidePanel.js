import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSessionCall } from "react-sipjs";
import connectMusic from "../../assets/music/ring-tone.mp3";
import { SessionState } from "sip.js";

function ActiveCallSidePanel({
  sessionId,
  chennel,
  mode,
  destination,
  setHangupRefresh,
  hangupRefresh,
  setSelectedModule,
}) {
  const dispatch = useDispatch();
  const globalSession = useSelector((state) => state.sessions);
  const callProgressId = useSelector((state) => state.callProgressId);
  const { session, timer, hold, unhold } = useSessionCall(sessionId);
  const audioRef = useRef(null);
  const [playMusic, setPlayMusic] = useState(false);
  console.log(session);
  //Keep track for previous call progress Id
  const [prevCallProgressId, setPrevCallProgressId] = useState(callProgressId);
  console.log("This is session", session?._state);

  useEffect(() => {
    const audioElement = audioRef.current;
    console.log("Current playMusic value:", playMusic); // Log the state
    console.log("Current audio state:", audioElement?.paused);

    if (playMusic && audioElement) {
      console.log("Starting music...");
      audioElement.src = connectMusic; // Set the audio source
      audioElement.loop = false; // Ensure looping is disabled
      setTimeout(() => {
        audioElement.play().catch((error) => {
          console.error("Error playing the audio:", error);
        });
      }, 2000); // Play after 2 seconds
    } else if (!playMusic && audioElement) {
      console.log("Stopping music...");
      audioElement.pause();
      audioElement.currentTime = 0; // Reset to the start
      audioElement.src = ""; // Clear the source for extra safety
    }

    // Cleanup when component unmounts
    return () => {
      if (audioElement) {
        console.log("Cleaning up audio...");
        audioElement.pause();
        audioElement.currentTime = 0;
        audioElement.src = ""; // Clear source to avoid dangling audio
      }
    };
  }, [playMusic, connectMusic]); // Dependencies: playMusic, connectMusic

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
        session?._state == "Established" &&
        prevSession.mode !== "video"
      ) {
        hold(prevSession.id);
        console.log("hold hit", prevSession);
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

  return (
    <>
      {isHeld ? (
        <div
          onClick={() => handleActiveCall(session._id, destination)}
          className="col-12 callItem hold"
        >
          <div className="profilepicHolder">{chennel + 1}</div>
          <div className="callContent">
            <h4>Line {chennel + 1}</h4>
            <h5>{destination}</h5>
          </div>
        </div>
      ) : session?._state === "Initial" ? (
        <div
          onClick={() => handleActiveCall(session._id, destination)}
          className="col-12 callItem ringing"
        >
          <div className="profilepicHolder">{chennel + 1}</div>
          <div className="callContent">
            <h4>Line {chennel + 1}</h4>
            <h5>{destination}</h5>
          </div>
        </div>
      ) : (
        <div
          onClick={() => handleActiveCall(session._id, destination)}
          className="col-12 callItem active"
        >
          <div className="profilepicHolder">{chennel + 1}</div>
          <div className="callContent">
            <h4>Line {chennel + 1}</h4>
            <h5>{destination}</h5>
          </div>
        </div>
      )}

      <audio ref={audioRef}></audio>

      {/* <div className='col-12 callItem active'>
                        <div className='profilepicHolder'>
                            2
                        </div>
                        <div className='callContent'>
                            <h4>Line 2</h4>
                            <h5>1003 <span className='float-end'>02:23</span></h5>
                        </div>
                    </div>
                    <div className='col-12 callItem ringing'>
                        <div className='profilepicHolder'>
                            3
                        </div>
                        <div className='callContent'>
                            <h4>Line 3</h4>
                            <h5>1003 <span className='float-end'>02:23</span></h5>
                        </div>
                    </div>
                    <div className='col-12 callItem hold'>
                        <div className='profilepicHolder'>
                            4
                        </div>
                        <div className='callContent'>
                            <h4>Line 4</h4>
                            <h5>1003 <span className='float-end'>02:23</span></h5>
                        </div>
                    </div> */}
    </>
  );
}

export default ActiveCallSidePanel;
