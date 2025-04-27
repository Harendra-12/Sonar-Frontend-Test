import React, { useState } from 'react'
import DarkModeToggle from '../../CommonComponents/DarkModeToggle';
import { featureUnderdevelopment, logout } from '../../GlobalFunction/globalFunction';
import { useSIPProvider } from 'modify-react-sipjs';
import { useDispatch, useSelector } from 'react-redux';

function HeaderApp({ title, loading, setLoading, refreshApi }) {
    const allCallCenterIds = useSelector((state) => state.allCallCenterIds);
    const [allLogOut, setAllLogOut] = useState(false);
    const { sessionManager, connectStatus } = useSIPProvider();
    const dispatch = useDispatch();


    // Function to handle logout
    const handleLogOut = async () => {
        setLoading(true);
        try {
            const apiResponses = await logout(
                allCallCenterIds,
                dispatch,
                sessionManager
            );
        } catch (error) {
            console.error("Unexpected error in handleLogOut:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="newHeader">
                <div className="col-auto" style={{ padding: "0 10px" }}>
                    <h3 style={{ fontFamily: "Outfit", marginBottom: "0" }}>
                        {title}{" "}
                        {title !== "Call Dashboard" || title !== "Call Center" || title !== "WhatsApp" &&
                            <button
                                className="clearButton2"
                                onClick={() => {
                                    if (!loading) {
                                        refreshApi();
                                    }
                                }}
                            >
                                <i
                                    className={
                                        loading
                                            ? "fa-regular fa-arrows-rotate fs-5 fa-spin"
                                            : "fa-regular fa-arrows-rotate fs-5 "
                                    }
                                    style={{ color: "var(--webUtilGray)" }}
                                ></i>
                            </button>
                        }
                    </h3>
                </div>
                <div className="d-flex justify-content-end align-items-center">
                    {/* <div className="col-9">
                        <input
                            type="search"
                            name="Search"
                            placeholder="Search users, groups or chat"
                            className="formItem fw-normal"
                            onChange={() => featureUnderdevelopment()}
                            style={{ backgroundColor: "var(--searchBg)" }}
                        />
                    </div> */}
                    <div className="col-auto ms-2">
                        <button
                            className="clearButton2 xl"
                            effect="ripple"
                            onClick={() => featureUnderdevelopment()}
                        >
                            <i className="fa-regular fa-bell" />
                        </button>
                    </div>
                    <DarkModeToggle marginLeft={"2"} />
                    <div className="col-auto">
                        <div className="dropdown">
                            <div
                                className="myProfileWidget"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                {/* <div className="profileHolder" id="profileOnlineNav">
                                    <img
                                      src={account?.profile_picture}
                                      alt="profile"
                                      onError={(e) => e.target.src = require('../../assets/images/placeholder-image.webp')}
                                    />
                                  </div> */}
                                {/* <div className="profileName">
                                    {account?.username}{" "}
                                    <span className="status">Available</span>
                                  </div> */}


                                <i class="fa-solid fa-right-from-bracket"></i>
                            </div>
                            <ul className="dropdown-menu">
                                <li
                                    onClick={() => {
                                        if (allCallCenterIds.length > 0) {
                                            setAllLogOut(true);
                                        } else {
                                            handleLogOut();
                                        }
                                    }}
                                >
                                    <div
                                        className="dropdown-item"
                                        style={{ cursor: "pointer" }}
                                    >
                                        Logout
                                    </div>
                                </li>
                                <li
                                    onClick={() => {
                                        sessionManager.disconnect();
                                    }}
                                >
                                    <div
                                        className="dropdown-item"
                                        style={{ cursor: "pointer" }}
                                    >
                                        Disconnect
                                    </div>
                                </li>
                                <li
                                    onClick={() => {
                                        sessionManager.connect();
                                    }}
                                >
                                    <div
                                        className="dropdown-item"
                                        style={{ cursor: "pointer" }}
                                    >
                                        Reconnect
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HeaderApp