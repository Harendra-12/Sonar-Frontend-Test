/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import AllCallsDetails from "./AllCallsDetails";
import CallQueueDetails from "./CallQueueDetails";
import RingGroup from "./RingGroupDetails";
import { useNavigate } from "react-router-dom";
import { featureUnderdevelopment, generalGetFunction } from "../../GlobalFunction/globalFunction";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../CommonComponents/Header";
import GraphChart from "../../CommonComponents/GraphChart";
import AllActiveAgentStatus from "./AllActiveAgentStatus";


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
  const [graphData, setGraphData] = useState({
    totalCallMin: [],
    numberOfCall: [],
    callCostPerHour: [],
    totalSpent: [],
  })
  const [graphFilter, setGraphFilter] = useState({
    totalCallMin: {
      interval: "4",
      startTime: "27",
    },
    numberOfCall: {
      date: "7_days"
    },
    callCostPerHour: {
      interval: "1",
      startTime: "24",
    },
    totalSpent: [],
  });

  const [graphLoading, setGraphLoading] = useState({
    totalCallMin: 1,
    numberOfCall: 1,
    callCostPerHour: 1
  });

  const [agents, setAgents] = useState([]);

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
    if (registerUser?.length > 0) {

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

  // Fetch Graph API Call
  useEffect(() => {
    fetchNumberOfCallGraphData();
  }, [graphFilter.numberOfCall])

  useEffect(() => {
    fetchTotalCallMinGraphData();
  }, [graphFilter.totalCallMin])

  useEffect(() => {
    fetchTotalCallCostGraphData();
  }, [graphFilter.callCostPerHour])

  // Number Of Call Graph Data
  const fetchNumberOfCallGraphData = async () => {
    const endDate = new Date(); // Current date
    const startDate = new Date(); // Will be modified

    switch (graphFilter.numberOfCall.date) {
      case "3_days":
        startDate?.setDate(endDate.getDate() - 3);
        break;
      case "7_days":
        startDate?.setDate(endDate.getDate() - 7);
        break;
      case "15_days":
        startDate?.setDate(endDate.getDate() - 15);
        break;
      case "30_days":
        startDate?.setDate(endDate.getMonth() - 1);
        break;
      default:
        startDate?.setDate(endDate.getDate() - 7);
    }

    const startDateString = startDate.toISOString().split("T")[0];
    const endDateString = endDate.toISOString().split("T")[0]

    try {
      setGraphLoading((prevGraphLoading) => ({
        ...prevGraphLoading,
        numberOfCall: 1
      }));
      const apiCall = await generalGetFunction(`/cdr-graph-report?start_date=${startDateString}&end_date=${endDateString}`);
      if (apiCall.status) {
        setGraphData((prevGraphData) => ({
          ...prevGraphData,
          numberOfCall: apiCall.filtered
        }))
        setGraphLoading((prevGraphLoading) => ({
          ...prevGraphLoading,
          numberOfCall: 0
        }));
      }
    } catch (err) {
      console.log(err);
    }
  }

  // Call Per Hour Graph Data
  const fetchTotalCallMinGraphData = async () => {
    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date();
    const currentTime = new Date().toTimeString().slice(0, 8);

    switch (graphFilter.totalCallMin.startTime) {
      case "1":
        startDate?.setHours(startDate.getHours() - 1);
        break;
      case "3":
        startDate?.setHours(startDate.getHours() - 3);
        break;
      case "6":
        startDate?.setHours(startDate.getHours() - 6);
        break;
      case "12":
        startDate?.setHours(startDate.getHours() - 12);
        break;
      case "24":
        startDate?.setHours(startDate.getHours() - 24);
        break;
      default:
        startDate?.setHours(0, 0, 0);
    }

    const startDateTimeObj = {
      date: startDate.toISOString().split("T")[0],
      time: startDate.toTimeString().slice(0, 8)
    }

    const startDateTime = `${startDateTimeObj.date} ${startDateTimeObj.time}`;
    const endDateTime = `${endDate} ${currentTime}`;

    try {
      setGraphLoading((prevGraphLoading) => ({
        ...prevGraphLoading,
        totalCallMin: 1
      }));
      const apiCall = await generalGetFunction(`/cdr-graph-report?start_date=${startDateTime}&end_date=${endDateTime}&hours=${graphFilter.totalCallMin.interval}`);
      if (apiCall.status) {
        setGraphData((prevGraphData) => ({
          ...prevGraphData,
          totalCallMin: apiCall.filtered,
        }));
        setGraphLoading((prevGraphLoading) => ({
          ...prevGraphLoading,
          totalCallMin: 0
        }));
      }
    } catch (err) {
      console.log(err);
    }
  }

  // Call Cost Graph Data
  const fetchTotalCallCostGraphData = async () => {
    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date();
    const currentTime = new Date().toTimeString().slice(0, 8);

    switch (graphFilter.callCostPerHour.startTime) {
      case "1":
        startDate?.setHours(startDate.getHours() - 1);
        break;
      case "3":
        startDate?.setHours(startDate.getHours() - 3);
        break;
      case "6":
        startDate?.setHours(startDate.getHours() - 6);
        break;
      case "12":
        startDate?.setHours(startDate.getHours() - 12);
        break;
      case "24":
        startDate?.setHours(startDate.getHours() - 24);
        break;
      default:
        startDate?.setHours(0, 0, 0);
    }

    const startDateTimeObj = {
      date: startDate.toISOString().split("T")[0],
      time: startDate.toTimeString().slice(0, 8)
    }

    const startDateTime = `${startDateTimeObj.date} ${startDateTimeObj.time}`;
    const endDateTime = `${endDate} ${currentTime}`;

    try {
      setGraphLoading((prevGraphLoading) => ({
        ...prevGraphLoading,
        callCostPerHour: 1
      }));
      const apiCall = await generalGetFunction(`/cdr-graph-report?start_date=${startDateTime}&end_date=${endDateTime}&hours=${graphFilter.totalCallMin.interval}`);
      if (apiCall.status) {
        setGraphData((prevGraphData) => ({
          ...prevGraphData,
          callCostPerHour: apiCall.filtered
        }));
        setGraphLoading((prevGraphLoading) => ({
          ...prevGraphLoading,
          callCostPerHour: 0
        }));
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <main className="mainContent">
      <section id="phonePage">
        <Header title="Call Dashboard" />
        <div className="container-fluid pe-4">
          <div className="row">
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
              <div className="row my-3 gx-xxl-3 gx-lg-2">
                <div className="col-xl-3 col-lg-6 col-md-6 mb-xl-2 mb-lg-2 mb-md-2">
                  <div className="itemWrapper a d_card1">
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
                    {/* <div className="heading h-auto">
                      <div className="d-flex flex-wrap justify-content-between align-items-center">
                        <div className="col-10">
                          <h5>Extensions</h5>
                         // <p>7 October, 2024</p>
                        </div>
                        <div
                          className="col-2"
                          onClick={() => navigate("/extensions")}
                        >
                          <i className="fa-duotone fa-phone-office"></i>
                        </div>
                      </div>
                    </div> */}
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
                        {/* <div className="col-2">
                          <img
                            src={require("../../assets/images/icons/diagram.png")}
                            alt="diagram"
                          />
                        </div> */}
                      </div>
                    </div>
                    <div className="d_chartImg">
                      <img
                        src={require("../../assets/images/d-chart1.png")}
                        alt="diagram"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-6 col-md-6 mb-xl-2 mb-lg-2 mb-md-2">
                  <div className="itemWrapper b d_card2 position-relative">
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
                          <h4>{callCenter.length}</h4>
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
                        {/* <div className="col-2">
                          <img
                            src={require("../../assets/images/d-chart.png")}
                            alt="diagram"
                          />
                        </div> */}
                      </div>
                    </div>
                    <div className="d_chartImg">
                      <img
                        src={require("../../assets/images/d-chart2.png")}
                        alt="diagram"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-6 col-md-6 mb-xl-2 mb-lg-2 mb-md-2">
                  <div className="itemWrapper c d_card3">
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
                        {/* <div className="col-2">
                          <img
                            src={require("../../assets/images/icons/diagram.png")}
                            alt="diagram"
                          />
                        </div> */}
                      </div>
                    </div>
                    <div className="d_chartImg">
                      <img
                        src={require("../../assets/images/d-chart3.png")}
                        alt="diagram"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-6 col-md-6 mb-xl-2 mb-lg-2 mb-md-2">
                  <div className="itemWrapper d d_card4">
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
                        {/* <div className="col-2">
                          <img
                            alt=""
                            src={require("../../assets/images/icons/diagram.png")}
                          />
                        </div> */}
                      </div>
                    </div>
                    <div className="d_chartImg">
                      <img
                        src={require("../../assets/images/d-chart2.png")}
                        alt="diagram"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-12">
              <div className="row gx-xxl-3 gx-lg-2">
                <div className="col-xl-6">
                  <RingGroup />
                </div>
                <div className="col-xl-6">
                  <CallQueueDetails />
                </div>
              </div>
            </div>
            <div className="col-xl-12">
              <div className="row gx-xxl-3 gx-lg-2">
                <div className='col-md-4 col-12'>
                  <div className="itemWrapper a">
                    <div className='heading h-auto'>
                      <div className="d-flex flex-wrap justify-content-between align-items-center">
                        <div className='col-auto'>
                          <h5 className="d-flex">Total Call Per Hour
                            <div class="my-auto position-relative ms-3">
                              {/* <label class="switch">
                                <input type="checkbox" id="showAllCheck" onChange={() => featureUnderdevelopment()} />
                                <span class="slider round">
                                </span>
                              </label> */}
                              <div class="cl-toggle-switch">
                                <label class="cl-switch">
                                  <input type="checkbox"
                                    onChange={() => featureUnderdevelopment()}
                                    id="showAllCheck"
                                  />
                                  <span></span>
                                </label>
                              </div>
                            </div>
                          </h5>
                        </div>
                        <div className="col-auto">
                          <ul class="chart_tabs" >
                            <li class="nav-item">
                              <input class="nav-link" type="radio" name="graphTimeFilter"
                                value="1"
                                checked={graphFilter.totalCallMin.startTime === '1'}
                                onChange={(e) =>
                                  setGraphFilter((prevGraphData) => ({
                                    ...prevGraphData,
                                    totalCallMin: {
                                      ...prevGraphData.totalCallMin,
                                      startTime: e.target.value,
                                    },
                                  }))
                                }
                              />
                              <button class="nav-link">1 Hr</button>
                            </li>
                            <li class="nav-item">
                              <input class="nav-link" type="radio" name="graphTimeFilter" value="3"
                                checked={graphFilter.totalCallMin.startTime === '3'}
                                onChange={(e) =>
                                  setGraphFilter((prevGraphData) => ({
                                    ...prevGraphData,
                                    totalCallMin: {
                                      ...prevGraphData.totalCallMin,
                                      startTime: e.target.value,
                                    },
                                  }))
                                }
                              />
                              <button class="nav-link">3 Hr</button>
                            </li>
                            <li class="nav-item">
                              <input class="nav-link" type="radio" name="graphTimeFilter" value="6"
                                checked={graphFilter.totalCallMin.startTime === '6'}
                                onChange={(e) =>
                                  setGraphFilter((prevGraphData) => ({
                                    ...prevGraphData,
                                    totalCallMin: {
                                      ...prevGraphData.totalCallMin,
                                      startTime: e.target.value,
                                    },
                                  }))
                                }
                              />
                              <button class="nav-link">6 Hr</button>
                            </li>
                            <li class="nav-item">
                              <input class="nav-link" type="radio" name="graphTimeFilter" value="12"
                                checked={graphFilter.totalCallMin.startTime === '12'}
                                onChange={(e) =>
                                  setGraphFilter((prevGraphData) => ({
                                    ...prevGraphData,
                                    totalCallMin: {
                                      ...prevGraphData.totalCallMin,
                                      startTime: e.target.value,
                                    },
                                  }))
                                }
                              />
                              <button class="nav-link">12 Hr</button>
                            </li>
                            <li class="nav-item">
                              <input class="nav-link" type="radio" name="graphTimeFilter" value="24"
                                checked={graphFilter.totalCallMin.startTime === '24'}
                                onChange={(e) =>
                                  setGraphFilter((prevGraphData) => ({
                                    ...prevGraphData,
                                    totalCallMin: {
                                      ...prevGraphData.totalCallMin,
                                      startTime: e.target.value,
                                    },
                                  }))
                                }
                              />
                              <button class="nav-link">24 Hr</button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className='d-flex flex-wrap justify-content-between mt-1'>
                      {graphLoading.totalCallMin == 1 ? (
                        <div className="deviceProvision position-relative" style={{ width: '500px', height: '240px' }}>
                          <div className="itemWrapper a addNew d-flex justify-content-center align-items-center shadow-none">
                            <i class="fa-solid fa-spinner-third fa-spin fs-3"></i>
                          </div>
                        </div>) :
                        <GraphChart
                          height={'240px'}
                          chartType="multiple"
                          label1={"Inbound"}
                          label2={"Outbound"}
                          label3={"Internal"}
                          label4={"Missed"}
                          type={"bar"}
                          fields={graphData?.totalCallMin?.map((item, index) => {
                            const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                            const day = weekday[new Date(item.start_time).getDay()].replace('day', '');
                            const time = new Date(item.start_time).getHours().toString().padStart(2, '0') + ":" + new Date(item.start_time).getMinutes().toString().padStart(2, '0');
                            return `${time}`
                          })}
                          percentage={[graphData?.totalCallMin?.map((item, index) => item.inbound), graphData?.totalCallMin?.map((item, index) => item.outbound), graphData?.totalCallMin?.map((item, index) => item.internal), graphData?.totalCallMin?.map((item, index) => item.missed)]}
                          colors={["#05b62c", "#00fd79", "#ff7900", "#dd2e2f"]}
                        />
                      }

                    </div>
                  </div>
                </div>
                <div className='col-md-4 col-12'>
                  <div className="itemWrapper a">
                    <div className='heading h-auto'>
                      <div className="d-flex flex-wrap justify-content-between align-items-center">
                        <div className='col-auto'>
                          <h5 className="d-flex">Number of Call
                            <div class="my-auto position-relative ms-3">
                              {/* <label class="switch">
                                <input type="checkbox" id="showAllCheck" onChange={() => featureUnderdevelopment()} />
                                <span class="slider round">
                                </span>
                              </label> */}
                              <div class="cl-toggle-switch">
                                <label class="cl-switch">
                                  <input type="checkbox"
                                    onChange={() => featureUnderdevelopment()}
                                    id="showAllCheck"
                                  />
                                  <span></span>
                                </label>
                              </div>
                            </div>
                          </h5>
                        </div>
                        <div className="col-auto">
                          <div className="formRow border-0 p-0" style={{ minHeight: 'revert' }}>
                            <ul class="chart_tabs" >
                              <li class="nav-item">
                                <input class="nav-link" type="radio" name="graphFilter"
                                  value="3_days"
                                  checked={graphFilter.numberOfCall.date === '3_days'}
                                  onChange={(e) =>
                                    setGraphFilter((prevGraphData) => ({
                                      ...prevGraphData,
                                      numberOfCall: {
                                        ...prevGraphData.numberOfCall,
                                        date: e.target.value,
                                      },
                                    }))
                                  }
                                />
                                <button class="nav-link">3 Days</button>
                              </li>
                              <li class="nav-item">
                                <input class="nav-link" type="radio" name="graphFilter"
                                  value="7_days"
                                  checked={graphFilter.numberOfCall.date === '7_days'}
                                  onChange={(e) =>
                                    setGraphFilter((prevGraphData) => ({
                                      ...prevGraphData,
                                      numberOfCall: {
                                        ...prevGraphData.numberOfCall,
                                        date: e.target.value,
                                      },
                                    }))
                                  }
                                />
                                <button class="nav-link">7 Days</button>
                              </li>
                              <li class="nav-item">
                                <input class="nav-link" type="radio" name="graphFilter" value="15_days"
                                  checked={graphFilter.numberOfCall.date === '15_days'}
                                  onChange={(e) =>
                                    setGraphFilter((prevGraphData) => ({
                                      ...prevGraphData,
                                      numberOfCall: {
                                        ...prevGraphData.numberOfCall,
                                        date: e.target.value,
                                      },
                                    }))
                                  }
                                />
                                <button class="nav-link">15 Days</button>
                              </li>
                              <li class="nav-item">
                                <input class="nav-link" type="radio" name="graphFilter" value="30_days"
                                  checked={graphFilter.numberOfCall.date === '30_days'}
                                  onChange={(e) =>
                                    setGraphFilter((prevGraphData) => ({
                                      ...prevGraphData,
                                      numberOfCall: {
                                        ...prevGraphData.numberOfCall,
                                        date: e.target.value,
                                      },
                                    }))
                                  }
                                />
                                <button class="nav-link">1 Month</button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='d-flex flex-wrap justify-content-between mt-1'>
                      {graphLoading.numberOfCall == 1 ? (
                        <div className="deviceProvision position-relative" style={{ width: '500px', height: '240px' }}>
                          <div className="itemWrapper a addNew d-flex justify-content-center align-items-center shadow-none">
                            <i class="fa-solid fa-spinner-third fa-spin fs-3"></i>
                          </div>
                        </div>
                      ) :
                        <GraphChart
                          height={'240px'}
                          chartType="multiple"
                          label1={"Inbound"}
                          label2={"Outbound"}
                          label3={"Internal"}
                          label4={"Missed"}
                          type={"line"}
                          fields={graphData?.numberOfCall?.map((item, index) => item.start_date)}
                          percentage={[graphData?.numberOfCall?.map((item, index) => item.inbound), graphData?.numberOfCall?.map((item, index) => item.outbound), graphData?.numberOfCall?.map((item, index) => item.internal), graphData?.numberOfCall?.map((item, index) => item.missed)]}
                          colors={["#05b62c", "#00fd79", "#ff7900", "#dd2e2f"]}
                        />}
                    </div>
                  </div>
                </div>
                <div className='col-md-4 col-12'>
                  <div className="itemWrapper a">
                    <div className='heading h-auto'>
                      <div className="d-flex flex-wrap justify-content-between align-items-center">
                        <div className='col-auto'>
                          <h5 className="d-flex">Call Cost Per Hour
                            <div class="my-auto position-relative ms-3">
                              {/* <label class="switch">
                                <input type="checkbox" id="showAllCheck" onChange={() => featureUnderdevelopment()} />
                                <span class="slider round">
                                </span>
                              </label> */}
                              <div class="cl-toggle-switch">
                                <label class="cl-switch">
                                  <input type="checkbox"
                                    onChange={() => featureUnderdevelopment()}
                                    id="showAllCheck"
                                  />
                                  <span></span>
                                </label>
                              </div>
                            </div>
                          </h5>
                        </div>
                        <div className="col-auto">
                          <ul class="chart_tabs" >
                            <li class="nav-item">
                              <input class="nav-link" type="radio" name="graphCostFilter"
                                value="1"
                                checked={graphFilter.callCostPerHour.startTime === '1'}
                                onChange={(e) =>
                                  setGraphFilter((prevGraphData) => ({
                                    ...prevGraphData,
                                    callCostPerHour: {
                                      ...prevGraphData.callCostPerHour,
                                      startTime: e.target.value,
                                    },
                                  }))
                                }
                              />
                              <button class="nav-link">1 Hr</button>
                            </li>
                            <li class="nav-item">
                              <input class="nav-link" type="radio" name="graphCostFilter" value="3"
                                checked={graphFilter.callCostPerHour.startTime === '3'}
                                onChange={(e) =>
                                  setGraphFilter((prevGraphData) => ({
                                    ...prevGraphData,
                                    callCostPerHour: {
                                      ...prevGraphData.callCostPerHour,
                                      startTime: e.target.value,
                                    },
                                  }))
                                }
                              />
                              <button class="nav-link">3 Hr</button>
                            </li>
                            <li class="nav-item">
                              <input class="nav-link" type="radio" name="graphCostFilter" value="6"
                                checked={graphFilter.callCostPerHour.startTime === '6'}
                                onChange={(e) =>
                                  setGraphFilter((prevGraphData) => ({
                                    ...prevGraphData,
                                    callCostPerHour: {
                                      ...prevGraphData.callCostPerHour,
                                      startTime: e.target.value,
                                    },
                                  }))
                                }
                              />
                              <button class="nav-link">6 Hr</button>
                            </li>
                            <li class="nav-item">
                              <input class="nav-link" type="radio" name="graphCostFilter" value="12"
                                checked={graphFilter.callCostPerHour.startTime === '12'}
                                onChange={(e) =>
                                  setGraphFilter((prevGraphData) => ({
                                    ...prevGraphData,
                                    callCostPerHour: {
                                      ...prevGraphData.callCostPerHour,
                                      startTime: e.target.value,
                                    },
                                  }))
                                }
                              />
                              <button class="nav-link">12 Hr</button>
                            </li>
                            <li class="nav-item">
                              <input class="nav-link" type="radio" name="graphCostFilter" value="24"
                                checked={graphFilter.callCostPerHour.startTime === '24'}
                                onChange={(e) =>
                                  setGraphFilter((prevGraphData) => ({
                                    ...prevGraphData,
                                    callCostPerHour: {
                                      ...prevGraphData.callCostPerHour,
                                      startTime: e.target.value,
                                    },
                                  }))
                                }
                              />
                              <button class="nav-link">24 Hr</button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className='d-flex flex-wrap justify-content-between mt-1'>
                      {graphLoading.callCostPerHour == 1 ?
                        (
                          <div className="deviceProvision position-relative" style={{ width: '500px', height: '240px' }}>
                            <div className="itemWrapper a addNew d-flex justify-content-center align-items-center shadow-none">
                              <i class="fa-solid fa-spinner-third fa-spin fs-3"></i>
                            </div>
                          </div>
                        ) :
                        <GraphChart
                          height={'240px'}
                          chartType="multiple"
                          label1={"Inbound"}
                          label2={"Outbound"}
                          label3={"Internal"}
                          label4={"Missed"}
                          type={"bar"}
                          fields={graphData?.callCostPerHour?.map((item, index) => {
                            const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                            const day = weekday[new Date(item.start_time).getDay()].replace('day', '');
                            const time = new Date(item.start_time).getHours().toString().padStart(2, '0') + ":" + new Date(item.start_time).getMinutes().toString().padStart(2, '0');
                            return `${time}`
                          })}
                          percentage={[graphData?.callCostPerHour?.map((item, index) => item.inbound_call_cost), graphData?.callCostPerHour?.map((item, index) => item.outbound_call_cost)]}
                          colors={["#05b62c", "#00fd79", "#ff7900", "#dd2e2f"]}
                        />
                      }
                    </div>
                  </div>
                </div>
                {/* <div className='col-3 d-xxl-block d-xl-none'>
                  <div className="itemWrapper a">
                    <div className='heading h-auto'>
                      <div className="d-flex flex-wrap justify-content-between">
                        <div className='col-9'>
                          <h5>Amount Cost Per Call </h5>
                        </div>
                      </div>
                    </div>
                    <div className='d-flex flex-wrap justify-content-between mt-1'>
                      <GraphChart
                        height={'240px'}
                        // chartType="singleLine"
                        label1={"Wallet"}
                        label2={"Card"}
                        // labels={[ "Field 1", "Field 2"]}
                        fields={[
                          "0s",
                          "10s",
                          "20s",
                          "30s",
                          "40s",
                          "50s",
                          "60s",
                        ]}
                        percentage={[
                          [10, 12, 14, 16, 24, 14, 16], // CPU Usage
                          [8, 15, 20, 18, 25, 10, 12], // Memory Usage
                        ]}
                        colors={["#f18f01", "#36A2EB"]}
                      />
                    </div>
                  </div>
                </div>
                <div className='col-3 d-xxl-block d-xl-none'>
                  <div className="itemWrapper a">
                    <div className='heading h-auto'>
                      <div className="d-flex flex-wrap justify-content-between">
                        <div className='col-9'>
                          <h5>Total Spent</h5>
                        </div>
                      </div>
                    </div>
                    <div className='d-flex flex-wrap justify-content-between mt-1'>
                      <GraphChart
                        height={'240px'}
                        // chartType="singleLine"
                        label1={"Wallet"}
                        label2={"Card"}
                        // labels={[ "Field 1", "Field 2"]}
                        fields={[
                          "0s",
                          "10s",
                          "20s",
                          "30s",
                          "40s",
                          "50s",
                          "60s",
                        ]}
                        percentage={[
                          [10, 12, 14, 16, 24, 14, 16], // CPU Usage
                          [8, 15, 20, 18, 25, 10, 12], // Memory Usage
                        ]}
                        colors={["#f18f01", "#36A2EB"]}
                      />
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
            <AllActiveAgentStatus isActiveAgentsOpen={isActiveAgentsOpen} setIsActiveAgentsOpen={setIsActiveAgentsOpen} />
          </div>
        </div>
      </section>
      {/* <GlobalCalls /> */}
    </main >
  );
}

export default PhoneDashboard;
