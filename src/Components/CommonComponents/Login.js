/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from "react";
import {
  backToTop,
  generalGetFunction,
  generalGetFunctionWithToken,
  generalPostFunctionWithToken,
  login,
} from "../GlobalFunction/globalFunction";
import { toast } from "react-toastify";

import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import languages from './ListOfLanguage.json';
import GoogleTranslate from "./GoogleTranslate";


const baseName = process.env.REACT_APP_BACKEND_BASE_URL;
function Login() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const account = useSelector((state) => state.account);
  const userCountry = localStorage.getItem("userCountry");
  const userLanguage = localStorage.getItem("userLanguage");
  const [languageChangePopup, setLanguageChangePopup] = useState(false);

  if (token && account) {
    if (account?.user_role?.roles?.name === "Agent") {
      navigate("/webrtc");
    } else if (account?.user_role?.roles?.name.toLowerCase() === "employee") {
      navigate("/messages");
    } else {
      if (userCountry == "AE" && userLanguage !== "ar") {
        handleLanguageChange();
      } else {
        navigate("/dashboard");
      }
    }
  }

  const handleLanguageChange = () => {
    if (!languageChangePopup) {
      setLanguageChangePopup(true)
    }
  }

  return (
    <>
      <style>
        {`#sidenNav{
        display:none;
      }`}
      </style>
      <div>
        <main className="login">
          <nav className="navbar navbar-expand-lg fixedTop">
            <div className="container">
              <Link className="navbar-brand" href="#home">  <img src={require('../assets/images/site-logo.png')} alt="logo" className='img' /></Link>
              {/* <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <i className="fa-solid fa-bars"></i>
                    </button> */}
              {/* <div className="collapse navbar-collapse" id="navbarSupportedContent">
                       
                    </div> */}
              <div className='d-flex rightSide_group ms-auto'>
                <GoogleTranslate />

              </div>
            </div>
          </nav>

          <div className="container position-relative h-100">
            <div className="loginWrapper2">
              <div className="row h-100">
                <div className="col-xl-6 h-100 position-relative d-flex align-items-center">
                  <div className="content col-xxl-7 col-xl-8 mx-auto py-5">
                    <h3>Login now to get introduced <br />to AngelPBX.ai</h3>
                    <p>Enter your credentials to access your account</p>
                    <div className="border-bottom my-4"></div>
                    <LoginComponent setLanguageChangePopup={setLanguageChangePopup} />
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
                    <img src={require('../assets/images/login_bg.webp')} className="loginbg" />
                    <div className="content">
                      <h3 className="login_text">
                        You are one step <br />
                        closer to <span className="loginGradient">AI-Powered</span> <br />
                        Communication
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={"/login_chat.svg"}
                          className="loginChat"
                          alt="logo"
                        />
                      </div>
                      <div className="loginFooter">
                        <span className="first">AngelECHO (AI) - </span><span className="last">Your AI Assistant</span>
                      </div>
                      <div className="loginGirlsImg" >
                        <img
                          src={"/login_girl.svg"}
                          className="loginChat w-100"
                          alt="logo"
                        />
                      </div>
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
      {languageChangePopup && <LanguagePromptPopup setLanguageChangePopup={setLanguageChangePopup} />}
    </>
  );
}

export default Login;

export function LoginComponent({ setLanguageChangePopup }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const permissionRefresh = useSelector((state) => state.permissionRefresh);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [popUp, setPopUp] = useState(false);
  const [logInDetails, setLoginDetails] = useState([]);
  const [logInText, setLogInText] = useState("");
  const [logOutToken, setLogOutToken] = useState("");
  const [credsError, setCredsError] = useState(false);
  const [customErrorText, setCustomErrorText] = useState("");
  const [passwordMask, setPasswordMask] = useState(true);

  // Handle login function
  async function handleLogin() {
    // Reseting State before Loggin In
    dispatch({ type: "RESET_STATE" });
    localStorage.clear();

    const data = await login(userName, password);
    if (data) {
      if (data.status) {
        const country = JSON.parse(data.details).countryCode;
        localStorage.setItem('userCountry', country)

        dispatch({
          type: "SET_PERMISSION_REFRESH",
          permissionRefresh: permissionRefresh + 1,
        });
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
              } else if (
                profile.data.user_role?.roles?.name.toLowerCase() === "employee"
              ) {
                setLoading(false);
                window.scrollTo(0, 0);
                navigate("/messages");
              } else {
                setLoading(false);
                window.scrollTo(0, 0);
                // navigate("/dashboard");
                if (country == "AE") {
                  setLanguageChangePopup(true);
                } else {
                  navigate("/dashboard")
                }
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
    const [hours, minutes, seconds] = timeString.split(":").map(Number);

    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
      return "Invalid time format";
    }

    let period = "AM";
    let formattedHours = hours;

    if (hours >= 12) {
      period = "PM";
      if (hours > 12) {
        formattedHours -= 12;
      }
    }

    if (formattedHours === 0) {
      formattedHours = 12; // Midnight is 12 AM
    }

    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${period}`;
  }

  // function to logout from specific device
  async function handleLogoutFromSpecificDevice(token) {
    try {
      setLoading(true);
      const logOut = await generalPostFunctionWithToken(
        `${baseName}/logout-specific-device`,
        { token: token },
        token
      );
      // console.log({logOut})
      if (logOut?.status) {
        toast.success(logOut?.message);
        setLoading(false);
        setLoginDetails(logOut?.data);
        setLogInText("You can login now");
      } else {
        if (logOut?.message === "Token expired") {
          const expireLogout = await generalPostFunctionWithToken(
            `${baseName}/logout-expired-token`,
            { token: token }
          );
          if (expireLogout?.status) {
            toast.success(expireLogout?.message);
            setLoading(false);
            // setLoginDetails(expireLogout?.data)
            setLoginDetails(
              logInDetails.filter((item) => item.token !== token)
            );
            setLogInText("You can login now");
          }
        }
      }
    } catch (error) {
      // console.log("00err",error)
      setLoading(false);
      toast.error("Something went wrong. Please try again.");
    }
  }

  // Function to handle login
  const userLogin = useCallback(async () => {
    setCredsError(false);
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
        setCredsError(false);
        const country = JSON.parse(checkLogin.details).countryCode;
        localStorage.setItem('userCountry', country)

        dispatch({
          type: "SET_PERMISSION_REFRESH",
          permissionRefresh: permissionRefresh + 1,
        });
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
              } else if (
                profile.data.user_role?.roles?.name.toLowerCase() === "employee"
              ) {
                setLoading(false);
                window.scrollTo(0, 0);
                navigate("/messages");
              } else {
                setLoading(false);
                window.scrollTo(0, 0);
                // navigate("/dashboard");
                if (country == "AE") {
                  setLanguageChangePopup(true);
                } else {
                  navigate("/dashboard")
                }
              }
            }
          } else {
            setLoading(false);
            toast.error("Server error !");
            setCredsError(true);
            setCustomErrorText("Server error !")
          }
        } else {
          setLoading(false);
          // toast.error("unauthorized access!");
        }
      } else if (
        checkLogin?.response?.status === 401 ||
        checkLogin?.response?.status === 403
      ) {
        setLoading(false);
        toast.error(checkLogin?.response?.data?.message);
        setCredsError(true);
        setCustomErrorText(checkLogin?.response?.data?.message)
        if (checkLogin?.response?.status === 401) {
          setCredsError(true);
          setCustomErrorText("Invalid username and password. Please try again.")
        }
      } else {
        if (checkLogin?.message === "Network Error") {
          toast.error("Network Error");
          setCredsError(true);
          setCustomErrorText("Network Error")
          return;
        }
        if (checkLogin?.response?.data?.message === "user is disabled.") {
          toast.error("Your account is disabled. Please contact Admin.");
          setCredsError(true);
          setCustomErrorText("Your account is disabled. Please contact Admin.")
          return;
        }
        setLoading(false);
        setLogOutToken(checkLogin?.response?.data?.data?.[0].token);
        setPopUp(true);
        setLoginDetails(checkLogin?.response?.data?.data);
        setLogInText("You are already login on different device!");
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
      const logoutAll = await generalGetFunctionWithToken(
        `${baseName}/logout?all`,
        logOutToken
      );
      if (logoutAll.status) {
        handleLogin();
      } else {
        if (logoutAll?.message === "Token expired") {
          const expireLogout = await generalPostFunctionWithToken(
            `${baseName}/logout-expired-token`,
            { all: logOutToken, token: logOutToken }
          );
          if (expireLogout?.status) {
            handleLogin();
          } else {
            setLoading(false);
            toast.error("Something went wrong. Please try again.");
          }
        }
        // setLoading(false);
        // toast.error(logoutAll.message || "Logout failed");
      }
    } catch (error) {
      setLoading(false);
      console.error("Logout all error:", error);
      toast.error(
        error.response?.message ||
        error.message ||
        "An unexpected error occurred"
      );
    }
  }

  return (
    <>
      {credsError && <CustomLoginError errorText={customErrorText} />}
      <form className="loginForm">
        <div className="col-xl-12 m-auto">
          {/* <div className="iconWrapper">
          <i className="fa-regular fa-user" />
        </div> */}
          <label>Username</label>
          <div className="position-relative" style={{ marginBottom: '20px' }}>
            <i className="fa-thin fa-user" />
            <input
              type="text"
              name="username1"
              placeholder="Enter your username"
              className={`loginFormItem mb-0`}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            {/* {credsError && <div class="invalid-feedback d-block">
              <i class="fa-regular fa-circle-info position-static text-danger me-1"></i> Incorrect Username.
            </div>} */}
          </div>
          <label>Password</label>
          <div className="position-relative" style={{ marginBottom: '20px' }}>
            <i className="fa-thin fa-lock" />
            <input
              type={passwordMask ? "password" : "text"}
              name="password1"
              placeholder="Enter your password"
              className={`loginFormItem mb-0`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* {credsError && <div class="invalid-feedback d-block">
              <i class="fa-regular fa-circle-info position-static text-danger me-1"></i> Incorrect Password.
            </div>} */}
            <button className="clearButton2" onClick={() => setPasswordMask(!passwordMask)} type="button">
              <i className={`fa-solid fa-eye${passwordMask ? "" : "-slash"} position-static`} />
            </button>
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
              <button
                className="popup_close"
                onClick={() => {
                  setPopUp(false);
                }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
              <div className=" position-relative">
                <img
                  className="w-100 "
                  src={require("../assets/images/login-cruve2.png")}
                />
                {/* <div className="warning_img">
                <img className=" " src={require('../assets/images/crisis.png')} />
              </div> */}
              </div>
              <div className="p-3">
                <h5 className="text-center fs-5">Warning!</h5>
                {/* <div className="col-12 heading mb-0">
                <i className="fa-solid fa-triangle-exclamation"></i>
              </div> */}
                <p className="text-center mb-1">{logInText}</p>
                <p className="text-center fs-6 text_warning ">
                  You are logged in from the specific devices:{" "}
                </p>

                {logInDetails?.length > 0 && (
                  <ul className="mb-3 d-block">
                    {logInDetails?.map((item) => {
                      return (
                        <li
                          className="d-flex align-items-center justify-content-between"
                          style={{ width: "100%" }}
                        >
                          <div>
                            {item?.platform} - {item?.browser} -{" "}
                            {item?.ip_address}
                            <p
                              style={{ fontSize: "0.75rem", marginBottom: "0" }}
                            >
                              <b>Logged At</b>: {item.created_at.split("T")[0]}{" "}
                              {formatTimeWithAMPM(
                                item.created_at.split("T")[1].split(".")[0]
                              )}
                            </p>
                          </div>
                          <div>
                            <button
                              className="clearButton2 ms-2"
                              onClick={() =>
                                handleLogoutFromSpecificDevice(item?.token)
                              }
                            >
                              <i className="fa-solid fa-power-off text-danger" />
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
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
                  }} type="button" className="btn btn-success-light btn-wave " >
                    <span>Login</span> <i
                      className="fa-solid fa-check"
                    ></i></button> */}

                  <button
                    className="btn2"
                    onClick={() => {
                      setPopUp(false);
                      setLoading(true);
                      handleLogin();
                    }}
                  >
                    <span className="text">Login</span>
                    <i className="fa-solid fa-paper-plane-top"></i>
                  </button>

                  <div>
                    <button
                      disabled={loading}
                      className="panelButton delete static m-0 px-2 bg-transparent shadow-none logout__Btn"
                      onClick={handleLogoutAll}
                    >
                      <span className="text text-danger">
                        Logout All Devices
                      </span>
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

export function LanguagePromptPopup({ setLanguageChangePopup }) {
  const [changeLanguage, setChangeLanguage] = useState(false);
  const [selectLanguage, setSelectLanguage] = useState("");
  const navigate = useNavigate()

  function setCookie(key, value, expiry) {
    var expires = new Date();
    expires.setTime(expires.getTime() + (expiry * 24 * 60 * 60 * 1000));
    document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
  }

  const handleSaveLanguage = () => {
    if (selectLanguage) {
      setCookie('googtrans', `/en/${selectLanguage}`, 1);

      // Check if select exists and set its value
      const selectElement = document.querySelector("#google_translate_element select");
      if (selectElement) {
        selectElement.value = selectLanguage;
        const event = new Event("change");
        selectElement.dispatchEvent(event);
      }

      // Or optionally re-init widget (note: may not respect cookie immediately without reload)
      if (window.googleTranslateElementInit) {
        window.googleTranslateElementInit();
      }
      localStorage.setItem("userLanguage", selectLanguage);
      setLanguageChangePopup(false);
      navigate("/dashboard");
      window.location.reload();
    }
  };

  return (
    <div className="popup" >
      <div className="container h-100">
        <div className="d-flex h-100 justify-content-center align-items-center">
          <div className="row content col-xxl-4 col-xl-5 col-md-6">
            <div className="col-12 px-0">
              <div className="iconWrapper mb-3">
                <i className="fa-duotone fa-circle-exclamation" />
              </div>
            </div>
            <div className="col-12 ps-0 pe-0 text-center">
              <h4 className="text-center text-orange">Confirmation!</h4>
              {!changeLanguage ?
                <>
                  <p className="mb-2">
                    The default language is set to English! Do you want to change it to something else?
                  </p>
                  <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
                    <button className="panelButton m-0" onClick={() => setChangeLanguage(true)}>
                      <span className="text">Yes!</span>
                      <span className="icon">
                        <i className="fa-solid fa-check" />
                      </span>
                    </button>
                    <button className="panelButton gray m-0 float-end" onClick={() => { setLanguageChangePopup(false); navigate("/dashboard") }}>
                      <span className="text">No</span>
                      <span className="icon">
                        <i className="fa-solid fa-xmark" />
                      </span>
                    </button>
                  </div>
                </> : <>
                  <p className="mb-2">
                    Please choose your language from the dropdown below
                  </p>
                  <div className="formRow">
                    <select className="formItem" onChange={(e) => setSelectLanguage(e.target.value)}>
                      <option value={""}>Select Language</option>
                      {languages.map((lang, index) => {
                        return (
                          <option key={index} value={lang.code}>{lang.name}</option>
                        )
                      })}
                    </select>
                  </div>
                  <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
                    <button className="panelButton m-0" onClick={handleSaveLanguage}>
                      <span className="text">Save</span>
                      <span className="icon">
                        <i className="fa-solid fa-floppy-disk" />
                      </span>
                    </button>
                  </div>
                </>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CustomLoginError({ errorText }) {
  return (
    <div className="errorBox_message mb-4">
      <i class="fa-regular fa-circle-exclamation"></i>
      <div className=" ">
        <p className="mb-0">{errorText}</p>
        {/* <div className="d-flex align-items-center justify-content-between gap-2">
            <Link to=''>Forgot your password</Link>
            <button className="errorBtn">Account Locked</button>
          </div> */}
      </div>
    </div>
  )
}
