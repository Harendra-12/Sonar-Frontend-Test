import React from "react";
import "../assets/css/style.css";
import { Link, useNavigate } from "react-router-dom";
import {
  backToTop,
  generalGetFunction,
} from "../GlobalFunction/globalFunction";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const account = useSelector((state) => state.account);
  const accountDetails = useSelector((state) => state.accountDetails);
  const tempAccount = useSelector((state) => state.tempAccount);
  const userType = account?.usertype; // "Company"
  const isCustomerAdmin = account?.email == accountDetails?.email || false;
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
                      effect="ripple"
                    >
                      <div className="itemTitle">Dashboard</div>
                    </NavLink>
                  </li>{" "}
                </>
              ) : (
                <>
                  <li className="dashboard">
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
                      effect="ripple"
                    >
                      <div className="itemTitle">Dashboard</div>
                    </NavLink>
                  </li>

                  <li className="">
                    <button
                      data-bs-toggle="collapse"
                      data-bs-target="#collapse8"
                      aria-expanded="false"
                      aria-controls="collapse5"
                      effect="ripple"
                    >
                      <div className="itemTitle">Account Details</div>
                    </button>
                    <div
                      id="collapse8"
                      className="accordion-collapse collapse"
                      data-bs-parent="#sidenNav"
                    >
                      <div className="menuWrapper">
                        <ul className="tabMenu">
                          <li className="tabItem" effect="ripple">
                            <NavLink
                              to="/my-profile"
                              onClick={backToTop}
                              className="nav-link"
                            >
                              <div className="iconHolder">
                                <i class="fa-duotone fa-user"></i>
                              </div>
                              <div className="itemTitle">My Profile</div>
                            </NavLink>
                          </li>

                          {/* <li className="tabItem" effect="ripple">
                            <NavLink
                              to="/customer-details"
                              onClick={backToTop}
                              className="nav-link"
                            >
                              <div className="iconHolder">
                                <i className="fa-duotone fa-swap-arrows" />
                              </div>
                              <div className="itemTitle">Details</div>
                            </NavLink>
                          </li> */}

                          <li className="tabItem" effect="ripple">
                            <NavLink
                              to="/change-password"
                              onClick={backToTop}
                              className="nav-link"
                            >
                              <div className="iconHolder">
                                <i class="fa-duotone fa-unlock"></i>
                              </div>
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
                      aria-expanded="false"
                      aria-controls="collapse5"
                      effect="ripple"
                    >
                      <div className="itemTitle">Setting</div>
                    </button>
                    <div
                      id="collapse5"
                      className="accordion-collapse collapse"
                      data-bs-parent="#sidenNav"
                    >
                      <div className="menuWrapper">
                        <ul className="tabMenu">
                          {userType === "SupreAdmin" ? (
                            <li className="tabItem" effect="ripple">
                              <NavLink
                                to="/master"
                                onClick={backToTop}
                                className="nav-link"
                              >
                                <div className="iconHolder">
                                  <i className="fa-duotone fa-swap-arrows" />
                                </div>
                                <div className="itemTitle">Master</div>
                              </NavLink>
                            </li>
                          ) : (
                            ""
                          )}

                          <li className="tabItem" effect="ripple">
                            <NavLink
                              to="/roles"
                              onClick={backToTop}
                              className="nav-link"
                            >
                              <div className="iconHolder">
                                <i class="fa-duotone fa-arrow-up-big-small"></i>
                              </div>
                              <div className="itemTitle">
                                Roles and Permisson
                              </div>
                            </NavLink>
                          </li>

                          <li className="tabItem" effect="ripple">
                            <NavLink
                              to="/roles1"
                              onClick={backToTop}
                              className="nav-link"
                            >
                              <div className="iconHolder">
                                <i class="fa-duotone fa-laptop-mobile"></i>
                              </div>
                              <div className="itemTitle">
                                Device Provisioning
                              </div>
                            </NavLink>
                          </li>
                          <li className="tabItem ">
                            <NavLink
                              to="/mail-settings"
                              onClick={backToTop}
                              type="button"
                              effect="ripple"
                            >
                              <div className="iconHolder">
                                <i class="fa-duotone fa-solid fa-envelopes-bulk"></i>
                              </div>
                              <div className="itemTitle">Mail Settings</div>
                            </NavLink>
                          </li>
                          {userType === "SupreAdmin" ? (
                            <li className="tabItem" effect="ripple">
                              <NavLink
                                to="/admin/package"
                                onClick={backToTop}
                                className="nav-link"
                              >
                                <div className="iconHolder">
                                  <i class="fa-duotone fa-cube"></i>
                                </div>
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
                      aria-expanded="false"
                      aria-controls="collapseOne"
                      effect="ripple"
                    >
                      {/* <div className="iconHolder"><i className="fa-duotone fa-users"></i></div> */}
                      <div className="itemTitle">Phone System</div>
                    </button>
                    <div
                      id="collapseOne"
                      className="accordion-collapse collapse"
                      data-bs-parent="#sidenNav"
                    >
                      <div className="menuWrapper">
                        <ul className="tabMenu">
                          <li className="tabItem " effect="ripple">
                            <NavLink to="/phone-dashboard">
                              <div className="iconHolder">
                                <i className="fa-duotone fa-duotone fa-list-dropdown"></i>
                              </div>
                              <div className="itemTitle">Phone Dashboard</div>
                            </NavLink>
                          </li>
                          <li className="tabItem " effect="ripple">
                            <NavLink to="/extensions">
                              <div className="iconHolder">
                                <i className="fa-duotone fa-phone-office" />
                              </div>
                              <div className="itemTitle">Extensions</div>
                            </NavLink>
                          </li>

                          <li className="tabItem " effect="ripple">
                            <NavLink to="/voice-music">
                              <div className="iconHolder">
                                <i class="fa-duotone fa-user-music"></i>
                              </div>
                              <div className="itemTitle">Voice Music</div>
                            </NavLink>
                          </li>
                          {/* <li className="tabItem " effect="ripple">
                            <NavLink to="/active-calls">
                              <div className="iconHolder">
                                <i class="fa-duotone fa-phone-volume"></i>
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
                      effect="ripple"
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
                          <li className="tabItem" effect="ripple">
                            <NavLink to="/destination" className="nav-link">
                              <div className="iconHolder">
                                <i className="fa-duotone fa-swap-arrows" />
                              </div>
                              <div className="itemTitle">Destinations</div>
                            </NavLink>
                          </li>

                          <li className="tabItem" effect="ripple">
                            <NavLink to="/destinations" className="nav-link">
                              <div className="iconHolder">
                                <i className="fa-duotone fa-swap-arrows" />
                              </div>
                              <div className="itemTitle">Routes</div>
                            </NavLink>
                          </li>
                          
                        </ul>
                      </div>
                    </div>
                  </li> */}
                  {/* <li className="tabItem" effect="ripple">
                        <a
                          href=""
                          className="nav-link"
                        >
                          <div className="iconHolder">
                            <i className="fa-sharp fa-duotone fa-group-arrows-rotate" />
                          </div>
                          <div className="itemTitle">Dialplan Manager</div>
                        </a>
                      </li> */}
                  {/* <li className="tabItem" effect="ripple">
                        <a
                          href=""
                          className="nav-link"
                        >
                          <div className="iconHolder">
                            <i className="fa-sharp fa-duotone fa-phone-volume" />
                          </div>
                          <div className="itemTitle">Inbound Routes</div>
                        </a>
                      </li> */}
                  {/* <li className="tabItem" effect="ripple">
                        <a
                          href=""
                          className="nav-link"
                        >
                          <div className="iconHolder">
                            <i className="fa-duotone fa-phone-arrow-up-right" />
                          </div>
                          <div className="itemTitle">Outbound Routes</div>
                        </a>
                      </li> */}
                  <li className="">
                    <button
                      data-bs-toggle="collapse"
                      data-bs-target="#collapse4"
                      aria-expanded="false"
                      aria-controls="collapse4"
                      effect="ripple"
                    >
                      <div className="itemTitle">Reports</div>
                    </button>
                    <div
                      id="collapse4"
                      className="accordion-collapse collapse"
                      data-bs-parent="#sidenNav"
                    >
                      <div className="menuWrapper">
                        <ul className="tabMenu">
                          {/* <li className="tabItem" effect="ripple">
                        <NavLink
                          to="/call"
                          onClick={backToTop}
                          className="nav-link"
                        >
                          <div className="iconHolder">
                            <i className="fa-duotone fa-swap-arrows" />
                          </div>
                          <div className="itemTitle">Call</div>
                        </NavLink>
                      </li> */}
                          <li className="tabItem" effect="ripple">
                            <NavLink
                              to="/cdr-report"
                              onClick={backToTop}
                              className="nav-link"
                            >
                              <div className="iconHolder">
                                <i class="fa-duotone fa-chart-bar"></i>
                              </div>
                              <div className="itemTitle">CDR Report</div>
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>

                  <li className="">
                    <button
                      data-bs-toggle="collapse"
                      data-bs-target="#collapse10"
                      aria-expanded="false"
                      aria-controls="collapse10"
                      effect="ripple"
                    >
                      <div className="itemTitle">Number Management</div>
                    </button>
                    <div
                      id="collapse10"
                      className="accordion-collapse collapse"
                      data-bs-parent="#sidenNav"
                    >
                      <div className="menuWrapper">
                        <ul className="tabMenu">
                          <li className="tabItem" effect="ripple">
                            <NavLink
                              to="/get-did"
                              onClick={backToTop}
                              className="nav-link"
                            >
                              <div className="iconHolder">
                                <i className="fa-duotone fa-swap-arrows" />
                              </div>
                              <div className="itemTitle">Get DID</div>
                            </NavLink>
                          </li>
                          <li className="tabItem" effect="ripple">
                            <NavLink
                              to="/did-listing"
                              onClick={backToTop}
                              className="nav-link"
                            >
                              <div className="iconHolder">
                                <i class="fa-duotone fa-hashtag"></i>
                              </div>
                              <div className="itemTitle">DID Listing</div>
                            </NavLink>
                          </li>
                          <li className="tabItem" effect="ripple">
                            <NavLink
                              to="/port-number"
                              onClick={backToTop}
                              className="nav-link"
                            >
                              <div className="iconHolder">
                                <i class="fa-duotone fa-hashtag-lock"></i>
                              </div>
                              <div className="itemTitle">Port number</div>
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>

                  <li className="">
                    <button
                      data-bs-toggle="collapse"
                      data-bs-target="#collapse9"
                      aria-expanded="false"
                      aria-controls="collapse9"
                      effect="ripple"
                    >
                      <div className="itemTitle">Billing</div>
                    </button>
                    <div
                      id="collapse9"
                      className="accordion-collapse collapse"
                      data-bs-parent="#sidenNav"
                    >
                      <div className="menuWrapper">
                        <ul className="tabMenu">
                          <li className="tabItem" effect="ripple">
                            <NavLink
                              to="/card-details"
                              onClick={backToTop}
                              className="nav-link"
                            >
                              <div className="iconHolder">
                                <i class="fa-duotone fa-money-check-dollar-pen"></i>
                              </div>
                              <div className="itemTitle">Payment Details</div>
                            </NavLink>
                          </li>
                          {/* <li className="tabItem" effect="ripple">
                            <NavLink
                              to="/invoice-list"
                              onClick={backToTop}
                              className="nav-link"
                            >
                              <div className="iconHolder">
                                <i className="fa-duotone fa-swap-arrows" />
                              </div>
                              <div className="itemTitle">Invoice Details</div>
                            </NavLink>
                          </li> */}
                          {/* <li className="tabItem" effect="ripple">
                            <NavLink
                              to="/expense-list"
                              onClick={backToTop}
                              className="nav-link"
                            >
                              <div className="iconHolder">
                                <i className="fa-duotone fa-swap-arrows" />
                              </div>
                              <div className="itemTitle">Expenses</div>
                            </NavLink>
                          </li> */}
                          <li className="tabItem" effect="ripple">
                            <NavLink
                              to="/card-transaction-list"
                              onClick={backToTop}
                              className="nav-link"
                            >
                              <div className="iconHolder">
                                <i class="fa-duotone fa-credit-card"></i>
                              </div>
                              <div className="itemTitle">Card Transactions</div>
                            </NavLink>
                          </li>
                          <li className="tabItem" effect="ripple">
                            <NavLink
                              to="/wallet-transaction-list"
                              onClick={backToTop}
                              className="nav-link"
                            >
                              <div className="iconHolder">
                                <i class="fa-duotone fa-wallet"></i>
                              </div>
                              <div className="itemTitle">
                                Wallet Transactions
                              </div>
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>

                  <li className="dashboard ">
                    <NavLink
                      to="/ring-groups"
                      onClick={backToTop}
                      type="button"
                      effect="ripple"
                    >
                      <div className="itemTitle">Ring Group</div>
                    </NavLink>
                  </li>
                  <li className="dashboard ">
                    <NavLink
                      to="/users"
                      onClick={backToTop}
                      type="button"
                      effect="ripple"
                    >
                      <div className="itemTitle">Users</div>
                    </NavLink>
                  </li>
                  <li className="dashboard ">
                    <NavLink
                      to="/cal-center-queue"
                      onClick={backToTop}
                      type="button"
                      effect="ripple"
                    >
                      <div className="itemTitle">Call Center</div>
                    </NavLink>
                  </li>
                  {/* <li className="dashboard ">
                    <NavLink
                      to="/variable"
                      onClick={backToTop}
                      type="button"
                      effect="ripple"
                    >
                      <div className="itemTitle">Variable</div>
                    </NavLink>
                  </li> */}
                  <li className="dashboard ">
                    <NavLink
                      to="/ivr"
                      onClick={backToTop}
                      type="button"
                      effect="ripple"
                    >
                      <div className="itemTitle">IVR</div>
                    </NavLink>
                  </li>
                  {account?.extension || isCustomerAdmin ? (
                    <li className="dashboard ">
                      <a
                        href="/webrtc"
                        target="_blank"
                        // onClick={backToTop}
                        type="button"
                        effect="ripple"
                      >
                        <div className="itemTitle">WebRtc</div>
                      </a>
                    </li>
                  ) : (
                    ""
                  )}
                  <li className="dashboard ">
                    <NavLink
                      to="/"
                      onClick={logOut}
                      type="button"
                      effect="ripple"
                    >
                      <div
                        className="iconHolder"
                        style={{ margin: "0 0", textAlign: "left", width: 30 }}
                      >
                        <i className="fa-duotone fa-power-off text-danger"></i>
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
