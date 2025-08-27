import React, { useEffect, useState } from "react";
import GoogleTranslate from "./GoogleTranslate";
import { Link, useNavigate } from "react-router-dom";
import { generalPostFunction } from "../GlobalFunction/globalFunction";
import { toast } from "react-toastify";
import CircularLoader from "../Loader/CircularLoader";
import { useSelector } from "react-redux";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [currentStep, setCurrentStep] = useState("email"); // 'email' or 'otp'
  const [isLoading, setIsLoading] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const account = useSelector((state) => state.account);
  const userCountry = localStorage.getItem("userCountry");
  const userLanguage = localStorage.getItem("userLanguage");
  const [languageChangePopup, setLanguageChangePopup] = useState(false);

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
      //   await new Promise((resolve) => setTimeout(resolve, 2000));

      // If API is successful, move to OTP step
      //   setCurrentStep("otp");
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
    if (value.length > 1) return; // Prevent multiple characters

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
      // Simulate OTP verification API call
      //   await new Promise((resolve) => setTimeout(resolve, 2000));
      const apiData = await generalPostFunction("/verifyOTP", {
        email: email,
        otp: otpValue,
      });
      if (apiData?.status) {
        localStorage.setItem("token", apiData?.token);
        // const token = localStorage.getItem("token");
        const token = apiData?.token;
        if (token && account) {
          if (account?.user_role?.roles?.name === "Agent") {
            navigate("/webrtc");
          } else if (
            account?.user_role?.roles?.name.toLowerCase() === "employee"
          ) {
            navigate("/messages");
          } else {
            if (userCountry == "AE" && userLanguage !== "ar") {
              handleLanguageChange();
            } else {
              navigate("/dashboard");
            }
          }
        } else {
          navigate("/");
        }
        //   toast.success("Password reset successful! You will be redirected to login.");
      }
      //   console.log("OTP verified:", otpValue);
      //   alert("Password reset successful! You will be redirected to login.");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Invalid OTP. Please try again.");
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
                      {/* Illustration */}
                      <div className="text-center mb-4">
                        <div className="forgot-password-illustration">
                          <i className="fas fa-key illustration-icon"></i>
                          <i className="fas fa-arrow-right arrow-icon"></i>
                        </div>
                      </div>

                      {/* Title and Description */}
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
                      {/* Success Message */}
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

                      {/* OTP Illustration */}
                      <div className="text-center mb-4">
                        <div className="otp-illustration">
                          <i
                            className="fas fa-envelope-open-text illustration-icon"
                            style={{ color: "var(--ui-accent)" }}
                          ></i>
                        </div>
                      </div>

                      {/* Title */}
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
                        {/* OTP Input Fields */}
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

                        {/* Resend OTP */}
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

                        {/* Submit Button */}
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

                        {/* Back to Email */}
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
                  <div className="text-center mt-5">
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
                  </div>
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
