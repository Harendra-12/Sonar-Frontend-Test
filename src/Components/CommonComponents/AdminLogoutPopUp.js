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
        <div className="popup loggedPopupSm" style={{ backgroundColor: "#000000e0" }}>
            <div className="container h-100">
                <div className="row h-100 justify-content-center align-items-center">
                    <div className="row content col-xl-4 col-md-5 align-items-center justify-content-center flex-column">
                        <div className="col-2 px-0">
                            <div className="iconWrapper log__warning mb-3">
                                <img className=" " src={require('../assets/images/crisis.png')} />
                            </div>
                        </div>
                        <div className="col-10 ps-0 px-0">
                            <h4 className="mb-2 text-center">Warning!</h4>
                            <p className='text-center'>You have been logged out by Admin!</p>
                            <div className="d-flex justify-content-center align-items-center mt-3 logoutPopup">
                                {/* <button className="panelButton m-0" onClick={handleLogout}>
                                    <span className="text">Ok</span>
                                    <span className="icon">
                                        <i className="fa-solid fa-check" />
                                    </span>
                                </button> */}
                                <button type="button" class="btn btn_info">
                                    <span>Ok</span>
                                <i class="fa-solid fa-power-off "></i>
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
