import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

function AllActiveAgentStatus({ isActiveAgentsOpen, setIsActiveAgentsOpen }) {
    const allUser = useSelector((state) => state.allUser);
    const activeCall = useSelector((state) => state.activeCall);
    const logonUser = useSelector((state) => state.loginUser);
    const [onlineUser, setOnlineUSer] = useState([0]);

    useEffect(() => {
        if (logonUser && logonUser.length > 0) {
            setOnlineUSer(
                logonUser.map((item) => {
                    return item.id;
                })
            );
        }
    }, [logonUser])

    return (
        <>
            <div className="callDashParkedCalls" style={{ transform: isActiveAgentsOpen ? 'translate(0, -50%)' : 'translate(97%, -50%)' }}>
                <button onClick={() => setIsActiveAgentsOpen(!isActiveAgentsOpen)} className="callDashParkedCallsBtn">
                    <i className={`fa-solid fa-chevron-${isActiveAgentsOpen ? "right" : "left"}`} />
                </button>
                <div className="overviewTableWrapper p-0">
                    <div className="overviewTableChild">
                        <div className="d-flex flex-wrap">
                            <div className="col-12">
                                <div className="heading">
                                    <div className="content">
                                        <h4>Agent Status</h4>
                                        <p>You can see all of the active and inactive agents here</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12" style={{ padding: '0px 10px 0px' }}>
                                <nav className="tangoNavs">
                                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                        <button
                                            className="nav-link active"
                                            id="nav-online-tab"
                                            data-bs-toggle="tab"
                                            data-bs-target="#nav-online"
                                            type="button"
                                            role="tab"
                                            aria-controls="nav-online"
                                            aria-selected="true"
                                        >
                                            Online
                                        </button>
                                        <button
                                            className="nav-link"
                                            id="nav-offline-tab"
                                            data-bs-toggle="tab"
                                            data-bs-target="#nav-offline"
                                            type="button"
                                            role="tab"
                                            aria-controls="nav-offline"
                                            aria-selected="false"
                                        >
                                            Offline
                                        </button>
                                    </div>
                                </nav>
                                <div
                                    className="tab-content mt-3"
                                    id="nav-tabContent"
                                    style={{
                                        borderTop: "none",
                                        borderRadius: "0px 0px 5px 5px"
                                    }}
                                >
                                    <div
                                        className="tab-pane fade show active"
                                        id="nav-online"
                                        role="tabpanel"
                                        aria-labelledby="nav-online-tab"
                                        tabIndex={0}
                                    >
                                        <div className="tableContainer mt-0">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Status</th>
                                                        <th>Name</th>
                                                        <th>Direction</th>
                                                        <th>Origin</th>
                                                        <th>Dest</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {allUser?.data?.length > 0 &&
                                                        allUser?.data?.filter((agent) => agent?.extension_id !== null)
                                                            .filter((agent) => onlineUser.includes(agent?.id))
                                                            .map((agent, index) => {
                                                                const activeCallsForAgent = activeCall.filter((call) => call?.dest || call?.cid_name === agent?.extension?.extension);

                                                                const getCallStatus = () => {
                                                                    if (activeCallsForAgent.length === 0) return null;

                                                                    const activeCall = activeCallsForAgent.filter((call) => !(call?.b_callstate !== "ACTIVE" && call?.callstate === "ACTIVE"));

                                                                    if (!activeCall) return null;

                                                                    if (activeCall[0]?.b_callstate === "ACTIVE") {
                                                                        return {
                                                                            status: "In Call",
                                                                            direction: activeCall[0]?.direction,
                                                                            duration: activeCall[0]?.duration,
                                                                            from: activeCall[0]?.cid_name ?
                                                                                activeCall[0]?.cid_name :
                                                                                activeCall[0]?.b_cid_num,
                                                                            to: activeCall[0]?.dest
                                                                        };
                                                                    }
                                                                    return null;
                                                                };

                                                                const callStatus = getCallStatus();

                                                                return (
                                                                    <tr>
                                                                        <td>
                                                                            <div className="d-flex align-items-center">
                                                                                <span className={`extensionStatus ${callStatus?.status === 'In Call' ? 'onCall' : onlineUser.includes(agent?.id) ? 'online' : 'offline'}`}></span>
                                                                                <span className="ms-1">{callStatus?.status === 'In Call' ? 'On Call' : onlineUser.includes(agent?.id) ? 'Online' : 'Offline'}</span>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div className="d-flex align-items-center">
                                                                                <div className="tableProfilePicHolder">
                                                                                    {agent?.profile_picture ? (
                                                                                        <img
                                                                                            src={agent?.profile_picture}
                                                                                            onError={(e) => e.target.src = require('../../assets/images/placeholder-image.webp')}
                                                                                        />
                                                                                    ) : (
                                                                                        <i className="fa-light fa-user" />
                                                                                    )}
                                                                                </div>
                                                                                <div className="ms-2">{agent?.name}</div>
                                                                            </div>
                                                                        </td>
                                                                        <td style={{ textTransform: 'capitalize' }}>
                                                                            {callStatus && (
                                                                                <>
                                                                                    <i class={`fa-solid fa-${callStatus?.direction === 'internal' ? 'headset' : callStatus?.direction === 'inbound' ? 'phone-arrow-down-left' : callStatus?.direction === 'outbound' ? 'phone-arrow-up-right' : 'phone'} me-1`}
                                                                                        style={{ color: callStatus?.direction === 'internal' ? 'var(--color2)' : callStatus?.direction === 'inbound' ? 'var(--funky-boy3)' : callStatus?.direction === 'outbound' ? 'var(--color3)' : 'var(--color2)' }}></i>
                                                                                    {callStatus?.direction}
                                                                                </>
                                                                            )}
                                                                        </td>
                                                                        <td>{callStatus?.from}</td>
                                                                        <td>{callStatus?.to}</td>
                                                                    </tr>
                                                                )
                                                            })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div
                                        className="tab-pane fade"
                                        id="nav-offline"
                                        role="tabpanel"
                                        aria-labelledby="nav-offline-tab"
                                        tabIndex={0}
                                    >
                                        <div className="tableContainer mt-0">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Status</th>
                                                        <th>Name</th>
                                                        <th>Extension</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {allUser?.data?.length > 0 &&
                                                        allUser?.data?.filter((agent) => agent?.extension_id !== null && !onlineUser.includes(agent?.id))
                                                            // .filter((agent) => )
                                                            .map((agent, index) => {
                                                                return (
                                                                    <tr>
                                                                        <td>
                                                                            <div className="d-flex align-items-center">
                                                                                <span className={"extensionStatus offline"}></span>
                                                                                <span className="ms-1">Offline</span>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div className="d-flex align-items-center">
                                                                                <div className="tableProfilePicHolder">
                                                                                    {agent?.profile_picture ? (
                                                                                        <img
                                                                                            src={agent?.profile_picture}
                                                                                            onError={(e) => e.target.src = require('../../assets/images/placeholder-image.webp')}
                                                                                        />
                                                                                    ) : (
                                                                                        <i className="fa-light fa-user" />
                                                                                    )}
                                                                                </div>
                                                                                <div className="ms-2">{agent?.name}</div>
                                                                            </div>
                                                                        </td>
                                                                        <td>{agent?.extension?.extension}</td>
                                                                    </tr>
                                                                )
                                                            })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AllActiveAgentStatus