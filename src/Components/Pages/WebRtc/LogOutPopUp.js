import React from "react";

export default function LogOutPopUp({ handleLogOut, setAllLogOut }) {
  return (
    <div className="popup">
      <div className="container h-100">
        <div className="row h-100 justify-content-center align-items-center">
          <div className="row content col-xl-4 col-md-5">
            <div className="col-2 px-0">
              <div className="iconWrapper">
                <i className="fa-duotone fa-triangle-exclamation" />
              </div>
            </div>
            <div className="col-10 ps-0">
              <h4>Warning!</h4>
              <p>Are you sure you want to logout from all the respective Call Centers?</p>
              <div className="d-flex justify-content-between">
                <button
                  className="panelButton gray ms-0"
                  onClick={() => setAllLogOut(false)}
                >
                  <span className="text">Cancel</span>
                  <span className="icon">
                    <i className="fa-light fa-xmark"></i>
                  </span>
                </button>

                <button
                  onClick={() => handleLogOut()}
                  className="panelButton"
                >
                  <span className="text">Ok</span>
                  <span className="icon">
                    <i className="fa-solid fa-check" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
