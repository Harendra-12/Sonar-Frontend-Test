/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect } from "react";
import "../assets/css/style.css";
import { Link, useLocation } from "react-router-dom";
import {
  backToTop,
  featureUnderdevelopment,
} from "../GlobalFunction/globalFunction";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSideNav } from "./Header";
import { checkViewSidebar } from "../GlobalFunction/globalFunction";
function Navbar() {
  const dispatch = useDispatch();
  const account = useSelector((state) => state.account);
  const accountDetails = useSelector((state) => state.accountDetails);
  const userType = account?.usertype;
  const isCustomerAdmin = account?.email == accountDetails?.email;
  const permissions = useSelector((state) => state.permissions);
  const permissionRefresh = useSelector((state) => state.permissionRefresh);

  // Checking if the current path is active by checking if the current path is in the childPaths array
  const location = useLocation();
  const isChildActive = (childPaths) => {
    return childPaths.some((path) => location.pathname === path);
  };

  useEffect(() => {
    if (permissionRefresh == 0) {
      dispatch({
        type: "SET_PERMISSION_REFRESH",
        permissionRefresh: permissionRefresh + 1,
      });
    }
  }, [])

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
                        <i className="fa-regular fa-user"></i>
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
                        <i className="fa-regular fa-house"></i>
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
                          "/users-profile",
                          "/change-password",
                          "/admin/package",
                          "/users",
                          "/users-edit",
                          "/users-add",
                          "/users-config",
                          "/roles",
                          "/master",
                          "/extensions",
                          "/extensions-edit",
                          "/extensions-add",
                          "/all-devices",
                          "/device-provisioning-add",
                          "/device-provisioning-edit",
                        ])
                          ? "true"
                          : "false"
                      }
                      aria-controls="collapse5"
                    >
                      <div className="iconHolder">
                        <i className="fa-regular fa-user"></i>
                      </div>
                      <div className="itemTitle">Accounts</div>
                    </button>
                    <div
                      id="collapse8"
                      className={`accordion-collapse collapse ${isChildActive([
                        "/users-profile",
                        "/change-password",
                        "/admin/package",
                        "/users",
                        "/users-edit",
                        "/users-add",
                        "/users-config",
                        "/roles",
                        "/master",
                        "/extensions",
                        "/extensions-edit",
                        "/extensions-add",
                        "/all-devices",
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
                          {checkViewSidebar(
                            "Account",
                            permissions,
                            account?.permissions
                          ) && (
                              <li className="tabItem">
                                <NavLink
                                  to="/my-profile"
                                  onClick={backToTop}
                                  className="nav-link"
                                >
                                  {/* <div className="iconHolder">
                                  <i className="fa-regular fa-user"></i>
                                </div> */}
                                  <div className="itemTitle">Company Details</div>
                                </NavLink>
                              </li>
                            )}
                          {checkViewSidebar(
                            "User",
                            permissions,
                            account?.permissions
                          ) ? (
                            <li className="tabItem ">
                              <NavLink
                                to="/users"
                                // onClick={backToTop}
                                type="button"
                                className={({ isActive }) =>
                                  isActive ||
                                    ["/users-add", "/users-edit", "/users-config"].some((path) =>
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

                          {checkViewSidebar(
                            "Extension",
                            permissions,
                            account?.permissions
                          ) ? (
                            <li className="tabItem ">
                              <NavLink
                                to="/extensions"
                                className={({ isActive }) =>
                                  isActive ||
                                    [
                                      "/extensions-add",
                                      "/extensions-edit",
                                      "/all-devices",
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

                          {checkViewSidebar(
                            "Role",
                            permissions,
                            account?.permissions
                          ) ? (
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
                        <i className="fa-regular fa-hashtag"></i>
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
                          {checkViewSidebar(
                            "DidDetail",
                            permissions,
                            account?.permissions
                          ) && (
                              <li className="tabItem">
                                <NavLink
                                  to="/get-did"
                                  onClick={backToTop}
                                  className="nav-link"
                                >
                                  <div className="itemTitle">Get DID</div>
                                </NavLink>
                              </li>
                            )}
                          {checkViewSidebar(
                            "Port",
                            permissions,
                            account?.permissions
                          ) ? (
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

                          {checkViewSidebar(
                            "DidConfigure",
                            permissions,
                            account?.permissions
                          ) && (
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
                      aria-expanded={
                        isChildActive([
                          "/phone-dashboard",
                          "/agent-dashboard",

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
                          "/agents-pbx-add",
                          "/call-dashboard",
                          "/active-calls",
                          "/voicemail-report",
                        ])
                          ? "true"
                          : "false"
                      }
                      aria-controls="collapseOne"
                    >
                      <div className="iconHolder">
                        <i className="fa-regular fa-phone-intercom"></i>
                      </div>
                      <div className="itemTitle">PBX</div>
                    </button>
                    <div
                      id="collapseOne"
                      className={`accordion-collapse collapse ${isChildActive([
                        "/phone-dashboard",
                        "/agent-dashboard",
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
                        "/agents-pbx-add",
                        "/call-dashboard",
                        "/active-calls",
                        "/voicemail-report",
                      ])
                        ? "show"
                        : ""
                        }`}
                      data-bs-parent="#sidenNav"
                    >
                      <div className="menuWrapper">
                        <ul className="tabMenu">
                          {checkViewSidebar(
                            "phoneDashboard",
                            permissions,
                            account?.permissions
                          ) && (
                              <li className="tabItem ">
                                <NavLink to="/phone-dashboard">
                                  <div className="itemTitle">Call Dashboard</div>
                                </NavLink>
                              </li>
                            )}
                          {checkViewSidebar(
                            "activeCall",
                            permissions,
                            account?.permissions
                          ) && (
                              <li className="tabItem ">
                                <NavLink to="/active-calls" onClick={backToTop}>
                                  <div className="itemTitle">Active Calls</div>
                                </NavLink>
                              </li>
                            )}
                          {checkViewSidebar(
                            "DidConfigure",
                            permissions,
                            account?.permissions
                          ) && (
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
                            )}
                          <li className="tabItem ">
                            <NavLink to="/agent-dashboard">
                              <div className="itemTitle">Agent Dashboard</div>
                            </NavLink>
                          </li>
                          {checkViewSidebar(
                            "CallCenterAgent",
                            permissions,
                            account?.permissions
                          ) && (
                              <li className="tabItem ">
                                <NavLink
                                  to="/agents"
                                  onClick={() => backToTop()}
                                  className={({ isActive }) =>
                                    isActive ||
                                      ["/agents-add", "/agents-edit", "/agents-pbx-add"].some((path) =>
                                        window.location.pathname.includes(path)
                                      )
                                      ? "nav-link active"
                                      : "nav-link"
                                  }
                                >
                                  <div className="itemTitle">Agents</div>
                                </NavLink>
                              </li>
                            )}
                          {checkViewSidebar(
                            "Ringgroup",
                            permissions,
                            account?.permissions
                          ) ? (
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
                         <li className="tabItem ">
                            <Link  to="/groups"         
                              onClick={backToTop}
                              className={({ isActive }) =>
                                isActive ||
                                  ["/groups", "/groups-add"].some(
                                    (path) =>
                                      window.location.pathname.includes(path)
                                  )
                                  ? "nav-link active"
                                  : "nav-link"
                              }
                            >
                              <div className="itemTitle">Groups</div>
                            </Link>
                          </li>
                          {checkViewSidebar(
                            "CallCenterQueue",
                            permissions,
                            account?.permissions
                          ) ? (
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

                          {checkViewSidebar(
                            "callBlocking",
                            permissions,
                            account?.permissions
                          ) && (
                              <li className="tabItem ">
                                <NavLink
                                  to="/call-blocking"
                                  className={({ isActive }) =>
                                    isActive ||
                                      [
                                        "/call-blocking",
                                        "/call-blocking-add",
                                      ].some((path) =>
                                        window.location.pathname.includes(path)
                                      )
                                      ? "nav-link active"
                                      : "nav-link"
                                  }
                                  onClick={backToTop}
                                  type="button"
                                >
                                  <div className="itemTitle">Call Blocking</div>
                                </NavLink>
                              </li>
                            )}
                          {checkViewSidebar(
                            "voicemail",
                            permissions,
                            account?.permissions
                          ) && (
                              <li className="tabItem ">
                                <NavLink to="/voicemail-report">
                                  <div className="itemTitle">Voice Mail</div>
                                </NavLink>
                              </li>
                            )}
                          {isCustomerAdmin && (< li className="tabItem ">
                            <NavLink
                              to="/rate-card"
                              onClick={backToTop}
                              type="button"
                              className={({ isActive }) =>
                                isActive ||
                                  [
                                    "/rate-card",
                                  ].some((path) =>
                                    window.location.pathname.includes(path)
                                  )
                                  ? "nav-link active"
                                  : "nav-link"
                              }
                            >
                              <div className="itemTitle">Rate Card</div>
                            </NavLink>
                          </li>)}
                        </ul>
                      </div>
                    </div>
                  </li>
                  {isCustomerAdmin && (
                    <>
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
                              "/agent-disposition-manage",
                            ])
                              ? "true"
                              : "false"
                          }
                          aria-controls="collapse6"
                        >
                          <div className="iconHolder">
                            <i className="fa-regular fa-grid"></i>
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
                                      [
                                        "/extensions-add",
                                        "/extensions-edit",
                                      ].some((path) =>
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
                                      ["/campaigns-add", "/campaigns-edit", "/campaign-create"].some(
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
                                      [
                                        "/agents",
                                        "/agents-edit",
                                        "/agents-add",
                                      ].some((path) =>
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
                                  <div className="itemTitle">
                                    Call Desposition
                                  </div>
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
                            isChildActive([
                              "/tracker-dashboard",
                              "/did-listing-tracker",
                            ])
                              ? "true"
                              : "false"
                          }
                          aria-controls="collapse7"
                        >
                          <div className="iconHolder">
                            <i className="fa-regular fa-chart-waterfall"></i>
                          </div>
                          <div className="itemTitle">Call Tracker</div>
                        </button>
                        <div
                          id="collapse7"
                          className={`accordion-collapse collapse ${isChildActive([
                            "/tracker-dashboard",
                            "/did-listing-tracker",
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
                                  to="/tracker-dashboard"
                                  onClick={backToTop}
                                >
                                  <div className="itemTitle">Dashboard</div>
                                </NavLink>
                              </li>

                              <li className="tabItem ">
                                <NavLink
                                  to="/did-listing-tracker"
                                  onClick={backToTop}
                                  className={({ isActive }) =>
                                    isActive ||
                                      ["/did-listing-tracker"].some((path) =>
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

                              <li className="tabItem ">
                                <Link
                                  onClick={() => featureUnderdevelopment()}
                                  className={({ isActive }) =>
                                    isActive ||
                                      [
                                        "/extensions-add",
                                        "/extensions-edit",
                                      ].some((path) =>
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
                                <NavLink
                                  to="/buyers"
                                  onClick={() => backToTop()}
                                  className={({ isActive }) =>
                                    isActive ||
                                      [
                                        "/buyer-edit",
                                        "/buyer-add",
                                      ].some((path) =>
                                        window.location.pathname.includes(path)
                                      )
                                      ? "nav-link active"
                                      : "nav-link"
                                  }
                                >
                                  <div className="itemTitle">Buyers</div>
                                </NavLink>
                              </li>

                              <li className="tabItem ">
                                <Link
                                  onClick={() => featureUnderdevelopment()}
                                  className={({ isActive }) =>
                                    isActive ||
                                      [
                                        "/extensions-add",
                                        "/extensions-edit",
                                      ].some((path) =>
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
                      {isCustomerAdmin &&
                        <li className="">
                          <button
                            data-bs-toggle="collapse"
                            data-bs-target="#collapse13"
                            aria-expanded={
                              isChildActive([
                                "/meta-config",
                                "/meta-config-edit",
                                "/whatsapp-config",
                                "/whatsapp-config-edit",
                                "/teams-config",
                                "/all-third-party-apps",
                                "/all-addons",
                                "/all-available-addons"
                              ])
                                ? "true"
                                : "false"
                            }
                            aria-controls="collapse13"
                          >
                            <div className="iconHolder">
                              <i className="fa-regular fa-box-open"></i>
                            </div>
                            <div className="itemTitle">Third Party Integration</div>
                          </button>
                          <div
                            id="collapse13"
                            className={`accordion-collapse collapse ${isChildActive([
                              "/meta-config",
                              "/meta-config-edit",
                              "/whatsapp-config",
                              "/whatsapp-config-edit",
                              "/teams-config",
                              "/all-third-party-apps",
                              "/all-addons",
                              "/all-available-addons"
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
                                    to="/all-addons"
                                    onClick={() => backToTop()}
                                  >
                                    <div className="itemTitle">All Apps</div>
                                  </NavLink>
                                </li>
                                <li className="tabItem ">
                                  <NavLink
                                    to="/meta-config"
                                    onClick={() => backToTop()}
                                    className={({ isActive }) =>
                                      isActive ||
                                        [
                                          "/meta-config",
                                          "/meta-config-edit",
                                        ].some((path) =>
                                          window.location.pathname.includes(path)
                                        )
                                        ? "nav-link active"
                                        : "nav-link"
                                    }
                                  >
                                    <div className="itemTitle">Meta</div>
                                  </NavLink>
                                </li>

                                <li className="tabItem ">
                                  <NavLink
                                    to="/whatsapp-config"
                                    onClick={() => backToTop()}
                                    className={({ isActive }) =>
                                      isActive ||
                                        [
                                          "/whatsapp-config",
                                          "/whatsapp-config-edit",
                                        ].some((path) =>
                                          window.location.pathname.includes(path)
                                        )
                                        ? "nav-link active"
                                        : "nav-link"
                                    }
                                  >
                                    <div className="itemTitle">
                                      WhatsApp
                                    </div>
                                  </NavLink>
                                </li>

                                {/* <li className="tabItem ">
                                <NavLink
                                  to="/teams-config"
                                  onClick={() => backToTop()}
                                >
                                  <div className="itemTitle">
                                    Microsoft Teams
                                  </div>
                                </NavLink>
                              </li> */}
                              </ul>
                            </div>
                          </div>
                        </li>
                      }
                    </>
                  )}
                  {checkViewSidebar(
                    "IvrMaster",
                    permissions,
                    account?.permissions
                  ) ? (
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
                          <i className="fa-regular fa-microphone-stand"></i>
                        </div>
                        <div className="itemTitle">
                          Interactive Voice Response
                        </div>
                      </NavLink>
                    </li>
                  ) : null}
                  {isCustomerAdmin &&
                    <li className="">
                      <button
                        data-bs-toggle="collapse"
                        data-bs-target="#collapse14"
                        aria-expanded={
                          isChildActive([
                            "/all-ai-agent",
                            "/ai-agent-add",
                            "/ai-agent-edit"
                          ])
                            ? "true"
                            : "false"
                        }
                        aria-controls="collapse14"
                      >
                        <div className="iconHolder">
                          <i className="fa-regular fa-microchip-ai"></i>
                        </div>
                        <div className="itemTitle">AI</div>
                      </button>
                      <div
                        id="collapse14"
                        className={`accordion-collapse collapse ${isChildActive([
                          "/all-ai-agent",
                          "/ai-agent-add",
                          "/ai-agent-edit"
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
                                className={({ isActive }) =>
                                  isActive ||
                                    ["/did-listing-tracker"].some((path) =>
                                      window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                                onClick={() => featureUnderdevelopment()}
                              >
                                <div className="itemTitle">Dashboard</div>
                              </Link>
                            </li>
                            <li className="tabItem ">
                              <Link
                                onClick={() => featureUnderdevelopment()}
                              >
                                <div className="itemTitle">
                                  Number Configuration
                                </div>
                              </Link>
                            </li>
                            <li className="tabItem ">
                              <NavLink
                                to="/all-ai-agent"
                                onClick={() => backToTop()}
                                className={({ isActive }) =>
                                  isActive ||
                                    ["/all-ai-agent", "/ai-agent-add", "/ai-agent-edit"].some((path) =>
                                      window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">
                                  Agents
                                </div>
                              </NavLink>
                            </li>
                            <li className="tabItem ">
                              <Link
                                onClick={() => featureUnderdevelopment()}
                              >
                                <div className="itemTitle">
                                  Call Reports
                                </div>
                              </Link>
                            </li>
                            <li className="tabItem ">
                              <Link
                                onClick={() => featureUnderdevelopment()}
                              >
                                <div className="itemTitle">
                                  Analytics
                                </div>
                              </Link>
                            </li>
                            <li className="tabItem ">
                              <Link
                                onClick={() => featureUnderdevelopment()}
                              >
                                <div className="itemTitle">
                                  Billing
                                </div>
                              </Link>
                            </li>
                            <li className="tabItem ">
                              <Link
                                onClick={() => featureUnderdevelopment()}
                              >
                                <div className="itemTitle">
                                  Knowledge Base
                                </div>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                  }

                  {isCustomerAdmin && (
                    <>
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
                            <i className="fa-regular fa-screen-users"></i>
                          </div>
                          <div className="itemTitle">Meeting Rooms</div>
                        </NavLink>
                      </li>
                      <li className="dashboard ">
                        <NavLink
                          to="/click-to-call-listing"
                          onClick={backToTop}
                          type="button"
                        >
                          <div className="iconHolder">
                            <i className="fa-regular fa-bullseye-pointer"></i>
                          </div>
                          <div className="itemTitle">Click To Call</div>
                        </NavLink>
                      </li>
                    </>
                  )}
                  {checkViewSidebar(
                    "ChannelHangupComplete", permissions, account?.permissions) ? (
                    <li className="">
                      <button
                        data-bs-toggle="collapse"
                        data-bs-target="#collapse4"
                        aria-expanded={
                          isChildActive([
                            "/cdr-report",
                            "/call-recording",
                            "/meeting-reports",
                            "/call-center-report",
                            "/ring-group-report",
                            "/agent-report",
                          ])
                            ? "true"
                            : "false"
                        }
                        aria-controls="collapse4"
                      >
                        <div className="iconHolder">
                          <i className="fa-regular fa-chart-line-up"></i>
                        </div>
                        <div className="itemTitle">Reports</div>
                      </button>
                      <div
                        id="collapse4"
                        className={`accordion-collapse collapse ${isChildActive([
                          "/cdr-report",
                          "/call-recording",
                          "/meeting-reports",
                          "/call-center-report",
                          "/ring-group-report",
                          "/agent-report",
                        ])
                          ? "show"
                          : ""
                          }`}
                        data-bs-parent="#sidenNav"
                      >
                        <div className="menuWrapper">
                          <ul className="tabMenu">
                            {checkViewSidebar(
                              "ChannelHangupComplete",
                              permissions,
                              account?.permissions
                            ) ? (
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
                            <li className="tabItem">
                              <NavLink
                                to="/call-recording"
                                onClick={backToTop}
                                className="nav-link"
                              >
                                <div className="itemTitle">Call Recording</div>
                              </NavLink>
                            </li>
                            {/* <li className="tabItem ">
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
                              <NavLink
                                to="/agent-report"
                                onClick={backToTop}
                                className="nav-links"
                              >
                                <div className="itemTitle">Agent Report</div>
                              </NavLink>
                            </li> */}
                            <li className="tabItem ">
                              <NavLink
                                to="/call-center-report"
                                className={({ isActive }) =>
                                  isActive ||
                                    ["/call-center-report"].some(
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
                                    ["/ring-group-report"].some(
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
                            {/* <li className="tabItem ">
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
                            </li> */}
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
                          "/billing-report",
                          "/subscription-management"
                        ])
                          ? "true"
                          : "false"
                      }
                      aria-controls="collapse9"
                    >
                      <div className="iconHolder">
                        <i className="fa-regular fa-file-invoice-dollar"></i>
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
                        "/subscription-management"
                      ])
                        ? "show"
                        : ""
                        }`}
                      data-bs-parent="#sidenNav"
                    >
                      <div className="menuWrapper">
                        <ul className="tabMenu">
                          {checkViewSidebar(
                            "CardDetail",
                            permissions,
                            account?.permissions
                          ) &&
                            checkViewSidebar(
                              "BillingAddress",
                              permissions,
                              account?.permissions
                            ) ? (
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
                          {checkViewSidebar(
                            "CardDetail",
                            permissions,
                            account?.permissions
                          ) ? (
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

                          {checkViewSidebar(
                            "WalletTransaction",
                            permissions,
                            account?.permissions
                          ) ? (
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
                          <li className="tabItem ">
                            <NavLink
                              to="/subscription-management"
                              onClick={() => backToTop()}
                            >
                              <div className="itemTitle">Subscription</div>
                            </NavLink>
                          </li>
                          {checkViewSidebar(
                            "ChannelHangupComplete",
                            permissions,
                            account?.permissions
                          ) && (
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
                            )}
                        </ul>
                      </div>
                    </div>
                  </li>
                  <li className="">
                    <button
                      data-bs-toggle="collapse"
                      data-bs-target="#collapse5"
                      aria-expanded={
                        isChildActive([
                          "/mail-settings",
                          "/fax-settings",
                          "/call-recording-settings",
                          "/voice-music",
                          "/custom-module",
                        ])
                          ? "true"
                          : "false"
                      }
                      aria-controls="collapse5"
                    >
                      <div className="iconHolder">
                        <i className="fa-regular fa-sliders"></i>
                      </div>
                      <div className="itemTitle">Setting</div>
                    </button>
                    <div
                      id="collapse5"
                      className={`accordion-collapse collapse ${isChildActive([
                        "/mail-settings",
                        "/fax-settings",
                        "/call-recording-settings",
                        "/voice-music",
                        "/custom-module",
                        "/global-permission-config"
                      ])
                        ? "show"
                        : ""
                        }`}
                      data-bs-parent="#sidenNav"
                    >
                      <div className="menuWrapper">
                        <ul className="tabMenu">
                          {/* <li className="tabItem ">
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
                            </li> */}
                          {checkViewSidebar(
                            "Sound",
                            permissions,
                            account?.permissions
                          ) ? (
                            <li className="tabItem ">
                              <NavLink to="/voice-music">
                                <div className="itemTitle">Voice Music</div>
                              </NavLink>
                            </li>
                          ) : (
                            ""
                          )}
                          {/* <li className="tabItem">
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
                            </li> */}
                          {checkViewSidebar(
                            "MailSetting",
                            permissions,
                            account?.permissions
                          ) ? (
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
                          {
                            checkViewSidebar("Usage", permissions, account?.permissions) &&
                            <li className="tabItem ">
                              <NavLink
                                to="/custom-module"
                                onClick={() => backToTop()}
                              >
                                <div className="itemTitle">
                                  Custom Module Integration
                                </div>
                              </NavLink>
                            </li>
                          }
                          {
                            isCustomerAdmin &&
                            <li className="tabItem ">
                              <NavLink
                                to="/global-permission-config"
                                onClick={() => backToTop()}
                              >
                                <div className="itemTitle">
                                  Global Permissions
                                </div>
                              </NavLink>
                            </li>
                          }
                          {/* <li className="tabItem ">
                              <NavLink
                                to="/call-recording-settings"
                                onClick={() => backToTop()}
                                className={({ isActive }) =>
                                  isActive ||
                                    ["/call-recording-settings"].some((path) =>
                                      window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">Call Recording</div>
                              </NavLink>
                            </li> */}
                        </ul>
                      </div>
                    </div>
                  </li>
                  {isCustomerAdmin && (
                    <>
                      <li className="dashboard ">
                        <NavLink
                          to="/add-ons"
                          onClick={backToTop}
                          type="button"
                        // aria-expanded={
                        //   isChildActive(["/add-ons", "/store-extension"])
                        //     ? "true"
                        //     : "false"
                        // }
                        // aria-controls="collapse11"
                        >
                          <div className="iconHolder">
                            <i className="fa-regular fa-store"></i>
                          </div>
                          <div className="itemTitle">Store</div>
                        </NavLink>
                        {/* <div
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
                                        ["/hardwares", "/hardware-add"].some(
                                          (path) =>
                                            window.location.pathname.includes(
                                              path
                                            )
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
                        </div> */}
                      </li>
                      <li className="">
                        <button
                          data-bs-toggle="collapse"
                          data-bs-target="#collapse12"
                          aria-expanded={
                            isChildActive(["/knowledge-base", "/ticket", "/view-massage"])
                              ? "true"
                              : "false"
                          }
                          aria-controls="collapse12"
                        >
                          <div className="iconHolder">
                            <i className="fa-regular fa-circle-info"></i>
                          </div>
                          <div className="itemTitle">Support</div>
                        </button>
                        <div
                          id="collapse12"
                          className={`accordion-collapse collapse ${isChildActive(["/knowledge-base", "/ticket", "/view-massage"])
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
                                  <div className="itemTitle">
                                    Knowledge Base
                                  </div>
                                </NavLink>
                              </li>
                              <li className="tabItem ">
                    

                            <NavLink
                                  to="/ticket"
                                  onClick={() => backToTop()}
                                  className={({ isActive }) =>
                                    isActive ||
                                      ["/ticket"].some((path) =>
                                        window.location.pathname.includes(path)
                                      )
                                      ? "nav-link active"
                                      : "nav-link"
                                  }
                                >
                                  <div className="itemTitle">
                                  Submit a Ticket
                                  </div>
                                </NavLink>
             
                                  {/* // to="/ticket" */}

                              
 
                                {/* <Link
                                  
=======
                                <Link
                                  // to="/ticket"
>>>>>>> 58f23a9cba051b7df48f14373b604f6b4a334397
                                  onClick={() => featureUnderdevelopment()}
                                  className={({ isActive }) =>
                                    isActive ||
                                      [
                                        "/view-massage",
                                      ].some((path) =>
                                        window.location.pathname.includes(path)
                                      )
                                      ? "nav-link active"
                                      : "nav-link"
                                  }
                                >
                                  <div className="itemTitle">
                                    Submit a Ticket
                                  </div>
                                </Link> */}
                              </li>
                              <li className="tabItem ">
                                <NavLink
                                  to="/live-chat"
                                  onClick={() => backToTop()}
                                  className={({ isActive }) =>
                                    isActive ||
                                      ["/live-chat"].some((path) =>
                                        window.location.pathname.includes(path)
                                      )
                                      ? "nav-link active"
                                      : "nav-link"
                                  }
                                >
                                  <div className="itemTitle">
                                  Live chat support
                                  </div>
                                </NavLink>
                              </li>



                              {/* {account?.permissions?.includes(248) ||
                                account?.permissions?.includes(250) ? (
                                <li className="tabItem ">
                                  <NavLink
                                    to="/live-chat" 
                                    onClick={backToTop}
                                    type="button"
                                  >
                                    <div className="itemTitle">
                                      Live Chat Support
                                    </div>
                                  </NavLink>
                                </li>
                              ) : null} */}
                            </ul>
                          </div>
                        </div>
                      </li>
                    </>
                  )}
                  <li className="dashboard ">
                    <NavLink
                      to="/"
                      onClick={() =>
                        dispatch({ type: "SET_LOGOUT", logout: 1 })
                      }
                      type="button"
                    >
                      <div className="iconHolder">
                        <i className="fa-regular fa-power-off"></i>
                      </div>
                      <div className="itemTitle">Log Out</div>
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </section >
    </div >
  );
}

export default Navbar;
