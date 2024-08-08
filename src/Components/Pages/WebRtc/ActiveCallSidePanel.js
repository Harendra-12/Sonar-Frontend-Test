<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { useSessionCall } from "react-sipjs";

function ActiveCallSidePanel({ data, index }) {
  const { sessionId, destination } = data;
  const { isHeld, isMuted, session, direction, timer } =
    useSessionCall(sessionId);
  const [duration, setDuration] = useState(0);
  console.log(isHeld, isMuted, session, direction);
  useEffect(() => {
    if (timer && timer.createdAt) {
      const startTime = new Date(timer.createdAt);
      const interval = setInterval(() => {
        const currentTime = new Date();
        const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
        setDuration(elapsedSeconds);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer]);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      remainingSeconds < 10 ? "0" : ""
    }${remainingSeconds}`;
  };
  console.log(session);

  return (
    <>
      {session._state == "Initial" ? (
        <div className="col-12 callItem ringing">
          <div className="profilepicHolder">3</div>
          <div className="callContent">
            <h4>Line {index + 1}</h4>
            <h5>
              {destination}{" "}
              <span className="float-end">{formatDuration(duration)}</span>
            </h5>
          </div>
        </div>
      ) : isHeld ? (
        <div className="col-12 callItem hold">
          <div className="profilepicHolder">4</div>
          <div className="callContent">
            <h4>Line {index + 1}</h4>
            <h5>
              {destination}{" "}
              <span className="float-end">{formatDuration(duration)}</span>
            </h5>
          </div>
        </div>
      ) : (
        <div className="col-12 callItem active">
          <div className="profilepicHolder">1</div>
          <div className="callContent">
            <h4>Line {index + 1}</h4>
            <h5>
              {destination}{" "}
              <span className="float-end">{formatDuration(duration)}</span>
=======
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSessionCall } from "react-sipjs";

function ActiveCallSidePanel({ sessionId, chennel, destination }) {
  const dispatch = useDispatch();
  const globalSession = useSelector((state) => state.sessions);
  const callProgressId = useSelector((state) => state.callProgressId);
  const { isHeld, session, timer } = useSessionCall(sessionId);

  if (session["_state"] === "Terminated") {
    if (callProgressId === session._id) {
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
    const updatedSession = globalSession.filter(
      (item) => item.id !== session._id
    );
    dispatch({
      type: "SET_SESSIONS",
      sessions: updatedSession,
    });
  }

  console.log("Active call", session._state);

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
      callProgress: true,
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
      ) : session._state === "Initial" ? (
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
            <h5>
              {destination}
              {/* <span className='float-end'>02:23
                                    </span> */}
>>>>>>> 278059c2357f1de476b06dbc6ec104f36a3ed8d1
            </h5>
          </div>
        </div>
      )}
<<<<<<< HEAD
=======

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
>>>>>>> 278059c2357f1de476b06dbc6ec104f36a3ed8d1
    </>
  );
}

export default ActiveCallSidePanel;
