/* eslint-disable eqeqeq */
import React, { useEffect, useRef, useState } from 'react'
import Header from '../../CommonComponents/Header'
import ActiveCalls from './ActiveCalls';
import { useSelector } from 'react-redux';
import { checkViewSidebar, generalGetFunction } from '../../GlobalFunction/globalFunction';
import CustomDashboardManage from '../Setting/CustomDashboardManage';
import { useLocation } from 'react-router-dom';
// import CircularLoader from '../../Loader/CircularLoader';
import { getPanelElement, getResizeHandleElement, Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

function ActiveCallsPage({ isParentWebRtc }) {
    const account = useSelector((state) => state.account);
    const slugPermissions = useSelector((state) => state?.permissions);
    const activeCall = useSelector((state) => state.activeCall);
    const [filter, setFilter] = useState("all");
    const [customModule, setCustomModule] = useState([]);
    const ringingState = activeCall.filter((item) => item.b_callstate === "");
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
        }, 1000);

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

    return (
        <main className={`mainContent ${isParentWebRtc ? ' ms-0' : ''}`}>
            <section id="phonePage">
                <div className="container-fluid">
                    <div className="row">
                        {!isParentWebRtc && <Header title="Active Calls" />}
                        <div className="overviewTableWrapper p-3">
                            <div className='col-xl-12 mb-3'>
                                <div className='row gy-4'>
                                    {
                                        checkViewSidebar("Usage", slugPermissions, account?.permissions, "read") && !usageLoading ?
                                            customModule?.map((item, index) => {
                                                return (
                                                    <div className='col-xxl-2 col-xl-3' key={index}>
                                                        <div className={`deviceProvision position-relative`} >
                                                            <button
                                                                disabled={!checkViewSidebar("Usage", slugPermissions, account?.permissions, "edit")}
                                                                className='clearButton2 editBtn' onClick={() => { setSelectedModule(item); setCustomPopup(true); setAddNewMod(false); }}>
                                                                <i className="fa-solid fa-pen" />
                                                            </button>
                                                            <div className="itemWrapper a">
                                                                <div className="heading h-auto d-block">
                                                                    <div className='d-flex align-items-center0 justify-content-between '>
                                                                        <div>
                                                                            <h5>{item?.name}</h5>
                                                                            <p>Type: {item?.model_type}</p>
                                                                        </div>
                                                                        <div className='text-end'>
                                                                            <h5>{item?.model_type === "CallCenterQueue" ? item?.model?.queue_name : item?.model_type === "Ringgroup" ? item?.model?.name : `${item?.model?.did}`}</h5>
                                                                            <p>{item?.model?.tag && `Tag: ${item?.model?.tag}`}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="data-number3 h-auto mt-2" style={{ borderTop: "1px solid var(--border-color)" }}>
                                                                    <div className="d-flex justify-content-center pt-2">
                                                                        {
                                                                            item.active ?
                                                                                <div className="col-3">
                                                                                    <h4 style={{ color: "rgb(221, 46, 47)", fontWeight: 700 }}>
                                                                                        {filterActiveState(item?.model_type, item?.model_type === "CallCenterQueue" ? item?.model?.extension : item?.model_type === "Ringgroup" ? item?.model?.extension : item?.model?.did)}{" "}
                                                                                        {/* <i
                                                                                        className="fa-solid fa-phone-volume ms-1"
                                                                                        style={{ color: "var(--funky-boy4)", fontSize: 17 }}
                                                                                    /> */}
                                                                                    </h4>
                                                                                    <p>Active</p>
                                                                                </div> : ""
                                                                        }
                                                                        {
                                                                            item?.ringing ?
                                                                                <div className="col-3">

                                                                                    <h4 style={{ color: "rgb(1, 199, 142)", fontWeight: 700 }}>
                                                                                        {filterRingingState(item?.model_type, item?.model_type === "CallCenterQueue" ? item?.model?.extension : item?.model_type === "Ringgroup" ? item?.model?.extension : item?.model.did)}{" "}
                                                                                        {/* <i
                                                                                        className="fa-solid fa-bell-ring ms-1"
                                                                                        style={{ color: "rgb(1, 199, 142)", fontSize: 17 }}
                                                                                    /> */}
                                                                                    </h4>
                                                                                    <p className='p-0 m-0'>Ringing</p>
                                                                                </div> : " "
                                                                        }
                                                                        {
                                                                            item?.total ?
                                                                                <div className="col-3">

                                                                                    <h4 style={{ color: "rgb(247, 167, 51)", fontWeight: 700 }}>
                                                                                        {filterTotalCalls(item?.model_type, item?.model_type === "CallCenterQueue" ? item?.model?.extension : item?.model_type === "Ringgroup" ? item?.model?.extension : item?.model?.did)}{" "}
                                                                                        {/* <i
                                                                                        className="fa-solid fa-phone-volume ms-1"
                                                                                        style={{ color: "var(--funky-boy4)", fontSize: 17 }}
                                                                                    /> */}
                                                                                    </h4>
                                                                                    <p>Total</p>
                                                                                </div> : ""
                                                                        }
                                                                        {
                                                                            item?.missed ?
                                                                                <div className="col-3">

                                                                                    <h4 style={{ color: "rgb(51, 136, 247)", fontWeight: 700, }}>
                                                                                        {filterMissedCalls(item?.model_type, item?.model_type === "CallCenterQueue" ? item?.model?.extension : item?.model_type === "Ringgroup" ? item?.model?.extension : item?.model.did)}{" "}
                                                                                    </h4>
                                                                                    <p>Missed</p>
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
                                                        <div className="itemWrapper a addNew d-flex justify-content-center align-items-center">
                                                            <i class="fa-solid fa-spinner-third fa-spin fs-3"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                    }
                                    {
                                        checkViewSidebar("Usage", slugPermissions, account?.permissions, "add") &&
                                        <div className='col-xl-2' onClick={() => { setAddNewMod(true); setSelectedModule(); setCustomPopup(true) }}>
                                            <div className={`deviceProvision h-100`} >
                                                <div className="itemWrapper a addNew h-100">
                                                    <i className='fa-regular fa-plus'></i>
                                                    <p>Add New Module</p>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="overviewTableChild">
                                <div className="d-flex flex-wrap">
                                    <PanelGroup autoSaveId="example" direction="horizontal">
                                        <Panel className='leftPanel' defaultSize={60} collapsible={true} minSize={25} ref={leftPanel}>
                                            <div className="col-12">
                                                <div className="heading">
                                                    <div className='d-flex'>
                                                        <button className='clearButton2 me-2' onClick={handleResizeLeft}>
                                                            <i className="fa-solid fa-down-left-and-up-right-to-center" />
                                                        </button>
                                                        <div className="content">
                                                            <h4>Active Calls </h4>
                                                            <p>You can see all of the active calls here</p>
                                                        </div>
                                                    </div>
                                                    <div className="content">
                                                        <p className='fw-bold'>Total Calls: {activeState.length}</p>
                                                        <p style={{ height: 21 }}></p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="col-12"
                                                style={{ overflow: "auto", padding: "5px 20px 0" }}
                                            >
                                                <>
                                                    <nav className='tangoNavs'>
                                                        <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                                            <button onClick={() => setFilter("all")} className={`nav-link ${locationState?.state?.filter === "all" || locationState.state == null ? 'active' : ''}`} id="nav-all-tab" data-bs-toggle="tab" data-bs-target="#nav-all" type="button" role="tab" aria-controls="nav-all" aria-selected="true">All <span className="unread">{activeState.length}</span></button>
                                                            <button onClick={() => setFilter("ringgroup")} className="nav-link " id="nav-rgroup-tab" data-bs-toggle="tab" data-bs-target="#nav-rgroup" type="button" role="tab" aria-controls="nav-rgroup" aria-selected="true">Ring Group <span className="unread" style={{ backgroundColor: 'rgb(221, 46, 47)' }}>{activeState.filter((call) => call.application_state === "ringgroup").length}</span></button>
                                                            <button onClick={() => setFilter("callcenter")} className="nav-link" id="nav-ccenter-tab" data-bs-toggle="tab" data-bs-target="#nav-ccenter" type="button" role="tab" aria-controls="nav-ccenter" aria-selected="false">Call Center <span className="unread" style={{ backgroundColor: 'rgb(1, 199, 142)' }}>{activeState.filter((call) => call.application_state === "callcenter").length}</span></button>
                                                            <button onClick={() => setFilter("did")} className="nav-link" id="nav-did-tab" data-bs-toggle="tab" data-bs-target="#nav-did" type="button" role="tab" aria-controls="nav-did" aria-selected="false">DID</button>
                                                            <button onClick={() => setFilter("internal")} className={`nav-link ${locationState?.state?.filter === "internal" ? 'active' : ''}`} id="nav-internal-tab" data-bs-toggle="tab" data-bs-target="#nav-internal" type="button" role="tab" aria-controls="nav-internal" aria-selected="false">Internal <span className="unread">{activeState.filter((call) => call.direction === "internal").length}</span></button>
                                                            <button onClick={() => setFilter("inbound")} className={`nav-link ${locationState?.state?.filter === "inbound" ? 'active' : ''}`} id="nav-inbound-tab" data-bs-toggle="tab" data-bs-target="#nav-inbound" type="button" role="tab" aria-controls="nav-inbound" aria-selected="false">Inbound <span className="unread" style={{ backgroundColor: 'rgb(247, 167, 51)' }}>{activeState.filter((call) => call.direction === "inbound").length}</span></button>
                                                            <button onClick={() => setFilter("outbound")} className={`nav-link ${locationState?.state?.filter === "outbound" ? 'active' : ''}`} id="nav-outbound-tab" data-bs-toggle="tab" data-bs-target="#nav-outbound" type="button" role="tab" aria-controls="nav-outbound" aria-selected="false">Outbound <span className="unread">{activeState.filter((call) => call.direction === "outbound").length}</span></button>
                                                        </div>
                                                    </nav>
                                                    <div className="tab-content" id="nav-tabContent">
                                                        <div className="tab-pane fade show active" id="nav-all" role="tabpanel" aria-labelledby="nav-all-tab" tabindex="0">
                                                            <div className="tableContainer" style={{ height: '50vh' }}>
                                                                <ActiveCalls isWebrtc={isParentWebRtc || false} filter={filter} />
                                                            </div>
                                                        </div>
                                                        <div className="tab-pane fade" id="nav-rgroup" role="tabpanel" aria-labelledby="nav-rgroup-tab" tabindex="0">
                                                            <div className="tableContainer" style={{ height: '50vh' }}>
                                                                <ActiveCalls isWebrtc={isParentWebRtc || false} filter={filter} />
                                                            </div>
                                                        </div>
                                                        <div className="tab-pane fade" id="nav-ccenter" role="tabpanel" aria-labelledby="nav-ccenter-tab" tabindex="0">
                                                            <div className="tableContainer" style={{ height: '50vh' }}>
                                                                <ActiveCalls isWebrtc={isParentWebRtc || false} filter={filter} />
                                                            </div>
                                                        </div>
                                                        <div className="tab-pane fade" id="nav-did" role="tabpanel" aria-labelledby="nav-did-tab" tabindex="0">
                                                            <div className="tableContainer" style={{ height: '50vh' }}>
                                                                <table>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>#</th>
                                                                            <th>Did Tag</th>
                                                                            <th>Total Count</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>

                                                                        {activenumberCount && Object.keys(activenumberCount).map((item, key) => {
                                                                            return (
                                                                                <tr>
                                                                                    <td>{key + 1}</td>
                                                                                    <td>{item}</td>
                                                                                    <td>{activenumberCount[item]}</td>
                                                                                </tr>
                                                                            )
                                                                        })}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                        <div className="tab-pane fade" id="nav-internal" role="tabpanel" aria-labelledby="nav-internal-tab" tabindex="0">
                                                            <div className="tableContainer" style={{ height: '50vh' }}>
                                                                <ActiveCalls isWebrtc={isParentWebRtc || false} filter={filter} />
                                                            </div>
                                                        </div>
                                                        <div className="tab-pane fade" id="nav-inbound" role="tabpanel" aria-labelledby="nav-inbound-tab" tabindex="0">
                                                            <div className="tableContainer" style={{ height: '50vh' }}>
                                                                <ActiveCalls isWebrtc={isParentWebRtc || false} filter={filter} />
                                                            </div>
                                                        </div>
                                                        <div className="tab-pane fade" id="nav-outbound" role="tabpanel" aria-labelledby="nav-outbound-tab" tabindex="0">
                                                            <div className="tableContainer" style={{ height: '50vh' }}>
                                                                <ActiveCalls isWebrtc={isParentWebRtc || false} filter={filter} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            </div>
                                        </Panel>
                                        <PanelResizeHandle className="resizeHandle">
                                            <button className='clearButton2' onClick={resetResizeContent}>
                                                <i className='fa-solid fa-arrows-rotate' />
                                            </button>
                                        </PanelResizeHandle>
                                        <Panel className='rightPanel' defaultSize={40} collapsible={true} minSize={25} ref={rightPanel}>
                                            <div className="col-12">
                                                <div className="heading">
                                                    <div className='d-flex'>
                                                        <button className='clearButton2 me-2' onClick={handleResizeRight} style={{ left: '10px' }}>
                                                            <i className="fa-solid fa-down-left-and-up-right-to-center" />
                                                        </button>
                                                        <div className="content">
                                                            <h4>Ringing Calls</h4>
                                                            <p>You can see all of the ringing calls here</p>
                                                        </div>
                                                    </div>
                                                    <div className="content">
                                                        <p className='fw-bold'>Total Calls: {ringingState.length}</p>
                                                        <p style={{ height: 21 }}></p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="col-12"
                                                style={{ overflow: "auto", padding: "5px 20px 5px" }}
                                            >
                                                <>
                                                    <nav className='tangoNavs'>
                                                        <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                                            <button className="nav-link active" id="nav-allringing-tab" data-bs-toggle="tab" data-bs-target="#nav-allringing" type="button" role="tab" aria-controls="nav-allringing" aria-selected="true">All <span className="unread">{ringingState.length}</span></button>
                                                            <button className="nav-link" id="nav-rgroupring-tab" data-bs-toggle="tab" data-bs-target="#nav-rgroupring" type="button" role="tab" aria-controls="nav-rgroupring" aria-selected="true">Ring Group <span className="unread" style={{ backgroundColor: 'rgb(221, 46, 47)' }}>{ringingState.filter((call) => call.application_state === "ringgroup").length}</span></button>
                                                            <button className="nav-link" id="nav-ccenterring-tab" data-bs-toggle="tab" data-bs-target="#nav-ccenterring" type="button" role="tab" aria-controls="nav-ccenterring" aria-selected="false">Call Center <span className="unread" style={{ backgroundColor: 'rgb(1, 199, 142)' }}>{ringingState.filter((call) => call.application_state === "callcenter").length}</span></button>
                                                            <button className="nav-link" id="nav-didring-tab" data-bs-toggle="tab" data-bs-target="#nav-didring" type="button" role="tab" aria-controls="nav-didring" aria-selected="false">DID</button>
                                                            <button className="nav-link" id="nav-internalring-tab" data-bs-toggle="tab" data-bs-target="#nav-internalring" type="button" role="tab" aria-controls="nav-internalring" aria-selected="false">Internal <span className="unread">{ringingState.filter((call) => call.direction === "internal").length}</span></button>
                                                            <button className="nav-link" id="nav-inboundring-tab" data-bs-toggle="tab" data-bs-target="#nav-inboundring" type="button" role="tab" aria-controls="nav-inboundring" aria-selected="false">Inbound <span className="unread" style={{ backgroundColor: 'rgb(247, 167, 51)' }}>{ringingState.filter((call) => call.direction === "inbound").length}</span></button>
                                                            <button className="nav-link" id="nav-outboundring-tab" data-bs-toggle="tab" data-bs-target="#nav-outboundring" type="button" role="tab" aria-controls="nav-outboundring" aria-selected="false">Outbound <span className="unread">{ringingState.filter((call) => call.direction === "outbound").length}</span></button>
                                                        </div>
                                                    </nav>
                                                    <div className="tab-content" id="nav-tabContent">
                                                        <div className="tab-pane fade show active" id="nav-allringing" role="tabpanel" aria-labelledby="nav-allringing-tab" tabindex="0">
                                                            <div className="tableContainer" style={{ height: '50vh' }}>
                                                                <table>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>#</th>
                                                                            <th>Did Tag</th>
                                                                            <th>From </th>
                                                                            <th>To</th>
                                                                            <th>Feature Tag</th>
                                                                            <th>Started since</th>
                                                                        </tr>
                                                                    </thead>

                                                                    <tbody>
                                                                        {
                                                                            activeCall && updatedData.map((item, key) => {
                                                                                return (
                                                                                    <tr style={{ backgroundColor: item.application_state === "ringgroup" ? "#f8d7da" : item.application_state === "callcenter" ? "#d1e7dd" : "" }}>
                                                                                        <td>{key + 1}</td>
                                                                                        <td>{item.did_tag}</td>
                                                                                        <td>{item.cid_name}</td>
                                                                                        <td>{item.dest}</td>
                                                                                        <td>{item.feature_tag}</td>
                                                                                        <td>{item.realTimeDuration}</td>

                                                                                        {/* <td>{item.name.split("/")[1]}</td> */}
                                                                                    </tr>
                                                                                )
                                                                            })
                                                                        }

                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                        <div className="tab-pane fade" id="nav-rgroupring" role="tabpanel" aria-labelledby="nav-rgroupring-tab" tabindex="0">
                                                            <div className="tableContainer" style={{ height: '50vh' }}>
                                                                <table>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>#</th>
                                                                            <th>Did Tag</th>
                                                                            <th>From </th>
                                                                            <th>To</th>
                                                                            <th>Feature Tag</th>
                                                                            <th>Started at</th>

                                                                        </tr>
                                                                    </thead>

                                                                    <tbody>
                                                                        {
                                                                            activeCall && updatedData.filter((call) => call.application_state === "ringgroup").map((item, key) => {
                                                                                return (
                                                                                    <tr>
                                                                                        <td>{key + 1}</td>
                                                                                        <td>{item.did_tag}</td>
                                                                                        <td>{item.cid_name}</td>
                                                                                        <td>{item.dest}</td>
                                                                                        <td>{item.feature_tag}</td>
                                                                                        <td>{item.realTimeDuration}</td>
                                                                                    </tr>
                                                                                )
                                                                            })
                                                                        }

                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                        <div className="tab-pane fade" id="nav-ccenterring" role="tabpanel" aria-labelledby="nav-ccenterring-tab" tabindex="0">
                                                            <div className="tableContainer" style={{ height: '50vh' }}>
                                                                <table>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>#</th>
                                                                            <th>Did Tag</th>
                                                                            <th>From </th>
                                                                            <th>To</th>
                                                                            <th>Feature Tag</th>
                                                                            <th>Started at</th>
                                                                        </tr>
                                                                    </thead>

                                                                    <tbody>
                                                                        {
                                                                            activeCall && updatedData.filter((call) => call.application_state === "callcenter").map((item, key) => {
                                                                                return (
                                                                                    <tr>
                                                                                        <td>{key + 1}</td>
                                                                                        <td>{item.did_tag}</td>
                                                                                        <td>{item.cid_name}</td>
                                                                                        <td>{item.dest}</td>
                                                                                        <td>{item.feature_tag}</td>
                                                                                        <td>{item.realTimeDuration}</td>
                                                                                    </tr>
                                                                                )
                                                                            })
                                                                        }

                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                        <div className="tab-pane fade" id="nav-didring" role="tabpanel" aria-labelledby="nav-didring-tab" tabindex="0">
                                                            <div className="tableContainer" style={{ height: '50vh' }}>
                                                                <table>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>#</th>
                                                                            <th>Did Tag</th>
                                                                            <th>Total Count</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>

                                                                        {numberCount && Object.keys(numberCount).map((item, key) => {
                                                                            return (
                                                                                <tr>
                                                                                    <td>{key + 1}</td>
                                                                                    <td>{item}</td>
                                                                                    <td>{numberCount[item]}</td>
                                                                                </tr>
                                                                            )
                                                                        })}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                        <div className="tab-pane fade" id="nav-internalring" role="tabpanel" aria-labelledby="nav-internalring-tab" tabindex="0">
                                                            <div className="tableContainer" style={{ height: '50vh' }}>
                                                                <table>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>#</th>
                                                                            <th>Did Tag</th>
                                                                            <th>From </th>
                                                                            <th>To</th>
                                                                            <th>Feature Tag</th>
                                                                            <th>Started since</th>
                                                                        </tr>
                                                                    </thead>

                                                                    <tbody>
                                                                        {
                                                                            activeCall && updatedData.filter((item) => item.direction === "internal").map((item, key) => {
                                                                                return (
                                                                                    <tr>
                                                                                        <td>{key + 1}</td>
                                                                                        <td>{item.did_tag}</td>
                                                                                        <td>{item.cid_name}</td>
                                                                                        <td>{item.dest}</td>
                                                                                        <td>{item.feature_tag}</td>
                                                                                        <td>{item.realTimeDuration}</td>

                                                                                        {/* <td>{item.name.split("/")[1]}</td> */}
                                                                                    </tr>
                                                                                )
                                                                            })
                                                                        }

                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                        <div className="tab-pane fade" id="nav-inboundring" role="tabpanel" aria-labelledby="nav-inboundring-tab" tabindex="0">
                                                            <div className="tableContainer" style={{ height: '50vh' }}>
                                                                <table>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>#</th>
                                                                            <th>Did Tag</th>
                                                                            <th>From </th>
                                                                            <th>To</th>
                                                                            <th>Feature Tag</th>
                                                                            <th>Started since</th>
                                                                        </tr>
                                                                    </thead>

                                                                    <tbody>
                                                                        {
                                                                            activeCall && updatedData.filter((item) => item.direction === "inbound").map((item, key) => {
                                                                                return (
                                                                                    <tr>
                                                                                        <td>{key + 1}</td>
                                                                                        <td>{item.did_tag}</td>
                                                                                        <td>{item.cid_name}</td>
                                                                                        <td>{item.dest}</td>
                                                                                        <td>{item.feature_tag}</td>
                                                                                        <td>{item.realTimeDuration}</td>

                                                                                        {/* <td>{item.name.split("/")[1]}</td> */}
                                                                                    </tr>
                                                                                )
                                                                            })
                                                                        }

                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                        <div className="tab-pane fade" id="nav-outboundring" role="tabpanel" aria-labelledby="nav-outboundring-tab" tabindex="0">
                                                            <div className="tableContainer" style={{ height: '50vh' }}>
                                                                <table>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>#</th>
                                                                            <th>Did Tag</th>
                                                                            <th>From </th>
                                                                            <th>To</th>
                                                                            <th>Feature Tag</th>
                                                                            <th>Started since</th>
                                                                        </tr>
                                                                    </thead>

                                                                    <tbody>
                                                                        {
                                                                            activeCall && updatedData.filter((item) => item.direction === "outbound").map((item, key) => {
                                                                                return (
                                                                                    <tr>
                                                                                        <td>{key + 1}</td>
                                                                                        <td>{item.did_tag}</td>
                                                                                        <td>{item.cid_name}</td>
                                                                                        <td>{item.dest}</td>
                                                                                        <td>{item.feature_tag}</td>
                                                                                        <td>{item.realTimeDuration}</td>

                                                                                        {/* <td>{item.name.split("/")[1]}</td> */}
                                                                                    </tr>
                                                                                )
                                                                            })
                                                                        }

                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            </div>
                                        </Panel>
                                    </PanelGroup>
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

export default ActiveCallsPage