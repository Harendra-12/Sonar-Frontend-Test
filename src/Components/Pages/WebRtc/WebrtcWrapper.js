import React, { useEffect, useRef, useState } from "react";
import Call from "./Call";
import AllContact from "./AllContact";
import CallCenter from "./CallCenter";
import AllVoicemails from "./AllVoicemails";
import OngoingCall from "./OngoingCall";
import CallDashboard from "./CallDashboard";
import EFax from "./EFax";
import { useSelector } from "react-redux";
import ActiveCallSidePanel from "./ActiveCallSidePanel";
import { SIPProvider } from "react-sipjs";
import IncomingCalls from "./IncomingCalls";
import { SipRegister } from "./SipRegister";
import SideNavbarApp from "./SideNavbarApp";
import Messages from "./Messages";
import VideoCall from "./VideoCall";

const WebrtcWrapper = () => {
  const sessions = useSelector((state) => state.sessions);
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
    webSocketServer: "wss://192.168.2.225:7443",
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
  if(selectedModule!=="onGoingCall" && sessions.find((session) => session.mode === "video")){
    console.log("aaaaa small video",sessions.find((session) => session.mode === "video"),videoCall,selectedModule);
  }else{
    console.log("aaaaa full video",sessions.find((session) => session.mode === "video"),videoCall,selectedModule);
  }
},[videoCall,selectedModule,sessions])
  return (
    <>
      <SIPProvider options={options}>
        <SideNavbarApp
          setactivePage={setactivePage}
          isMicOn={isMicOn}
          isVideoOn={isVideoOn}
          reconnecting={reconnecting}
        />
        <div>{extension && <SipRegister options={options} />}</div>
        {activePage == "call" && (
          <Call
            setHangupRefresh={setHangupRefresh}
            hangupRefresh={hangupRefresh}
            selectedModule={selectedModule}
            setSelectedModule={setSelectedModule}
            isCustomerAdmin={isCustomerAdmin}
            isMicOn={isMicOn}
            isVideoOn={isVideoOn}
            activePage={activePage}
          />
        )}
        {activePage == "all-contacts" && <AllContact />}
        {activePage == "call-center" && <CallCenter />}
        {activePage == "all-voice-mails" && (
          <AllVoicemails isCustomerAdmin={isCustomerAdmin} />
        )}
        {activePage == "on-going-calls" && <OngoingCall />}
        {activePage == "call-dashboard" && <CallDashboard />}
        {activePage == "e-fax" && <EFax />}
        {activePage == "messages" && <Messages />}
        {/* {activePage == "videocall" && <VideoCall />} */}

        <IncomingCalls
          setSelectedModule={setSelectedModule}
          setactivePage={setactivePage}
          isMicOn={isMicOn}
          isVideoOn={isVideoOn}
        />

        {sessions.length > 0 && Object.keys(sessions).length > 0 ? (
          <>
            <section
              className="activeCallsSidePanel"
              onClick={() => {
                setSelectedModule("onGoingCall");
                setactivePage("call");
              }}
            >
              <div className="container">
                <div className="row">
                  {sessions.length > 0 &&
                    sessions.map((session, chennel) => (
                      <ActiveCallSidePanel
                        key={chennel}
                        mode={session.mode}
                        sessionId={session.id}
                        destination={session.destination}
                        chennel={chennel}
                        setHangupRefresh={setHangupRefresh}
                        hangupRefresh={hangupRefresh}
                        setSelectedModule={setSelectedModule}
                      />
                    ))}
                </div>
              </div>
            </section>
          </>
        ) : (
          ""
        )}
        {/* {(activePage==="call") ?videoCall && sessions.find((session) => session.mode === "video")?<div
                className="col-12 callDetails col-xl-6"
                style={{ height: "100vh" }}
                id="callDetails"
              >  <VideoCall setHangupRefresh={setHangupRefresh} hangupRefresh={hangupRefresh} setSelectedModule={setSelectedModule} activePage={activePage} /> </div>:"":sessions.find((session) => session.mode === "video") ? <VideoCall setHangupRefresh={setHangupRefresh} hangupRefresh={hangupRefresh} setSelectedModule={setSelectedModule} activePage={activePage} />:""} */}
      </SIPProvider>
    </>
  );
};

export default WebrtcWrapper;
