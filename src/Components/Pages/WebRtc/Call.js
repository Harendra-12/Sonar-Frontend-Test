import React, { useEffect, useState } from "react";
import Dialpad from "./Dialpad";
import { SIPProvider } from "react-sipjs";
import { SipRegister } from "./SipRegister";
import ActiveCallSidePanel from "./ActiveCallSidePanel";
import IncomingCallPopup from "./IncomingCallPopup";

function Call() {
  const [dialpadShow, setDialpadShow] = useState(false);
  const [clickStatus, setClickStatus] = useState("all")

  function handleHideDialpad(value) {
    setDialpadShow(value);
  }

  const useWebSocketErrorHandling = (options) => {
    useEffect(() => {
      const webSocket = new WebSocket(options.webSocketServer);

      webSocket.onerror = (event) => {
        console.error('WebSocket error:', event);
        // Prevent default error handling
        event.preventDefault();
      };

      webSocket.onclose = (event) => {
        if (event.code === 1006) {
          console.error(`WebSocket closed ${options.webSocketServer} (code: ${event.code})`);
          // Handle the WebSocket close event
        }
      };

      return () => {
        webSocket.close();
      };
    }, [options.webSocketServer]);
  };
  const options = {
    domain: "192.168.1.253",
    webSocketServer: "wss://192.168.1.253:7443",
  };

  useWebSocketErrorHandling(options);
  return (
    <>
      <SIPProvider
        options={options}
      >

        <main className="mainContentApp">
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
                        <button onClick={() => setClickStatus("all")} className={clickStatus === "all" ? "tabLink active" : "tabLink"} data-category="all">
                          <i className="fa-light fa-phone" />
                        </button>
                        <button
                          onClick={() => setClickStatus("incoming")}
                          className={clickStatus === "incoming" ? "tabLink active" : "tabLink"}
                          effect="ripple"
                          data-category="incoming"
                        >
                          <i className="fa-light fa-phone-arrow-down-left" />
                        </button>
                        <button
                          onClick={() => setClickStatus("outgoing")}
                          className={clickStatus === "outgoing" ? "tabLink active" : "tabLink"}
                          effect="ripple"
                          data-category="outgoing"
                        >
                          <i className="fa-light fa-phone-arrow-up-right" />
                        </button>
                        <button
                          onClick={() => setClickStatus("missed")}
                          className={clickStatus === "missed" ? "tabLink active" : "tabLink"}
                          effect="ripple"
                          data-category="missed"
                        >
                          <i className="fa-light fa-phone-missed" />
                        </button>
                        <button
                          onClick={() => setClickStatus("voicemail")}
                          className={clickStatus === "voicemail" ? "tabLink active" : "tabLink"}
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
                  <div className="profileInfoHolder">
                    <div className="profileHolder">
                      <i className="fa-light fa-user fs-3" />
                    </div>
                    <h4>1 (999) 999-9999</h4>
                    <h5>USER XYZ</h5>
                    <div className="d-flex justify-content-center align-items-center mt-3">
                      <button className="appPanelButton" effect="ripple">
                        <i className="fa-light fa-message-dots" />
                      </button>
                      <button className="appPanelButton" effect="ripple">
                        <i className="fa-light fa-phone" />
                      </button>
                      <button className="appPanelButton" effect="ripple">
                        <i className="fa-light fa-video" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <nav>
                      <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <button
                          className="tabLink active"
                          effect="ripple"
                          data-bs-toggle="tab"
                          data-bs-target="#nav-home"
                          type="button"
                          role="tab"
                          aria-controls="nav-home"
                          aria-selected="true"
                        >
                          <i className="fa-regular fa-circle-info" />
                        </button>
                        <button
                          className="tabLink"
                          effect="ripple"
                          data-bs-toggle="tab"
                          data-bs-target="#nav-profile"
                          type="button"
                          role="tab"
                          aria-controls="nav-profile"
                          aria-selected="false"
                        >
                          <i className="fa-regular fa-clock-rotate-left" />
                        </button>
                      </div>
                    </nav>
                    <div className="tab-content" id="nav-tabContent">
                      <div
                        className="tab-pane fade show active"
                        id="nav-home"
                        role="tabpanel"
                        aria-labelledby="nav-home-tab"
                        tabIndex={0}
                      >
                        <div className="callDetailsList">
                          <table className="mt-3">
                            <tbody>
                              <tr>
                                <td style={{ color: "#444444" }}>Jan 16, 2022</td>
                                <td>12:46 PM</td>
                                <td className="missed"><span>Missed</span></td>
                                <td>1 (999) 999-9999</td>
                                <td style={{ color: "#444444" }}>16 sec</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab" tabindex="0">
                        <div className="callDetailsList">
                          <table className="mt-3">
                            <tbody>
                              <tr>
                                <td style={{ color: "#444444" }}>Jan 16, 2022</td>
                                <td>12:46 PM</td>
                                <td className="missed"><span>Missed</span></td>
                                <td>1 (999) 999-9999</td>
                                <td style={{ color: "#444444" }}>24 sec</td>
                              </tr>
                              <tr>
                                <td style={{ color: "#444444" }}>Jan 16, 2022</td>
                                <td>12:46 PM</td>
                                <td className="incoming"><span>Incoming</span></td>
                                <td>1 (999) 999-9999</td>
                                <td style={{ color: "#444444" }}>10 sec</td>
                              </tr>
                              <tr>
                                <td style={{ color: "#444444" }}>Jan 16, 2022</td>
                                <td>12:46 PM</td>
                                <td className="outgoing"><span>Outgoing</span></td>
                                <td>1 (999) 999-9999</td>
                                <td style={{ color: "#444444" }}>1 min 10 sec</td>
                              </tr>
                              <tr>
                                <td style={{ color: "#444444" }}>Jan 16, 2022</td>
                                <td>12:46 PM</td>
                                <td className="outgoing"><span>Outgoing</span></td>
                                <td>1 (999) 999-9999</td>
                                <td style={{ color: "#444444" }}>35 sec</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <ActiveCallSidePanel />
        <IncomingCallPopup />
        {dialpadShow ? <Dialpad hideDialpad={handleHideDialpad} /> : ""}
      </SIPProvider>
    </>
  );
}

export default Call;
