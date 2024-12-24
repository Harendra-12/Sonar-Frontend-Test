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

  const Id = account?.id || "";

  useEffect(() => {
    setLoading(true);
    dispatch({
      type: "SET_CALLCENTERREFRESH",
      callCenterRefresh: callCenterRefresh + 1,
    });
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

  useEffect(() => { }, [refreshCenter, callCenterRefresh]);

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

const CallCenterListItem = ({ item, index, Id }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0); // Store in seconds (Unix format)
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  // const refId =
  //   item.agents.filter((item) => Number(item.agent_name) === Id)[0]?.id || "";
  const { id: refId = "", status = "" } =
    item.agents.find((agent) => Number(agent.agent_name) === Id) || {};

  useEffect(() => {
    if (status === "Logged Out") {
      setIsLoggedIn(false);
    } else if (status === "Available") {
      setIsLoggedIn(true);
    }
  }, [status]);

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
      } else if (action === "Available") {
        setIsLoggedIn(true);
        setIsOnBreak(false);
        stopTimer();
        toast.success(`Available for ${callCenterName}`);
      } else if (action === "On Break") {
        setIsOnBreak(true);
        startTimer();
        toast.success(`Break Started for ${callCenterName}`);
      }
    } else {
      setLoading(false);
      // toast.error(apiData.message);
    }
  }

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

  const startTimer = () => {
    setIsActive(true);
  };

  const stopTimer = () => {
    setIsActive(false);
    resetTimer();
    setTotalTime((prevTotal) => prevTotal + seconds);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(0);
    setTimer(0);
  };

  const formatTime = (totalSeconds) => {
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0"
    );
    const secs = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${secs}`;
  };

  return (
    <>
      {loading ? <CircularLoader /> : ""}
      <tr>
        <td className="">
          <span className="">{index + 1}</span>
        </td>
        <td>{item?.queue_name}</td>
        <td>{item?.extension}</td>
        <td className="">
          {isLoggedIn ? (
            <div className="d-flex gap-2">
              <label
                className={`tableLabel  ${isOnBreak ? "pending" : "success"}`}
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
