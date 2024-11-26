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
import { SIPProvider, useSIPProvider } from "react-sipjs";
import IncomingCalls from "./IncomingCalls";
import { SipRegister } from "./SipRegister";
import SideNavbarApp from "./SideNavbarApp";
import Messages from "./Messages";
import VideoCall from "./VideoCall";
import ConferenceCall from "./ConferenceCall";
import ConferenceTest from "./ConferenceTest";
import { Rnd } from "react-rnd";

const WebrtcWrapper = () => {
  const [size, setSize] = useState({ width: 300, height: 450 });
  const [position, setPosition] = useState({ x: 700, y: 300 });
  const { sessions: sipSessions } = useSIPProvider();
  const dispatch = useDispatch();
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
  const callProgress = useSelector((state) => state.callProgress);
  console.log(sipSessions);
  const [closeVideoCall, setCloseVideoCall] = useState(false);
  const useWebSocketErrorHandling = (options) => {
    const retryCountRef = useRef(0);
    const connectWebSocket = (retryCount = 0) => {
      const webSocket = new WebSocket(options.webSocketServer);

      webSocket.onopen = () => {
        console.log("WebSocket connected");
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
        console.log("Trying to reconnect to WebSocket...");
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
      connectWebSocket();
    }, [options.webSocketServer]);
  };
  const options = {
    domain: account.domain.domain_name,
    webSocketServer: "wss://ucaas.webvio.in:7443",
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
  }, []);
  useEffect(() => {
    if (
      selectedModule !== "onGoingCall" &&
      sessions.find((session) => session.mode === "video")
    ) {
      console.log(
        "aaaaa small video",
        sessions.find((session) => session.mode === "video"),
        videoCall,
        selectedModule
      );
    } else {
      console.log(
        "aaaaa full video",
        sessions.find((session) => session.mode === "video"),
        videoCall,
        selectedModule
      );
    }
  }, [videoCall, selectedModule, sessions]);

  useEffect(() => {
    dispatch({
      type: "SET_MINIMIZE",
      minimize: true,
    });
  }, [activePage]);

  return (
    <>
      <SIPProvider options={options}>
        <SideNavbarApp
          setactivePage={setactivePage}
          activePage={activePage}
          isMicOn={isMicOn}
          isVideoOn={isVideoOn}
          reconnecting={reconnecting}
        />
        <div className="d-none">
          {extension && <SipRegister options={options} />}
        </div>
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
          />
        )}
        {activePage === "all-contacts" && <AllContact />}
        {activePage === "call-center" && <CallCenter />}
        {activePage === "test" && <ConferenceTest />}
        {activePage === "all-voice-mails" && (
          <AllVoicemails isCustomerAdmin={isCustomerAdmin} />
        )}
        {activePage === "on-going-calls" && <OngoingCall />}
        {activePage === "call-dashboard" && <CallDashboard />}
        {activePage === "e-fax" && <EFax />}
        {activePage === "messages" && (
          <Messages
            setSelectedModule={setSelectedModule}
            isMicOn={isMicOn}
            isVideoOn={isVideoOn}
          />
        )}
        {activePage === "conference" && (
          // <ConferenceConfig />
          <ConferenceCall />
        )}
        {/* {activePage == "videocall" && <VideoCall />} */}

        <IncomingCalls
          setSelectedModule={setSelectedModule}
          setactivePage={setactivePage}
          isMicOn={isMicOn}
          isVideoOn={isVideoOn}
        />


        {/* Draggable Component */}
        {sessions.length > 0 && callProgressId && selectedModule === "onGoingCall" && sessions.find((session) => session.mode === "audio" && session.id === callProgressId) &&
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
            minWidth={'300px'}
            minHeight={'450px'}
            maxWidth={'600px'}
            maxHeight={'600px'}
            dragHandleClassName="drag-handle" // Specify draggable area
          >
            <div
              style={{
                height: "100%",
                width: "100%",
                background: "#f0f0f0",
                position: "relative",
                zIndex: "999",
              }}
            >
              {/* Draggable Top Area */}
              <div
                className="drag-handle"
                style={{
                  position: 'absolute',
                  top: '35px',
                  width: '100%',
                  height: '105px',
                  zIndex: '1',
                  background: 'transparent',
                  cursor: 'move'
                }}
              >
              </div>
              <OngoingCall
                setactivePage={setactivePage}
                key={callProgressId}
                id={callProgressId}
                setHangupRefresh={setHangupRefresh}
                hangupRefresh={hangupRefresh}
                setSelectedModule={setSelectedModule} />
            </div>
          </Rnd>
        }

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
                  <div class="chatHeading">
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
                      ).length > 0 ? (<span>{sessions.filter((session) => session.state === "Incoming").length}</span>) : ""}
                      {" "}
                      <i class="fa-solid fa-chevron-down"></i>
                    </h5>
                  </div>
                  {sessions.length > 0 &&
                    sessions
                      .filter((session) => session.state === "Incoming")
                      .map((session, chennel) => {
                        return (
                          <div class="collapse show px-0" id="collapse1">
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
                            />
                          </div>
                        );
                      })}
                </div>
                <div className="row">
                  <div class="chatHeading">
                    <h5
                      data-bs-toggle="collapse"
                      href="#collapse2"
                      role="button"
                      aria-expanded="false"
                      aria-controls="collapse2"
                    >
                      Active Call{" "}
                      {sessions.filter((session) => session.state !== "Incoming").length ? (<span>{sessions.filter((session) => session.state !== "Incoming").length}</span>) : ""}
                      {" "}
                      <i class="fa-solid fa-chevron-down"></i>
                    </h5>
                  </div>
                  {sessions.length > 0 &&
                    sessions
                      .filter((session) => session.state !== "Incoming")
                      .map((session, chennel) => {
                        return (
                          <div class="collapse show px-0" id="collapse2">
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
                            />
                          </div>
                        );
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
      </SIPProvider>
    </>
  );
};

export default WebrtcWrapper;
