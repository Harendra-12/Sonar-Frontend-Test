import React, {useState } from 'react'
import Header from '../../CommonComponents/Header'
import ActiveCalls from './ActiveCalls';
import { useSelector } from 'react-redux';

function ActiveCallsPage() {
    const activeCall = useSelector((state) => state.activeCall);
    const [filter, setFilter] = useState("all");
    const ringingState = activeCall.filter((item) => item.callstate === "RINGING");
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
                                                    {/* <div className='ms-auto me-2 my-auto'>
                                                        <select
                                                            className="formItem  formWidth"
                                                            name="" >
                                                            <option disabled value="">
                                                                Select Role type
                                                            </option>
                                                            <option>Tags</option>
                                                            <option>Direction</option>
                                                        </select>
                                                    </div> */}
                                                    {/* <div className='my-auto'>
                                                        <select
                                                            className="formItem formWidth"
                                                            name="" >
                                                            <option disabled value="">
                                                                Select Role type
                                                            </option>
                                                            <option>Tags</option>
                                                            <option>Direction</option>
                                                        </select>
                                                    </div> */}
                                                    <div className='d-flex align-items-center justify-content-end'>
                                                        {/* <button
                                                        effect="ripple"
                                                        className="panelButton float-right"
                                                    >
                                                        <span className="text">Reset</span>
                                                        <span className="icon">
                                                            <i className="fa-solid fa-rotate-right"></i>
                                                        </span>
                                                    </button> */}
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
                                                    {/* <div className='ms-auto me-2 my-auto'>
                                                        <select
                                                            className="formItem formWidth"
                                                            name="" >
                                                            <option disabled value="">
                                                                Select Role type
                                                            </option>
                                                            <option>Tags</option>
                                                            <option>Direction</option>
                                                        </select>
                                                    </div>
                                                    <div className='my-auto'>
                                                        <select
                                                            className="formItem formWidth"
                                                            name="" >
                                                            <option disabled value="">
                                                                Select Role type
                                                            </option>
                                                            <option>Tags</option>
                                                            <option>Direction</option>
                                                        </select>
                                                    </div> */}
                                                </div>
                                            </nav>
                                            <div className="tab-content" id="nav-tabContent">
                                                <div className="tab-pane fade show active" id="nav-allringing" role="tabpanel" aria-labelledby="nav-allringing-tab" tabindex="0">
                                                    <div className="tableContainer" style={{ height: '50vh' }}>
                                                        <table>
                                                            <thead>
                                                                <tr>
                                                                    <th>#</th>
                                                                    <th>From </th>
                                                                    <th>To</th>
                                                                    <th>Started at</th>
                                                                    {/* <th>Tag</th> */}
                                                                </tr>
                                                            </thead>

                                                            <tbody>
                                                                {
                                                                    activeCall && ringingState.map((item, key) => {
                                                                        return (
                                                                            <tr>
                                                                                <td>{key + 1}</td>
                                                                                <td>{item.cid_name}</td>
                                                                                <td>{item.presence_id.split("@")[0]}</td>
                                                                                <td>{item.created.split(" ")[1]}</td>
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
                                                                    <th>From </th>
                                                                    <th>To</th>
                                                                    <th>Started at</th>
                                                                    <th>Tag</th>
                                                                </tr>
                                                            </thead>

                                                            <tbody>
                                                                {
                                                                    activeCall && ringingState.filter((call) => call.application_state === "ringgroup").map((item, key) => {
                                                                        return (
                                                                            <tr>
                                                                                <td>{key + 1}</td>
                                                                                <td>{item.cid_name}</td>
                                                                                <td>{item.presence_id.split("@")[0]}</td>
                                                                                <td>{item.created.split(" ")[1]}</td>
                                                                                <td>{item.name.split("/")[1]}</td>
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
                                                                    <th>From </th>
                                                                    <th>To</th>
                                                                    <th>Started at</th>
                                                                    <th>Tag</th>
                                                                </tr>
                                                            </thead>

                                                            <tbody>
                                                                {
                                                                    activeCall && ringingState.filter((call) => call.application_state === "callcenter").map((item, key) => {
                                                                        return (
                                                                            <tr>
                                                                                <td>{key + 1}</td>
                                                                                <td>{item.cid_name}</td>
                                                                                <td>{item.presence_id.split("@")[0]}</td>
                                                                                <td>{item.created.split(" ")[1]}</td>
                                                                                <td>{item.name.split("/")[1]}</td>
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