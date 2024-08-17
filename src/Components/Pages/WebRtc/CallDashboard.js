import React from 'react'
import { useSelector } from 'react-redux';
import SideNavbarApp from './SideNavbarApp';
import ActiveCallSidePanel from './ActiveCallSidePanel';

function CallDashboard() {
    const sessions = useSelector((state) => state.sessions);
    return (
        <>
            <SideNavbarApp />
            <main className="mainContentApp"
                style={{
                    marginRight:
                        sessions.length > 0 && Object.keys(sessions).length > 0
                            ? "250px"
                            : "0",
                }}>
                <section>
                    <div className="container-fluid callDashboard">
                        <div
                            className="row justify-content-between"
                            style={{ height: "100%" }}
                        >
                            <div className='col-xl-7 pt-2' style={{ borderRight: '1px solid #dee2e6' }}>
                                <div className='d-flex flex-wrap justify-content-between align-items-center'>
                                    <div className="col-auto">
                                        <h3 style={{ fontFamily: "Outfit", color: "rgb(68, 68, 68)" }}>Call Dashboard</h3>
                                    </div>
                                    <div className="col-auto d-flex">
                                        <div className="col-auto">
                                            <button className="appPanelButton" effect="ripple">
                                                <i className="fa-light fa-mobile-retro" />
                                            </button>
                                        </div>
                                        <div className="col-auto">
                                            <button className="appPanelButton" effect="ripple">
                                                <i className="fa-light fa-satellite-dish" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className='col-12'>
                                        <nav>
                                            <div className="nav nav-tabs">
                                                <button className="tabLink active" effect="ripple" data-category="all">
                                                    All
                                                </button>
                                                <button className="tabLink" effect="ripple" data-category="new">
                                                    New
                                                </button>
                                            </div>
                                        </nav>
                                        <div className="position-relative searchBox d-flex mt-3">
                                            <input type="search" name="Search" id="headerSearch" placeholder="Search" />
                                            <button className="ms-2 appPanelButton" effect="ripple">
                                                <i className="fa-light fa-calendar-plus" />
                                            </button>
                                        </div>
                                    </div>

                                </div>
                                <div className="col-12 callDashboardPrimTable" style={{ overflow: "auto" }}>
                                    <div className="tableContainer allItems">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Status</th>
                                                    <th>Extension</th>
                                                    <th>Name</th>
                                                    <th>On Call With</th>
                                                    <th>Call Status</th>
                                                    <th>Duration</th>
                                                    <th>Options</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className='extensionStatusWithName'>
                                                        <span className="extensionStatus online" />
                                                    </td>
                                                    <td>1000</td>
                                                    <td>John Doe</td>
                                                    <td></td>
                                                    <td>
                                                        <label className="tableLabel success">Active</label>
                                                    </td>
                                                    <td>10:10</td>
                                                    <td className='ps-1'>
                                                        <button className='clearButton'><i className="fa-duotone fa-ear-deaf text-success" /></button>
                                                        <button className='clearButton'><i class="fa-solid fa-headphones text-info"></i></button>
                                                        <button className='clearButton'><i className="fa-solid fa-phone-slash text-danger" /></button>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className='extensionStatusWithName'>
                                                        <span className="extensionStatus onCall" />
                                                    </td>
                                                    <td>1001</td>
                                                    <td>John Doe</td>
                                                    <td>1 999 999 9999</td>
                                                    <td>
                                                        <label className="tableLabel success">Active</label>
                                                    </td>
                                                    <td>10:10</td>
                                                    <td className='ps-1'>
                                                        <button className='clearButton'><i className="fa-duotone fa-ear-deaf text-success" /></button>
                                                        <button className='clearButton'><i class="fa-solid fa-headphones text-info"></i></button>
                                                        <button className='clearButton'><i className="fa-solid fa-phone-slash text-danger" /></button>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className='extensionStatusWithName'>
                                                        <span className="extensionStatus" />
                                                    </td>
                                                    <td>1002</td>
                                                    <td>John Doe</td>
                                                    <td></td>
                                                    <td>
                                                        <label className="tableLabel fail">Disable</label>
                                                    </td>
                                                    <td>10:10</td>
                                                    <td className='ps-1'>
                                                        <button className='clearButton'><i className="fa-duotone fa-ear-deaf text-success" /></button>
                                                        <button className='clearButton'><i class="fa-solid fa-headphones text-info"></i></button>
                                                        <button className='clearButton'><i className="fa-solid fa-phone-slash text-danger" /></button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className='col-xl-5 pt-2' style={{ borderRight: '1px solid #dee2e6' }}>
                                <div style={{ height: 'calc(100vh - 50%)' }}>
                                    <div className='d-flex flex-wrap justify-content-between align-items-center'>
                                        <div className="col-auto">
                                            <h3 style={{ fontFamily: "Outfit", color: "rgb(68, 68, 68)" }}>Parked Calls</h3>
                                        </div>
                                        <div className='col-12'>
                                            <div className="position-relative searchBox d-flex mt-3">
                                                <input type="search" name="Search" id="headerSearch" placeholder="Search" />
                                                <button className="ms-2 appPanelButton" effect="ripple">
                                                    <i className="fa-light fa-calendar-plus" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12" style={{ overflow: "auto" }}>
                                        <div className="tableContainer">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Called ID</th>
                                                        <th>Parked At</th>
                                                        <th>Parked By</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>1000</td>
                                                        <td>1212</td>
                                                        <td>1000</td>
                                                    </tr>
                                                    <tr>
                                                        <td>1000</td>
                                                        <td>1212</td>
                                                        <td>1000</td>
                                                    </tr>
                                                    <tr>
                                                        <td>1000</td>
                                                        <td>1212</td>
                                                        <td>1000</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className='mt-3 pt-3' style={{ borderTop: '1px solid rgb(222, 226, 230)' }}>
                                    <div className='d-flex flex-wrap justify-content-between align-items-center'>
                                        <div className="col-auto">
                                            <h3 style={{ fontFamily: "Outfit", color: "rgb(68, 68, 68)" }}>Active Queues</h3>
                                        </div>
                                        <div className='col-12'>
                                            <div className="position-relative searchBox d-flex mt-3">
                                                <input type="search" name="Search" id="headerSearch" placeholder="Search" />
                                                <button className="ms-2 appPanelButton" effect="ripple">
                                                    <i className="fa-light fa-calendar-plus" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12" style={{ overflow: "auto" }}>
                                        <div className="tableContainer">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Extension</th>
                                                        <th>On Call</th>
                                                        <th>Waiting</th>
                                                        <th>Logged In</th>
                                                        <th>Avg. Wait Time</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>1000</td>
                                                        <td>1212</td>
                                                        <td>1000</td>
                                                        <td>1000</td>
                                                        <td>1212</td>
                                                        <td>1000</td>
                                                    </tr>
                                                    <tr>
                                                        <td>1000</td>
                                                        <td>1212</td>
                                                        <td>1000</td>
                                                        <td>1000</td>
                                                        <td>1212</td>
                                                        <td>1000</td>
                                                    </tr>
                                                    <tr>
                                                        <td>1000</td>
                                                        <td>1212</td>
                                                        <td>1000</td>
                                                        <td>1000</td>
                                                        <td>1212</td>
                                                        <td>1000</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            {sessions.length > 0 && Object.keys(sessions).length > 0 ? (
                <>
                    <section className="activeCallsSidePanel">
                        <div className="container">
                            <div className="row">
                                {sessions.length > 0 &&
                                    sessions.map((session, chennel) => (
                                        <ActiveCallSidePanel
                                            sessionId={session.id}
                                            destination={session.destination}
                                            chennel={chennel}
                                        />
                                    ))}
                            </div>
                        </div>
                    </section>
                </>
            ) : (
                ""
            )}
        </>
    )
}

export default CallDashboard