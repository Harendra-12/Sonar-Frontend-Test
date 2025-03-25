/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import AllCallsDetails from "./AllCallsDetails";
import CallQueueDetails from "./CallQueueDetails";
import RingGroup from "./RingGroupDetails";
import { useNavigate } from "react-router-dom";
import { generalGetFunction } from "../../GlobalFunction/globalFunction";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../CommonComponents/Header";


function PhoneDashboard() {
  const navigate = useNavigate();
  // const [extensionList, setExtensionList] = useState(0);
  const [userList, setUserList] = useState(0);
  const registerUser = useSelector((state) => state.registerUser);
  const callDetailsRefresh = useSelector((state) => state.callDetailsRefresh);
  const activeCall = useSelector((state) => state.activeCall);
  const dispatch = useDispatch();
  const ringGroup = useSelector((state) => state.ringGroup);
  const ringGroupRefresh = useSelector((state) => state.ringGroupRefresh);
  const [ringGroupData, setRingGroupData] = useState([]);
  const allCall = useSelector((state) => state.allCall);
  const extension = useSelector((state) => state.extension || []);
  const extensionRefresh = useSelector((state) => state.extensionRefresh);
  const allUser = useSelector((state) => state.allUser);
  const allUserRefresh = useSelector((state) => state.allUserRefresh);
  const [onlineUser, setOnlineUSer] = useState([0]);
  const logonUser = useSelector((state) => state.loginUser);
  const callCenter = useSelector((state) => state.callCenter);
  const callCenterRefresh = useSelector((state) => state.callCenterRefresh);
  const account = useSelector((state) => state.account);
  const assignedExtension = extension.filter((item) => item.user);
  const [isActiveAgentsOpen, setIsActiveAgentsOpen] = useState(false);
  useEffect(() => {
    async function getData() {
      // const apiData = await generalGetFunction(
      //   `/extension/search?account=1`,
      //   navigate
      // );
      const userApi = await generalGetFunction(
        `/user/search?account=${account.account_id}`,
        navigate
      );
      // if (apiData.status) {
      //   setExtensionList(apiData.data.length);
      // }
      if (userApi?.status) {
        setUserList(userApi.data.length);
      }
    }
    dispatch({
      type: "SET_CALLDETAILSREFRESH",
      callDetailsRefresh: callDetailsRefresh + 1,
    });
    getData();
  }, [navigate]);

  useEffect(() => {
    if (registerUser.length > 0) {

    } else {
    }
    if (extensionRefresh > 0) {
      // setExtensionList(extension.length);
    } else {
      dispatch({
        type: "SET_EXTENSIONREFRESH",
        extensionRefresh: extensionRefresh + 1,
      });
    }

    if (ringGroupRefresh > 0) {
      const filterRinggroup = () => {
        const filteredData = [];
        if (allCall && allCall.calls && ringGroup && ringGroup.length > 0) {
          ringGroup.forEach((obj) => {
            if (allCall.calls.length > 0) {
              allCall.calls.forEach((call) => {
                if (call["Caller-Callee-ID-Number"] === obj.extension) {
                  filteredData.push(call);
                }
              });
            }
          });
        }
        setRingGroupData(
          filteredData.filter(
            (data) => data && data["Call-Direction"] === "inbound"
          )
        );
      };
      filterRinggroup();
    } else {
      dispatch({
        type: "SET_RINGGROUPREFRESH",
        ringGroupRefresh: ringGroupRefresh + 1,
      });
    }

    if (allUserRefresh < 1) {
      dispatch({
        type: "SET_ALLUSERREFRESH",
        allUserRefresh: allUserRefresh + 1,
      });
    }

    if (logonUser && logonUser.length > 0) {
      setOnlineUSer(
        logonUser.map((item) => {
          return item.id;
        })
      );
    }

    if (callCenterRefresh < 1) {
      dispatch({
        type: "SET_CALLCENTERREFRESH",
        callCenterRefresh: callCenterRefresh + 1,
      });
    }
  }, [extension, registerUser, ringGroup, allUser, logonUser, callCenter]);

  useEffect(() => {
    if (callCenterRefresh > 0) {
      const filterCallQueue = () => {
        const filteredData = [];
        if (allCall && allCall.calls && callCenter && callCenter.length > 0) {
          callCenter.forEach((obj) => {
            if (allCall.calls.length > 0) {
              allCall.calls.forEach((call) => {
                if (call["Caller-Callee-ID-Number"] === obj.extension) {
                  filteredData.push(call);
                }
              });
            }
          });
        }
      };
      filterCallQueue();
    } else {
      dispatch({
        type: "SET_CALLCENTERREFRESH",
        callCenterRefresh: callCenterRefresh + 1,
      });
    }
  }, [callCenter, allCall]);

  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row ">
            <Header title="Call Dashboard" />
            <div id="detailsHeader" className="p-0">
              <div className="headerBgWave">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                  <path
                    fill="var(--color2)"
                    fill-opacity="1"
                    d="M0,160L120,186.7C240,213,480,267,720,277.3C960,288,1200,256,1320,240L1440,224L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z"
                  ></path>
                </svg>
              </div>
            </div>
            <div className="col-12 mt-3 tangoNavs">
              <AllCallsDetails />
              <div className="row my-3 gx-xxl-4 gx-lg-3">
                <div className="col-xl-3 col-lg-6 col-md-6 mb-xl-2 mb-lg-2 mb-md-2">
                  <div className="itemWrapper a">
                    <div className="heading h-auto">
                      <div className="d-flex flex-wrap justify-content-between align-items-center">
                        <div className="col-10">
                          <h5>Extensions</h5>
                          {/* <p>7 October, 2024</p> */}
                        </div>
                        <div
                          className="col-2"
                          onClick={() => navigate("/extensions")}
                        >
                          <i className="fa-duotone fa-phone-office"></i>
                        </div>
                      </div>
                    </div>
                    <div className="data-number2">
                      <div className="d-flex flex-wrap justify-content-between align-items-center">
                        <div className="col-10">
                          <h5>{(extension && extension.length)}</h5>
                          <p>
                            {/* {activeCall.length} on Call /{" "} */}
                            {(assignedExtension.length) ||
                              0}{" "}
                            Assigned /{" "}
                            {(extension.length - assignedExtension.length) ||
                              0}{" "}
                            Available
                          </p>
                        </div>
                        <div className="col-2">
                          <img
                            src={require("../../assets/images/icons/diagram.png")}
                            alt="diagram"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-6 col-md-6 mb-xl-2 mb-lg-2 mb-md-2">
                  <div className="itemWrapper a">
                    <div className="heading h-auto">
                      <div className="d-flex flex-wrap justify-content-between align-items-center">
                        <div className="col-10">
                          <h5>Call Center Queue</h5>
                          {/* <p>7 October, 2024</p> */}
                        </div>
                        <div
                          className="col-2"
                          onClick={() => navigate("/cal-center-queue")}
                        >
                          <i className="fa-duotone fa-clock"></i>
                        </div>
                      </div>
                    </div>
                    <div className="data-number2">
                      <div className="d-flex flex-wrap justify-content-between align-items-center">
                        <div className="col-10">
                          <h5>{callCenter.length}</h5>
                          <p>
                            {activeCall.length > 0 ? activeCall
                              .filter((item) => item.application_state === "callcenter" && (item.b_callstate === "ACTIVE" || item.b_callstate === "HELD")).length : 0}{" "}
                            Active Calls
                            {/* /{(ringGroupData &&
                              ringGroupData.filter(
                                (data) =>
                                  data["variable_DIALSTATUS"] !== "SUCCESS"
                              ).length) ||
                              0}{" "}
                            Calls Missed */}
                          </p>
                        </div>
                        <div className="col-2">
                          <img
                            src={require("../../assets/images/icons/diagram.png")}
                            alt="diagram"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-6 col-md-6 mb-xl-2 mb-lg-2 mb-md-2">
                  <div className="itemWrapper a">
                    <div className="heading h-auto">
                      <div className="d-flex flex-wrap justify-content-between align-items-center">
                        <div className="col-10">
                          <h5>Ring Group</h5>
                          {/* <p>7 October, 2024</p> */}
                        </div>
                        <div
                          className="col-2"
                          onClick={() => navigate("/ring-groups")}
                        >
                          <i className="fa-duotone fa-solid fa-bell-ring"></i>
                        </div>
                      </div>
                    </div>

                    <div className="data-number2">
                      <div className="d-flex flex-wrap justify-content-between align-items-center">
                        <div className="col-10">
                          <h5>{ringGroup.length || 0}</h5>
                          <p>
                            {activeCall.length > 0 ? activeCall
                              .filter((item) => item.application_state === "ringgroup" && (item.b_callstate === "ACTIVE" || item.b_callstate === "HELD")).length : 0} Active Calls /{" "}
                            {(ringGroupData &&
                              ringGroupData.filter(
                                (data) =>
                                  data["variable_DIALSTATUS"] !== "SUCCESS"
                              ).length) ||
                              0}{" "}
                            Calls Missed
                          </p>
                        </div>
                        <div className="col-2">
                          <img
                            src={require("../../assets/images/icons/diagram.png")}
                            alt="diagram"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-6 col-md-6 mb-xl-2 mb-lg-2 mb-md-2">
                  <div className="itemWrapper a">
                    <div className="heading h-auto">
                      <div className="d-flex flex-wrap justify-content-between align-items-center">
                        <div className="col-10">
                          <h5>Users</h5>
                          {/* <p>7 October, 2024</p> */}
                        </div>
                        <div className="col-2" onClick={() => navigate("/users")}>
                          <i className="fa-duotone fa-users"></i>
                        </div>
                      </div>
                    </div>
                    <div className="data-number2">
                      <div className="d-flex flex-wrap justify-content-between align-items-center">
                        <div className="col-10">
                          <h5>{(userList) || 0}</h5>
                          <p>
                            {(allUser.data &&
                              allUser.data.filter(
                                (user) =>
                                  user.extension !== null &&
                                  user.extension.extension !== null &&
                                  onlineUser.includes(
                                    user?.id
                                  )
                              ).length) ||
                              0}{" "}
                            Active Users.
                          </p>
                        </div>
                        <div className="col-2">
                          <img
                            alt=""
                            src={require("../../assets/images/icons/diagram.png")}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-12">
              <div className="row gx-xxl-4 gx-lg-3">
                <div className="col-xl-6">
                  <RingGroup />
                </div>
                <div className="col-xl-6">
                  <CallQueueDetails />
                </div>
              </div>
            </div>
            <div className="callDashParkedCalls" style={{ transform: !isActiveAgentsOpen ? 'translate(0, -50%)' : 'translate(97%, -50%)' }}>
              <button onClick={() => setIsActiveAgentsOpen(!isActiveAgentsOpen)} className="callDashParkedCallsBtn">
                <i className={`fa-solid fa-chevron-${isActiveAgentsOpen ? "right" : "left"}`} />
              </button>
              <div className="overviewTableWrapper p-0">
                <div className="overviewTableChild">
                  <div className="d-flex flex-wrap">
                    <div className="col-12">
                      <div className="heading">
                        <div className="content">
                          <h4>Agent Status</h4>
                          <p>You can see all of the active and inactive agents here</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-12" style={{ padding: '0px 10px 0px' }}>
                      <nav className="tangoNavs">
                        <div className="nav nav-tabs" id="nav-tab" role="tablist">
                          <button
                            className="nav-link active"
                            id="nav-online-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-online"
                            type="button"
                            role="tab"
                            aria-controls="nav-online"
                            aria-selected="true"
                          >
                            Online
                          </button>
                          <button
                            className="nav-link"
                            id="nav-offline-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-offline"
                            type="button"
                            role="tab"
                            aria-controls="nav-offline"
                            aria-selected="false"
                          >
                            Offline
                          </button>
                        </div>
                      </nav>
                      <div
                        className="tab-content mt-3"
                        id="nav-tabContent"
                        style={{
                          borderTop: "none",
                          borderRadius: "0px 0px 5px 5px"
                        }}
                      >
                        <div
                          className="tab-pane fade show active"
                          id="nav-online"
                          role="tabpanel"
                          aria-labelledby="nav-online-tab"
                          tabIndex={0}
                        >
                          <div className="tableContainer mt-0">
                            <table>
                              <thead>
                                <tr>
                                  <th>Status</th>
                                  <th>Name</th>
                                  <th>Direction</th>
                                  <th>Origin / Dest</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <span className="extensionStatus online"></span>
                                      <span className="ms-1">Online</span>
                                    </div>
                                  </td>
                                  <td>Agent Name</td>
                                  <td><i class="fa-solid fa-phone-arrow-down-left me-1" style={{ color: "var(--funky-boy3)" }}></i> Inbound</td>
                                  <td>1005</td>
                                </tr>
                                <tr>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <span className="extensionStatus onCall"></span>
                                      <span className="ms-1">On Call</span>
                                    </div>
                                  </td>
                                  <td>Agent Name</td>
                                  <td><i class="fa-solid fa-phone-arrow-up-right me-1" style={{ color: "var(--color3)" }}></i> Outbound</td>
                                  <td>1005</td>
                                </tr>
                                <tr>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <span className="extensionStatus online"></span>
                                      <span className="ms-1">Online</span>
                                    </div>
                                  </td>
                                  <td>Agent Name</td>
                                  <td><i class="fa-solid fa-headset me-1" style={{ color: "var(--color2)" }}></i> Internal</td>
                                  <td>1005</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div
                          className="tab-pane fade"
                          id="nav-offline"
                          role="tabpanel"
                          aria-labelledby="nav-offline-tab"
                          tabIndex={0}
                        >
                          <div className="tableContainer mt-0">
                            <table>
                              <thead>
                                <tr>
                                  <th>Status</th>
                                  <th>Name</th>
                                  <th>Extension</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <span className="extensionStatus offline"></span>
                                      <span className="ms-1">Offline</span>
                                    </div>
                                  </td>
                                  <td>Agent Name</td>
                                  <td>1005</td>
                                </tr>
                                <tr>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <span className="extensionStatus offline"></span>
                                      <span className="ms-1">Offline</span>
                                    </div>
                                  </td>
                                  <td>Agent Name</td>
                                  <td>1005</td>
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
            </div>
          </div>
        </div>
      </section>
      {/* <GlobalCalls /> */}
    </main>
  );
}

export default PhoneDashboard;
