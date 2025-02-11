/* eslint-disable eqeqeq */
import React from "react";
import "../assets/css/style.css";
import { Link, useLocation } from "react-router-dom";
import {
  backToTop,
  featureUnderdevelopment,
} from "../GlobalFunction/globalFunction";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSideNav } from "./Header";

function Navbar() {
  const dispatch = useDispatch();
  const account = useSelector((state) => state.account);
  const accountDetails = useSelector((state) => state.accountDetails);
  const userType = account?.usertype;
  const isCustomerAdmin = account?.email == accountDetails?.email;

  // Checking if the current path is active by checking if the current path is in the childPaths array
  const location = useLocation();
  const isChildActive = (childPaths) => {
    return childPaths.some((path) => location.pathname === path);
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
                      <button
                        className="clearButton d-flex align-items-center"
                        onClick={toggleSideNav}
                      >
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
                    <NavLink to="/dashboard" onClick={backToTop} type="button">
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
                      aria-expanded={
                        isChildActive([
                          "/my-profile",
                          "/change-password",
                          "/admin/package",
                          "/users",
                          "/users-edit",
                          "/users-add",
                          "/roles",
                          "/master",
                          "/extensions",
                          "/extensions-edit",
                          "/extensions-add",
                        ])
                          ? "true"
                          : "false"
                      }
                      aria-controls="collapse5"
                    >
                      <div className="iconHolder">
                        <i class="fa-regular fa-user"></i>
                      </div>
                      <div className="itemTitle">Accounts</div>
                    </button>
                    <div
                      id="collapse8"
                      className={`accordion-collapse collapse ${isChildActive([
                        "/my-profile",
                        "/change-password",
                        "/admin/package",
                        "/users",
                        "/users-edit",
                        "/users-add",
                        "/roles",
                        "/master",
                        "/extensions",
                        "/extensions-edit",
                        "/extensions-add",
                        "/device-provisioning-add",
                        "/device-provisioning-edit",
                      ])
                        ? "show"
                        : ""
                        }`}
                      data-bs-parent="#sidenNav"
                    >
                      <div className="menuWrapper">
                        <ul className="tabMenu">
                          {account?.permissions?.includes(8) && (
                            <li className="tabItem">
                              <NavLink
                                to="/my-profile"
                                onClick={backToTop}
                                className="nav-link"
                              >
                                {/* <div className="iconHolder">
                                  <i class="fa-regular fa-user"></i>
                                </div> */}
                                <div className="itemTitle">Company Details</div>
                              </NavLink>
                            </li>
                          )}
                          {account?.permissions?.includes(440) ||
                            account?.permissions?.includes(442) ? (
                            <li className="tabItem ">
                              <NavLink
                                to="/users"
                                onClick={backToTop}
                                type="button"
                                className={({ isActive }) =>
                                  isActive ||
                                    ["/users-add", "/users-edit"].some((path) =>
                                      window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">Users</div>
                              </NavLink>
                            </li>
                          ) : null}

                          {account?.permissions?.includes(176) ||
                            account?.permissions?.includes(178) ? (
                            <li className="tabItem ">
                              <NavLink
                                to="/extensions"
                                className={({ isActive }) =>
                                  isActive ||
                                    [
                                      "/extensions-add",
                                      "/extensions-edit",
                                      "/device-provisioning-add",
                                      "/device-provisioning-edit",
                                    ].some((path) =>
                                      window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">Extensions</div>
                              </NavLink>
                            </li>
                          ) : null}

                          {account?.permissions?.includes(350) ||
                            account?.permissions?.includes(352) ? (
                            <li className="tabItem">
                              <NavLink
                                to="/roles"
                                onClick={backToTop}
                                className="nav-link"
                              >
                                <div className="itemTitle">
                                  Roles and Permisson
                                </div>
                              </NavLink>
                            </li>
                          ) : null}

                          {userType === "SupreAdmin" ? (
                            <li className="tabItem">
                              <NavLink
                                to="/admin/package"
                                onClick={backToTop}
                                className="nav-link"
                              >
                                <div className="itemTitle">Manage Services</div>
                              </NavLink>
                            </li>
                          ) : (
                            ""
                          )}

                          {userType === "SupreAdmin" ? (
                            <li className="tabItem">
                              <NavLink
                                to="/master"
                                onClick={backToTop}
                                className="nav-link"
                              >
                                <div className="itemTitle">Master</div>
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
                      data-bs-toggle="collapse"
                      data-bs-target="#collapse10"
                      aria-expanded={
                        isChildActive([
                          "/get-did",
                          "/port-number",
                          "/port-number-add",
                          "/port-number-edit",
                          "/did-listing",
                        ])
                          ? "true"
                          : "false"
                      }
                      aria-controls="collapse10"
                    >
                      <div className="iconHolder">
                        <i class="fa-regular fa-hashtag"></i>
                      </div>
                      <div className="itemTitle">Number Management</div>
                    </button>
                    <div
                      id="collapse10"
                      className={`accordion-collapse collapse ${isChildActive([
                        "/get-did",
                        "/port-number",
                        "/port-number-add",
                        "/port-number-edit",
                        "/did-listing",
                      ])
                        ? "show"
                        : ""
                        }`}
                      data-bs-parent="#sidenNav"
                    >
                      <div className="menuWrapper">
                        <ul className="tabMenu">
                          {account?.permissions?.includes(143) &&
                            <li className="tabItem">
                              <NavLink
                                to="/get-did"
                                onClick={backToTop}
                                className="nav-link"
                              >
                                <div className="itemTitle">Get DID</div>
                              </NavLink>
                            </li>
                          }
                          {account?.permissions?.includes(308) ||
                            account?.permissions?.includes(310) ? (
                            <li className="tabItem">
                              <NavLink
                                to="/port-number"
                                onClick={backToTop}
                                className={({ isActive }) =>
                                  isActive ||
                                    [
                                      "/port-number-add",
                                      "/port-number-edit",
                                    ].some((path) =>
                                      window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">Port number</div>
                              </NavLink>
                            </li>
                          ) : null}

                          {account?.permissions?.includes(134) &&
                            <li className="tabItem">
                              <NavLink
                                to="/did-listing"
                                onClick={backToTop}
                                className="nav-link"
                              >
                                <div className="itemTitle">
                                  Number Configuration
                                </div>
                              </NavLink>
                            </li>
                          }
                        </ul>
                      </div>
                    </div>
                  </li>

                  <li className="">
                    <button
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                      aria-expanded={
                        isChildActive([
                          "/phone-dashboard",
                          "/did-listing-pbx",
                          "/did-config",
                          "/did-add",
                          "/ring-groups",
                          "/ring-groups-add",
                          "/ring-groups-edit",
                          "/cal-center-queue",
                          "/cal-center-queue-add",
                          "/cal-center-queue-edit",
                          "/call-blocking",
                          "/call-blocking-add",
                          "/agents",
                          "/agents-add",
                          "/agents-edit",
                          "/active-calls",
                          "/voicemail-report"
                        ])
                          ? "true"
                          : "false"
                      }
                      aria-controls="collapseOne"
                    >
                      <div className="iconHolder">
                        <i class="fa-regular fa-phone-intercom"></i>
                      </div>
                      <div className="itemTitle">PBX</div>
                    </button>
                    <div
                      id="collapseOne"
                      className={`accordion-collapse collapse ${isChildActive([
                        "/phone-dashboard",
                        "/device-provisioning-add",
                        "/device-provisioning-edit",
                        "/did-listing-pbx",
                        "/did-config",
                        "/did-add",
                        "/ring-groups",
                        "/ring-groups-add",
                        "/ring-groups-edit",
                        "/cal-center-queue",
                        "/cal-center-queue-add",
                        "/cal-center-queue-edit",
                        "/call-blocking",
                        "/call-blocking-add",
                        "/agents",
                        "/agents-add",
                        "/agents-edit",
                        "/call-dashboard",
                        "/active-calls",
                        "/voicemail-report"
                      ])
                        ? "show"
                        : ""
                        }`}
                      data-bs-parent="#sidenNav"
                    >
                      <div className="menuWrapper">
                        <ul className="tabMenu">
                          {account?.permissions?.includes(476) &&
                            <li className="tabItem ">
                              <NavLink to="/phone-dashboard">
                                <div className="itemTitle">Call Dashboard</div>
                              </NavLink>
                            </li>
                          }
                          {account?.permissions?.includes(477) &&
                            <li className="tabItem ">
                              <NavLink to="/active-calls" onClick={backToTop}>
                                <div className="itemTitle">Active Calls</div>
                              </NavLink>
                            </li>
                          }
                          {account?.permissions?.includes(134) &&
                            <li className="tabItem">
                              <NavLink
                                to="/did-listing-pbx"
                                onClick={backToTop}
                                className={({ isActive }) =>
                                  isActive ||
                                    ["/did-add", "/did-config"].some((path) =>
                                      window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">
                                  Number Configuration
                                </div>
                              </NavLink>
                            </li>
                          }
                          {account?.permissions?.includes(440) &&
                            <li className="tabItem ">
                              <NavLink
                                to="/agents"
                                onClick={() => backToTop()}
                                className={({ isActive }) =>
                                  isActive ||
                                    ["/agents-add", "/agents-edit"].some((path) =>
                                      window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">Agents</div>
                              </NavLink>
                            </li>
                          }
                          {account?.permissions?.includes(344) ||
                            account?.permissions?.includes(346) ? (
                            <li className="tabItem ">
                              <NavLink
                                to="/ring-groups"
                                onClick={backToTop}
                                type="button"
                                className={({ isActive }) =>
                                  isActive ||
                                    [
                                      "/ring-groups-add",
                                      "/ring-groups-edit",
                                    ].some((path) =>
                                      window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">Ring Group</div>
                              </NavLink>
                            </li>
                          ) : null}

                          {account?.permissions?.includes(62) ||
                            account?.permissions?.includes(64) ? (
                            <li className="tabItem ">
                              <NavLink
                                to="/cal-center-queue"
                                onClick={backToTop}
                                type="button"
                                className={({ isActive }) =>
                                  isActive ||
                                    [
                                      "/cal-center-queue-add",
                                      "/cal-center-queue-edit",
                                    ].some((path) =>
                                      window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">Call Center</div>
                              </NavLink>
                            </li>
                          ) : null}


                          {account?.permissions?.includes(479) &&
                            <li className="tabItem ">
                              <NavLink
                                to="/call-blocking"
                                onClick={backToTop}
                                type="button"
                              >
                                <div className="itemTitle">Call Blocking</div>
                              </NavLink>
                            </li>
                          }
                          {account?.permissions?.includes(478) &&
                            <li className="tabItem ">
                              <NavLink to="/voicemail-report">
                                <div className="itemTitle">Voice Mail</div>
                              </NavLink>
                            </li>
                          }
                        </ul>
                      </div>
                    </div>
                  </li>
                  {isCustomerAdmin && <>
                    <li className="">
                      <button
                        data-bs-toggle="collapse"
                        data-bs-target="#collapse6"
                        aria-expanded={
                          isChildActive([
                            "/dialer-dashboard",
                            "/leads",
                            "/lead-add",
                            "/lead-edit",
                            "/campaigns",
                            "/agents-dialer",
                            "/call-desposition",
                            "/agent-disposition-manage"
                          ])
                            ? "true"
                            : "false"
                        }
                        aria-controls="collapse6"
                      >
                        <div className="iconHolder">
                          <i class="fa-regular fa-grid"></i>
                        </div>
                        <div className="itemTitle">Dialer</div>
                      </button>
                      <div
                        id="collapse6"
                        className={`accordion-collapse collapse ${isChildActive([
                          "/dialer-dashboard",
                          "/leads",
                          "/lead-add",
                          "/lead-edit",
                          "/campaigns",
                          "/agents-dialer",
                          "/call-desposition",
                          "/agent-disposition-manage",
                        ])
                          ? "show"
                          : ""
                          }`}
                        data-bs-parent="#sidenNav"
                      >
                        <div className="menuWrapper">
                          <ul className="tabMenu">
                            <li className="tabItem ">
                              <NavLink
                                to="/dialer-dashboard"
                                onClick={() => backToTop()}
                                className={({ isActive }) =>
                                  isActive ||
                                    ["/extensions-add", "/extensions-edit"].some(
                                      (path) =>
                                        window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">Dashboard</div>
                              </NavLink>
                            </li>
                            <li className="tabItem ">
                              <NavLink
                                to="/agent-disposition-manage"
                                onClick={() => backToTop()}
                                className={({ isActive }) =>
                                  isActive ||
                                    ["/agent-disposition-manage"].some((path) =>
                                      window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">Desposition</div>
                              </NavLink>
                            </li>

                            <li className="tabItem ">
                              <NavLink
                                to="/campaigns"
                                onClick={() => backToTop()}
                                className={({ isActive }) =>
                                  isActive ||
                                    ["/campaigns-add", "/campaigns-edit"].some(
                                      (path) =>
                                        window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">Campaign</div>
                              </NavLink>
                            </li>

                            <li className="tabItem ">
                              <NavLink
                                to="/leads"
                                onClick={() => backToTop()}
                                className={({ isActive }) =>
                                  isActive ||
                                    ["/lead-add", "/lead-edit"].some((path) =>
                                      window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">Leads</div>
                              </NavLink>
                            </li>

                            <li className="tabItem ">
                              <NavLink
                                to="/agents-dialer"
                                className={({ isActive }) =>
                                  isActive ||
                                    ["/agents", "/agents-edit", "/agents-add"].some(
                                      (path) =>
                                        window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">Agents</div>
                              </NavLink>
                            </li>

                            <li className="tabItem ">
                              <NavLink
                                to="/call-desposition"
                                onClick={() => backToTop()}
                                className={({ isActive }) =>
                                  isActive ||
                                    ["/call-desposition"].some((path) =>
                                      window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">Call Desposition</div>
                              </NavLink>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>

                    <li className="">
                      <button
                        data-bs-toggle="collapse"
                        data-bs-target="#collapse7"
                        aria-expanded={
                          isChildActive(["/call-tracker"]) ? "true" : "false"
                        }
                        aria-controls="collapse7"
                      >
                        <div className="iconHolder">
                          <i class="fa-regular fa-chart-waterfall"></i>
                        </div>
                        <div className="itemTitle">Call Tracker</div>
                      </button>
                      <div
                        id="collapse7"
                        className={`accordion-collapse collapse ${isChildActive([]) ? "show" : ""
                          }`}
                        data-bs-parent="#sidenNav"
                      >
                        <div className="menuWrapper">
                          <ul className="tabMenu">
                            <li className="tabItem ">
                              <Link
                                onClick={() => featureUnderdevelopment()}
                                className={({ isActive }) =>
                                  isActive ||
                                    ["/extensions-add", "/extensions-edit"].some(
                                      (path) =>
                                        window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">Dashboard</div>
                              </Link>
                            </li>

                            <li className="tabItem ">
                              <Link
                                onClick={() => featureUnderdevelopment()}
                                className={({ isActive }) =>
                                  isActive ||
                                    ["/extensions-add", "/extensions-edit"].some(
                                      (path) =>
                                        window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">
                                  Number Configuration
                                </div>
                              </Link>
                            </li>

                            <li className="tabItem ">
                              <Link
                                onClick={() => featureUnderdevelopment()}
                                className={({ isActive }) =>
                                  isActive ||
                                    ["/extensions-add", "/extensions-edit"].some(
                                      (path) =>
                                        window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">Campaign</div>
                              </Link>
                            </li>

                            <li className="tabItem ">
                              <Link
                                onClick={() => featureUnderdevelopment()}
                                className={({ isActive }) =>
                                  isActive ||
                                    ["/extensions-add", "/extensions-edit"].some(
                                      (path) =>
                                        window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">Buyers</div>
                              </Link>
                            </li>

                            <li className="tabItem ">
                              <Link
                                onClick={() => featureUnderdevelopment()}
                                className={({ isActive }) =>
                                  isActive ||
                                    ["/extensions-add", "/extensions-edit"].some(
                                      (path) =>
                                        window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">Source</div>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                  </>
                  }
                  {account?.permissions?.includes(230) ||
                    account?.permissions?.includes(232) ? (
                    <li className="dashboard ">
                      <NavLink
                        to="/ivr"
                        onClick={backToTop}
                        type="button"
                        className={({ isActive }) =>
                          isActive ||
                            ["/ivr-add", "/ivr-edit"].some((path) =>
                              window.location.pathname.includes(path)
                            )
                            ? "nav-link active"
                            : "nav-link"
                        }
                      >
                        <div className="iconHolder">
                          <i class="fa-regular fa-microphone-stand"></i>
                        </div>
                        <div className="itemTitle">
                          Interactive Voice Response (IVR)
                        </div>
                      </NavLink>
                    </li>
                  ) : null}

                  {isCustomerAdmin && <>
                    <li className="dashboard ">
                      <NavLink
                        to="/meeting-room"
                        onClick={backToTop}
                        type="button"
                        className={({ isActive }) =>
                          isActive ||
                            ["/meeting-room", "/meeting-add"].some((path) =>
                              window.location.pathname.includes(path)
                            )
                            ? "nav-link active"
                            : "nav-link"
                        }
                      >
                        <div className="iconHolder">
                          <i class="fa-regular fa-microphone-stand"></i>
                        </div>
                        <div className="itemTitle">
                          Meeting Rooms
                        </div>
                      </NavLink>
                    </li>
                    <li className="dashboard ">
                      <NavLink
                        to="/click-to-call-listing"
                        onClick={backToTop}
                        type="button"
                      >
                        <div className="iconHolder">
                          <i class="fa-regular fa-bullseye-pointer"></i>
                        </div>
                        <div className="itemTitle">Click To Call</div>
                      </NavLink>
                    </li>
                  </>
                  }
                  {account?.permissions?.includes(86) ? (
                    <li className="">
                      <button
                        data-bs-toggle="collapse"
                        data-bs-target="#collapse4"
                        aria-expanded={
                          isChildActive([
                            "/cdr-report",
                            "/agent-reports",
                            "/meeting-reports",
                            "/call-center-report",
                            "/ring-group-report",
                          ])
                            ? "true"
                            : "false"
                        }
                        aria-controls="collapse4"
                      >
                        <div className="iconHolder">
                          <i class="fa-regular fa-chart-line-up"></i>
                        </div>
                        <div className="itemTitle">Reports</div>
                      </button>
                      <div
                        id="collapse4"
                        className={`accordion-collapse collapse ${isChildActive([
                          "/cdr-report",
                          "/agent-reports",
                          "/meeting-reports",
                          "/call-center-report",
                          "/ring-group-report",
                        ])
                          ? "show"
                          : ""
                          }`}
                        data-bs-parent="#sidenNav"
                      >
                        <div className="menuWrapper">
                          <ul className="tabMenu">
                            {account?.permissions?.includes(86) ? (
                              <li className="tabItem">
                                <NavLink
                                  to="/cdr-report"
                                  onClick={backToTop}
                                  className="nav-link"
                                >
                                  <div className="itemTitle">CDR / CQR</div>
                                </NavLink>
                              </li>
                            ) : null}
                            <li className="tabItem ">
                              <Link
                                onClick={() => featureUnderdevelopment()}
                                className={({ isActive }) =>
                                  isActive ||
                                    ["/extensions-add", "/extensions-edit"].some(
                                      (path) =>
                                        window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">
                                  Real-Time Analytics
                                </div>
                              </Link>
                            </li>
                            <li className="tabItem ">
                              <Link
                                // to="/extensions"
                                onClick={() => featureUnderdevelopment()}
                                className={({ isActive }) =>
                                  isActive ||
                                    ["/extensions-add", "/extensions-edit"].some(
                                      (path) =>
                                        window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">Call Analytics</div>
                              </Link>
                            </li>
                            <li className="tabItem ">
                              <Link
                                // to="/agent-reports"
                                onClick={() => featureUnderdevelopment()}
                                className="nav-links"
                              >
                                <div className="itemTitle">Agent Report</div>
                              </Link>
                            </li>
                            <li className="tabItem ">
                              <NavLink
                                to="/call-center-report"
                                className={({ isActive }) =>
                                  isActive ||
                                    ["/extensions-add", "/extensions-edit"].some(
                                      (path) =>
                                        window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">Call Queues</div>
                              </NavLink>
                            </li>
                            <li className="tabItem ">
                              <NavLink
                                to="/ring-group-report"
                                className={({ isActive }) =>
                                  isActive ||
                                    ["/extensions-add", "/extensions-edit"].some(
                                      (path) =>
                                        window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">Ring Groups</div>
                              </NavLink>
                            </li>
                            <li className="tabItem ">
                              <Link
                                // to="/extensions"
                                onClick={() => featureUnderdevelopment()}
                                className={({ isActive }) =>
                                  isActive ||
                                    ["/extensions-add", "/extensions-edit"].some(
                                      (path) =>
                                        window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">
                                  Dialer Analytics
                                </div>
                              </Link>
                            </li>
                            <li className="tabItem ">
                              <Link
                                // to="/extensions"
                                onClick={() => featureUnderdevelopment()}
                                className="nav-link"
                              >
                                <div className="itemTitle">Call Tracking</div>
                              </Link>
                            </li>
                            <li className="tabItem ">
                              <Link
                                // to="/meeting-reports"
                                onClick={() => featureUnderdevelopment()}
                                className="nav-link"
                              >
                                <div className="itemTitle">Meeting Reports</div>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                  ) : null}

                  <li className="">
                    <button
                      data-bs-toggle="collapse"
                      data-bs-target="#collapse9"
                      aria-expanded={
                        isChildActive([
                          "/card-details",
                          "/card-transaction-list",
                          "/wallet-transaction-list",
                          "/billing-report"
                        ])
                          ? "true"
                          : "false"
                      }
                      aria-controls="collapse9"
                    >
                      <div className="iconHolder">
                        <i class="fa-regular fa-file-invoice-dollar"></i>
                      </div>
                      <div className="itemTitle">Billings</div>
                    </button>
                    <div
                      id="collapse9"
                      className={`accordion-collapse collapse ${isChildActive([
                        "/card-details",
                        "/card-transaction-list",
                        "/wallet-transaction-list",
                        "/billing-report",
                      ])
                        ? "show"
                        : ""
                        }`}
                      data-bs-parent="#sidenNav"
                    >
                      <div className="menuWrapper">
                        <ul className="tabMenu">
                          {account?.permissions?.includes(470) ||
                            account?.permissions?.includes(470) ? (
                            <li className="tabItem">
                              <NavLink
                                to="/card-details"
                                onClick={backToTop}
                                className="nav-link"
                              >
                                <div className="itemTitle">Payment Info</div>
                              </NavLink>
                            </li>
                          ) : null}
                          {account?.permissions?.includes(80) ||
                            account?.permissions?.includes(82) ? (
                            <li className="tabItem">
                              <NavLink
                                to="/card-transaction-list"
                                onClick={backToTop}
                                className="nav-link"
                              >
                                <div className="itemTitle">Card</div>
                              </NavLink>
                            </li>
                          ) : null}

                          {account?.permissions?.includes(470) ||
                            account?.permissions?.includes(472) ? (
                            <li className="tabItem">
                              <NavLink
                                to="/wallet-transaction-list"
                                onClick={backToTop}
                                className="nav-link"
                              >
                                <div className="itemTitle">Wallet</div>
                              </NavLink>
                            </li>
                          ) : null}

                          <li className="tabItem ">
                            <Link
                              // to="/extensions"
                              onClick={() => featureUnderdevelopment()}
                              className={({ isActive }) =>
                                isActive ||
                                  ["/extensions-add", "/extensions-edit"].some(
                                    (path) =>
                                      window.location.pathname.includes(path)
                                  )
                                  ? "nav-link active"
                                  : "nav-link"
                              }
                            >
                              <div className="itemTitle">Rate Card</div>
                            </Link>
                          </li>
                          {account?.permissions?.includes(86) &&
                            <li className="tabItem ">
                              <NavLink
                                to="/billing-report"
                                className={({ isActive }) =>
                                  isActive ||
                                    ["/extensions-add", "/extensions-edit"].some(
                                      (path) =>
                                        window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">Reports</div>
                              </NavLink>
                            </li>
                          }
                        </ul>
                      </div>
                    </div>
                  </li>

                  {isCustomerAdmin && <>
                    <li className="">
                      <button
                        data-bs-toggle="collapse"
                        data-bs-target="#collapse5"
                        aria-expanded={
                          isChildActive([
                            "/mail-settings",
                            "/fax-settings",
                            "/call-recording",
                            "/voice-music"
                          ])
                            ? "true"
                            : "false"
                        }
                        aria-controls="collapse5"
                      >
                        <div className="iconHolder">
                          <i class="fa-regular fa-sliders"></i>
                        </div>
                        <div className="itemTitle">Setting</div>
                      </button>
                      <div
                        id="collapse5"
                        className={`accordion-collapse collapse ${isChildActive([
                          "/mail-settings",
                          "/fax-settings",
                          "/call-recording",
                          "/voice-music",
                        ])
                          ? "show"
                          : ""
                          }`}
                        data-bs-parent="#sidenNav"
                      >
                        <div className="menuWrapper">
                          <ul className="tabMenu">
                            <li className="tabItem ">
                              <Link
                                // to="/extensions"
                                onClick={() => featureUnderdevelopment()}
                                className={({ isActive }) =>
                                  isActive ||
                                    ["/extensions-add", "/extensions-edit"].some(
                                      (path) =>
                                        window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">General</div>
                              </Link>
                            </li>
                            <li className="tabItem ">
                              <NavLink to="/voice-music">
                                <div className="itemTitle">Voice Music</div>
                              </NavLink>
                            </li>
                            <li className="tabItem">
                              <NavLink
                                to="/fax-settings"
                                onClick={() => backToTop()}
                                className={({ isActive }) =>
                                  isActive ||
                                    ["/fax-settings"].some((path) =>
                                      window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">Fax</div>
                              </NavLink>
                            </li>
                            {account?.permissions?.includes(248) ||
                              account?.permissions?.includes(250) ? (
                              <li className="tabItem ">
                                <NavLink
                                  to="/mail-settings"
                                  onClick={backToTop}
                                  type="button"
                                  className={({ isActive }) =>
                                    isActive ||
                                      [
                                        "/mail-settings-add",
                                        "/mail-settings-edit",
                                      ].some((path) =>
                                        window.location.pathname.includes(path)
                                      )
                                      ? "nav-link active"
                                      : "nav-link"
                                  }
                                >
                                  <div className="itemTitle">Email</div>
                                </NavLink>
                              </li>
                            ) : null}
                            <li className="tabItem ">
                              <NavLink
                                to="/call-recording"
                                onClick={() => backToTop()}
                                className={({ isActive }) =>
                                  isActive ||
                                    ["/call-recording"].some((path) =>
                                      window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">Call Recording</div>
                              </NavLink>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>

                    <li className="">
                      <button
                        data-bs-toggle="collapse"
                        data-bs-target="#collapse11"
                        aria-expanded={
                          isChildActive(["/add-ons", "/store-extension"])
                            ? "true"
                            : "false"
                        }
                        aria-controls="collapse11"
                      >
                        <div className="iconHolder">
                          <i class="fa-regular fa-store"></i>
                        </div>
                        <div className="itemTitle">Store</div>
                      </button>
                      <div
                        id="collapse11"
                        className={`accordion-collapse collapse ${isChildActive(["/add-ons", "/store-extension"])
                          ? "show"
                          : ""
                          }`}
                        data-bs-parent="#sidenNav"
                      >
                        <div className="menuWrapper">
                          <ul className="tabMenu">
                            <li className="tabItem ">
                              <NavLink
                                to="/store-extension"
                                onClick={() => backToTop()}
                                className={({ isActive }) =>
                                  isActive ||
                                    ["/store-extension"].some((path) =>
                                      window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">Extensions</div>
                              </NavLink>
                            </li>
                            <li className="tabItem ">
                              <Link
                                // to="/extensions"
                                onClick={() => featureUnderdevelopment()}
                                className={({ isActive }) =>
                                  isActive ||
                                    ["/plugins"].some((path) =>
                                      window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">Plugins</div>
                              </Link>
                            </li>
                            {account?.permissions?.includes(248) ||
                              account?.permissions?.includes(250) ? (
                              <li className="tabItem ">
                                <Link
                                  // to="/dashboard"
                                  onClick={backToTop}
                                  type="button"
                                  className={({ isActive }) =>
                                    isActive ||
                                      ["/hardwares", "/hardware-add"].some((path) =>
                                        window.location.pathname.includes(path)
                                      )
                                      ? "nav-link active"
                                      : "nav-link"
                                  }
                                >
                                  <div className="itemTitle">Hardwares</div>
                                </Link>
                              </li>
                            ) : null}
                            <li className="tabItem ">
                              <NavLink
                                to="/add-ons"
                                onClick={() => backToTop()}
                                className={({ isActive }) =>
                                  isActive ||
                                    ["/add-ons"].some((path) =>
                                      window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">Add-Ons</div>
                              </NavLink>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                    <li className="">
                      <button
                        data-bs-toggle="collapse"
                        data-bs-target="#collapse12"
                        aria-expanded={
                          isChildActive(["/support", "/knowledge-base"])
                            ? "true"
                            : "false"
                        }
                        aria-controls="collapse12"
                      >
                        <div className="iconHolder">
                          <i class="fa-regular fa-circle-info"></i>
                        </div>
                        <div className="itemTitle">Support</div>
                      </button>
                      <div
                        id="collapse12"
                        className={`accordion-collapse collapse ${isChildActive(["/support", "/knowledge-base"])
                          ? "show"
                          : ""
                          }`}
                        data-bs-parent="#sidenNav"
                      >
                        <div className="menuWrapper">
                          <ul className="tabMenu">
                            <li className="tabItem ">
                              <NavLink
                                to="/knowledge-base"
                                onClick={() => backToTop()}
                                className={({ isActive }) =>
                                  isActive ||
                                    ["/knowledge-base"].some((path) =>
                                      window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">Knowledge Base</div>
                              </NavLink>
                            </li>
                            <li className="tabItem ">
                              <Link
                                // to="/extensions"
                                onClick={() => featureUnderdevelopment()}
                                className={({ isActive }) =>
                                  isActive ||
                                    ["/extensions-add", "/extensions-edit"].some(
                                      (path) =>
                                        window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">Submit a Ticket</div>
                              </Link>
                            </li>
                            {account?.permissions?.includes(248) ||
                              account?.permissions?.includes(250) ? (
                              <li className="tabItem ">
                                <Link
                                  onClick={() => featureUnderdevelopment()}
                                  type="button"
                                  className={({ isActive }) =>
                                    isActive ||
                                      [
                                        "/mail-settings-add",
                                        "/mail-settings-edit",
                                      ].some((path) =>
                                        window.location.pathname.includes(path)
                                      )
                                      ? "nav-link active"
                                      : "nav-link"
                                  }
                                >
                                  <div className="itemTitle">
                                    Live Chat Support
                                  </div>
                                </Link>
                              </li>
                            ) : null}
                          </ul>
                        </div>
                      </div>
                    </li>
                  </>
                  }
                  <li className="dashboard ">
                    <NavLink to="/" onClick={() => dispatch({ type: "SET_LOGOUT", logout: 1 })} type="button">
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
