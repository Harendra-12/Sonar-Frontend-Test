import React, { useEffect, useState } from "react";
import IncomingCallPopup from "./IncomingCallPopup";
import { useSIPProvider } from "react-sipjs";
import { useDispatch } from "react-redux";

const IncomingCalls = () => {
  const dispatch = useDispatch();
  const { sessions: sipSessions } = useSIPProvider();

  const incomingSessionsArray = Object.keys(sipSessions).filter(
    (sessionId) => sipSessions[sessionId].state === "Initial"
  );
  const disconnectedSessions = Object.keys(sipSessions).filter(
    (sessionId) => sipSessions[sessionId].state !== "Terminated"
  );

  useEffect(() => {
    dispatch({
      type: "SET_SESS",
      sess: disconnectedSessions.map((sessionId) => {
        return {
          sessionId: sipSessions[sessionId]._id,
          destination:
            sipSessions[sessionId].incomingInviteRequest.message.from
              ._displayName,
        };
      }),
    });
  }, [sipSessions]);

  return (
    <div>
      {incomingSessionsArray.map((item, index) => {
        return (
          <IncomingCallPopup
            key={index}
            sessionId={item}
            lastIncomingCall={index === incomingSessionsArray.length - 1}
            index={index}
          />
        );
      })}
    </div>
  );
};

export default IncomingCalls;
