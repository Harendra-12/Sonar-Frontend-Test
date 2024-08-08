import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSessionCall } from "react-sipjs";

function IncomingCallPopup({ sessionId, lastIncomingCall, index }) {
  const [isMinimized, setIsMinimized] = useState(false);

  const { decline, answer, session } = useSessionCall(sessionId);
  const dispatch = useDispatch();
  const sess = useSelector((state) => state.sess) || {};

  useEffect(() => {
    if (!lastIncomingCall) {
      setIsMinimized(true);
    }
  }, [sessionId, lastIncomingCall]);

  useEffect(() => {
    dispatch({
      type: "SET_SESS",
      sess: [
        ...sess,
        {
          sessionId: sessionId,
          destination: callerExtension,
        },
      ],
    });
  }, [sessionId]);

  const callerExtension =
    session?.incomingInviteRequest?.message?.from?._displayName;

  const topPosition = 10 + index * 75;

  return (
    <>
      {lastIncomingCall && !isMinimized ? (
        <div className="incomingCallPopup">
          <div>
            <div className="user">
              <div className="userHolder col-12">
                <i className="fa-solid fa-user" />
              </div>
              <div className="userInfo col-12 text-center">
                <h4>{callerExtension}</h4>
                <h5>{callerExtension}</h5>
              </div>
            </div>
            <div className="controls">
              <button class="callButton" onClick={answer}>
                <i class="fa-duotone fa-phone"></i>
              </button>
              <button class="callButton hangup" onClick={decline}>
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
        <div
          className="incomingCallPopup minimized"
          style={{
            marginBottom: topPosition,
          }}
        >
          <div className="user">
            <div className="userHolder">
              <i className="fa-solid fa-user" />
            </div>
            <div className="userInfo text-start my-0 px-2">
              <h4>{callerExtension}</h4>
              <h5>{callerExtension}</h5>
            </div>
            <div className="controls m-0">
              <button class="callButton me-0" onClick={answer}>
                <i class="fa-duotone fa-phone"></i>
              </button>
              <button class="callButton hangup me-0" onClick={decline}>
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
