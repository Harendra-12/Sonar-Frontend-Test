import React, { useEffect, useState } from "react";
import Dialpad from "./Dialpad";
import { SIPProvider } from "react-sipjs";
import { SipRegister } from "./SipRegister";
import ActiveCallSidePanel from "./ActiveCallSidePanel";
import IncomingCallPopup from "./IncomingCallPopup";
import SideNavbarApp from "./SideNavbarApp";
import CallDetails from "./CallDetails";
import OngoingCall from "./OngoingCall";
import { useSelector } from "react-redux";
import IncomingCalls from "./IncomingCalls";

function Call() {
  const sessions = useSelector((state) => state.sessions);
  const [dialpadShow, setDialpadShow] = useState(false);
  const [clickStatus, setClickStatus] = useState("all");
  const callProgress = useSelector((state) => state.callProgress);

  function handleHideDialpad(value) {
    setDialpadShow(value);
  }

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

      return () => {
        webSocket.close();
      };
    }, [options.webSocketServer]);
  };
  const options = {
    // domain: "192.168.1.253",
    // webSocketServer: "wss://192.168.1.253:7443",
    domain: "192.168.0.91",
    webSocketServer: "ws://192.168.0.91:5066",
  };

  useWebSocketErrorHandling(options);

  return (
    <>
      <style>
        {`#sidenNav{
        display:none;
      }`}
      </style>
      <SIPProvider options={options}>
        <SideNavbarApp />
        <main
          className="mainContentApp"
          style={{
            marginRight:
              sessions && Object.keys(sessions).length > 0 ? "250px" : "0",
          }}
        >
          <section className="callPage">
            <div className="container-fluid">
              <div className="row">
                <div
                  className="col-12 col-xl-6 allCallHistory"
                  // style={{ height: "100%" }}
                >
                  <SipRegister />

                  <div className="col-auto d-flex">
                    <div className="col-auto">
                      <button
                        className="appPanelButton"
                        effect="ripple"
                        onClick={() => setDialpadShow(!dialpadShow)}
                      >
                        <i className="fa-light fa-mobile-retro" />
                      </button>
                    </div>
                    <div className="col-auto">
                      <button className="appPanelButton" effect="ripple">
                        <i className="fa-light fa-satellite-dish" />
                      </button>
                    </div>
                  </div>

                  <div className="col-12">
                    <nav>
                      <div className="nav nav-tabs">
                        <button
                          onClick={() => setClickStatus("all")}
                          className={
                            clickStatus === "all" ? "tabLink active" : "tabLink"
                          }
                          data-category="all"
                        >
                          <i className="fa-light fa-phone" />
                        </button>
                        <button
                          onClick={() => setClickStatus("incoming")}
                          className={
                            clickStatus === "incoming"
                              ? "tabLink active"
                              : "tabLink"
                          }
                          effect="ripple"
                          data-category="incoming"
                        >
                          <i className="fa-light fa-phone-arrow-down-left" />
                        </button>
                        <button
                          onClick={() => setClickStatus("outgoing")}
                          className={
                            clickStatus === "outgoing"
                              ? "tabLink active"
                              : "tabLink"
                          }
                          effect="ripple"
                          data-category="outgoing"
                        >
                          <i className="fa-light fa-phone-arrow-up-right" />
                        </button>
                        <button
                          onClick={() => setClickStatus("missed")}
                          className={
                            clickStatus === "missed"
                              ? "tabLink active"
                              : "tabLink"
                          }
                          effect="ripple"
                          data-category="missed"
                        >
                          <i className="fa-light fa-phone-missed" />
                        </button>
                        <button
                          onClick={() => setClickStatus("voicemail")}
                          className={
                            clickStatus === "voicemail"
                              ? "tabLink active"
                              : "tabLink"
                          }
                          effect="ripple"
                          data-category="voicemail"
                        >
                          <i className="fa-light fa-microphone-lines" />
                        </button>
                      </div>
                    </nav>
                    <div className="tab-content">
                      <div className="position-relative searchBox d-flex mt-3">
                        <input
                          type="search"
                          name="Search"
                          id="headerSearch"
                          placeholder="Search"
                        />
                        <button className="appPanelButton" effect="ripple">
                          <i className="fa-light fa-calendar-plus" />
                        </button>
                      </div>
                      <div className="callList">
                        <div className="text-center callListItem">
                          <h5 className="fw-semibold">Today</h5>
                          <div className="callListItem missed">
                            <div className="row justify-content-between">
                              <div className="col-8 ms-4 text-start">
                                <h4>1 (999) 999-9999</h4>
                                <h5>USER XYZ</h5>
                                <h6>Missed Call</h6>
                              </div>
                              <div className="col-3 text-end">
                                <h5>12:46pm</h5>
                              </div>
                            </div>
                          </div>
                          <div className="callListItem incoming">
                            <div className="row justify-content-between">
                              <div className="col-8 ms-4 text-start">
                                <h4>1 (999) 999-9999</h4>
                                <h5>USER XYZ</h5>
                                <h6>Call, 1 min 10 sec</h6>
                              </div>
                              <div className="col-3 text-end">
                                <h5>12:46pm</h5>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="col-12 callDetails col-xl-6"
                  style={{ height: "100%" }}
                  id="callDetails"
                >
                  {callProgress ? <OngoingCall /> : <CallDetails />}
                </div>
              </div>
            </div>
          </section>
        </main>
        {sessions && Object.keys(sessions).length > 0 ? (
          <>
            <section className="activeCallsSidePanel">
              <div className="container">
                <div className="row">
                  {Object.keys(sessions).map((sessionId) => (
                    <ActiveCallSidePanel sessionId={sessionId} />
                  ))}
                </div>
              </div>
            </section>
          </>
        ) : (
          ""
        )}
        <IncomingCallPopup />
        {dialpadShow ? <Dialpad hideDialpad={handleHideDialpad} /> : ""}
      </SIPProvider>
    </>
  );
}

export default Call;
