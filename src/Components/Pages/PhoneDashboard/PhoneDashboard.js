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
  // const account = useSelector((state) => state.account)
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
  const [onlineExtension, setOnlineExtension] = useState([0]);
  const allUser = useSelector((state) => state.allUser);
  const allUserRefresh = useSelector((state) => state.allUserRefresh);
  const [onlineUser, setOnlineUSer] = useState([0]);
  const logonUser = useSelector((state) => state.loginUser);
  const callCenter = useSelector((state) => state.callCenter);
  const callCenterRefresh = useSelector((state) => state.callCenterRefresh);
  const [callQueue, setCallQueue] = useState([]);
  const account = useSelector((state) => state.account);
  const assignedExtension = extension.filter((item) => item.user);
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
      setOnlineExtension(
        registerUser.map((item) => {
          return item.extension;
        })
      );
    } else {
      setOnlineExtension([0]);
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
        setCallQueue(
          filteredData.filter(
            (data) => data && data["Call-Direction"] === "inbound"
          )
        );
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
              <div className="row my-3">
                <div className="col-xl-3 col-lg-6 col-md-6 mb-xl-2 mb-lg-2 mb-md-2">
                  <div className="itemWrapper a">
                    <div className="heading h-auto">
                      <div class="d-flex flex-wrap justify-content-between align-items-center">
                        <div class="col-10">
                          <h5>Extensions</h5>
                          {/* <p>7 October, 2024</p> */}
                        </div>
                        <div
                          class="col-2"
                          onClick={() => navigate("/extensions")}
                        >
                          <i class="fa-duotone fa-phone-office"></i>
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
                      <div class="d-flex flex-wrap justify-content-between align-items-center">
                        <div class="col-10">
                          <h5>Call Center Queue</h5>
                          {/* <p>7 October, 2024</p> */}
                        </div>
                        <div
                          class="col-2"
                          onClick={() => navigate("/cal-center-queue")}
                        >
                          <i class="fa-duotone fa-clock"></i>
                        </div>
                      </div>
                    </div>
                    <div className="data-number2">
                      <div className="d-flex flex-wrap justify-content-between align-items-center">
                        <div className="col-10">
                          <h5>{callCenter.length}</h5>
                          <p>
                            {(callCenter &&
                              callQueue &&
                              callQueue.filter((data) =>
                                callCenter.some(
                                  (call) =>
                                    data["Caller-Callee-ID-Number"] ===
                                    call.extension &&
                                    data["variable_DIALSTATUS"] === "SUCCESS"
                                )
                              ).length) ||
                              0}{" "}
                            Inbound (Answered)
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
                      <div class="d-flex flex-wrap justify-content-between align-items-center">
                        <div class="col-10">
                          <h5>Ring Group</h5>
                          {/* <p>7 October, 2024</p> */}
                        </div>
                        <div
                          class="col-2"
                          onClick={() => navigate("/ring-groups")}
                        >
                          <i class="fa-duotone fa-solid fa-bell-ring"></i>
                        </div>
                      </div>
                    </div>

                    <div className="data-number2">
                      <div className="d-flex flex-wrap justify-content-between align-items-center">
                        <div className="col-10">
                          <h5>{ringGroup.length || 0}</h5>
                          <p>
                            {activeCall.length} Active Calls /{" "}
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
                      <div class="d-flex flex-wrap justify-content-between align-items-center">
                        <div class="col-10">
                          <h5>Users</h5>
                          {/* <p>7 October, 2024</p> */}
                        </div>
                        <div class="col-2" onClick={() => navigate("/users")}>
                          <i class="fa-duotone fa-users"></i>
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
            <div className="col-xl-6">
              <RingGroup />
            </div>
            <div className="col-xl-6">
              <CallQueueDetails />
            </div>
          </div>
        </div>
      </section>
      {/* <GlobalCalls /> */}
    </main>
  );
}

export default PhoneDashboard;
