import React, { useState } from 'react'
import Header from '../../CommonComponents/Header'
import ActiveCalls from './ActiveCalls';
import { useSelector } from 'react-redux';

function ActiveCallsPage() {
    const activeCall = useSelector((state) => state.activeCall);
    const [filter, setFilter] = useState("all");
    const ringingState = activeCall.filter((item) => item.b_callstate === "");

    const outboundCalls = ringingState.filter(call => call.direction === "outbound" || call.direction === "inbound");
    const numberCount = outboundCalls.reduce((acc, call) => {
        acc[call.did_tag] = (acc[call.did_tag] || 0) + 1;
        return acc;
    }, {});


    const activeState = activeCall.filter((item) => item.b_callstate === "ACTIVE");
    const activeoutboundCalls = activeState.filter(call => call.direction === "outbound" || call.direction === "inbound");
    const activenumberCount = activeoutboundCalls.reduce((acc, call) => {
        acc[call.did_tag] = (acc[call.did_tag] || 0) + 1;
        return acc;
    }, {});
    console.log("-------------------------------------------------------------------------------------------------------", ringingState);

    return (
        <main className="mainContent">
            <section id="phonePage">
                <div className="container-fluid">
                    <div className="row">
                        <Header title="Active Calls" />
                        <div className="overviewTableWrapper">
                            <div className="overviewTableChild">
                                <div className="d-flex flex-wrap">
                                    <div className="col-6" style={{ borderRight: "1px solid var(--border-color)" }}>
                                        <div className="heading">
                                            <div className="content">
                                                <h4>Active Calls </h4>
                                                <p>You can see all of the active calls here</p>
                                            </div>
                                            <div className="content">
                                                <p className='fw-bold'>Total Calls: {activeCall.length}</p>
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
                                                    <button onClick={() => setFilter("all")} className="nav-link active" id="nav-all-tab" data-bs-toggle="tab" data-bs-target="#nav-all" type="button" role="tab" aria-controls="nav-all" aria-selected="true">All <span className="unread ms-2">{activeCall.length}</span></button>
                                                    <button onClick={() => setFilter("ringgroup")} className="nav-link " id="nav-rgroup-tab" data-bs-toggle="tab" data-bs-target="#nav-rgroup" type="button" role="tab" aria-controls="nav-rgroup" aria-selected="true">Ring Group <span className="unread ms-2">{activeCall.filter((call) => call.application_state === "ringgroup").length}</span></button>
                                                    <button onClick={() => setFilter("callcenter")} className="nav-link" id="nav-ccenter-tab" data-bs-toggle="tab" data-bs-target="#nav-ccenter" type="button" role="tab" aria-controls="nav-ccenter" aria-selected="false">Call Center <span className="unread ms-2">{activeCall.filter((call) => call.application_state === "callcenter").length}</span></button>
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
                            <div className="row mt-3 gx-3">
                            <div className="col-lg-2 col-md-2 col-sm-4 mb-sm-2 col-xl-2 ">
                                <div className="itemWrapper a">
                                    <div className='heading d-block h-auto'>
                                        <div className="d-flex flex-wrap justify-content-between">
                                            <div className='col-9'>
                                                <h3 style={{ fontWeight: 900 }}>56</h3>
                                                <p>Agents logged in</p>
                                            </div>
                                            <div className='col-3'>
                                                <i className="fa-solid fa-square-check" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-2 col-sm-4 mb-sm-2 col-xl-2 ">
                                <div className="itemWrapper b">
                                    <div className='heading  d-block h-auto'>
                                        <div className="d-flex flex-wrap justify-content-between">
                                            <div className='col-9'>
                                                <h3 style={{ fontWeight: 900 }}>50</h3>
                                                <p>Available Agents</p>
                                            </div>
                                            <div className='col-3'>
                                                <i className="fa-solid fa-user-check" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-2 col-sm-4 mb-sm-2 col-xl-2">
                                <div className="itemWrapper c">
                                    <div className='heading  d-block h-auto'>
                                        <div className="d-flex flex-wrap justify-content-between">
                                            <div className='col-9'>
                                                <h3 style={{ fontWeight: 900 }}>45</h3>
                                                <p>Waiting Calls</p>
                                            </div>
                                            <div className='col-3'>
                                                <i className="fa-solid fa-phone-arrow-down-left" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-2 col-sm-4 mb-sm-2 col-xl-2">
                                <div className="itemWrapper d">
                                    <div className='heading  d-block h-auto'>
                                        <div className="d-flex flex-wrap justify-content-between">
                                            <div className='col-9'>
                                                <h3 style={{ fontWeight: 900 }}>78</h3>
                                                <p>Active Calls</p>
                                            </div>
                                            <div className='col-3'>
                                                <i className="fa-solid fa-phone-volume" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-2 col-sm-4 mb-sm-2 col-xl-2">
                                <div className="itemWrapper a">
                                    <div className='heading  d-block h-auto'>
                                        <div className="d-flex flex-wrap justify-content-between">
                                            <div className='col-9'>
                                                <h3 style={{ fontWeight: 900 }}>545</h3>
                                                <p>Calls on Queue</p>
                                            </div>
                                            <div className='col-3'>
                                                <i className="fa-solid fa-clock-rotate-left" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-2 col-sm-4 mb-sm-2 col-xl-2">
                                <div className="itemWrapper b">
                                    <div className='heading  d-block h-auto'>
                                        <div className="d-flex flex-wrap justify-content-between">
                                            <div className='col-9'>
                                                <h3 style={{ fontWeight: 900 }}>7 <span style={{ fontSize: '15px', fontWeight: '500' }}>seconds</span></h3>
                                                <p>Avg. Response Time</p>
                                            </div>
                                            <div className='col-3'>
                                                <i className="fa-solid fa-phone-slash" />
                                            </div>
                                        </div>
                                    </div>
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