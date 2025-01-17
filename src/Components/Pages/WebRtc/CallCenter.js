import React, { useEffect, useState } from "react";
import SideNavbarApp from "./SideNavbarApp";
import { useDispatch, useSelector } from "react-redux";
import {
  featureUnderdevelopment,
  generalGetFunction,
  generalPutFunction,
} from "../../GlobalFunction/globalFunction";
import { toast } from "react-toastify";
import CircularLoader from "../../Loader/CircularLoader";
import ActiveCallSidePanel from "./ActiveCallSidePanel";
import { useNavigate } from "react-router-dom";
import Header from "../../CommonComponents/Header";
import DarkModeToggle from "../../CommonComponents/DarkModeToggle";

const CallCenter = () => {
  const sessions = useSelector((state) => state.sessions);
  const dispatch = useDispatch();
  const callCenter = useSelector((state) => state.callCenter);
  const callCenterRefresh = useSelector((state) => state.callCenterRefresh);
  const account = useSelector((state) => state.account) || {};
  const [assignerCallcenter, setAssignerCallcenter] = useState([]);
  const [refreshCenter, setRefreshCenter] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [callCenterData, setCallCenterData] = useState(null);
  const [callCenterDetailData, setCallCenterDetailData] = useState([]);

  const Id = account?.id || "";
  console.log(assignerCallcenter);
  useEffect(() => {
    setLoading(true);
    dispatch({
      type: "SET_CALLCENTERREFRESH",
      callCenterRefresh: callCenterRefresh + 1,
    });
  }, [refreshCenter]);

  useEffect(() => {
    const getData = async () => {
      const apiData = await generalGetFunction("/call-center-agent/all");
      if (apiData?.status) {
        setCallCenterData(apiData.data);

        setCallCenterDetailData(apiData.data);
      } else {
        console.log(apiData);
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
      setAssignerCallcenter(AssignedCallcenter);
    }
  }, [Id, callCenter]);

  // useEffect(() => {}, [refreshCenter, callCenterRefresh]);

  async function logOut() {
    const apiData = await generalGetFunction("/logout");
    localStorage.clear();
    if (apiData?.data) {
      localStorage.clear();
      dispatch({
        action: "SET_ACCOUNT",
        account: null,
      });
      navigate("/");
    }
  }
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
        className="mainContentApp"
        style={{
          marginRight:
            sessions.length > 0 && Object.keys(sessions).length > 0
              ? "250px"
              : "0",
        }}
      >
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 px-0">
              <div className="newHeader">
                <div className="col-auto" style={{ padding: "0 10px" }}>
                  <h3 style={{ fontFamily: "Outfit", marginBottom: "0" }}>
                    <button
                      class="clearButton2 text-dark"
                      onClick={() => featureUnderdevelopment()}
                    >
                      <i class="fa-solid fa-chevron-left fs-4"></i>
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
                      class="formItem fw-normal"
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
                    <div class="dropdown">
                      <div
                        className="myProfileWidget"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <div class="profileHolder" id="profileOnlineNav">
                          <img
                            src="https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg"
                            alt="profile"
                          />
                        </div>
                        <div class="profileName">
                          {account.username}{" "}
                          <span className="status">Available</span>
                        </div>
                      </div>
                      <ul class="dropdown-menu">
                        <li onClick={logOut}>
                          <div
                            class="dropdown-item"
                            style={{ cursor: "pointer" }}
                          >
                            Logout
                          </div>
                        </li>
                        <li onClick={() => navigate("/my-profile")}>
                          <div
                            class="dropdown-item"
                            style={{ cursor: "pointer" }}
                          >
                            Profile
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="overviewTableWrapper">
              <div className="overviewTableChild">
                <div className="d-flex flex-wrap">
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
                        <h4>
                          Call Center Queue{" "}
                          <button
                            disabled={loading}
                            onClick={() => setRefreshCenter(refreshCenter + 1)}
                            class="clearButton2"
                          >
                            <i
                              class={
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
                  <div className="col-12" style={{ padding: "25px 20px 0px" }}>
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

// const CallCenterListItem = ({
//   item,
//   index,
//   Id,
//   setRefreshCenter,
//   callCenterDetailData,
// }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isOnBreak, setIsOnBreak] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [timer, setTimer] = useState(0); // Store in seconds (Unix format)
//   const [isActive, setIsActive] = useState(false);
//   const [seconds, setSeconds] = useState(0);
//   const [totalTime, setTotalTime] = useState(0);
//   // const [totalTime, settotalTime] = useState(second)
//   const [elapsedTime, setElapsedTime] = useState(0);
//   const [totalBreakTime, setTotalBreakTime] = useState(0);
//   useEffect(() => {
//     const filteredData = callCenterDetailData.filter((data) => {
//       return item.queue_name == data.queue_name;
//     });
//     console.log(filteredData);
//     const totalBreakTimeInMs = filteredData.reduce((total, breakTime) => {
//       if (breakTime.end_time) {
//         const startTime = new Date(breakTime.start_time);
//         const endTime = new Date(breakTime.end_time);
//         return total + (endTime - startTime);
//       }
//       return total;
//     }, 0);
//     setTotalTime(totalBreakTimeInMs / 1000);
//     const ongoingBreak = filteredData.find(
//       (breakTime) => breakTime.end_time === null && breakTime.start_time
//     );

//     if (ongoingBreak) {
//       const latestStartTime = new Date(ongoingBreak.start_time);
//       console.log(ongoingBreak);
//       // Set up an interval to update the current break time in real-time
//       // const interval = setInterval(() => {
//       //   const currentTime = new Date();
//       //   const elapsedTimeInMs = currentTime - latestStartTime; // Time since the break started
//       //   // setCurrentBreakTime(elapsedTimeInMs / 1000); // Convert to seconds
//       //   console.log(elapsedTimeInMs / 1000);
//       // }, 1000);

//       // // Clear the interval when the component unmounts or updates
//       // return () => clearInterval(interval);
//     }
//   }, [callCenterDetailData, item]);

//   // const refId =
//   //   item.agents.filter((item) => Number(item.agent_name) === Id)[0]?.id || "";
//   const { id: refId = "", status = "" } =
//     item.agents.find((agent) => Number(agent.agent_name) === Id) || {};
//   console.log(item, callCenterDetailData);
//   useEffect(() => {
//     if (status === "Logged Out") {
//       setIsLoggedIn(false);
//     } else if (status === "Available") {
//       setIsLoggedIn(true);
//     } else if (status == "On Break") {
//       setIsOnBreak(true);
//       setIsLoggedIn(true);
//     }
//   }, [status]);

//   async function handleLoginLogout(CallerId, action, callCenterName) {
//     const parsedData = {
//       status: action,
//     };

//     const apiData = await generalPutFunction(
//       `call-center-agent/update/${CallerId}`,
//       parsedData
//     );

//     if (apiData.status) {
//       setLoading(false);
//       if (action === "Logged Out") {
//         toast.success(`Logged out for ${callCenterName}`);
//         setIsOnBreak(false);
//         setIsLoggedIn(false);
//       } else if (action === "Available") {
//         setIsLoggedIn(true);
//         setIsOnBreak(false);
//         stopTimer();
//         toast.success(`Available for ${callCenterName}`);
//       } else if (action === "On Break") {
//         setIsOnBreak(true);
//         startTimer();
//         toast.success(`Break Started for ${callCenterName}`);
//       }
//       setRefreshCenter((prev) => prev + 1);
//     } else {
//       setLoading(false);
//       // toast.error(apiData.message);
//     }
//   }

//   useEffect(() => {
//     let interval = null;

//     if (isActive) {
//       interval = setInterval(() => {
//         setSeconds((prevSeconds) => prevSeconds + 1);
//       }, 1000);
//     } else if (!isActive && seconds !== 0) {
//       clearInterval(interval);
//     }

//     return () => clearInterval(interval);
//   }, [isActive, seconds]);

//   useEffect(() => {
//     setTimer(seconds);
//   }, [seconds]);

//   const startTimer = () => {
//     setIsActive(true);
//   };

//   const stopTimer = () => {
//     setIsActive(false);
//     resetTimer();
//     setTotalTime((prevTotal) => prevTotal + seconds);
//   };

//   const resetTimer = () => {
//     setIsActive(false);
//     setSeconds(0);
//     setTimer(0);
//   };

//   const formatTime = (totalSeconds) => {
//     const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
//     const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
//       2,
//       "0"
//     );
//     const secs = String(totalSeconds % 60).padStart(2, "0");
//     return `${hours}:${minutes}:${secs}`;
//   };

//   return (
//     <>
//       {loading ? <CircularLoader /> : ""}
//       <tr>
//         <td className="">
//           <span className="">{index + 1}</span>
//         </td>
//         <td>{item?.queue_name}</td>
//         <td>{item?.extension}</td>
//         <td className="">
//           {isLoggedIn ? (
//             <div className="d-flex gap-2">
//               <label
//                 className={`tableLabel  ${isOnBreak ? "pending" : "success"}`}
//                 onClick={() => {
//                   if (!isOnBreak)
//                     handleLoginLogout(refId, "On Break", item?.queue_name);
//                   else if (isOnBreak)
//                     handleLoginLogout(refId, "Available", item?.queue_name);
//                 }}
//               >
//                 {isOnBreak ? "Resume" : "Break"}
//               </label>
//               <label
//                 className="tableLabel fail"
//                 onClick={() =>
//                   handleLoginLogout(refId, "Logged Out", item?.queue_name)
//                 }
//               >
//                 Logout
//               </label>
//             </div>
//           ) : (
//             <label
//               className="tableLabel success"
//               onClick={() =>
//                 handleLoginLogout(refId, "Available", item?.queue_name)
//               }
//             >
//               Login
//             </label>
//           )}
//         </td>
//         <td>{formatTime(timer)}</td>
//         <td>{formatTime(totalTime)}</td>
//       </tr>
//     </>
//   );
// };

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

  // Extract the agent's reference ID and status
  const { id: refId = "", status = "" } =
    item.agents.find((agent) => Number(agent.agent_name) === Id) || {};

  // Calculate total break time based on callCenterDetailData
  useEffect(() => {
    const filteredData = callCenterDetailData.filter((data) => {
      return item.queue_name === data.queue_name;
    });

    const totalBreakTimeInMs = filteredData.reduce((total, breakTime) => {
      if (breakTime.end_time) {
        const startTime = new Date(breakTime.start_time);
        const endTime = new Date(breakTime.end_time);
        return total + (endTime - startTime);
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
    const startTime = new Date();
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
        toast.success(`Logged out for ${callCenterName}`);
        setIsOnBreak(false);
        setIsLoggedIn(false);
        stopTimer(); // Stop the timer when logging out
      } else if (action === "Available") {
        setIsLoggedIn(true);
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
