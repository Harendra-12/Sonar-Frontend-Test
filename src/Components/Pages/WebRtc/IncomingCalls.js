import React from "react";
import IncomingCallPopup from "./IncomingCallPopup";
import { useSIPProvider } from "modify-react-sipjs";

const IncomingCalls = ({ setSelectedModule, setactivePage, isMicOn, isVideoOn, audioRef, audio, gainNodeRef, accountDetails, didAll }) => {
  const { sessions: sipSessions } = useSIPProvider();

  const incomingSessionsArray = Object.keys(sipSessions).filter(
    (sessionId) =>
      sipSessions[sessionId].state === "Initial" &&
      sipSessions[sessionId].logger.category === "sip.Invitation"
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
            audioRef={audioRef}
            audio={audio}
            gainNodeRef={gainNodeRef}
            accountDetails={accountDetails}
            didAll={didAll}
          />
        );
      })}
    </div>
  );
};

export default IncomingCalls;
