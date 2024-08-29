import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSessionCall } from "react-sipjs";
import { CallTimer } from "./CallTimer";
import { SessionState } from "sip.js";
import { toast } from "react-toastify";

function OngoingCall({ setHangupRefresh, hangupRefresh }) {
  const dispatch = useDispatch();
  const globalSession = useSelector((state) => state.sessions);
  const callProgressId = useSelector((state) => state.callProgressId);
  const callProgressDestination = useSelector(
    (state) => state.callProgressDestination
  );

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
  } = useSessionCall(callProgressId);
  const canHold = session && session._state === SessionState.Established;
  const canMute = session && session._state === SessionState.Established;
  const holdCall = (type) => {
    if (canHold) {
      if (type === "hold") {
        hold();
        dispatch({
          type: "SET_SESSIONS",
          sessions: globalSession.map((item) =>
            item.id === session.id ? { ...item, state: "OnHold" } : item
          ),
        });
      } else if (type === "unhold") {
        unhold();
        dispatch({
          type: "SET_SESSIONS",
          sessions: globalSession.map((item) =>
            item.id === session.id ? { ...item, state: "Established" } : item
          ),
        });
      }
    } else {
      toast.warn("Call has not been established");
    }
  };

  const muteCall = (type) => {
    if (canMute) {
      if (type === "mute") {
        mute();
        dispatch({
          type: "SET_SESSIONS",
          sessions: globalSession.map((item) =>
            item.id === session.id ? { ...item, state: "Mute" } : item
          ),
        });
      } else if (type === "unmute") {
        unmute();
        dispatch({
          type: "SET_SESSIONS",
          sessions: globalSession.map((item) =>
            item.id === session.id ? { ...item, state: "Established" } : item
          ),
        });
      }
    } else {
      toast.warn("Call has not been established");
    }
  };
  return (
    <>
      <div className="caller">
        <div className="container-fluid">
          <div class="row header">
            <div class="col-4"></div>
            <div class="col-4 text-center">
              <h5>
                {timer?.answeredAt && (
                  <CallTimer
                    isEnd={session.state === SessionState.Terminated}
                    startAt={timer.answeredAt}
                  />
                )}
              </h5>
            </div>
            <div class="col-4 d-none d-xl-flex justify-content-end">
              <button class="appPanelButtonColor" effect="ripple">
                <i class="fa-thin fa-gear"></i>
              </button>
              <button
                class="appPanelButtonColor ms-2"
                effect="ripple"
                onclick="openMaximizeView()"
              >
                <i class="fa-thin fa-arrows-maximize"></i>
              </button>
            </div>
          </div>
          <div className="user">
            <div className="my-auto">
              <div id="userCallerProfile">
                <div className="userHolder col-12 mx-auto my-5">
                  <i className="fa-solid fa-user" />
                </div>
                <div className="col-12 text-center">
                  <h3>{callProgressDestination}</h3>
                </div>
              </div>
            </div>
          </div>
          <div className="row footer">
            <button
              onClick={
                isMuted ? () => muteCall("unmute") : () => muteCall("mute")
              }
              className={
                isMuted ? "appPanelButtonCaller active" : "appPanelButtonCaller"
              }
              effect="ripple"
            >
              <i className="fa-thin fa-microphone-slash" />
            </button>
            <button className="appPanelButtonCaller" effect="ripple">
              <i className="fa-thin fa-grid" />
            </button>
            <button className="appPanelButtonCaller" effect="ripple">
              <i className="fa-thin fa-user-plus" />
            </button>
            <button className="appPanelButtonCaller" effect="ripple">
              <i className="fa-thin fa-phone-arrow-up-right" />
            </button>
            <button className="appPanelButtonCaller" effect="ripple">
              P
            </button>
            <button
              // onClick={isHeld ? unhold : hold}
              onClick={
                isHeld ? () => holdCall("unhold") : () => holdCall("hold")
              }
              className={
                isHeld ? "appPanelButtonCaller active" : "appPanelButtonCaller"
              }
              effect="ripple"
            >
              <i className="fa-thin fa-pause" />
            </button>
            <button
              onClick={() => {
                hangup();
                setHangupRefresh(hangupRefresh + 1);
              }}
              className="appPanelButtonCaller bg-danger"
              effect="ripple"
            >
              <i className="fa-thin fa-phone-hangup" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default OngoingCall;
