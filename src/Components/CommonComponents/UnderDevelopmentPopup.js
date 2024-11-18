import React, { useState } from 'react'

function UnderDevelopmentPopup() {
    const [popup, setPopup] = useState(false);
    return (
        <div className="popup">
            <div className="container h-100">
                <div className="row h-100 justify-content-center align-items-center">
                    <div className="row content col-xl-4">
                        <div className="col-2 px-0">
                            <div className="iconWrapper">
                                <i className="fa-duotone fa-triangle-exclamation"></i>
                            </div>
                        </div>
                        <div className="col-10 ps-0">
                            <h4>Warning!</h4>
                            <p>
                                {error
                                    ? error
                                    : selectedUser?.id
                                        ? `Are you sure you want to ${selectedUser?.status === "E" ? "disable" : "enable"
                                        } ${selectedUser?.username}?`
                                        : ""}
                            </p>
                            <div className="d-flex justify-content-between">
                                <button
                                    className="panelButton gray m-0 float-end"
                                    onClick={() => setPopup(false)}
                                >
                                    <span className="text">Ok</span>
                                    <span className="icon">
                                        <i className="fa-solid fa-exclamation"></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UnderDevelopmentPopup