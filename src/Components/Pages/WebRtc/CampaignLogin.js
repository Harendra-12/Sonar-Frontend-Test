import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import LogOutPopUp from './LogOutPopUp';
import { featureUnderdevelopment, logout } from '../../GlobalFunction/globalFunction';
import { useSIPProvider } from 'modify-react-sipjs';
import DarkModeToggle from '../../CommonComponents/DarkModeToggle';
import HeaderApp from './HeaderApp';

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
                <div className={" px-0"}>
                    <HeaderApp title={"Campaign"} loading={loading} setLoading={setLoading} refreshApi={() => featureUnderdevelopment()} />
                </div>
                <div className="container-fluid">
                    <div className="row webrtc_newMessageUi">
                        <div className="overviewTableWrapper p-0 ">
                            <div className="overviewTableChild shadow-none">
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
                                        className="col-12 p-3"
                                    // style={{ padding: "25px 20px 0px" }}
                                    >
                                        <div className="tableContainer mt-0 mb-0">
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