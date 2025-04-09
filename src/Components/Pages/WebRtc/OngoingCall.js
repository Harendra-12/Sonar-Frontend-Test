/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSIPProvider, useSessionCall } from "modify-react-sipjs";
import { CallTimer } from "./CallTimer";
import {
  SessionState,
  UserAgent,
  Inviter,
} from "sip.js";
import { toast } from "react-toastify";
import Tippy from "@tippyjs/react";
import Dialpad from "./Dialpad";
import { formatTimeWithAMPM, generalGetFunction } from "../../GlobalFunction/globalFunction";
import Comments from "./Comments";

function OngoingCall({
  setHangupRefresh,
  hangupRefresh,
  setSelectedModule,
  allContact
}) {
  const {
    sessions,
  } = useSIPProvider();
  const dispatch = useDispatch();
  const [dialpadShow, setDialpadShow] = useState(false);
  const account = useSelector((state) => state.account);
  const extension = account?.extension?.extension || "";
  const globalSession = useSelector((state) => state.sessions);
  const callProgressId = useSelector((state) => state.callProgressId);
  const [hideDialpad, setHideDialpad] = useState(false);
  const [attendShow, setAttendShow] = useState(false);
  const [destNumber, setDestNumber] = useState("");
  const [attendedTransferNumber, setattendedTransferNumber] = useState("");
  const [showParkList, setShowParkList] = useState(false);
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [parkingNumber, setParkingNumber] = useState("");
  const [holdProcessing, setHoldProcessing] = useState(false);
  const callProgressDestination = useSelector(
    (state) => state.callProgressDestination
  );
  const [showTranferableList, setShowTranferableList] = useState(false);
  const [showActiveSessions, setShowActiveSessions] = useState(false);
  const {
    isMuted,
    hangup,
    hold,
    mute,
    session,
    unhold,
    unmute,
    timer,
  } = useSessionCall(callProgressId);
  const canHold = session && session._state === SessionState.Established;
  const canMute = session && session._state === SessionState.Established;
  const currentSession = globalSession.find(
    (session) => session.id === callProgressId
  );
  const isOnHeld = currentSession?.state === "OnHold";

  // Listen for parking a call
  useEffect(() => {
    if (parkingNumber != "") {
      handleDigitPress(parkingNumber);
    }
  }, [parkingNumber]);

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
  console.log("Outside hold status", isOnHeld);

  // Logic to toggle hold and unhold
  async function holdCall(type) {
    console.log("Inside hold setp 1");

    if (canHold) {
      console.log("Inside hold setp 2");
      if (type === "hold" && !holdProcessing) {
        setHoldProcessing(true);
        var sessionDescriptionHandlerOptions = session.sessionDescriptionHandlerOptionsReInvite;
        sessionDescriptionHandlerOptions.hold = true;
        session.sessionDescriptionHandlerOptionsReInvite = sessionDescriptionHandlerOptions;
        var options = {
          requestDelegate: {
            onAccept: function () {
              if (session && session.sessionDescriptionHandler && session.sessionDescriptionHandler.peerConnection) {
                var pc = session.sessionDescriptionHandler.peerConnection;
                // Stop all the inbound streams
                pc.getReceivers().forEach(function (RTCRtpReceiver) {
                  if (RTCRtpReceiver.track) RTCRtpReceiver.track.enabled = false;
                });

              }
              session.isOnHold = true;
              dispatch({
                type: "SET_SESSIONS",
                sessions: globalSession.map((item) =>
                  item.id === session.id ? { ...item, state: "OnHold" } : item
                ),
              });
              setHoldProcessing(false);
            },
            onReject: function () {
              session.isOnHold = false;
              setHoldProcessing(false);
            }
          }
        };
        session.invite(options).catch(function (error) {
          session.isOnHold = false;
          console.warn("Error attempting to put the call on hold:", error);
        });

        // console.log("Before hold", isOnHeld);
        // hold();
        // console.log("Done hold", isOnHeld);
        // dispatch({
        //   type: "SET_SESSIONS",
        //   sessions: globalSession.map((item) =>
        //     item.id === session.id ? { ...item, state: "OnHold" } : item
        //   ),
        // });
      } else if (type === "unhold" && !holdProcessing) {
        setHoldProcessing(true);
        let sessionDescriptionHandlerOptions = session.sessionDescriptionHandlerOptionsReInvite;
        sessionDescriptionHandlerOptions.hold = false;
        session.sessionDescriptionHandlerOptionsReInvite = sessionDescriptionHandlerOptions;

        let options = {
          requestDelegate: {
            onAccept: function () {
              if (session?.sessionDescriptionHandler?.peerConnection) {
                let pc = session.sessionDescriptionHandler.peerConnection;

                // Restore inbound streams
                pc.getReceivers().forEach(receiver => {
                  if (receiver.track) receiver.track.enabled = true;
                });

                // Restore outbound streams
                pc.getSenders().forEach(sender => {
                  if (sender.track) {
                    sender.track.enabled = true;
                  }
                });
              }
              session.isOnHold = false;

              dispatch({
                type: "SET_SESSIONS",
                sessions: globalSession.map((item) =>
                  item.id === session.id ? { ...item, state: "Established" } : item
                ),
              });
              setHoldProcessing(false);
            },
            onReject: function () {
              session.isOnHold = true;
              setHoldProcessing(false);
            }
          }
        };

        try {
          session.invite(options);
        } catch (error) {
          console.error(`Error unholding session ${session.id}:`, error);
        }

        //   console.log("Before unhold",isOnHeld);
        //  await unhold();
        //   console.log("Done unhold",isOnHeld);

        // dispatch({
        //   type: "SET_SESSIONS",
        //   sessions: globalSession.map((item) =>
        //     item.id === session.id ? { ...item, state: "Established" } : item
        //   ),
        // });
      }
    } else {
      toast.warn("Call has not been established");
    }
  };

  // Logic to toggle mute and unmute
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

  // Handle attended transfer means we will transfer only to the number which is currently active with the call
  const handleAttendedTransfer = async (e) => {
    e.preventDefault();
    const destNumber = e.target.value;
    if (destNumber.length > 3) {
      const dialog = session.dialog;
      const transferTo = `sip:${destNumber}@${account.domain.domain_name}`;
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
        const replacementSession = new Inviter(
          session.userAgent,
          UserAgent.makeURI(transferTo)
        );
        if (target) {
          // Initiate the refer request
          // const referRequest = dialog.refer(replacementSession);
          const referRequest = dialog.refer(replacementSession, {
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
    } else {
      toast.error("Invalid destination number");
    }
  };

  // Handle blind trasfer means we will transfer call to any number without user interaction
  const handleAttendedBlindTransfer = async (e) => {
    // e.preventDefault();
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
    } else {
      toast.error("Invalid destination number");
    }
  };

  // Function to merge two sessions
  const handleMergeCall = async (sessionIds) => {
    setShowActiveSessions(!showActiveSessions)
    const activeSessions = sessionIds.map(id => sessions[id]).filter(Boolean);
    if (activeSessions.length < 2) {
      console.error("At least two sessions are required to merge.");
      return;
    } else {
      toast.success("Call Merged");
    }

    // This variable is define to store audio streams
    let audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // This variable is define to catch all stream inbound and outbound
    let remoteStreams = new Map();

    // This variable is define to catch all stream inbound to play audio for the user whose merge the call
    let localStreams = new Map();

    // Unhold each session before merging
    await Promise.all(activeSessions.map(async (session) => {
      let sessionDescriptionHandlerOptions = session.sessionDescriptionHandlerOptionsReInvite;
      sessionDescriptionHandlerOptions.hold = false;
      session.sessionDescriptionHandlerOptionsReInvite = sessionDescriptionHandlerOptions;

      let options = {
        requestDelegate: {
          onAccept: function () {
            if (session?.sessionDescriptionHandler?.peerConnection) {
              let pc = session.sessionDescriptionHandler.peerConnection;

              // Restore inbound streams
              pc.getReceivers().forEach(receiver => {
                if (receiver.track) receiver.track.enabled = true;
              });

              // Restore outbound streams
              pc.getSenders().forEach(sender => {
                if (sender.track) {
                  sender.track.enabled = true;
                }
              });
            }
            session.isOnHold = false;
          },
          onReject: function () {
            session.isOnHold = true;
          }
        }
      };

      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Delay before sending re-INVITE
        session.invite(options);
      } catch (error) {
        console.error(`Error unholding session ${session.id}:`, error);
      }
    }));

    try {
      const myAudioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Retrieve remote audio streams for each session
      activeSessions.forEach((session) => {

        let remoteStream = new MediaStream();
        session.sessionDescriptionHandler.peerConnection.getReceivers().forEach((receiver) => {
          if (receiver.track && receiver.track.kind === "audio") {
            remoteStream.addTrack(receiver.track);
          }
        });
        remoteStreams.set(session.id, remoteStream);
        if (session.incomingInviteRequest) {
          localStreams.set(session.id, remoteStream);
        }
      });

      // **Function to mix ONLY inbound (remote) audio streams**
      function mixInboundAudioStreams() {
        const destination = audioContext.createMediaStreamDestination();

        // Add all remote streams (inbound audio only)
        localStreams.forEach((stream) => {
          const sourceRemote = audioContext.createMediaStreamSource(stream);
          sourceRemote.connect(destination);
        });
        return destination.stream;
      }

      // **PLAYBACK: Play the inbound mixed audio locally (without microphone)**
      function playInboundMixedAudio() {
        const mixedInboundStream = mixInboundAudioStreams();
        const inboundAudioElement = new Audio();
        inboundAudioElement.srcObject = mixedInboundStream;
        inboundAudioElement.autoplay = true;
        inboundAudioElement.play();
      }

      // Call this function to play only inbound audio
      playInboundMixedAudio();

      // **Function to mix audio streams for sending (Excludes own session's remote audio)**
      function mixAudioStreams(excludeSessionId = null) {
        const destination = audioContext.createMediaStreamDestination();

        // Add user's microphone to the mixed stream
        const sourceMyAudio = audioContext.createMediaStreamSource(myAudioStream);
        sourceMyAudio.connect(destination);

        // Add all remote streams except the one that should be excluded
        remoteStreams.forEach((stream, sessionId) => {
          if (sessionId !== excludeSessionId) {
            const sourceRemote = audioContext.createMediaStreamSource(stream);
            sourceRemote.connect(destination);
          }
        });
        return destination.stream;
      }

      // Send mixed audio to each session
      activeSessions.forEach((session) => {
        const mixedStream = mixAudioStreams(session.id); // Exclude their own remote stream but include mic
        if (!mixedStream || mixedStream.getAudioTracks().length === 0) {
          console.error("No valid mixed stream to send.");
          return;
        }

        const mixedAudioTrack = mixedStream.getAudioTracks()[0];

        session.sessionDescriptionHandler.peerConnection.getSenders().forEach((sender) => {
          if (sender.track && sender.track.kind === "audio") {
            sender.replaceTrack(mixedAudioTrack);
          }
        });
      });
    } catch (err) {
      console.error("Error during call merging:", err);
    }
  };


  // Function to hide dialpad
  function handleHideDialpad(value) {
    setDialpadShow(value);
  }

  // Logic to transfer call using attendent transfer
  function handleAttendedTransfer2(e) {
    const previosSession = sessions[currentSession.transferableSessionId]
    if (callProgressDestination.length > 3) {
      const dialog = previosSession.dialog;
      const transferTo = `sip:${callProgressDestination}@${account.domain.domain_name}`;

      if (previosSession.state !== "Established") {
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
              hangup();
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
    } else {
      toast.error("Invalid destination number");
    }
  }

  const [duplicateData, setDuplicateData] = useState([]);
  const [showDuplicateData, setShowDuplicateData] = useState(false);

  async function getDuplicateData() {
    let response;

    // Internal Calls wont call the API
    if (globalSession[0].destination.length < 6) {
      return;
    }

    try {
      if (session.outgoingInviteRequest) {
        response = await generalGetFunction(`/cdr-comments-user?destination=${globalSession[0].destination}`)
      } else {
        response = await generalGetFunction(`/cdr-comments-user?source=${globalSession[0].destination}`)
      }
      if (response.status && response.data.length > 0) {
        setDuplicateData(response.data);
        setShowDuplicateData(true);
      }
    } catch (error) {

    }
  }

  useEffect(() => {
    getDuplicateData();
  }, [globalSession])
  return (
    <>
      <div className="audioCall position-relative">
        <div className="container-fluid">
          <div className="row header">
            <div className="col-4"></div>
            <div className="col-4 text-center my-auto">
              <h5 className="duration">
                {timer?.answeredAt && (
                  <CallTimer
                    isEnd={session.state === SessionState.Terminated}
                    startAt={timer.answeredAt}
                  />
                )}
              </h5>
            </div>
            <div className="col-4 d-none d-xl-flex justify-content-end">
              <button
                className="clearButton"
                onClick={() => setSelectedModule("callDetails")}
              >
                <i className="fa-regular fa-horizontal-rule text-white"></i>
              </button>
            </div>
            <div className="user">
              <div className="my-auto">
                <div id="userCallerProfile">
                  <div className="userHolder col-12">
                    <i className="fa-solid fa-user" />
                  </div>
                  <div className="col-12 text-center">
                    <h3 className="number">{callProgressDestination}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row footer">
            {showTranferableList && (
              <div className="parkList">
                <select
                  defaultValue={""}
                  className="formItem"
                  onChange={(e) => handleAttendedTransfer(e)}
                >
                  <option className="" disabled value={""}>
                    Select to Transfer
                  </option>

                  {globalSession.map((item, index) => {
                    const isCurrent = item.id === session.id;
                    return (
                      !isCurrent && (
                        <option className="" value={item.destination}>
                          {item.destination}
                        </option>
                      )
                    );
                  })}
                </select>
              </div>
            )}
            {showActiveSessions && (
              <div className="parkList">
                <button className="formItem d-flex justify-content-between align-items-center" onClick={() => setShowActiveSessions(!showActiveSessions)}>
                  Select to Merge call <i className="fa-solid fa-xmark text-danger"></i>
                </button>
                <div className="mergeCallList">
                  <ul>
                    {globalSession.map((item, index) => {
                      const isCurrent = item.id === session.id;
                      return (
                        !isCurrent && <li key={index} >{item.destination} <input type="checkbox" value={item.id}
                          onChange={(e) => {
                            const { checked, value } = e.target;
                            setSelectedSessions((prev) =>
                              checked ? [...prev, value] : prev.filter((id) => id !== value)
                            );
                          }} /></li>
                      )
                    })}
                  </ul>
                  <button onClick={() => handleMergeCall([...selectedSessions, session.id])} ><i className="fa-solid fa-merge me-2"></i> Merge</button>
                </div>


                {/* <select
                  defaultValue={""}
                  className="formItem"
                  onChange={(e) => handleMergeCall(e.target.value)}
                >
                  <option className="" disabled value={""}>
                    Select to Merge call
                  </option>

                  {globalSession.map((item, index) => {
                    const isCurrent = item.id === session.id;
                    return (
                      !isCurrent && (
                        <option key={index} className="" value={item.id}>
                          {item.destination}
                        </option>
                      )
                    );
                  })}
                </select> */}
              </div>
            )}
            {showParkList && (
              <div className="parkList">
                <select
                  defaultValue={""}
                  className="formItem"
                  onChange={(e) => setParkingNumber(e.target.value)}
                >
                  <option className="" disabled value={""}>
                    Select to Park
                  </option>
                  <option className="" value={"*1"}>
                    HR (*1)
                  </option>
                  <option className="" value={"*69"}>
                    Call-return (*69)
                  </option>
                  <option className="" value={"*70"}>
                    DND (*70)
                  </option>
                  <option className="" value={"*870"}>
                    Redial (*870)
                  </option>
                  <option className="" value={"*80"}>
                    Group Delete (*80)
                  </option>
                  <option className="" value={"*81"}>
                    Insertion (*81)
                  </option>
                  <option className="" value={"*4000"}>
                    Voicemail check (*4000)
                  </option>
                  <option className="" value={"*99"}>
                    Direct Voicemail (*99)
                  </option>
                </select>
              </div>
            )}
            <>
              {!currentSession.isTransfer ? (
                <>
                  <Tippy content="Mute Microphone">
                    <button
                      onClick={
                        isMuted ? () => muteCall("unmute") : () => muteCall("mute")
                      }
                      className={
                        isMuted ? "appPanelButtonCaller active" : "appPanelButtonCaller"
                      }
                      effect="ripple"
                    >
                      <i
                        className={`fa-solid fa-microphone${isMuted ? "-slash" : ""}`}
                      />
                    </button>
                  </Tippy>
                  <Tippy content="Merge Call">
                    <button
                      onClick={() => { setShowActiveSessions(!showActiveSessions); setAttendShow(false); setShowTranferableList(false); setShowParkList(false); setSelectedSessions([]) }}
                      className={` ${showActiveSessions
                        ? "appPanelButtonCaller active"
                        : "appPanelButtonCaller"
                        } `}
                      effect="ripple"
                    >
                      <i className="fa-solid fa-merge"></i>
                    </button>
                  </Tippy>
                  <Tippy content="Toggle Dialpad">
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
                      <i className="fa-solid fa-grid" />
                    </button>
                  </Tippy>
                  <Tippy content="Attendant Transfer">
                    <button
                      className={` ${showTranferableList
                        ? "appPanelButtonCaller active"
                        : "appPanelButtonCaller"
                        } `}
                      effect="ripple"
                      onClick={() => { setDialpadShow(true); setAttendShow(false); setShowActiveSessions(false); setShowParkList(false); }}
                    >
                      {/* <i className="fa-solid fa-user-plus" /> */}
                      <i className="fa fa-exchange" aria-hidden="true"></i>
                    </button>
                  </Tippy>
                  <Tippy content="Blind Transfer">
                    <button
                      className={` ${attendShow
                        ? "appPanelButtonCaller active"
                        : "appPanelButtonCaller"
                        } `}
                      effect="ripple"
                      onClick={() => {
                        setAttendShow(!attendShow);
                        setShowTranferableList(false);
                        setShowActiveSessions(false);
                        setShowParkList(false);
                      }}
                    >
                      <i className="fa-solid fa-phone-arrow-up-right" />
                    </button>
                  </Tippy>
                  <Tippy content="Park Call">
                    <button
                      className={` ${showParkList
                        ? "appPanelButtonCaller active"
                        : "appPanelButtonCaller"
                        } `}
                      effect="ripple"
                      onClick={() => { setShowParkList(!showParkList); setAttendShow(false); setShowActiveSessions(false); setShowTranferableList(false); }}
                    >
                      P
                    </button>
                  </Tippy>
                  <Tippy content="Hold Call">
                    <button
                      // onClick={isHeld ? unhold : hold}
                      onClick={
                        isOnHeld ? () => holdCall("unhold") : () => holdCall("hold")
                      }
                      className={
                        isOnHeld
                          ? "appPanelButtonCaller active"
                          : "appPanelButtonCaller"
                      }
                      effect="ripple"
                    >
                      <i className="fa-solid fa-pause" />
                    </button>
                  </Tippy>
                  <Tippy content="Hang Up">
                    <button
                      onClick={() => {
                        hangup();
                        setHangupRefresh(hangupRefresh + 1);
                        setSelectedModule("callDetails");
                      }}
                      className="appPanelButtonCaller bg-danger"
                      effect="ripple"
                    >
                      <i className="fa-solid fa-phone-hangup text-white" />
                    </button>
                  </Tippy>
                </>
              ) : (
                <>
                  <div className="mt-5" />
                  <Tippy content="Transfer call">
                    <button
                      className="appPanelButtonCaller"
                      effect="ripple"
                      onClick={handleAttendedTransfer2}
                    >
                      <i className="fa-solid fa-phone-arrow-up-right" />
                    </button>
                  </Tippy>
                  {/* <Tippy content="Merge Call">
                    <button
                      onClick={() => { setShowActiveSessions(!showActiveSessions); setAttendShow(false); setShowTranferableList(false); setShowParkList(false); setSelectedSessions([]) }}
                      className={` ${showActiveSessions
                        ? "appPanelButtonCaller active"
                        : "appPanelButtonCaller"
                        } `}
                      effect="ripple"
                    >
                      <i className="fa-solid fa-merge"></i>
                    </button>
                  </Tippy> */}
                  <Tippy content="Hang Up">
                    <button
                      className="appPanelButtonCaller bg-danger"
                      effect="ripple"
                      onClick={() => {
                        hangup();
                        setHangupRefresh(hangupRefresh + 1);
                        setSelectedModule("callDetails");
                      }}
                    >
                      <i className="fa-solid fa-phone-hangup text-white" />
                    </button>
                  </Tippy>
                </>
              )}
            </>
          </div>
        </div>
        {hideDialpad ? (
          <div id="dialPad" className="inCall">
            <div className="container h-100">
              <div className="row align-items-center justify-content-center h-100">
                <div className="col-10 dialPadContainer p-2">
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
                  <i className="fa-solid fa-phone" />
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
                <div className="col-10 dialPadContainer p-2">
                  <div className="d-flex justify-content-end pt-1 pb-1 px-2">
                    <div
                      onClick={() => setAttendShow(false)}
                      style={{ cursor: "pointer" }}
                    >
                      <i className="fa-regular fa-xmark fs-5 text-white" />
                    </div>
                  </div>
                  <div className="mb-2">
                  </div>
                  <div className="">
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
                      <i className="fa-light fa-delete-left"></i>
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
                        onClick={() => handleAttendedBlindTransfer()}
                      >
                        <i className="fa-solid fa-phone-arrow-up-right" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      {showDuplicateData &&
        <ShowDuplicateCallData duplicateData={duplicateData} />
      }
      {
        dialpadShow && (
          <Dialpad
            hideDialpad={handleHideDialpad}
            setSelectedModule={setSelectedModule}
            isMicOn={true}
            isTransfer={true}
            transferableSessionId={callProgressId}
            allContact={allContact}
          />
        )
      }

    </>
  );
}

export default OngoingCall;

// Duplicate Data Component
export function ShowDuplicateCallData({ duplicateData }) {
  const [collapse, setCollapse] = useState(false);
  const [showKeys, setShowKeys] = useState([
    "Call-Direction",
    "variable_sip_from_user",
    // "tag",
    // "application_state",
    // "application_state_to_ext",
    "e_name",
    "Date",
    "Time",
    // "recording_path",
    "variable_billsec",
    // "Hangup-Cause",
    // "variable_DIALSTATUS"
  ]);
  // Comments Modal Variables
  const [selectedId, setSelectedId] = useState();
  const [showComment, setShowComment] = useState(false);

  // Get Duplicate Data for the Caller / Callee
  function getCallIcon(item) {
    const callIcons = {
      inbound: {
        icon:
          item.variable_DIALSTATUS === "Missed"
            ? "fa-solid fa-phone-missed"
            : "fa-phone-arrow-down-left",
        color:
          item.variable_DIALSTATUS === "Missed"
            ? "var(--funky-boy4)"
            : "var(--funky-boy3)",
        label: "Inbound",
      },
      outbound: {
        icon:
          item.variable_DIALSTATUS === "Missed"
            ? "fa-solid fa-phone-missed"
            : "fa-phone-arrow-up-right",
        color:
          item.variable_DIALSTATUS === "Missed"
            ? "var(--funky-boy4)"
            : "var(--color3)",
        label: "Outbound",
      },
      internal: {
        icon:
          item.variable_DIALSTATUS === "Missed"
            ? "fa-solid fa-phone-missed"
            : "fa-headset",
        color:
          item.variable_DIALSTATUS === "Missed"
            ? "var(--funky-boy4)"
            : "var(--color2)",
        label: "Internal",
      },
    };

    return callIcons[item["Call-Direction"]] || callIcons.internal;
  }

  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}:${secs}`;
  }

  const handelOpenNotes = (id) => {
    setSelectedId(id);
    setShowComment(true);
  }
  return (
    <>
      <div className="duplicateBody">
        <div className="duplicateWrapper" style={{ width: collapse ? '0' : '700px' }}>
          <div className="overviewTableWrapper p-2">
            <div className="overviewTableChild border-0 shadow-none">
              <div className="col-xl-12">
                <div className="heading p-0 border-0" style={{ whiteSpace: 'nowrap' }}>
                  <h5>Duplicate Call Data</h5>
                </div>
                <div className="tableContainer m-0 p-0">
                  <table>
                    <thead>
                      <th>#</th>
                      {showKeys.map((key) => {
                        let headerText = key; // Default to the key itself

                        switch (key) {
                          case "Call-Direction":
                            headerText = "Call Direction";
                            break;
                          case "Caller-Orig-Caller-ID-Name":
                            headerText = "Caller No.";
                            break;
                          case "variable_sip_from_user":
                            headerText = "Caller No.";
                            break;
                          case "tag":
                            headerText = "Tag";
                            break;
                          case "application_state":
                            headerText = "Via/Route";
                            break;
                          case "application_state_to_ext":
                            headerText = "Ext/Dest";
                            break;
                          case "e_name":
                            headerText = "User Name"; // or whatever mapping is needed
                            break;
                          case "Date":
                            headerText = "Date";
                            break;
                          case "Time":
                            headerText = "Time";
                            break;
                          // case "recording_path":
                          //   headerText = "Recordings";
                          //   break;
                          case "variable_billsec":
                            headerText = "Duration";
                            break;
                          case "Hangup-Cause":
                            headerText = "Hangup Cause";
                            break;
                          default:
                          case "variable_DIALSTATUS":
                            headerText = "Hangup Status"
                            break;
                        }

                        return <th key={key}>{headerText}</th>;
                      })}
                      <th>Note</th>
                    </thead>
                    <tbody>
                      {duplicateData?.map((call, index) => {
                        const callIcon = getCallIcon(call); // Call the getCallIcon function
                        return <React.Fragment key={index}>
                          <tr
                          >
                            <td>
                              {index + 1}
                            </td>
                            {showKeys.map((key, keyIndex) => {
                              if (key === "Call-Direction") {
                                return (
                                  <td>
                                    <i
                                      className={`fa-solid ${callIcon.icon} me-1`}
                                      style={{ color: callIcon.color }}
                                    ></i>
                                    {callIcon.label}
                                  </td>
                                );
                              } else if (key === "e_name") {
                                return <td >{call["e_name"]}</td>;
                              } else if (key === "variable_sip_from_user") {
                                return <td >{call["variable_sip_from_user"]}</td>;
                              } else if (key === "tag") {
                                return <td >{call["tag"]}</td>;
                              } else if (key === "application_state") {
                                return <td>
                                  {[
                                    "intercept",
                                    "eavesdrop",
                                    "whisper",
                                    "barge",
                                  ].includes(
                                    call["application_state"]
                                  )
                                    ? call[
                                    "other_leg_destination_number"
                                    ]
                                    : call[
                                    "Caller-Callee-ID-Number"
                                    ]}{" "}
                                  {call[
                                    "application_state_name"
                                  ] &&
                                    `(${call["application_state_name"]})`}
                                </td>
                              } else if (key === "application_state_to_ext") {
                                return <td>{call["application_state_to_ext"]}</td>;
                              } else if (key === "Date") {
                                return <td >{call["variable_start_stamp"]?.split(" ")[0]}</td>;
                              } else if (key === "Time") {
                                const time = formatTimeWithAMPM(call["variable_start_stamp"]?.split(" ")[1])
                                return <td >{time}</td>;
                              }
                              else if (key === "variable_billsec") {
                                return <td>{formatTime(call["variable_billsec"])}</td>;
                              } else if (key === "Hangup-Cause") {
                                return <td>{call["Hangup-Cause"]}</td>
                              }
                              else {
                                return <td>{call[key]}</td>
                              }
                            })}
                            <td>
                              <button
                                className="tableButton"
                                onClick={() => handelOpenNotes(call?.id)}
                              >
                                <i className="fa-solid fa-comment-dots"></i>
                              </button>
                            </td>
                          </tr>
                        </React.Fragment>
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button className="tableButton edit"
          onClick={() => setCollapse(!collapse)}
          style={{ position: 'absolute', right: '-35px', top: '50%', transform: 'translateY(-50%)' }}
        >
          <i className={`fa-solid fa-chevron-${collapse ? 'right' : 'left'}`} />
        </button>
      </div>
      {showComment && <Comments id={selectedId} setId={setSelectedId} setShowComment={setShowComment} webrtc={true} />}
    </>
  )
}
