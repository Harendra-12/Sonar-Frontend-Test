import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import LogOutPopUp from './LogOutPopUp';
import { featureUnderdevelopment, logout } from '../../GlobalFunction/globalFunction';
import { useSIPProvider } from 'modify-react-sipjs';
import DarkModeToggle from '../../CommonComponents/DarkModeToggle';

function CampaignLogin({ initial }) {
    const sessions = useSelector((state) => state.sessions);
    const [allLogOut, setAllLogOut] = useState(false);
    const [loading, setLoading] = useState(true);
    const allCallCenterIds = useSelector((state) => state.allCallCenterIds);
    const { sessionManager } = useSIPProvider();
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
            <style>
                {`
            .callDashboardPrimTable{
                height: calc(100vh - 70px);
                }
            `}
            </style>
            <main
                className={"mainContentApp"}
                style={{
                    marginRight:
                        sessions.length > 0 && Object.keys(sessions).length > 0
                            ? "250px"
                            : "0",
                }}
            >
                {allLogOut && (
                    <LogOutPopUp
                        setAllLogOut={setAllLogOut}
                        handleLogOut={handleLogOut}
                    />
                )}
                <div className="container-fluid">
                    <div className="row">
                        <div className={"col-12 px-0"}>
                            <div className="newHeader">
                                <div className="col-auto" style={{ padding: "0 10px" }}>
                                    <h3 style={{ fontFamily: "Outfit", marginBottom: "0" }}>
                                        Campaign{" "}
                                    </h3>
                                </div>
                                <div className="d-flex justify-content-end align-items-center">
                                    <div className="col-9">
                                        <input
                                            type="search"
                                            name="Search"
                                            placeholder="Search users, groups or chat"
                                            className="formItem fw-normal"
                                            style={{ backgroundColor: "var(--searchBg)" }}
                                        />
                                    </div>
                                    <div className="col-auto ms-2">
                                        <button className="clearButton2 xl" effect="ripple">
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
                        </div>
                        <div className="overviewTableWrapper">
                            <div className="overviewTableChild">
                                <div className="d-flex flex-wrap">
                                    <div className={!initial ? "col-12" : "col-12 d-none"}>
                                        <div className="heading">
                                            <div className="content">
                                                <h4>
                                                    Campaigns{" "}
                                                    <button className="clearButton2" onClick={() => featureUnderdevelopment()}>
                                                        <i className="fa-regular fa-arrows-rotate fs-5"></i>
                                                    </button>
                                                </h4>
                                                <p>You can subscribe to a campaign or change your status here</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="col-12"
                                        style={{ padding: "25px 20px 0px" }}
                                    >
                                        <div className="tableContainer mt-0">
                                            <table className="callCenter">
                                                <thead>
                                                    <tr>
                                                        <th className="sl">#</th>
                                                        <th>Name</th>
                                                        <th className="extension">Extension</th>
                                                        <th className="options">Options</th>
                                                        <th className="options">Break-Timer</th>
                                                        <th className="options">Total-Break</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>1</td>
                                                        <td>Name</td>
                                                        <td>5100</td>
                                                        <td>
                                                            <label className="tableLabel success" onClick={() => featureUnderdevelopment()}>Login</label>
                                                        </td>
                                                        <td>00:00:00</td>
                                                        <td>00:00:00</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default CampaignLogin