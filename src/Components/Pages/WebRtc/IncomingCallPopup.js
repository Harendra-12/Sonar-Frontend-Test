/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSessionCall } from "modify-react-sipjs";
import { toast } from "react-toastify";
import { UserAgent } from "sip.js";
import ringtone from "../../assets/music/cellphone-ringing-6475.mp3";

function IncomingCallPopup({
  sessionId,
  lastIncomingCall,
  setSelectedModule,
  isMicOn,
  isVideoOn,
  audioRef,
  audio,
  gainNodeRef
}) {
  const state = useSelector((state) => state);
  const previewDialer = useSelector((state) => state.previewDialer);
  const volume = state?.volume;

  const [isMinimized, setIsMinimized] = useState(true);
  const account = useSelector((state) => state.account);
  const extension = account?.extension?.extension || "";
  const { decline, answer, session } = useSessionCall(sessionId);
  const dispatch = useDispatch();
  const globalSession = useSelector((state) => state.sessions) || {};
  const [blindTransferNumber, setBlindTransferNumber] = useState("");
  const [attendShow, setAttendShow] = useState(false);
  const dummySession = useSelector((state) => state.dummySession);
  const [muteAudio, setMuteAudio] = useState(false);

  useState(() => {
    gainNodeRef.current.gain.value = volume
    audioRef.current.volume = volume
  }, [volume])

  useEffect(() => {
    audioRef.current = audio
    audio.loop = true;
    gainNodeRef.current.gain.value = Number.isFinite(volume) ? volume : 1;
    audioRef.current.volume = Number.isFinite(volume) ? volume : 1;


    if (!muteAudio) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }

    return () => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Reset audio position to the start when component unmounts
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

    // If a call is already established, then set incoming call to mute
    if (globalSession?.length > 1) {
      setMuteAudio(true);
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

  const callerExtension = session.incomingInviteRequest?.message?.from?.uri?.normal?.user;
  const displayName = session.incomingInviteRequest?.message?.from?._displayName;

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
                },
                onReject: () => {
                },
              };
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

        // In case of call transfer by any other extension then it is auto answered
      } else if (session?.incomingInviteRequest?.message?.headers?.["Referred-By"]?.length === 1) {
        handleAnswerCall("audio")
      }
    }
    // Handle incoming call notification and answer the call
    if (document.hidden && Notification.permission === 'granted') {
      const notification = new Notification('Incoming Call', {
        body: `Incoming Call from: ${displayName} ${callerExtension}`,
        icon: '/compLogo.png', // Optional: Add an icon
      });
      notification.onclick = function (event) {
        handleAnswerCall("audio")
        window.focus();
        return;
      }
    }
  }, [session])


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
                className="callButton"
                onClick={() => handleAnswerCall("audio")}
              >
                <i className="fa-duotone fa-phone"></i>
              </button>
              {isVideoOn && (
                <button
                  className="callButton"
                  onClick={() => handleAnswerCall("video")}
                >
                  <i className="fa-duotone fa-video"></i>
                </button>
              )}
              <button className="callButton hangup" onClick={decline}>
                <i className="fa-duotone fa-phone-hangup"></i>
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
            <button className="whiteCircleBtn" onClick={() => setIsMinimized(true)}>
              <i className="fa-solid fa-dash"></i>
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
          {/* Preview dialer */}
          {previewDialer.map((item) => {
            if ((item.phone_code + item.phone_number) == session.incomingInviteRequest?.message?.from?.uri?.normal?.user) {
              return (
                <div className="campaignInfoWrapper">
                  <div className="campaignContent">
                    <h5>{item.phone_number}</h5>
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                  <div className="leadContent">
                    <label>{item.first_name + " " + item.last_name}</label>
                    <p>{item.address1}</p>
                    <label>{item.city}</label>
                    <p>{item.state}</p>
                  </div>
                </div>
              )
            }
          })}

          <div className="user">
            <div className="userInfo text-start my-0 px-2 d-flex justify-content-between">
              <div>
                <h5>Incoming Call...</h5>
                <h4>{callerExtension}</h4>
              </div>
              <div>
                <button className="clearButton2" onClick={() => setMuteAudio(!muteAudio)}><i className={muteAudio ? "fa-regular fa-volume-xmark" : "fa-regular fa-volume"}></i></button>
              </div>
            </div>
            <div className="controls px-2">
              <button
                className="callButton"
                onClick={() => handleAnswerCall("audio")}
              >
                <i className="fa-solid fa-phone"></i>
                <div className="circle1"></div>
                <div className="circle2"></div>
              </button>
              {/* <button
                className="callButton bg-primary"
                onClick={() => {
                  setAttendShow(true);
                  setIsMinimized(true);
                }}
              >
                <i className="fa-thin fa-phone-arrow-up-right" />
              </button> */}
              <button className="callButton hangup" onClick={decline}>
                <i className="fa-solid fa-phone-hangup"></i>
              </button>
              {isVideoOn && (
                <button
                  className="callButton"
                  onClick={() => handleAnswerCall("video")}
                >
                  <i className="fa-solid fa-video" style={{ color: '#ff9b00' }}></i>
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
                    <i className="fa-light fa-delete-left"></i>
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
