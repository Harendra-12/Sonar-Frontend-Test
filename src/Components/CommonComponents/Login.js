import React, { useCallback, useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { backToTop, generalGetFunction, login } from "../GlobalFunction/globalFunction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Init Particle js and use it
  const [init, setInit] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

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
          if (profile.status) {
            setLoading(false);
            dispatch({
              type: "SET_ACCOUNT",
              account: profile.data,
            });
            localStorage.setItem("account", JSON.stringify(profile.data));
            window.scrollTo(0, 0);
            navigate("/dashboard");
          }
          // else{
          //   setLoading(false)
          //   toast.error("unauthorized access!")
          // }
        } else {
          setLoading(false);
          toast.error(data.message);
        }
      }
    }
  }, [userName, password, dispatch, navigate]);

  // Function to handle Enter key press
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter') {
      userLogin();
    }
  }, [userLogin]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const ParticlesBackground = React.memo(() => {
    return (
      <Particles
        id="tsparticles"
        options={{
          background: {
            color: {
              value: "#111525",
            },
          },
          fullScreen: {
            enable: false
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "attract",
              },
              onChange: {
                enable: false,
              },
              resize: false,
            },
            modes: {
              pull: {
                quantity: 20,
              },
              attract: {
                distance: 50,
                duration: 2,
                speed: 5,
              },
            },
          },
          particles: {
            color: {
              value: "#fda68a",
            },
            links: {
              color: "#fe8081",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 3,
              straight: false,
              attract: { enable: false, rotateX: 600, rotateY: 1200 },
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 600,
            },
            opacity: {
              value: 0.5,
              random: false,
              anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false },
            },
            shape: {
              type: "circle",
            },
            size: {
              value: 3,
              random: true,
              anim: {
                enable: true,
                speed: 4.872463273808071,
                size_min: 0.1,
                sync: false,
              },
            },
          },
          detectRetina: true,
        }}
      />
    );
  });

  return (
    <>
      <style>
        {`#sidenNav{
        display:none;
      }`}
      </style>
      <div>
        <main className="login">
          {/* <div>
          {init && (
            <ParticlesBackground />
          )}
          </div> */}
          <div className="container h-100">
            <div className="row h-100">
              <div className="loginWrapper col-xxl-12 col-xl-9 col-md-9 col-11 m-auto pe-0">
                <div className="col-xl-6 col-12 p-xl-0 p-5">
                  <form className="loginForm">
                    <div className="col-xl-8 m-auto">
                      <div className="iconWrapper">
                        <i className="fa-regular fa-user" />
                      </div>
                      <div>
                        <label>Enter Username Or Email</label>
                        <div className="position-relative">
                          <i className="fa-thin fa-user" />
                          <input
                            type="text"
                            placeholder="USERNAME"
                            className="loginFormItem"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <label>Enter Password</label>
                        <div className="position-relative">
                          <i className="fa-thin fa-lock" />
                          <input
                            type="password"
                            placeholder="PASSWORD"
                            className="loginFormItem"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                      </div>
                      <div onClick={backToTop}>
                        <button
                          className="loginBtn"
                          type="button"
                          effect="ripple"
                          onClick={() => { localStorage.clear(); userLogin() }}
                        >
                          {loading ? <span class="loaderSpin"></span> : "LOGIN"}
                        </button>
                      </div>
                    </div>
                  </form>
                  <form className="forgotPassword">
                    <div className="col-xl-8 m-auto">
                      <div className="position-relative">
                        <i className="fa-thin fa-user" />
                        <input
                          type="text"
                          placeholder="USERNAME"
                          className="loginFormItem"
                        />
                      </div>
                      <div className="position-relative">
                        <i className="fa-thin fa-lock" />
                        <input
                          type="email"
                          placeholder="EMAIL"
                          className="loginFormItem"
                        />
                      </div>
                      <div className="position-relative">
                        <i className="fa-thin fa-lock" />
                        <input
                          type="email"
                          placeholder="CONFIRM EMAIL"
                          className="loginFormItem"
                        />
                      </div>
                      <div className="position-relative">
                        <i className="fa-thin fa-lock" />
                        <input
                          type="text"
                          placeholder="VERIFICATION ID"
                          className="loginFormItem"
                        />
                      </div>
                      <div>
                        <button
                          className="formSubmit"
                          type="button"
                          effect="ripple"
                        >
                          SEND REQUEST
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="col-xl-6 h-100 position-relative">
                  {/* <div className="imgWrapper">
                    <img src={require("../assets/images/testLogin.webp")} alt="login" />
                  </div> */}
                  <div className="h-100 d-none d-xl-block">
                    {init && (
                      <ParticlesBackground />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="someText">
            <h1>Welcome.</h1>
            <p>
              Step into a world where connections know no bounds. Get ready to connect beyond horizons.
            </p>
          </div>
          <div className="someLogo">
            <img src={require('../assets/images/logo_login.png')} width={250} alt="logo" />
          </div>
        </main>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default Login;


