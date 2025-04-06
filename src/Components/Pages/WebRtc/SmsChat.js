import React from "react";

function SmsChat() {
  return (


    <main
    className="mainContentApp" style={{marginRight:0}}
    // style={{
    //   marginRight:
    //     sessions.length > 0 && Object.keys(sessions).length > 0
    //       ? "250px"
    //       : "0",
    // }}
  >
    <section className="callPage">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 ps-xl-0">
            <div className="newHeader">
              <div className="col-auto" style={{ padding: "0px 10px" }}>
                <h3 style={{ fontFamily: "Outfit", marginBottom: 0 }}>
                  <button className="clearButton2 text-dark">
                    <i className="fa-solid fa-chevron-left fs-4" />
                  </button>{" "}
                  SMS {" "}
                  <button className="clearButton2">
                    <i
                      className="fa-regular fa-arrows-rotate fs-5"
                      style={{ color: "var(--webUtilGray)" }}
                    />
                  </button>
                </h3>
              </div>
              <div className="d-flex justify-content-end align-items-center">
                <div className="col-9">
                  <input
                    type="search"
                    name="Search"
                    placeholder="Search users, groups or chat"
                    className="formItem fw-normal"
                    style={{ backgroundColor: "var(--searchBg)" }}
                  />
                </div>
                <div className="col-auto ms-2">
                  <button className="clearButton2 xl" effect="ripple">
                    <i className="fa-regular fa-bell" />
                  </button>
                </div>
                <div className="col-auto mx-2">
                  <button className="clearButton2 xl" effect="ripple">
                    <i className="fa-light fa-moon" />
                    <input
                      type="checkbox"
                      style={{
                        opacity: 0,
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        top: 0,
                      }}
                    />
                  </button>
                </div>
                <div className="col-auto">
                  <div className="dropdown">
                    <div
                      className="myProfileWidget"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <div className="profileHolder" id="profileOnlineNav">
                        <img
                          src="https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg"
                          alt="profile"
                        />
                      </div>
                      <div className="profileName">
                        webvio <span className="status">Available</span>
                      </div>
                    </div>
                    <ul className="dropdown-menu">
                      <li>
                        <div
                          className="dropdown-item"
                          style={{ cursor: "pointer" }}
                        >
                          Logout
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xxl-5 col-xl-6 allCallHistory pb-0">
            <div className="col-auto" style={{ padding: "0px 10px" }}>
              <h5 className="viewingAs">
                Viewing As:
                <span>
                  <span>webvio - 1000</span>
                </span>
              </h5>
            </div>
            <div className="col-auto" style={{ padding: "0px 10px" }}>
              <button className="clearColorButton dark">
                <i className="fa-light fa-fax" /> New SMS
              </button>
            </div>
            <div className="col-12 mt-3" style={{ padding: "0px 10px" }}>
              <input
                type="search"
                name="Search"
                id="headerSearch"
                placeholder="Search"
              />
            </div>
            <div className="col-12">
              {/* <nav className="mt-3">
                <div
                  className="nav nav-tabs"
                  style={{ borderBottom: "1px solid var(--border-color)" }}
                >
                  <button
                    className="tabLink active"
                    effect="ripple"
                    data-category="all"
                  >
                    All
                  </button>
                  <button
                    className="tabLink"
                    effect="ripple"
                    data-category="file"
                  >
                    File
                  </button>
                </div>
              </nav> */}
              <div className="tab-content">
                <div className="callList">
                  {/* <div className="dateHeader">
                    <p className="fw-semibold">Today</p>
                  </div> */}
                  <div data-bell="" className="callListItem incomingm">
                    <div className="row justify-content-between">
                      <div className="col-xl-12 d-flex">
                        <div className="profileHolder">
                          <i className="fa-light fa-user fs-5" />
                        </div>
                        <div
                          className="col-3 my-auto ms-2 ms-xl-3"
                          style={{ cursor: "pointer" }}
                        >
                          <h4>AUSER XYZ</h4>
                         
                        </div>
                        <div
                          className="col-3 my-auto ms-2 ms-xl-3"
                          style={{ cursor: "pointer" }}
                        >
                          <h4>AUSER XYZ</h4>
                         
                        </div>
                        <div className="col-3 mx-auto">
                          <div className="contactTags mt-2">
                            <span data-id={1}>Deliver</span>
                          </div>
                        
                        </div>
                        <div className="col-1 text-end ms-auto">
                          <p className="timeAgo">12:46pm</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div data-bell="" className="callListItem outgoing0">
                    <div className="row justify-content-between">
                      <div className="col-xl-12 d-flex">
                        <div className="profileHolder">
                          <i className="fa-light fa-user fs-5" />
                        </div>
                        <div
                          className="col-3 my-auto ms-1 ms-xl-3"
                          style={{ cursor: "pointer" }}
                        >
                          <h4>AUSER XYZ</h4>
                         
                        </div>
                        <div
                          className="col-3 my-auto ms-1 ms-xl-3"
                          style={{ cursor: "pointer" }}
                        >
                          <h4>AUSER XYZ</h4>
                         
                        </div>
                        <div className="col-3 mx-auto">
                          <div className="contactTags  mt-2">
                            <span data-id={0}>Active</span>
                          </div>
                          {/* <h5 style={{ fontWeight: 400 }}>
                            <i className="fa-light fa-paperclip" /> 1 Attachment
                          </h5> */}
                        </div>
                        <div className="col-1 text-end ms-auto">
                          <p className="timeAgo">12:46pm</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="col-xxl-7 col-xl-6 callDetails eFaxCompose"
            id="callDetails"
            style={{ height: "100%" }}
          >
            <div className="overviewTableWrapper p-2 mt-2">
              <div className="overviewTableChild">
                <div className="d-flex flex-wrap">
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
                        <h4>New Sms</h4>
                        <p>You can send a new sms from here</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12" style={{ padding: "0px 20px" }}>
                    <div className="newMessageWrapper mb-3">
                      <div>
                        <div className="messageTo">
                          <label>Enter Sender Number</label>
                          <div className="d-flex flex-wrap">
                            <div className="col-auto my-auto">
                              <input
                                type="text"
                                className="border-0 mb-0"
                                defaultValue=""
                              />
                            </div>
                          </div>
                        </div>
                        <div className="messageSubject">
                          <label>Enter Receiver Number</label>
                          <input type="text" defaultValue="" />
                        </div>
                        <div className="messageBody">
                          <label>Enter your messsage</label>
                          <input defaultValue="" />
                        </div>
                        {/* <div className="messageBody">
                          <label>
                            <i className="fa-regular fa-link" /> Attach File(s)
                            (maximum file size is 50 MB)
                          </label>
                          <div className="inputFileWrapper">
                            <select className="formItem">
                              <option value="" disabled="">
                                Chose file
                              </option>
                              <option value={2}>
                                1742451782_Naukri_RanjanSengupta[2y_2m].pdf
                              </option>
                            </select>
                          </div>
                        </div> */}
                        <div className="buttonControl">
                          <button className="panelButton">
                            <span className="text">Send</span>
                            <span className="icon">
                              <i className="fa-solid fa-paper-plane-top" />
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    </main>
  );
}

export default SmsChat;
