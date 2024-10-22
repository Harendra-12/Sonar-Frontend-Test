/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useMemo, useState } from "react";
import Clock from 'react-clock';
import { useDispatch, useSelector } from "react-redux";
import Header from "../../CommonComponents/Header";
import DoughnutChart from "../../CommonComponents/DoughnutChart";
import GraphChart from "../../CommonComponents/GraphChart";
import { Link, useNavigate } from "react-router-dom";
import 'react-clock/dist/Clock.css';
const Dashboard = () => {
  const callDetailsRefresh = useSelector((state) => state.callDetailsRefresh);
  const ringGroupRefresh = useSelector((state) => state.ringGroupRefresh);
  const callCenterRefresh = useSelector((state) => state.callCenterRefresh);
  const account = useSelector((state) => state.account);
  const accountDetails = useSelector((state) => state.accountDetails);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const extensionRefresh = useSelector((state) => state.extensionRefresh);
  const allUserRefresh = useSelector((state) => state.allUserRefresh);
  const extensionList = useSelector((state) => state.extension).length;
  const userList = useSelector((state) => state.allUser?.data?.length) || 0;
  const ringGroup = useSelector((state) => state.ringGroup || []);
  const allCall = useSelector((state) => state.allCall || {});
  const activeCall = useSelector((state) => state.activeCall || []);
  const callCenter = useSelector((state) => state.callCenter || []);
  const extension = useSelector((state) => state.extension || []);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const [ringGroupCardData, setringGroupCardData] = useState({
    total: {
      count: 0,
      inbound: 0,
      outbound: 0,
    },
    active: {
      count: 0,
      inbound: 0,
      outbound: 0,
    },
    totalCalls: {
      count: 0,
      waiting_one: 0, //change accordingly
      waiting_two: 0, //change accordingly
    },
    missed: {
      count: 0,
      missed_one: 0,
      missed_two: 0,
    },
  });

  const [callCenterQueue, setCallCenterQueue] = useState({
    total: {
      count: 0,
      active: 0,
      inactive: 0,
    },
    totalAgents: {
      count: 0,
      inQueue: 0,
      notInQueue: 0,
    },
    totalCalls: {
      count: 0,
      inbound: 0,
      outbound: 0,
    },
    missedCalls: {
      count: 0,
      overflow: 0,
      abandoned: 0,
    },
  });

  const [callCardData, setCallCardData] = useState({
    handled: {
      count: 0,
      inboundAnswered: 0,
      outboundAnswered: 0,
    },
    minutes: {
      count: 0,
      inboundAnswered: 0,
      outboundConnected: 0,
    },
    missedCalls: {
      count: 0,
      voiceMissed: 0,
      callMissed: 0,
    },
    abandonedCalls: {
      count: 0,
      internal: 0,
      external: 0,
    },
  });

  const getExtensionsArr = (type) => {
    if (type == "ring") return new Set(ringGroup.map((ring) => ring.extension));
    else if (type == "call")
      return new Set(callCenter.map((call) => call.extension));
  };

  const combinedCallData = useMemo(() => {
    if (!allCall || !Array.isArray(allCall.calls)) return null;

    const callCenterExtensions = getExtensionsArr("call");

    let totalCalls = 0;
    let inboundAnswered = 0;
    let outboundAnswered = 0;
    let missedCalls = 0;
    let inboundAnsweredMinutes = 0;
    let outboundConnectedMinutes = 0;
    let abandonedCall = 0;
    let callQueueTotal = 0;
    let callQueueMissed = 0;

    const calls = [...allCall.calls];

    for (const call of calls) {
      totalCalls++;

      if (call["Hangup-Cause"] === "ORIGINATOR_CANCEL") {
        missedCalls++;
        callQueueMissed++;
      }

      if (
        call["Call-Direction"] === "inbound" &&
        Number(call.variable_billsec) > 0
      ) {
        inboundAnswered++;
        inboundAnsweredMinutes += Number(call.variable_billsec);
      } else if (
        call["Call-Direction"] === "outbound" &&
        Number(call.variable_billsec) > 0
      ) {
        outboundAnswered++;
        outboundConnectedMinutes += Number(call.variable_billsec);
      }

      if (call["Hangup-Cause"] === "NO_ROUTE_DESTINATION") {
        abandonedCall++;
      }

      if (
        callCenterExtensions.has(
          call.variable_sip_from_user || call.variable_sip_to_user
        )
      ) {
        callQueueTotal++;
      }
    }

    const totalTime = allCall.calls.reduce((time, call) => {
      return time + (call.variable_billsec ? Number(call.variable_billsec) : 0);
    }, 0);

    return {
      callCardData: {
        handled: {
          count: totalCalls,
          inboundAnswered,
          outboundAnswered,
        },
        minutes: {
          count: totalTime,
          inboundAnswered: inboundAnsweredMinutes,
          outboundConnected: outboundConnectedMinutes,
        },
        missedCalls: {
          count: missedCalls,
          voiceMissed: 0,
          callMissed: missedCalls,
        },
        abandonedCalls: {
          count: abandonedCall,
          internal: 0,
          external: 0,
        },
      },
      callCenterQueue: {
        totalAgents: {
          count: callCenter.reduce(
            (totalAgents, queue) =>
              totalAgents + (queue.agents ? queue.agents.length : 0),
            0
          ),
          inQueue: 0,
          notInQueue: 0,
        },
        total: {
          count: callCenter.length,
          active: 0,
          inactive: 0,
        },
        totalCalls: {
          count: callQueueTotal,
          inbound: 0,
          outbound: 0,
        },
        missedCalls: {
          count: callQueueMissed,
          overflow: 0,
          abandoned: 0,
        },
      },
    };
  }, [allCall, callCenter]);

  const activeCallData = useMemo(() => {
    if (!ringGroup || !activeCall || !Array.isArray(activeCall)) return null;

    const ringGroupExtensions = getExtensionsArr("ring");
    const calls = [...activeCall];

    let totalCount = 0;
    let inboundCount = 0;
    let outboundCount = 0;

    for (const call of calls) {
      if (ringGroupExtensions.has(call.dest)) {
        totalCount++;
        if (call.direction === "inbound") {
          inboundCount++;
        } else if (call.direction === "outbound") {
          outboundCount++;
        }
      }
    }

    return {
      totalCount,
      inboundCount,
      outboundCount,
    };
  }, [activeCall, ringGroup]);

  const ringGroupData = useMemo(() => {
    if (!ringGroup || !allCall || !Array.isArray(allCall.calls)) return null;

    const ringGroupExtensions = getExtensionsArr("ring");
    const calls = [...allCall.calls];

    let totalCount = 0;
    let inboundCount = 0;
    let outboundCount = 0;
    let missedCount = 0;

    for (const call of calls) {
      if (ringGroupExtensions.has(call.variable_sip_from_user)) {
        totalCount++;
        if (call["Call-Direction"] === "inbound") {
          inboundCount++;
        } else if (call["Call-Direction"] === "outbound") {
          outboundCount++;
        }

        if (call["Hangup-Cause"] === "ORIGINATOR_CANCEL") {
          missedCount++;
        }
      }
    }

    return {
      total: {
        count: ringGroup.length || 0,
        inbound: inboundCount,
        outbound: outboundCount,
      },
      missed: {
        count: missedCount,
        missed_one: 0, // Customize as needed
        missed_two: 0, // Customize as needed
      },
      totalCalls: {
        count: totalCount,
        waiting_one: 0, //change accordingly
        waiting_two: 0, //change accordingly
      },
    };
  }, [ringGroup, allCall]);

  useEffect(() => {
    if (combinedCallData) {
      setCallCardData(combinedCallData.callCardData);
      setCallCenterQueue(combinedCallData.callCenterQueue);
    }
  }, [combinedCallData]);

  useEffect(() => {
    if (ringGroupData) {
      setringGroupCardData((prevData) => ({
        ...prevData,
        total: ringGroupData.total,
        missed: ringGroupData.missed,
        totalCalls: ringGroupData.totalCalls,
      }));
    }
  }, [ringGroupData]);

  useEffect(() => {
    if (activeCallData) {
      setringGroupCardData((prevData) => ({
        ...prevData,
        active: {
          count: activeCallData.totalCount,
          inbound: activeCallData.inboundCount,
          outbound: activeCallData.outboundCount,
        },
      }));
    }
  }, [activeCallData]);

  useEffect(() => {
    if (extension.length == 0) {
      dispatch({
        type: "SET_EXTENSIONREFRESH",
        extensionRefresh: extensionRefresh + 1,
      });
    }
    if (userList == 0) {
      dispatch({
        type: "SET_ALLUSERREFRESH",
        allUserRefresh: allUserRefresh + 1,
      });
    }
    dispatch({
      type: "SET_CALLDETAILSREFRESH",
      callDetailsRefresh: callDetailsRefresh + 1,
    });
    if (ringGroup.length == 0) {
      dispatch({
        type: "SET_RINGGROUPREFRESH",
        ringGroupRefresh: ringGroupRefresh + 1,
      });
    }
    if (callCenter.length == 0) {
      dispatch({
        type: "SET_CALLCENTERREFRESH",
        callCenterRefresh: callCenterRefresh + 1,
      });
    }
  }, []);

  const downloadImage = async (imageUrl, fileName) => {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the image:", error);
    }
  };

  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row ">
            <Header title="Dashboard" />
          </div>
        </div>
        <div className="container-fluid">
          <div className="row ">
            <div className="col-12 mt-3 tangoNavs">
              <nav>
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                  {/* <button
                    className="nav-link active"
                    id="nav-sys-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#nav-sys"
                    type="button"
                    role="tab"
                    aria-controls="nav-sys"
                    aria-selected="true"
                  >
                    System
                  </button> */}
                  <button
                    className="nav-link active"
                    id="nav-customer-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#nav-customer"
                    type="button"
                    role="tab"
                    aria-controls="nav-customer"
                    aria-selected="false"
                  >
                    My Information
                  </button>
                  <button
                    className="nav-link"
                    id="nav-home-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#nav-calls"
                    type="button"
                    role="tab"
                    aria-controls="nav-calls"
                    aria-selected="true"
                  >
                    Calls
                  </button>
                  <button
                    className="nav-link"
                    id="nav-contact-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#nav-billing"
                    type="button"
                    role="tab"
                    aria-controls="nav-billing"
                    aria-selected="false"
                  >
                    Billing
                  </button>
                </div>
              </nav>
              <div className="tab-content mt-3" id="nav-tabContent">
                {/* <div className="tab-pane fade show active" id="nav-sys" role="tabpanel"
                  aria-labelledby="nav-sys-tab" tabIndex="0">
                  <div className="row">
                    <div className="col-xl-12">
                      <div className="row">
                        <div className="col-xl-3">
                          <div className="itemWrapper c">
                            <div className="heading">
                              <div className="d-flex flex-wrap justify-content-between align-items-center">
                                <div className="col-10">
                                  <h5>Current Time</h5>
                                  <p>
                                    {new Date().getDate()}{" "}
                                    {new Date().toLocaleString("default", {
                                      month: "long",
                                    })}
                                    , {new Date().getFullYear()}
                                  </p>
                                </div>
                                <div className="col-2">
                                  <i class="fa-solid fa-clock"></i>
                                </div>
                              </div>
                            </div>
                            <div className="data-number2">
                              <div className="d-flex flex-wrap justify-content-between align-items-center">
                                <div className="col-10">
                                  <h5>{new Date().toLocaleTimeString("en-US", {
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                  })}</h5>
                                  <p>
                                    Timezone - {Intl.DateTimeFormat().resolvedOptions().timeZone}
                                  </p>
                                </div>
                                <div className="col-2">
                                  <Clock value={currentTime} size={50} secondHandWidth={1} renderMinuteMarks={false} hourMarksWidth={1} hourMarksLength={15} hourHandWidth={2} minuteHandWidth={1} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-3">
                          <div className="itemWrapper b">
                            <div className="heading">
                              <div className="d-flex flex-wrap justify-content-between">
                                <div className="col-10">
                                  <h5>Network Info</h5>
                                </div>
                                <div className="col-2">
                                  <i class="fa-solid fa-wifi"></i>
                                </div>
                              </div>
                            </div>
                            <div className="data-number2">
                              <div className="d-flex flex-wrap justify-content-between align-items-center">
                                <div className="col-10">
                                  <h5 className="text-success">Online</h5>
                                  <p>Hostname - www.hostname.com</p>
                                  <p>IP Address  - 0.0.0.0</p>
                                </div>
                                <div className="col-2">
                                  <img
                                    alt="dashboard"
                                    src={require("../../assets/images/icons/local-area-network.png")}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-3">
                          <div className="itemWrapper a">
                            <div className="heading">
                              <div className="d-flex flex-wrap justify-content-between">
                                <div className="col-10">
                                  <h5>Traffic</h5>
                                  <p>0.0.0.0</p>
                                </div>
                                <div className="col-2">
                                  <i class="fa-solid fa-chart-line"></i>
                                </div>
                              </div>
                            </div>
                            <div className="data-number2">
                              <div className="d-flex flex-wrap justify-content-between align-items-center">
                                <div className="col-10">
                                  <h5>pbx.domain.com</h5>
                                  <p>Send - 90 Kbps</p>
                                  <p>Receive  - 1.5 Mbps</p>
                                </div>
                                <div className="col-2">
                                  <img
                                    alt="dashboard"
                                    src={require("../../assets/images/icons/web-traffic.png")}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-3">
                          <div className="itemWrapper d">
                            <div className="heading">
                              <div className="d-flex flex-wrap justify-content-detween">
                                <div className="col-10">
                                  <h5>SIP Devices</h5>
                                </div>
                                <div className="col-2">
                                  <i class="fa-solid fa-phone-office"></i>
                                </div>
                              </div>
                            </div>
                            <div className="data-number2">
                              <div className="d-flex flex-wrap justify-content-between align-items-center">
                                <div className="col-10">
                                  <h5>0</h5>
                                  <p>0 Registered / 0 Unregistered</p>
                                </div>
                                <div className="col-2">
                                  <img
                                    alt="dashboard"
                                    src={require("../../assets/images/icons/call.png")}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-12 mt-4">
                      <div className="row">
                        <div className="col-xl-4 chartWrapper">
                          <div className="wrapper itemWrapper b">
                            <div class="heading">
                              <div class="d-flex flex-wrap justify-content-between align-items-center">
                                <div class="col-10">
                                  <h5>System Usage</h5>
                                  <p>19 October, 2024</p>
                                </div>
                                <div class="col-2">
                                  <i class="fa-solid fa-gauge-simple-high"></i>
                                </div>
                              </div>
                            </div>
                            <div class="d-flex flex-wrap justify-content-between align-items-center">
                              <div className="col-9">
                                <GraphChart
                                  chartType="multiple"
                                  labels={["CPU Usage", "Memory Usage"]}
                                  fields={["0s", "10s", "20s", "30s", "40s", "50s", "60s"]}
                                  percentage={[
                                    [10, 12, 14, 16, 24, 14, 16],  // CPU Usage
                                    [8, 15, 20, 18, 25, 10, 12]    // Memory Usage
                                  ]}
                                  colors={["#f18f01", "#36A2EB"]}
                                />
                              </div>
                              <div className="col-3 text-end">
                                <p className="mb-2  text-secondary">CPU Usage</p>
                                <h3 className="mb-3  text-secondary">14.89%</h3>
                                <p className="mb-2  text-secondary">Memory Usage</p>
                                <h3 className="mb-0 text-secondary">28.51%</h3>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-4 ">
                          <div className="itemWrapper a">
                            <div className="heading">
                              <div className="d-flex flex-wrap justify-content-between align-items-center">
                                <div className="col-10">
                                  <h5>Hardware Info</h5>
                                  <p>
                                    {new Date().getDate()}{" "}
                                    {new Date().toLocaleString("default", {
                                      month: "long",
                                    })}
                                    , {new Date().getFullYear()}
                                  </p>
                                </div>
                                <div className="col-2">
                                  <i class="fa-solid fa-microchip"></i>
                                </div>
                              </div>
                            </div>
                            <div className="data-number2">
                              <div className="d-flex flex-wrap justify-content-between align-items-center">
                                <div className="col-12">
                                  <ul>
                                    <li>Virtualization <span className="float-end">Microsoft</span></li>
                                    <li>CPU Model <span className="float-end">Intel Xeon Processor (Cascadelake)</span></li>
                                    <li>CPU Cores <span className="float-end">1</span></li>
                                    <li>RAM <span className="float-end">2GB / 2GB</span></li>
                                    <li>Disk Usage <span className="float-end">20.8 GB Used / 29.1 GB Used</span></li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-4 ">
                          <div className="itemWrapper d">
                            <div className="heading">
                              <div className="d-flex flex-wrap justify-content-between align-items-center">
                                <div className="col-10">
                                  <h5>System Info</h5>
                                  <p>
                                    {new Date().getDate()}{" "}
                                    {new Date().toLocaleString("default", {
                                      month: "long",
                                    })}
                                    , {new Date().getFullYear()}
                                  </p>
                                </div>
                                <div className="col-2">
                                  <i class="fa-solid fa-desktop"></i>
                                </div>
                              </div>
                            </div>
                            <div className="data-number2">
                              <div className="d-flex flex-wrap justify-content-between align-items-center">
                                <div className="col-12">
                                  <ul>
                                    <li>Distro <span className="float-end">Debian GNU, Linux 11</span></li>
                                    <li>Kernel <span className="float-end">5.10.0-21-amd64</span></li>
                                    <li>Asterisk <span className="float-end">18.16.0</span></li>
                                    <li>VitalPBX <span className="float-end">4.0.2-1</span></li>
                                    <li>PHP Version <span className="float-end">8.1.11</span></li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
                <div
                  className="tab-pane fade show active"
                  id="nav-customer"
                  role="tabpanel"
                  aria-labelledby="nav-customer-tab"
                  tabIndex="0"
                >
                  <div className="row">
                    <div className="col-xl-3"
                      style={{ cursor: "pointer" }}
                    >
                      <div className="itemWrapper a">
                        <div className="heading">
                          <div className="d-flex flex-wrap justify-content-between align-items-center">
                            <div className="col-10">
                              <h5>Timezone</h5>
                              <p>
                                {" "}
                                {new Date().getDate()}{" "}
                                {new Date().toLocaleString("default", {
                                  month: "long",
                                })}
                                , {new Date().getFullYear()}
                              </p>
                            </div>
                            <div className="col-2">
                              <i className="fa-duotone fa-earth-americas" ></i>
                            </div>
                          </div>
                        </div>

                        <div className="data-number2">
                          <div className="d-flex flex-wrap justify-content-between align-items-center">
                            <div className="col-10">
                              <h5>{accountDetails?.country}</h5>
                              <p>Language: {account?.language}</p>
                              <p>TimeZone: {accountDetails?.timezone?.name}</p>
                            </div>
                            <div className="col-2">
                              <Clock value={currentTime} size={50} secondHandWidth={1} renderMinuteMarks={false} hourMarksWidth={1} hourMarksLength={15} hourHandWidth={2} minuteHandWidth={1} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3"
                      style={{ cursor: "pointer" }}
                    >
                      <div className="itemWrapper b">
                        <div className="heading">
                          <div className="d-flex flex-wrap justify-content-between">
                            <div className="col-10">
                              <h5>Account Info</h5>
                              <p>Click to view details</p>
                            </div>
                            <div className="col-2" onClick={() => navigate("/my-profile")}>
                              <i className="fa-solid fa-user" ></i>
                            </div>
                          </div>
                        </div>

                        <div className="data-number2">
                          <div className="d-flex flex-wrap justify-content-between align-items-center">
                            <div className="col-10">
                              <h5>{accountDetails?.admin_name}</h5>
                              <p>Ph No: {accountDetails?.contact_no}</p>
                              <p>Email: {accountDetails?.email}</p>
                            </div>
                            <div className="col-2">
                              <img
                                alt="dashboard"
                                src={require("../../assets/images/icons/diagram.png")}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3"
                      style={{ cursor: "pointer" }}
                    >
                      <div className="itemWrapper c">
                        <div className="heading">
                          <div className="d-flex flex-wrap justify-content-between align-items-center">
                            <div className="col-10">
                              <h5>Package Information</h5>
                              <p>Click to view details</p>
                            </div>
                            <div className="col-2" onClick={() => navigate('/card-details')}>
                              <i className="fa-duotone fa-file" ></i>
                            </div>
                          </div>
                        </div>

                        <div className="data-number2">
                          <div className="d-flex flex-wrap justify-content-between align-items-center">
                            <div className="col-10">
                              <h5>{accountDetails?.package?.name}</h5>
                              <p>{accountDetails?.package?.regular_price} / Year</p>
                              <p>{accountDetails?.extensions?.length} Purchased Extensions / {accountDetails?.dids?.length} DIDs</p>
                            </div>
                            <div className="col-2">
                              <img
                                alt="dashboard"
                                src={require("../../assets/images/icons/diagram.png")}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3"
                      style={{ cursor: "pointer" }}
                    >
                      <div className="itemWrapper d">
                        <div className="heading">
                          <div className="d-flex flex-wrap justify-content-between">
                            <div className="col-10">
                              <h5>Domain Info</h5>
                            </div>
                            <div className="col-2">
                              <i className="fa-duotone fa-globe" ></i>
                            </div>
                          </div>
                        </div>

                        <div className="data-number2">
                          <div className="d-flex flex-wrap justify-content-between align-items-center">
                            <div className="col-10">
                              <h5>{account?.domain?.domain_name}</h5>
                              <p>Created at: {account?.domain?.created_at.split("T")[0]},{" "}{account?.domain?.created_at.split("T")[1].split('.')[0]}</p>
                            </div>
                            <div className="col-2">
                              <img
                                alt="dashboard"
                                src={require("../../assets/images/icons/diagram.png")}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-xl-12 mt-4">
                      <div className="row">
                        <div className="col-xl-4 ">
                          <div className="itemWrapper c">
                            <div className="heading">
                              <div className="d-flex flex-wrap justify-content-between align-items-center">
                                <div className="col-10">
                                  <h5>Payment Details</h5>
                                  <p>Click to view transaction history</p>
                                </div>
                                <div className="col-2" onClick={() => navigate('/card-transaction-list')}>
                                  <i class="fa-solid fa-file-invoice" ></i>
                                </div>
                              </div>
                            </div>
                            <div className="data-number2">
                              <div className="d-flex flex-wrap justify-content-between align-items-center">
                                <div className="col-12">
                                  <ul>
                                    <li>
                                      Time of Payment <span className="float-end">{accountDetails?.subscription[0]?.updated_at.split("T")[0]}, {" "}{accountDetails?.subscription[0]?.updated_at.split("T")[1].split(".")[0]}</span>
                                    </li>
                                    <li>
                                      Subscription Type <span className="float-end">{accountDetails?.package?.subscription_type ===
                                        "annually"
                                        ? "Annually"
                                        : "Monthly"}</span>
                                    </li>
                                    <li>
                                      Transaction Id <span className="float-end">{accountDetails?.subscription[0]?.transaction_id}</span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-4 ">
                          <div className="itemWrapper d">
                            <div className="heading">
                              <div className="d-flex flex-wrap justify-content-between align-items-center">
                                <div className="col-10">
                                  <h5>Subscription Details</h5>
                                  <p>Click the icon to view it</p>
                                </div>
                                <div className="col-2" onClick={() => navigate('/card-details')}>
                                  <i class="fa-duotone fa-money-check-dollar-pen" ></i>
                                </div>
                              </div>
                            </div>
                            <div className="data-number2">
                              <div className="d-flex flex-wrap justify-content-between align-items-center">
                                <div className="col-12">
                                  <ul>
                                    <li>
                                      Subscription Status <span className="float-end">{accountDetails?.subscription[0]?.status}</span>
                                    </li>
                                    <li>
                                      Subscription Start <span className="float-end">{accountDetails?.subscription[0]?.start_date.split(" ")[0]},{" "}{accountDetails?.subscription[0]?.start_date.split(" ")[1]}</span>
                                    </li>
                                    <li>
                                      Subscription End <span className="float-end">{accountDetails?.subscription[0]?.end_date.split(" ")[0]},{" "}{accountDetails?.subscription[0]?.end_date.split(" ")[1]}</span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-4 ">
                          <div className="itemWrapper a">
                            <div className="heading">
                              <div className="d-flex flex-wrap justify-content-between align-items-center">
                                <div className="col-10">
                                  <h5>Extensions</h5>
                                  <p>Total: {accountDetails?.extensions?.length} Registered</p>
                                </div>
                                <div className="col-2" onClick={() => navigate('/extensions')}>
                                  <i class="fa-duotone fa-phone-office" ></i>
                                </div>
                              </div>
                            </div>
                            <div className="data-number2">
                              <div className="d-flex flex-wrap justify-content-between align-items-center">
                                <div className="col-12">
                                  <ul style={{ overflowY: 'scroll', height: '200px', paddingRight: 10 }}>
                                    {accountDetails?.extensions?.map(
                                      (item, index) => (
                                        <li key={index} onClick={() => navigate(`/extensions-edit?id=${item?.id}`)}>
                                          {item?.extension}
                                          <span className={item?.sofia_status === 0 ? "float-end extensionStatus" : "extensionStatus online"}></span>
                                        </li>
                                      ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane fade "
                  id="nav-calls"
                  role="tabpanel"
                  aria-labelledby="nav-home-tab"
                  tabIndex="0"
                >
                  <div className="row">
                    <div className="col-xl-3">
                      <div className="itemWrapper a">
                        <div className="heading">
                          <div className="d-flex flex-wrap justify-content-between align-items-center">
                            <div className="col-10">
                              <h5>Handled Calls</h5>
                              {/* <p>27 August - 27 September, 2024</p> */}
                              <p>
                                {new Date().getDate()}{" "}
                                {new Date().toLocaleString("default", {
                                  month: "long",
                                })}
                                , {new Date().getFullYear()}
                              </p>
                            </div>
                            <div className="col-2">
                              <i className="fa-duotone fa-phone-office"></i>
                            </div>
                          </div>
                        </div>
                        <div className="data-number2">
                          <div className="d-flex flex-wrap justify-content-between align-items-center">
                            <div className="col-10">
                              <h5>{callCardData.handled.count}</h5>
                              <p>
                                {callCardData.handled.inboundAnswered} Inbound /{" "}
                                {callCardData.handled.outboundAnswered} Outbound
                              </p>
                            </div>
                            <div className="col-2">
                              <img
                                alt="dashboard"
                                src={require("../../assets/images/icons/diagram.png")}
                              />
                            </div>
                          </div>
                        </div>
                        {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/user'" effect="ripple"><i className="fa-duotone fa-users"></i> View All Users</button> */}
                      </div>
                    </div>
                    <div className="col-xl-3">
                      <div className="itemWrapper b">
                        <div className="heading">
                          <div className="d-flex flex-wrap justify-content-between align-items-center">
                            <div className="col-10">
                              <h5>Total Minutes</h5>
                              {/* <p>27 August - 27 September, 2024</p> */}
                              <p>
                                {" "}
                                {new Date().getDate()}{" "}
                                {new Date().toLocaleString("default", {
                                  month: "long",
                                })}
                                , {new Date().getFullYear()}
                              </p>
                            </div>
                            <div className="col-2">
                              <i className="fa-duotone fa-clock"></i>
                            </div>
                          </div>
                        </div>
                        <div className="data-number2">
                          <div className="d-flex flex-wrap justify-content-between align-items-center">
                            <div className="col-10">
                              <h5>{callCardData.minutes.count}</h5>
                              <p>
                                {callCardData.minutes.inboundAnswered} Inbound /{" "}
                                {callCardData.minutes.outboundConnected}{" "}
                                Outbound
                              </p>
                            </div>
                            <div className="col-2">
                              <img
                                alt="dashboard"
                                src={require("../../assets/images/icons/diagram.png")}
                              />
                            </div>
                          </div>
                        </div>
                        {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/extensions'" effect="ripple"><i className="fa-duotone fa-phone-office"></i> View All Extensions</button> */}
                      </div>
                    </div>
                    <div className="col-xl-3">
                      <div className="itemWrapper c">
                        <div className="heading">
                          <div className="d-flex flex-wrap justify-content-between align-items-center">
                            <div className="col-10">
                              <h5>Missed Calls</h5>
                              {/* <p>27 August - 27 September, 2024</p> */}
                              <p>
                                {" "}
                                {new Date().getDate()}{" "}
                                {new Date().toLocaleString("default", {
                                  month: "long",
                                })}
                                , {new Date().getFullYear()}
                              </p>
                            </div>
                            <div className="col-2">
                              <i className="fa-duotone fa-phone-missed"></i>
                            </div>
                          </div>
                        </div>
                        <div className="data-number2">
                          <div className="d-flex flex-wrap justify-content-between align-items-center">
                            <div className="col-10">
                              <h5>{callCardData.missedCalls.count}</h5>
                              <p>
                                {callCardData.missedCalls.callMissed} Calls
                                Missed
                              </p>
                            </div>
                            <div className="col-2">
                              <img
                                alt="dashboard"
                                src={require("../../assets/images/icons/diagram.png")}
                              />
                            </div>
                          </div>
                        </div>
                        {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/devices'" effect="ripple"><i className="fa-duotone fa-mobile-retro"></i> View All Devices</button> */}
                      </div>
                    </div>
                    <div className="col-xl-3">
                      <div className="itemWrapper d">
                        <div className="heading">
                          <div className="d-flex flex-wrap justify-content-between align-items-center">
                            <div className="col-10">
                              <h5>Abandoned Calls</h5>
                              {/* <p>27 August - 27 September, 2024</p> */}
                              <p>
                                {" "}
                                {new Date().getDate()}{" "}
                                {new Date().toLocaleString("default", {
                                  month: "long",
                                })}
                                , {new Date().getFullYear()}
                              </p>
                            </div>
                            <div className="col-2">
                              <i className="fa-duotone fa-phone-xmark"></i>
                            </div>
                          </div>
                        </div>
                        <div className="data-number2">
                          <div className="d-flex flex-wrap justify-content-between align-items-center">
                            <div className="col-10">
                              <h5>{callCardData.abandonedCalls.count}</h5>
                            </div>
                            <div className="col-2">
                              <img
                                alt="dashboard"
                                src={require("../../assets/images/icons/diagram.png")}
                              />
                            </div>
                          </div>
                        </div>
                        {/* <div className="label">0 Internal Call</div>
                        <div className="label">0 External Calls</div> */}
                        {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/devices'" effect="ripple"><i className="fa-duotone fa-mobile-retro"></i> View All Devices</button> */}
                      </div>
                    </div>
                    <div className="col-12 mt-4 mb-2 chartWrapper">
                      <div className="row">
                        <div className="col-xl-3">
                          <div className="wrapper">
                            <DoughnutChart
                              fields={["Inbound", "Outbound", "Total"]}
                              percentage={[
                                callCardData.handled.inboundAnswered,
                                callCardData.handled.outboundAnswered,
                                callCardData.handled.count,
                              ]}
                              centerTitle={`${extensionList}/${Number(
                                accountDetails?.package?.number_of_user
                              )}`}
                              centerDesc="Extensions Details"
                              colors={["#9999", "#FF638470", "#36A2EB70"]}
                            />
                          </div>
                        </div>
                        <div className="col-xl-3">
                          <div className="wrapper">
                            <DoughnutChart
                              fields={["Handled", "Missed", "Abandoned"]}
                              percentage={[
                                callCardData.handled.count,
                                callCardData.missedCalls.count,
                                callCardData.abandonedCalls.count,
                              ]}
                              centerTitle={`${userList}/${accountDetails?.package?.number_of_user}`}
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
                                accountDetails?.package?.number_of_user,
                                extensionList,
                              ]}
                              centerTitle={`${extensionList}/${accountDetails?.package?.number_of_user}`}
                              centerDesc="Total Extensions"
                              colors={["#f18f01", "#36A2EB"]}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="nav-billing"
                  role="tabpanel"
                  aria-labelledby="nav-billing-tab"
                  tabIndex="0"
                >
                  <div className="row">
                    <div className="col-xl-3"
                      style={{ cursor: "pointer" }}
                    >
                      <div className="itemWrapper a">
                        <div className="heading">
                          <div className="d-flex flex-wrap justify-content-between align-items-center">
                            <div className="col-10">
                              <h5>Package Type</h5>
                              <p>Click to view details</p>
                            </div>
                            <div className="col-2">
                              <i className="fa-duotone fa-cube" ></i>
                            </div>
                          </div>
                        </div>

                        <div className="data-number2">
                          <div className="d-flex flex-wrap justify-content-between align-items-center">
                            <div className="col-10">
                              <h5>{accountDetails?.package.name}</h5>
                              <p>Price: ${accountDetails?.package?.regular_price} / {accountDetails?.package?.subscription_type === "annually" ? "Anually" : "Monthly"}</p>
                              <p>Started On: {accountDetails?.subscription?.[0]?.created_at.split("T")[0]}</p>
                            </div>
                            <div className="col-2">
                              <img
                                alt="dashboard"
                                src={require("../../assets/images/icons/diagram.png")}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3">
                      <div className="itemWrapper b">
                        <div className="heading">
                          <div className="d-flex flex-wrap justify-content-between align-items-center">
                            <div className="col-10">
                              <h5>Upcoming Transaction</h5>
                              <p>{accountDetails?.subscription[0].end_date.split(" ")[0]}</p>
                            </div>
                            <div className="col-2" onClick={() => { navigate('/card-details') }}>
                              <i className="fa-duotone fa-money-check-dollar" ></i>
                            </div>
                          </div>
                        </div>

                        <div className="data-number2">
                          <div className="d-flex flex-wrap justify-content-between align-items-center">
                            <div className="col-10">
                              <h5>${accountDetails?.package?.regular_price}</h5>
                              <p>
                                {accountDetails?.package?.subscription_type ===
                                  "annually"
                                  ? "Annually"
                                  : "Monthly"} Basis
                              </p>
                            </div>
                            <div className="col-2">
                              <img
                                alt="dashboard"
                                src={require("../../assets/images/icons/diagram.png")}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3">
                      <div className="itemWrapper c">
                        <div className="heading">
                          <div className="d-flex flex-wrap justify-content-between align-items-center">
                            <div className="col-10">
                              <h5>Last Transaction</h5>
                              <p>
                                #{accountDetails?.payments[0]?.transaction_id}
                              </p>
                            </div>
                            <div className="col-2" onClick={() => navigate('/card-transaction-list')}>
                              <i class="fa-solid fa-dollar-sign" ></i>
                            </div>
                          </div>
                        </div>

                        <div className="data-number2">
                          <div className="d-flex flex-wrap justify-content-between align-items-center">
                            <div className="col-10">
                              <h5>${accountDetails?.payments[0]?.amount_subtotal}</h5>
                              <p>Transaction Time: {accountDetails?.payments[0]?.transaction_date}</p>
                            </div>
                            <div className="col-2">
                              <img
                                alt="dashboard"
                                src={require("../../assets/images/icons/diagram.png")}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-xl-3">
                      <div className="itemWrapper d">
                        <div className="heading">
                          <div className="d-flex flex-wrap justify-content-between align-items-center">
                            <div className="col-10">
                              <h5>Wallet Info</h5>
                              <p>Created On: {accountDetails?.balance?.created_at.split("T")[0]},{" "}{accountDetails?.balance?.created_at.split("T")[1].split(".")[0]}</p>
                            </div>
                            <div className="col-2" onClick={() => navigate('/card-details')}>
                              <i className="fa-duotone fa-wallet" ></i>
                            </div>
                          </div>
                        </div>

                        <div className="data-number2">
                          <div className="d-flex flex-wrap justify-content-between align-items-center">
                            <div className="col-10">
                              <h5>${accountDetails?.balance?.amount}</h5>
                              <p>
                                Last recharged: {accountDetails?.balance?.updated_at.split("T")[0]},{" "}{accountDetails?.balance?.updated_at.split("T")[1].split(".")[0]}
                              </p>
                            </div>
                            <div className="col-2">
                              <img
                                alt="dashboard"
                                src={require("../../assets/images/icons/diagram.png")}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-12 mt-4">
                      <div className="row">
                        <div className="col-xl-4 ">
                          <div className="itemWrapper c">
                            <div className="heading">
                              <div className="d-flex flex-wrap justify-content-between align-items-center">
                                <div className="col-10">
                                  <h5>Invoices</h5>
                                  <p>Last 5 invoices</p>
                                </div>
                                <div className="col-2" onClick={() => navigate('/card-transaction-list')}>
                                  <i class="fa-duotone fa-file-invoice" ></i>
                                </div>
                              </div>
                            </div>
                            <div className="data-number2">
                              <div className="d-flex flex-wrap justify-content-between align-items-center">
                                <div className="col-12">
                                  <ul>
                                    {accountDetails?.payments?.slice(0, 5).map(
                                      (item, index) => (
                                        <li key={index}>{item.transaction_date}
                                          <span className="float-end fw-bold" onClick={() => downloadImage(item.invoice_url)}><i class="fa-solid fa-download text-warning"></i> ${item.amount_subtotal} </span>
                                        </li>
                                      ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-4 ">
                          <div className="itemWrapper d">
                            <div className="heading">
                              <div className="d-flex flex-wrap justify-content-between align-items-center">
                                <div className="col-10">
                                  <h5>Billing Address</h5>
                                  <p>Click the icon to change it</p>
                                </div>
                                <div className="col-2" onClick={() => navigate('/card-details')}>
                                  <i class="fa-duotone fa-address-card" ></i>
                                </div>
                              </div>
                            </div>
                            <div className="data-number2">
                              <div className="d-flex flex-wrap justify-content-between align-items-center">
                                <div className="col-12">
                                  <ul>
                                    <li>
                                      Full Name <span className="float-end">{accountDetails?.billing_address[0]?.fullname}</span>
                                    </li>
                                    <li>
                                      Phone <span className="float-end">{accountDetails?.billing_address[0]?.contact_no}</span>
                                    </li>
                                    <li>
                                      Email Address <span className="float-end">{accountDetails?.billing_address[0]?.email}</span>
                                    </li>
                                    <li>
                                      Address <span className="float-end">{accountDetails?.billing_address[0]?.address}</span>
                                    </li>
                                    <li>
                                      City, State<span className="float-end">{accountDetails?.billing_address[0]?.city},{" "}{accountDetails?.billing_address[0]?.state}</span>
                                    </li>
                                    <li>
                                      Zip Code <span className="float-end">{accountDetails?.billing_address[0]?.zip}</span>
                                    </li>
                                    <li>
                                      Country <span className="float-end">{accountDetails?.billing_address[0]?.country}</span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-4 chartWrapper">
                          <div className="wrapper itemWrapper b">
                            <div class="heading">
                              <div class="d-flex flex-wrap justify-content-between align-items-center">
                                <div class="col-10">
                                  <h5>Dummy Data</h5>
                                  <p>19 October, 2024</p>
                                </div>
                                <div class="col-2" onClick={() => navigate('/card-details')}>
                                  <i class="fa-solid fa-gauge-simple-high" ></i>
                                </div>
                              </div>
                            </div>
                            <div class="d-flex flex-wrap justify-content-between align-items-center">
                              <GraphChart
                                chartType="multiple"
                                labels={["Field 1", "Field 2"]}
                                fields={["0s", "10s", "20s", "30s", "40s", "50s", "60s"]}
                                percentage={[
                                  [10, 12, 14, 16, 24, 14, 16],  // CPU Usage
                                  [8, 15, 20, 18, 25, 10, 12]    // Memory Usage
                                ]}
                                colors={["#f18f01", "#36A2EB"]}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="col-12 mt-3">
                            <div className="row">
                                <div className="col-xl-4 tabButtonParent">
                                    <button
                                        className={calls ? "tabButton active" : "tabButton"}
                                        onClick={() => setCalls(!calls)}
                                        data-id={1}
                                    >
                                        All Calls
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
                        {calls ? <AllCalls /> : ""}
                        {group ? <RingGroup /> : ""}
                        {queue ? <CallQueueDetails /> : ""} */}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
