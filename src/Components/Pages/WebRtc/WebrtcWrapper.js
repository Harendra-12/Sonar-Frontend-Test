/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import Call from "./Call";
import AllContact from "./AllContact";
import CallCenter from "./CallCenter";
import AllVoicemails from "./AllVoicemails";
import OngoingCall from "./OngoingCall";
import CallDashboard from "./CallDashboard";
import EFax from "./EFax";
import { useSelector, useDispatch } from "react-redux";
import ActiveCallSidePanel from "./ActiveCallSidePanel";
import { SIPProvider, useSIPProvider } from "modify-react-sipjs";
import IncomingCalls from "./IncomingCalls";
import { SipRegister } from "./SipRegister";
import SideNavbarApp from "./SideNavbarApp";
import Messages from "./Messages";
import VideoCall from "./VideoCall";
import { ConferenceCall } from "./Conference/ConferenceCall";
import ConferenceTest from "./Conference/ConferenceTest";
import { Rnd } from "react-rnd";
import ConferenceConfig from "./Conference/ConferenceConfig";
import Email from "./Email";
import MailSettings from "../MailSettings/MailSettings";
import { generalGetFunction, useDebounce } from "../../GlobalFunction/globalFunction";
import AgentFeedback from "./AgentFeedback";
import { useNavigate } from "react-router-dom";
import CloseTabWarning from "./CloseTabWarning";
import WhatsAppChatBox from "./whatsappChatbox/WhatsAppChatBox";
import SmsChat from "./SmsChat";
import CampaignLogin from "./CampaignLogin";
import { toast } from "react-toastify";
import Settings from "./Settings";
import ringtone from "../../assets/music/cellphone-ringing-6475.mp3";
import { ActionType } from "../../Redux/reduxActionType";
import InitiateCall from "./LivekitConference/InitiateCall";
import InternalIncomingCall from "./LivekitConference/InternalIncomingCall";

const WebrtcWrapper = () => {
  const baseName = process.env.REACT_APP_BACKEND_BASE_URL;
  const ip = process.env.REACT_APP_BACKEND_IP;
  const token = localStorage.getItem("token");
  const state = useSelector((state) => state);
  const volume = state?.volume;
  const openCallCenterPopUp = useSelector((state) => state.openCallCenterPopUp);
  const navigate = useNavigate();
  const port = process.env.REACT_APP_FREESWITCH_PORT;
  const [size, setSize] = useState({ width: 300, height: 450 });
  const [position, setPosition] = useState({
    x: (window.innerWidth - 300) / 2,
    y: (window.innerHeight - 450) / 2,
  });
  const [interCallSize, setInterCallSize] = useState({
    width: "100vw",
    height: "100vh",
  });
  const [interCallPosition, setInterCallPosition] = useState({ x: 0, y: 0 });
  const [interCallMinimize, setInterCallMinimize] = useState(true);
  const {
    sessions: sipSessions,
    sessionManager,
    connectStatus,
    registerStatus,
  } = useSIPProvider();
  const dispatch = useDispatch();
  const callCenterPopUp = useSelector((state) => state.callCenterPopUp);
  const sessions = useSelector((state) => state.sessions);
  const callProgressId = useSelector((state) => state.callProgressId);
  const videoCall = useSelector((state) => state.videoCall);
  const account = useSelector((state) => state.account);
  const accountDetails = useSelector((state) => state.accountDetails);
  const [hangupRefresh, setHangupRefresh] = useState(0);
  const [selectedModule, setSelectedModule] = useState("");
  const [activePage, setactivePage] = useState("call");
  const isCustomerAdmin = account?.email == accountDetails?.email;
  const extension = account?.extension?.extension || "";
  const [isMicOn, setIsMicOn] = useState(false); // State to track mic status
  const [isVideoOn, setIsVideoOn] = useState(false); // State to track video status
  const [reconnecting, setReconnecting] = useState(0);
  const addContactRefresh = useSelector((state) => state.addContactRefresh);
  const [allContactLoading, setAllContactLoading] = useState(false);
  const [closeVideoCall, setCloseVideoCall] = useState(false);
  const [allContact, setAllContact] = useState([]);
  const [extensionFromCdrMessage, setExtensionFromCdrMessage] = useState();
  const [conferenceToggle, setConferenceToggle] = useState(false);
  const [conferenceId, setConferenceId] = useState("");
  const memberId = useSelector((state) => state.memberId);
  const dummySession = useSelector((state) => state.dummySession);
  const [pin, setPin] = useState("");
  const agentDeposition = useSelector((state) => state.agentDeposition);
  const [initailCallCenterPopup, setInitailCallCenterPopup] = useState(true);
  const callCenterRefresh = useSelector((state) => state.callCenterRefresh);
  const [callCurrentPage, setCallCurrentPage] = useState(1);
  const [isChatLoadedForNextPage, setIsChatLoadedForNextPage] = useState(false)
  const [callstartDate, setCallStartDate] = useState("");
  const [callendDate, setCallEndDate] = useState("");
  const [callsearchQuery, setCallSearchQuery] = useState("");
  const [callclickStatus, setCallClickStatus] = useState("all");
  const refreshCalls = useSelector((state) => state.refreshCalls);
  const [callfilterBy, setCallFilterBy] = useState("date");
  const [callallApiData, setCallAllApiData] = useState([]);
  const [callrawData, setCallRawData] = useState([]);
  const [calldata, setCallData] = useState([]);
  const [callloading, setCallLoading] = useState(true);
  const [isCallLoading, setIsCallLoading] = useState(false);
  const [calling, setCalling] = useState(false);
  const [meetingPage, setMeetingPage] = useState();
  const [toUser, setToUser] = useState(null);
  const [internalCaller, setInternalCaller] = useState(account.id);

  const [recipient, setRecipient] = useState([]);
  const [selectedChat, setSelectedChat] = useState("singleChat");

  const didAll = useSelector((state) => state.didAll);
  const [did, setDid] = useState();

  const audioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const analyserRef = useRef(null);
  const audio = new Audio(ringtone);
   const debouncedSearchTerm = useDebounce(callsearchQuery, 1000);

  useEffect(() => {
    if (!audioCtxRef.current) {
      const audioCtx = new window.AudioContext();
      audioCtxRef.current = audioCtx;

      const track = audioCtx.createMediaElementSource(audio);
      const gainNode = audioCtx.createGain();
      gainNodeRef.current = gainNode;

      track.connect(gainNode).connect(audioCtx.destination);

      // audio.loop = true;
      audioRef.current = audio;
    }
    dispatch({
      type: ActionType?.SET_VOLUME,
      payload: 1,
    });
  }, []);

  // Adjust volume whenever it changes
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = Number.isFinite(volume) ? volume : 1;
      audioRef.current.volume = Number.isFinite(volume) ? volume : 1;
    }
  }, [volume, activePage == "call"]);

  const useWebSocketErrorHandling = (options) => {
    const retryCountRef = useRef(0);
    const connectWebSocket = (retryCount = 0) => {
      const webSocket = new WebSocket(options.webSocketServer);

      webSocket.onopen = () => {
        retryCountRef.current = 0;
      };

      webSocket.onerror = (event) => {
        console.error("WebSocket error:", event);
        if (retryCountRef.current < 3) {
          setTimeout(() => {
            retryCountRef.current += 1;
            // connectWebSocket(retryCount + 1); // retry after 2 secondsy
            connectWebSocket(); // retry after 2 secondsy
            setReconnecting((prev) => prev + 1);
          }, 2000);
        } else {
          console.error("Failed to connect to WebSocket after 3 retries");
        }
      };

      webSocket.onclose = (event) => {
        // if (event.code === 1006) {
        console.error(
          `WebSocket closed ${options.webSocketServer} (code: ${event.code})`
        );
        if (retryCountRef.current < 3) {
          setTimeout(() => {
            retryCountRef.current += 1;
            // connectWebSocket(retryCount + 1); // retry after 2 seconds
            connectWebSocket(); // retry after 2 seconds
            setReconnecting((prev) => prev + 1);
          }, 2000);
        } else {
          console.error("Failed to reconnect to WebSocket after 3 retries");
        }
      };
      // };
    };

    useEffect(() => {
      dispatch({
        type: "SET_CALLCENTERREFRESH",
        callCenterRefresh: callCenterRefresh + 1,
      });
    }, []);

    useEffect(() => {
      connectWebSocket();
    }, [options.webSocketServer]);
  };
  let globalUserAgent = null; // Global reference
  const options = {
    domain: account?.domain?.domain_name,
    webSocketServer: `wss://${ip}:${port}`,
    refVideoRemote: null,
    autoStop:false,
    refAudioRemote: null,
    maxSimultaneousSessions: 1,
    onConnect: (ua) => {
      globalUserAgent = ua; // Store the registered UserAgent
    },
    // webSocketServer: "ws://192.168.2.225:5066",
  };
  useWebSocketErrorHandling(options);

  const checkMicrophoneStatus = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        // Microphone access granted
        setIsMicOn(true);
        // Stop the stream after the check
        stream.getTracks().forEach((track) => track.stop());
      })
      .catch((err) => {
        // Microphone access denied or error occurred
        console.error("Microphone access denied or error:", err);
        setIsMicOn(false);
      });
  };

  const checkVideoStatus = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        // Microphone access granted
        setIsVideoOn(true);
        // Stop the stream after the check
      })
      .catch((err) => {
        // Microphone access denied or error occurred
        console.error("Microphone access denied or error:", err);
        setIsVideoOn(false);
      });
  };

  useEffect(() => {
    checkMicrophoneStatus(); // Check mic status when component mounts
    checkVideoStatus();
    if (!account?.extension?.extension) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    dispatch({
      type: "SET_MINIMIZE",
      minimize: true,
    });
  }, [activePage]);

  useEffect(() => {
    const getContact = async () => {
      setAllContactLoading(true);
      const apiData = await generalGetFunction("/contact/all");
      if (apiData?.status) {
        setAllContact(apiData.data);
        setAllContactLoading(false);
      } else {
        setAllContactLoading(false);
      }
    };
    getContact();
  }, [addContactRefresh]);

  // Function that will check if session contains conference dummy id then remove it
  useEffect(() => {
    const updatedSession = sessions.filter((item) => item.id !== dummySession);
    dispatch({
      type: "SET_SESSIONS",
      sessions: updatedSession,
    });
  }, [dummySession]);

  useEffect(() => {
    const videos = document.querySelectorAll("video:not([class])");
    videos.forEach((video) => {
      video.style.display = "none";
    });
  }, []);

  useEffect(() => {
    sessionStorage.setItem("tabSession", "active");

    const handleBeforeUnload = (event) => {
      if (sessionStorage.getItem("tabSession") === "active") {
        event.preventDefault();
        event.returnValue = ""; // Show confirmation popup
      }
    };

    const handlePageHide = (event) => {
      // ✅ Check if it's a refresh
      if (event.persisted) return; // Browser page restore (skip API)

      const isRefresh =
        performance.getEntriesByType("navigation")[0]?.type === "reload";

      if (
        !isRefresh &&
        sessionStorage.getItem("tabSession") === "active" &&
        token
      ) {
        //API call only on tab close
        fetch(`${baseName}/logout?with_agents`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          keepalive: true,
        }).catch((err) => console.log("API call failed:", err));
        // localStorage.clear();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [token]);

  useEffect(() => {
    async function fetchData() {
      // setCallLoading(true);
      if(hangupRefresh == 0)
      setIsCallLoading(true)
      if (callCurrentPage === 1) {
        // setCallLoading(true);
      } else {
        setIsCallLoading(false);
      }
      const basePaths = {
        all: "/call-details-phone?",
        incoming: "/call-details-phone?inbound",
        outgoing: "/call-details-phone?outbound",
        missed: "/call-details-phone?missed",
      };
      const basePath = basePaths[callclickStatus] || "";
      if (basePath) {
        const dateParam =
          callfilterBy === "date" || callstartDate == "" || callendDate == ""
            ? `date=${callstartDate}`
            : `date_range=${callstartDate},${callendDate}`;
        const url = `${basePath}&page=1&${dateParam}&search=${callsearchQuery}`;
        const apiData = await generalGetFunction(url);

        if (apiData.status) {
          setCallAllApiData(apiData.data.data?.reverse());
          const result = apiData.data.data?.reverse() || [];
          setCallRawData(apiData.data);
          setCallData(result);
          setCallLoading(false);
          setIsCallLoading(false);
        } else {
          setCallLoading(false);
          setIsCallLoading(false);
        }
      }
    }
    fetchData();
  }, [
    callstartDate,
    callendDate,
    debouncedSearchTerm,
    callclickStatus,
    refreshCalls,
  ]);

  useEffect(() => {
    async function fetchData() {
      setIsCallLoading(true)
      if (callCurrentPage === 1) {
        // setCallLoading(true);
        setIsCallLoading(false);
      } else {
        setIsCallLoading(true);
      }
     const basePaths = {
        all: "/call-details-phone?",
        incoming: "/call-details-phone?inbound",
        outgoing: "/call-details-phone?outbound",
        missed: "/call-details-phone?missed",
      };
      const basePath = basePaths[callclickStatus] || "";
      if (basePath) {
        const dateParam =
          callfilterBy === "date" || callstartDate == "" || callendDate == ""
            ? `date=${callstartDate}`
            : `date_range=${callstartDate},${callendDate}`;
        const url = `${basePath}&page=${callCurrentPage}&${dateParam}&search=${callsearchQuery}`;
        const apiData = await generalGetFunction(url);

        if (apiData.status) {
          setCallAllApiData(apiData.data.data?.reverse());
          const result = apiData.data.data?.reverse() || [];
          setCallRawData(apiData.data);
          setCallData([...calldata, ...result]);
          setCallLoading(false);
          setIsCallLoading(false);
        } else {
          setCallLoading(false);
          setIsCallLoading(false);
        }
      }
    }
    fetchData();
  }, [callCurrentPage]);

  // Fetch ALL DID at Page Load
  useEffect(() => {
    if (!did || !didAll) {
      getAllDid();
    } else {
      setDid(didAll.filter((item) => item.usages === "pbx"));
    }
  }, []);

  // Fetch ALL DID
  async function getAllDid() {
    // setLoading(true);
    const apiData = await generalGetFunction(`/did/all?all-dids`);
    if (apiData?.status) {
      setDid(apiData.data.filter((item) => item.usages === "pbx"));
      dispatch({
        type: "SET_DIDALL",
        didAll: apiData.data,
      });
      // setLoading(false);
    } else {
      toast.error(apiData.status);
      // setLoading(false);
    }
  }

  useEffect(() => {
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;

    if (interCallMinimize) {
      setInterCallSize({ width: "100%", height: "100%" });
      setInterCallPosition({ x: screenWidth <= 1366 ? 0 : 650, y: screenWidth <= 1366 ? 0 : 61 });
    } else if (!interCallMinimize) {
      setInterCallSize({
        width: 200,
        height: 200,
      });
      setInterCallPosition({
        x: screenWidth - 300,
        y: screenHeight - (screenWidth <= 1366 ? 300 : 420),
      });
    }
  }, [interCallMinimize]);
  return (
    <>
      <style>
        {`
          body{
            overflow-x: hidden;
          }
      `}
      </style>
      {/* <CloseTabWarning /> */}
      {agentDeposition && <AgentFeedback />}
      <SIPProvider options={options}>
        <SideNavbarApp
          setactivePage={setactivePage}
          activePage={activePage}
          isMicOn={isMicOn}
          isVideoOn={isVideoOn}
          reconnecting={reconnecting}
          SettingsProp={
            <Settings
              audioRef={audioRef}
              audioCtxRef={audioCtxRef}
              gainNodeRef={gainNodeRef}
              analyserRef={analyserRef}
              volume={volume}
              setVolume={{}}
              audio={audio}
            />
          }
        />
        <div className="d-none">
          {extension && <SipRegister options={options} />}
        </div>
        {activePage === "sms-chatbox" && (
          <SmsChat loading={callloading} isLoading={isCallLoading} did={did} />
        )}

        {/* {activePage === "nav-settings" && (
          <Settings
            audioRef={audioRef}
            audioCtxRef={audioCtxRef}
            gainNodeRef={gainNodeRef}
            analyserRef={analyserRef}
            volume={volume}
            setVolume={{}}
            audio={audio}
          />
        )} */}

        {activePage === "call" && (
          <Call
            setHangupRefresh={setHangupRefresh}
            hangupRefresh={hangupRefresh}
            selectedModule={selectedModule}
            setSelectedModule={setSelectedModule}
            isCustomerAdmin={isCustomerAdmin}
            isMicOn={isMicOn}
            isVideoOn={isVideoOn}
            activePage={activePage}
            setactivePage={setactivePage}
            allContact={allContact}
            setExtensionFromCdrMessage={setExtensionFromCdrMessage}
            filterBy={callfilterBy}
            currentPage={callCurrentPage}
            startDate={callstartDate}
            endDate={callendDate}
            searchQuery={callsearchQuery}
            clickStatus={callclickStatus}
            setCallClickStatus={setCallClickStatus}
            refreshCalls={refreshCalls}
            allApiData={callallApiData}
            data={calldata}
            rawData={callrawData}
            setCurrentPage={setCallCurrentPage}
            setEndDate={setCallEndDate}
            setStartDate={setCallStartDate}
            setSearchQuery={setCallSearchQuery}
            setFilterBy={setCallFilterBy}
            setLoading={setCallLoading}
            setIsCallLoading={setIsCallLoading}
            loading={callloading}
            isCallLoading={isCallLoading}
            isChatLoadedForNextPage={isChatLoadedForNextPage}
            setIsChatLoadedForNextPage={setIsChatLoadedForNextPage}
          />
        )}
        {activePage === "all-contacts" && (
          <AllContact
            allContact={allContact}
            setAllContact={setAllContact}
            allContactLoading={allContactLoading}
            setAllContactLoading={setAllContactLoading}
          />
        )}

        {activePage === "call-center" && <CallCenter />}
        {activePage === "campaign-login" && <CampaignLogin />}
        {activePage === "test" && <ConferenceTest />}
        {activePage === "all-voice-mails" && (
          <AllVoicemails isCustomerAdmin={isCustomerAdmin} />
        )}
        {activePage === "on-going-calls" && <OngoingCall />}
        {activePage === "call-dashboard" && <CallDashboard />}
        {activePage === "e-fax" && <EFax did={did} />}
        {activePage === "messages" && (
          <Messages
            setSelectedModule={setSelectedModule}
            isMicOn={isMicOn}
            isVideoOn={isVideoOn}
            extensionFromCdrMessage={extensionFromCdrMessage}
            setExtensionFromCdrMessage={setExtensionFromCdrMessage}
            calling={calling}
            setCalling={setCalling}
            setToUser={setToUser}
            setMeetingPage={setMeetingPage}
            recipient={recipient}
            setRecipient={setRecipient}
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
          />
        )}
        {activePage === "conference" && (
          <ConferenceConfig
            setactivePage={setactivePage}
            setConferenceId={setConferenceId}
            setConferenceToggle={setConferenceToggle}
            conferenceId={conferenceId}
            conferenceToggle={conferenceToggle}
            pin={pin}
            setPin={setPin}
            isVideoOn={isVideoOn}
          />
        )}
        {/* {activePage == "videocall" && <VideoCall />} */}
        {activePage == "email" && <Email />}
        {activePage == "mail-setting" && (
          <MailSettings style={{ marginLeft: "var(--sideNavApp-width)" }} />
        )}
        {activePage == "whatsapp-chartbox" && <WhatsAppChatBox />}

        <IncomingCalls
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

        {/* Draggable Component */}
        {sessions.length > 0 &&
          callProgressId &&
          selectedModule === "onGoingCall" &&
          sessions.find(
            (session) =>
              session.mode === "audio" && session.id === callProgressId
          ) && (
            <Rnd
              size={{ width: size.width, height: size.height }}
              position={{ x: position.x, y: position.y }}
              onDragStop={(e, d) => setPosition({ x: d.x, y: d.y })}
              onResizeStop={(e, direction, ref, delta, position) => {
                setSize({
                  width: ref.style.width,
                  height: ref.style.height,
                });
                setPosition(position);
              }}
              minWidth={"300px"}
              minHeight={"450px"}
              // maxWidth={"600px"}
              // maxHeight={"600px"}
              maxWidth={"300px"}
              maxHeight={"450px"}
              dragHandleClassName="drag-handle" // Specify draggable area
            >
              <div
                style={{
                  height: "100%",
                  width: "100%",
                  background: "transparent",
                  position: "relative",
                  zIndex: "999",
                }}
              >
                {/* Draggable Top Area */}
                <div
                  className="drag-handle"
                  style={{
                    position: "absolute",
                    top: "35px",
                    width: "100%",
                    height: "105px",
                    zIndex: "1",
                    background: "transparent",
                    cursor: "move",
                  }}
                ></div>
                <OngoingCall
                  setactivePage={setactivePage}
                  key={callProgressId}
                  id={callProgressId}
                  setHangupRefresh={setHangupRefresh}
                  hangupRefresh={hangupRefresh}
                  setSelectedModule={setSelectedModule}
                  allContact={allContact}
                  accountDetails={accountDetails}
                  didAll={didAll}
                // globalSession={sessions}
                />
              </div>
            </Rnd>
          )}

        {sessions.length > 0 && Object.keys(sessions).length > 0 ? (
          <>
            <section
              className="activeCallsSidePanel"
              onClick={() => {
                setSelectedModule("onGoingCall");
                // setactivePage("call");
              }}
            >
              <div className="container">
                <div className="row">
                  <div className="chatHeading">
                    <h5
                      data-bs-toggle="collapse"
                      href="#collapse1"
                      role="button"
                      aria-expanded="false"
                      aria-controls="collapse1"
                    >
                      Incoming Call{" "}
                      {sessions.filter(
                        (session) => session.state === "Incoming"
                      ).length > 0 ? (
                        <span>
                          {
                            sessions.filter(
                              (session) => session.state === "Incoming"
                            ).length
                          }
                        </span>
                      ) : (
                        ""
                      )}{" "}
                      <i className="fa-solid fa-chevron-down"></i>
                    </h5>
                  </div>
                  {sessions.length > 0 &&
                    sessions
                      .filter((session) => session.state === "Incoming")
                      .map((session, chennel) => {
                        if (session.id !== dummySession) {
                          return (
                            <div className="collapse show px-0" id="collapse1">
                              <ActiveCallSidePanel
                                key={chennel}
                                mode={session.mode}
                                sessionId={session.id}
                                destination={session.destination}
                                chennel={chennel}
                                setHangupRefresh={setHangupRefresh}
                                hangupRefresh={hangupRefresh}
                                setSelectedModule={setSelectedModule}
                                isMicOn={isMicOn}
                                setactivePage={setactivePage}
                                globalSession={sessions}
                                accountDetails={accountDetails}
                                didAll={didAll}
                                audioRef={audioRef}
                              />
                            </div>
                          );
                        }
                      })}
                </div>
                <div className="row">
                  <div className="chatHeading">
                    <h5
                      data-bs-toggle="collapse"
                      href="#collapse2"
                      role="button"
                      aria-expanded="false"
                      aria-controls="collapse2"
                    >
                      Active Call{" "}
                      {sessions.filter(
                        (session) => session.state !== "Incoming"
                      ).length ? (
                        <span>
                          {
                            sessions.filter(
                              (session) => session.state !== "Incoming"
                            ).length
                          }
                        </span>
                      ) : (
                        ""
                      )}{" "}
                      <i className="fa-solid fa-chevron-down"></i>
                    </h5>
                  </div>
                  {sessions.length > 0 &&
                    sessions
                      .filter((session) => session.state !== "Incoming")
                      .map((session, chennel) => {
                        if (session.id !== dummySession) {
                          return (
                            <div className="collapse show px-0" id="collapse2">
                              <ActiveCallSidePanel
                                key={chennel}
                                mode={session.mode}
                                sessionId={session.id}
                                destination={session.destination}
                                chennel={chennel}
                                setHangupRefresh={setHangupRefresh}
                                hangupRefresh={hangupRefresh}
                                setSelectedModule={setSelectedModule}
                                isMicOn={isMicOn}
                                setactivePage={setactivePage}
                                globalSession={sessions}
                                accountDetails={accountDetails}
                                didAll={didAll}
                              />
                            </div>
                          );
                        }
                      })}
                </div>
              </div>
            </section>
            {sessions.find((session) => session.mode === "video") &&
              callProgressId ? (
              <VideoCall
                setHangupRefresh={setHangupRefresh}
                hangupRefresh={hangupRefresh}
                setSelectedModule={setSelectedModule}
                activePage={activePage}
                setCloseVideoCall={setCloseVideoCall}
                callProgressId={callProgressId}
              />
            ) : null}
          </>
        ) : (
          ""
        )}

        {conferenceToggle || memberId ? (
          <ConferenceCall
            conferenceId={conferenceId}
            name={account?.username}
            extension_id={`${account?.extension?.extension}@${account?.domain?.domain_name}`}
            room_id={conferenceId}
            setactivePage={setactivePage}
            activePage={activePage}
            setConferenceToggle={setConferenceToggle}
            conferenceToggle={conferenceToggle}
            pin={pin}
            isVideoOn={isVideoOn}
          />
        ) : (
          ""
        )}
      </SIPProvider>
      {openCallCenterPopUp &&
        initailCallCenterPopup &&
        callCenterPopUp !== account?.extension?.extension && (
          <div className="popup">
            <div className="d-flex justify-content-center align-items-center h-100">
              <div className="overviewTableWrapper col-xl-6">
                <div className="overviewTableChild">
                  <div className="d-flex flex-wrap">
                    <div className="col-12">
                      <div className="heading">
                        <div className="content bg-transparent shadow-none p-0 d-flex justify-content-between align-items-center w-100">
                          <div>
                            <h4>Please Login!</h4>
                            <p>Please Login to your Designated Call Center</p>
                          </div>
                          <button
                            className="clearButton2 xl"
                            onClick={() => {
                              setInitailCallCenterPopup(false);
                              dispatch({
                                type: "SET_CALL_CENTER_POPUP",
                                callCenterPopUp: account?.extension?.extension,
                              });
                              localStorage.setItem(
                                "callCenterPopUp",
                                account?.extension?.extension
                              );
                            }}
                          >
                            <i className={"fa-regular fa-xmark"}></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="w-100">
                      <CallCenter initial={true} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      {callProgressId && (
        <audio id={`remote-audio-${callProgressId}`} autoPlay />
      )}
      {calling ? (
        <Rnd
          size={{ width: interCallSize.width, height: interCallSize.height }}
          position={{ x: interCallPosition.x, y: interCallPosition.y }}
          onDragStop={(e, d) => setInterCallPosition({ x: d.x, y: d.y })}
          onResizeStop={(e, direction, ref, delta, position) => {
            setInterCallSize({
              width: ref.style.width,
              height: ref.style.height,
            });
            setInterCallPosition(position);
          }}
          minWidth={"290px"}
          minHeight={"280px"}
          maxWidth={"calc(100vw - 650px)"}
          maxHeight={"calc(100vh - 61px)"}
          dragHandleClassName="inter-call-drag-handle" // Specify draggable area
          disableDragging={interCallMinimize}
          enableResizing={false}
          className="messageInterCall"
        >
          <div
            style={{
              height: "100%",
              width: "100%",
              background: "transparent",
              position: "relative",
              zIndex: "999",
            }}
          >
            <InitiateCall
              from={internalCaller}
              to={toUser}
              name={account.name}
              setCalling={setCalling}
              meetingPage={meetingPage}
              interCallMinimize={interCallMinimize}
              setInterCallMinimize={setInterCallMinimize}
              setactivePage={setactivePage}
              recipient={recipient}
              setRecipient={setRecipient}
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
            />
          </div>
        </Rnd>
      ) : (
        ""
      )}

      <InternalIncomingCall setCalling={setCalling} setToUser={setToUser} setInternalCaller={setInternalCaller} />
    </>
  );
};

export default WebrtcWrapper;
