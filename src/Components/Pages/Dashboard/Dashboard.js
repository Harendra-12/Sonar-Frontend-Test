/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../CommonComponents/Header";
import GraphChart from "../../CommonComponents/GraphChart";
import { useNavigate } from "react-router-dom";
import Tippy from "@tippyjs/react";
import { checkViewSidebar, generalGetFunction } from "../../GlobalFunction/globalFunction";
import ModuleGraphDashboard from "./ModuleGraphDashboard";
const Dashboard = () => {
  const callDetailsRefresh = useSelector((state) => state.callDetailsRefresh);
  const ringGroupRefresh = useSelector((state) => state.ringGroupRefresh);
  const callCenterRefresh = useSelector((state) => state.callCenterRefresh);
  const account = useSelector((state) => state.account);
  const timeZone = useSelector((state) => state.timeZone);
  const timeZoneRefresh = useSelector((state) => state.timeZoneRefresh);
  const accountDetails = useSelector((state) => state.accountDetails);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const extensionRefresh = useSelector((state) => state.extensionRefresh);
  const permissionRefresh = useSelector((state) => state.permissionRefresh);
  // const allUserRefresh = useSelector((state) => state.allUserRefresh);
  const extensionList = useSelector((state) => state.extension).length;
  // const userList = useSelector((state) => state.allUser?.data?.length) || 0;
  const ringGroup = useSelector((state) => state.ringGroup || []);
  const allCall = useSelector((state) => state.allCall || {});
  const callCenter = useSelector((state) => state.callCenter || []);
  const extension = useSelector((state) => state.extension || []);
  const registerUser = useSelector((state) => state.registerUser || []);
  const [onlineExtension, setOnlineExtension] = useState([]);
  const isCustomerAdmin = account?.email == accountDetails?.email;
  const [time, setTime] = useState(new Date());
  const slugPermissions = useSelector((state) => state?.permissions);
  const didAll = useSelector((state) => state.didAll);
  const [allDID, setAllDID] = useState([]);
  const [allUserList, setAllUserList] = useState([])

  const getAllUser = async () => {
    const userApi = await generalGetFunction(
      `/user/search?account=${account.account_id}${account.usertype !== 'Company' || account.usertype !== 'SupreAdmin' ? '&section=Accounts' : ""}`
    );
    if (userApi?.status) {
      setAllUserList(userApi.data);
    }
  }

  // Getting all DID from did listing
  useEffect(() => {
    if (didAll.length > 0) {
      setAllDID(didAll)
    } else {
      async function getData() {
        const apiData = await generalGetFunction(`/did/all?all-dids`);
        if (apiData?.status) {
          setAllDID(apiData.data);
          dispatch({
            type: "SET_DIDALL",
            didAll: apiData.data,
          });
        }
      }
      getData();
    }
    if (permissionRefresh === 0) {
      dispatch({
        type: "SET_PERMISSION_REFRESH",
        permissionRefresh: permissionRefresh + 1,
      });
    }

    getAllUser();

  }, [])

  // Setting clock for the selected timnezone
  // useEffect(() => {
  //   const updateAccountDetails = async () => {
  //     try {
  //       const profile = await generalGetFunction("/user");
  //       if (profile?.status) {
  //         dispatch({
  //           type: "SET_ACCOUNT",
  //           account: profile.data,
  //         });
  //       }
  //     } catch (error) {
  //     }
  //   };
  //   updateAccountDetails();
  //   dispatch({
  //     type: "SET_PERMISSION_REFRESH",
  //     permissionRefresh: permissionRefresh + 1,
  //   });
  // }, []);

  useEffect(() => {
    if (timeZoneRefresh > 0) {
    } else {
      dispatch({
        type: "SET_TIMEZONEREFRESH",
        timeZoneRefresh: timeZoneRefresh + 1,
      });
    }
  }, [timeZone]);

  useEffect(() => {
    const updateTime = () => {
      // Convert current time to the given timezone
      const value = timeZone.find(
        (item) => item.id === account.timezone_id
      )?.name;
      if (!value) return;

      const timeInZone = new Date(
        new Date().toLocaleString("en-US", { timeZone: value })
      );
      setTime(timeInZone);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timeZone, account?.timezone_id]);

  // Getting register user data from socket and setting online extension
  useEffect(() => {
    if (registerUser.length > 0) {
      setOnlineExtension(
        registerUser.map((item) => {
          if (item.account_id === account.account_id) {
            return item.extension;
          }
        })
      );
    } else {
      setOnlineExtension([]);
    }
    // generalGetFunction("/freeswitch/checkActiveExtensionOnServer");
  }, [registerUser]);

  // Initializing call card data
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

  // Function to get extension array
  const getExtensionsArr = (type) => {
    if (type == "ring") return new Set(ringGroup.map((ring) => ring.extension));
    else if (type == "call")
      return new Set(callCenter.map((call) => call.extension));
  };

  // Function to get combined call data
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

  // Setting call card data
  useEffect(() => {
    if (combinedCallData) {
      setCallCardData(combinedCallData.callCardData);
    }
  }, [combinedCallData]);

  // Setting call card data
  useEffect(() => {
    if (extension.length == 0) {
      dispatch({
        type: "SET_EXTENSIONREFRESH",
        extensionRefresh: extensionRefresh + 1,
      });
    }
    // if (userList == 0) {
    //   dispatch({
    //     type: "SET_ALLUSERREFRESH",
    //     allUserRefresh: allUserRefresh + 1,
    //   });
    // }
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

  // Function to download invoice
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

  // Function to handle missed call click
  const handleMissedCallClick = () => {
    dispatch({
      type: "SET_SELECTEDCDRFILTER",
      selectedCdrFilter: "missed-calls",
    });
    navigate("/cdr-report");
  };

  // Graph Module
  const [graphData, setGraphData] = useState({
    totalCallMin: [],
    numberOfCall: [],
    callCostPerHour: [],
    totalSpent: [],
  })
  const [graphFilter, setGraphFilter] = useState({
    totalCallMin: {
      interval: "1",
      startTime: "24",
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

  useEffect(() => {
    fetchTotalCallCostGraphData();
  }, [graphFilter.callCostPerHour])

  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row ">
            <Header title="Dashboard" />
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
          </div>
        </div>
        <div className="container-fluid">
          <div className="row ">
            <div className="col-12 mt-3 tangoNavs">
              <nav>
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
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
                  {/* {checkViewSidebar(
                    "ChannelHangupComplete",
                    slugPermissions,
                    account?.permissions
                  ) && (
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
                    )} */}
                  {/* {checkViewSidebar(
                    "BillingAddress",
                    slugPermissions,
                    account?.permissions, "read"
                  ) && checkViewSidebar(
                    "WalletTransaction",
                    slugPermissions,
                    account?.permissions
                  ) && (
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
                    )} */}
                  {/* <div className="ms-auto pb-2">
                    <Clock
                      value={time}
                      size={50}
                      secondHandWidth={1}
                      renderMinuteMarks={false}
                      hourMarksWidth={1}
                      hourMarksLength={15}
                      hourHandWidth={2}
                      minuteHandWidth={1}
                    />
                  </div> */}
                </div>
              </nav>
              <div className="tab-content mt-3" id="nav-tabContent">
                <div
                  className="tab-pane fade show active"
                  id="nav-customer"
                  role="tabpanel"
                  aria-labelledby="nav-customer-tab"
                  tabIndex="0"
                >
                  <div className="row">
                    <div className="col-xl-3 mb-3 mb-xl-0">
                      <div className="itemWrapper a dashboard_cardWrap ">
                        <div className="heading">
                          <div className="d-flex flex-wrap justify-content-between">
                            <div className="col-9">
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
                            <div className="col-3">
                              <i className="fa-duotone fa-earth-americas" onClick={() => navigate("/users-profile")}></i>
                            </div>
                          </div>
                        </div>

                        <div className="data-number2 mt-0">
                          <div className="d-flex flex-wrap justify-content-between align-items-center">
                            <div className="col">
                              <div className="d-flex justify-content-between align-items-center">
                                <h5 style={{ textTransform: 'capitalize' }}>{accountDetails?.country}</h5>
                                <p>Language: {account?.language}</p>
                              </div>
                              <div className="digital__clock">
                                <p>
                                  TimeZone:{" "}
                                  {
                                    timeZone.filter(
                                      (item) => item.id === account?.timezone_id
                                    )[0]?.name
                                  }
                                </p>
                                <div className="d-flex justify-content-center align-items-center">
                                  <p class="d_time">{String(new Date(time).getHours() > 12 ? new Date(time).getHours() - 12 : new Date(time).getHours()).padStart(2, "0")}:</p>
                                  <p class="d_time">{String(new Date(time).getMinutes()).padStart(2, "0")}:</p>
                                  <p class="d_time">{new Date(time).getHours() > 12 ? 'PM' : 'AM'}</p>
                                </div>
                              </div>
                            </div>
                            {/* <div className="col-auto "> */}
                            {/* <div className="digital__clock">
                                <p class="d_time">{String(new Date(time).getHours() > 12 ? new Date(time).getHours() - 12 : new Date(time).getHours()).padStart(2, "0")}:</p>
                                <p class="d_time">{String(new Date(time).getMinutes()).padStart(2, "0")}:</p>
                                <p class="d_time">{new Date(time).getHours() > 12 ? 'PM' : 'AM'}</p>
                              </div> */}

                            {/* <Clock
                                value={time}
                                size={50}
                                secondHandWidth={1}
                                renderMinuteMarks={false}
                                hourMarksWidth={1}
                                hourMarksLength={15}
                                hourHandWidth={2}
                                minuteHandWidth={1}
                              /> */}

                            {/* </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 mb-3 mb-xl-0">
                      <div className="itemWrapper b d_card2 dashboard_cardWrap">
                        <div className="heading">
                          <div className="d-flex flex-wrap justify-content-between">
                            <div className="col-9">
                              <h5>Account Info</h5>
                              <p>Click to view details</p>
                            </div>
                            <div className="col-2">
                              <i className="fa-solid fa-user" onClick={() => navigate("/users-profile")}></i>
                            </div>
                          </div>
                        </div>

                        <div className="data-number2">
                          <div className="d-flex flex-wrap justify-content-between">
                            <div className="col-9">
                              <h5>{account?.name}</h5>
                              <p>Username: {account?.username}</p>
                              <p style={{ whiteSpace: 'nowrap', width: '100%', textOverflow: 'ellipsis', overflow: 'hidden' }} title={account?.email}>Email: {account?.email}</p>
                            </div>
                            {/* <div className="col-3">
                              <img
                                alt="dashboard"
                                src={require("../../assets/images/icons/diagram.png")}
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
                    {checkViewSidebar("Package", slugPermissions, account?.sectionPermissions, account?.permissions, "read") &&
                      <div className="col-xl-3 mb-3 mb-xl-0">
                        <div className="itemWrapper c dashboard_cardWrap d_card3">
                          <div className="heading">
                            <div className="d-flex flex-wrap justify-content-between">
                              <div className="col-9">
                                <h5>Package Information</h5>
                                <p>Click to view details</p>
                              </div>
                              <div className="col-3">
                                <i className="fa-duotone fa-file" onClick={() => navigate("/package-details")}></i>
                              </div>
                            </div>
                          </div>
                          <div className="data-number2">
                            <div className="d-flex flex-wrap justify-content-between">
                              <div className="col-9">
                                <h5>{accountDetails?.package?.name}</h5>
                                <p>
                                  {accountDetails?.package?.regular_price} / Year
                                </p>
                                <p>
                                  {accountDetails?.extensions?.length}{" "}
                                  Extensions / {accountDetails?.dids?.length} DIDs
                                </p>
                              </div>
                              {/* <div className="col-3">
                              <img
                                alt="dashboard"
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
                    }
                    <div className="col-xl-3 mb-3 mb-xl-0">
                      <div className="itemWrapper d d_card4 dashboard_cardWrap ">
                        <div className="heading">
                          <div className="d-flex flex-wrap justify-content-between">
                            <div className="col-9">
                              <h5>Domain Info</h5>
                              <p>You are registered to this domain</p>
                            </div>
                            <div className="col-3">
                              <i className="fa-duotone fa-globe" style={{ cursor: 'default' }}></i>
                            </div>
                          </div>
                        </div>

                        <div className="data-number2">
                          <div className="d-flex flex-wrap justify-content-between">
                            <div className="col-9">
                              <h5>{account?.domain?.domain_name}</h5>
                              <p>
                                Created at:{" "}
                                {account?.domain?.created_at?.split("T")[0]},{" "}
                                {
                                  account?.domain?.created_at
                                    ?.split("T")[1]
                                    ?.split(".")[0]
                                }
                              </p>
                            </div>
                            {/* <div className="col-3">
                              <img
                                alt="dashboard"
                                src={require("../../assets/images/icons/diagram.png")}
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
                    <div className="col-xl-12 mt-xl-4 chartWrapper">
                      <div className="row">
                        {/* <div className="col-xl-4 mb-3 mb-xl-0">
                          <div className="itemWrapper d">
                            <div className="heading">
                              <div
                                className="d-flex flex-wrap justify-content-between"
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  navigate("/card-transaction-list")
                                }
                              >
                                <div className="col-9">
                                  <h5>Payment Details</h5>
                                  <p>Click to view transaction history</p>
                                </div>
                                <div className="col-3">
                                  <i className="fa-solid fa-file-invoice"></i>
                                </div>
                              </div>
                            </div>
                            <div className="data-number2">
                              <div className="d-flex flex-wrap justify-content-between">
                                <div className="col-12">
                                  <ul>
                                    <li>
                                      Time of Payment{" "}
                                      <span className="float-end">
                                        {
                                          accountDetails?.subscription[0]?.updated_at?.split(
                                            "T"
                                          )[0]
                                        }
                                        ,{" "}
                                        {
                                          accountDetails?.subscription[0]?.updated_at
                                            ?.split("T")[1]
                                            ?.split(".")[0]
                                        }
                                      </span>
                                    </li>
                                    <li>
                                      Subscription Type{" "}
                                      <span className="float-end">
                                        {accountDetails?.package
                                          ?.subscription_type === "annually"
                                          ? "Annually"
                                          : "Monthly"}
                                      </span>
                                    </li>
                                    <li>
                                      Transaction Id{" "}
                                      <span className="float-end">
                                        {
                                          accountDetails?.subscription[0]
                                            ?.transaction_id
                                        }
                                      </span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {isCustomerAdmin ? (
                          <div className="col-xl-4 mb-3 mb-xl-0">
                            <div className="itemWrapper a">
                              <div className="heading">
                                <div className="d-flex flex-wrap justify-content-between">
                                  <div className="col-9">
                                    <h5>Subscription Details</h5>
                                    <p>Click the icon to view it</p>
                                  </div>
                                  <div
                                    className="col-3"
                                    onClick={() => navigate("/card-details")}
                                  >
                                    <i className="fa-duotone fa-money-check-dollar-pen"></i>
                                  </div>
                                </div>
                              </div>
                              <div className="data-number2">
                                <div className="d-flex flex-wrap justify-content-between">
                                  <div className="col-12">
                                    <ul>
                                      <li>
                                        Subscription Status{" "}
                                        <span className="float-end">
                                          {
                                            accountDetails?.subscription[0]
                                              ?.status
                                          }
                                        </span>
                                      </li>
                                      <li>
                                        Subscription Start{" "}
                                        <span className="float-end">
                                          {
                                            accountDetails?.subscription[0]?.start_date?.split(
                                              " "
                                            )[0]
                                          }
                                          ,{" "}
                                          {
                                            accountDetails?.subscription[0]?.start_date?.split(
                                              " "
                                            )[1]
                                          }
                                        </span>
                                      </li>
                                      <li>
                                        Subscription End{" "}
                                        <span className="float-end">
                                          {
                                            accountDetails?.subscription[0]?.end_date?.split(
                                              " "
                                            )[0]
                                          }
                                          ,{" "}
                                          {
                                            accountDetails?.subscription[0]?.end_date?.split(
                                              " "
                                            )[1]
                                          }
                                        </span>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <></>
                        )} */}
                        {checkViewSidebar("Extension", slugPermissions, account?.sectionPermissions, account?.permissions, "read") &&
                          <div className="col-xl-3 mb-3 mb-xl-0">
                            <div className="itemWrapper a">
                              <div className="heading dashboard_headerPart">
                                <div className="d-flex flex-wrap justify-content-between">
                                  <div className="col-9">
                                    <h5>Extensions</h5>
                                    <p>
                                      Total:{" "}
                                      {accountDetails?.extensions?.length}{" "}
                                      Registered
                                    </p>
                                  </div>
                                  <div className="col-3">
                                    <Tippy content="Click to view extensions">
                                      <i className="fa-duotone fa-phone-office" onClick={() => navigate("/extensions")}></i>
                                    </Tippy>
                                  </div>
                                </div>
                              </div>
                              {accountDetails && accountDetails.extensions ? (
                                <div className="data-number2">
                                  <div className="d-flex flex-wrap justify-content-between">
                                    <div className="col-12">
                                      <ul
                                        style={{
                                          overflowY: "scroll",
                                          height: "220px",
                                          paddingRight: 10,
                                        }}
                                      >
                                        {accountDetails?.extensions?.map(
                                          (item, index) => (
                                            <li className="d_extension_listing"
                                              key={index}
                                              onClick={() =>
                                                navigate(
                                                  `/extensions-edit?id=${item?.id}`
                                                )
                                              }
                                            >
                                              {item?.extension}
                                              <span
                                                className={
                                                  onlineExtension?.includes(
                                                    item?.extension
                                                  )
                                                    ? "float-end extensionStatus online"
                                                    : "float-end extensionStatus"
                                                }
                                              ></span>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="deviceProvision position-relative" style={{ height: '250px' }}>
                                  <div className="itemWrapper a addNew d-flex justify-content-center align-items-center shadow-none">
                                    <i class="fa-solid fa-spinner-third fa-spin fs-3"></i>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        }
                        {checkViewSidebar("User", slugPermissions, account?.sectionPermissions, account?.permissions, "read") &&
                          <div className="col-xl-3 mb-3 mb-xl-0">
                            <div className="wrapper h-100" style={{ placeContent: 'center' }}>
                              {/* <DoughnutChart
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
                            /> */}
                              {onlineExtension && allUserList?.length ?
                                <div className='circularProgressWrapper'>
                                  <svg width="250" height="250" viewBox="0 0 250 250" className="circular-progress" style={{ '--progress': `${Math.round((onlineExtension.length / accountDetails?.extensions?.length) * 100)}` }}>
                                    <circle className="bg"
                                      cx="125" cy="125" r="115" fill="none" stroke="#62a8ac30" stroke-width="20"
                                    ></circle>
                                    <circle className="fg"
                                      cx="125" cy="125" r="115" fill="none" stroke="#62a8ac" stroke-width="20"
                                      stroke-dasharray="361.25 361.25"
                                    ></circle>
                                  </svg>
                                  <div className='circularProgressContent'>
                                    <div className="data-number">
                                      <label style={{ color: '#62a8ac' }}>{onlineExtension.length}</label> <span>/ {allUserList.filter((user) => user.extension !== null &&
                                        user.extension.extension !== null)?.length}</span>
                                    </div>
                                    <p>Total Online Agents</p>
                                  </div>
                                </div>
                                : (
                                  <div className="deviceProvision position-relative h-100">
                                    <div className="itemWrapper a addNew d-flex justify-content-center align-items-center shadow-none">
                                      <i class="fa-solid fa-spinner-third fa-spin fs-3"></i>
                                    </div>
                                  </div>
                                )}
                            </div>
                          </div>
                        }
                        {checkViewSidebar("Extension", slugPermissions, account?.sectionPermissions, account?.permissions, "read") &&
                          <div className="col-xl-3 mb-3 mb-xl-0">
                            <div className="wrapper h-100" style={{ placeContent: 'center' }}>
                              {/* <DoughnutChart
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
                            /> */}
                              {accountDetails && accountDetails.extensions ? (
                                <div className='circularProgressWrapper'>
                                  <svg width="250" height="250" viewBox="0 0 250 250" className="circular-progress" style={{ '--progress': `${Math.round((accountDetails?.extensions?.filter((item) => item.user == null)?.length / accountDetails?.extensions?.length) * 100)}` }}>
                                    <circle className="bg"
                                      cx="125" cy="125" r="115" fill="none" stroke="#ff8c4230" stroke-width="20"
                                    ></circle>
                                    <circle className="fg"
                                      cx="125" cy="125" r="115" fill="none" stroke="#ff8c42" stroke-width="20"
                                      stroke-dasharray="361.25 361.25"
                                    ></circle>
                                  </svg>
                                  <div className='circularProgressContent'>
                                    <div className="data-number">
                                      <label style={{ color: '#ff8c42' }}>{accountDetails?.extensions?.filter((item) => item.user == null)?.length}</label> <span>/ {accountDetails?.extensions?.length}</span>
                                    </div>
                                    <p>Total Available Extensions</p>
                                  </div>
                                </div>
                              ) : (
                                <div className="deviceProvision position-relative h-100">
                                  <div className="itemWrapper a addNew d-flex justify-content-center align-items-center shadow-none">
                                    <i class="fa-solid fa-spinner-third fa-spin fs-3"></i>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        }
                        {checkViewSidebar("DidDetail", slugPermissions, account?.sectionPermissions, account?.permissions, "read") &&
                          <div className="col-xl-3 mb-3 mb-xl-0">
                            <div className="itemWrapper a">
                              <div className="heading dashboard_headerPart">
                                <div className="d-flex flex-wrap justify-content-between">
                                  <div className="col-9">
                                    <h5>DID Information</h5>
                                    <p>Click to view all available DIDs</p>
                                  </div>
                                  <div className="col-3">
                                    <i className="fa-solid fa-file-invoice" onClick={() => navigate("/did-listing")}></i>
                                  </div>
                                </div>
                              </div>
                              <div className="data-number2">
                                <div className="d-flex flex-wrap justify-content-between">
                                  <div className="col-12">
                                    <ul>
                                      <li className="d_extension_listing">
                                        Total DID Purchasd{" "}
                                        <span className="float-end">
                                          {allDID?.length}
                                        </span>
                                      </li>
                                      <li className="d_extension_listing">
                                        Default Outbound Number{" "}
                                        <span className="float-end">
                                          {allDID?.filter((item) => item.default_outbound == 1)[0]?.did}
                                        </span>
                                      </li>
                                      <li className="d_extension_listing">
                                        Default Fax Number{" "}
                                        <span className="float-end">
                                          {allDID?.filter((item) => item.default_eFax == 1)[0]?.did}
                                        </span>
                                      </li>
                                      <li className="d_extension_listing">
                                        Default SMS{" "}
                                        <span className="float-end">
                                          {allDID?.filter((item) => item.default_sms == 1)[0]?.did}
                                        </span>
                                      </li>
                                      <li className="d_extension_listing">
                                        Default WhatsApp{" "}
                                        <span className="float-end">
                                          {allDID?.filter((item) => item.default_whatsapp == 1)[0]?.did}
                                        </span>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        }
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
                    <div className="col-xl-3 mb-3 mb-xl-0">
                      <div className="itemWrapper a">
                        <div className="heading">
                          <div className="d-flex flex-wrap justify-content-between">
                            <div className="col-9">
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
                            <div className="col-3">
                              <i className="fa-duotone fa-phone-office"></i>
                            </div>
                          </div>
                        </div>
                        <div className="data-number2">
                          <div className="d-flex flex-wrap justify-content-between" style={{ minHeight: '62px' }}>
                            <div className="col-xxl-9 col-lg-8">
                              <h5>
                                {allCall?.totalCalls !== undefined ? (
                                  allCall?.totalCalls
                                ) : (
                                  <i
                                    className={
                                      "fa-regular fa-arrows-rotate fs-5 fa-spin"
                                    }
                                  ></i>
                                )}
                              </h5>
                              <p>
                                {allCall?.inbound?.total !== undefined ? (
                                  allCall.inbound.total
                                ) : (
                                  <i
                                    className={
                                      "fa-regular fa-arrows-rotate fs-5 fa-spin"
                                    }
                                  ></i>
                                )}{" "}
                                Inbound /{" "}
                                {allCall?.outbound?.total !== undefined ? (
                                  allCall.outbound.total
                                ) : (
                                  <i
                                    className={
                                      "fa-regular fa-arrows-rotate fs-5 fa-spin"
                                    }
                                  ></i>
                                )}{" "}
                                Outbound
                              </p>
                            </div>
                            <div className="col-xxl-3 col-lg-4">
                              {/* <img
                                alt="dashboard"
                                src={require("../../assets/images/icons/diagram.png")}
                              /> */}
                              <ModuleGraphDashboard
                                fields={["In Completed", "Out Completed", "Total Success"]}
                                percentage={[
                                  allCall?.inbound?.completed,
                                  allCall?.outbound?.completed,
                                  allCall?.success,
                                ]}
                                colors={['#bfef35', '#a1cb2a', '#3e8ef7']}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 mb-3 mb-xl-0">
                      <div className="itemWrapper b">
                        <div className="heading">
                          <div className="d-flex flex-wrap justify-content-between">
                            <div className="col-9">
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
                            <div className="col-3">
                              <i className="fa-duotone fa-clock"></i>
                            </div>
                          </div>
                        </div>
                        <div className="data-number2">
                          <div className="d-flex flex-wrap justify-content-between">
                            <div className="col-xxl-9 col-lg-8">
                              <h5>
                                {!isNaN(
                                  allCall?.inbound?.duration +
                                  allCall?.outbound?.duration
                                ) ? (
                                  allCall?.inbound?.duration +
                                  allCall?.outbound?.duration
                                ) : (
                                  <i
                                    className={
                                      "fa-regular fa-arrows-rotate fs-5 fa-spin"
                                    }
                                  ></i>
                                )}
                              </h5>
                              <p>
                                {allCall?.inbound?.duration !== undefined ? (
                                  allCall?.inbound?.duration
                                ) : (
                                  <i
                                    className={
                                      "fa-regular fa-arrows-rotate fs-5 fa-spin"
                                    }
                                  ></i>
                                )}{" "}
                                Inbound /{" "}
                                {allCall?.outbound?.duration !== undefined ? (
                                  allCall?.outbound?.duration
                                ) : (
                                  <i
                                    className={
                                      "fa-regular fa-arrows-rotate fs-5 fa-spin"
                                    }
                                  ></i>
                                )}{" "}
                                Outbound
                              </p>
                            </div>
                            <div className="col-xxl-3 col-lg-4">
                              <ModuleGraphDashboard
                                fields={["In Duration", "Out Duration"]}
                                percentage={[
                                  allCall?.inbound?.duration,
                                  allCall?.outbound?.duration,
                                ]}
                                colors={['#a5d02a', '#3e8ef7']}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 mb-3 mb-xl-0">
                      <div className="itemWrapper c">
                        <div className="heading">
                          <div className="d-flex flex-wrap justify-content-between">
                            <div className="col-9">
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
                            <div className="col-3">
                              <i
                                onClick={() => handleMissedCallClick()}
                                className="fa-duotone fa-phone-missed"
                              ></i>
                            </div>
                          </div>
                        </div>
                        <div className="data-number2">
                          <div className="d-flex flex-wrap justify-content-between">
                            <div className="col-xxl-9 col-lg-8">
                              <h5>
                                {allCall?.missed !== undefined ? (
                                  allCall?.missed
                                ) : (
                                  <i
                                    className={
                                      "fa-regular fa-arrows-rotate fs-5 fa-spin"
                                    }
                                  ></i>
                                )}
                              </h5>
                              <p>
                                {allCall?.inbound?.missed !== undefined ? (
                                  allCall?.inbound?.missed
                                ) : (
                                  <i
                                    className={
                                      "fa-regular fa-arrows-rotate fs-5 fa-spin"
                                    }
                                  ></i>
                                )}{" "}
                                Inbound Missed /{" "}
                                {allCall?.outbound?.missed !== undefined ? (
                                  allCall?.outbound?.missed
                                ) : (
                                  <i
                                    className={
                                      "fa-regular fa-arrows-rotate fs-5 fa-spin"
                                    }
                                  ></i>
                                )}{" "}
                                Outbound Missed
                              </p>
                            </div>
                            <div className="col-xxl-3 col-lg-4">
                              <ModuleGraphDashboard
                                fields={["In Missed", "Out Missed", "Total Missed"]}
                                percentage={[
                                  allCall?.inbound?.missed,
                                  allCall?.outbound?.missed,
                                  allCall?.missed,
                                ]}
                                colors={['#ff9e36', '#ff8400', '#ff6000']}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 mb-3 mb-xl-0">
                      <div className="itemWrapper d">
                        <div className="heading">
                          <div className="d-flex flex-wrap justify-content-between">
                            <div className="col-9">
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
                            <div className="col-3">
                              <i className="fa-duotone fa-phone-xmark"></i>
                            </div>
                          </div>
                        </div>
                        <div className="data-number2">
                          <div className="d-flex flex-wrap justify-content-between">
                            <div className="col-xxl-9 col-lg-8">
                              <h5>{callCardData.abandonedCalls.count}</h5>
                              <p>{callCardData?.abandonedCalls?.internal} Internal / {callCardData?.abandonedCalls?.external} External</p>
                            </div>
                            <div className="col-xxl-3 col-lg-4">
                              {/* <img
                                alt="dashboard"
                                src={require("../../assets/images/icons/diagram.png")}
                              /> */}
                              <ModuleGraphDashboard
                                fields={["Internal", "External"]}
                                percentage={[
                                  callCardData?.abandonedCalls?.internal,
                                  callCardData?.abandonedCalls?.external
                                ]}
                                colors={['#ff004c', '#ff2365']}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 mt-xl-4 chartWrapper">
                      <div className="row">
                        <div className="col-xl-3 mb-3 mb-xl-0">
                          <div className="wrapper h-100" style={{ placeContent: 'center' }}>
                            {/* <DoughnutChart
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
                            /> */}
                            <div className='circularProgressWrapper'>
                              <svg width="250" height="250" viewBox="0 0 250 250" className="circular-progress" style={{ '--progress': `${Math.round((onlineExtension.length / accountDetails?.extensions?.length) * 100)}` }}>
                                <circle className="bg"
                                  cx="125" cy="125" r="115" fill="none" stroke="#f17d0130" stroke-width="20"
                                ></circle>
                                <circle className="fg"
                                  cx="125" cy="125" r="115" fill="none" stroke="#f17d01" stroke-width="20"
                                  stroke-dasharray="361.25 361.25"
                                ></circle>
                              </svg>
                              <div className='circularProgressContent'>
                                <div className="data-number">
                                  <label style={{ color: '#f17d01' }}>{onlineExtension.length}</label> <span>/ {accountDetails?.extensions?.length}</span>
                                </div>
                                <p>Online Agents</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-3 mb-3 mb-xl-0">
                          <div className="wrapper h-100" style={{ placeContent: 'center' }}>
                            {/* <DoughnutChart
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
                            /> */}
                            <div className='circularProgressWrapper'>
                              <svg width="250" height="250" viewBox="0 0 250 250" className="circular-progress" style={{ '--progress': `${Math.round((allCall?.inbound?.completed / allCall?.inbound?.total) * 100)}` }}>
                                <circle className="bg"
                                  cx="125" cy="125" r="115" fill="none" stroke="#a5d02a30" stroke-width="20"
                                ></circle>
                                <circle className="fg"
                                  cx="125" cy="125" r="115" fill="none" stroke="#a5d02a" stroke-width="20"
                                  stroke-dasharray="361.25 361.25"
                                ></circle>
                              </svg>
                              <div className='circularProgressContent'>
                                <div className="data-number">
                                  <label style={{ color: '#a5d02a' }}>{allCall?.inbound?.completed}</label> <span>/ {allCall?.inbound?.total}</span>
                                </div>
                                <p>Inbound Calls Completed</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-6 mb-3 mb-xl-0">
                          <div className="wrapper">
                            <GraphChart
                              fields={[
                                "Available Extension",
                                "Registered Extension",
                              ]}
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
                    <div
                      className="col-xl-3 mb-3 mb-xl-0"
                      style={{ cursor: "pointer" }}
                    >
                      <div className="itemWrapper a">
                        <div className="heading">
                          <div className="d-flex flex-wrap justify-content-between">
                            <div className="col-9">
                              <h5>Package Type</h5>
                              <p>Click to view details</p>
                            </div>
                            <div className="col-3">
                              <i className="fa-duotone fa-cube"></i>
                            </div>
                          </div>
                        </div>

                        <div className="data-number2">
                          <div className="d-flex flex-wrap justify-content-between">
                            <div className="col-9">
                              <h5>{accountDetails?.package.name}</h5>
                              <p>
                                Price: ${accountDetails?.package?.regular_price}{" "}
                                /{" "}
                                {accountDetails?.package?.subscription_type ===
                                  "annually"
                                  ? "Annually"
                                  : "Monthly"}
                              </p>
                              <p>
                                Started On:{" "}
                                {
                                  accountDetails?.subscription?.[0]?.created_at?.split(
                                    "T"
                                  )[0]
                                }
                              </p>
                            </div>
                            <div className="col-3">
                              <img
                                alt="dashboard"
                                src={require("../../assets/images/icons/diagram.png")}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 mb-3 mb-xl-0">
                      <div className="itemWrapper b">
                        <div className="heading">
                          <div className="d-flex flex-wrap justify-content-between">
                            <div className="col-9">
                              <h5>Upcoming Transaction</h5>
                              <p>
                                {
                                  accountDetails?.subscription[0].end_date?.split(
                                    " "
                                  )[0]
                                }
                              </p>
                            </div>
                            <div className="col-3">
                              <i className="fa-duotone fa-money-check-dollar" onClick={() => { navigate("/card-details") }}></i>
                            </div>
                          </div>
                        </div>

                        <div className="data-number2">
                          <div className="d-flex flex-wrap justify-content-between">
                            <div className="col-9">
                              <h5>${accountDetails?.package?.regular_price}</h5>
                              <p>
                                End Date:{" "}
                                {accountDetails?.subscription[0].end_date?.split(" ")[0]}
                              </p>
                              <p>
                                {accountDetails?.package?.subscription_type ===
                                  "annually"
                                  ? "Annually"
                                  : "Monthly"}{" "}
                                Basis
                              </p>
                            </div>
                            <div className="col-3">
                              <img
                                alt="dashboard"
                                src={require("../../assets/images/icons/diagram.png")}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 mb-3 mb-xl-0">
                      <div className="itemWrapper c">
                        <div className="heading">
                          <div className="d-flex flex-wrap justify-content-between">
                            <div className="col-9">
                              <h5>Last Transaction</h5>
                              <p>
                                #{accountDetails?.payments[0]?.transaction_id}
                              </p>
                            </div>
                            <div className="col-3">
                              <i className="fa-solid fa-dollar-sign" onClick={() => navigate("/card-transaction-list")}></i>
                            </div>
                          </div>
                        </div>

                        <div className="data-number2">
                          <div className="d-flex flex-wrap justify-content-between">
                            <div className="col-9">
                              <h5>
                                ${accountDetails?.payments[0]?.amount_subtotal}
                              </h5>
                              <p>
                                Transaction Time:{" "}
                                {
                                  accountDetails?.payments[0]?.transaction_date.split(
                                    " "
                                  )[0]
                                }
                                ,{" "}
                                {
                                  accountDetails?.payments[0]?.transaction_date.split(
                                    " "
                                  )[1]
                                }
                              </p>
                            </div>
                            <div className="col-3">
                              <img
                                alt="dashboard"
                                src={require("../../assets/images/icons/diagram.png")}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-xl-3 mb-3 mb-xl-0">
                      <div className="itemWrapper d">
                        <div className="heading">
                          <div className="d-flex flex-wrap justify-content-between">
                            <div className="col-9">
                              <h5>Wallet Info</h5>
                              {accountDetails?.balance?.created_at ? (
                                <p>
                                  Created On:{" "}
                                  {
                                    accountDetails?.balance?.created_at?.split(
                                      "T"
                                    )[0]
                                  }
                                  ,{" "}
                                  {
                                    accountDetails?.balance?.created_at
                                      ?.split("T")[1]
                                      ?.split(".")[0]
                                  }
                                </p>
                              ) : (
                                ""
                              )}
                            </div>
                            <div className="col-3">
                              <i className="fa-duotone fa-wallet" onClick={() => navigate("/card-details")}></i>
                            </div>
                          </div>
                        </div>

                        <div className="data-number2">
                          <div className="d-flex flex-wrap justify-content-between">
                            <div className="col-9">
                              <h5>${accountDetails?.balance?.amount || 0}</h5>
                              {accountDetails?.balance?.updated_at ? (
                                <p>
                                  Last recharged:{" "}
                                  {
                                    accountDetails?.balance?.updated_at?.split(
                                      "T"
                                    )[0]
                                  }
                                  ,{" "}
                                  {
                                    accountDetails?.balance?.updated_at
                                      ?.split("T")[1]
                                      ?.split(".")[0]
                                  }
                                </p>
                              ) : (
                                ""
                              )}
                            </div>
                            <div className="col-3">
                              <img
                                alt="dashboard"
                                src={require("../../assets/images/icons/diagram.png")}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-12 mt-xl-4">
                      <div className="row">
                        <div className="col-xl-4 mb-3 mb-xl-0">
                          <div className="itemWrapper a">
                            <div className="heading">
                              <div className="d-flex flex-wrap justify-content-between">
                                <div className="col-9">
                                  <h5>Invoices</h5>
                                  <p>Last 5 invoices</p>
                                </div>
                                <div className="col-3">
                                  <i className="fa-duotone fa-file-invoice" onClick={() => navigate("/card-transaction-list")}></i>
                                </div>
                              </div>
                            </div>
                            <div className="data-number2">
                              <div className="d-flex flex-wrap justify-content-between">
                                <div className="col-12">
                                  <ul>
                                    {accountDetails?.payments
                                      ?.slice(0, 5)
                                      .map((item, index) => (
                                        <li key={index}>
                                          {item.transaction_date}
                                          <span
                                            className="float-end fw-bold"
                                            onClick={() =>
                                              downloadImage(item.invoice_url)
                                            }
                                          >
                                            ${item.amount_subtotal}{" "}
                                          </span>
                                        </li>
                                      ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-4 mb-3 mb-xl-0">
                          <div className="itemWrapper b">
                            <div className="heading">
                              <div className="d-flex flex-wrap justify-content-between">
                                <div className="col-9">
                                  <h5>Billing Address</h5>
                                  <p>Click the icon to change it</p>
                                </div>
                                <div className="col-3">
                                  <i className="fa-duotone fa-address-card" onClick={() => navigate("/card-details")}></i>
                                </div>
                              </div>
                            </div>
                            <div className="data-number2">
                              <div className="d-flex flex-wrap justify-content-between">
                                <div className="col-12">
                                  <ul>
                                    <li>
                                      Full Name{" "}
                                      <span className="float-end">
                                        {
                                          accountDetails?.billing_address[0]
                                            ?.fullname
                                        }
                                      </span>
                                    </li>
                                    <li>
                                      Phone{" "}
                                      <span className="float-end">
                                        {
                                          accountDetails?.billing_address[0]
                                            ?.contact_no
                                        }
                                      </span>
                                    </li>
                                    <li>
                                      Email{" "}
                                      <span className="float-end">
                                        {
                                          accountDetails?.billing_address[0]
                                            ?.email
                                        }
                                      </span>
                                    </li>
                                    <li>
                                      Address{" "}
                                      <span className="float-end">
                                        {
                                          accountDetails?.billing_address[0]
                                            ?.address
                                        }
                                      </span>
                                    </li>
                                    <li>
                                      City, State
                                      <span className="float-end">
                                        {
                                          accountDetails?.billing_address[0]
                                            ?.city
                                        }
                                        ,{" "}
                                        {
                                          accountDetails?.billing_address[0]
                                            ?.state
                                        }
                                      </span>
                                    </li>
                                    <li>
                                      Zip Code{" "}
                                      <span className="float-end">
                                        {
                                          accountDetails?.billing_address[0]
                                            ?.zip
                                        }
                                      </span>
                                    </li>
                                    <li>
                                      Country{" "}
                                      <span className="float-end">
                                        {
                                          accountDetails?.billing_address[0]
                                            ?.country
                                        }
                                      </span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-4 chartWrapper mb-3 mb-xl-0">
                          <div className="itemWrapper c">
                            <div className='heading h-auto'>
                              <div className="d-flex flex-wrap justify-content-between align-items-center">
                                <div className='col-auto'>
                                  <h5>Call Billed Per Hour</h5>
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
                                  <div className="deviceProvision position-relative" style={{ width: '500px', height: '300px' }}>
                                    <div className="itemWrapper a addNew d-flex justify-content-center align-items-center shadow-none">
                                      <i class="fa-solid fa-spinner-third fa-spin fs-3"></i>
                                    </div>
                                  </div>
                                ) :
                                <GraphChart
                                  height={'320px'}
                                  // chartType="multiple"
                                  chartCateg={"money"}
                                  label1={"Inbound"}
                                  label2={"Outbound"}
                                  // label3={"Internal"}
                                  // label4={"Missed"}
                                  type={"bar"}
                                  fields={graphData?.callCostPerHour?.map((item, index) => {
                                    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                                    const day = weekday[new Date(item.start_time).getDay()].replace('day', '');
                                    const time = new Date(item.start_time).getHours().toString().padStart(2, '0') + ":" + new Date(item.start_time).getMinutes().toString().padStart(2, '0');
                                    return `${time}`
                                  })}
                                  percentage={[graphData?.callCostPerHour?.map((item, index) => item.inbound_call_cost), graphData?.callCostPerHour?.map((item, index) => item.outbound_call_cost)]}
                                  colors={["#05b62c", "#ff7900"]}
                                />
                              }
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
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
