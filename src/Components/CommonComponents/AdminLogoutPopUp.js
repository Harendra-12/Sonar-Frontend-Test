import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'

function AdminLogoutPopUp() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Logic to handle remove all states and redirect to login page
    function handleLogout() {
        localStorage.clear();
        dispatch({ type: "RESET_STATE" });
        dispatch({ type: "SET_ADMIN_LOGOUT", adminLogout: false });
        navigate("/");
    }
    return (
        <div className="popup" style={{ backgroundColor: "#000000e0" }}>
            <div className="container h-100">
                <div className="row h-100 justify-content-center align-items-center">
                    <div className="row content col-xl-4 col-md-5">
                        <div className="col-2 px-0">
                            <div className="iconWrapper">
                                <i className="fa-duotone fa-triangle-exclamation text-danger" />
                            </div>
                        </div>
                        <div className="col-10 ps-0">
                            <h4 className="mb-2">Warning!</h4>
                            <p>You have been logged out by Admin!</p>
                            <div className="d-flex justify-content-between mt-3">
                                <button className="panelButton m-0" onClick={handleLogout}>
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
    )
}

export default AdminLogoutPopUp
