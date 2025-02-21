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
import DoughnutChart from "../../CommonComponents/DoughnutChart";
import GraphChart from "../../CommonComponents/GraphChart";
import { use } from "react";

function PhoneDashboard() {
  const [calls, setCalls] = useState(true);
  const [group, setGroup] = useState(false);
  const [queue, setQueue] = useState(false);
  const navigate = useNavigate();
  // const account = useSelector((state) => state.account)
  const [extensionList, setExtensionList] = useState(0);
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
  const accountDetails = useSelector((state) => state.accountDetails);
  const account = useSelector((state) => state.account);

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
      setExtensionList(extension.length);
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
            {/* <div
                  className="row pt-3 justify-content-between"
                  style={{}}
                >
                  <div className="col-xl-4 col-6 my-auto">
                      <div className="position-relative searchBox">
                          <input
                              type="search"
                              name="Search"
                              id="headerSearch"
                              placeholder="Looking for an option?"
                          />
                      </div>
                  </div>
                  <div className="col-xl-8 col-6">
                      <div className="d-flex justify-content-end">
                          <button
                              effect="ripple"
                              className="appPanelButton"
                          >
                              <i className="fa-duotone fa-pen" />
                          </button>
                          <button
                              effect="ripple"
                              className="appPanelButton"
                          >
                              <i className="fa-duotone fa-message" />
                          </button>
                          <button
                              effect="ripple"
                              className="appPanelButton"
                          >
                              <i className="fa-duotone fa-gear" />
                          </button>
                      </div>
                  </div>
              </div> */}
            <div className="col-12 mt-3 tangoNavs">
              <div className="col-12 mt-3">
                <div className="row">
                  <div className="col-xl-4 tabButtonParent">
                    <button
                      className={calls ? "tabButton active" : "tabButton"}
                      onClick={() => setCalls(!calls)}
                      data-id={1}
                    >
                      Calls
                    </button>
                  </div>
                  <div className="col-xl-4 tabButtonParent">
                    <button
                      className={group ? "tabButton active" : "tabButton"}
                      onClick={() => setGroup(!group)}
                      data-id={2}
                    >
                      Ring Group
                    </button>
                  </div>
                  <div className="col-xl-4 tabButtonParent">
                    <button
                      className={queue ? "tabButton active" : "tabButton"}
                      onClick={() => setQueue(!queue)}
                      data-id={3}
                    >
                      Call Queue
                    </button>
                  </div>
                </div>
              </div>
              {calls ? <AllCallsDetails /> : ""}
              {group ? <RingGroup /> : ""}
              {queue ? <CallQueueDetails /> : ""}
              <div className="row mt-3">
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
                          <h5>{(extension && extension.length) || 0}</h5>
                          <p>
                            {activeCall.length} on Call /{" "}
                            {(extension &&
                              extension.length -
                              extension.filter((extension) =>
                                onlineExtension.includes(extension.extension)
                              ).length) ||
                              0}{" "}
                            Offline /{" "}
                            {(extension &&
                              extension.filter((extension) =>
                                onlineExtension.includes(extension.extension)
                              ).length) ||
                              0}{" "}
                            Online
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
                             {/* /{" "}
                            {(allUser.data &&
                              allUser.data.length -
                              allUser.data.filter((user) => {
                                user.extension !== null &&
                                  user.extension.extension !== null &&
                                  onlineUser.includes(
                                    user?.extension?.extension
                                  );
                              }).length) ||
                              0}{" "}
                            Idle Users /{" "}
                            {(allUser.data &&
                              allUser.data.filter((user) =>
                                activeCall.some(
                                  (call) =>
                                    call.dest === user?.extension?.extension
                                )
                              ).length) ||
                              0}{" "}
                            On Call */}
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
                    {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/user'" effect="ripple"><i className="fa-duotone fa-users"></i> View All Users</button> */}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 mt-4 mb-2 chartWrapper">
              <div className="row">
                <div className="col-xl-3">
                  <div className="wrapper">
                    <DoughnutChart
                      fields={[
                        "Online Extension",
                        "Register Extension",
                        "Available Extension",
                      ]}
                      percentage={[
                        registerUser.length,
                        extensionList,
                        Number(accountDetails.package?.number_of_user) -
                        extensionList,
                      ]}
                      colors={["#9999", "#FF638470", "#36A2EB70"]}
                    />
                  </div>
                </div>
                <div className="col-xl-3">
                  <div className="wrapper">
                    <DoughnutChart
                      fields={["Registered Users", "Available Users"]}
                      percentage={[
                        userList,
                        Number(accountDetails.package?.number_of_user) -
                        userList,
                      ]}
                      centerTitle={`${userList}/${Number(
                        accountDetails.package?.number_of_user
                      )}`}
                      centerDesc="Total Users Available"
                      colors={["#36A2EB70", "#f17d0170", "#FF638470"]}
                    />
                  </div>
                  {/* <div className='circularProgressWrapper'>
                                        <svg width="250" height="250" viewBox="0 0 250 250" className="circular-progress" style={{ '--progress': `50` }}>
                                            <circle className="bg"
                                                cx="125" cy="125" r="115" fill="none" stroke="#f18f0130" stroke-width="20"
                                            ></circle>
                                            <circle className="fg"
                                                cx="125" cy="125" r="115" fill="none" stroke="#f18f01" stroke-width="20"
                                                stroke-dasharray="361.25 361.25"
                                            ></circle>
                                        </svg>
                                        <div className='circularProgressContent'>
                                            <div className="data-number">
                                                <label style={{ color: '#f18f01' }}>{userList}</label> <span>/ 69</span>
                                            </div>
                                            <p>Total Users Created</p>
                                        </div>
                                    </div> */}
                </div>
                <div className="col-xl-6">
                  <div className="wrapper">
                    <GraphChart
                      fields={["Available Extension", "Registered Extension"]}
                      percentage={[
                        ((Number(accountDetails.package?.number_of_user) -
                          extensionList) *
                          100) /
                        Number(accountDetails.package?.number_of_user),
                        (extensionList * 100) /
                        Number(accountDetails.package?.number_of_user),
                      ]}
                      centerTitle={`${extensionList}/${accountDetails.package?.number_of_user}`}
                      centerDesc="Total Extensions"
                      colors={["#f18f01", "#36A2EB"]}
                    />
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
