/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  featureUnderdevelopment,
  generalGetFunction,
  generalPutFunction,
  logout,
} from "../../GlobalFunction/globalFunction";
import { toast } from "react-toastify";
import CircularLoader from "../../Loader/CircularLoader";
import DarkModeToggle from "../../CommonComponents/DarkModeToggle";
import LogOutPopUp from "./LogOutPopUp";
import { useSIPProvider } from "modify-react-sipjs";

/**
 * The CallCenter component renders a call center dashboard where the user can see the status of the agents assigned to them.
 * It fetches the call center data from the API and displays it in a table.
 * The user can also search for specific agents and take actions on the agents such as logging out or disconnecting.
 * @param {boolean} initial - This is a boolean that is used to determine whether the call center component is being rendered initially or not.
 * @returns {JSX.Element}
 */
const CallCenter = ({ initial }) => {
  const sessions = useSelector((state) => state.sessions);
  const dispatch = useDispatch();
  const callCenter = useSelector((state) => state.callCenter);
  const callCenterRefresh = useSelector((state) => state.callCenterRefresh);
  const account = useSelector((state) => state.account) || {};
  const [assignerCallcenter, setAssignerCallcenter] = useState([]);
  const [refreshCenter, setRefreshCenter] = useState(0);
  const [loading, setLoading] = useState(true);
  const [callCenterDetailData, setCallCenterDetailData] = useState([]);
  const allCallCenterIds = useSelector((state) => state.allCallCenterIds);
  const [allLogOut, setAllLogOut] = useState(false);
  const { sessionManager } = useSIPProvider();
  const Id = account?.id || "";

  console.log("callCenter", callCenter);

  useEffect(() => {
    const getData = async () => {
      dispatch({
        type: "SET_CALLCENTERREFRESH",
        callCenterRefresh: callCenterRefresh + 1,
      });
      const apiData = await generalGetFunction("/call-center-agent/all");
      if (apiData?.status) {
        setCallCenterDetailData(apiData.data);
      } else {
      }
    };
    getData();
  }, [refreshCenter]);

  useEffect(() => {
    if (callCenter.length > 0) {
      setLoading(false);
      const AssignedCallcenter = [...callCenter].filter((queue) =>
        queue.agents.some((agent) => Number(agent.agent_name) == Id)
      );
      let CallerId = null;
      AssignedCallcenter.forEach((item) => {
        const foundAgent = item.agents.find(
          (agent) =>
            Number(agent.agent_name) === Id && agent.status === "Available"
        );

        if (foundAgent && foundAgent?.id) {
          CallerId = foundAgent.id; // Assign only if found
          if (!allCallCenterIds.includes(CallerId)) {
            dispatch({
              type: "SET_ALL_CALL_CENTER_IDS",
              CallerId,
            });
          }
        }
      });
      setAssignerCallcenter(AssignedCallcenter);
    }
  }, [Id, callCenter]);
  // Function to handle logout
  const handleLogOut = async () => {
    setLoading(true);
    try {
      const apiResponses = await logout(
        allCallCenterIds,
        dispatch,
        sessionManager
      );
    } catch (error) {
      console.error("Unexpected error in handleLogOut:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
        .callDashboardPrimTable{
          height: calc(100vh - 70px);
        }
      `}
      </style>
      {/* <SideNavbarApp /> */}
      <main
        className={initial ? "" : "mainContentApp"}
        style={{
          marginRight:
            sessions.length > 0 && Object.keys(sessions).length > 0
              ? "250px"
              : "0",
        }}
      >
        {allLogOut && (
          <LogOutPopUp
            setAllLogOut={setAllLogOut}
            handleLogOut={handleLogOut}
          />
        )}

        <div className="container-fluid">
          <div className="row">
            <div className={!initial ? "col-12 px-0" : "col-12 px-0 d-none"}>
              <div className="newHeader">
                <div className="col-auto" style={{ padding: "0 10px" }}>
                  <h3 style={{ fontFamily: "Outfit", marginBottom: "0" }}>
                    <button
                      className="clearButton2 text-dark"
                      onClick={() => featureUnderdevelopment()}
                    >
                      <i className="fa-solid fa-chevron-left fs-4"></i>
                    </button>{" "}
                    Call Center{" "}
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
                  <DarkModeToggle marginLeft={"2"} />
                  <div className="col-auto">
                      <div className="dropdown">
                        <div
                          className="myProfileWidget"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {/* <div className="profileHolder" id="profileOnlineNav">
                            <img
                              src={account?.profile_picture}
                              alt="profile"
                              onError={(e) => e.target.src = require('../../assets/images/placeholder-image.webp')}
                            />
                          </div> */}
                          {/* <div className="profileName">
                            {account?.username}{" "}
                            <span className="status">Available</span>
                          </div> */}

                          <i class="fa-solid fa-right-from-bracket"></i>
                        </div>
                        <ul className="dropdown-menu">
                          <li
                            onClick={() => {
                              if (allCallCenterIds.length > 0) {
                                setAllLogOut(true);
                              } else {
                                handleLogOut();
                              }
                            }}
                          >
                            <div
                              className="dropdown-item"
                              style={{ cursor: "pointer" }}
                            >
                              Logout
                            </div>
                          </li>
                          <li
                            onClick={() => {
                              sessionManager.disconnect();
                            }}
                          >
                            <div
                              className="dropdown-item"
                              style={{ cursor: "pointer" }}
                            >
                              Disconnect
                            </div>
                          </li>
                          <li
                            onClick={() => {
                              sessionManager.connect();
                            }}
                          >
                            <div
                              className="dropdown-item"
                              style={{ cursor: "pointer" }}
                            >
                              Reconnect
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                </div>
              </div>
            </div>
            <>
              <div className="overviewTableWrapper">
                <div className="overviewTableChild">
                  <div className="d-flex flex-wrap">
                    <div className={!initial ? "col-12" : "col-12 d-none"}>
                      <div className="heading">
                        <div className="content">
                          <h4>
                            Call Center Queue{" "}
                            <button
                              disabled={loading}
                              onClick={() => {
                                setRefreshCenter(refreshCenter + 1);
                                setLoading(true);
                              }

                              }
                              className="clearButton2"
                            >
                              <i
                                className={
                                  loading
                                    ? "fa-regular fa-arrows-rotate fs-5 fa-spin"
                                    : "fa-regular fa-arrows-rotate fs-5"
                                }
                              ></i>
                            </button>
                          </h4>
                          <p>You can see the status of the agents</p>
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-12"
                      style={{ padding: "25px 20px 0px" }}
                    >
                      <div className="tableContainer mt-0">
                        <table className="callCenter">
                          <thead>
                            <tr>
                              <th className="sl">#</th>
                              <th>Name</th>
                              <th className="extension">Extension</th>
                              <th className="options">Options</th>
                              <th className="options">Break-Timer</th>
                              <th className="options">Total-Break</th>
                            </tr>
                          </thead>
                          <tbody>
                            {assignerCallcenter.length > 0 &&
                              assignerCallcenter.map((item, index) => {
                                return (
                                  <CallCenterListItem
                                    key={index}
                                    index={index}
                                    item={item}
                                    Id={Id}
                                    setRefreshCenter={setRefreshCenter}
                                    callCenterDetailData={callCenterDetailData}
                                  />
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          </div>
        </div>
      </main>
      {/* {sessions.length > 0 && Object.keys(sessions).length > 0 ? (
        <>
          <section className="activeCallsSidePanel">
            <div className="container">
              <div className="row">
                {sessions.length > 0 &&
                  sessions.map((session, chennel) => (
                    <ActiveCallSidePanel
                      key={chennel}
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
      )} */}
    </>
  );
};

export default CallCenter;
const CallCenterListItem = ({
  item,
  index,
  Id,
  setRefreshCenter,
  callCenterDetailData,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0); // Store in seconds (Unix format)
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const dispatch = useDispatch();

  // Extract the agent's reference ID and status
  const { id: refId = "", status = "" } =
    item.agents.find((agent) => Number(agent.agent_name) === Id) || {};

  // Calculate total break time based on callCenterDetailData
  useEffect(() => {
    const filteredData = callCenterDetailData.filter((data) => {
      return item.queue_name === data.queue_name;
    });

    const totalBreakTimeInMs = filteredData.reduce((total, breakTime) => {
      if (breakTime.break_duration) {
        const [hours, minutes, seconds] = breakTime.break_duration.split(":").map(Number);
        const durationMs = (hours * 3600 + minutes * 60 + seconds) * 1000;
        return total + durationMs;
      }
      return total;
    }, 0);

    setTotalTime(totalBreakTimeInMs / 1000);

    const ongoingBreak = filteredData.find(
      (breakTime) => breakTime.end_time === null && breakTime.start_time
    );

    if (ongoingBreak && item.status === "On Break") {
      const latestStartTime = new Date(ongoingBreak.start_time);
      // Set the timer to start from the ongoing break start time
      const elapsed = Math.floor((new Date() - latestStartTime) / 1000);
      setIsActive(true);
      setTimer(elapsed);
      setSeconds(elapsed); // Resume timer from ongoing break start time
    }
  }, [callCenterDetailData, item]);

  // Set the agent's status (Logged In, Logged Out, On Break)
  useEffect(() => {
    if (status === "Logged Out") {
      setIsLoggedIn(false);
    } else if (status === "Available") {
      setIsLoggedIn(true);
      setIsOnBreak(false);
    } else if (status === "On Break") {
      setIsOnBreak(true);
      setIsLoggedIn(true);
      startTimer(); // Start the timer when the agent is on break
    }
  }, [status]);

  // Start and stop the break timer
  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, seconds]);

  useEffect(() => {
    setTimer(seconds);
  }, [seconds]);

  // Start the timer when the agent goes on break
  const startTimer = () => {
    setIsActive(true);
    // setTimer(0);
    // setSeconds(0); // Reset the timer when the break starts
  };

  // Stop the timer when the agent resumes or logs out
  const stopTimer = () => {
    setIsActive(false);
    // setTotalTime((prevTotal) => prevTotal + seconds); // Add current break time to the total break time
    setSeconds(0); // Reset the break time for the next break
  };

  // Format time in HH:MM:SS format
  const formatTime = (totalSeconds) => {
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0"
    );
    const secs = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${secs}`;
  };

  // Handle Login, Logout, and Break actions
  async function handleLoginLogout(CallerId, action, callCenterName) {
    const parsedData = {
      status: action,
    };

    const apiData = await generalPutFunction(
      `call-center-agent/update/${CallerId}`,
      parsedData
    );

    if (apiData.status) {
      setLoading(false);
      if (action === "Logged Out") {
        dispatch({
          type: "DELETE_CALLER_ID",
          CallerId, // Pass the callCenterID to delete
        });
        toast.success(`Logged out for ${callCenterName}`);
        setIsOnBreak(false);
        setIsLoggedIn(false);
        stopTimer(); // Stop the timer when logging out
      } else if (action === "Available") {
        setIsLoggedIn(true);
        dispatch({
          type: "SET_ALL_CALL_CENTER_IDS",
          CallerId, // Adding another callCenterID
        });
        setIsOnBreak(false);
        stopTimer(); // Stop the timer when becoming available
        toast.success(`Available for ${callCenterName}`);
      } else if (action === "On Break") {
        setIsOnBreak(true);
        startTimer(); // Start the timer when going on break
        toast.success(`Break Started for ${callCenterName}`);
      }
      setRefreshCenter((prev) => prev + 1);
    } else {
      setLoading(false);
      // toast.error(apiData.message); // Handle error
    }
  }

  return (
    <>
      {loading ? <CircularLoader /> : ""}
      <tr>
        <td>{index + 1}</td>
        <td>{item?.queue_name}</td>
        <td>{item?.extension}</td>
        <td>
          {isLoggedIn ? (
            <div className="d-flex gap-2">
              <label
                className={`tableLabel ${isOnBreak ? "pending" : "success"}`}
                onClick={() => {
                  if (!isOnBreak)
                    handleLoginLogout(refId, "On Break", item?.queue_name);
                  else if (isOnBreak)
                    handleLoginLogout(refId, "Available", item?.queue_name);
                }}
              >
                {isOnBreak ? "Resume" : "Break"}
              </label>
              <label
                className="tableLabel fail"
                onClick={() =>
                  handleLoginLogout(refId, "Logged Out", item?.queue_name)
                }
              >
                Logout
              </label>
            </div>
          ) : (
            <label
              className="tableLabel success"
              onClick={() =>
                handleLoginLogout(refId, "Available", item?.queue_name)
              }
            >
              Login
            </label>
          )}
        </td>
        <td>{formatTime(timer)}</td>
        <td>{formatTime(totalTime)}</td>
      </tr>
    </>
  );
};
