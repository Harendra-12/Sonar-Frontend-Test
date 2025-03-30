/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useSIPProvider } from "modify-react-sipjs";
import { featureUnderdevelopment } from "../../GlobalFunction/globalFunction";
import { useNavigate } from "react-router-dom";

function SideNavbarApp({ activePage, setactivePage, isMicOn, reconnecting }) {
  const navigate = useNavigate();
  const account = useSelector((state) => state.account);
  const { sessionManager, connectStatus, registerStatus } = useSIPProvider();
  const extension = account?.extension?.extension || "";
  const accountDetails = useSelector((state) => state.accountDetails);
  const isCustomerAdmin = account?.email == accountDetails?.email;
  useEffect(() => {
    if (connectStatus === "CONNECTED") {
      if (registerStatus === "UNREGISTERED") {
        sessionManager.connect()
      }
    }
  }, [connectStatus, registerStatus])
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
                  <i className="fa-light fa-user"></i>
                  {connectStatus === "CONNECTED" ? "" : <><div className="offlineCircle"></div><div className="offlineCircle"></div></>}
                </div>
                <div className="userTitle">
                  <h5>{account?.username}</h5>
                  <p>Ext- {extension}</p>
                </div>
              </button>
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
            </li>
            <li style={{ cursor: "pointer" }}>
              <div
                onClick={featureUnderdevelopment}
                className="navItem "
              >
                <div className="iconHolder">
                  <i className="fa-regular fa-envelope"></i>
                </div>
                <div className="itemTitle">Email</div>
              </div>
            </li>
            <li>
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
            </li>
            {account?.user_role?.roles?.name !== "Agent" ?
              <li>
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
            </li>
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
          </ul>
        </div>
      </div>
    </section>
  );
}

export default SideNavbarApp;
