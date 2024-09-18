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

const WebrtcWrapper = () => {
  const sessions = useSelector((state) => state.sessions);
  const account = useSelector((state) => state.account);
  const accountDetails = useSelector((state) => state.accountDetails);
  const [hangupRefresh, setHangupRefresh] = useState(0);
  const [selectedModule, setSelectedModule] = useState("");
  const [activePage, setactivePage] = useState("call");
  const isCustomerAdmin = account?.email == accountDetails?.email;
  const extension = account?.extension?.extension || "";

  const useWebSocketErrorHandling = (options) => {
    useEffect(() => {
      const webSocket = new WebSocket(options.webSocketServer);

      webSocket.onerror = (event) => {
        console.error("WebSocket error:", event);
        // Prevent default error handling
        event.preventDefault();
      };

      webSocket.onclose = (event) => {
        if (event.code === 1006) {
          console.error(
            `WebSocket closed ${options.webSocketServer} (code: ${event.code})`
          );
          // Handle the WebSocket close event
        }
      };
      console.log(global);
      return () => {
        webSocket.close();
      };
    }, [options.webSocketServer]);
  };
  const options = {
    domain: account.domain.domain_name,
    webSocketServer: "wss://192.168.2.225:7443",
    // domain: "192.168.0.91",
    // domain: "webvio.1.com",
    // webSocketServer: "ws://192.168.0.91:5066",
  };

  useWebSocketErrorHandling(options);
  return (
    <>
      <SIPProvider options={options}>
        <SideNavbarApp setactivePage={setactivePage} />
        <div>{extension && <SipRegister />}</div>
        {activePage == "call" && (
          <Call
            setHangupRefresh={setHangupRefresh}
            hangupRefresh={hangupRefresh}
            selectedModule={selectedModule}
            setSelectedModule={setSelectedModule}
            isCustomerAdmin={isCustomerAdmin}
          />
        )}
        {activePage == "all-contacts" && <AllContact />}
        {activePage == "call-center" && <CallCenter />}
        {activePage == "all-voice-mails" && <AllVoicemails />}
        {activePage == "on-going-calls" && <OngoingCall />}
        {activePage == "call-dashboard" && <CallDashboard />}
        {activePage == "e-fax" && <EFax />}
        <IncomingCalls
          setSelectedModule={setSelectedModule}
          setactivePage={setactivePage}
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
