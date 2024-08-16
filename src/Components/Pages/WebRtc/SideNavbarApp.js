import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

function SideNavbarApp() {
  const navigate = useNavigate();
  return (
    <section>
      <div id="sidenNavApp">
        <div className="sidenavItems">
          <ul>
            <li>
              <button className='navItem'>
                <div className="profileHolder" id="profileOnlineNav">
                  NH
                </div>
                <div className="userTitle">Username</div>
              </button>
            </li>
            <li
              effect="ripple"
            >
              <NavLink to="/" className='navItem'>
                <div className="iconHolder">
                  <i className="fa-solid fa-message" />
                </div>
                <div className="itemTitle">Messages</div>
              </NavLink>
            </li>
            <li
              effect="ripple"
            >
              <NavLink to="/call" className='navItem'>
                <div className="iconHolder">
                  <i className="fa-solid fa-phone" />
                </div>
                <div className="itemTitle">Calls</div>
              </NavLink>
            </li>
            <li
              effect="ripple"
            >
              <NavLink to="/efax" className='navItem'>
                <div className="iconHolder">
                  <i className="fa-solid fa-fax" />
                </div>
                <div className="itemTitle">eFax</div>
              </NavLink>
            </li>
            <li
              effect="ripple"
            >
              <NavLink to="/all-voicemails" className='navItem'>
                <div className="iconHolder">
                  <i className="fa-solid fa-voicemail" />
                </div>
                <div className="itemTitle">Voicemails</div>
              </NavLink>
            </li>
            <li
              effect="ripple"
            >
              <NavLink to="/" className='navItem'>
                <div className="iconHolder">
                  <i className="fa-solid fa-star" />
                </div>
                <div className="itemTitle">Favorites</div>
              </NavLink>
            </li>
            <li
              effect="ripple"
            >
              <NavLink to="/all-contacts" className='navItem'>
                <div className="iconHolder">
                  <i className="fa-solid fa-address-book" />
                </div>
                <div className="itemTitle">Contacts</div>
              </NavLink>
            </li>
            <li effect="ripple">
              <NavLink to="/" className='navItem'>
                <div className="iconHolder">
                  <i className="fa-regular fa-circle-question" />
                </div>
                <div className="itemTitle">Help &amp; Feedback</div>
              </NavLink>
            </li>
            <li effect="ripple">
              <NavLink to="/" className='navItem'>
                <div className="iconHolder">
                  <i className="fa-solid fa-sliders" />
                </div>
                <div className="itemTitle">Settings</div>
              </NavLink>
            </li>
            <li
              effect="ripple"
            >
              <NavLink to="/" className='navItem'>
                <div className="iconHolder">
                  <i className="fa-brands fa-black-tie" />
                </div>
                <div className="itemTitle">Admin</div>
              </NavLink>
            </li>
            <li effect="ripple">
              <NavLink to="/" className='navItem'>
                <div className="iconHolder">
                  <i className="fa-solid fa-chart-column" />
                </div>
                <div className="itemTitle">Reports</div>
              </NavLink>
            </li>
            <li
              effect="ripple"
            >
              <NavLink to="/" className='navItem'>
                <div className="iconHolder">
                  <i className="fa-sharp fa-solid fa-people-group" />
                </div>
                <div className="itemTitle">Conference</div>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </section>

  )
}

export default SideNavbarApp
