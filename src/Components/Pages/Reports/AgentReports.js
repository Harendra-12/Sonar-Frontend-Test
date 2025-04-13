import React from 'react'
import Header from '../../CommonComponents/Header'
import GraphChart from '../../CommonComponents/GraphChart'
import PaginationComponent from '../../CommonComponents/PaginationComponent'

function AgentReports() {
    return (
        <>
            <main className='mainContent'>
                <section id="phonePage">
                    <Header title="Agent Report" />
                    <section className="py-2">
                        <div className="container-fluid">
                            <div className="row mt-3">
                                <div className='col-9'>
                                    <div className='row'>
                                        <div className='col-xxl-6 col-xl-4'>
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
                                        <div className='col-xxl-6 col-xl-8'>
                                            <div className='itemWrapper a'>
                                                <div className="row g-3">
                                                    <div className='col-12'>
                                                        <div className="">
                                                            <div className='heading h-auto'>
                                                                <h5>Total Call Volume</h5>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-6">
                                                        <div className="itemWrapper a shadow-none" style={{ border: '1px solid var(--border-color)' }}>
                                                            <div className='heading h-auto'>
                                                                <h5>Total Calls Completed</h5>
                                                            </div>

                                                            <div className='data-number2 h-auto'>
                                                                <div className="d-flex flex-wrap justify-content-between">
                                                                    <div className='col-4'>
                                                                        <p>Today</p>
                                                                        <h4>28 <i className="fa-solid fa-arrow-trend-up" style={{ color: '#01c78e' }} /></h4>
                                                                    </div>
                                                                    <div className='col-4 text-center'>
                                                                        <p>This Week</p>
                                                                        <h4>82 <i className="fa-solid fa-arrow-trend-up" style={{ color: '#01c78e' }} /></h4>
                                                                    </div>
                                                                    <div className='col-4 text-end'>
                                                                        <p>This Month</p>
                                                                        <h4>259 <i className="fa-solid fa-arrow-trend-down" style={{ color: '#dd2e2f' }} /></h4>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-xl-6">
                                                        <div className="itemWrapper a shadow-none" style={{ border: '1px solid var(--border-color)' }}>
                                                            <div className='heading h-auto'>
                                                                <h5>Calls Abandoned</h5>
                                                            </div>

                                                            <div className='data-number2 h-auto'>
                                                                <div className="d-flex flex-wrap justify-content-between">
                                                                    <div className='col-4'>
                                                                        <p>Today</p>
                                                                        <h4>03</h4>
                                                                    </div>
                                                                    <div className='col-4 text-center'>
                                                                        <p>This Week</p>
                                                                        <h4>09</h4>
                                                                    </div>
                                                                    <div className='col-4 text-end'>
                                                                        <p>This Month</p>
                                                                        <h4>23</h4>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-6">
                                                        <div className="itemWrapper a shadow-none" style={{ border: '1px solid var(--border-color)' }}>
                                                            <div className='heading h-auto'>
                                                                <h5>Call not Answer</h5>
                                                            </div>

                                                            <div className='data-number2 h-auto'>
                                                                <div className="d-flex flex-wrap justify-content-between">
                                                                    <div className='col-4'>
                                                                        <p>Today</p>
                                                                        <h4>00</h4>
                                                                    </div>
                                                                    <div className='col-4 text-center'>
                                                                        <p>This Week</p>
                                                                        <h4>45</h4>
                                                                    </div>
                                                                    <div className='col-4 text-end'>
                                                                        <p>This Month</p>
                                                                        <h4>09</h4>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-6">
                                                        <div className="itemWrapper a shadow-none" style={{ border: '1px solid var(--border-color)' }}>
                                                            <div className='heading h-auto'>
                                                                <h5>Repeat Calls</h5>
                                                            </div>

                                                            <div className='data-number2 h-auto'>
                                                                <div className="d-flex flex-wrap justify-content-between">
                                                                    <div className='col-4'>
                                                                        <p>Today</p>
                                                                        <h4>18</h4>
                                                                    </div>
                                                                    <div className='col-4 text-center'>
                                                                        <p>This Week</p>
                                                                        <h4>43</h4>
                                                                    </div>
                                                                    <div className='col-4 text-end'>
                                                                        <p>This Month</p>
                                                                        <h4>965</h4>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-12'>
                                            <div className="overviewTableWrapper px-0">
                                                <div className="overviewTableChild">
                                                    <div className="d-flex flex-wrap">
                                                        <div className="col-12">
                                                            <div className="heading">
                                                                <div className="content">
                                                                    <h4>Agent Report</h4>
                                                                    <p>You can see the list of Agent</p>
                                                                </div>
                                                                <div className="buttonGroup">
                                                                    <button
                                                                        effect="ripple"
                                                                        className="panelButton gray">
                                                                        <span className="text">Back</span>
                                                                        <span className="icon">
                                                                            <i className="fa-solid fa-caret-left"></i>
                                                                        </span>
                                                                    </button>
                                                                    <button
                                                                        className="panelButton" >
                                                                        <span className="text">Refresh</span>
                                                                        <span className="icon">
                                                                            <i className="fa-solid fa-arrows-rotate"></i>
                                                                        </span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="col-12"
                                                            style={{ overflow: "auto", padding: "10px 20px 0" }} >
                                                            <div className="tableHeader">
                                                                <div className="showEntries">
                                                                    <label>Show</label>
                                                                    <select
                                                                        className="formItem"

                                                                    >
                                                                        <option value={10}>10</option>
                                                                        <option value={20}>20</option>
                                                                        <option value={30}>30</option>
                                                                    </select>
                                                                    <label>entries</label>
                                                                </div>
                                                                <div className="searchBox">
                                                                    <label>Search:</label>
                                                                    <input
                                                                        type="text"

                                                                        className="formItem"

                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="tableContainer" style={{ height: '30vh' }}>
                                                                <table>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>#</th>
                                                                            <th>Call Direction</th>
                                                                            <th>Call Type</th>
                                                                            <th>Origin</th>
                                                                            <th>Destination	</th>
                                                                            <th>Date</th>
                                                                            <th>Time</th>
                                                                            <th className="text-center">Recording</th>
                                                                            <th className="text-center">Duration	</th>
                                                                            <th className="text-center" style={{ width: 100 }}>
                                                                                Hangup Cause
                                                                            </th>
                                                                            <th>Charge</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>

                                                                        <tr>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td>No Permissions</td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td></td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                            <div className="tableHeader mb-3">
                                                                <PaginationComponent
                                                                // pageNumber={(e) => setPageNumber(e)}
                                                                // totalPage={extension.last_page}
                                                                // from={(pageNumber - 1) * extension.per_page + 1}
                                                                // to={extension.to}
                                                                // total={extension.total}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-3'>
                                    <div className="itemWrapper d h-auto mb-3 onQueue">
                                        <div className="heading h-auto">
                                            <div className="d-flex flex-wrap justify-content-between">
                                                <div className="col-9">
                                                    <h3 style={{ fontWeight: 900 }}>10</h3>
                                                    <p>Calls On Queue</p>
                                                </div>
                                                <div className="col-3">
                                                    <i className="fa-solid fa-phone-volume" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='itemWrapper a' style={{ height: 'calc(100% - 150px)' }}>
                                        <div className="heading d-flex">
                                            <div className="col-10">
                                                <h5>Total Agents</h5>
                                                <p>List of agents</p>
                                            </div>
                                            <div className="col-2" style={{ cursor: "pointer" }}>
                                                <i
                                                    className="fa-solid fa-eye"
                                                    style={{ boxShadow: "rgba(0, 0, 0, 0.15) 0px 3px 5px" }}
                                                />
                                            </div>
                                        </div>
                                        <ul className="invoiceList" style={{ height: '100%', overflowY: 'auto' }}>
                                            <li>
                                                <div className="col-xxl-7 col-xl-6">
                                                    <p>Marcus</p>
                                                </div>
                                                <div className='d-flex align-items-center'>
                                                    <span className="extensionStatus online me-2" />
                                                    <p style={{ width: '60px' }}>Available</p>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="col-xxl-7 col-xl-6">
                                                    <p>Marcus</p>
                                                </div>
                                                <div className='d-flex align-items-center'>
                                                    <span className="extensionStatus online me-2" />
                                                    <p style={{ width: '60px' }}>Available</p>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="col-xxl-7 col-xl-6">
                                                    <p>Marcus</p>
                                                </div>
                                                <div className='d-flex align-items-center'>
                                                    <span className="extensionStatus online me-2" />
                                                    <p style={{ width: '60px' }}>Available</p>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="col-xxl-7 col-xl-6">
                                                    <p>Marcus</p>
                                                </div>
                                                <div className='d-flex align-items-center'>
                                                    <span className="extensionStatus online me-2" />
                                                    <p style={{ width: '60px' }}>Available</p>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="col-xxl-7 col-xl-6">
                                                    <p>West</p>
                                                </div>
                                                <div className='d-flex align-items-center'>
                                                    <span className="extensionStatus onCall me-2" />
                                                    <p style={{ width: '60px' }}>Engaged</p>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="col-xxl-7 col-xl-6">
                                                    <p>Kanye</p>
                                                </div>
                                                <div className='d-flex align-items-center'>
                                                    <span className="extensionStatus offline me-2" />
                                                    <p style={{ width: '60px' }}>Offline</p>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="col-xxl-7 col-xl-6">
                                                    <p>Gomez</p>
                                                </div>
                                                <div className='d-flex align-items-center'>
                                                    <span className="extensionStatus onCall me-2" />
                                                    <p style={{ width: '60px' }}>Engaged</p>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="col-xxl-7 col-xl-6">
                                                    <p>Selena</p>
                                                </div>
                                                <div className='d-flex align-items-center'>
                                                    <span className="extensionStatus offline me-2" />
                                                    <p style={{ width: '60px' }}>Offline</p>
                                                </div>
                                            </li>
                                        </ul>
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

export default AgentReports