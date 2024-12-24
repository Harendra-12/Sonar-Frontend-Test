import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  generalGetFunction,
  generalPostFunction,
} from "../GlobalFunction/globalFunction";
import DarkModeToggle from "./DarkModeToggle";
import { toast } from "react-toastify";

function Header(props) {
  const dispatch = useDispatch();
  const account = useSelector((state) => state.account);
  // const accountDetails = useSelector((state) => state.accountDetails);
  const balance = useSelector((state) => state.balance);
  const [accounName, setAccountName] = useState();
  const [dropDown, setDropDown] = useState(false);
  const [popUp, setPopUp] = useState(false);
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [errorOldPassword, setErrorOldPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [errorNewPassword, setErrorNewPassword] = useState(false);
  const [confPassword, setConfPassword] = useState("");
  const [errorConfirm, setErrorConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const loadings = useSelector((state) => state.loading);

  async function handleSubmit() {
    if (oldPassword === "") {
      setErrorOldPassword(true);
    } else {
      setErrorOldPassword(false);
    }
    if (newPassword.length < 4) {
      setErrorNewPassword(true);
    } else {
      setErrorNewPassword(false);
    }
    if (confPassword !== newPassword) {
      setErrorConfirm(true);
    } else {
      setErrorConfirm(false);
    }

    if (
      oldPassword !== "" &&
      newPassword !== "" &&
      newPassword.length > 3 &&
      confPassword === newPassword
    ) {
      setLoading(true);
      const parsedData = {
        old_password: oldPassword,
        new_password: newPassword,
      };
      setPopUp(false);
      const apiData = await generalPostFunction("/change-password", parsedData);
      if (apiData?.status) {
        setLoading(false);
        setConfPassword("");
        setOldPassword("");
        setNewPassword("");
        toast.success(apiData.message);
      } else {
        setLoading(false);
      }
    }
  }
  useEffect(() => {
    if (account === null || account === "") {
      navigate("/");
    } else {
      setAccountName(account.name);
    }
  }, [account, navigate]);

  // Handle log out function
  async function logOut() {
    const apiData = await generalGetFunction("/logout");
    localStorage.clear();
    if (apiData?.data) {
      localStorage.clear();
      dispatch({
        type: "SET_ACCOUNT",
        account: null,
      });
      navigate("/");
    }
  }

  // Handel outside click from profile picture
  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setDropDown(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  return (
    <div id="detailsHeader" style={props.style}>
      <div className="col-4 d-flex align-items-center">
        <div className="d-xl-none d-block me-3">
          <button
            className="clearButton d-flex align-items-center"
            onClick={toggleSideNav}
          >
            <i className="fa-light fa-bars fs-5" />
          </button>
        </div>
        <h4 className="my-auto">{props.title}</h4>
      </div>
      <div className="col-8 d-flex justify-content-end align-items-center">
        <div className="col-auto">
          <div className="d-flex justify-content-end align-items-center">
            {/* <div className="my-auto mx-3">
            <button className="getApp" effect="ripple">
              Get Our App
            </button>
            </div> */}
            <div>
              <Tippy content="Your available balance, click to know more!">
                <div
                  onClick={() => navigate("/card-details")}
                  style={{ cursor: "pointer" }}
                  className="clearColorButton"
                >
                  <i className="fa-regular fa-wallet" />{" "}
                  <span className="d-none d-xl-inline-block">
                    ${balance.balance || 0}
                  </span>
                </div>
              </Tippy>
            </div>
          </div>
        </div>
        <DarkModeToggle marginLeft={"3"} />
        <div className="col-auto col-xl-auto d-flex justify-content-end align-items-center">
          <Tippy content={accounName}>
            <div className="profileName">{accounName}</div>
          </Tippy>
          &nbsp; &nbsp;
          {/* <div className="statusProfile" /> */}
          <div
            ref={wrapperRef}
            className="profileHolder"
            onClick={() => setDropDown(!dropDown)}
          >
            <img
              src="https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg"
              alt="profile"
            />
            {/* <span onclick="togglePhoneSidenav()"><i className="fa-light fa-xmark fs-4" style="display: none"></i></span> */}
          </div>
        </div>
        {dropDown ? (
          <div ref={wrapperRef} className="profileDropdown">
            {/* <div onClick={() => navigate("/my-profile")}>
              <label className="me-2">
                <i className="fa-duotone fa-user"></i>
              </label>
              <Link to="/my-profile">My Profile</Link>
            </div> */}
            {/* <div onClick={() => navigate("/change-password")}>
              <label className="me-2">
                <i className="fa-duotone fa-lock"></i>
              </label>
              <Link to={"/change-password"}>Change Password</Link>
            </div> */}
            <div className="dropdown-item">
              {/* <Link
                to={"/change-password"}
                className="clearButton text-align-start"
              >
                <i className="fa-regular fa-lock me-2"></i>
                Change Password
              </Link> */}
              <div
                className="clearButton text-align-start"
                onClick={() => setPopUp(true)}
              >
                <i className="fa-regular fa-lock me-2"></i>
                Change Password
              </div>
            </div>
            <div className="dropdown-item">
              <Link to={"/my-profile"} className="clearButton">
                <i class="fa-regular fa-user me-2" aria-hidden="true"></i>
                Profile
              </Link>
            </div>
            <div
              onClick={logOut}
              className="d-flex w-100 gap-3 align-items-center justify-content-start"
            >
              <Link to={"/"} className="logoutBtn">
                <i className="fa-solid fa-power-off me-1"></i> Logout
              </Link>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      {popUp ? (
        <div className="popup">
          <div className="container h-100">
            <div className="row h-100 justify-content-center align-items-center">
              <div className="row content col-xl-4">
                <div className="col-2 px-0">
                  <div className="iconWrapper">
                    <i
                      className="fa fa-key text-primary"
                      aria-hidden="true"
                    ></i>
                  </div>
                </div>
                <div className="col-10 ps-0">
                  <h4>Change Password!</h4>
                  <div className="col-12" style={{ padding: "25px 23px" }}>
                    <form>
                      <div className="formRow col-12">
                        <div className="formLabel">
                          <div>
                            <label className="text-dark">
                              Current Password :{" "}
                            </label>
                          </div>
                          <div>
                            <label
                              htmlFor="data"
                              className="formItemDesc"
                              style={{
                                fontSize: 12,
                                lineHeight: "18px",
                                marginTop: 5,
                              }}
                            >
                              This is your current password.
                            </label>
                          </div>
                        </div>
                        <div className="col-12">
                          <input
                            type="text"
                            name="extension"
                            className="formItem"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                          />
                          {errorOldPassword ? (
                            <label className="status missing">
                              Field Missing
                            </label>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                      <div className="formRow col-12">
                        <div className="formLabel">
                          <div>
                            <label className="text-dark">New Password : </label>
                          </div>
                          <div>
                            <label
                              htmlFor="data"
                              className="formItemDesc"
                              style={{
                                fontSize: 12,
                                lineHeight: "18px",
                                marginTop: 5,
                              }}
                            >
                              Please input your preferred new password.
                            </label>
                          </div>
                        </div>
                        <div className="col-12">
                          <input
                            type="text"
                            name="extension"
                            className="formItem"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                          {errorNewPassword ? (
                            <label className="status missing">
                              Password must be at least 6 characters
                            </label>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                      <div className="formRow col-12">
                        <div className="formLabel">
                          <div>
                            <label className="text-dark">
                              Confirm Password :
                            </label>
                            {errorConfirm ? (
                              <label className="status missing">
                                Password do not matched
                              </label>
                            ) : (
                              ""
                            )}
                          </div>
                          <div>
                            <label
                              htmlFor="data"
                              className="formItemDesc"
                              style={{
                                fontSize: 12,
                                lineHeight: "18px",
                                marginTop: 5,
                              }}
                            >
                              Please retype your password.
                            </label>
                          </div>
                        </div>
                        <div className="col-12">
                          <input
                            type="text"
                            name="extension"
                            className="formItem"
                            value={confPassword}
                            onChange={(e) => setConfPassword(e.target.value)}
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="mt-2 d-flex justify-content-between">
                    <button
                      disabled={loading}
                      className="panelButton m-0"
                      onClick={() => handleSubmit()}
                    >
                      <span className="text">Confirm</span>
                      <span className="icon">
                        <i class="fa-solid fa-check"></i>
                      </span>
                    </button>
                    {/* ) : ( */}

                    {/* )} */}

                    <button
                      className="panelButton gray m-0 float-end"
                      onClick={() => {
                        setPopUp(false);
                      }}
                    >
                      <span className="text">Cancel</span>
                      <span className="icon">
                        <i class="fa-solid fa-xmark"></i>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Header;

export const toggleSideNav = () => {
  const sideNav = document.getElementById("sidenNav");
  const sideNavStyles = getComputedStyle(sideNav);
  if (sideNavStyles.left === "-1000px") {
    sideNav.style.left = "0";
  } else {
    sideNav.style.left = "-1000px";
  }
};
