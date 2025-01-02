import React, { useEffect, useState } from 'react'
import Header from '../../CommonComponents/Header'
import { backToTop } from '../../GlobalFunction/globalFunction';
import { useNavigate } from 'react-router-dom';
import ActiveCalls from './ActiveCalls';
import { useSelector } from 'react-redux';
import { colors } from '@mui/material';

function ActiveCallsPage() {
    const navigate = useNavigate()

    const activeCall = useSelector((state) => state.activeCall);
    const [allParkedCall, setAllParkedCall] = useState([]);
    useEffect(() => {
        //dest should start with "set:valet_ticket"
        setAllParkedCall(
            activeCall.filter(
                (call) =>
                    (call.dest.includes("set:valet_ticket") || call.dest.includes("*")) && call.b_callee_direction !== "ACTIVE"
            )
        );
    }, [activeCall]);
    console.log("Active call page",activeCall);
    
    return (
        <main className="mainContent">
            <section id="phonePage">
                <div className="container-fluid">
                    <div className="row">
                        <Header title="Active Calls" />
                        <div className="overviewTableWrapper">
                            <div className="overviewTableChild">
                                <div className="d-flex flex-wrap">
                                    <div className="col-xl-6" style={{ borderRight: "1px solid var(--border-color)" }}>
                                        <div className="heading">
                                            <div className="content">
                                                <h4>Active Calls </h4>
                                                <p>You can see all of the active calls here</p>
                                            </div>
                                            <div className="content">
                                                <p className='fw-bold'>Total Calls: 0</p>
                                                <p style={{ height: 21 }}></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-6">
                                        <div className="heading">
                                            <div className="content">
                                                <h4>Ringing Calls</h4>
                                                <p>You can see all of the ringing calls here</p>
                                            </div>
                                            <div className="content">
                                                <p className='fw-bold'>Total Calls: 0</p>
                                                <p style={{ height: 21 }}></p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className='col-6 pe-3' style={{ padding: "5px 20px 0", borderRight: "1px solid var(--border-color)" }}>
                                        <nav className='tangoNavs'>
                                            <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                                <button className="nav-link active" id="nav-rgall-tab" data-bs-toggle="tab" data-bs-target="#nav-rgall" type="button" role="tab" aria-controls="nav-rgall" aria-selected="true">Active Ring Group Calls</button>
                                                <button className="nav-link" id="nav-rgringing-tab" data-bs-toggle="tab" data-bs-target="#nav-rgringing" type="button" role="tab" aria-controls="nav-rgringing" aria-selected="false">Ringing Ring Group Calls</button>
                                            </div>
                                        </nav>
                                        <div className="tab-content" id="nav-tabContent">
                                            <div className="tab-pane fade show active" id="nav-rgall" role="tabpanel" aria-labelledby="nav-rgall-tab" tabindex="0">
                                                <div className="tableContainer" style={{ height: '40vh' }}>
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th>#</th>
                                                                <th>Profile</th>
                                                                <th>Created</th>
                                                                <th>CID Number</th>
                                                                <th>Destination</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>1</td>
                                                                <td>10000</td>
                                                                <td>162626</td>
                                                                <td>61611</td>
                                                                <td>1302</td>
                                                            </tr>
                                                            <tr>
                                                                <td>1</td>
                                                                <td>10000</td>
                                                                <td>162626</td>
                                                                <td>61611</td>
                                                                <td>1302</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tab-content" id="nav-tabContent">
                                            <div className="tab-pane fade" id="nav-rgringing" role="tabpanel" aria-labelledby="nav-rgringing-tab" tabindex="0">
                                                <div className="tableContainer" style={{ height: '40vh' }}>
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th>#</th>
                                                                <th>Profile</th>
                                                                <th>Created</th>
                                                                <th>CID Number</th>
                                                                <th>Destination</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>1</td>
                                                                <td>10000</td>
                                                                <td>162626</td>
                                                                <td>61611</td>
                                                                <td>1302</td>
                                                            </tr>
                                                            <tr>
                                                                <td>1</td>
                                                                <td>10000</td>
                                                                <td>162626</td>
                                                                <td>61611</td>
                                                                <td>1302</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-6 pe-3' style={{ padding: "5px 20px 0", borderRight: "1px solid var(--border-color)" }}>
                                        <nav className='tangoNavs'>
                                            <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                                <button className="nav-link active" id="nav-ccall-tab" data-bs-toggle="tab" data-bs-target="#nav-ccall" type="button" role="tab" aria-controls="nav-ccall" aria-selected="true">Active Queue Calls</button>
                                                <button className="nav-link" id="nav-ccringing-tab" data-bs-toggle="tab" data-bs-target="#nav-ccringing" type="button" role="tab" aria-controls="nav-ccringing" aria-selected="false">Ringing Queue Calls</button>
                                            </div>
                                        </nav>
                                        <div className="tab-content" id="nav-tabContent">
                                            <div className="tab-pane fade show active" id="nav-ccall" role="tabpanel" aria-labelledby="nav-ccall-tab" tabindex="0">
                                                <div className="tableContainer" style={{ height: '40vh' }}>
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th>#</th>
                                                                <th>Profile</th>
                                                                <th>Created</th>
                                                                <th>CID Number</th>
                                                                <th>Destination</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>1</td>
                                                                <td>10000</td>
                                                                <td>162626</td>
                                                                <td>61611</td>
                                                                <td>1302</td>
                                                            </tr>
                                                            <tr>
                                                                <td>1</td>
                                                                <td>10000</td>
                                                                <td>162626</td>
                                                                <td>61611</td>
                                                                <td>1302</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tab-content" id="nav-tabContent">
                                            <div className="tab-pane fade" id="nav-ccringing" role="tabpanel" aria-labelledby="nav-ccringing-tab" tabindex="0">
                                                <div className="tableContainer" style={{ height: '40vh' }}>
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th>#</th>
                                                                <th>Profile</th>
                                                                <th>Created</th>
                                                                <th>CID Number</th>
                                                                <th>Destination</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>1</td>
                                                                <td>10000</td>
                                                                <td>162626</td>
                                                                <td>61611</td>
                                                                <td>1302</td>
                                                            </tr>
                                                            <tr>
                                                                <td>1</td>
                                                                <td>10000</td>
                                                                <td>162626</td>
                                                                <td>61611</td>
                                                                <td>1302</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                                    <div
                                        className="col-xl-6 pe-3"
                                        style={{ overflow: "auto", padding: "5px 20px 0", borderRight: "1px solid var(--border-color)" }}
                                    >
                                        <>
                                            <nav className='tangoNavs'>
                                                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                                    <button className="nav-link active" id="nav-all-tab" data-bs-toggle="tab" data-bs-target="#nav-all" type="button" role="tab" aria-controls="nav-all" aria-selected="true">All <span className="unread ms-2">999</span></button>
                                                    <button className="nav-link " id="nav-rgroup-tab" data-bs-toggle="tab" data-bs-target="#nav-rgroup" type="button" role="tab" aria-controls="nav-rgroup" aria-selected="true">Ring Group <span className="unread ms-2">1</span></button>
                                                    <button className="nav-link" id="nav-ccenter-tab" data-bs-toggle="tab" data-bs-target="#nav-ccenter" type="button" role="tab" aria-controls="nav-ccenter" aria-selected="false">Call Center <span className="unread ms-2">1</span></button>
                                                    <div className='ms-auto me-2 my-auto'>
                                                        <select
                                                            className="formItem  formWidth"
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
                                                    </div>
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
                                                        <ActiveCalls isWebrtc={false} />
                                                    </div>
                                                </div>
                                                <div className="tab-pane fade" id="nav-rgroup" role="tabpanel" aria-labelledby="nav-rgroup-tab" tabindex="0">
                                                    <div className="tableContainer" style={{ height: '50vh' }}>
                                                        <table>
                                                            <thead>
                                                                <tr>
                                                                    <th>#</th>
                                                                    <th>Profile</th>
                                                                    <th>Created</th>
                                                                    <th>CID Number</th>
                                                                    <th>Destination</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>1</td>
                                                                    <td>10000</td>
                                                                    <td>162626</td>
                                                                    <td>61611</td>
                                                                    <td>1302</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>1</td>
                                                                    <td>10000</td>
                                                                    <td>162626</td>
                                                                    <td>61611</td>
                                                                    <td>1302</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="tab-content" id="nav-tabContent">
                                                <div className="tab-pane fade" id="nav-ccenter" role="tabpanel" aria-labelledby="nav-ccenter-tab" tabindex="0">
                                                    <div className="tableContainer" style={{ height: '50vh' }}>
                                                        <table>
                                                            <thead>
                                                                <tr>
                                                                    <th>#</th>
                                                                    <th>Profile</th>
                                                                    <th>Created</th>
                                                                    <th>CID Number</th>
                                                                    <th>Destination</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>1</td>
                                                                    <td>10000</td>
                                                                    <td>162626</td>
                                                                    <td>61611</td>
                                                                    <td>1302</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>1</td>
                                                                    <td>10000</td>
                                                                    <td>162626</td>
                                                                    <td>61611</td>
                                                                    <td>1302</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    </div>
                                    <div
                                        className="col-xl-6 ps-3"
                                        style={{ overflow: "auto", padding: "5px 20px 0" }}
                                    >
                                        <>
                                            <nav className='tangoNavs'>
                                                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                                    <button className="nav-link active" id="nav-allringing-tab" data-bs-toggle="tab" data-bs-target="#nav-allringing" type="button" role="tab" aria-controls="nav-allringing" aria-selected="true">All <span className="unread ms-2">999</span></button>
                                                    <button className="nav-link" id="nav-rgroupring-tab" data-bs-toggle="tab" data-bs-target="#nav-rgroupring" type="button" role="tab" aria-controls="nav-rgroupring" aria-selected="true">Ring Group <span className="unread ms-2">1</span></button>
                                                    <button className="nav-link" id="nav-ccenterring-tab" data-bs-toggle="tab" data-bs-target="#nav-ccenterring" type="button" role="tab" aria-controls="nav-ccenterring" aria-selected="false">Call Center <span className="unread ms-2">1</span></button>
                                                    <div className='ms-auto me-2 my-auto'>
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
                                                    </div>
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
                                                                    <th>Tag</th>
                                                                </tr>
                                                            </thead>

                                                            <tbody>
                                                                {
                                                                    activeCall && activeCall.filter((item) => item.callstate === "RINGING").map((item, key) => {
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
                                                <div className="tab-pane fade" id="nav-rgroupring" role="tabpanel" aria-labelledby="nav-rgroupring-tab" tabindex="0">
                                                    <div className="tableContainer" style={{ height: '30vh' }}>
                                                        <table>
                                                            <thead>
                                                                <tr>
                                                                    <th>#</th>
                                                                    <th>Profile</th>
                                                                    <th>Created</th>
                                                                    <th>CID Number</th>
                                                                    <th>Destination</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>1</td>
                                                                    <td>10000</td>
                                                                    <td>162626</td>
                                                                    <td>61611</td>
                                                                    <td>1302</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>1</td>
                                                                    <td>10000</td>
                                                                    <td>162626</td>
                                                                    <td>61611</td>
                                                                    <td>1302</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="tab-content" id="nav-tabContent">
                                                <div className="tab-pane fade" id="nav-ccenterring" role="tabpanel" aria-labelledby="nav-ccenterring-tab" tabindex="0">
                                                    <div className="tableContainer" style={{ height: '30vh' }}>
                                                        <table>
                                                            <thead>
                                                                <tr>
                                                                    <th>#</th>
                                                                    <th>Profile</th>
                                                                    <th>Created</th>
                                                                    <th>CID Number</th>
                                                                    <th>Destination</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>1</td>
                                                                    <td>10000</td>
                                                                    <td>162626</td>
                                                                    <td>61611</td>
                                                                    <td>1302</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>1</td>
                                                                    <td>10000</td>
                                                                    <td>162626</td>
                                                                    <td>61611</td>
                                                                    <td>1302</td>
                                                                </tr>
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