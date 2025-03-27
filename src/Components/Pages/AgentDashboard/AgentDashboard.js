import React from 'react'
import PaginationComponent from '../../CommonComponents/PaginationComponent'
import GraphChart from '../../CommonComponents/GraphChart'
import Header from '../../CommonComponents/Header'

const AgentDashboard = () => {
    return (
        <>
            <main className='mainContent'>
                <section id="phonePage">
                    <Header title="Agent Dashboard" />
                    <section className="py-2">
                        <div className="container-fluid">
                            <div className='col-xl-12'>
                                <div className="row mt-3">
                                    <div className='col-xxl-12 col-xl-12 mb-3'>
                                        <div className='row g-3'>
                                            <div className="col-xxl-2 col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12">
                                                <div className="itemWrapper a">
                                                    <div className='heading h-auto'>
                                                        <div className="d-flex flex-wrap justify-content-between">
                                                            <div className='col-9'>
                                                                <h3 style={{ fontWeight: 900 }}>100</h3>
                                                                <p>Total Calls</p>
                                                            </div>
                                                            <div className='col-3'>
                                                                <i className="fa-solid fa-square-check onlyAgent" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xxl-2 col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12">
                                                <div className="itemWrapper b">
                                                    <div className='heading h-auto'>
                                                        <div className="d-flex flex-wrap justify-content-between">
                                                            <div className='col-9'>
                                                                <h3 style={{ fontWeight: 900 }}>00:00:00</h3>
                                                                <p>Total Call Duration</p>
                                                            </div>
                                                            <div className='col-3'>
                                                                <i className="fa-solid fa-user-check onlyAgent" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xxl-2 col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12">
                                                <div className="itemWrapper c">
                                                    <div className='heading h-auto'>
                                                        <div className="d-flex flex-wrap justify-content-between">
                                                            <div className='col-9'>
                                                                <h3 style={{ fontWeight: 900 }}>45</h3>
                                                                <p>Active Calls</p>
                                                            </div>
                                                            <div className='col-3'>
                                                                <i className="fa-solid fa-phone-arrow-down-left onlyAgent" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xxl-2 col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12">
                                                <div className="itemWrapper d">
                                                    <div className='heading h-auto'>
                                                        <div className="d-flex flex-wrap justify-content-between">
                                                            <div className='col-9'>
                                                                <h3 style={{ fontWeight: 900 }}>10</h3>
                                                                <p>Calls On Queue</p>
                                                            </div>
                                                            <div className='col-3'>
                                                                <i className="fa-solid fa-phone-volume onlyAgent" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xxl-2 col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12">
                                                <div className="itemWrapper a">
                                                    <div className='heading h-auto'>
                                                        <div className="d-flex flex-wrap justify-content-between">
                                                            <div className='col-9'>
                                                                <h3 style={{ fontWeight: 900 }}>$0.46</h3>
                                                                <p>Cost Per Call</p>
                                                            </div>
                                                            <div className='col-3'>
                                                                <i className="fa-solid fa-clock-rotate-left onlyAgent" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xxl-2 col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12">
                                                <div className="itemWrapper b">
                                                    <div className='heading h-auto'>
                                                        <div className="d-flex flex-wrap justify-content-between">
                                                            <div className='col-9'>
                                                                <h3 style={{ fontWeight: 900 }}>7 <span style={{ fontSize: '15px', fontWeight: '500' }}>seconds</span></h3>
                                                                <p>Avg. Response Time</p>
                                                            </div>
                                                            <div className='col-3'>
                                                                <i className="fa-solid fa-phone-slash onlyAgent" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-xxl-6 col-xl-6 '>
                                        <div className="itemWrapper a">
                                            <div className='heading h-auto'>
                                                <div className="d-flex flex-wrap justify-content-between">
                                                    <div className='col-9'>
                                                        <h5>Call Per Hour</h5>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='d-flex flex-wrap justify-content-between mt-1'>
                                                <GraphChart
                                                    height={'240px'}
                                                    chartType="multiple"
                                                    label1={"Wallet"}
                                                    label2={"Card"}
                                                    // labels={[ "Field 1", "Field 2"]}
                                                    fields={[
                                                        "0s",
                                                        "10s",
                                                        "20s",
                                                        "30s",
                                                        "40s",
                                                        "50s",
                                                        "60s",
                                                    ]}
                                                    percentage={[
                                                        [10, 12, 14, 16, 24, 14, 16], // CPU Usage
                                                        [8, 15, 20, 18, 25, 10, 12], // Memory Usage
                                                    ]}
                                                    colors={["#f18f01", "#36A2EB"]}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-xxl-6 col-xl-6'>
                                        <div className='itemWrapper a'>
                                            <div className="row g-3">
                                                <div className='col-12'>
                                                    <div className="">
                                                        <div className='heading h-auto'>
                                                            <h5>Total Call Volume</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xl-6 col-lg-6 col-md-6">
                                                    <div className=" agentItem a shadow-none p-3" style={{ border: '1px solid var(--border-color)' }}>
                                                        <div className='heading h-auto mb-3'>
                                                            <h5>Total Calls Completed</h5>
                                                        </div>

                                                        <div className='data-number2 h-auto'>
                                                            <div className="d-flex flex-wrap justify-content-between">
                                                                <div className='col-4'>
                                                                    <p>Today</p>
                                                                    <div className='agent_badge success_badge '>28 <i className="fa-solid fa-arrow-trend-up "  /></div>
                                                                </div>
                                                                <div className='col-4 '>
                                                                    <p>This Week</p>
                                                                    <div className='agent_badge success_badge'>82 <i className="fa-solid fa-arrow-trend-up" /></div>
                                                                </div>
                                                                <div className='col-4 '>
                                                                    <p>This Month</p>
                                                                    <div className='agent_badge danger_badge'>259 <i className="fa-solid fa-arrow-trend-down" /></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-xl-6 col-lg-6 col-md-6">
                                                    <div className="agentItem a shadow-none p-3" style={{ border: '1px solid var(--border-color)' }}>
                                                        <div className='heading h-auto mb-3'>
                                                            <h5>Calls Abandoned</h5>
                                                        </div>

                                                        <div className='data-number2 h-auto'>
                                                            <div className="d-flex flex-wrap justify-content-between">
                                                                <div className='col-4'>
                                                                    <p>Today</p>
                                                                    <div className='agent_badge success_badge '>28 <i className="fa-solid fa-arrow-trend-up "  /></div>
                                                                </div>
                                                                <div className='col-4 '>
                                                                    <p>This Week</p>
                                                                    <div className='agent_badge success_badge'>32 <i className="fa-solid fa-arrow-trend-up" /></div>
                                                                </div>
                                                                <div className='col-4 '>
                                                                    <p>This Month</p>
                                                                    <div className='agent_badge danger_badge'>159 <i className="fa-solid fa-arrow-trend-down" /></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xl-6 col-lg-6 col-md-6">
                                                    <div className="agentItem a shadow-none p-3" style={{ border: '1px solid var(--border-color)' }}>
                                                        <div className='heading h-auto mb-3'>
                                                            <h5>Call not Answer</h5>
                                                        </div>

                                                        <div className='data-number2 h-auto'>
                                                            <div className="d-flex flex-wrap justify-content-between">
                                                                <div className='col-4'>
                                                                    <p>Today</p>
                                                                    <div className='agent_badge success_badge '>28 <i className="fa-solid fa-arrow-trend-up "  /></div>
                                                                </div>
                                                                <div className='col-4 '>
                                                                    <p>This Week</p>
                                                                    <div className='agent_badge danger_badge'>22 <i className="fa-solid fa-arrow-trend-up" /></div>
                                                                </div>
                                                                <div className='col-4 '>
                                                                    <p>This Month</p>
                                                                    <div className='agent_badge danger_badge'>29 <i className="fa-solid fa-arrow-trend-down" /></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xl-6 col-lg-6 col-md-6">
                                                    <div className="agentItem a shadow-none p-3" style={{ border: '1px solid var(--border-color)' }}>
                                                        <div className='heading h-auto mb-3'>
                                                            <h5>Repeat Calls</h5>
                                                        </div>

                                                        <div className='data-number2 h-auto'>
                                                            <div className="d-flex flex-wrap justify-content-between">
                                                                <div className='col-4'>
                                                                    <p>Today</p>
                                                                    <div className='agent_badge danger_badge '>08 <i className="fa-solid fa-arrow-trend-up "  /></div>
                                                                </div>
                                                                <div className='col-4 '>
                                                                    <p>This Week</p>
                                                                    <div className='agent_badge success_badge'>32 <i className="fa-solid fa-arrow-trend-up" /></div>
                                                                </div>
                                                                <div className='col-4 '>
                                                                    <p>This Month</p>
                                                                    <div className='agent_badge danger_badge'>59 <i className="fa-solid fa-arrow-trend-down" /></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-xl-12'>
                                <div className='overviewTableWrapper px-0'>
                                    <div className='overviewTableChild'>
                                        <div className='d-flex flex-wrap'>
                                            <div className='col-12'>
                                                <div className='heading'>
                                                    <div className="content">
                                                        <h4>Agent Call Analytics</h4>
                                                        <p>You can see a brief analysis of all the agent</p>
                                                    </div>
                                                    <div className='buttonGroup'>
                                                        <button effect="ripple" className="panelButton gray">
                                                            <span className="text">Back</span>
                                                            <span className="icon"><i className="fa-solid fa-caret-left"></i></span>
                                                        </button>
                                                        <button effect="ripple" className="panelButton">
                                                            <span className="text">Refresh</span>
                                                            <span className="icon"><i className="fa-solid fa-arrows-rotate"></i></span>
                                                        </button>
                                                        <button effect="ripple" className="panelButton">
                                                            <span className="text">Export</span>
                                                            <span className="icon"><i className="fa-solid fa-file-csv"></i></span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12" style={{ overflow: 'auto', padding: '25px 20px 0px' }}>
                                                <div className="tableHeader">
                                                    <div className="showEntries">
                                                        <label>Show</label>
                                                        <select className="formItem">
                                                            <option value="10">10</option>
                                                            <option value="20">20</option>
                                                            <option value="30">30</option>
                                                        </select>
                                                        <label>entries</label>
                                                    </div>
                                                    <div className="searchBox position-relative">
                                                        <label>Search:</label>
                                                        <input type="text" name="Search" placeholder="Search" className="formItem" value="" />
                                                    </div>
                                                </div>
                                                <div className="tableContainer" style={{ height: '30vh' }}>
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                {/* <th>#</th> */}
                                                                <th>Agent Name</th>
                                                                <th>Status</th>
                                                                <th>Extension</th>
                                                                <th>Destination / Source</th>
                                                                <th>Call Duration</th>
                                                                <th>Edit</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="">
                                                            <tr>
                                                                <td>Rishabh maurya</td>
                                                                <td><span class="extensionStatus"></span></td>
                                                                <td>999</td>
                                                                <td>999</td>
                                                                <td>00:00:00</td>
                                                                <td>
                                                                    <button
                                                                        className="tableButton edit"
                                                                    >
                                                                        <i className="fa-solid fa-pencil"></i>
                                                                    </button>
                                                                </td>
                                                              
                                                            </tr>
                                                            <tr>
                                                                <td>Rishabh maurya</td>
                                                                <td><span class="extensionStatus online"></span></td>
                                                                <td>999</td>
                                                                <td>999</td>
                                                                <td>00:00:00</td>
                                                                <td>
                                                                <button
                                                                        className="tableButton edit"
                                                                    >
                                                                        <i className="fa-solid fa-pencil"></i>
                                                                    </button>
                                                                </td>
                                                               
                                                            </tr>
                                                            <tr>
                                                                <td>Rishabh maurya</td>
                                                                <td><span class="extensionStatus"></span></td>
                                                                <td>999</td>
                                                                <td>999</td>
                                                                <td>00:00:00</td>
                                                                <td>
                                                                <button
                                                                        className="tableButton edit"
                                                                    >
                                                                        <i className="fa-solid fa-pencil"></i>
                                                                    </button>
                                                                </td>
                                                            
                                                            </tr>
                                                            <tr>
                                                                <td>Rishabh maurya</td>
                                                                <td><span class="extensionStatus online"></span></td>
                                                                <td>999</td>
                                                                <td>999</td>
                                                                <td>00:00:00</td>
                                                                <td>
                                                                <button
                                                                        className="tableButton edit"
                                                                    >
                                                                        <i className="fa-solid fa-pencil"></i>
                                                                    </button>
                                                                </td>
                                                               
                                                            </tr>
                                                            <tr>
                                                                <td>Rishabh maurya</td>
                                                                <td><span class="extensionStatus online"></span></td>
                                                                <td>999</td>
                                                                <td>999</td>
                                                                <td>00:00:00</td>
                                                                <td>
                                                                <button
                                                                        className="tableButton edit"
                                                                    >
                                                                        <i className="fa-solid fa-pencil"></i>
                                                                    </button>
                                                                </td>
                                                               
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className='tableHeader mb-3'>
                                                    <PaginationComponent />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </section>
            </main>
        </>
    )
}

export default AgentDashboard