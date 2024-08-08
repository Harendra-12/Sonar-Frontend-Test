import React from "react";
import IncomingCallPopup from "./IncomingCallPopup";
import { useSIPProvider } from "react-sipjs";

const IncomingCalls = () => {
  const {
    connectAndRegister, // Function for connect and Register
    sessionManager, // null
    sessions, // {}
    registerStatus, //UNREGISTERED
    connectStatus, //WAIT REQUEST CONNECT
  } = useSIPProvider();
  console.log(sessions);
  return (
    <div>
      {Object.keys(sessions).map((sessionId) => (
        <IncomingCallPopup key={sessionId} sessionId={sessionId} />
        // <CallSessionItem key={sessionId} sessionId={sessionId} />
      ))}
    </div>
  );
};

export default IncomingCalls;
