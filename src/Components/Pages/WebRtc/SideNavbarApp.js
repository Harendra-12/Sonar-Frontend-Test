/* eslint-disable eqeqeq */
import React from "react";
import { useSelector } from "react-redux";
import { useSIPProvider } from "modify-react-sipjs";

function SideNavbarApp({ activePage, setactivePage, isMicOn, reconnecting }) {
  const account = useSelector((state) => state.account);
  const { connectStatus } = useSIPProvider();
  const extension = account?.extension?.extension || "";
  const accountDetails = useSelector((state) => state.accountDetails);
  const isCustomerAdmin = account?.email == accountDetails?.email;
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
                  <i class="fa-light fa-user"></i>
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
                  <i className="fa-light fa-message" />
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
                    <i className="fa-light fa-sliders" />
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
                    <i className="fa-sharp fa-light fa-people-group" />
                  </div>
                  <div className="itemTitle">Conference</div>
                </div>
              </li>
            }
          </ul>
        </div>
      </div>
    </section>
  );
}

export default SideNavbarApp;
