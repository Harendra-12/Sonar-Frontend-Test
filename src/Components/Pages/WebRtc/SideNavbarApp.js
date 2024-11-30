import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSIPProvider } from "react-sipjs";
import DarkModeToggle from '../../CommonComponents/DarkModeToggle';

function SideNavbarApp({ activePage, setactivePage, isMicOn, reconnecting }) {
  const account = useSelector((state) => state.account);
  const [popUp, setPopUp] = useState(false);
  const { connectStatus } = useSIPProvider();
  const [loading, setLoading] = useState(true); // Loading state for popup
  // const callState = useSelector((state) => state.callState);
  // console.log("callStatesss", callState);
  const navigate = useNavigate();

  const extension = account?.extension?.extension || "";
  const [connectedStatus, setConnectedStatus] = useState("");

  useEffect(() => {
    setConnectedStatus(connectStatus);
    if (connectStatus !== "CONNECTED") {
      setPopUp(true);
      setLoading(true); // Show loading initially
      setTimeout(() => setLoading(false), 1000); // Hide loading after 1 second
    } else if (connectStatus === "CONNECTED" && !isMicOn) {
      setPopUp(true);
      setLoading(true); // Show loading initially
      setTimeout(() => setLoading(false), 1000); // Hide loading after 1 second
    } else if (connectStatus === "CONNECTED" && isMicOn) {
      setPopUp(false);
    }
  }, [connectStatus, isMicOn]);
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("Checking connectedStatus:", connectedStatus);
      // Add any logic you want to perform on each check
    }, 30000);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [connectedStatus]);

  console.log("connectedStatus", connectedStatus);

  return (
    <section>
      <style>
        {`#sidenNav{
        display:none;
      } .circularLoader{
        display:none;
      }`}
      </style>
      <div id="sidenNavApp">
        <div className="sidenavItems">
          <ul>
            <li className="mb-2">
              <button className="navItem">
                <div
                  className="profileHolder"
                  id={
                    connectStatus === "CONNECTED"
                      ? "profileOnlineNav"
                      : "profileOfflineNav"
                  }
                >
                  <i class="fa-light fa-user"></i>
                </div>
                <div className="userTitle">
                  <h5>{account.username}</h5>
                  <p>Ext- {extension}</p>
                </div>
              </button>
            </li>{" "}
            {/* <div className="text-center">
              <span
                style={{
                  color: connectStatus === "CONNECTED" ? "#00ff00" : "red",
                  fontSize: "12px",
                }}
              >
                {connectStatus}
              </span>
            </div> */}
            <li >
              <div
                // to="/call"
                onClick={() => setactivePage("call")}
                className={activePage === "call" ? "navItem active" : "navItem"}
              >
                <div className="iconHolder">
                  <i className="fa-light fa-phone" />
                </div>
                <div className="itemTitle">Calls</div>
              </div>
            </li>
            <li >
              <div
                // to="/message"
                onClick={() => setactivePage("messages")}
                className={
                  activePage === "messages" ? "navItem active" : "navItem"
                }
              >
                <div className="iconHolder">
                  <i className="fa-light fa-message" />
                </div>
                <div className="itemTitle">Messages</div>
              </div>
            </li>
            <li >
              <div
                // to="/message"
                onClick={() => setactivePage("email")}
                className={
                  activePage === "email" ? "navItem active" : "navItem"
                }
              >
                <div className="iconHolder">
                  <i className="fa-light fa-at" />
                </div>
                <div className="itemTitle">Email</div>
              </div>
            </li>
            <li >
              <div
                // to="/efax"
                onClick={() => setactivePage("e-fax")}
                className={
                  activePage === "e-fax" ? "navItem active" : "navItem"
                }
              >
                <div className="iconHolder">
                  <i className="fa-light fa-fax" />
                </div>
                <div className="itemTitle">eFax</div>
              </div>
            </li>
            <li >
              <div
                onClick={() => setactivePage("all-voice-mails")}
                // to="/all-voicemails"
                className={
                  activePage === "all-voice-mails"
                    ? "navItem active"
                    : "navItem"
                }
              >
                <div className="iconHolder">
                  <i className="fa-light fa-voicemail" />
                </div>
                <div className="itemTitle">Voicemails</div>
              </div>
            </li>
            <li >
              <div
                //  to="/"
                onClick={() => setactivePage("favorites")}
                className={
                  activePage === "favorites" ? "navItem active" : "navItem"
                }
              >
                <div className="iconHolder">
                  <i className="fa-light fa-star" />
                </div>
                <div className="itemTitle">Favorites</div>
              </div>
            </li>
            <li >
              <div
                // to="/all-contacts"
                onClick={() => setactivePage("all-contacts")}
                className={
                  activePage === "all-contacts" ? "navItem active" : "navItem"
                }
              >
                <div className="iconHolder">
                  <i className="fa-light fa-address-book" />
                </div>
                <div className="itemTitle">Contacts</div>
              </div>
            </li>
            {/* <li >
              <NavLink to="/" className='navItem'>
                <div className="iconHolder">
                  <i className="fa-light fa-circle-question" />
                </div>
                <div className="itemTitle">Help &amp; Feedback</div>
              </NavLink>
            </li> */}
            <li >
              <div
                // to="/"
                onClick={() => setactivePage("settings")}
                className={
                  activePage === "settings" ? "navItem active" : "navItem"
                }
              >
                <div className="iconHolder">
                  <i className="fa-light fa-sliders" />
                </div>
                <div className="itemTitle">Settings</div>
              </div>
            </li>
            <li >
              <div
                // to="/call-dashboard"
                onClick={() => setactivePage("call-dashboard")}
                className={
                  activePage === "call-dashboard" ? "navItem active" : "navItem"
                }
              >
                <div className="iconHolder">
                  <i className="fa-light fa-sliders" />
                </div>
                <div className="itemTitle">Call Dashboard</div>
              </div>
            </li>
            <li >
              <div
                // to="/call-center"
                onClick={() => setactivePage("call-center")}
                className={
                  activePage === "call-center" ? "navItem active" : "navItem"
                }
              >
                <div className="iconHolder">
                  <i className="fa-light fa-sliders" />
                </div>
                <div className="itemTitle">Call Center</div>
              </div>
            </li>
            <li >
              <div
                //  to="/"
                onClick={() => navigate("/dashboard")}
                className={
                  activePage === "admin" ? "navItem active" : "navItem"
                }
              >
                <div className="iconHolder">
                  <i className="fa-brands fa-black-tie" />
                </div>
                <div className="itemTitle">Admin</div>
              </div>
            </li>
            <li >
              <div
                // to="/"
                onClick={() => setactivePage("reports")}
                className={
                  activePage === "reports" ? "navItem active" : "navItem"
                }
              >
                <div className="iconHolder">
                  <i className="fa-light fa-chart-column" />
                </div>
                <div className="itemTitle">Reports</div>
              </div>
            </li>
            <li >
              <div
                // to="/"
                onClick={() => setactivePage("conference")}
                className={
                  activePage === "conference" ? "navItem active" : "navItem"
                }
              >
                <div className="iconHolder">
                  <i className="fa-sharp fa-light fa-people-group" />
                </div>
                <div className="itemTitle">Conference</div>
              </div>
            </li>
            <li >
              <div
                // to="/"
                onClick={() => setactivePage("test")}
                className={
                  activePage === "reports" ? "navItem active" : "navItem"
                }
              >
                <div className="iconHolder">
                  <i className="fa-light fa-chart-column" />
                </div>
                <div className="itemTitle">Conference Test</div>
              </div>
            </li>
            <li className="dashboard ">
              <a className="navItem">
                <DarkModeToggle marginLeft={"2"} />
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* {popUp ? (
        <div className="popup">
          <div className="container h-100">
            <div className="row h-100 justify-content-center align-items-center">
              <div className="row content col-xl-3">
                <div className="col-2 px-0">
                  <div className="iconWrapper">
                    <i className="fa-duotone fa-circle-exclamation"></i>
                  </div>
                </div>
                <div className="col-10 ps-2">
                  <h4>Network Issue!</h4>
                  <p className="mb-1">Failed to connect to the server!</p>
                  <p style={{ fontSize: 12 }}>Error: <span className="fw-light text-danger">{connectStatus}</span></p>
                  <button
                    className="panelButton m-0"
                    onClick={() => {
                      setPopUp(false);
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )} */}
      {popUp ? (
        <div className="popup">
          <div className="container h-100">
            <div className="row h-100 justify-content-center align-items-center">
              <div className="row content col-xl-3">
                <div className="col-2 px-0">
                  <div className="iconWrapper">
                    <i className="fa-duotone fa-circle-exclamation"></i>
                  </div>
                </div>
                <div className="col-10 ps-2">
                  {extension !== "" ? (
                    loading ? (
                      <h4>Connecting...</h4> // Show loading indicator
                    ) : (
                      <>
                        <h4>
                          {connectedStatus !== "CONNECTED"
                            ? "Network Issue!"
                            : isMicOn !== true && "Audio Issue!"}
                        </h4>
                        {connectedStatus !== "CONNECTED" ? (
                          <>
                            <p className="mb-1">
                              Failed to connect to the server!
                            </p>
                            <p style={{ fontSize: 12 }}>
                              Error:{" "}
                              <span className="fw-light text-danger">
                                {reconnecting === 0
                                  ? "Not connected with server"
                                  : "Reconnecting..."}
                              </span>
                            </p>
                          </>
                        ) : isMicOn !== true ? (
                          <>
                            <p className="mb-1">Failed to open microphone!</p>
                            <p style={{ fontSize: 12 }}>
                              Error:{" "}
                              <span className="fw-light text-danger">
                                WebRTC features disabled! <br />
                                You can access only messaging.
                              </span>
                              <br />
                              <br />
                              <span>{`Open settings > Microphone > Allow`}</span>
                            </p>
                          </>
                        ) : (
                          ""
                        )}
                      </>
                    )
                  ) : (
                    <p>No extension assigned</p>
                  )}

                  <button
                    className="panelButton mx-1"
                    onClick={() => {
                      setPopUp(false);
                    }}
                  >
                    <span className="text">Close</span>
                    <span className="icon">
                      <i class="fa-light fa-xmark"></i>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </section>
  );
}

export default SideNavbarApp;
