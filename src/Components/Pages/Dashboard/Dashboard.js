import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../CommonComponents/Header";
import DoughnutChart from "../../CommonComponents/DoughnutChart";
import GraphChart from "../../CommonComponents/GraphChart";
const Dashboard = () => {
  const callDetailsRefresh = useSelector((state) => state.callDetailsRefresh);
  const ringGroupRefresh = useSelector((state) => state.ringGroupRefresh);
  const callCenterRefresh = useSelector((state) => state.callCenterRefresh);
  const accountDetails = useSelector((state) => state.accountDetails);
  const dispatch = useDispatch();
  const extensionRefresh = useSelector((state) => state.extensionRefresh);
  const allUserRefresh = useSelector((state) => state.allUserRefresh);
  const extensionList = useSelector((state) => state.extension).length;
  const userList = useSelector((state) => state.allUser?.data?.length) || 0;
  const registerUser = useSelector((state) => state.registerUser);
  const loginUser = useSelector((state) => state.loginUser);
  const ringGroup = useSelector((state) => state.ringGroup || []);
  const allCall = useSelector((state) => state.allCall || {});
  const activeCall = useSelector((state) => state.activeCall || []);
  const callCenter = useSelector((state) => state.callCenter || []);
  const extension = useSelector((state) => state.extension || []);

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
  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row ">
            <Header title="Dashboard" />

            <div className="col-12 mt-3 tangoNavs">
              <nav>
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                  <button
                    className="nav-link active"
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
                    id="nav-profile-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#nav-messages"
                    type="button"
                    role="tab"
                    aria-controls="nav-messages"
                    aria-selected="false"
                  >
                    Messages
                  </button>
                  <button
                    className="nav-link"
                    id="nav-contact-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#nav-queue"
                    type="button"
                    role="tab"
                    aria-controls="nav-queue"
                    aria-selected="false"
                  >
                    Call Queue
                  </button>
                  <button
                    className="nav-link"
                    id="nav-contact-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#nav-ring"
                    type="button"
                    role="tab"
                    aria-controls="nav-ring"
                    aria-selected="false"
                  >
                    Ring Group
                  </button>
                </div>
              </nav>
              <div className="tab-content mt-3" id="nav-tabContent">
                <div
                  className="tab-pane fade show active"
                  id="nav-calls"
                  role="tabpanel"
                  aria-labelledby="nav-home-tab"
                  tabIndex="0"
                >
                  <div className="row">
                    <div className="col-xl-3">
                      <div className="itemWrapper a">
                        <div className="heading">
                          <i className="fa-duotone fa-phone-office"></i> Handled
                          Calls
                        </div>
                        <div className="data-number">
                          {callCardData.handled.count}
                        </div>
                        <div className="label">
                          {callCardData.handled.inboundAnswered} Inbound
                          (Answered)
                        </div>
                        {/* <div className="label">
                          {callCardData.handled.connectedCallbacks} Connected
                          Callbacks
                        </div> */}
                        <div className="label">
                          {callCardData.handled.outboundAnswered} Outbound
                          (Connected)
                        </div>
                        {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/user'" effect="ripple"><i className="fa-duotone fa-users"></i> View All Users</button> */}
                      </div>
                    </div>
                    <div className="col-xl-3">
                      <div className="itemWrapper b">
                        <div className="heading">
                          <i className="fa-duotone fa-clock"></i> Total Minutes
                        </div>
                        <div className="data-number">
                          {callCardData.minutes.count}
                        </div>
                        <div className="label">
                          {callCardData.minutes.inboundAnswered} Inbound
                          (Answered)
                        </div>
                        <div className="label">
                          {callCardData.minutes.outboundConnected} Outbound
                          (Connected)
                        </div>
                        {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/extensions'" effect="ripple"><i className="fa-duotone fa-phone-office"></i> View All Extensions</button> */}
                      </div>
                    </div>
                    <div className="col-xl-3">
                      <div className="itemWrapper c">
                        <div className="heading">
                          <i className="fa-duotone fa-phone-missed"></i> Missed
                          Calls
                        </div>
                        <div className="data-number">
                          {callCardData.missedCalls.count}
                        </div>
                        {/* <div className="label">
                          {callCardData.missedCalls.voiceMissed} Voicecall
                          Missed
                        </div> */}
                        <div className="label">
                          {callCardData.missedCalls.callMissed} Calls Missed
                        </div>
                        {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/devices'" effect="ripple"><i className="fa-duotone fa-mobile-retro"></i> View All Devices</button> */}
                      </div>
                    </div>
                    <div className="col-xl-3">
                      <div className="itemWrapper d">
                        <div className="heading">
                          <i className="fa-duotone fa-phone-xmark"></i>{" "}
                          Abandoned Calls
                        </div>
                        <div className="data-number">
                          {callCardData.abandonedCalls.count}
                        </div>
                        {/* <div className="label">0 Internal Call</div>
                        <div className="label">0 External Calls</div> */}
                        {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/devices'" effect="ripple"><i className="fa-duotone fa-mobile-retro"></i> View All Devices</button> */}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="nav-messages"
                  role="tabpanel"
                  aria-labelledby="nav-profile-tab"
                  tabIndex="0"
                >
                  <div className="row">
                    <div className="col-xl-3">
                      <div className="itemWrapper a">
                        <div className="heading">
                          <i className="fa-duotone fa-message-arrow-down"></i>{" "}
                          Received Messages
                        </div>
                        {/* <div className="data-number">10</div> */}
                        {/* <div className="label">7 UnRead Messages</div>
                        <div className="label">3 Read Messages</div> */}
                        {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/user'" effect="ripple"><i className="fa-duotone fa-users"></i> View All Users</button> */}
                      </div>
                    </div>
                    <div className="col-xl-3">
                      <div className="itemWrapper b">
                        <div className="heading">
                          <i className="fa-duotone fa-message-arrow-up"></i>{" "}
                          Messages Sent
                        </div>
                        {/* <div className="data-number">20</div> */}
                        {/* <div className="label">17 Internal Messages</div>
                        <div className="label">3 External Messages</div> */}
                        {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/extensions'" effect="ripple"><i className="fa-duotone fa-phone-office"></i> View All Extensions</button> */}
                      </div>
                    </div>
                    <div className="col-xl-3">
                      <div className="itemWrapper c">
                        <div className="heading">
                          <i className="fa-duotone fa-inbox"></i> Total Inbox
                        </div>
                        {/* <div className="data-number">50</div> */}
                        {/* <div className="label">1.26 KB Used</div>
                        <div className="label">100 GB Available</div> */}
                        {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/devices'" effect="ripple"><i className="fa-duotone fa-mobile-retro"></i> View All Devices</button> */}
                      </div>
                    </div>
                    <div className="col-xl-3">
                      <div className="itemWrapper d">
                        <div className="heading">
                          <i className="fa-duotone fa-envelopes"></i> Emails
                        </div>
                        {/* <div className="data-number">6</div> */}
                        {/* <div className="label">1 Sent Email</div>
                        <div className="label">5 Unread Email</div>
                        <div className="label">1 Draft</div> */}
                        {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/devices'" effect="ripple"><i className="fa-duotone fa-mobile-retro"></i> View All Devices</button> */}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="nav-queue"
                  role="tabpanel"
                  aria-labelledby="nav-contact-tab"
                  tabIndex="0"
                >
                  <div className="row">
                    <div className="col-xl-3">
                      <div className="itemWrapper a">
                        <div className="heading">
                          <i className="fa-duotone fa-phone-volume"></i> Total
                          Queues
                        </div>
                        <div className="data-number">
                          {" "}
                          {callCenterQueue.total.count}{" "}
                        </div>
                        {/* <div className="label">3 Currently Active Queue</div>
                        <div className="label">7 Inactive Queue</div> */}
                        {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/user'" effect="ripple"><i className="fa-duotone fa-users"></i> View All Users</button> */}
                      </div>
                    </div>
                    <div className="col-xl-3">
                      <div className="itemWrapper b">
                        <div className="heading">
                          <i className="fa-duotone fa-users"></i> Total Agents
                        </div>
                        <div className="data-number">
                          {callCenterQueue.totalAgents.count}{" "}
                        </div>
                        {/* <div className="label">15 Agents in Queue</div>
                        <div className="label">5 Agents Not in Queue</div> */}
                        {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/extensions'" effect="ripple"><i className="fa-duotone fa-phone-office"></i> View All Extensions</button> */}
                      </div>
                    </div>
                    <div className="col-xl-3">
                      <div className="itemWrapper c">
                        <div className="heading">
                          <i className="fa-duotone fa-circle-pause"></i> Total
                          Calls
                        </div>
                        <div className="data-number">
                          {callCenterQueue.totalCalls.count}
                        </div>
                        {/* <div className="label">1 Waiting in Queue 1</div>
                        <div className="label">4 Waiting in Queue 2</div> */}
                        {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/devices'" effect="ripple"><i className="fa-duotone fa-mobile-retro"></i> View All Devices</button> */}
                      </div>
                    </div>
                    <div className="col-xl-3">
                      <div className="itemWrapper d">
                        <div className="heading">
                          <i className="fa-duotone fa-phone-xmark"></i> Missed
                          Calls
                        </div>
                        <div className="data-number">
                          {callCenterQueue.missedCalls.count}
                        </div>
                        {/* <div className="label">4 Calls Overflown</div>
                        <div className="label">2 Calls Abandoned</div> */}
                        {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/devices'" effect="ripple"><i className="fa-duotone fa-mobile-retro"></i> View All Devices</button> */}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="nav-ring"
                  role="tabpanel"
                  aria-labelledby="nav-contact-tab"
                  tabIndex="0"
                >
                  <div className="row">
                    <div className="col-xl-3">
                      <div className="itemWrapper a">
                        <div className="heading">
                          <i className="fa-duotone fa-phone-rotary"></i> Total
                          Ring Group
                        </div>
                        <div className="data-number">
                          {ringGroupCardData.total.count || 0}
                        </div>
                        <div className="label">
                          {ringGroupCardData.total.inbound || 0} Total inbound
                          calls
                        </div>
                        <div className="label">
                          {" "}
                          {ringGroupCardData.total.outbound || 0} Total outbound
                          calls
                        </div>
                        {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/user'" effect="ripple"><i className="fa-duotone fa-users"></i> View All Users</button> */}
                      </div>
                    </div>
                    <div className="col-xl-3">
                      <div className="itemWrapper b">
                        <div className="heading">
                          <i className="fa-duotone fa-phone-volume"></i> Active
                          Calls{" "}
                        </div>
                        <div className="data-number">
                          {ringGroupCardData.active.count || 0}
                        </div>
                        <div className="label">
                          {ringGroupCardData.active.inbound || 0} active inbound
                          calls
                        </div>
                        <div className="label">
                          {ringGroupCardData.active.outbound || 0} active
                          outbound calls
                        </div>
                        {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/extensions'" effect="ripple"><i className="fa-duotone fa-phone-office"></i> View All Extensions</button> */}
                      </div>
                    </div>
                    <div className="col-xl-3">
                      <div className="itemWrapper c">
                        <div className="heading">
                          <i className="fa-duotone fa-circle-pause"></i> Total
                          Calls
                        </div>
                        <div className="data-number">
                          {ringGroupCardData.totalCalls.count || 0}
                        </div>
                        {/* <div className="label">1 Waiting in Queue 1</div>
                        <div className="label">4 Waiting in Queue 2</div> */}
                        {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/devices'" effect="ripple"><i className="fa-duotone fa-mobile-retro"></i> View All Devices</button> */}
                      </div>
                    </div>
                    <div className="col-xl-3">
                      <div className="itemWrapper d">
                        <div className="heading">
                          <i className="fa-duotone fa-phone-xmark"></i> Missed
                          Calls
                        </div>
                        <div className="data-number">
                          {ringGroupCardData.missed.count}
                        </div>
                        {/* <div className="label">4 Calls Overflown</div>
                        <div className="label">2 Calls Abandoned</div> */}
                        {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/devices'" effect="ripple"><i className="fa-duotone fa-mobile-retro"></i> View All Devices</button> */}
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
                        Number(accountDetails?.package?.number_of_user) -
                          extensionList,
                      ]}
                      centerTitle={`${extensionList}/${Number(
                        accountDetails?.package?.number_of_user
                      )}`}
                      centerDesc="Extensions Details"
                      colors={["#9999", "#FF6384", "#36A2EB"]}
                    />
                  </div>
                </div>
                <div className="col-xl-3">
                  <div className="wrapper">
                    <DoughnutChart
                      fields={[
                        "Online Users",
                        "Registered Users ",
                        "Available Users ",
                      ]}
                      percentage={[
                        loginUser.length,
                        userList,
                        Number(accountDetails?.package?.number_of_user) -
                          userList,
                      ]}
                      centerTitle={`${userList}/${Number(
                        accountDetails?.package?.number_of_user
                      )}`}
                      centerDesc="Total Users Available"
                      colors={["#9999", "#FF6384", "#36A2EB"]}
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
                        ((Number(accountDetails?.package?.number_of_user) -
                          extensionList) *
                          100) /
                          Number(accountDetails?.package?.number_of_user),
                        (extensionList * 100) /
                          Number(accountDetails?.package?.number_of_user),
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
      </section>
    </main>
  );
};

export default Dashboard;
