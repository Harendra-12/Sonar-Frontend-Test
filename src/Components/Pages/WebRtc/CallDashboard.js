import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { featureUnderdevelopment, generalGetFunction, generalPostFunction, logout } from "../../GlobalFunction/globalFunction";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import DarkModeToggle from "../../CommonComponents/DarkModeToggle";
import LogOutPopUp from "./LogOutPopUp";
import ActiveCallsPage from "../PhoneDashboard/ActiveCallsPage";
import { useSIPProvider } from "modify-react-sipjs";
import AllActiveAgentStatus from "../PhoneDashboard/AllActiveAgentStatus";
import HeaderApp from "./HeaderApp";

/**
 * The CallDashboard component manages and displays the call dashboard interface.
 * It integrates with the Redux store to fetch session, account, and call data,
 * and provides functionalities for handling parked calls and agent activity status.
 * The component includes UI elements for searching, logging out, and toggling dark mode.
 * It also manages the state of online and offline users, and handles call parking and unparking.
 *
 * @returns {JSX.Element} The rendered call dashboard component.
 */

function CallDashboard() {
  const sessions = useSelector((state) => state.sessions);
  const account = useSelector((state) => state.account);
  const activeCall = useSelector((state) => state.activeCall);
  const [allParkedCall, setAllParkedCall] = useState([]);
  const extension = account?.extension?.extension || null;
  const navigate = useNavigate();
  const allCallCenterIds = useSelector((state) => state.allCallCenterIds);
  const [allLogOut, setAllLogOut] = useState(false);
  const [isParkedCallsOpen, setIsParkedCallsOpen] = useState(false);
  const dispatch = useDispatch()
  const { sessionManager } = useSIPProvider();

  // Need These for Agent Activity Status
  // const allUserRefresh = useSelector((state) => state.allUserRefresh);
  // const allUser = useSelector((state) => state.allUser);

  const [allUser, setAllUser] = useState();
  const logonUser = useSelector((state) => state.loginUser);
  const [onlineUser, setOnlineUSer] = useState([0]);
  const [loading, setLoading] = useState(false);

  // Search All Users
  async function getData() {
    const userApi = await generalGetFunction(`/user/search?account=${account.account_id}`);
    if (userApi?.status) {
      setAllUser(userApi.data);
    }
  }

  useEffect(() => {
    if (!allUser || allUser.length === 0) {
      getData();
    }
    if (logonUser && logonUser.length > 0) {
      setOnlineUSer(
        logonUser.map((item) => {
          return item.id;
        })
      );
    }
  }, [logonUser])

  // Function to handle logout
  const handleLogOut = async () => {
    // setLoading(true);
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
      // setLoading(false);
    }
  };
  useEffect(() => {
    //dest should start with "set:valet_ticket"
    setAllParkedCall(
      activeCall.filter(
        (call) =>
          (call.dest.includes("set:valet_ticket") || call.dest.includes("*")) && (call.b_callee_direction !== "ACTIVE" || call.b_callee_direction !== "HELD")
      )
    );
  }, [activeCall]);

  function extractLastNumber(inputString) {
    const regex = /(\d+)\s*$/; // Regular expression to match the last number after a space

    const match = inputString.match(regex);

    if (match) {
      return match[1]; // Return the matched number
    } else {
      return null;
    }
  }

  const handleUnPark = async (parkedNumber) => {
    if (!parkedNumber) {
      return;
    }
    const payload = {
      unpark_slot: parkedNumber,
      user: extension,
    };

    //call a post api
    const unparkResponse = await generalPostFunction(
      "/freeswitch/call-unpark",
      payload
    );

    if (unparkResponse) {
      toast.success(unparkResponse.message);
    }
  };

  return (
    <>
      {/* <SideNavbarApp /> */}
      {allLogOut && (
        <LogOutPopUp setAllLogOut={setAllLogOut} handleLogOut={handleLogOut} />
      )}
      <main
        className="mainContentApp"
        style={{
          marginRight:
            sessions.length > 0 && Object.keys(sessions).length > 0
              ? "250px"
              : "0",
        }}
      >
        <section>
          <div className="container-fluid callDashboard">
            <div
              className="row justify-content-between"
              style={{ height: "100%" }}
            >
              <div className="col-12 ps-xl-0">
                <HeaderApp title={"Call Dashboard"} loading={loading} setLoading={setLoading} refreshApi={() => featureUnderdevelopment()} />
              </div>
              {/* <div className="col-xl-8 px-0"
                style={{ borderRight: "1px solid var(--border-color)" }}
              >

                <div className="overviewTableWrapper">
                  <div className="overviewTableChild">
                    <div className="d-flex flex-wrap">
                      <div className="col-12">
                        <div className="heading">
                          <div className="content">
                            <h4> Active Calls</h4>
                            <p>You can see all of the active calls here</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-12" style={{ padding: '25px 20px 0px' }}>
                        <div className="tableContainer mt-0">
                          <ActiveCalls filter="all" isWebrtc={true} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
              {/* <div className="col-xl-4 px-0"
                style={{ borderRight: "1px solid var(--border-color)" }}
              >
                <div className="overviewTableWrapper pt-2">
                  <div className="overviewTableChild">
                    <div className="d-flex flex-wrap">
                      <div className="col-12">
                        <div className="heading">
                          <div className="content">
                            <h4> Ringinig State</h4>
                            <p>You can see all of the calls in ringing state here</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-12" style={{ padding: '25px 20px 0px' }}>
                        <div className="tableContainer mt-0" style={{ height: "auto", maxHeight: '45vh' }}>
                          <table>
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Did Tag</th>
                                <th>From </th>
                                <th>To</th>
                                <th>Feature Tag</th>
                                <th>Started since</th>

                              </tr>
                            </thead>

                            <tbody>
                              {
                                activeCall && activeCall.filter((item) => item.b_callstate === "").map((item, key) => {
                                  return (
                                    <tr>
                                      <td>{key + 1}</td>
                                      <td>{item.did_tag}</td>
                                      <td>{item.cid_name}</td>
                                      <td>{item.dest}</td>
                                      <td>{item.feature_tag}</td>
                                      <td>{item.duration}</td>
                                    </tr>
                                  )
                                })
                              }

                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
              <ActiveCallsPage isParentWebRtc={true} />

              {/* Ex Parked Calls (Now merged into ActiveCallsPage) */}
              {/* <div className="callDashParkedCalls" style={{ transform: isParkedCallsOpen ? 'translate(0, -50%)' : 'translate(97%, -50%)' }}>
                <button onClick={() => setIsParkedCallsOpen(!isParkedCallsOpen)} className="callDashParkedCallsBtn">
                  <i className={`fa-solid fa-chevron-${isParkedCallsOpen ? "right" : "left"}`} />
                </button>
                <div className="overviewTableWrapper p-0">
                  <div className="overviewTableChild">
                    <div className="d-flex flex-wrap">
                      <div className="col-12">
                        <div className="heading">
                          <div className="content">
                            <h4> Additional Info</h4>
                            <p>You can see all of the parked calls & agent activity status here</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-12" style={{ padding: '0px 10px' }}>
                        <nav className="tangoNavs mb-2">
                          <div className="nav nav-tabs" id="nav-tab" role="tablist">
                            <button className="nav-link active" id="nav-agent-tab" data-bs-toggle="tab" data-bs-target="#nav-agent" type="button" role="tab">
                              Agent
                            </button>
                            <button className="nav-link" id="nav-parked-tab" data-bs-toggle="tab" data-bs-target="#nav-parked" type="button" role="tab">
                              Parked
                            </button>
                          </div>
                        </nav>
                        <div className="tab-content" id="nav-tabContent">
                          <div className="tab-pane fade show active" id="nav-agent" role="tabpanel" tabindex="0">
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
                                          <th>Origin</th>
                                          <th>Dest</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {allUser?.length > 0 &&
                                          allUser?.filter((agent) => agent?.extension_id !== null)
                                            .filter((agent) => onlineUser.includes(agent?.id))
                                            .map((agent, index) => {
                                              const activeCallsForAgent = activeCall.filter((call) => call?.dest === agent?.extension?.extension || call?.b_presence_id?.split("@")[0] === agent?.extension?.extension || call?.cid_name === agent?.extension?.extension);
                                              const getCallStatus = () => {
                                                if (activeCallsForAgent.length === 0) return null;

                                                const activeCall = activeCallsForAgent.filter((call) => call?.b_callstate === "ACTIVE" || call?.b_callstate === "HELD" || call?.callstate !== "ACTIVE");

                                                if (!activeCall) return null;

                                                if (activeCall[0]?.b_callstate === "ACTIVE" || activeCall[0]?.b_callstate === "HELD" || activeCall[0]?.callstate === "HELD") {
                                                  return {
                                                    status: activeCall[0]?.callstate === "HELD" || activeCall[0]?.b_callstate === "HELD" ? "On Hold" : "In Call",
                                                    direction: activeCall[0]?.direction,
                                                    duration: activeCall[0]?.duration,
                                                    from: activeCall[0]?.cid_name ?
                                                      activeCall[0]?.cid_name :
                                                      activeCall[0]?.b_cid_num,
                                                    to: activeCall[0]?.dest
                                                  };
                                                }
                                                return null;
                                              };

                                              const callStatus = getCallStatus();

                                              return (
                                                <tr>
                                                  <td>
                                                    <div className="d-flex align-items-center">
                                                      <span className={`extensionStatus ${callStatus?.status === 'In Call' || callStatus?.status === 'On Hold' ? 'onCall' : onlineUser.includes(agent?.id) ? 'online' : 'offline'}`}></span>
                                                      <span className="ms-1">{callStatus?.status === 'In Call' ? 'On Call' : callStatus?.status === 'On Hold' ? 'On Hold' : onlineUser.includes(agent?.extension?.extension) ? 'Online' : 'Offline'}</span>
                                                    </div>
                                                  </td>
                                                  <td>
                                                    <div className="d-flex align-items-center">
                                                      <div className="tableProfilePicHolder">
                                                        {agent?.profile_picture ? (
                                                          <img
                                                            src={agent?.profile_picture}
                                                            onError={(e) => e.target.src = require('../../assets/images/placeholder-image.webp')}
                                                          />
                                                        ) : (
                                                          <i className="fa-light fa-user" />
                                                        )}
                                                      </div>
                                                      <div className="ms-2">{agent?.name}</div>
                                                    </div>
                                                  </td>
                                                  <td style={{ textTransform: 'capitalize' }}>
                                                    {callStatus && (
                                                      <>
                                                        <i class={`fa-solid fa-${callStatus?.direction === 'internal' ? 'headset' : callStatus?.direction === 'inbound' ? 'phone-arrow-down-left' : callStatus?.direction === 'outbound' ? 'phone-arrow-up-right' : 'phone'} me-1`}
                                                          style={{ color: callStatus?.direction === 'internal' ? 'var(--color2)' : callStatus?.direction === 'inbound' ? 'var(--funky-boy3)' : callStatus?.direction === 'outbound' ? 'var(--color3)' : 'var(--color2)' }}></i>
                                                        {callStatus?.direction}
                                                      </>
                                                    )}
                                                  </td>
                                                  <td>{callStatus?.from}</td>
                                                  <td>{callStatus?.to}</td>
                                                </tr>
                                              )
                                            })}
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
                                        {allUser?.length > 0 &&
                                          allUser?.filter((agent) => agent?.extension_id !== null && !onlineUser.includes(agent?.id))
                                            // .filter((agent) => )
                                            .map((agent, index) => {
                                              return (
                                                <tr>
                                                  <td>
                                                    <div className="d-flex align-items-center">
                                                      <span className={"extensionStatus offline"}></span>
                                                      <span className="ms-1">Offline</span>
                                                    </div>
                                                  </td>
                                                  <td>
                                                    <div className="d-flex align-items-center">
                                                      <div className="tableProfilePicHolder">
                                                        {agent?.profile_picture ? (
                                                          <img
                                                            src={agent?.profile_picture}
                                                            onError={(e) => e.target.src = require('../../assets/images/placeholder-image.webp')}
                                                          />
                                                        ) : (
                                                          <i className="fa-light fa-user" />
                                                        )}
                                                      </div>
                                                      <div className="ms-2">{agent?.name}</div>
                                                    </div>
                                                  </td>
                                                  <td>{agent?.extension?.extension}</td>
                                                </tr>
                                              )
                                            })}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="tab-pane fade " id="nav-parked" role="tabpanel" tabindex="0">
                            <div className="col-12">
                              <div className="tableContainer mt-0">
                                <table>
                                  <thead>
                                    <tr>
                                      <th>Called ID</th>
                                      <th>Parked By</th>
                                      <th>Parked At</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {allParkedCall.length > 0 &&
                                      allParkedCall.map((call) => {
                                        return (
                                          <tr>
                                            <td>{call.cid_num}</td>

                                            <td>{extractLastNumber(call?.parked_by)}</td>
                                            <td>
                                              {call?.dest.includes("set:valet_ticket")
                                                ? extractLastNumber(call?.accountcode)
                                                : extractLastNumber(call?.dest)}
                                            </td>
                                            <td>
                                              <button
                                                onClick={() =>
                                                  handleUnPark(
                                                    call?.dest.includes(
                                                      "set:valet_ticket"
                                                    )
                                                      ? extractLastNumber(
                                                        call?.accountcode
                                                      )
                                                      : extractLastNumber(call?.dest)
                                                  )
                                                }
                                              >
                                                Unpark
                                              </button>
                                            </td>
                                          </tr>
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
                </div>
              </div> */}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default CallDashboard;
