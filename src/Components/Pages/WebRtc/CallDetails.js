import React from 'react'

function CallDetails() {
  return (
    <>
     
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
    </>
  )
}

export default CallDetails
