/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from "react";
import {
  backToTop,
  generalGetFunction,
  login,
} from "../GlobalFunction/globalFunction";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
const baseName = process.env.REACT_APP_BACKEND_BASE_URL;
function Login() {
  return (
    <>
      <style>
        {`#sidenNav{
        display:none;
      }`}
      </style>
      <div>
        <main className="login">
          <div className="container position-relative h-100">
            <div className="loginWrapper2">
              <div className="row h-100">
                <div className="col-xl-6 h-100 position-relative d-flex align-items-center">
                  <div className="content col-xl-7 mx-auto py-5">
                    <h3>Get Started Now</h3>
                    <p>Enter your credentials to access your account</p>
                    <div className="border-bottom my-4"></div>
                    <LoginComponent />
                  </div>
                  <div
                    className="text-center position-absolute w-100"
                    style={{
                      bottom: 0,
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <p
                      style={{
                        color: "var(--webUtilGray)",
                        fontSize: 12,
                        marginBottom: 0,
                      }}
                    >
                      2025 AngelPBX. All rights Reserved
                    </p>
                  </div>
                </div>
                <div className="col-xl-6 col-lg-5 d-xl-block d-none">
                  <div className="loginImgWrapper">
                    <div className="content">
                      <h3>An Effective PBX Solution for all your Business Communication Needs</h3>
                      <p>Enter your credentials to access your control</p>
                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <img src={require("../assets/images/pbx.webp")} alt="logo" style={{ marginLeft: '0', width: "85%" }} />
                      </div>
                      {/* <img className="comp" src={require('../assets/images/temp.png')} /> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="loginWave">
            <img src={require("../assets/images/wave.png")} alt="background" />
          </div>
        </main>
      </div>
    </>
  );
}

export default Login;

export function LoginComponent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const permissionRefresh = useSelector((state) => state.permissionRefresh.permissionRefresh);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [popUp, setPopUp] = useState(false)
  const [logInDetails, setLoginDetails] = useState([])
  const [logInText, setLogInText] = useState("");
  const [logOutToken, setLogOutToken] = useState("")

  // Handle login function
  async function handleLogin() {
    // Reseting State before Loggin In
    dispatch({ type: "RESET_STATE" });
    localStorage.clear();

    const data = await login(userName, password);
    if (data) {
      if (data.status) {
        const profile = await generalGetFunction("/user");
        if (profile?.status) {
          dispatch({
            type: "SET_ACCOUNT",
            account: profile.data,
          });

          localStorage.setItem("account", JSON.stringify(profile.data));
          const accountData = await generalGetFunction(
            `/account/${profile.data.account_id}`
          );
          if (accountData?.status) {
            dispatch({
              type: "SET_ACCOUNTDETAILS",
              accountDetails: accountData.data,
            });
            localStorage.setItem(
              "accountDetails",
              JSON.stringify(accountData.data)
            );
            if (Number(accountData.data.company_status) < 6) {
              dispatch({
                type: "SET_BILLINGLISTREFRESH",
                billingListRefresh: 1,
              });
              dispatch({
                type: "SET_CARDLISTREFRESH",
                cardListRefresh: 1,
              });
              dispatch({
                type: "SET_TEMPACCOUNT",
                tempAccount: accountData.data,
              });
              localStorage.setItem(
                "tempAccount",
                JSON.stringify(accountData.data)
              );
              setLoading(false);
              window.scrollTo(0, 0);
              navigate("/temporary-dashboard");
            } else {
              dispatch({
                type: "SET_TEMPACCOUNT",
                tempAccount: null,
              });
              // Checking wether user is agent or not if agent then redirect to webrtc else redirect to dashboard
              if (profile.data.user_role?.roles?.name === "Agent") {
                if (profile.data.extension_id === null) {
                  toast.error("You are not assigned to any extension");
                  setLoading(false);
                } else {
                  setLoading(false);
                  window.scrollTo(0, 0);
                  navigate("/webrtc");
                }
              } else {
                setLoading(false);
                window.scrollTo(0, 0);
                navigate("/dashboard");
              }
            }
          } else {
            setLoading(false);
            toast.error("Server error !");
          }
        } else {
          setLoading(false);
          // toast.error("unauthorized access!");
        }
      } else {
        setLoading(false);
        // const errorMessage = Object.keys(data.error);
        toast.error(data.response.data.message);
      }
    }
  }

  // function to handle time
  function formatTimeWithAMPM(timeString) {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);

    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
      return "Invalid time format";
    }

    let period = 'AM';
    let formattedHours = hours;

    if (hours >= 12) {
      period = 'PM';
      if (hours > 12) {
        formattedHours -= 12;
      }
    }

    if (formattedHours === 0) {
      formattedHours = 12; // Midnight is 12 AM
    }

    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${period}`;
  }



  // function to logout from specific device
  async function handleLogoutFromSpecificDevice(token) {
    try {
      setLoading(true);
      const logOut = await axios.post(`${baseName}/logout-specific-device`, { token: token }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (logOut?.data?.status) {
        toast.success(logOut?.data?.message)
        setLoading(false);
        setLoginDetails(logOut?.data?.data)
        setLogInText("You can login now")
      }
    } catch (error) {
      // console.log("00err",error)
      setLoading(false)
      toast.error(error?.response?.data?.message)
    }
  }

  // Function to handle login
  const userLogin = useCallback(async () => {
    if (userName === "") {
      toast.error("Username is required!");
    } else if (password === "") {
      toast.error("Password is required!");
    } else {
      // Reseting State before Loggin In
      dispatch({ type: "RESET_STATE" });
      localStorage.clear();

      setLoading(true);
      const checkLogin = await login(userName, password);
      // console.log("00check",{checkLogin})
      if (checkLogin?.status) {
        const profile = await generalGetFunction("/user");
        if (profile?.status) {
          dispatch({
            type: "SET_ACCOUNT",
            account: profile.data,
          });

          localStorage.setItem("account", JSON.stringify(profile.data));
          const accountData = await generalGetFunction(
            `/account/${profile.data.account_id}`
          );
          if (accountData?.status) {
            dispatch({
              type: "SET_ACCOUNTDETAILS",
              accountDetails: accountData.data,
            });
            localStorage.setItem(
              "accountDetails",
              JSON.stringify(accountData.data)
            );

            // Checking if the user is a temporary user or not
            if (Number(accountData.data.company_status) < 6) {
              dispatch({
                type: "SET_BILLINGLISTREFRESH",
                billingListRefresh: 1,
              });
              dispatch({
                type: "SET_CARDLISTREFRESH",
                cardListRefresh: 1,
              });
              dispatch({
                type: "SET_TEMPACCOUNT",
                tempAccount: accountData.data,
              });
              localStorage.setItem(
                "tempAccount",
                JSON.stringify(accountData.data)
              );
              setLoading(false);
              window.scrollTo(0, 0);
              navigate("/temporary-dashboard");
            } else {
              dispatch({
                type: "SET_TEMPACCOUNT",
                tempAccount: null,
              });
              dispatch({
                type: "SET_PERMISSION_REFRESH",
                permissionRefresh: permissionRefresh + 1,
              });
              // Checking wether user is agent or not if agent then redirect to webrtc else redirect to dashboard
              if (profile.data.user_role?.roles?.name === "Agent") {
                if (profile.data.extension_id === null) {
                  toast.error("You are not assigned to any extension");
                  setLoading(false);
                } else {
                  setLoading(false);
                  window.scrollTo(0, 0);
                  navigate("/webrtc");
                }
              } else {
                setLoading(false);
                window.scrollTo(0, 0);
                navigate("/dashboard");
              }
            }
          } else {
            setLoading(false);
            toast.error("Server error !");
          }
        } else {
          setLoading(false);
          // toast.error("unauthorized access!");
        }


      } else if (checkLogin?.response?.status === 401 || checkLogin?.response?.status === 403) {
        setLoading(false)
        toast.error(checkLogin?.response?.data?.message)
      } else {
        setLoading(false)
        setLogOutToken(checkLogin?.response?.data?.data[0].token)
        setPopUp(true)
        setLoginDetails(checkLogin?.response?.data?.data)
        setLogInText("You are already login on different device!")
      }

    }
  }, [userName, password, dispatch, navigate]);

  // Function to handle Enter key press
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter") {
        userLogin();
      }
    },
    [userLogin]
  );

  // Listen to enter press and then trigger login
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Handle logout from all device and then login in current device
  async function handleLogoutAll() {
    setLoading(true);
    setPopUp(false);
    try {
      const logoutAll = await axios.get(`${baseName}/logout?all`, {
        headers: {
          Authorization: `Bearer ${logOutToken}`,
        },
      });

      if (logoutAll.status >= 200 && logoutAll.status < 300) {
        handleLogin();
      } else {
        setLoading(false);
        toast.error(logoutAll.data?.message || "Logout failed");
      }
    } catch (error) {
      setLoading(false);
      console.error("Logout all error:", error);
      toast.error(error.response?.data?.message || error.message || "An unexpected error occurred");
    }
  }
  return (
    <>
      <form className="loginForm">
        <div className="col-xl-12 m-auto">
          {/* <div className="iconWrapper">
          <i className="fa-regular fa-user" />
        </div> */}
          <label>Username</label>
          <div className="position-relative">
            <i className="fa-thin fa-user" />
            <input
              type="text"
              placeholder="Enter your username"
              className="loginFormItem"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <label>Password</label>
          <div className="position-relative">
            <i className="fa-thin fa-lock" />
            <input
              type="password"
              placeholder="Enter your password"
              className="loginFormItem"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div onClick={backToTop}>
            <button
              disabled={loading}
              className="formSubmit"
              type="button"
              effect="ripple"
              onClick={() => {
                localStorage.clear();
                userLogin();
              }}
            >
              {loading ? (
                <img
                  width="6%"
                  src={require("../assets/images/loader-gif.webp")}
                  alt=""
                />
              ) : (
                "Login"
              )}
            </button>
          </div>
        </div>
      </form>
      {popUp ? (
        <>
          {/* Log out of multiple devices */}
          <div className="backdropContact">
            <div className="addNewContactPopup position-relative logoutPopup">
              <button className="popup_close" onClick={() => {
                    setPopUp(false);}}>
              <i class="fa-solid fa-xmark"></i>
              </button>
              <div className=" position-relative">
                <img className="w-100 " src={require('../assets/images/login-cruve2.png')} />
              {/* <div className="warning_img">
                <img className=" " src={require('../assets/images/crisis.png')} />
              </div> */}
              </div>
              <div className="p-3">
                <h5 className="text-center fs-5">Warning!</h5>
                {/* <div className="col-12 heading mb-0">
                <i className="fa-solid fa-triangle-exclamation"></i>
              </div> */}
                <p className="text-center mb-1">
                  {logInText}
                </p>
                <p className="text-center fs-6 text_warning ">You are logged in from the specific devices: </p>

                {logInDetails?.length > 0 &&
                  <ul className="mb-3 d-block">
                    {logInDetails?.map((item) => {
                      return <li className="d-flex align-items-center justify-content-between" style={{ width: '100%' }}>
                        <div>
                          {item?.platform} - {item?.browser}
                          <p style={{ fontSize: '0.75rem', marginBottom: '0' }}><b>Logged At</b>: {item.created_at.split("T")[0]} {formatTimeWithAMPM(item.created_at.split("T")[1].split(".")[0])}</p>
                        </div>
                        <div>
                          <button className="clearButton2 ms-2" onClick={() => handleLogoutFromSpecificDevice(item?.token)}><i className="fa-solid fa-power-off text-danger" /></button>
                        </div>
                      </li>
                    })}
                  </ul>
                }
                <div className="d-flex justify-content-between px-0">
                  {/* <button
                    className="panelButton m-0 float-end"
                    onClick={() => {
                      setPopUp(false);
                      setLoading(true)
                      handleLogin()
                    }}
                  >
                    <span className="text">Login</span>
                    <span className="icon">
                      <i className="fa-solid fa-check"></i>
                    </span>
                  </button> */}

                  {/* <button onClick={() => {
                    setPopUp(false);
                    setLoading(true)
                    handleLogin()
                  }} type="button" class="btn btn-success-light btn-wave " >
                    <span>Login</span> <i
                      className="fa-solid fa-check"
                    ></i></button> */}

                  <button class="btn2" onClick={() => {
                    setPopUp(false);
                    setLoading(true)
                    handleLogin()
                  }}>
                    <span class="text">Login</span>
                    <i class="fa-solid fa-paper-plane-top"></i>
                  </button>

                  <div>
                    <button
                      disabled={loading}
                      className="panelButton delete static m-0 px-2 bg-transparent shadow-none logout__Btn"
                      onClick={handleLogoutAll}
                    >

                      <span className="text text-danger">Logout All Devices</span>
                      {/* <span className="icon">
                        <i className="fa-solid fa-power-off"></i>
                      </span> */}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 
          <div className="popupopen ">
            <div className="container h-100">
              <div className="row h-100 justify-content-center align-items-center">
                <div className="row content col-xl-4 col-md-5">
                  <div className="col-2 px-0">
                    <div className="iconWrapper">
                      <i className="fa-duotone fa-triangle-exclamation"></i>
                    </div>
                  </div>
                  <div className="col-10 ps-0">
                    <h4>Warning!</h4>
                    <p className="my-2">
                      You are about to log out of all devices!
                    </p>
                    <div className="d-flex justify-content-between mt-3">
                      <button
                        className="panelButton delete m-0 float-end"
                        onClick={() => {
                          setPopUp(false);
                          setLoading(true)
                          handleLogin()
                        }}
                      >
                        <span className="text">LogOut</span>
                        <span className="icon">
                          <i className="fa-solid fa-power-off"></i>
                        </span>
                      </button>

                      <div>
                        <button
                          disabled={loading}
                          className="panelButton gray"
                          onClick={handleLogoutAll}
                        >
                          <span className="text">Close</span>
                          <span className="icon">
                            <i className="fa-solid fa-xmark"></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </>
      ) : (
        ""
      )}
    </>
  );
}
