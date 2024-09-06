import React from "react";
import SideNavbarApp from "./SideNavbarApp";
import { useSelector } from "react-redux";
import ActiveCallSidePanel from "./ActiveCallSidePanel";

function EFax() {
  const sessions = useSelector((state) => state.sessions);
  return (
    <>
      {/* <SideNavbarApp /> */}
      <main
        className="mainContentApp"
        style={{
          marginRight:
            sessions.length > 0 && Object.keys(sessions).length > 0
              ? "250px"
              : "0",
        }}
      >
        <section>
          <div className="container-fluid">
            <div className="row">
              <div
                className="col-12 col-xl-6 d-flex flex-wrap justify-content-between py-3 border-end"
                style={{ height: "100%" }}
              >
                <div className="col-auto">
                  <h3 style={{ fontFamily: "Outfit", color: "#444444" }}>
                    eFax
                  </h3>
                </div>
                <div className="col-auto d-flex">
                  <div className="col-auto">
                    <button className="appPanelButton" effect="ripple">
                      <i className="fa-solid fa-message-plus"></i>
                    </button>
                  </div>
                  <div className="col-auto">
                    <button className="appPanelButton" effect="ripple">
                      <i className="fa-solid fa-gear"></i>
                    </button>
                  </div>
                </div>
                <div className="col-12">
                  <nav>
                    <div className="nav nav-tabs">
                      <button className={"tabLink active"} data-category="all">
                        All
                      </button>
                      <button
                        className={"tabLink"}
                        effect="ripple"
                        data-category="incoming"
                      >
                        Received
                      </button>
                      <button
                        className={"tabLink"}
                        effect="ripple"
                        data-category="outgoing"
                      >
                        Sent
                      </button>
                      <button
                        className={"tabLink"}
                        effect="ripple"
                        data-category="missed"
                      >
                        Failed
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
                    </div>
                    <div className="callList">
                      <div className="text-center callListItem">
                        <h5 className="fw-semibold">Today</h5>
                      </div>
                      <div className="contactListItem">
                        <div className="row justify-content-between">
                          <div className="col-xl-6 d-flex">
                            <div className="profileHolder" id="profileOnline">
                              <i className="fa-light fa-user fs-5"></i>
                            </div>
                            <div className="my-auto ms-2 ms-xl-3">
                              <h4>AUSER XYZ</h4>
                              <h5>1 (999) 999-9999</h5>
                            </div>
                          </div>
                          <div className="col-10 col-xl-4">
                            <h4>
                              <span>Received</span>
                            </h4>
                            <h5>1 Attachment</h5>
                          </div>
                          <div className="col-auto text-end d-flex justify-content-center align-items-center">
                            <h5>12:46pm</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="col-12 col-xl-6 callDetails eFaxCompose"
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
                        <i className="fa-regular fa-inbox-out" />
                      </button>
                      <button
                        className="tabLink"
                        effect="ripple"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-history"
                        type="button"
                        role="tab"
                        aria-controls="nav-history"
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
                      <div className="newMessageWrapper">
                        <div className="messageTitle">
                          <h4>New Fax</h4>
                        </div>
                        <div className="messageTo">
                          <label>To</label>
                          <div className="d-flex flex-wrap">
                            {/* Map This in Loop */}
                            <div className="col-auto">
                              <div style={{ width: "max-content" }}>
                                <button class="receipentButton">
                                  johndoe@email.com
                                </button>
                              </div>
                            </div>
                            <div className="col-auto">
                              <div style={{ width: "max-content" }}>
                                <button class="receipentButton">
                                  johndoe@email.com
                                </button>
                              </div>
                            </div>
                            <div className="col-auto">
                              <div style={{ width: "max-content" }}>
                                <button class="receipentButton">
                                  johndoe@email.com
                                </button>
                              </div>
                            </div>
                            {/* Map This in Loop */}
                            <div className="col-auto my-auto">
                              <input
                                type="text"
                                placeholder="Recipents"
                                className="border-0 mb-0"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="messageSubject">
                          <label>Cover Page</label>
                          <input type="text" placeholder="Subject" />
                        </div>
                        <div className="messageBody">
                          <label>Cover Page Note</label>
                          <textarea rows={4} />
                        </div>
                        <div className="messageBody">
                          <label>
                            <i className="fa-regular fa-link"></i> Attach
                            File(s) (maximum file size is 50 MB)
                          </label>
                          <div className="inputFileWrapper">
                            <input type="file" />
                          </div>
                        </div>
                        <div className="buttonControl">
                          <button className="panelButtonWhite">Cancel</button>
                          <button className="panelButton">Send Later</button>
                          <button className="panelButton">Send Now</button>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="nav-history"
                      role="tabpanel"
                      aria-labelledby="nav-history-tab"
                      tabIndex={1}
                    >
                      <div className="callDetailsList">
                        <table className="mt-3">
                          <tbody>
                            <tr>
                              <td style={{ color: "#444444" }}>Jan 16, 2022</td>
                              <td>12:46 PM</td>
                              <td className="incoming">
                                <span>Received</span>
                              </td>
                              <td>1 (999) 999-9999</td>
                              <td style={{ color: "#444444" }}>1 Attachment</td>
                            </tr>
                            <tr>
                              <td style={{ color: "#444444" }}>Jan 16, 2022</td>
                              <td>12:46 PM</td>
                              <td className="outgoing">
                                <span>Sent</span>
                              </td>
                              <td>1 (999) 999-9999</td>
                              <td style={{ color: "#444444" }}>1 Attachment</td>
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
      {sessions.length > 0 && Object.keys(sessions).length > 0 ? (
        <>
          <section className="activeCallsSidePanel">
            <div className="container">
              <div className="row">
                {sessions.length > 0 &&
                  sessions.map((session, chennel) => (
                    <ActiveCallSidePanel
                      sessionId={session.id}
                      destination={session.destination}
                      chennel={chennel}
                    />
                  ))}
              </div>
            </div>
          </section>
        </>
      ) : (
        ""
      )}
    </>
  );
}

export default EFax;
