import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  generalGetFunction,
  generalPostFunction,
  otpVefity,
} from "../GlobalFunction/globalFunction";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [currentStep, setCurrentStep] = useState("email"); // 'email' or 'otp'
  const [isLoading, setIsLoading] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [languageChangePopup, setLanguageChangePopup] = useState(false);
  const permissionRefresh = useSelector((state) => state.permissionRefresh);

  const handleLanguageChange = () => {
    if (!languageChangePopup) {
      setLanguageChangePopup(true);
    }
  };

  const handleSendOtp = async (email) => {
    const response = await generalPostFunction("/forgot-password", {
      email: email,
    });
    return response;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    setIsLoading(true);
    if (!email || !emailRegex.test(email)) {
      setInvalidEmail(true);
      setIsLoading(false);
      return;
    } else {
      setInvalidEmail(false);
    }

    try {
      const apiData = await handleSendOtp(email);

      if (apiData?.status) {
        setCurrentStep("otp");
      }
    } catch (error) {
      console.error("Error sending email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      alert("Please enter all 6 digits");
      return;
    }

    setIsLoading(true);

    try {
      const data = await otpVefity(email, otpValue);

      if (data.status) {
        localStorage.setItem("token", data?.token);
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
              // setLoading(false);
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
                  // setLoading(false);
                } else {
                  // setLoading(false);
                  window.scrollTo(0, 0);
                  navigate("/webrtc");
                }
              } else if (
                profile.data.user_role?.roles?.name.toLowerCase() === "employee"
              ) {
                // setLoading(false);
                window.scrollTo(0, 0);
                navigate("/messages");
              } else {
                // setLoading(false);
                window.scrollTo(0, 0);
                // navigate("/dashboard");
                // if (country == "AE") {
                //   setLanguageChangePopup(true);
                // } else {
                //   navigate("/dashboard");
                // }
                navigate("/reset-password");
              }
            }
          } else {
            // setLoading(false);
            toast.error("Server error !");
          }
        }
      } else {
        // setLoading(false);
        toast.error(data.response.data.message);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);

    try {
      const apiData = await handleSendOtp(email);
      if (apiData?.status) {
        setOtp(["", "", "", "", "", ""]); // Clear OTP inputs
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setCurrentStep("email");
    setOtp(["", "", "", "", "", ""]);
  };

  return (
    <>
      <style>
        {`#sidenNav{
        display:none;
      }`}
      </style>
      <div className="forgot-password-container">
        <div className="container-fluid h-100">
          <div className="row h-100 justify-content-center align-items-center">
            <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
              <div className="card shadow-lg border-0 forgot-password-card">
                <div className="card-body p-4 p-sm-5">
                  {/* Email Step */}
                  {currentStep === "email" && (
                    <>
                      <div className="text-center mb-4">
                        <div className="forgot-password-illustration">
                          <i className="fas fa-key illustration-icon"></i>
                          <i className="fas fa-arrow-right arrow-icon"></i>
                        </div>
                      </div>

                      <div className="text-center mb-4">
                        <h3 className="fw-bold mb-3 forgot-title">
                          Forgot your password?
                        </h3>
                        <p className="text-muted forgot-subtitle">
                          Enter your email so that we can send you password
                          reset link
                        </p>
                      </div>

                      {/* Email Form */}
                      <form onSubmit={handleEmailSubmit}>
                        <div className="mb-4">
                          <label
                            htmlFor="email"
                            className="form-label text-muted fw-medium"
                          >
                            Email
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            id="email"
                            placeholder="e.g. username@kinety.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            // required
                            disabled={isLoading}
                          />
                          {invalidEmail && (
                            <div className="invalid-feedback">
                              Please enter a valid email address.
                            </div>
                          )}
                        </div>

                        <div className="mb-4">
                          <button
                            type="submit"
                            className="btn btn-lg w-100 send-email-btn"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <i className="fas fa-spinner fa-spin me-2"></i>
                                Sending...
                              </>
                            ) : (
                              "Send Email"
                            )}
                          </button>
                        </div>

                        <div className="text-center">
                          <Link
                            to="/"
                            className="text-decoration-none back-to-login"
                          >
                            <i className="fas fa-arrow-left me-2"></i>
                            Back to Login
                          </Link>
                        </div>
                      </form>
                    </>
                  )}

                  {/* OTP Step */}
                  {currentStep === "otp" && (
                    <>
                      <div className="alert alert-success border-0 mb-4 success-alert">
                        <div className="d-flex align-items-center">
                          <i
                            className="fas fa-check-circle me-2"
                            style={{ color: "#28a745" }}
                          ></i>
                          <div>
                            <strong>Email sent successfully!</strong>
                            <div className="small mt-1">
                              We've sent a 6-digit verification code to{" "}
                              <strong>{email}</strong>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-center mb-4">
                        <div className="otp-illustration">
                          <i
                            className="fas fa-envelope-open-text illustration-icon"
                            style={{ color: "var(--ui-accent)" }}
                          ></i>
                        </div>
                      </div>

                      <div className="text-center mb-4">
                        <h3 className="fw-bold mb-3 forgot-title">
                          Enter Verification Code
                        </h3>
                        <p className="text-muted forgot-subtitle">
                          Please enter the 6-digit code sent to your email
                        </p>
                      </div>

                      {/* OTP Form */}
                      <form onSubmit={handleOtpSubmit}>
                        <div className="mb-4">
                          <div className="otp-input-container d-flex justify-content-between">
                            {otp.map((digit, index) => (
                              <input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                className="form-control otp-input text-center"
                                value={digit}
                                onChange={(e) =>
                                  handleOtpChange(index, e.target.value)
                                }
                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                maxLength="1"
                                disabled={isLoading}
                                pattern="[0-9]"
                              />
                            ))}
                          </div>
                        </div>

                        <div className="text-center mb-4">
                          <span className="text-muted small">
                            Didn't receive the code?{" "}
                          </span>
                          <button
                            type="button"
                            className="btn btn-link p-0 resend-btn"
                            onClick={handleResendOtp}
                            disabled={isLoading}
                          >
                            Resend OTP
                          </button>
                        </div>

                        <div className="mb-4">
                          <button
                            type="submit"
                            className="btn btn-lg w-100 send-email-btn"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <i className="fas fa-spinner fa-spin me-2"></i>
                                Verifying...
                              </>
                            ) : (
                              "Verify & Reset Password"
                            )}
                          </button>
                        </div>

                        <div className="text-center">
                          <button
                            type="button"
                            className="btn btn-link back-to-login p-0"
                            onClick={handleBackToEmail}
                          >
                            <i className="fas fa-arrow-left me-2"></i>
                            Back to Email
                          </button>
                        </div>
                      </form>
                    </>
                  )}

                  {/* Footer */}
                  {/* <div className="text-center mt-5">
                    <small className="text-muted">
                      <a
                        href="#"
                        className="text-decoration-none text-muted me-3"
                      >
                        Terms of Service
                      </a>
                      <a href="#" className="text-decoration-none text-muted">
                        Privacy Policy
                      </a>
                    </small>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;
