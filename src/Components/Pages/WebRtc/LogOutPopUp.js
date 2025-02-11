import React from "react";

export default function LogOutPopUp({ handleLogOut, setAllLogOut }) {
  return (
    <div className="addNewContactPopup">
      <div className="row">
        <div className="col-12 heading mb-0">
          <h5>Are you sure you want to logout from all the respective Call Centers?</h5>
        </div>

        <div className="col-xl-12 mt-2">
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
              onClick={()=>handleLogOut()}
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
  );
}
