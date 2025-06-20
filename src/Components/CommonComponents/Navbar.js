/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect } from "react";
import "../assets/css/style.css";
import { Link, useLocation } from "react-router-dom";
import {
  backToTop,
  checkModulePerm,
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
  const isCustomerAdmin =
    account?.email == accountDetails?.email ||
    account?.user_role?.roles?.name === "Super Admin";
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
  }, []);

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

                  {checkModulePerm(
                    "Accounts",
                    permissions,
                    account?.sections,
                  ) &&
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
                            "/groups",
                            "/groups-add",
                            "/groups-edit",
                            "/access-control-list",
                            "/access-control-list-add",
                            "/access-control-list-edit"
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
                          "/groups",
                          "/groups-add",
                          "/groups-edit",
                          "/access-control-list",
                          "/access-control-list-add",
                          "/access-control-list-edit"
                        ])
                          ? "show"
                          : ""
                          }`}
                        data-bs-parent="#sidenNav"
                      >
                        <div className="menuWrapper">
                          <ul className="tabMenu">
                            <li className="tabItem">
                              <NavLink
                                to="/users-profile"
                                onClick={backToTop}
                                className="nav-link"
                              >
                                {/* <div className="iconHolder">
                                  <i className="fa-regular fa-user"></i>
                                </div> */}
                                <div className="itemTitle">My Profile</div>
                              </NavLink>
                            </li>
                            {checkViewSidebar(
                              ["Accounts", "User"],
                              permissions,
                              account?.sectionPermissions,
                              account?.permissions,
                            ) ? (
                              <li className="tabItem ">
                                <NavLink
                                  to="/users"
                                  // onClick={backToTop}
                                  type="button"
                                  className={({ isActive }) =>
                                    isActive ||
                                      [
                                        "/users-add",
                                        "/users-edit",
                                        "/users-config",
                                      ].some((path) =>
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
                              ["Accounts", "Extension"],
                              permissions,
                              account?.sectionPermissions,
                              account?.permissions,
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
                              ["Accounts", "Role"],
                              permissions,
                              account?.sectionPermissions,
                              account?.permissions,
                            ) ? (
                              <li className="tabItem">
                                <NavLink
                                  to="/roles"
                                  onClick={backToTop}
                                  className="nav-link"
                                >
                                  <div className="itemTitle">
                                    Roles and Permission
                                  </div>
                                </NavLink>
                              </li>
                            ) : null}
                            {accountDetails?.add_on_subscription?.find(
                              (item) => item?.addon_id == 7
                            ) ?
                              (checkViewSidebar(
                                ["Accounts", "AccessControl"],
                                permissions,
                                account?.sectionPermissions,
                                account?.permissions,
                              ) || checkViewSidebar(
                                ["Accounts", "AccessControlNode"],
                                permissions,
                                account?.sectionPermissions,
                                account?.permissions,
                              )) ? (
                                <li className="tabItem">
                                  <NavLink
                                    to="/access-control-list"
                                    onClick={backToTop}
                                    className={({ isActive }) =>
                                      isActive ||
                                        [
                                          "/access-control-list",
                                          "/access-control-list-add",
                                        ].some((path) =>
                                          window.location.pathname.includes(path)
                                        )
                                        ? "nav-link active"
                                        : "nav-link"
                                    }
                                  >
                                    <div className="itemTitle">Access Control</div>
                                  </NavLink>
                                </li>
                              ) : (
                                <></>
                              ) : ""
                            }
                            {checkViewSidebar(
                              ["Accounts", "Group"],
                              permissions,
                              account?.sectionPermissions,
                              account?.permissions,
                            ) ? (
                              <li className="tabItem ">
                                <NavLink
                                  to="/groups"
                                  onClick={backToTop}
                                  className={({ isActive }) =>
                                    isActive ||
                                      [
                                        "/groups",
                                        "/groups-add",
                                        "/groups-edit",
                                      ].some((path) =>
                                        window.location.pathname.includes(path)
                                      )
                                      ? "nav-link active"
                                      : "nav-link"
                                  }
                                >
                                  <div className="itemTitle">Groups</div>
                                </NavLink>
                              </li>
                            ) : (
                              ""
                            )}

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
                  }

                  {checkModulePerm(
                    "Number Management",
                    permissions,
                    account?.sections,
                  ) &&
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
                            "/management-get-did",
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
                          "/management-get-did",
                        ])
                          ? "show"
                          : ""
                          }`}
                        data-bs-parent="#sidenNav"
                      >
                        <div className="menuWrapper">
                          <ul className="tabMenu">
                            {checkViewSidebar(
                              ["Number Management", "DidDetail"],
                              permissions,
                              account?.sectionPermissions,
                              account?.permissions,
                            ) && (
                                <li className="tabItem">
                                  <NavLink
                                    to="/management-get-did"
                                    onClick={backToTop}
                                    className="nav-link"
                                  >
                                    <div className="itemTitle">Get DID</div>
                                  </NavLink>
                                </li>
                              )}
                            {checkViewSidebar(
                              ["Number Management", "Port"],
                              permissions,
                              account?.sectionPermissions,
                              account?.permissions,
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
                              ["Number Management", "DidConfigure"],
                              permissions,
                              account?.sectionPermissions,
                              account?.permissions,
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
                  }

                  {checkModulePerm(
                    "PBX",
                    permissions,
                    account?.sections,
                  ) &&
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
                            "/custom-dashboard"
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
                          "/custom-dashboard"
                        ])
                          ? "show"
                          : ""
                          }`}
                        data-bs-parent="#sidenNav"
                      >
                        <div className="menuWrapper">
                          <ul className="tabMenu">
                            {checkViewSidebar(
                              ["PBX", "phoneDashboard"],
                              permissions,
                              account?.sectionPermissions,
                              account?.permissions,
                            ) && (
                                <li className="tabItem ">
                                  <NavLink to="/phone-dashboard">
                                    <div className="itemTitle">Call Dashboard</div>
                                  </NavLink>
                                </li>
                              )}
                            {checkViewSidebar(
                              ["PBX", "ActiveCall"],
                              permissions,
                              account?.sectionPermissions,
                              account?.permissions,
                            ) && (
                                <li className="tabItem ">
                                  <NavLink to="/active-calls" onClick={backToTop}>
                                    <div className="itemTitle">Active Calls</div>
                                  </NavLink>
                                </li>
                              )}
                            {checkViewSidebar(
                              ["PBX", "CustomDashboard"],
                              permissions,
                              account?.sectionPermissions,
                              account?.permissions,
                            ) && (
                                <li className="tabItem ">
                                  <NavLink to="/custom-dashboard" onClick={backToTop}>
                                    <div className="itemTitle">Custom Dashboard</div>
                                  </NavLink>
                                </li>
                              )}
                            {checkViewSidebar(
                              ["PBX", "DidConfigure"],
                              permissions,
                              account?.sectionPermissions,
                              account?.permissions,
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
                            {/* <li className="tabItem ">
                            <NavLink to="/agent-dashboard">
                              <div className="itemTitle">Agent Dashboard</div>
                            </NavLink>
                          </li> */}
                            {checkViewSidebar(
                              ["PBX", "User"],
                              permissions,
                              account?.sectionPermissions,
                              account?.permissions,
                            ) && (
                                <li className="tabItem ">
                                  <NavLink
                                    to="/agents"
                                    onClick={() => backToTop()}
                                    className={({ isActive }) =>
                                      isActive ||
                                        [
                                          "/agents-add",
                                          "/agents-edit",
                                          "/agents-pbx-add",
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
                              )}
                            {checkViewSidebar(
                              ["PBX", "Ringgroup"],
                              permissions,
                              account?.sectionPermissions,
                              account?.permissions,
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
                            {checkViewSidebar(
                              ["PBX", "CallCenterQueue"],
                              permissions,
                              account?.sectionPermissions,
                              account?.permissions,
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
                              ["PBX", "Spam"],
                              permissions,
                              account?.sectionPermissions,
                              account?.permissions,
                            ) && (
                                <li className="tabItem ">
                                  <NavLink
                                    to="/call-blocking"
                                    className={({ isActive }) =>
                                      isActive ||
                                        ["/call-blocking", "/call-blocking-add"].some(
                                          (path) =>
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
                              ["PBX", "VoicemailRecording"],
                              permissions,
                              account?.sectionPermissions,
                              account?.permissions,
                            ) && (
                                <li className="tabItem ">
                                  <NavLink to="/voicemail-report">
                                    <div className="itemTitle">Voice Mail</div>
                                  </NavLink>
                                </li>
                              )}
                          </ul>
                        </div>
                      </div>
                    </li>
                  }

                  {checkModulePerm(
                    "Dialer",
                    permissions,
                    account?.sections,
                  ) &&
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
                            "/lead-view",
                            "/campaigns",
                            "/agents-dialer",
                            "/call-desposition",
                            "/agent-disposition-manage",
                            "/dialer-cdr-report",
                            "/campaign-create",
                            "/campaign-edit",
                            "/did-listing-dialer"
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
                          "/lead-view",
                          "/campaigns",
                          "/agents-dialer",
                          "/call-desposition",
                          "/agent-disposition-manage",
                          "/dialer-cdr-report",
                          "/campaign-create",
                          "/campaign-edit",
                          "/did-listing-dialer"
                        ])
                          ? "show"
                          : ""
                          }`}
                        data-bs-parent="#sidenNav"
                      >
                        <div className="menuWrapper">
                          <ul className="tabMenu">
                            {checkViewSidebar(
                              ["Dialer", "Dashboard"],
                              permissions,
                              account?.sectionPermissions,
                              account?.permissions,
                            ) &&
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
                            }
                            {checkViewSidebar(
                              ["Dialer", "Campaign"],
                              permissions,
                              account?.sectionPermissions,
                              account?.permissions,
                            ) &&
                              <li className="tabItem ">
                                <NavLink
                                  to="/campaigns"
                                  onClick={() => backToTop()}
                                  className={({ isActive }) =>
                                    isActive ||
                                      [
                                        "/campaign-edit",
                                        "/campaign-create",
                                      ].some((path) =>
                                        window.location.pathname.includes(path)
                                      )
                                      ? "nav-link active"
                                      : "nav-link"
                                  }
                                >
                                  <div className="itemTitle">Campaign</div>
                                </NavLink>
                              </li>
                            }
                            {checkViewSidebar(
                              ["Dialer", "Lead"],
                              permissions,
                              account?.sectionPermissions,
                              account?.permissions,
                            ) &&
                              <li className="tabItem ">
                                <NavLink
                                  to="/leads"
                                  onClick={() => backToTop()}
                                  className={({ isActive }) =>
                                    isActive ||
                                      ["/lead-add", "/lead-edit", "/lead-view"].some((path) =>
                                        window.location.pathname.includes(path)
                                      )
                                      ? "nav-link active"
                                      : "nav-link"
                                  }
                                >
                                  <div className="itemTitle">Leads</div>
                                </NavLink>
                              </li>
                            }
                            {checkViewSidebar(
                              ["Dialer", "User"],
                              permissions,
                              account?.sectionPermissions,
                              account?.permissions,
                            ) &&
                              <li className="tabItem ">
                                <NavLink
                                  to="/agents-dialer"
                                  className={({ isActive }) =>
                                    isActive ||
                                      [
                                        "/agents-dialer",
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
                            }
                            {checkViewSidebar(
                              ["Dialer", "Campaign"],
                              permissions,
                              account?.sectionPermissions,
                              account?.permissions,
                            ) &&
                              <li className="tabItem ">
                                <NavLink
                                  to="/dialer-cdr-report"
                                  onClick={() => backToTop()}
                                >
                                  <div className="itemTitle">CDR Report</div>
                                </NavLink>
                              </li>
                            }
                            {checkViewSidebar(
                              ["Dialer", "Disposition"],
                              permissions,
                              account?.sectionPermissions,
                              account?.permissions,
                            ) &&
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
                                  <div className="itemTitle">Disposition</div>
                                </NavLink>
                              </li>
                            }
                            {checkViewSidebar(
                              ["Dialer", "DidDetail"],
                              permissions,
                              account?.sectionPermissions,
                              account?.permissions,
                            ) && <li className="tabItem ">
                                <NavLink
                                  to="/did-listing-dialer"
                                  onClick={() => backToTop()}
                                  className={({ isActive }) =>
                                    isActive ||
                                      ["/did-listing-dialer"].some((path) =>
                                        window.location.pathname.includes(path)
                                      )
                                      ? "nav-link active"
                                      : "nav-link"
                                  }
                                >
                                  <div className="itemTitle">Number Configuration</div>
                                </NavLink>
                              </li>
                            }
                            {/* <li className="tabItem ">
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
                              </li> */}
                          </ul>
                        </div>
                      </div>
                    </li>
                  }
                  {isCustomerAdmin &&
                    <li className="">
                      <button
                        data-bs-toggle="collapse"
                        data-bs-target="#collapse7"
                        aria-expanded={
                          isChildActive([
                            "/tracker-dashboard",
                            "/tracker-active-calls",
                            "/did-listing-tracker",
                            "/buyers",
                            "/source",
                            "/buyer-add",
                            "/buyer-edit",
                            "/elastic-trunk",
                            "/elastic-trunk-add",
                            "/elastic-trunk-edit",
                            "/call-forwarding-campaign",
                            "/call-forwarding-campaign-create",
                            "/call-forwarding-campaign-edit",
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
                          "/tracker-active-calls",
                          "/did-listing-tracker",
                          "/buyers",
                          "/source",
                          "/buyer-add",
                          "/buyer-edit",
                          "/elastic-trunk",
                          "/elastic-trunk-add",
                          "/elastic-trunk-edit",
                          "/call-forwarding-campaign",
                          "/call-forwarding-campaign-create",
                          "/call-forwarding-campaign-edit",
                          "/cdr-tracker",
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
                                to="/tracker-active-calls"
                                onClick={backToTop}
                              >
                                <div className="itemTitle">Active Calls</div>
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
                              <NavLink
                                to="/call-forwarding-campaign"
                                onClick={() => backToTop()}
                                className={({ isActive }) =>
                                  isActive ||
                                    [
                                      "/call-forwarding-campaign-create",
                                      "/call-forwarding-campaign-edit",
                                    ].some((path) =>
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
                                to="/buyers"
                                onClick={() => backToTop()}
                                className={({ isActive }) =>
                                  isActive ||
                                    ["/buyer-edit", "/buyer-add"].some((path) =>
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
                              <NavLink
                                to="/source"
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
                                <div className="itemTitle">Source</div>
                              </NavLink>
                            </li>
                            <li className="tabItem ">
                              <NavLink
                                to="/cdr-tracker"
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
                                <div className="itemTitle">CDR Tracker</div>
                              </NavLink>
                            </li>
                            <li className="tabItem ">
                              <NavLink
                                to="/elastic-trunk"
                                onClick={() => backToTop()}
                                className={({ isActive }) =>
                                  isActive ||
                                    [
                                      "/elastic-trunk-add",
                                      "/elastic-trunk-edit",
                                    ].some((path) =>
                                      window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">Elastic trunk</div>
                              </NavLink>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                  }
                  {/* {isCustomerAdmin &&
                        <li className="dashboard ">
                          <NavLink
                            to="/all-addons"
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
                              <i className="fa-regular fa-box-open"></i>
                            </div>
                            <div className="itemTitle">
                              Third Party Integration
                            </div>
                          </NavLink>
                        </li>
                      } */}

                  {checkModulePerm(
                    "Interactive Voice Response",
                    permissions,
                    account?.sections,
                  ) &&
                    <li className="dashboard ">
                      <NavLink
                        to="/ivr"
                        onClick={backToTop}
                        type="button"
                        className={({ isActive }) =>
                          isActive ||
                            ["/ivr-add", "/ivr-edit", "/ivr-options"].some((path) =>
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
                  }
                  {isCustomerAdmin && (
                    <li className="">
                      <button
                        data-bs-toggle="collapse"
                        data-bs-target="#collapse14"
                        aria-expanded={
                          isChildActive([
                            "/all-ai-agent",
                            "/ai-dashboard",
                            "/ai-all-agent",
                            "/all-users",
                            "/ai-knowledge-base",
                            '  /ai-phone-number',
                            "/ai-call-history",
                            "/ai-billing",
                            "/ai-batch-call",
                            "/ai-agent-add",
                            "/ai-agent-edit",
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
                          "/ai-agent-dashboard",
                          "/all-ai-agent",
                          "/ai-all-agent",
                          "/all-users",
                          "/ai-knowledge-base",
                          '/ai-phone-number',
                          '/ai-call-history',
                          '/ai-billing',
                          "/ai-batch-call",
                          "/ai-agent-add",
                          "/ai-agent-edit",
                        ])
                          ? "show"
                          : ""
                          }`}
                        data-bs-parent="#sidenNav"
                      >
                        <div className="menuWrapper">
                          <ul className="tabMenu">
                            {/* <li className="tabItem ">
                              <NavLink
                                to="/ai-agent-dashboard"
                                onClick={() => backToTop()}
                                className={({ isActive }) =>
                                  isActive ||
                                    [
                                      "/ai-agent-dashboard",

                                    ].some((path) =>
                                      window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">Ai Dashboard</div>
                              </NavLink>

                            </li> */}

                            <li className="tabItem ">
                              <NavLink
                                to="/ai-all-agent"
                                onClick={() => backToTop()}
                                className={({ isActive }) =>
                                  isActive ||
                                    [
                                      "/ai-all-agent",

                                    ].some((path) =>
                                      window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">All Agents</div>
                              </NavLink>
                            </li>
                            {/* <li className="tabItem ">
                              <NavLink
                                to="/all-users"
                                onClick={() => backToTop()}
                                className={({ isActive }) =>
                                  isActive ||
                                    [
                                      "/all-users",

                                    ].some((path) =>
                                      window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">All Users</div>
                              </NavLink>
                            </li> */}
                            <li className="tabItem ">
                              <NavLink
                                to="/ai-knowledge-base"
                                onClick={() => backToTop()}
                                className={({ isActive }) =>
                                  isActive ||
                                    [
                                      "/ai-knowledge-base",

                                    ].some((path) =>
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
                              <NavLink
                                to="/ai-phone-number"
                                onClick={() => backToTop()}
                                className={({ isActive }) =>
                                  isActive ||
                                    [
                                      "/ai-phone-number",

                                    ].some((path) =>
                                      window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">  Phone Number</div>
                              </NavLink>
                            </li>
                            <li className="tabItem ">
                              <NavLink
                                to="/ai-call-history"
                                onClick={() => backToTop()}
                                className={({ isActive }) =>
                                  isActive ||
                                    [
                                      "/ai-call-history",

                                    ].some((path) =>
                                      window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">  Call History</div>
                              </NavLink>
                            </li>
                            {/* <li className="tabItem ">
                              <NavLink
                                to="/ai-billing"
                                onClick={() => backToTop()}
                                className={({ isActive }) =>
                                  isActive ||
                                    [
                                      "/ai-billing",

                                    ].some((path) =>
                                      window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle">  Billing</div>
                              </NavLink>
                            </li>
                            <li className="tabItem ">
                              <NavLink
                                to="/ai-batch-call"
                                onClick={() => backToTop()}
                                className={({ isActive }) =>
                                  isActive ||
                                    [
                                      "/ai-batch-call",

                                    ].some((path) =>
                                      window.location.pathname.includes(path)
                                    )
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                <div className="itemTitle"> Batch Call</div>
                              </NavLink>
                            </li> */}
                          </ul>
                        </div>
                      </div>
                    </li>
                  )}

                  {checkModulePerm(
                    "Meeting Rooms",
                    permissions,
                    account?.sections,
                  ) &&
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
                  }

                  {accountDetails?.add_on_subscription?.find(
                    (item) => item?.addon_id == 2
                  ) ?
                    checkModulePerm(
                      "Click To Call",
                      permissions,
                      account?.sections,
                    ) &&
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
                    : ""}

                  <li className="">
                    <button
                      data-bs-toggle="collapse"
                      data-bs-target="#collapse21"
                      aria-expanded={
                        isChildActive([
                          "/ai-dashboard",
                          "/ai-search-cdr"
                        ])
                          ? "true"
                          : "false"
                      }
                      aria-controls="collapse21"
                    >
                      <div className="iconHolder">
                        <i className="fa-regular fa-user-robot"></i>
                      </div>
                      <div className="itemTitle">AI Dashboard</div>
                    </button>
                    <div
                      id="collapse21"
                      className={`accordion-collapse collapse ${isChildActive([
                        "/ai-dashboard",
                        "/ai-search-cdr"
                      ])
                        ? "show"
                        : ""
                        }`}
                      data-bs-parent="#sidenNav"
                    >
                      <div className="menuWrapper">
                        <ul className="tabMenu">
                          <li className="tabItem">
                            <NavLink
                              to="/ai-dashboard"
                              onClick={backToTop}
                              className="nav-link"
                            >
                              <div className="itemTitle">Dashboard</div>
                            </NavLink>
                          </li>
                          <li className="tabItem">
                            <NavLink
                              to="/ai-search-cdr"
                              onClick={backToTop}
                              className="nav-link"
                            >
                              <div className="itemTitle">Search CDR</div>
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>

                  {checkModulePerm(
                    "Reports",
                    permissions,
                    account?.sections,
                  ) &&
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
                              ["Reports", "ChannelHangupComplete"],
                              permissions,
                              account?.sectionPermissions,
                              account?.permissions,
                            ) &&
                              <li className="tabItem">
                                <NavLink
                                  to="/cdr-report"
                                  onClick={backToTop}
                                  className="nav-link"
                                >
                                  <div className="itemTitle">CDR / CQR</div>
                                </NavLink>
                              </li>
                            }
                            {checkViewSidebar(
                              ["Reports", "VoicemailRecording"],
                              permissions,
                              account?.sectionPermissions,
                              account?.permissions,
                            ) &&
                              <li className="tabItem">
                                <NavLink
                                  to="/call-recording"
                                  onClick={backToTop}
                                  className="nav-link"
                                >
                                  <div className="itemTitle">Call Recording</div>
                                </NavLink>
                              </li>
                            }
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
                            {checkViewSidebar(
                              ["Reports", "CallCenterQueue"],
                              permissions,
                              account?.sectionPermissions,
                              account?.permissions,
                            ) &&
                              <li className="tabItem ">
                                <NavLink
                                  to="/call-center-report"
                                  className={({ isActive }) =>
                                    isActive ||
                                      ["/call-center-report"].some((path) =>
                                        window.location.pathname.includes(path)
                                      )
                                      ? "nav-link active"
                                      : "nav-link"
                                  }
                                >
                                  <div className="itemTitle">Call Queues</div>
                                </NavLink>
                              </li>
                            }
                            {checkViewSidebar(
                              ["Reports", "Ringgroup"],
                              permissions,
                              account?.sectionPermissions,
                              account?.permissions,
                            ) &&
                              <li className="tabItem ">
                                <NavLink
                                  to="/ring-group-report"
                                  className={({ isActive }) =>
                                    isActive ||
                                      ["/ring-group-report"].some((path) =>
                                        window.location.pathname.includes(path)
                                      )
                                      ? "nav-link active"
                                      : "nav-link"
                                  }
                                >
                                  <div className="itemTitle">Ring Groups</div>
                                </NavLink>
                              </li>
                            }
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
                  }

                  {checkModulePerm(
                    "Billings",
                    permissions,
                    account?.sections,
                  ) &&
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
                            "/subscription-management",
                            "/rate-card",
                            "/billing-card-and-wallet",
                            "/billing-dashboard",
                            "/package-details",
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
                          "/subscription-management",
                          "/rate-card",
                          "/billing-card-and-wallet",
                          "/billing-dashboard",
                          "/package-details",
                        ])
                          ? "show"
                          : ""
                          }`}
                        data-bs-parent="#sidenNav"
                      >
                        <div className="menuWrapper">
                          <ul className="tabMenu">
                            {checkViewSidebar(
                              ["Billings", "CardDetail"],
                              permissions,
                              account?.sectionPermissions,
                              account?.permissions,
                            ) &&
                              checkViewSidebar(
                                ["Billings", "BillingAddress"],
                                permissions,
                                account?.sectionPermissions,
                                account?.permissions,
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
                            {/* {checkViewSidebar(
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
                          ) : null} */}

                            {checkViewSidebar(
                              ["Billings", "Ratecard"],
                              permissions,
                              account?.sectionPermissions,
                              account?.permissions,
                            ) &&
                              <li className="tabItem ">
                                <NavLink
                                  to="/rate-card"
                                  onClick={backToTop}
                                  type="button"
                                  className={({ isActive }) =>
                                    isActive ||
                                      ["/rate-card"].some((path) =>
                                        window.location.pathname.includes(path)
                                      )
                                      ? "nav-link active"
                                      : "nav-link"
                                  }
                                >
                                  <div className="itemTitle">Rate Card</div>
                                </NavLink>
                              </li>
                            }
                            {/* <li className="tabItem ">
                            <NavLink
                              to="/subscription-management"
                              onClick={() => backToTop()}
                            >
                              <div className="itemTitle">Subscription</div>
                            </NavLink>
                          </li> */}
                            {checkViewSidebar(
                              ["Billings", "WalletTransaction"],
                              permissions,
                              account?.sectionPermissions,
                              account?.permissions,
                            ) && checkViewSidebar(
                              ["Billings", "Payment"],
                              permissions,
                              account?.sectionPermissions,
                              account?.permissions,
                            )
                              ? (
                                <li className="tabItem">
                                  <NavLink
                                    to="/billing-card-and-wallet"
                                    onClick={backToTop}
                                    className="nav-link"
                                  >
                                    <div className="itemTitle">
                                      All Transactions
                                    </div>
                                  </NavLink>
                                </li>
                              ) : (
                                ""
                              )
                            }
                            {checkViewSidebar(
                              ["Billings", "ChannelHangupComplete"],
                              permissions,
                              account?.sectionPermissions,
                              account?.permissions,
                            ) &&
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

                            {checkViewSidebar(
                              ["Billings", "Dashboard"],
                              permissions,
                              account?.sectionPermissions,
                              account?.permissions,
                            ) &&
                              <li className="tabItem ">
                                <NavLink
                                  to="/billing-dashboard"
                                >
                                  <div className="itemTitle">Billing Dashboard</div>
                                </NavLink>
                              </li>
                            }
                            {checkViewSidebar(
                              ["Billings", "Package"],
                              permissions,
                              account?.sectionPermissions,
                              account?.permissions,
                            ) &&
                              <li className="tabItem">
                                <NavLink to="/package-details">
                                  <div className="itemTitle">Package Details</div>
                                </NavLink>
                              </li>
                            }
                          </ul>
                        </div>
                      </div>
                    </li>
                  }
                  {checkModulePerm(
                    "Settings",
                    permissions,
                    account?.sections,
                  ) &&
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
                            "/global-permission-config"
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
                          "/global-permission-config",
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
                              ["Settings", "Sound"],
                              permissions,
                              account?.sectionPermissions,
                              account?.permissions,
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
                              ["Settings", "MailSetting"],
                              permissions,
                              account?.sectionPermissions,
                              account?.permissions,
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
                            {checkViewSidebar(
                              ["Settings", "Usage"],
                              permissions,
                              account?.sectionPermissions,
                              account?.permissions,
                            ) && (
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
                              )}
                            {/* {isCustomerAdmin && (
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
                            )} */}
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
                  }
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
                            isChildActive([
                              "/knowledge-base",
                              "/ticket",
                              "/live-chat",
                              "/view-massage",
                              "/live-chat"
                            ])
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
                          className={`accordion-collapse collapse ${isChildActive([
                            "/knowledge-base",
                            "/ticket",
                            "/live-chat",
                            "/view-massage",
                            "/live-chat"
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
      </section>
    </div>
  );
}

export default Navbar;
