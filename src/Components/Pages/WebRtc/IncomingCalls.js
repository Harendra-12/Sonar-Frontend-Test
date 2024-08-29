import React, { useEffect, useState } from "react";
import IncomingCallPopup from "./IncomingCallPopup";
import { useSIPProvider } from "react-sipjs";
import { useDispatch, useSelector } from "react-redux";

const IncomingCalls = () => {
  const { sessions: sipSessions } = useSIPProvider();

  const incomingSessionsArray = Object.keys(sipSessions).filter(
    (sessionId) =>
      sipSessions[sessionId].state === "Initial" &&
      sipSessions[sessionId].logger.category == "sip.Invitation"
  );

  //1001 (Initial) => 1002 (self)
  //after rcv Established

  // useEffect(() => {

  //if destination exist in global session array(array or objects) then update
  //if state is terminated then remove

  // const disconnectedSessions
  // = Object.keys(sipSessions).filter(
  //   (sessionId) => sipSessions[sessionId].state !== "Terminated"
  // );

  // console.log(sipSessions);
  // console.log(disconnectedSessions);
  // const updatedSession = disconnectedSessions.map((sessionId) => {
  //   return {
  //     id: sipSessions[sessionId]._id,
  //     destination: "1001",
  //     // destination: sipSessions[sessionId].incomingInviteRequest
  //     //   ? sipSessions[sessionId].incomingInviteRequest.message.from
  //     //       ._displayName
  //     //   : sipSessions[sessionId].outgoingInviteRequest.message.to.uri.normal
  //     //       .user,
  //   };
  // });
  // dispatch({
  //   type: "SET_SESSIONS",
  //   sessions: updatedSession,
  // });
  // }, [sipSessions]);

  // useEffect(() => {
  //   dispatch({
  //     type: "SET_SESS",
  //     sess: disconnectedSessions.map((sessionId) => {
  //       return {
  //         sessionId: sipSessions[sessionId]._id,
  //         destination:
  //           sipSessions[sessionId].incomingInviteRequest.message.from
  //             ._displayName,
  //       };
  //     }),
  //   });
  // }, [sipSessions]);

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
