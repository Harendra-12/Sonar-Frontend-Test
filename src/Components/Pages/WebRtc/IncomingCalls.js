import React, { useEffect, useState } from "react";
import IncomingCallPopup from "./IncomingCallPopup";
import { useSIPProvider } from "react-sipjs";
import { useDispatch, useSelector } from "react-redux";

const IncomingCalls = ({ setSelectedModule, setactivePage, isMicOn,isVideoOn }) => {
  const { sessions: sipSessions } = useSIPProvider();

  const incomingSessionsArray = Object.keys(sipSessions).filter(
    (sessionId) =>
      sipSessions[sessionId].state === "Initial" &&
      sipSessions[sessionId].logger.category == "sip.Invitation"
  );

  return (
    <div>
      {incomingSessionsArray.map((item, index) => {
        return (
          <IncomingCallPopup
            key={index}
            sessionId={item}
            lastIncomingCall={index === incomingSessionsArray.length - 1}
            index={index}
            setSelectedModule={setSelectedModule}
            setactivePage={setactivePage}
            isMicOn={isMicOn}
            isVideoOn={isVideoOn}
          />
        );
      })}
    </div>
  );
};

export default IncomingCalls;
