/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSIPProvider } from "modify-react-sipjs";
import { featureUnderdevelopment, logout } from "../../GlobalFunction/globalFunction";
import { useNavigate } from "react-router-dom";
import LogOutPopUp from "./LogOutPopUp";
import { CircularProgress } from "@mui/material";
import Tippy from "@tippyjs/react";


/**
 * The SideNavbarApp component renders the side navigation bar for the web application.
 * It displays the user profile, navigation items, and a logout button.
 * The component also handles the logout functionality.
 * @prop {string} activePage - The current page being viewed.
 * @prop {function} setactivePage - The function to set the current page.
 * @prop {boolean} isMicOn - The flag to check if the microphone is on.
 * @prop {boolean} reconnecting - The flag to check if the application is reconnecting.
 */
function SideNavbarApp({ activePage, setactivePage, isMicOn, reconnecting }) {
  const navigate = useNavigate();
  const account = useSelector((state) => state.account);
  const state = useSelector((state) => state)
  const isWhatsAppAvailable = state?.accountDetails?.add_on_subscription?.find((data) => data?.addon?.name?.toLowerCase() == "whatsapp") || null;
  const { sessionManager, connectStatus, registerStatus } = useSIPProvider();
  const extension = account?.extension?.extension || "";
  const accountDetails = useSelector((state) => state.accountDetails);
  const isCustomerAdmin = account?.email == accountDetails?.email;
  const allCallCenterIds = useSelector((state) => state.allCallCenterIds);
  const [allLogOut, setAllLogOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const adminLogout = useSelector((state) => state.adminLogout);


  // Trying to connect with freeswitch at every 3 seconds when disconnect or unregister from feeswitch for any of reason
  useEffect(() => {
    let intervalId = null;
    const shouldRetry =
      registerStatus === "UNREGISTERED" || connectStatus === "DISCONNECTED";
    if (shouldRetry && connectStatus !== "WAIT_REQUEST_CONNECT") {
      intervalId = setInterval(() => {
        console.log("Attempting to connect to FreeSWITCH...");
        sessionManager.connect();
      }, 3000); // retry every 3 seconds
    }

    // Clear interval when conditions are no longer met
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [connectStatus, registerStatus]);

  useEffect(() => {
    if (adminLogout) {
      sessionManager.disconnect();
    }
  }, [adminLogout])

  useEffect(() => {
    const userAgent = sessionManager?.userAgent;

    if (!userAgent || !userAgent.transport) {
      console.warn("UserAgent or transport not ready yet");
      return;
    }

    const handleTransportStateChange = (state) => {
      console.log("🚦 Transport state changed:", state);
    };

    userAgent.transport.stateChange.addListener(handleTransportStateChange);

    return () => {
      userAgent.transport.stateChange.removeListener(handleTransportStateChange);
    };
  }, [sessionManager]);


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


  const [isVisible, setIsVisible] = useState(false);

  const handleToggle = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      {allLogOut && (
        <LogOutPopUp setAllLogOut={setAllLogOut} handleLogOut={handleLogOut} />
      )}
      {loading && <CircularProgress />}
      <section>
        <style>
          {`#sidenNav{
        display:none;
      }`}
        </style>
        <div id="sidenNavApp">
          <div className="sidenavItems">
            <div class=" setting_wrap">
              <div class=" setting_dropdown">
                <button onClick={handleToggle}
                  className=" text-white bg-transparent border-0 e position-relative"
                  type='button'

                >
                  <i className="fa-regular fa-gears" />

                </button>

                {isVisible && (
                  <div className="dropdown_menu" >
                    <div class="p-2 header">
                      <div class="d-flex align-items-center justify-content-between">
                        <p class="mb-1 fs-17 fw-medium">Media Settings</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="mb-2">
                        <label>Speaker:</label>
                        <div class="progress-stacked">
                          <div class="progress" role="progressbar" aria-label="Segment one" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style={{ width: '45%' }}>
                            <div class="progress-bar"></div>
                          </div>
                        </div>
                      </div>
                      <div className="mb-2">
                        <label>Ring Device:</label>
                        <div class="progress-stacked">
                          <div class="progress" role="progressbar" aria-label="Segment one" aria-valuenow="35" aria-valuemin="0" aria-valuemax="100" style={{ width: '35%' }}>
                            <div class="progress-bar"></div>
                          </div>
                        </div>
                      </div>
                      <div className="mb-2">
                        <label>Microphone:</label>
                        <div class="progress-stacked">
                          <div class="progress" role="progressbar" aria-label="Segment one" aria-valuenow="85" aria-valuemin="0" aria-valuemax="100" style={{ width: '85%' }}>
                            <div class="progress-bar"></div>
                          </div>
                        </div>

                        {/* <h2 className="titleName">Basic Checkboxes</h2> */}
                        <div class="basic-container mt-3">
                          <div>
                            <input type="checkbox" id="basic1" checked />
                            <label for="basic1">Auto Gain Control</label>
                          </div>
                          <div>
                            <input type="checkbox" id="basic2" />
                            <label for="basic2">Echo Cancellation</label>
                          </div>
                          <div>
                            <input type="checkbox" id="basic3" />
                            <label for="basic3">Noise Suppression</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <ul>
              <li className="mb-2">
                <div type="button" className="newHeader">
                  <button className="navItem">
                    <div
                      className="profileHolder"
                      id={
                        registerStatus === "REGISTERED"
                          ? "profileOnlineNav"
                          : "profileOfflineNav"
                      }
                    >
                      {account?.profile_picture ?
                        <img src={account?.profile_picture} onError={(e) => e.target.src = require('../../assets/images/placeholder-image.webp')} /> : (
                          <i className="fa-light fa-user"></i>
                        )}
                      {registerStatus === "REGISTERED" ? "" : <><div className="offlineCircle"></div><div className="offlineCircle"></div></>}
                    </div>
                    <div className="userTitle">
                      {account && <Tippy content={account.username}><h5>{account?.username}</h5></Tippy>}
                      <p>Ext- {extension}</p>
                    </div>
                  </button>




                  {/* <ul className="dropdown-menu">
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
                  </ul> */}
                </div>
              </li>{" "}
              <li style={{ cursor: "pointer" }}>
                <div
                  onClick={() => setactivePage("call")}
                  className={activePage === "call" ? "navItem active" : "navItem"}
                >
                  <div className="iconHolder">
                    <i className="fa-light fa-phone" />
                  </div>
                  <div className="itemTitle">Calls</div>
                </div>
              </li>
              <li style={{ cursor: "pointer" }}>
                <div
                  onClick={() => setactivePage("messages")}
                  className={
                    activePage === "messages" ? "navItem active" : "navItem"
                  }
                >
                  <div className="iconHolder">
                    <i className="fa-regular fa-comment"></i>
                  </div>
                  <div className="itemTitle">Messages</div>
                </div>
              </li>
              <li style={{ cursor: "pointer" }}>
                <div
                  onClick={() => setactivePage("all-voice-mails")}
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
              {account?.user_role?.roles?.name !== "Agent" ?
                <li style={{ cursor: "pointer" }}>
                  <div
                    onClick={() => setactivePage("e-fax")}
                    className={
                      activePage === "e-fax" ? "navItem active" : "navItem"
                    }
                  >
                    <div className="iconHolder">
                      <i className="fa-regular fa-paper-plane"></i>
                    </div>
                    <div className="itemTitle">Fax </div>
                  </div>
                </li> : ""}
              {account?.user_role?.roles?.name !== "Agent" ?
                <li style={{ cursor: "pointer" }}>
                  <div
                    onClick={() => setactivePage("email")}
                    className="navItem "
                  >
                    <div className="iconHolder">
                      <i className="fa-regular fa-envelope"></i>
                    </div>
                    <div className="itemTitle">Email</div>
                  </div>
                </li> : ""}
              {account?.user_role?.roles?.name !== "Agent" ?
                <li style={{ cursor: "pointer" }}>
                  <div
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
                </li> : ""}
              {account?.user_role?.roles?.name !== "Agent" ?
                <li style={{ cursor: "pointer" }}>
                  <div
                    // to="/call-dashboard"
                    onClick={() => setactivePage("call-dashboard")}
                    className={
                      activePage === "call-dashboard" ? "navItem active" : "navItem"
                    }
                  >
                    <div className="iconHolder">
                      <i className="fa-solid fa-headset"></i>
                    </div>
                    <div className="itemTitle">Call Dashboard</div>
                  </div>
                </li>
                : ""}
              {account?.user_role?.roles?.name !== "Agent" ?
                <li style={{ cursor: "pointer" }}>
                  <div
                    // to="/call-center"
                    onClick={() => setactivePage("call-center")}
                    className={
                      activePage === "call-center" ? "navItem active" : "navItem"
                    }
                  >
                    <div className="iconHolder">
                      <i className="fa-light fa-circle-user" />
                    </div>
                    <div className="itemTitle">Call Center</div>
                  </div>
                </li> : ""}
              {account?.user_role?.roles?.name !== "Agent" ?
                <li style={{ cursor: "pointer" }}>
                  <div
                    // to="/campaign-login"
                    onClick={() => setactivePage("campaign-login")}
                    className={
                      activePage === "campaign-login" ? "navItem active" : "navItem"
                    }
                  >
                    <div className="iconHolder">
                      <i className="fa-light fa-megaphone" />
                    </div>
                    <div className="itemTitle">Dialer</div>
                  </div>
                </li> : ""}
              {isCustomerAdmin &&
                <li style={{ cursor: "pointer" }}>
                  <div
                    onClick={() => setactivePage("conference")}
                    className={
                      activePage === "conference" ? "navItem active" : "navItem"
                    }
                  >
                    <div className="iconHolder">
                      <i className="fa-solid fa-users-viewfinder"></i>
                    </div>
                    <div className="itemTitle">Conference</div>
                  </div>
                </li>
              }
              {account?.user_role?.roles?.name !== "Agent" || isCustomerAdmin ?
                <li style={{ cursor: "pointer" }}>
                  <div
                    onClick={() => navigate('/dashboard')}
                    className="navItem"
                  >
                    <div className="iconHolder">
                      <i className="fa-light fa-screwdriver-wrench"></i>
                    </div>
                    <div className="itemTitle">Switch Admin</div>
                  </div>
                </li> : ""}
              {account?.user_role?.roles?.name !== "Agent" ?
                isWhatsAppAvailable != null &&
                <li style={{ cursor: "pointer" }}>
                  <div
                    onClick={() => setactivePage("whatsapp-chartbox")}
                    className={
                      activePage === "whatsapp" ? "navItem active" : "navItem"
                    }
                  >
                    <div className="iconHolder">
                      <i class="fa-brands fa-whatsapp"></i>
                    </div>
                    <div className="itemTitle">WhatsApp</div>
                  </div>
                </li> : ""}
              {account?.user_role?.roles?.name !== "Agent" ?
                <li style={{ cursor: "pointer" }}>
                  <div
                    onClick={() => setactivePage("sms-chatbox")}
                    className={
                      activePage === "sms-chatbox" ? "navItem active" : "navItem"
                    }
                  >
                    <div className="iconHolder">
                      <i class="fa-solid fa-comment-sms"></i>
                    </div>
                    <div className="itemTitle">SMS</div>
                  </div>
                </li> : ""}
              {account?.user_role?.roles?.name !== "Agent" ?
                <li style={{ cursor: "pointer" }}>
                  <div
                    onClick={() => setactivePage("nav-settings")}
                    className={
                      activePage === "nav-settings" ? "navItem active" : "navItem"
                    }
                  >
                    <div className="iconHolder">
                      <i class="fa-solid fa-gear"></i>
                    </div>
                    <div className="itemTitle">Settings</div>
                  </div>
                </li> : ""}
            </ul>
          </div>
        </div>
      </section >
    </>
  );
}

export default SideNavbarApp;
