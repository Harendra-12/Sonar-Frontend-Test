import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSIPProvider } from "react-sipjs";

function SideNavbarApp({ setactivePage, isMicOn, reconnecting }) {
  const account = useSelector((state) => state.account);
  const [popUp, setPopUp] = useState(false);
  const { connectStatus } = useSIPProvider();
  const [loading, setLoading] = useState(true); // Loading state for popup

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

  console.log("connectedStatus", connectedStatus);

  return (
    <section>
      <style>
        {`#sidenNav{
        display:none;
      }`}
      </style>
      <div id="sidenNavApp">
        <div className="sidenavItems">
          <ul>
            <li>
              <button className="navItem">
                <div
                  className="profileHolder"
                  id={
                    connectStatus === "CONNECTED"
                      ? "profileOnlineNav"
                      : "profileOfflineNav"
                  }
                >
                  {extension}
                </div>
                <div className="userTitle">
                  {extension}-{account.username}
                </div>
              </button>
            </li>{" "}
            <div className="text-center">
              {/* <span
                style={{
                  color: connectStatus === "CONNECTED" ? "#00ff00" : "red",
                  fontSize: "12px",
                }}
              >
                {connectStatus}
              </span> */}
            </div>
            <li effect="ripple">
              <div
                // to="/message"
                onClick={() => setactivePage("messages")}
                className="navItem"
              >
                <div className="iconHolder">
                  <i className="fa-solid fa-message" />
                </div>
                <div className="itemTitle">Messages</div>
              </div>
            </li>
            <li effect="ripple">
              <div
                // to="/call"
                onClick={() => setactivePage("call")}
                className="navItem"
              >
                <div className="iconHolder">
                  <i className="fa-solid fa-phone" />
                </div>
                <div className="itemTitle">Calls</div>
              </div>
            </li>
            <li effect="ripple">
              <div
                // to="/efax"
                onClick={() => setactivePage("e-fax")}
                className="navItem"
              >
                <div className="iconHolder">
                  <i className="fa-solid fa-fax" />
                </div>
                <div className="itemTitle">eFax</div>
              </div>
            </li>
            <li effect="ripple">
              <div
                onClick={() => setactivePage("all-voice-mails")}
                // to="/all-voicemails"
                className="navItem"
              >
                <div className="iconHolder">
                  <i className="fa-solid fa-voicemail" />
                </div>
                <div className="itemTitle">Voicemails</div>
              </div>
            </li>
            <li effect="ripple">
              <div
                //  to="/"
                onClick={() => setactivePage("favorites")}
                className="navItem"
              >
                <div className="iconHolder">
                  <i className="fa-solid fa-star" />
                </div>
                <div className="itemTitle">Favorites</div>
              </div>
            </li>
            <li effect="ripple">
              <div
                // to="/all-contacts"
                onClick={() => setactivePage("all-contacts")}
                className="navItem"
              >
                <div className="iconHolder">
                  <i className="fa-solid fa-address-book" />
                </div>
                <div className="itemTitle">Contacts</div>
              </div>
            </li>
            {/* <li effect="ripple">
              <NavLink to="/" className='navItem'>
                <div className="iconHolder">
                  <i className="fa-regular fa-circle-question" />
                </div>
                <div className="itemTitle">Help &amp; Feedback</div>
              </NavLink>
            </li> */}
            <li effect="ripple">
              <div
                // to="/"
                onClick={() => setactivePage("settings")}
                className="navItem"
              >
                <div className="iconHolder">
                  <i className="fa-solid fa-sliders" />
                </div>
                <div className="itemTitle">Settings</div>
              </div>
            </li>
            <li effect="ripple">
              <div
                // to="/call-dashboard"
                onClick={() => setactivePage("call-dashboard")}
                className="navItem"
              >
                <div className="iconHolder">
                  <i className="fa-solid fa-sliders" />
                </div>
                <div className="itemTitle">Call Dashboard</div>
              </div>
            </li>
            <li effect="ripple">
              <div
                // to="/call-center"
                onClick={() => setactivePage("call-center")}
                className="navItem"
              >
                <div className="iconHolder">
                  <i className="fa-solid fa-sliders" />
                </div>
                <div className="itemTitle">Call Center</div>
              </div>
            </li>
            <li effect="ripple">
              <div
                //  to="/"
                onClick={() => setactivePage("admin")}
                className="navItem"
              >
                <div className="iconHolder">
                  <i className="fa-brands fa-black-tie" />
                </div>
                <div className="itemTitle">Admin</div>
              </div>
            </li>
            <li effect="ripple">
              <div
                // to="/"
                onClick={() => setactivePage("reports")}
                className="navItem"
              >
                <div className="iconHolder">
                  <i className="fa-solid fa-chart-column" />
                </div>
                <div className="itemTitle">Reports</div>
              </div>
            </li>
            <li effect="ripple">
              <div
                // to="/"
                onClick={() => setactivePage("conference")}
                className="navItem"
              >
                <div className="iconHolder">
                  <i className="fa-sharp fa-solid fa-people-group" />
                </div>
                <div className="itemTitle">Conference</div>
              </div>
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
                  {loading ? (
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
                  )}

                  <button
                    className="panelButton mx-1"
                    onClick={() => {
                      setPopUp(false);
                    }}
                  >
                    <span className="text">Close</span>
                    <span className="icon"><i class="fa-solid fa-xmark"></i></span>
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
