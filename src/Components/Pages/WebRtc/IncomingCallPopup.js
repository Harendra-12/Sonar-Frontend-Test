import React, { useState } from "react";
import { useSessionCall } from "react-sipjs";

function IncomingCallPopup({ sessionId }) {
  const [isMinimized, setIsMinimized] = useState(false);

  const {
    isHeld,
    isMuted,
    decline,
    hangup,
    hold,
    mute,
    answer,
    session,
    unhold,
    unmute,
    direction,
    timer,
  } = useSessionCall(sessionId);

  console.log(answer, direction);
  console.log(session);

  const callerExtension =
    session?.incomingInviteRequest?.message?.from?._displayName;
  return (
    <>
      {!isMinimized ? (
        <div className="incomingCallPopup">
          <div>
            <div className="user">
              <div className="userHolder col-12">
                <i className="fa-solid fa-user" />
              </div>
              <div className="userInfo col-12 text-center">
                <h4>{callerExtension}</h4>
                <h5>Hard coded Name</h5>
              </div>
            </div>
            <div className="controls">
              <button class="callButton" onClick={answer}>
                <i class="fa-duotone fa-phone"></i>
              </button>
              <button class="callButton hangup">
                <i class="fa-duotone fa-phone-hangup"></i>
              </button>
            </div>
          </div>
          <div className="minimizeBtn">
            <button class="whiteCircleBtn" onClick={() => setIsMinimized(true)}>
              <i class="fa-solid fa-dash"></i>
            </button>
          </div>
        </div>
      ) : (
        <div className="incomingCallPopup minimized">
          <div className="user">
            <div className="userHolder">
              <i className="fa-solid fa-user" />
            </div>
            <div className="userInfo text-start my-0 px-2">
              <h4>{callerExtension}</h4>
              <h5>{callerExtension}</h5>
            </div>
            <div className="controls m-0">
              <button class="callButton me-0">
                <i class="fa-duotone fa-phone"></i>
              </button>
              <button class="callButton hangup me-0">
                <i class="fa-duotone fa-phone-hangup"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default IncomingCallPopup;
