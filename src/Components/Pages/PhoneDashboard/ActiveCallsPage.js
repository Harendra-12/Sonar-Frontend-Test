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
            if (apiData.status) {
                setCustomModule(apiData.data)
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

    return (
        <main className="mainContent">
            <section id="phonePage">
                <div className="container-fluid">
                    <div className="row">
                        <Header title="Active Calls" />
                        <div className="overviewTableWrapper">
                            <div className='col-xl-12 mt-3'>
                                <div className='row gy-4'>
                                    {
                                        customModule?.map((item, index) => {
                                            return (
                                                <div className='col-xl-2' key={index}>
                                                    <div className={`deviceProvision `} >
                                                        <div className="itemWrapper a">
                                                            <div className="heading h-auto d-block">
                                                                <h5>{item.name}</h5>
                                                                <p>{item.model_type === "CallCenterQueue" ? item.model.queue_name : item.model_type === "Ringgroup" ? item.model.name : `${item.model.did}-${item.model.tag}`}</p>
                                                                <p>{item.model_type}</p>
                                                            </div>
                                                            <div className="data-number2 h-auto">
                                                                <div className="d-flex flex-wrap justify-content-between">
                                                                    <div className="col-4">
                                                                        <p>Active</p>
                                                                        <h4>
                                                                            {filterActiveState(item.model_type, item.model_type === "CallCenterQueue" ? item.model.extension : item.model_type === "Ringgroup" ? item.model.extension : item.model.did)}{" "}
                                                                            <i
                                                                                className="fa-solid fa-phone-volume ms-1"
                                                                                style={{ color: "var(--funky-boy4)", fontSize: 17 }}
                                                                            />
                                                                        </h4>
                                                                    </div>
                                                                    <div className="col-4 text-center">
                                                                        <p>Ringing</p>
                                                                        <h4>
                                                                            {filterRingingState(item.model_type, item.model_type === "CallCenterQueue" ? item.model.extension : item.model_type === "Ringgroup" ? item.model.extension : item.model.did)}{" "}
                                                                            <i
                                                                                className="fa-solid fa-bell-ring ms-1"
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
                            </div>
                            <div className='col-xl-12 mb-3'>
                                <div className='row gy-4'>
                                    {
                                        customModule?.map((item, index) => {
                                            return (
                                                <div className='col-xl-2' key={index}>
                                                    <div className={`deviceProvision `} >
                                                        <div className="itemWrapper a">
                                                            <div className="heading h-auto d-block">
                                                                <h5>{item.model_type === "CallCenterQueue" ? item.model.queue_name : item.model_type === "Ringgroup" ? item.model.name : item.model.did}</h5>
                                                                <p>{item.model_type}</p>
                                                            </div>
                                                            <div className="data-number2 h-auto">
                                                                <div className="d-flex flex-wrap justify-content-between">
                                                                    <div className="col-4">
                                                                        <p>Active</p>
                                                                        <h4>
                                                                            {filterActiveState(item.model_type, item.model_type === "CallCenterQueue" ? item.model.extension : item.model_type === "Ringgroup" ? item.model.extension : item.model.did)}{" "}
                                                                            <i
                                                                                className="fa-solid fa-phone-volume ms-1"
                                                                                style={{ color: "var(--funky-boy4)", fontSize: 17 }}
                                                                            />
                                                                        </h4>
                                                                    </div>
                                                                    <div className="col-4 text-center">
                                                                        <p>Ringing</p>
                                                                        <h4>
                                                                            {filterRingingState(item.model_type, item.model_type === "CallCenterQueue" ? item.model.extension : item.model_type === "Ringgroup" ? item.model.extension : item.model.did)}{" "}
                                                                            <i
                                                                                className="fa-solid fa-bell-ring ms-1"
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

                        </div>
                    </div>
                </div>
            </section>
        </main >
    )
}

export default ActiveCallsPage