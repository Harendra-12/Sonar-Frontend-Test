/* eslint-disable eqeqeq */
import React, { useEffect, useState } from 'react'
import Header from '../../CommonComponents/Header'
import ActiveCalls from './ActiveCalls';
import { useSelector } from 'react-redux';
import { generalGetFunction } from '../../GlobalFunction/globalFunction';
import { useNavigate } from 'react-router-dom';

function ActiveCallsPage() {
    const activeCall = useSelector((state) => state.activeCall);
    const navigate = useNavigate()
    const [filter, setFilter] = useState("all");
    const [customModule, setCustomModule] = useState([]);
    const ringingState = activeCall.filter((item) => item.b_callstate === "");
    const [cdrData, setCdrData] = useState([]);
    const outboundCalls = ringingState.filter(call => call.direction === "outbound" || call.direction === "inbound");
    const numberCount = outboundCalls.reduce((acc, call) => {
        acc[call.did_tag] = (acc[call.did_tag] || 0) + 1;
        return acc;
    }, {});
    const activeState = activeCall.filter((item) => item.b_callstate === "ACTIVE" || item.b_callstate === "HELD");
    const activeoutboundCalls = activeState.filter(call => call.direction === "outbound" || call.direction === "inbound");
    const activenumberCount = activeoutboundCalls.reduce((acc, call) => {
        acc[call.did_tag] = (acc[call.did_tag] || 0) + 1;
        return acc;
    }, {});

    // Getting all custome module for filter on initial phase 
    useEffect(() => {
        async function getCustomModule() {
            const apiData = await generalGetFunction("/usage/all")
            const filterData = await generalGetFunction("/call-details")
            if (apiData.status) {
                setCustomModule(apiData.data)
            }
            if (filterData.status) {
                setCdrData(filterData.cdr_filters.filter_count)
            }
        }
        getCustomModule()
    }, [])

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
            console.log(type, value);
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
            console.log(type, value);
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
    return (
        <main className="mainContent">
            <section id="phonePage">
                <div className="container-fluid">
                    <div className="row">
                        <Header title="Active Calls" />
                        <div className="overviewTableWrapper">
                            <div className='col-xl-12 mb-3'>
                                <div className='row gy-4'>
                                    {
                                        customModule?.map((item, index) => {
                                            return (
                                                <div className='col-xl-3' key={index}>
                                                    <div className={`deviceProvision position-relative`} >
                                                        <button className='clearButton2 editBtn'>
                                                            <i className="fa-solid fa-pen" />
                                                        </button>
                                                        <div className="itemWrapper a">
                                                            <div className="heading h-auto d-block">
                                                                <div className='d-flex align-items-center0 justify-content-between '>
                                                                    <div>
                                                                        <h5>{item?.name}</h5>
                                                                        <p>Category: {item?.model_type}</p>
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
                                                                                    {/* <i
                                                                                        className="fa-solid fa-bell-ring ms-1"
                                                                                        style={{ color: "rgb(1, 199, 142)", fontSize: 17 }}
                                                                                    /> */}
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
                                        })
                                    }
                                    {/* <div className="itemWrapper a">
                                        <div className="heading h-auto">
                                            <div className="d-flex flex-wrap justify-content-between">
                                                <div className="col-6">
                                                    <h3 style={{ color: "rgb(221, 46, 47)", fontWeight: 700 }}>16</h3>
                                                    <p>Missed Calls</p>
                                                </div>
                                                <div className="col-6 text-end">
                                                    <h3 style={{ color: "rgb(1, 199, 142)", fontWeight: 700 }}>169</h3>
                                                    <p>Answered Calls</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="heading h-auto pt-2 mt-2"
                                            style={{ borderTop: "1px solid var(--border-color)" }}
                                        >
                                            <div className="d-flex flex-wrap justify-content-between">
                                                <div className="col-6">
                                                    <h3 style={{ color: "rgb(247, 167, 51)", fontWeight: 700 }}>24</h3>
                                                    <p>Abandoned Calls</p>
                                                </div>
                                                <div className="col-6 text-end">
                                                    <h3 style={{ color: "rgb(51, 136, 247)", fontWeight: 700 }}>785</h3>
                                                    <p>Totals Calls</p>
                                                </div>
                                            </div>

                                        </div>
                                    </div> */}
                                    <div className='col-xl-2' onClick={() => navigate("/custom-module")}>
                                        <div className={`deviceProvision h-100`} >
                                            <div className="itemWrapper a addNew h-100">
                                                <i className='fa-regular fa-plus'></i>
                                                <p>Add New Module</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="overviewTableChild">
                                <div className="d-flex flex-wrap">
                                    <div className="col-6" style={{ borderRight: "1px solid var(--border-color)" }}>
                                        <div className="heading">
                                            <div className="content">
                                                <h4>Active Calls </h4>
                                                <p>You can see all of the active calls here</p>
                                            </div>
                                            <div className="content">
                                                <p className='fw-bold'>Total Calls: {activeState.length}</p>
                                                <p style={{ height: 21 }}></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="heading">
                                            <div className="content">
                                                <h4>Ringing Calls</h4>
                                                <p>You can see all of the ringing calls here</p>
                                            </div>
                                            <div className="content">
                                                <p className='fw-bold'>Total Calls: {ringingState.length}</p>
                                                <p style={{ height: 21 }}></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="col-6 pe-3"
                                        style={{ overflow: "auto", padding: "5px 20px 0", borderRight: "1px solid var(--border-color)" }}
                                    >
                                        <>
                                            <nav className='tangoNavs'>
                                                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                                    <button onClick={() => setFilter("all")} className="nav-link active" id="nav-all-tab" data-bs-toggle="tab" data-bs-target="#nav-all" type="button" role="tab" aria-controls="nav-all" aria-selected="true">All <span className="unread ms-2">{activeState.length}</span></button>
                                                    <button onClick={() => setFilter("ringgroup")} className="nav-link " id="nav-rgroup-tab" data-bs-toggle="tab" data-bs-target="#nav-rgroup" type="button" role="tab" aria-controls="nav-rgroup" aria-selected="true">Ring Group <span className="unread ms-2">{activeState.filter((call) => call.application_state === "ringgroup").length}</span></button>
                                                    <button onClick={() => setFilter("callcenter")} className="nav-link" id="nav-ccenter-tab" data-bs-toggle="tab" data-bs-target="#nav-ccenter" type="button" role="tab" aria-controls="nav-ccenter" aria-selected="false">Call Center <span className="unread ms-2">{activeState.filter((call) => call.application_state === "callcenter").length}</span></button>
                                                    <button onClick={() => setFilter("did")} className="nav-link" id="nav-did-tab" data-bs-toggle="tab" data-bs-target="#nav-did" type="button" role="tab" aria-controls="nav-did" aria-selected="false">DID</button>
                                                    <div className='d-flex align-items-center justify-content-end'>

                                                    </div>
                                                </div>
                                            </nav>
                                            <div className="tab-content" id="nav-tabContent">
                                                <div className="tab-pane fade show active" id="nav-all" role="tabpanel" aria-labelledby="nav-all-tab" tabindex="0">
                                                    <div className="tableContainer" style={{ height: '50vh' }}>
                                                        <ActiveCalls isWebrtc={false} filter={filter} />
                                                    </div>
                                                </div>
                                                <div className="tab-pane fade" id="nav-rgroup" role="tabpanel" aria-labelledby="nav-rgroup-tab" tabindex="0">
                                                    <div className="tableContainer" style={{ height: '50vh' }}>
                                                        <ActiveCalls isWebrtc={false} filter={filter} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="tab-content" id="nav-tabContent">
                                                <div className="tab-pane fade" id="nav-ccenter" role="tabpanel" aria-labelledby="nav-ccenter-tab" tabindex="0">
                                                    <div className="tableContainer" style={{ height: '50vh' }}>
                                                        <ActiveCalls isWebrtc={false} filter={filter} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="tab-content" id="nav-tabContent">
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
                                            </div>
                                        </>
                                    </div>
                                    <div
                                        className="col-6 ps-3"
                                        style={{ overflow: "auto", padding: "5px 20px 0" }}
                                    >
                                        <>
                                            <nav className='tangoNavs'>
                                                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                                    <button className="nav-link active" id="nav-allringing-tab" data-bs-toggle="tab" data-bs-target="#nav-allringing" type="button" role="tab" aria-controls="nav-allringing" aria-selected="true">All <span className="unread ms-2">{ringingState.length}</span></button>
                                                    <button className="nav-link" id="nav-rgroupring-tab" data-bs-toggle="tab" data-bs-target="#nav-rgroupring" type="button" role="tab" aria-controls="nav-rgroupring" aria-selected="true">Ring Group <span className="unread ms-2">{ringingState.filter((call) => call.application_state === "ringgroup").length}</span></button>
                                                    <button className="nav-link" id="nav-ccenterring-tab" data-bs-toggle="tab" data-bs-target="#nav-ccenterring" type="button" role="tab" aria-controls="nav-ccenterring" aria-selected="false">Call Center <span className="unread ms-2">{ringingState.filter((call) => call.application_state === "callcenter").length}</span></button>
                                                    <button className="nav-link" id="nav-didring-tab" data-bs-toggle="tab" data-bs-target="#nav-didring" type="button" role="tab" aria-controls="nav-didring" aria-selected="false">DID</button>
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
                                                                    activeCall && ringingState.map((item, key) => {
                                                                        return (
                                                                            <tr>
                                                                                <td>{key + 1}</td>
                                                                                <td>{item.did_tag}</td>
                                                                                <td>{item.cid_name}</td>
                                                                                <td>{item.dest}</td>
                                                                                <td>{item.feature_tag}</td>
                                                                                <td>{item.duration}</td>

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
                                                                    activeCall && ringingState.filter((call) => call.application_state === "ringgroup").map((item, key) => {
                                                                        return (
                                                                            <tr>
                                                                                <td>{key + 1}</td>
                                                                                <td>{item.did_tag}</td>
                                                                                <td>{item.cid_name}</td>
                                                                                <td>{item.dest}</td>
                                                                                <td>{item.feature_tag}</td>
                                                                                <td>{item.duration}</td>
                                                                            </tr>
                                                                        )
                                                                    })
                                                                }

                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="tab-content" id="nav-tabContent">
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
                                                                    activeCall && ringingState.filter((call) => call.application_state === "callcenter").map((item, key) => {
                                                                        return (
                                                                            <tr>
                                                                                <td>{key + 1}</td>
                                                                                <td>{item.did_tag}</td>
                                                                                <td>{item.cid_name}</td>
                                                                                <td>{item.dest}</td>
                                                                                <td>{item.feature_tag}</td>
                                                                                <td>{item.duration}</td>
                                                                            </tr>
                                                                        )
                                                                    })
                                                                }

                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="tab-content" id="nav-tabContent">
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
                                            </div>
                                        </>
                                    </div>
                                </div>
                            </div>
                            {/* <div className='col-xl-12 mt-3'>
                                <div className='row gy-4'>
                                    {
                                        customModule?.map((item, index) => {
                                            return (
                                                <div className='col-xl-2' key={index}>
                                                    <div className={`deviceProvision `} >
                                                        <div className="itemWrapper a">
                                                            <div className="heading h-auto d-block">
                                                                <h5>{item?.model_type === "CallCenterQueue" ? item?.model?.queue_name : item?.model_type === "Ringgroup" ? item?.model?.name : item?.model?.did}</h5>
                                                                <p>{item.model_type}</p>
                                                            </div>
                                                            <div className="data-number2 h-auto">
                                                                <div className="d-flex flex-wrap justify-content-between">
                                                                    <div className="col-4">
                                                                        <p>Active</p>
                                                                        <h4>
                                                                            {filterActiveState(item?.model_type, item?.model_type === "CallCenterQueue" ? item?.model?.extension : item?.model_type === "Ringgroup" ? item?.model?.extension : item?.model?.did)}{" "}
                                                                            <i
                                                                                className="fa-solid fa-phone-volume ms-1"
                                                                                style={{ color: "var(--funky-boy4)", fontSize: 17 }}
                                                                            />
                                                                        </h4>
                                                                    </div>
                                                                    <div className="col-4 text-center">
                                                                        <p>Ringing</p>
                                                                        <h4>
                                                                            {filterRingingState(item?.model_type, item?.model_type === "CallCenterQueue" ? item?.model?.extension : item?.model_type === "Ringgroup" ? item?.model?.extension : item?.model?.did)}{" "}
                                                                            <i
                                                                                className="fa-solid fa-phone-office ms-1"
                                                                                style={{ color: "rgb(1, 199, 142)", fontSize: 17 }}
                                                                            />
                                                                        </h4>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                    <div className='col-xl-2' onClick={() => navigate("/custom-module")}>
                                        <div className={`deviceProvision h-100`} >
                                            <div className="itemWrapper a addNew h-100">
                                                <i className='fa-regular fa-plus'></i>
                                                <p>Add New Module</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </section>
        </main >
    )
}

export default ActiveCallsPage