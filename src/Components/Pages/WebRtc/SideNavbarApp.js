import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSIPProvider } from "react-sipjs";

function SideNavbarApp({ setactivePage }) {
  const { connectStatus } = useSIPProvider();
  console.log(connectStatus);
  const navigate = useNavigate();
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
                <div className="profileHolder" id="profileOnlineNav">
                  NH
                </div>
                <div className="userTitle">Username</div>
              </button>
            </li>{" "}
            <div className="text-center">
              <span
                style={{
                  color: connectStatus === "CONNECTED" ? "#00ff00" : "red",
                  fontSize: "12px",
                }}
              >
                {connectStatus}
              </span>
            </div>
            <li effect="ripple">
              <a
                // to="/"
                onClick={() => setactivePage("messages")}
                className="navItem"
              >
                <div className="iconHolder">
                  <i className="fa-solid fa-message" />
                </div>
                <div className="itemTitle">Messages</div>
              </a>
            </li>
            <li effect="ripple">
              <a
                // to="/call"
                onClick={() => setactivePage("call")}
                className="navItem"
              >
                <div className="iconHolder">
                  <i className="fa-solid fa-phone" />
                </div>
                <div className="itemTitle">Calls</div>
              </a>
            </li>
            <li effect="ripple">
              <a
                // to="/efax"
                onClick={() => setactivePage("e-fax")}
                className="navItem"
              >
                <div className="iconHolder">
                  <i className="fa-solid fa-fax" />
                </div>
                <div className="itemTitle">eFax</div>
              </a>
            </li>
            <li effect="ripple">
              <a
                onClick={() => setactivePage("all-voice-mails")}
                // to="/all-voicemails"
                className="navItem"
              >
                <div className="iconHolder">
                  <i className="fa-solid fa-voicemail" />
                </div>
                <div className="itemTitle">Voicemails</div>
              </a>
            </li>
            <li effect="ripple">
              <a
                //  to="/"
                onClick={() => setactivePage("favorites")}
                className="navItem"
              >
                <div className="iconHolder">
                  <i className="fa-solid fa-star" />
                </div>
                <div className="itemTitle">Favorites</div>
              </a>
            </li>
            <li effect="ripple">
              <a
                // to="/all-contacts"
                onClick={() => setactivePage("all-contacts")}
                className="navItem"
              >
                <div className="iconHolder">
                  <i className="fa-solid fa-address-book" />
                </div>
                <div className="itemTitle">Contacts</div>
              </a>
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
              <a
                // to="/"
                onClick={() => setactivePage("settings")}
                className="navItem"
              >
                <div className="iconHolder">
                  <i className="fa-solid fa-sliders" />
                </div>
                <div className="itemTitle">Settings</div>
              </a>
            </li>
            <li effect="ripple">
              <a
                // to="/call-dashboard"
                onClick={() => setactivePage("call-dashboard")}
                className="navItem"
              >
                <div className="iconHolder">
                  <i className="fa-solid fa-sliders" />
                </div>
                <div className="itemTitle">Call Dashboard</div>
              </a>
            </li>
            <li effect="ripple">
              <a
                // to="/call-center"
                onClick={() => setactivePage("call-center")}
                className="navItem"
              >
                <div className="iconHolder">
                  <i className="fa-solid fa-sliders" />
                </div>
                <div className="itemTitle">Call Center</div>
              </a>
            </li>
            <li effect="ripple">
              <a
                //  to="/"
                onClick={() => setactivePage("admin")}
                className="navItem"
              >
                <div className="iconHolder">
                  <i className="fa-brands fa-black-tie" />
                </div>
                <div className="itemTitle">Admin</div>
              </a>
            </li>
            <li effect="ripple">
              <a
                // to="/"
                onClick={() => setactivePage("reports")}
                className="navItem"
              >
                <div className="iconHolder">
                  <i className="fa-solid fa-chart-column" />
                </div>
                <div className="itemTitle">Reports</div>
              </a>
            </li>
            <li effect="ripple">
              <a
                // to="/"
                onClick={() => setactivePage("conference")}
                className="navItem"
              >
                <div className="iconHolder">
                  <i className="fa-sharp fa-solid fa-people-group" />
                </div>
                <div className="itemTitle">Conference</div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default SideNavbarApp;
