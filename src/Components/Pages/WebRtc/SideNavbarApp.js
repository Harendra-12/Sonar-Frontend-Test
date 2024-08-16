import React from 'react'
import { useNavigate } from 'react-router-dom'

function SideNavbarApp() {
  const navigate = useNavigate();
  return (
    <section>
      <div id="sidenNavApp">
        <div className="sidenavItems">
          <ul>
            <li>
              <button>
                <div className="profileHolder" id="profileOnlineNav">
                  NH
                </div>
                <div className="userTitle">Username</div>
              </button>
            </li>
            <li
              effect="ripple"
            >
              <button>
                <div className="iconHolder">
                  <i className="fa-solid fa-message" />
                </div>
                <div className="itemTitle">Messages</div>
              </button>
            </li>
            <li
              effect="ripple"
            >
              <button onClick={() => navigate("/call")}>
                <div className="iconHolder">
                  <i className="fa-solid fa-phone" />
                </div>
                <div className="itemTitle">Calls</div>
              </button>
            </li>
            <li
              effect="ripple"
            >
              <button onClick={() => navigate("/all-voicemails")}>
                <div className="iconHolder">
                  <i className="fa-solid fa-voicemail" />
                </div>
                <div className="itemTitle">Voicemails</div>
              </button>
            </li>
            <li
              effect="ripple"
            >
              <button>
                <div className="iconHolder">
                  <i className="fa-solid fa-star" />
                </div>
                <div className="itemTitle">Favorites</div>
              </button>
            </li>
            <li
              effect="ripple"
            >
              <button onClick={() => navigate("/all-contacts")}>
                <div className="iconHolder">
                  <i className="fa-solid fa-address-book" />
                </div>
                <div className="itemTitle">Contacts</div>
              </button>
            </li>
            <li effect="ripple">
              <button>
                <div className="iconHolder">
                  <i className="fa-regular fa-circle-question" />
                </div>
                <div className="itemTitle">Help &amp; Feedback</div>
              </button>
            </li>
            <li effect="ripple">
              <button>
                <div className="iconHolder">
                  <i className="fa-solid fa-sliders" />
                </div>
                <div className="itemTitle">Settings</div>
              </button>
            </li>
            <li
              effect="ripple"
            >
              <button>
                <div className="iconHolder">
                  <i className="fa-brands fa-black-tie" />
                </div>
                <div className="itemTitle">Admin</div>
              </button>
            </li>
            <li effect="ripple">
              <button>
                <div className="iconHolder">
                  <i className="fa-solid fa-chart-column" />
                </div>
                <div className="itemTitle">Reports</div>
              </button>
            </li>
            <li
              effect="ripple"
            >
              <button>
                <div className="iconHolder">
                  <i className="fa-sharp fa-solid fa-people-group" />
                </div>
                <div className="itemTitle">Conference</div>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </section>

  )
}

export default SideNavbarApp
