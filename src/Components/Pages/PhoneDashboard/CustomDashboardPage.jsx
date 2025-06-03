/* eslint-disable eqeqeq */
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Header from '../../CommonComponents/Header';
import { checkViewSidebar, generalGetFunction } from '../../GlobalFunction/globalFunction';
import CustomDashboardManage from '../Setting/CustomDashboardManage';
// import CircularLoader from '../../Loader/CircularLoader';

/**
 * CustomDashboardPage is a React component that displays and manages active and ringing calls.
 * It provides functionality to filter calls based on various criteria like Ringgroup, CallCenterQueue,
 * and DID, as well as differentiate between active, ringing, total, and missed calls.
 * The component also integrates with state management using Redux and handles dynamic updates
 * and UI interactions for a phone dashboard.
 *
 * Props:
 *   - isParentWebRtc: A boolean indicating whether the parent is a WebRTC component.
 */

function CustomDashboardPage({ isParentWebRtc }) {
    const account = useSelector((state) => state.account);
    const slugPermissions = useSelector((state) => state?.permissions);
    const activeCall = useSelector((state) => state.activeCall);
    const [filter, setFilter] = useState("all");
    const [customModule, setCustomModule] = useState([]);
    const ringingState = activeCall.filter((item) => item.b_callstate === "" && item.callstate === "RINGING");
    const [cdrData, setCdrData] = useState([]);
    const outboundCalls = ringingState.filter(call => call.direction === "outbound" || call.direction === "inbound");
    const numberCount = outboundCalls.reduce((acc, call) => {
        acc[call.did_tag] = (acc[call.did_tag] || 0) + 1;
        return acc;
    }, {});
    const [customPopup, setCustomPopup] = useState(false);
    const [refresh, setRefresh] = useState(0);
    const [selectedModule, setSelectedModule] = useState('');
    const [addNewMod, setAddNewMod] = useState(false);
    const activeState = activeCall.filter((item) => item.b_callstate === "ACTIVE" || item.b_callstate === "HELD");
    const activeoutboundCalls = activeState.filter(call => call.direction === "outbound" || call.direction === "inbound");
    const activenumberCount = activeoutboundCalls.reduce((acc, call) => {
        acc[call.did_tag] = (acc[call.did_tag] || 0) + 1;
        return acc;
    }, {});
    const [usageLoading, setUsageLoading] = useState(false);
    const locationState = useLocation();

    // Location State when redirecting from Phone Dashboard
    useEffect(() => {
        if (locationState.state !== null) {
            if (locationState?.state?.filter === "all") {
                setFilter("all")
            } else if (locationState?.state?.filter === "internal") {
                setFilter("internal")
            } else if (locationState?.state?.filter === "inbound") {
                setFilter("inbound")
            } else if (locationState?.state?.filter === "outbound") {
                setFilter("outbound")
            }
        }
        // console.log(locationState);

    }, [locationState])

    // Getting all custome module for filter on initial phase 
    useEffect(() => {
        async function getCustomModule() {
            setUsageLoading(true);
            const apiData = await generalGetFunction("/usage/all")
            if (apiData.status) {
                setCustomModule(apiData.data);
                setUsageLoading(false); // Stop loader if status is true
            } else {
                setUsageLoading(false); // Stop loader if status is false
            }
            const filterData = await generalGetFunction("/call-details")

            if (filterData.status) {
                setCdrData(filterData.cdr_filters.filter_count)
            }
        }
        getCustomModule()
    }, [refresh])

    // Filter ringing state of a perticular call based on callcenter, ringgroup and DID
    function filterRingingState(type, value) {
        if (type === "Ringgroup") {
            const count = ringingState
                .filter((item) => item.application_state === "ringgroup")
                .reduce((acc, call) => {
                    if (call.dest == value) {
                        acc += 1;
                    }
                    return acc;
                }, 0);
            return count;
        } else if (type === "CallCenterQueue") {
            const count = ringingState
                .filter((item) => item.application_state === "callcenter")
                .reduce((acc, call) => {
                    if (call.dest == value) {
                        acc += 1;
                    }
                    return acc;
                }, 0);
            return count;
        } else {
            const count = ringingState
                .reduce((acc, call) => {
                    if (call.did_num == value) {
                        acc += 1;
                    }
                    return acc;
                }, 0);
            return count;
        }
    }

    // Filter ringing state of a perticular call based on callcenter, ringgroup and DID
    function filterActiveState(type, value) {
        if (type === "Ringgroup") {
            const count = activeState
                .filter((item) => item.application_state === "ringgroup")
                .reduce((acc, call) => {
                    if (call.dest == value) {
                        acc += 1;
                    }
                    return acc;
                }, 0);
            return count;
        } else if (type === "CallCenterQueue") {
            const count = activeState
                .filter((item) => item?.application_state === "callcenter")
                .reduce((acc, call) => {
                    if (call.dest == value) {
                        acc += 1;
                    }
                    return acc;
                }, 0);
            return count;
        } else {
            const count = activeState
                .reduce((acc, call) => {
                    if (call.did_num == value) {
                        acc += 1;
                    }
                    return acc;
                }, 0);
            return count;
        }
    }

    // Filter total calls of a perticular call based on callcenter, ringgroup and DID
    function filterTotalCalls(type, value) {
        if (type === "Ringgroup") {
            const count = cdrData
                .filter((item) => item.application_state === "ringgroup" && item.variable_dialed_extension === value && item["Call-Direction"] !== "missed")[0]?.filter_count
            if (count) {
                return count + filterMissedCalls(type, value);
            } else {
                return 0
            }

        } else if (type === "CallCenterQueue") {
            const count = cdrData
                .filter((item) => item.application_state === "callcenter" && item.variable_dialed_extension === value && item["Call-Direction"] !== "missed")[0]?.filter_count
            if (count) {
                return count + filterMissedCalls(type, value);
            } else {
                return 0
            }
        } else {
            const count = cdrData
                .filter((item) => item.application_state === "pstn" && item.variable_dialed_extension === value && item["Call-Direction"] !== "missed")[0]?.filter_count
            if (count) {
                return count + filterMissedCalls(type, value);
            } else {
                return 0
            }
        }
    }

    // Filter total missed calls of a perticular call based on callcenter, ringgroup and DID
    function filterMissedCalls(type, value) {
        if (type === "Ringgroup") {
            const count = cdrData
                .filter((item) => item.application_state === "ringgroup" && item.variable_dialed_extension === value && item["Call-Direction"] === "missed")[0]?.filter_count
            if (count) {
                return count;
            } else {
                return 0
            }
        } else if (type === "CallCenterQueue") {
            const count = cdrData
                .filter((item) => item.application_state === "callcenter" && item.variable_dialed_extension === value && item["Call-Direction"] === "missed")[0]?.filter_count
            if (count) {
                return count;
            } else {
                return 0
            }
        } else {
            const count = cdrData
                .filter((item) => item.application_state === "pstn" && item.variable_dialed_extension === value && item["Call-Direction"] === "missed")[0]?.filter_count
            if (count) {
                return count;
            } else {
                return 0
            }
        }
    }
    const convertDurationToSeconds = (duration) => {
        const [hours, minutes, seconds] = duration.split(":").map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    };

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${h}:${m}:${s}`;
    };

    const [updatedData, setUpdatedData] = useState([]);
    const startTimestampsRef = useRef(new Map()); // Store start timestamps for each UUID
    const initialDurationsRef = useRef(new Map()); // Store initial durations from backend

    useEffect(() => {
        ringingState.forEach((item) => {
            if (!startTimestampsRef.current.has(item.uuid)) {
                startTimestampsRef.current.set(item.uuid, Date.now());
                initialDurationsRef.current.set(item.uuid, convertDurationToSeconds(item.duration)); // Store initial duration
            }
        });

        const interval = setInterval(() => {
            setUpdatedData((prevData) => {
                return ringingState.map((item) => {
                    const startTimestamp = startTimestampsRef.current.get(item.uuid);
                    const elapsedTime = Math.floor((Date.now() - startTimestamp) / 1000);
                    const initialDuration = initialDurationsRef.current.get(item.uuid) || 0; // Get initial duration

                    // Calculate the correct updated duration without double adding
                    const newDuration = initialDuration + elapsedTime;

                    // Keep other properties unchanged except realTimeDuration
                    return {
                        ...item,
                        realTimeDuration: formatTime(newDuration),
                    };
                });
            });
        }, 0);

        return () => clearInterval(interval);
    }, [ringingState]);

    // Resizeable Layout Functions
    const leftPanel = useRef(null);
    const rightPanel = useRef(null);

    const resetResizeContent = () => {
        if (leftPanel.current && rightPanel.current) {
            leftPanel.current.resize(50);
            rightPanel.current.resize(50);
        }
    }

    const handleResizeLeft = () => {
        if (leftPanel.current) {
            if (leftPanel.current.isCollapsed()) {
                leftPanel.current.resize(50);
            } else {
                leftPanel.current.collapse();
            }
        }
    }

    const handleResizeRight = () => {
        if (rightPanel.current) {
            if (rightPanel.current.isCollapsed()) {
                rightPanel.current.resize(50);
            } else {
                rightPanel.current.collapse();
            }
        }
    }

    const [isActiveAgentsOpen, setIsActiveAgentsOpen] = useState(false);


    return (
        <main className={`mainContent ${isParentWebRtc ? ' ms-0' : ''}`}>
            <section id="phonePage">
                <div className="container-fluid">
                    <div className="row">
                        {!isParentWebRtc && <Header title="Custom Dashboard" />}
                        <div className="overviewTableWrapper p-3">
                            <div className='col-xl-12 mb-3'>
                                <div className='row gy-4'>
                                    {
                                        checkViewSidebar("Usage", slugPermissions, account?.sectionPermissions, account?.permissions, "read") && !usageLoading ?
                                            customModule?.map((item, index) => {
                                                return (
                                                    <div className='col-xxl-2 col-xl-3 col-lg-3 col-md-3 col-12' key={index}>
                                                        <div className={`deviceProvision position-relative balance-box`} >
                                                            <button
                                                                disabled={!checkViewSidebar("Usage", slugPermissions, account?.sectionPermissions, account?.permissions, "edit")}
                                                                className='clearButton2 editBtn' onClick={() => { setSelectedModule(item); setCustomPopup(true); setAddNewMod(false); }}>
                                                                <i className="fa-solid fa-pen" />
                                                            </button>
                                                            <div className="itemWrapper a  datanumber4 shadow-sm p-0">
                                                                <div className="heading h-auto d-block p-3">
                                                                    <div className='d-flex align-items-center justify-content-center flex-column '>
                                                                        <div className='text-center'>
                                                                            <h6 className='fw-semibold mb-0 f-s-14 ellipsisText'>{item?.name}</h6>
                                                                            {/* <p>Type: {item?.model_type}</p> */}
                                                                            <h5 className='ellipsisText'>{item?.model_type === "CallCenterQueue" ? item?.model?.queue_name : item?.model_type === "Ringgroup" ? item?.model?.name : `${item?.model?.did}`}</h5>
                                                                        </div>
                                                                        <div className='text-center ' style={{ paddingBottom: "2px" }}>
                                                                            <p>{item?.model_type}</p>
                                                                            {item?.model?.tag && <p><strong>Tag:</strong> {item?.model?.tag}</p>}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="data-number3 datanumber5 h-auto mt-2 m-2" >
                                                                    <div className="d-flex justify-content-center gap-1 py-2">
                                                                        {
                                                                            item.active ?
                                                                                <div className="col-3 numberActive_box">
                                                                                    <h4 style={{ color: "rgb(51, 136, 247)", fontWeight: 700 }}>
                                                                                        {filterActiveState(item?.model_type, item?.model_type === "CallCenterQueue" ? item?.model?.extension : item?.model_type === "Ringgroup" ? item?.model?.extension : item?.model?.did)}{" "}
                                                                                        {/* <i
                                                                                        className="fa-solid fa-phone-volume ms-1"
                                                                                        style={{ color: "var(--funky-boy4)", fontSize: 17 }}
                                                                                    /> */}
                                                                                    </h4>
                                                                                    <p>Active</p>
                                                                                    {/* <img className=" " src={require('../../assets/images/phone-call.png')} alt='logout' /> */}
                                                                                    {/* <p><i class="fa-solid fa-phone-volume"></i></p> */}
                                                                                </div> : ""
                                                                        }
                                                                        {
                                                                            item?.ringing ?
                                                                                <div className="col-3 numberActive_box">

                                                                                    <h4 style={{ color: "rgb(247, 167, 51)", fontWeight: 700 }}>
                                                                                        {filterRingingState(item?.model_type, item?.model_type === "CallCenterQueue" ? item?.model?.extension : item?.model_type === "Ringgroup" ? item?.model?.extension : item?.model.did)}{" "}
                                                                                        {/* <i
                                                                                        className="fa-solid fa-bell-ring ms-1"
                                                                                        style={{ color: "rgb(1, 199, 142)", fontSize: 17 }}
                                                                                    /> */}
                                                                                    </h4>
                                                                                    <p className=''>Ringing</p>
                                                                                    {/* <img className=" " src={require('../../assets/images/phone2.png')} alt='logout' /> */}
                                                                                    {/* <p><i class="fa-solid fa-phone-volume"></i></p> */}
                                                                                </div> : " "
                                                                        }
                                                                        {
                                                                            item?.total ?
                                                                                <div className="col-3 numberActive_box">

                                                                                    <h4 style={{ color: "rgb(1, 199, 142)", fontWeight: 700 }}>
                                                                                        {filterTotalCalls(item?.model_type, item?.model_type === "CallCenterQueue" ? item?.model?.extension : item?.model_type === "Ringgroup" ? item?.model?.extension : item?.model?.did)}{" "}
                                                                                        {/* <i
                                                                                        className="fa-solid fa-phone-volume ms-1"
                                                                                        style={{ color: "var(--funky-boy4)", fontSize: 17 }}
                                                                                    /> */}
                                                                                    </h4>
                                                                                    <p>Total</p>
                                                                                    {/* <img className=" " src={require('../../assets/images/totalCall.png')} alt='logout' /> */}
                                                                                </div> : ""
                                                                        }
                                                                        {
                                                                            item?.missed ?
                                                                                <div className="col-3 numberActive_box">

                                                                                    <h4 style={{ color: "rgb(221, 46, 47)", fontWeight: 700, }}>
                                                                                        {filterMissedCalls(item?.model_type, item?.model_type === "CallCenterQueue" ? item?.model?.extension : item?.model_type === "Ringgroup" ? item?.model?.extension : item?.model.did)}{" "}
                                                                                    </h4>
                                                                                    <p>Missed</p>
                                                                                    {/* <img className=" " src={require('../../assets/images/missed.png')} alt='logout' /> */}
                                                                                </div> : ""
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }) : (
                                                <div className='col-xxl-2 col-xl-3'>
                                                    <div className="deviceProvision position-relative h-100">
                                                        <div className="itemWrapper mt-0 a addNew d-flex justify-content-center align-items-center">
                                                            <i class="fa-solid fa-spinner-third fa-spin fs-3"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                    }
                                    {
                                        checkViewSidebar("Usage", slugPermissions, account?.sectionPermissions, account?.permissions, "add") &&
                                        <div className='col-xl-2 col-lg-3 col-md-3' onClick={() => { setAddNewMod(true); setSelectedModule(); setCustomPopup(true) }}>
                                            <div className={`deviceProvision h-100`} >
                                                <div className="itemWrapper mt-0 a addNew">
                                                    <i className='fa-regular fa-plus'></i>
                                                    <p>Add New Module</p>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {
                customPopup ? <CustomDashboardManage addNewMod={addNewMod} setSelectedModule={setSelectedModule} setAddNewMod={setAddNewMod} selectedModule={selectedModule} setRefresh={setRefresh} refresh={refresh} popup={customPopup} setPopup={setCustomPopup} /> : ""
            }
        </main >
    )
}

export default CustomDashboardPage