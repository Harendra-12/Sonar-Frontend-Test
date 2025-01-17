import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSessionCall } from "react-sipjs";
import { toast } from "react-toastify";
import { UserAgent } from "sip.js";
import ringtone from "../../assets/music/cellphone-ringing-6475.mp3";

function IncomingCallPopup({
  sessionId,
  lastIncomingCall,
  setSelectedModule,
  setactivePage,
  isMicOn,
  isVideoOn,
}) {
  const [isMinimized, setIsMinimized] = useState(true);
  const account = useSelector((state) => state.account);
  const extension = account?.extension?.extension || "";
  const { decline, answer, session } = useSessionCall(sessionId);
  const dispatch = useDispatch();
  const globalSession = useSelector((state) => state.sessions) || {};
  const [blindTransferNumber, setBlindTransferNumber] = useState("");
  const [attendShow, setAttendShow] = useState(false);
  const [audio] = useState(new Audio(ringtone)); // Initialize the Audio object
  const dummySession = useSelector((state) => state.dummySession);
  const [muteAudio, setMuteAudio] = useState(false);
  useEffect(() => {
    const audio = new Audio(ringtone);
    audio.loop = true;

    if (!muteAudio) {
      audio.play();
    } else {
      audio.pause();
    }

    return () => {
      audio.pause();
      audio.currentTime = 0; // Reset audio position to the start when component unmounts
    };
  }, [muteAudio]);
  useEffect(() => {
    if (!lastIncomingCall) {
      setIsMinimized(true);
    }
  }, [lastIncomingCall]);

  useEffect(() => {
    // Check if the sessionId is already present in globalSession
    const sessionExists = globalSession.some(
      (session) => session.id === sessionId
    );

    if (!sessionExists && sessionId !== dummySession) {
      dispatch({
        type: "SET_SESSIONS",
        sessions: [
          ...globalSession,
          {
            id: sessionId,
            destination: callerExtension,
            mode: "audio",
            state: "Incoming",
          },
        ],
      });
    }
  }, [sessionId, globalSession]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter" && lastIncomingCall) {
        handleAnswerCall("audio");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lastIncomingCall]);

  const callerExtension = session.incomingInviteRequest
    ? session?.incomingInviteRequest?.message?.from?._displayName
    : session?.outgoingInviteRequest?.message?.to?.uri?.normal?.user;

  const handleAnswerCall = async (mode) => {
    // e.preventDefault();
    if (!isMicOn) {
      toast.warn("Please turn on microphone");
      return;
    }
    const devices = await navigator.mediaDevices.enumerateDevices();
    const hasVideoInput = devices.some(
      (device) => device.kind === "videoinput"
    );

    if (mode === "video" && !hasVideoInput) {
      //need to check here if webcam is available or not ,
      //otherwise it will send 480-temporarily unavailable
      toast.warn("No webcam detected. Answering as audio call.");
      mode = "audio"; // Fallback to audio if no webcam is available
    }
    session.accept({
      sessionDescriptionHandlerOptions: {
        constraints: {
          audio: true,
          video: mode === "video" ? true : false,
        },
      },
    });

    // if mode is video then set_session mode changed to video in extesting session

    if (mode === "video") {
      dispatch({
        type: "SET_MINIMIZE",
        minimize: false,
      });
      const updatedSession = globalSession.find(
        (session) => session.id === sessionId
      );
      if (updatedSession) {
        updatedSession.mode = "video";
        dispatch({
          type: "SET_SESSIONS",
          sessions: [
            ...globalSession.filter((session) => session.id !== sessionId),
            updatedSession,
          ],
        });
      }
    } else {
      const updatedSession = globalSession.find(
        (session) => session.id === sessionId
      );
      if (updatedSession) {
        updatedSession.state = "Established";
        dispatch({
          type: "SET_SESSIONS",
          sessions: [
            ...globalSession.filter((session) => session.id !== sessionId),
            updatedSession,
          ],
        });
      }
    }

    setSelectedModule("onGoingCall");
    // setactivePage("call");
    dispatch({
      type: "SET_CALLPROGRESSID",
      callProgressId: sessionId,
    });
    dispatch({
      type: "SET_VIDEOCALL",
      videoCall: mode === "video" ? true : false,
    });
    dispatch({
      type: "SET_CALLPROGRESSDESTINATION",
      callProgressDestination: callerExtension,
    });
    dispatch({
      type: "SET_CALLPROGRESS",
      callProgress: mode === "audio" ? true : false,
    });
  };

  const handleBlindTransfer = (e) => {
    e.preventDefault();

    if (!isMicOn) {
      toast.warn("Please turn on microphone");
      return;
    }

    if (blindTransferNumber.length > 3) {
      if (session.state === "Initial") {
        answer().then(() => {
          const dialog = session.dialog;
          const transferTo = `sip:${blindTransferNumber}@${account.domain.domain_name}`;

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
        });
      } else {
        toast.warn("cannot transfer call: session is not established");
      }
    } else {
      toast.warn("Invalid destination number");
    }
  };

  // Handle auto answer for intercept, barge and merge calls
  useEffect(() => {
    if (session.incomingInviteRequest) {
      if (session?.incomingInviteRequest?.message?.headers?.["X-Call-Type"]?.[0]?.["raw"] === "auto_answered") {
        handleAnswerCall("audio")
      }
    }
  }, [session])
  console.log("Sessionasasasa", session);


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
              <button
                class="callButton"
                onClick={() => handleAnswerCall("audio")}
              >
                <i class="fa-duotone fa-phone"></i>
              </button>
              {isVideoOn && (
                <button
                  class="callButton"
                  onClick={() => handleAnswerCall("video")}
                >
                  <i class="fa-duotone fa-video"></i>
                </button>
              )}
              <button class="callButton hangup" onClick={decline}>
                <i class="fa-duotone fa-phone-hangup"></i>
              </button>
            </div>
            <div>
              <button
                className="callButton bg-primary"
                effect="ripple"
                onClick={() => {
                  setAttendShow(true);
                  setIsMinimized(true);
                }}
              >
                <i className="fa-thin fa-phone-arrow-up-right" />
              </button>
            </div>
            {/* <div>
              <input
                type="text"
                value={blindTransferNumber}
                onChange={(e) => setBlindTransferNumber(e.target.value)}
              ></input>
              <button onClick={handleBlindTransfer}>Transfer</button>
            </div> */}
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
        // style={{
        //   marginBottom: topPosition,
        // }}
        >
          <div className="campaignInfoWrapper">
            <div className="campaignContent">
              <h5>Outbound Campaign</h5>
              <h4>Campaign Name Hello Hello</h4>
              <p>Aliqua ipsum ipsum ea et irure laboris deserunt sint nostrud officia id aliquip fugiat elit. Cupidatat deserunt veniam quis nulla ea sint reprehenderit eiusmod non consequat id qui ex.</p>
            </div>
            <div className="leadContent">
              <label>Name</label>
              <p>John Doe</p>
              <label>Number</label>
              <p>+1 999 999 9999</p>
              <label>Address</label>
              <p>John Doe</p>
            </div>
          </div>
          <div className="user">
            <div className="userInfo text-start my-0 px-2 d-flex justify-content-between">
              <div>
                <h5>Incoming Call...</h5>
                <h4>{callerExtension}</h4>
              </div>
              <div>
                <button className="clearButton2" onClick={() => setMuteAudio(!muteAudio)}><i class={muteAudio ? "fa-regular fa-volume-xmark" : "fa-regular fa-volume"}></i></button>
              </div>
            </div>
            <div className="controls px-2">
              <button
                class="callButton"
                onClick={() => handleAnswerCall("audio")}
              >
                <i class="fa-solid fa-phone"></i>
                <div class="circle1"></div>
                <div class="circle2"></div>
              </button>
              <button
                className="callButton bg-primary"
                onClick={() => {
                  setAttendShow(true);
                  setIsMinimized(true);
                }}
              >
                <i className="fa-thin fa-phone-arrow-up-right" />
              </button>
              <button class="callButton hangup" onClick={decline}>
                <i class="fa-solid fa-phone-hangup"></i>
              </button>
              {isVideoOn && (
                <button
                  class="callButton"
                  onClick={() => handleAnswerCall("video")}
                >
                  <i class="fa-solid fa-video" style={{ color: '#ff9b00' }}></i>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {attendShow ? (
        <div id="dialPad" className="inCall">
          <div className="container h-100">
            <div className="row align-items-center justify-content-center h-100">
              <div className="col-xxl-3 col-xl-4 col-md-6 col-11 dialPadContainer p-2">
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
                    value={blindTransferNumber}
                    onChange={(e) => setBlindTransferNumber(e.target.value)}
                  />
                  <buton
                    className="clearButton"
                    style={{ marginLeft: "-30px" }}
                    onClick={() =>
                      setBlindTransferNumber(blindTransferNumber.slice(0, -1))
                    }
                  >
                    <i class="fa-light fa-delete-left"></i>
                  </buton>
                </div>

                <div className="dialerWrap mt-2">
                  <div
                    className="col-4"
                    onClick={() => {
                      setBlindTransferNumber(blindTransferNumber + "1");
                    }}
                  >
                    <h4>1</h4>
                    <h6>&nbsp;</h6>
                  </div>
                  <div
                    className="col-4"
                    onClick={() => {
                      setBlindTransferNumber(blindTransferNumber + "2");
                    }}
                  >
                    <h4>2</h4>
                    <h6>ABC</h6>
                  </div>
                  <div
                    className="col-4"
                    onClick={() => {
                      setBlindTransferNumber(blindTransferNumber + "3");
                    }}
                  >
                    <h4>3</h4>
                    <h6>DEF</h6>
                  </div>
                  <div
                    className="col-4"
                    onClick={() => {
                      setBlindTransferNumber(blindTransferNumber + "4");
                    }}
                  >
                    <h4>4</h4>
                    <h6>GHI</h6>
                  </div>
                  <div
                    className="col-4"
                    onClick={() => {
                      setBlindTransferNumber(blindTransferNumber + "5");
                    }}
                  >
                    <h4>5</h4>
                    <h6>JKL</h6>
                  </div>
                  <div
                    className="col-4"
                    onClick={() => {
                      setBlindTransferNumber(blindTransferNumber + "6");
                    }}
                  >
                    <h4>6</h4>
                    <h6>MNO</h6>
                  </div>
                  <div
                    className="col-4"
                    onClick={() => {
                      setBlindTransferNumber(blindTransferNumber + "7");
                    }}
                  >
                    <h4>7</h4>
                    <h6>PQRS</h6>
                  </div>
                  <div
                    className="col-4"
                    onClick={() => {
                      setBlindTransferNumber(blindTransferNumber + "8");
                    }}
                  >
                    <h4>8</h4>
                    <h6>TUV</h6>
                  </div>
                  <div
                    className="col-4"
                    onClick={() => {
                      setBlindTransferNumber(blindTransferNumber + "9");
                    }}
                  >
                    <h4>9</h4>
                    <h6>WXYZ</h6>
                  </div>
                  <div
                    className="col-4"
                    onClick={() => {
                      setBlindTransferNumber(blindTransferNumber + "*");
                    }}
                  >
                    <h4>
                      <i className="fa-light fa-asterisk" />
                    </h4>
                  </div>
                  <div
                    className="col-4"
                    onClick={() => {
                      setBlindTransferNumber(blindTransferNumber + "0");
                    }}
                  >
                    <h4>0</h4>
                    <h6>+</h6>
                  </div>
                  <div
                    className="col-4"
                    onClick={() => {
                      setBlindTransferNumber(blindTransferNumber + "#");
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
                      onClick={handleBlindTransfer}
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
    </>
  );
}

export default IncomingCallPopup;
