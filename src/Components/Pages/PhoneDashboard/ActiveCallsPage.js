import React, { useEffect, useState } from 'react'
import Header from '../../CommonComponents/Header'
import { backToTop } from '../../GlobalFunction/globalFunction';
import { useNavigate } from 'react-router-dom';
import ActiveCalls from './ActiveCalls';
import { useSelector } from 'react-redux';

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
    return (
        <main className="mainContent">
            <section id="phonePage">
                <div className="container-fluid">
                    <div className="row">
                        <Header title="Active Calls" />
                        <div className="overviewTableWrapper">
                            <div className="overviewTableChild">
                                <div className="d-flex flex-wrap">
                                    <div className="col-12">
                                        <div className="heading">
                                            <div className="content">
                                                <h4>Active Calls</h4>
                                                <p>You can see all of the active calls here</p>
                                            </div>
                                            <div className="buttonGroup">
                                                <button
                                                    effect="ripple"
                                                    className="panelButton gray"
                                                    onClick={() => {
                                                        navigate(-1);
                                                        backToTop();
                                                    }}
                                                >
                                                    <span className="text">Back</span>
                                                    <span className="icon">
                                                        <i class="fa-solid fa-caret-left"></i>
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className='col-6 pe-3' style={{ padding: "5px 20px 0", borderRight: "1px solid var(--border-color)" }}>
                                        <nav className='tangoNavs'>
                                            <div class="nav nav-tabs" id="nav-tab" role="tablist">
                                                <button class="nav-link active" id="nav-rgall-tab" data-bs-toggle="tab" data-bs-target="#nav-rgall" type="button" role="tab" aria-controls="nav-rgall" aria-selected="true">Active Ring Group Calls</button>
                                                <button class="nav-link" id="nav-rgringing-tab" data-bs-toggle="tab" data-bs-target="#nav-rgringing" type="button" role="tab" aria-controls="nav-rgringing" aria-selected="false">Ringing Ring Group Calls</button>
                                            </div>
                                        </nav>
                                        <div class="tab-content" id="nav-tabContent">
                                            <div class="tab-pane fade show active" id="nav-rgall" role="tabpanel" aria-labelledby="nav-rgall-tab" tabindex="0">
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
                                        <div class="tab-content" id="nav-tabContent">
                                            <div class="tab-pane fade" id="nav-rgringing" role="tabpanel" aria-labelledby="nav-rgringing-tab" tabindex="0">
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
                                            <div class="nav nav-tabs" id="nav-tab" role="tablist">
                                                <button class="nav-link active" id="nav-ccall-tab" data-bs-toggle="tab" data-bs-target="#nav-ccall" type="button" role="tab" aria-controls="nav-ccall" aria-selected="true">Active Queue Calls</button>
                                                <button class="nav-link" id="nav-ccringing-tab" data-bs-toggle="tab" data-bs-target="#nav-ccringing" type="button" role="tab" aria-controls="nav-ccringing" aria-selected="false">Ringing Queue Calls</button>
                                            </div>
                                        </nav>
                                        <div class="tab-content" id="nav-tabContent">
                                            <div class="tab-pane fade show active" id="nav-ccall" role="tabpanel" aria-labelledby="nav-ccall-tab" tabindex="0">
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
                                        <div class="tab-content" id="nav-tabContent">
                                            <div class="tab-pane fade" id="nav-ccringing" role="tabpanel" aria-labelledby="nav-ccringing-tab" tabindex="0">
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
                                        className="col-7 pe-3"
                                        style={{ overflow: "auto", padding: "5px 20px 0", borderRight: "1px solid var(--border-color)" }}
                                    >
                                        <nav className='tangoNavs mb-3'>
                                            <div class="nav nav-tabs" id="nav-tab" role="tablist">
                                                <button class="nav-link active" id="nav-desk-tab">All Active Calls</button>
                                                <button class="nav-link disabled ms-auto pe-0" id="nav-disabled-tab">Total Calls: 0</button>
                                            </div>
                                        </nav>
                                        <div className="tableContainer">
                                            <ActiveCalls isWebrtc={false} />
                                        </div>
                                    </div>
                                    <div
                                        className="col-5 ps-3"
                                        style={{ overflow: "auto", padding: "5px 20px 0" }}
                                    >
                                        <nav className='tangoNavs mb-3'>
                                            <div class="nav nav-tabs" id="nav-tab" role="tablist">
                                                <button class="nav-link active" id="nav-desk-tab">All Ringing Calls</button>
                                                <button class="nav-link disabled ms-auto pe-0" id="nav-disabled-tab">Total Calls: 0</button>
                                            </div>
                                        </nav>
                                        <div className="tableContainer">
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default ActiveCallsPage