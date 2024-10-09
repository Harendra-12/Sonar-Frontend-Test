import React, { useEffect, useState } from "react";
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

const WebrtcWrapper = () => {
  const sessions = useSelector((state) => state.sessions);
  const account = useSelector((state) => state.account);
  const accountDetails = useSelector((state) => state.accountDetails);
  const [hangupRefresh, setHangupRefresh] = useState(0);
  const [selectedModule, setSelectedModule] = useState("");
  const [activePage, setactivePage] = useState("call");
  const isCustomerAdmin = account?.email == accountDetails?.email;
  const extension = account?.extension?.extension || "";
  const [isMicOn, setIsMicOn] = useState(false); // State to track mic status
  const useWebSocketErrorHandling = (options) => {
    const connectWebSocket = (retryCount = 0) => {
      const webSocket = new WebSocket(options.webSocketServer);

      webSocket.onopen = () => {
        console.log("WebSocket connected");
      };

      webSocket.onerror = (event) => {
        console.error("WebSocket error:", event);
        if (retryCount < 3) {
          setTimeout(() => {
            connectWebSocket(retryCount + 1); // retry after 2 seconds
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
        if (retryCount < 3) {
          setTimeout(() => {
            connectWebSocket(retryCount + 1); // retry after 2 seconds
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
    webSocketServer: "wss://192.168.2.224:7443",
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

  useEffect(() => {
    checkMicrophoneStatus(); // Check mic status when component mounts
  }, []);

  return (
    <>
      <SIPProvider options={options}>
        <SideNavbarApp setactivePage={setactivePage} isMicOn={isMicOn} />
        <div>{extension && <SipRegister options={options} />}</div>
        {activePage == "call" && (
          <Call
            setHangupRefresh={setHangupRefresh}
            hangupRefresh={hangupRefresh}
            selectedModule={selectedModule}
            setSelectedModule={setSelectedModule}
            isCustomerAdmin={isCustomerAdmin}
            isMicOn={isMicOn}
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

        <IncomingCalls
          setSelectedModule={setSelectedModule}
          setactivePage={setactivePage}
          isMicOn={isMicOn}
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
      </SIPProvider>
    </>
  );
};

export default WebrtcWrapper;
