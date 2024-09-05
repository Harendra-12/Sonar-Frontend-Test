import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSessionCall } from "react-sipjs";

function ActiveCallSidePanel({
  sessionId,
  chennel,
  destination,
  setHangupRefresh,
  hangupRefresh,
  setSelectedModule,
}) {
  const dispatch = useDispatch();
  const globalSession = useSelector((state) => state.sessions);
  const callProgressId = useSelector((state) => state.callProgressId);
  const { session, timer, hold, unhold } = useSessionCall(sessionId);
  //Keep track for previous call progress Id
  const [prevCallProgressId, setPrevCallProgressId] = useState(callProgressId);

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
      if (prevSession && session._state == "Established") {
        hold(prevSession.id);
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
    setHangupRefresh(hangupRefresh + 1);
    setSelectedModule("callDetails");
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
            </h5>
          </div>
        </div>
      )}

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
