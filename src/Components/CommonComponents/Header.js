import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  generalPostFunction,
} from "../GlobalFunction/globalFunction";
import DarkModeToggle from "./DarkModeToggle";
import { toast } from "react-toastify";

function Header(props) {
  const dispatch = useDispatch();
  const account = useSelector((state) => state.account);
  // const accountDetails = useSelector((state) => state.accountDetails);
  const balance = useSelector((state) => state.balance);
  const accountBalance = useSelector((state) => state.accountBalance)
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
      setAccountName(account.username);
    }
  }, [account, navigate]);

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
            {account?.extension_id &&
              <div className="my-auto mx-3">
                <Tippy content="Click here to open dialer!">
                  <a
                    href="/webrtc"
                    target="_blank"
                    style={{ cursor: "pointer" }}
                    className="clearColorButton"
                  >
                    <i className="fa-regular fa-phone-office" />{" "}
                    <span className="d-none d-xl-inline-block">
                      Go to Dialer
                    </span>
                  </a>
                </Tippy>
              </div>
            }
            <div>
              <Tippy content="Your available balance, click to know more!">
                <div
                  onClick={() => navigate("/card-details")}
                  style={{ cursor: "pointer", minWidth: '140px' }}
                  className="clearColorButton"
                >
                  <i className="fa-regular fa-wallet" />{" "}
                  <span className="d-none d-xl-inline-block">
                    ${accountBalance || 0}
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
              <Link
                onClick={() => setPopUp(true)}
                className="clearButton text-align-start"
              >
                <i className="fa-regular fa-lock me-2"></i>
                Change Password
              </Link>
            </div>
            <div className="dropdown-item">
              <Link to={"/users-profile"} className="clearButton">
                <i class="fa-regular fa-user me-2" aria-hidden="true"></i>
                My Profile
              </Link>
            </div>
            <div
              onClick={() => dispatch({ type: "SET_LOGOUT", logout: 1 })}
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
        <>
          <div className="backdropContact">
            <div className="addNewContactPopup">
              <div className="row">
                <div className="col-12 heading">
                  <i className="fa-light fa-key" />
                  <h5>Change Password</h5>
                  <p>
                    Change your account password effortlessly, keeping your account secure and private.
                  </p>
                  <div className="border-bottom col-12" />
                </div>
                <div className="col-xl-12">
                  <div className="formLabel d-flex justify-content-between" style={{ maxWidth: "100%" }}>
                    <label className="text-dark">
                      Current Password :{" "}
                    </label>
                    {errorOldPassword ? (
                      <label className="status missing">
                        Field Missing
                      </label>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="col-12">
                    <input
                      type="text"
                      name="extension"
                      className="formItem"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />

                  </div>
                </div>
                <div className="col-xl-12 mt-3">
                  <div className="formLabel d-flex justify-content-between" style={{ maxWidth: "100%" }}>
                    <label className="text-dark">New Password : </label>
                    {errorNewPassword ? (
                      <label className="status missing">
                        Password must be min. 6 characters
                      </label>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="col-12">
                    <input
                      type="text"
                      name="extension"
                      className="formItem"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />

                  </div>
                </div>
                <div className="col-xl-12 mt-3">
                  <div className="formLabel d-flex justify-content-between" style={{ maxWidth: "100%" }}>
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
                <div className="col-xl-12 mt-4">
                  <div className="d-flex justify-content-between">
                    <button className="panelButton ms-0" disabled={loading} onClick={() => handleSubmit()}>
                      <span className="text">Confirm</span>
                      <span className="icon">
                        <i className="fa-solid fa-check" />
                      </span>
                    </button>
                    <button className="panelButton gray me-0"
                      onClick={() => {
                        setPopUp(false);
                      }}>
                      <span className="text">Close</span>
                      <span className="icon">
                        <i className="fa-solid fa-xmark" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
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
