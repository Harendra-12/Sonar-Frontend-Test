/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from "react";
import {
  backToTop,
  generalGetFunction,
  login,
} from "../GlobalFunction/globalFunction";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
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
                <div className="col-xl-6 d-xl-block d-none">
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

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [popUp, setPopUp] = useState(false)
  const [logInDetails,setLoginDetails]=useState([])

  // Handle login function
  async function handleLogin() {
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
          toast.error("unauthorized access!");
        }
      } else {
        setLoading(false);
        // const errorMessage = Object.keys(data.error);
        toast.error(data.response.data.message);
      }
    }
  }

  // function to logout from specific device
  async function handleLogoutFromSpecificDevice(token){
  try {
   const logOut=await axios.post(`${baseName}/logout-specific-device`, {token:token}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
   if(logOut.response.data.status){
    toast.success(logOut?.response.data?.message)
   }
  } catch (error) {
    // console.log("00err",error)
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
      setLoading(true);
      const checkLogin = await login(userName, password);
      if (checkLogin?.status ) {
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
          toast.error("unauthorized access!");
        }
      
      
      } else {
        setLoading(false)
        setPopUp(true)
        setLoginDetails(checkLogin?.response?.data?.data)
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
    setLoading(true)
    setPopUp(false)
    const logoutAll = await generalGetFunction("logout?all")
    if (logoutAll.status) {
      handleLogin()
    } else {
      setLoading(false)
      toast.error(logoutAll.message)
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
                  <p>
                    You are already login on different device !<br />
                    {/* Do you want to Logout from all device ? */}
                  </p>
                  <div className="d-flex justify-content-between">
                   <div>
                   <p className="p-0 mt-1 ">Log out from all device</p>
                    <button
                      disabled={loading}
                      className="panelButton m-0"
                      onClick={handleLogoutAll}
                    >
                      <span className="text">Logout</span>
                      <span className="icon">
                        <i className="fa-solid fa-check"></i>
                      </span>
                    </button>
                   </div>

                   <div>
                    <p className="p-0 mt-1">log out from specific device</p>
                    {logInDetails?.map((item)=>{
                      return <div>{item.platform} <button onClick={()=>handleLogoutFromSpecificDevice(item.token)}>Log out from {item.platform}</button></div>
                    })}
                    
                    <button
                      className="panelButton gray m-0 float-end"
                      onClick={() => {
                        setPopUp(false);
                        setLoading(true)
                        handleLogin()
                      }}
                    >
                      <span className="text">Login</span>
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
        </div>
      ) : (
        ""
      )}
    </>
  );
}
