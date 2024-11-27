/* eslint-disable eqeqeq */
import React from "react";
import "../assets/css/style.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  backToTop,
  generalGetFunction,
} from "../GlobalFunction/globalFunction";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DarkModeToggle from "./DarkModeToggle";
import { toggleSideNav } from "./Header";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const account = useSelector((state) => state.account);
  const accountDetails = useSelector((state) => state.accountDetails);
  const userType = account?.usertype; // "Company"
  const isCustomerAdmin = account?.email == accountDetails?.email || false;
  const permissions = useSelector((state) => state.permissions || []);
  console.log(permissions);
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

  const location = useLocation();

  const isChildActive = (childPaths) => {
    return childPaths.some((path) => location.pathname.includes(path));
  };

  return (
    <div>
      <section>
        <div id="sidenNav">
          <div className="sidenavItems">
            <ul>
              {Number(accountDetails?.company_status) < 6 ? (
                <>
                  {" "}
                  <li className="dashboard">
                    <Link to="/temporary-dashboard" onClick={backToTop}>
                      <div className="imgWrapper">
                        <img
                          src={require("../assets/images/logo_login.png")}
                          alt="img"
                        />
                      </div>
                    </Link>
                  </li>{" "}
                  <li className="dashboard ">
                    <NavLink
                      to="/temporary-dashboard"
                      onClick={backToTop}
                      type="button"

                    >
                      <div className="iconHolder">
                        <i class="fa-regular fa-user"></i>
                      </div>
                      <div className="itemTitle">Dashboard</div>
                    </NavLink>
                  </li>{" "}
                </>
              ) : (
                <>
                  <li className="dashboard d-flex align-items-center">
                    <div className="d-xl-none d-block">
                      <button className="clearButton d-flex align-items-center" onClick={toggleSideNav}>
                        <i className="fa-light fa-bars fs-5 text-white" />
                      </button>
                    </div>
                    <Link to="/dashboard" onClick={backToTop}>
                      <div className="imgWrapper">
                        <img
                          src={require("../assets/images/logo_login.png")}
                          alt="img"
                        />
                      </div>
                    </Link>
                  </li>
                  <li className="dashboard ">
                    <NavLink
                      to="/dashboard"
                      onClick={backToTop}
                      type="button"

                    >
                      <div className="iconHolder">
                        <i class="fa-regular fa-house"></i>
                      </div>
                      <div className="itemTitle">Dashboard</div>
                    </NavLink>
                  </li>

                  <li className="">
                    <button
                      data-bs-toggle="collapse"
                      data-bs-target="#collapse8"
                      aria-expanded={isChildActive(["/my-profile", "/change-password"]) ? "true" : "false"}
                      aria-controls="collapse5"

                    >
                      <div className="iconHolder">
                        <i class="fa-regular fa-user"></i>
                      </div>
                      <div className="itemTitle">Account Details</div>
                    </button>
                    <div
                      id="collapse8"
                      className={`accordion-collapse collapse ${isChildActive(["/my-profile", "/change-password"]) ? "show" : ""}`}
                      data-bs-parent="#sidenNav"
                    >
                      <div className="menuWrapper">
                        <ul className="tabMenu">
                          {account?.permissions?.includes(8) && (
                            <li className="tabItem" >
                              <NavLink
                                to="/my-profile"
                                onClick={backToTop}
                                className="nav-link"
                              >
                                {/* <div className="iconHolder">
                                  <i class="fa-regular fa-user"></i>
                                </div> */}
                                <div className="itemTitle">My Profile</div>
                              </NavLink>
                            </li>
                          )}

                          {/* <li className="tabItem" >
                            <NavLink
                              to="/customer-details"
                              onClick={backToTop}
                              className="nav-link"
                            >
                              <div className="iconHolder">
                                <i className="fa-regular fa-swap-arrows" />
                              </div>
                              <div className="itemTitle">Details</div>
                            </NavLink>
                          </li> */}

                          <li className="tabItem" >
                            <NavLink
                              to="/change-password"
                              onClick={backToTop}
                              className="nav-link"
                            >
                              {/* <div className="iconHolder">
                                <i class="fa-regular fa-unlock"></i>
                              </div> */}
                              <div className="itemTitle">Change Password</div>
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>

                  <li className="">
                    <button
                      data-bs-toggle="collapse"
                      data-bs-target="#collapse5"
                      aria-expanded={isChildActive(["/master", "/roles", "/mail-settings", "/admin/package"]) ? "true" : "false"}
                      aria-controls="collapse5"

                    >
                      <div className="iconHolder">
                        <i class="fa-regular fa-sliders"></i>
                      </div>
                      <div className="itemTitle">Setting</div>
                    </button>
                    <div
                      id="collapse5"
                      className={`accordion-collapse collapse ${isChildActive(["/master", "/roles", "/mail-settings", "/admin/package"]) ? "show" : ""}`}
                      data-bs-parent="#sidenNav"
                    >
                      <div className="menuWrapper">
                        <ul className="tabMenu">
                          {userType === "SupreAdmin" ? (
                            <li className="tabItem" >
                              <NavLink
                                to="/master"
                                onClick={backToTop}
                                className="nav-link"
                              >
                                {/* <div className="iconHolder">
                                  <i className="fa-regular fa-swap-arrows" />
                                </div> */}
                                <div className="itemTitle">Master</div>
                              </NavLink>
                            </li>
                          ) : (
                            ""
                          )}

                          {account?.permissions?.includes(350) ||
                            account?.permissions?.includes(352) ? (
                            <li className="tabItem" >
                              <NavLink
                                to="/roles"
                                onClick={backToTop}
                                className="nav-link"
                              >
                                {/* <div className="iconHolder">
                                  <i class="fa-regular fa-arrow-up-big-small"></i>
                                </div> */}
                                <div className="itemTitle">
                                  Roles and Permisson
                                </div>
                              </NavLink>
                            </li>
                          ) : null}

                          {/* <li className="tabItem" >
                            <NavLink
                              to="/roles1"
                              onClick={backToTop}
                              className="nav-link"
                            >
                              <div className="iconHolder">
                                <i class="fa-regular fa-laptop-mobile"></i>
                              </div>
                              <div className="itemTitle">
                                Device Provisioning
                              </div>
                            </NavLink>
                          </li> */}
                          {account?.permissions?.includes(248) ||
                            account?.permissions?.includes(250) ? (
                            <li className="tabItem ">
                              <NavLink
                                to="/mail-settings"
                                onClick={backToTop}
                                type="button"
                                className={({ isActive }) =>
                                  isActive || ["/mail-settings-add", "/mail-settings-edit"].some((path) => window.location.pathname.includes(path))
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                {/* <div className="iconHolder">
                                  <i class="fa-regular fa-solid fa-envelopes-bulk"></i>
                                </div> */}
                                <div className="itemTitle">Mail Settings</div>
                              </NavLink>
                            </li>
                          ) : null}

                          {userType === "SupreAdmin" ? (
                            <li className="tabItem" >
                              <NavLink
                                to="/admin/package"
                                onClick={backToTop}
                                className="nav-link"
                              >
                                {/* <div className="iconHolder">
                                  <i class="fa-regular fa-cube"></i>
                                </div> */}
                                <div className="itemTitle">Packages</div>
                              </NavLink>
                            </li>
                          ) : (
                            ""
                          )}
                        </ul>
                      </div>
                    </div>
                  </li>

                  <li className="">
                    <button
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                      aria-expanded={isChildActive(["/phone-dashboard", "/extensions", "/voice-music", "/extensions-edit", "/extensions-add", "/device-provisioning-add"]) ? "true" : "false"}
                      aria-controls="collapseOne"

                    >
                      <div className="iconHolder">
                        <i class="fa-regular fa-phone-intercom"></i>
                      </div>
                      <div className="itemTitle">Phone System</div>
                    </button>
                    <div
                      id="collapseOne"
                      className={`accordion-collapse collapse ${isChildActive(["/phone-dashboard", "/extensions", "/voice-music", "/extensions-edit", "/extensions-add", "/device-provisioning-add"]) ? "show" : ""}`}
                      data-bs-parent="#sidenNav"
                    >
                      <div className="menuWrapper">
                        <ul className="tabMenu">
                          <li className="tabItem " >
                            <NavLink to="/phone-dashboard">
                              {/* <div className="iconHolder">
                                <i className="fa-regular fa-regular fa-list-dropdown"></i>
                              </div> */}
                              <div className="itemTitle">Phone Dashboard</div>
                            </NavLink>
                          </li>
                          {account?.permissions?.includes(176) ||
                            account?.permissions?.includes(178) ? (
                            <li className="tabItem " >
                              <NavLink to="/extensions" className={({ isActive }) =>
                                isActive || ["/extensions-add", "/extensions-edit"].some((path) => window.location.pathname.includes(path))
                                  ? "nav-link active"
                                  : "nav-link"
                              }>
                                {/* <div className="iconHolder">
                                  <i className="fa-regular fa-phone-office" />
                                </div> */}
                                <div className="itemTitle">Extensions</div>
                              </NavLink>
                            </li>
                          ) : null}

                          <li className="tabItem " >
                            <NavLink to="/voice-music">
                              {/* <div className="iconHolder">
                                <i class="fa-regular fa-user-music"></i>
                              </div> */}
                              <div className="itemTitle">Voice Music</div>
                            </NavLink>
                          </li>
                          {/* <li className="tabItem " >
                            <NavLink to="/active-calls">
                              <div className="iconHolder">
                                <i class="fa-regular fa-phone-volume"></i>
                              </div>
                              <div className="itemTitle">Active Calls</div>
                            </NavLink>
                          </li> */}
                        </ul>
                      </div>
                    </div>
                  </li>
                  {/* <li className="">
                    <button
                      data-bs-toggle="collapse"
                      data-bs-target="#collapse2"
                      aria-expanded="false"
                      aria-controls="collapse2"
                      
                    >
                      <div className="itemTitle">Dialplan</div>
                    </button>
                    <div
                      id="collapse2"
                      className="accordion-collapse collapse"
                      data-bs-parent="#sidenNav"
                    >
                      <div className="menuWrapper">
                        <ul className="tabMenu">
                          <li className="tabItem" >
                            <NavLink to="/destination" className="nav-link">
                              <div className="iconHolder">
                                <i className="fa-regular fa-swap-arrows" />
                              </div>
                              <div className="itemTitle">Destinations</div>
                            </NavLink>
                          </li>

                          <li className="tabItem" >
                            <NavLink to="/destinations" className="nav-link">
                              <div className="iconHolder">
                                <i className="fa-regular fa-swap-arrows" />
                              </div>
                              <div className="itemTitle">Routes</div>
                            </NavLink>
                          </li>
                          
                        </ul>
                      </div>
                    </div>
                  </li> */}
                  {/* <li className="tabItem" >
                        <a
                          href=""
                          className="nav-link"
                        >
                          <div className="iconHolder">
                            <i className="fa-sharp fa-regular fa-group-arrows-rotate" />
                          </div>
                          <div className="itemTitle">Dialplan Manager</div>
                        </a>
                      </li> */}
                  {/* <li className="tabItem" >
                        <a
                          href=""
                          className="nav-link"
                        >
                          <div className="iconHolder">
                            <i className="fa-sharp fa-regular fa-phone-volume" />
                          </div>
                          <div className="itemTitle">Inbound Routes</div>
                        </a>
                      </li> */}
                  {/* <li className="tabItem" >
                        <a
                          href=""
                          className="nav-link"
                        >
                          <div className="iconHolder">
                            <i className="fa-regular fa-phone-arrow-up-right" />
                          </div>
                          <div className="itemTitle">Outbound Routes</div>
                        </a>
                      </li> */}
                  {account?.permissions?.includes(86) ? (
                    <li className="">
                      <button
                        data-bs-toggle="collapse"
                        data-bs-target="#collapse4"
                        aria-expanded={isChildActive(["/cdr-report"]) ? "true" : "false"}
                        aria-controls="collapse4"

                      >
                        <div className="iconHolder">
                          <i class="fa-regular fa-chart-line-up"></i>
                        </div>
                        <div className="itemTitle">Reports</div>
                      </button>
                      <div
                        id="collapse4"
                        className={`accordion-collapse collapse ${isChildActive(["/cdr-report"]) ? "show" : ""}`}
                        data-bs-parent="#sidenNav"
                      >
                        <div className="menuWrapper">
                          <ul className="tabMenu">
                            {/* <li className="tabItem" >
                            <NavLink
                              to="/call"
                              onClick={backToTop}
                              className="nav-link"
                            >
                              <div className="iconHolder">
                                <i className="fa-regular fa-swap-arrows" />
                              </div>
                              <div className="itemTitle">Call</div>
                            </NavLink>
                          </li> */}
                            {account?.permissions?.includes(86) ? (
                              <li className="tabItem" >
                                <NavLink
                                  to="/cdr-report"
                                  onClick={backToTop}
                                  className="nav-link"
                                >
                                  {/* <div className="iconHolder">
                                    <i class="fa-regular fa-chart-bar"></i>
                                  </div> */}
                                  <div className="itemTitle">CDR Report</div>
                                </NavLink>
                              </li>
                            ) : null}
                          </ul>
                        </div>
                      </div>
                    </li>
                  ) : null}

                  <li className="">
                    <button
                      data-bs-toggle="collapse"
                      data-bs-target="#collapse10"
                      aria-expanded={isChildActive(["/get-did", "/did-listing", "/port-number", "/did-config", "/did-add", "/port-number-add", "/port-number-edit"]) ? "true" : "false"}
                      aria-controls="collapse10"

                    >
                      <div className="iconHolder">
                        <i class="fa-regular fa-hashtag"></i>
                      </div>
                      <div className="itemTitle">Number Management</div>
                    </button>
                    <div
                      id="collapse10"
                      className={`accordion-collapse collapse ${isChildActive(["/get-did", "/did-listing", "/port-number", "/did-config", "/did-add", "/port-number-add", "/port-number-edit"]) ? "show" : ""}`}
                      data-bs-parent="#sidenNav"
                    >
                      <div className="menuWrapper">
                        <ul className="tabMenu">
                          <li className="tabItem" >
                            <NavLink
                              to="/get-did"
                              onClick={backToTop}
                              className="nav-link"
                            >
                              {/* <div className="iconHolder">
                                <i className="fa-regular fa-swap-arrows" />
                              </div> */}
                              <div className="itemTitle">Get DID</div>
                            </NavLink>
                          </li>
                          <li className="tabItem" >
                            <NavLink
                              to="/did-listing"
                              onClick={backToTop}
                              className={({ isActive }) =>
                                isActive || ["/did-add", "/did-config"].some((path) => window.location.pathname.includes(path))
                                  ? "nav-link active"
                                  : "nav-link"
                              }
                            >
                              {/* <div className="iconHolder">
                                <i class="fa-regular fa-hashtag"></i>
                              </div> */}
                              <div className="itemTitle">DID Listing</div>
                            </NavLink>
                          </li>
                          {account?.permissions?.includes(308) ||
                            account?.permissions?.includes(310) ? (
                            <li className="tabItem" >
                              <NavLink
                                to="/port-number"
                                onClick={backToTop}
                                className={({ isActive }) =>
                                  isActive || ["/port-number-add", "/port-number-edit"].some((path) => window.location.pathname.includes(path))
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                {/* <div className="iconHolder">
                                  <i class="fa-regular fa-hashtag-lock"></i>
                                </div> */}
                                <div className="itemTitle">Port number</div>
                              </NavLink>
                            </li>
                          ) : null}
                        </ul>
                      </div>
                    </div>
                  </li>

                  <li className="">
                    <button
                      data-bs-toggle="collapse"
                      data-bs-target="#collapse9"
                      aria-expanded={isChildActive(["/card-details", "/card-transaction-list", "/wallet-transaction-list"]) ? "true" : "false"}
                      aria-controls="collapse9"

                    >
                      <div className="iconHolder">
                        <i class="fa-regular fa-file-invoice-dollar"></i>
                      </div>
                      <div className="itemTitle">Billing</div>
                    </button>
                    <div
                      id="collapse9"
                      className={`accordion-collapse collapse ${isChildActive(["/card-details", "/card-transaction-list", "/wallet-transaction-list"]) ? "show" : ""}`}
                      data-bs-parent="#sidenNav"
                    >
                      <div className="menuWrapper">
                        <ul className="tabMenu">
                          {account?.permissions?.includes(470) ||
                            account?.permissions?.includes(470) ? (
                            <li className="tabItem" >
                              <NavLink
                                to="/card-details"
                                onClick={backToTop}
                                className="nav-link"
                              >
                                {/* <div className="iconHolder">
                                  <i class="fa-regular fa-money-check-dollar-pen"></i>
                                </div> */}
                                <div className="itemTitle">Payment Details</div>
                              </NavLink>
                            </li>
                          ) : null}

                          {/* <li className="tabItem" >
                            <NavLink
                              to="/invoice-list"
                              onClick={backToTop}
                              className="nav-link"
                            >
                              <div className="iconHolder">
                                <i className="fa-regular fa-swap-arrows" />
                              </div>
                              <div className="itemTitle">Invoice Details</div>
                            </NavLink>
                          </li> */}
                          {/* <li className="tabItem" >
                            <NavLink
                              to="/expense-list"
                              onClick={backToTop}
                              className="nav-link"
                            >
                              <div className="iconHolder">
                                <i className="fa-regular fa-swap-arrows" />
                              </div>
                              <div className="itemTitle">Expenses</div>
                            </NavLink>
                          </li> */}
                          {account?.permissions?.includes(80) ||
                            account?.permissions?.includes(82) ? (
                            <li className="tabItem" >
                              <NavLink
                                to="/card-transaction-list"
                                onClick={backToTop}
                                className="nav-link"
                              >
                                {/* <div className="iconHolder">
                                  <i class="fa-regular fa-credit-card"></i>
                                </div> */}
                                <div className="itemTitle">
                                  Card Transactions
                                </div>
                              </NavLink>
                            </li>
                          ) : null}

                          {account?.permissions?.includes(470) ||
                            account?.permissions?.includes(472) ? (
                            <li className="tabItem" >
                              <NavLink
                                to="/wallet-transaction-list"
                                onClick={backToTop}
                                className="nav-link"
                              >
                                {/* <div className="iconHolder">
                                  <i class="fa-regular fa-wallet"></i>
                                </div> */}
                                <div className="itemTitle">
                                  Wallet Transactions
                                </div>
                              </NavLink>
                            </li>
                          ) : null}
                        </ul>
                      </div>
                    </div>
                  </li>
                  {account?.permissions?.includes(344) ||
                    account?.permissions?.includes(346) ? (
                    <li className="dashboard ">
                      <NavLink
                        to="/ring-groups"
                        onClick={backToTop}
                        type="button"
                        className={({ isActive }) =>
                          isActive || ["/ring-groups-add", "/ring-groups-edit"].some((path) => window.location.pathname.includes(path))
                            ? "nav-link active"
                            : "nav-link"
                        }
                      >
                        <div className="iconHolder">
                          <i class="fa-regular fa-screen-users"></i>
                        </div>
                        <div className="itemTitle">Ring Group</div>
                      </NavLink>
                    </li>
                  ) : null}
                  {account?.permissions?.includes(440) ||
                    account?.permissions?.includes(442) ? (
                    <li className="dashboard ">
                      <NavLink
                        to="/users"
                        onClick={backToTop}
                        type="button"
                        className={({ isActive }) =>
                          isActive || ["/users-add", "/users-edit"].some((path) => window.location.pathname.includes(path))
                            ? "nav-link active"
                            : "nav-link"
                        }
                      >
                        <div className="iconHolder">
                          <i class="fa-regular fa-users-gear"></i>
                        </div>
                        <div className="itemTitle">Users</div>
                      </NavLink>
                    </li>
                  ) : null}

                  {account?.permissions?.includes(62) ||
                    account?.permissions?.includes(64) ? (
                    <li className="dashboard ">
                      <NavLink
                        to="/cal-center-queue"
                        onClick={backToTop}
                        type="button"
                        className={({ isActive }) =>
                          isActive || ["/cal-center-queue-add", "/cal-center-queue-edit"].some((path) => window.location.pathname.includes(path))
                            ? "nav-link active"
                            : "nav-link"
                        }
                      >
                        <div className="iconHolder" >
                          <i class="fa-regular fa-users-rectangle"></i>
                        </div>
                        <div className="itemTitle">Call Center</div>
                      </NavLink>
                    </li>
                  ) : null}

                  {/* <li className="dashboard ">
                    <NavLink
                      to="/variable"
                      onClick={backToTop}
                      type="button"
                      
                    >
                      <div className="itemTitle">Variable</div>
                    </NavLink>
                  </li> */}
                  {account?.permissions?.includes(230) ||
                    account?.permissions?.includes(232) ? (
                    <li className="dashboard ">
                      <NavLink
                        to="/ivr"
                        onClick={backToTop}
                        type="button"
                        className={({ isActive }) =>
                          isActive || ["/ivr-add", "/ivr-edit"].some((path) => window.location.pathname.includes(path))
                            ? "nav-link active"
                            : "nav-link"
                        }
                      >
                        <div className="iconHolder">
                          <i class="fa-regular fa-microphone-stand"></i>
                        </div>
                        <div className="itemTitle">IVR</div>
                      </NavLink>
                    </li>
                  ) : null}

                  {/* <li className="dashboard ">
                    <NavLink
                      to="/device-provisioning"
                      onClick={backToTop}
                      type="button"
                      
                    >
                      <div className="itemTitle">Device Provisioning</div>
                    </NavLink>
                  </li> */}
                  <li className="dashboard ">
                    <NavLink
                      to="/call-blocking"
                      onClick={backToTop}
                      type="button"

                    >
                      <div className="iconHolder">
                        <i class="fa-regular fa-block-brick-fire"></i>
                      </div>
                      <div className="itemTitle">Call Blocking</div>
                    </NavLink>
                  </li>
                  {account?.extension || isCustomerAdmin ? (
                    <li className="dashboard ">
                      <a
                        href="/webrtc"
                        target="_blank"
                        // onClick={backToTop}
                        type="button"

                      >
                        <div className="iconHolder">
                          <i class="fa-regular fa-headset"></i>
                        </div>
                        <div className="itemTitle">WebRtc</div>
                      </a>
                    </li>
                  ) : (
                    ""
                  )}
                  <li className="dashboard ">
                    <NavLink
                      to="/click-to-call"
                      onClick={backToTop}
                      type="button"

                    >
                      <div className="iconHolder">
                        <i class="fa-regular fa-bullseye-pointer"></i>
                      </div>
                      <div className="itemTitle">Click To Call</div>
                    </NavLink>
                  </li>
                  <li className="dashboard">
                    <a>
                      <DarkModeToggle marginLeft={"3"} />
                    </a>
                  </li>
                  <li className="dashboard ">
                    <NavLink
                      to="/"
                      onClick={logOut}
                      type="button"

                    >
                      <div className="iconHolder">
                        <i class="fa-regular fa-power-off"></i>
                      </div>
                      <div className="itemTitle">Log Out</div>
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Navbar;
