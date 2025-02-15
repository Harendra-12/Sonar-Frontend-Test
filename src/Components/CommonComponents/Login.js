import React, { useCallback, useEffect, useState } from "react";
import {
  backToTop,
  generalGetFunction,
  login,
} from "../GlobalFunction/globalFunction";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

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
                      <h3>The simplest way to manage your workforce</h3>
                      <p>Enter your credentials to access your control</p>
                      <img src={require("../assets/images/logindash.png")} alt="logo" />
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

  // Function to handle login
  const userLogin = useCallback(async () => {
    if (userName === "") {
      toast.error("Username is required!");
    } else if (password === "") {
      toast.error("Password is required!");
    } else {
      setLoading(true);
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

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
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
  );
}
