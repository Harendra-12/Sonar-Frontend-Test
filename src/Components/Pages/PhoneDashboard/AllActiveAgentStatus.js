import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { generalGetFunction, generalPostFunction } from '../../GlobalFunction/globalFunction';
import { useSIPProvider } from 'modify-react-sipjs';
import { toast } from 'react-toastify';

/**
 * AllActiveAgentStatus
 * 
 * This component displays the status of all agents, showing online and offline agents, as well as their call status.
 * It integrates with the Redux store to fetch data about users, active calls, and registered users.
 * The component provides a UI to toggle between viewing active and inactive agents.
 * 
 * Props:
 * @param {boolean} isActiveAgentsOpen - A flag to indicate if the active agents section is open.
 * @param {function} setIsActiveAgentsOpen - Function to toggle the active agents section.
 * 
 * Redux State:
 * - allUser: List of all users.
 * - allUserRefresh: Flag to trigger refresh of user data.
 * - activeCall: Data about active calls.
 * - logonUser: Logged-in user's data.
 * - registerUser: List of registered users.
 * 
 * Local State:
 * - onlineUser: List of online users.
 * 
 * Effects:
 * - Refreshes user data if required.
 * - Updates online users based on registered users and current logon state.
 * 
 * UI:
 * - Displays a button to toggle the active agents section.
 * - Shows a tab navigation to switch between online and offline agents.
 * - Displays tables listing agents with their status, name, direction, origin, and destination.
 * - Indicates call status with icons and styles based on call direction.
 */

function AllActiveAgentStatus({ isActiveAgentsOpen, setIsActiveAgentsOpen, isActiveCallsPage, isParentWebRtc }) {
    // const allUser = useSelector((state) => state.allUser);
    // const allUserRefresh = useSelector((state) => state.allUserRefresh);

    const account = useSelector((state) => state.account);
    const activeCall = useSelector((state) => state.activeCall);
    const logonUser = useSelector((state) => state.loginUser);
    const registerUser = useSelector((state) => state.registerUser || []);
    const [onlineUser, setOnlineUSer] = useState([]);
    const [allUser, setAllUser] = useState();
    const dispatch = useDispatch();

    const extension = account?.extension?.extension || null;
    const [allParkedCall, setAllParkedCall] = useState([]);

    // Search All Users
    async function getData() {
        const userApi = await generalGetFunction(`/user/search?account=${account.account_id}`);
        if (userApi?.status) {
            setAllUser(userApi.data);
        }
    }

    useEffect(() => {
        if (!allUser || allUser.length === 0) {
            getData();
        }
        if (logonUser && logonUser.length > 0) {
            setOnlineUSer(
                registerUser.map((item) => {
                    return item.extension;
                })
            );
        }
    }, [logonUser])

    // Parked Calls Shenanigans
    useEffect(() => {
        //dest should start with "set:valet_ticket"
        setAllParkedCall(
            activeCall.filter(
                (call) =>
                    (call.dest.includes("set:valet_ticket") || call.dest.includes("*")) && (call.b_callee_direction !== "ACTIVE" || call.b_callee_direction !== "HELD")
            )
        );
    }, [activeCall]);

    function extractLastNumber(inputString) {
        const regex = /(\d+)\s*$/; // Regular expression to match the last number after a space

        const match = inputString.match(regex);

        if (match) {
            return match[1]; // Return the matched number
        } else {
            return null;
        }
    }

    const handleUnPark = async (parkedNumber) => {
        if (!parkedNumber) {
            return;
        }
        const payload = {
            unpark_slot: parkedNumber,
            user: extension,
        };

        //call a post api
        const unparkResponse = await generalPostFunction(
            "/freeswitch/call-unpark",
            payload
        );

        if (unparkResponse) {
            toast.success(unparkResponse.message);
        }
    };


    return (
        <>
            <div className="callDashParkedCalls static"
                style={!isActiveCallsPage ? { transform: isActiveAgentsOpen ? 'translate(0, -50%)' : 'translate(98%, -50%)' } : undefined}
            >
                {!isActiveCallsPage && <button onClick={() => setIsActiveAgentsOpen(!isActiveAgentsOpen)} className="callDashParkedCallsBtn">
                    <i className={`fa-solid fa-chevron-${isActiveAgentsOpen ? "right" : "left"}`} />
                </button>}
                <div className="overviewTableWrapper p-0">
                    <div className="overviewTableChild">
                        <div className="d-flex flex-wrap">
                            <div className="col-12">
                                <div className="heading" style={isActiveCallsPage ? { paddingLeft: '55px' } : undefined}>
                                    <div className="content">
                                        <h4>{isParentWebRtc ? 'Additional Info' : 'Agent Status'}</h4>
                                        <p>{`You can see all of the ${isParentWebRtc ? 'parked calls & agent activity status' : 'active and inactive agents'} here`}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12" style={{ padding: '0px 10px 0px' }}>
                                {isParentWebRtc && <nav className="tangoNavs mb-2">
                                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                        <button className="nav-link active" id="nav-agent-tab" data-bs-toggle="tab" data-bs-target="#nav-agent" type="button" role="tab">
                                            Agent
                                        </button>
                                        <button className="nav-link" id="nav-parked-tab" data-bs-toggle="tab" data-bs-target="#nav-parked" type="button" role="tab">
                                            Parked
                                        </button>
                                    </div>
                                </nav>}
                                <div className="tab-content" id="nav-tabContent">
                                    <div className="tab-pane fade show active" id="nav-agent" role="tabpanel" tabindex="0">
                                        <div className="col-12">
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
                                                    <div className="tableContainer mt-0" style={isActiveCallsPage ? { width: '425px' } : undefined}>
                                                        <table>
                                                            <thead>
                                                                <tr>
                                                                    <th>Status</th>
                                                                    <th>Name</th>
                                                                    <th>Direction</th>
                                                                    <th>Origin</th>
                                                                    <th>Route</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {allUser?.length > 0 &&
                                                                    allUser?.filter((agent) => agent?.extension_id !== null)
                                                                        .filter((agent) => onlineUser.includes(agent?.extension?.extension))
                                                                        .map((agent, index) => {
                                                                            const activeCallsForAgent = activeCall.filter((call) => call?.dest === agent?.extension?.extension || call?.b_presence_id?.split("@")[0] === agent?.extension?.extension || call?.cid_name === agent?.extension?.extension);

                                                                            const getCallStatus = () => {
                                                                                if (activeCallsForAgent.length === 0) return null;

                                                                                const activeCall = activeCallsForAgent.filter((call) => call?.b_callstate === "ACTIVE" || call?.b_callstate === "HELD" || call?.callstate !== "ACTIVE");

                                                                                if (!activeCall) return null;

                                                                                if (activeCall[0]?.b_callstate === "ACTIVE" || activeCall[0]?.b_callstate === "HELD" || activeCall[0]?.callstate === "HELD") {
                                                                                    return {
                                                                                        status: activeCall[0]?.callstate === "HELD" || activeCall[0]?.b_callstate === "HELD" ? "On Hold" : "In Call",
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
                                                                                            <span className={`extensionStatus ${callStatus?.status === 'In Call' || callStatus?.status === 'On Hold' ? 'onCall' : onlineUser.includes(agent?.extension?.extension) ? 'online' : 'offline'}`}></span>
                                                                                            <span className="ms-1">{callStatus?.status === 'In Call' ? 'On Call' : callStatus?.status === 'On Hold' ? 'On Hold' : onlineUser.includes(agent?.extension?.extension) ? 'Online' : 'Offline'}</span>
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
                                                    <div className="tableContainer mt-0" style={{ width: '425px' }}>
                                                        <table>
                                                            <thead>
                                                                <tr>
                                                                    <th>Status</th>
                                                                    <th>Name</th>
                                                                    <th>Extension</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {allUser?.length > 0 &&
                                                                    allUser?.filter((agent) => agent?.extension_id !== null && !onlineUser.includes(agent?.extension?.extension))
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
                                    {isParentWebRtc && <div className="tab-pane fade" id="nav-parked" role="tabpanel" tabindex="0">
                                        <div className="col-12">
                                            <div className="tableContainer mt-0">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>Called ID</th>
                                                            <th>Parked By</th>
                                                            <th>Parked At</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {allParkedCall.length > 0 &&
                                                            allParkedCall.map((call) => {
                                                                return (
                                                                    <tr>
                                                                        <td>{call.cid_num}</td>

                                                                        <td>{extractLastNumber(call?.parked_by)}</td>
                                                                        <td>
                                                                            {call?.dest.includes("set:valet_ticket")
                                                                                ? extractLastNumber(call?.accountcode)
                                                                                : extractLastNumber(call?.dest)}
                                                                        </td>
                                                                        <td>
                                                                            <button
                                                                                onClick={() =>
                                                                                    handleUnPark(
                                                                                        call?.dest.includes(
                                                                                            "set:valet_ticket"
                                                                                        )
                                                                                            ? extractLastNumber(
                                                                                                call?.accountcode
                                                                                            )
                                                                                            : extractLastNumber(call?.dest)
                                                                                    )
                                                                                }
                                                                            >
                                                                                Unpark
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>}
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