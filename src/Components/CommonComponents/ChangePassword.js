import React, { useState } from "react";
import { backToTop, generalPostFunction } from "../GlobalFunction/globalFunction";
import { ToastContainer, toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
import CircularLoader from "../Loader/CircularLoader";
import Header from "./Header";
import { useSelector } from "react-redux";

function ChangePassword() {
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
      const apiData = await generalPostFunction("/change-password", parsedData);
      if (apiData?.status) {
        setLoading(false);
        toast.success(apiData.message);
      } else {
        setLoading(false);
        // const errorMessage = Object.keys(apiData.errors);
        // toast.error(apiData.errors[errorMessage[0]][0]);
      }
    }
  }

  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid px-0">
          <Header title="Change Password" />
        </div>

        <div className="overviewTableWrapper">
          <div className="overviewTableChild">
            <div className="d-flex flex-wrap">
              <div className="col-12">
                <div className="heading">
                  <div className="content">
                    <h4>Change Password</h4>
                    <p>Change your account password.</p>
                  </div>
                  <div className="buttonGroup">
                    <button
                      onClick={() => {
                        navigate(-1);
                        backToTop();
                      }}
                      type="button"
                      effect="ripple"
                      className="panelButton gray"
                    >
                      <span className="text">Back</span>
                      <span className="icon"><i class="fa-solid fa-caret-left"></i></span>
                    </button>
                    <button
                      type="button"
                      effect="ripple"
                      className="panelButton"
                      onClick={handleSubmit}
                    >
                      <span className="text">Save</span>
                      <span className="icon"><i class="fa-solid fa-floppy-disk"></i></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12" style={{ padding: '25px 23px', borderBottom: '1px solid #ddd' }}>
              <form>
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <div>
                      <label className="text-dark">Current Password</label>
                      {errorOldPassword ? (
                        <label className="status missing">Field Missing</label>
                      ) : (
                        ""
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="data"
                        className="formItemDesc"
                        style={{ fontSize: 12, lineHeight: "18px", marginTop: 5 }}
                      >
                        This is your current password.
                      </label>
                    </div>
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      name="extension"
                      className="formItem"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <div>
                      <label className="text-dark">New Password</label>
                      {errorNewPassword ? (
                        <label className="status missing">
                          Password must be at least 6 characters
                        </label>
                      ) : (
                        ""
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="data"
                        className="formItemDesc"
                        style={{ fontSize: 12, lineHeight: "18px", marginTop: 5 }}
                      >
                        Please input your preferred new password.
                      </label>
                    </div>
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      name="extension"
                      className="formItem"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <div>
                      <label className="text-dark">Confirm Password</label>
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
                        style={{ fontSize: 12, lineHeight: "18px", marginTop: 5 }}
                      >
                        Please retype your password.
                      </label>
                    </div>
                  </div>
                  <div className="col-6">
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
          </div>
        </div>
        {loading ? <CircularLoader /> : ""}
      </section>
      {/* <ToastContainer
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
      /> */}
    </main>
  );
}

export default ChangePassword;
