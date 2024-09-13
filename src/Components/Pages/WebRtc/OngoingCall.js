import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSessionCall } from "react-sipjs";
import { CallTimer } from "./CallTimer";
import {
  SessionState,
  UserAgent,
  Session,
  Inviter,
  InviterOptions,
  UserAgentOptions,
} from "sip.js";
import { toast } from "react-toastify";
import { Dialog, UserAgentCore } from "sip.js/lib/core";

function OngoingCall({ setHangupRefresh, hangupRefresh, setSelectedModule }) {
  const dispatch = useDispatch();
  const account = useSelector((state) => state.account);
  const extension = account?.extension?.extension || "";
  const globalSession = useSelector((state) => state.sessions);
  const callProgressId = useSelector((state) => state.callProgressId);
  const [hideDialpad, setHideDialpad] = useState(false);
  const [attendShow, setAttendShow] = useState(false);
  const [destNumber, setDestNumber] = useState("");
  const [attendedTransferNumber, setattendedTransferNumber] = useState("");
  const callProgressDestination = useSelector(
    (state) => state.callProgressDestination
  );

  const {
    isHeld,
    isMuted,
    hangup,
    hold,
    mute,
    session,
    unhold,
    unmute,
    timer,
  } = useSessionCall(callProgressId);

  // Handle dialpad press and send DTMF
  const handleDigitPress = (digit) => {
    if (session) {
      const dtmfSender = session.sessionDescriptionHandler.peerConnection
        .getSenders()
        .find((sender) => sender.dtmf);
      if (dtmfSender && dtmfSender.dtmf) {
        dtmfSender.dtmf.insertDTMF(digit);
      } else {
        console.error("DTMF sender not available");
      }
    } else {
      console.error("No active session found");
    }
  };
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

  const handleAttendedTransfer = async (e) => {
    e.preventDefault();
    if (attendedTransferNumber.length > 3) {
      const dialog = session.dialog;
      const transferTo = `sip:${attendedTransferNumber}@${account.domain.domain_name}`;

      if (session.state !== "Established") {
        toast.warn("cannot transfer call: session is not established");
        return;
      }

      try {
        const customHeaders = {
          "X-Custom-Header": "Value",
          "Refer-To": transferTo,
          "Referred-By": `sip:${extension}@${account.domain.domain_name}`,
        };

        const target = UserAgent.makeURI(transferTo);

        if (target) {
          // Initiate the refer request
          const referRequest = dialog.refer(target, {
            extraHeaders: Object.entries(customHeaders).map(
              ([key, value]) => `${key}: ${value}`
            ),
          });

          // Add event listeners for accepted and rejected states
          referRequest.delegate = {
            onAccept: () => {
              console.log("Transfer accepted.");
            },
            onReject: () => {
              console.log("Transfer rejected.");
            },
          };

          console.log("Refer request sent. Awaiting response...");
        } else {
          console.error("Invalid transfer address.");
        }
      } catch (error) {
        console.error("Error transferring call:", error);
      }
    } else {
      toast.error("Invalid destination number");
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
            <button
              onClick={() => {
                setHideDialpad(!hideDialpad);
              }}
              className={
                hideDialpad
                  ? "appPanelButtonCaller active"
                  : "appPanelButtonCaller"
              }
              effect="ripple"
            >
              <i className="fa-thin fa-grid" />
            </button>

            <button className="appPanelButtonCaller" effect="ripple">
              <i className="fa-thin fa-user-plus" />
            </button>
            <button
              className={
                attendShow
                  ? "appPanelButtonCaller active"
                  : "appPanelButtonCaller"
              }
              effect="ripple"
              onClick={() => {
                setAttendShow(!attendShow);
              }}
            >
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
                setSelectedModule("callDetails");
              }}
              className="appPanelButtonCaller bg-danger"
              effect="ripple"
            >
              <i className="fa-thin fa-phone-hangup" />
            </button>
          </div>
        </div>
        {hideDialpad ? (
          <div id="dialPad" className="inCall">
            <div className="container h-100">
              <div className="row align-items-center justify-content-center h-100">
                <div className="col-xl-5 col-md-6 col-11 dialPadContainer p-2">
                  <div className="d-flex justify-content-end pt-1 pb-1 px-2">
                    {/* <div>
                  <i className="fa-light fa-address-book fs-5" />
                </div> */}
                    {/* <div>
                  <h3>Dial Number:</h3>
                </div> */}
                    <div
                      onClick={() => setHideDialpad(false)}
                      style={{ cursor: "pointer" }}
                    >
                      <i className="fa-regular fa-xmark fs-5 text-white" />
                    </div>
                  </div>
                  <div className="mb-2">
                    {/* <span>Outbound ID: (999) 999-9999</span> */}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder=""
                      className="dialerInput"
                      disabled={true}
                      value={destNumber}
                    // onChange={(e) => setDestNumber(e.target.value)}
                    // onChange={handleInputChange}
                    />
                  </div>

                  <div className="dialerWrap mt-2">
                    <div
                      className="col-4"
                      onClick={() => {
                        setDestNumber(destNumber + "1");
                        handleDigitPress(1);
                      }}
                    >
                      <h4>1</h4>
                      <h6>&nbsp;</h6>
                    </div>
                    <div
                      className="col-4"
                      onClick={() => {
                        setDestNumber(destNumber + "2");
                        handleDigitPress(2);
                      }}
                    >
                      <h4>2</h4>
                      <h6>ABC</h6>
                    </div>
                    <div
                      className="col-4"
                      onClick={() => {
                        setDestNumber(destNumber + "3");
                        handleDigitPress(3);
                      }}
                    >
                      <h4>3</h4>
                      <h6>DEF</h6>
                    </div>
                    <div
                      className="col-4"
                      onClick={() => {
                        setDestNumber(destNumber + "4");
                        handleDigitPress(4);
                      }}
                    >
                      <h4>4</h4>
                      <h6>GHI</h6>
                    </div>
                    <div
                      className="col-4"
                      onClick={() => {
                        setDestNumber(destNumber + "5");
                        handleDigitPress(5);
                      }}
                    >
                      <h4>5</h4>
                      <h6>JKL</h6>
                    </div>
                    <div
                      className="col-4"
                      onClick={() => {
                        setDestNumber(destNumber + "6");
                        handleDigitPress(6);
                      }}
                    >
                      <h4>6</h4>
                      <h6>MNO</h6>
                    </div>
                    <div
                      className="col-4"
                      onClick={() => {
                        setDestNumber(destNumber + "7");
                        handleDigitPress(7);
                      }}
                    >
                      <h4>7</h4>
                      <h6>PQRS</h6>
                    </div>
                    <div
                      className="col-4"
                      onClick={() => {
                        setDestNumber(destNumber + "8");
                        handleDigitPress(8);
                      }}
                    >
                      <h4>8</h4>
                      <h6>TUV</h6>
                    </div>
                    <div
                      className="col-4"
                      onClick={() => {
                        setDestNumber(destNumber + "9");
                        handleDigitPress(9);
                      }}
                    >
                      <h4>9</h4>
                      <h6>WXYZ</h6>
                    </div>
                    <div
                      className="col-4"
                      onClick={() => {
                        setDestNumber(destNumber + "*");
                        handleDigitPress("*");
                      }}
                    >
                      <h4>
                        <i className="fa-light fa-asterisk" />
                      </h4>
                    </div>
                    <div
                      className="col-4"
                      onClick={() => {
                        setDestNumber(destNumber + "0");
                        handleDigitPress(0);
                      }}
                    >
                      <h4>0</h4>
                      <h6>+</h6>
                    </div>
                    <div
                      className="col-4"
                      onClick={() => {
                        setDestNumber(destNumber + "#");
                        handleDigitPress("#");
                      }}
                    >
                      <h4>
                        <i className="fa-light fa-hashtag" />
                      </h4>
                    </div>
                  </div>
                  {/* <div 
                // onClick={onSubmit}
                >
                <button className="callButton">
                  <i className="fa-thin fa-phone" />
                </button>
              </div> */}
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}

        {attendShow ? (
          <div id="dialPad" className="inCall">
            <div className="container h-100">
              <div className="row align-items-center justify-content-center h-100">
                <div className="col-xl-5 col-md-6 col-11 dialPadContainer p-2">
                  <div className="d-flex justify-content-end pt-1 pb-1 px-2">
                    {/* <div>
                  <i className="fa-light fa-address-book fs-5" />
                </div> */}
                    {/* <div>
                  <h3>Dial Number:</h3>
                </div> */}
                    <div
                      onClick={() => setAttendShow(false)}
                      style={{ cursor: "pointer" }}
                    >
                      <i className="fa-regular fa-xmark fs-5 text-white" />
                    </div>
                  </div>
                  <div className="mb-2">
                    {/* <span>Outbound ID: (999) 999-9999</span> */}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder=""
                      className="dialerInput"
                      value={attendedTransferNumber}
                      onChange={(e) =>
                        setattendedTransferNumber(e.target.value)
                      }
                    />
                    <buton
                      className="clearButton"
                      style={{ marginLeft: "-30px" }}
                      onClick={() =>
                        setattendedTransferNumber(
                          attendedTransferNumber.slice(0, -1)
                        )
                      }
                    >
                      <i class="fa-light fa-delete-left"></i>
                    </buton>
                  </div>

                  <div className="dialerWrap mt-2">
                    <div
                      className="col-4"
                      onClick={() => {
                        setattendedTransferNumber(attendedTransferNumber + "1");
                      }}
                    >
                      <h4>1</h4>
                      <h6>&nbsp;</h6>
                    </div>
                    <div
                      className="col-4"
                      onClick={() => {
                        setattendedTransferNumber(attendedTransferNumber + "2");
                      }}
                    >
                      <h4>2</h4>
                      <h6>ABC</h6>
                    </div>
                    <div
                      className="col-4"
                      onClick={() => {
                        setattendedTransferNumber(attendedTransferNumber + "3");
                      }}
                    >
                      <h4>3</h4>
                      <h6>DEF</h6>
                    </div>
                    <div
                      className="col-4"
                      onClick={() => {
                        setattendedTransferNumber(attendedTransferNumber + "4");
                      }}
                    >
                      <h4>4</h4>
                      <h6>GHI</h6>
                    </div>
                    <div
                      className="col-4"
                      onClick={() => {
                        setattendedTransferNumber(attendedTransferNumber + "5");
                      }}
                    >
                      <h4>5</h4>
                      <h6>JKL</h6>
                    </div>
                    <div
                      className="col-4"
                      onClick={() => {
                        setattendedTransferNumber(attendedTransferNumber + "6");
                      }}
                    >
                      <h4>6</h4>
                      <h6>MNO</h6>
                    </div>
                    <div
                      className="col-4"
                      onClick={() => {
                        setattendedTransferNumber(attendedTransferNumber + "7");
                      }}
                    >
                      <h4>7</h4>
                      <h6>PQRS</h6>
                    </div>
                    <div
                      className="col-4"
                      onClick={() => {
                        setattendedTransferNumber(attendedTransferNumber + "8");
                      }}
                    >
                      <h4>8</h4>
                      <h6>TUV</h6>
                    </div>
                    <div
                      className="col-4"
                      onClick={() => {
                        setattendedTransferNumber(attendedTransferNumber + "9");
                      }}
                    >
                      <h4>9</h4>
                      <h6>WXYZ</h6>
                    </div>
                    <div
                      className="col-4"
                      onClick={() => {
                        setattendedTransferNumber(attendedTransferNumber + "*");
                      }}
                    >
                      <h4>
                        <i className="fa-light fa-asterisk" />
                      </h4>
                    </div>
                    <div
                      className="col-4"
                      onClick={() => {
                        setattendedTransferNumber(attendedTransferNumber + "0");
                      }}
                    >
                      <h4>0</h4>
                      <h6>+</h6>
                    </div>
                    <div
                      className="col-4"
                      onClick={() => {
                        setattendedTransferNumber(attendedTransferNumber + "#");
                      }}
                    >
                      <h4>
                        <i className="fa-light fa-hashtag" />
                      </h4>
                    </div>

                    <div>
                      <button
                        className="callButton bg-primary"
                        effect="ripple"
                        onClick={handleAttendedTransfer}
                      >
                        <i className="fa-thin fa-phone-arrow-up-right" />
                      </button>
                    </div>
                  </div>
                  {/* <div 
                // onClick={onSubmit}
                >
                <button className="callButton">
                  <i className="fa-thin fa-phone" />
                </button>
              </div> */}
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default OngoingCall;
