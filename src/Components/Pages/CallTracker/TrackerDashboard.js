import React, { useState } from 'react'
import GraphChart from '../../CommonComponents/GraphChart'
import Header from '../../CommonComponents/Header'
import PaginationComponent from '../../CommonComponents/PaginationComponent'

function TrackerDashboard() {
    const [refreshState, setRefreshState] = useState(false)
    const handleRefreshBtnClicked = () => {

    }
    return (
        <>
            <main className='mainContent'>
                <section id="phonePage">
                    <Header title="Tracker Dashboard" />
                    <section className="py-2">
                        <div className="container-fluid">
                            <div className='col-xl-12'>
                                <div className="row mt-3">
                                    <div className='col-xxl-4 col-xl-6'>
                                        <div className='row g-3'>
                                            <div className="col-6">
                                                <div className="itemWrapper a">
                                                    <div className='heading h-auto'>
                                                        <div className="d-flex flex-wrap justify-content-between">
                                                            <div className='col-9'>
                                                                <h3 style={{ fontWeight: 900 }}>100</h3>
                                                                <p>Total Calls</p>
                                                            </div>
                                                            <div className='col-3'>
                                                                <i className="fa-solid fa-square-check" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="itemWrapper b">
                                                    <div className='heading h-auto'>
                                                        <div className="d-flex flex-wrap justify-content-between">
                                                            <div className='col-9'>
                                                                <h3 style={{ fontWeight: 900 }}>00:00:00</h3>
                                                                <p>Total Call Duration</p>
                                                            </div>
                                                            <div className='col-3'>
                                                                <i className="fa-solid fa-user-check" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="itemWrapper c">
                                                    <div className='heading h-auto'>
                                                        <div className="d-flex flex-wrap justify-content-between">
                                                            <div className='col-9'>
                                                                <h3 style={{ fontWeight: 900 }}>45</h3>
                                                                <p>Active Calls</p>
                                                            </div>
                                                            <div className='col-3'>
                                                                <i className="fa-solid fa-phone-arrow-down-left" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="itemWrapper d">
                                                    <div className='heading h-auto'>
                                                        <div className="d-flex flex-wrap justify-content-between">
                                                            <div className='col-9'>
                                                                <h3 style={{ fontWeight: 900 }}>10</h3>
                                                                <p>Calls On Queue</p>
                                                            </div>
                                                            <div className='col-3'>
                                                                <i className="fa-solid fa-phone-volume" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="itemWrapper a">
                                                    <div className='heading h-auto'>
                                                        <div className="d-flex flex-wrap justify-content-between">
                                                            <div className='col-9'>
                                                                <h3 style={{ fontWeight: 900 }}>$0.46</h3>
                                                                <p>Cost Per Call</p>
                                                            </div>
                                                            <div className='col-3'>
                                                                <i className="fa-solid fa-clock-rotate-left" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="itemWrapper b">
                                                    <div className='heading h-auto'>
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
                                    <div className='col-3 d-xxl-block d-xl-none'>
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
                                    <div className='col-xxl-5 col-xl-6'>
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
                                </div>
                            </div>
                            <div className='col-xl-12'>
                                <div className='overviewTableWrapper px-0'>
                                    <div className='overviewTableChild'>
                                        <div className='d-flex flex-wrap'>
                                            <div className='col-12'>
                                                <div className='heading'>
                                                    <div className="content">
                                                        <h4>Vendor Call Analytics {" "}
                                                            <button
                                                                className="clearButton"
                                                                onClick={handleRefreshBtnClicked}
                                                                disabled={refreshState}
                                                            >
                                                                <i
                                                                    className={
                                                                        refreshState
                                                                            ? "fa-regular fa-arrows-rotate fs-5 fa-spin"
                                                                            : "fa-regular fa-arrows-rotate fs-5"
                                                                    }
                                                                ></i>
                                                            </button>
                                                        </h4>
                                                        <p>You can see a brief analysis of all the vendors</p>
                                                    </div>
                                                    <div className='buttonGroup'>
                                                        <button effect="ripple" className="panelButton gray">
                                                            <span className="text">Back</span>
                                                            <span className="icon"><i className="fa-solid fa-caret-left"></i></span>
                                                        </button>
                                                        {/* <button effect="ripple" className="panelButton">
                                                            <span className="text">Refresh</span>
                                                            <span className="icon"><i className="fa-solid fa-arrows-rotate"></i></span>
                                                        </button> */}
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
                                                                <th>#</th>
                                                                <th>DID</th>
                                                                <th>Feature Tag</th>
                                                                <th>Total Calls</th>
                                                                <th>Ring Time</th>
                                                                <th>Talk Time</th>
                                                                <th>Total Time</th>
                                                                <th>Conversions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="">
                                                            <tr>
                                                                <td>1</td>
                                                                <td>19999999999</td>
                                                                <td>999</td>
                                                                <td>999</td>
                                                                <td>999</td>
                                                                <td>999</td>
                                                                <td>999</td>
                                                                <td>999</td>
                                                            </tr>
                                                            <tr>
                                                                <td>2</td>
                                                                <td>19999999999</td>
                                                                <td>999</td>
                                                                <td>999</td>
                                                                <td>999</td>
                                                                <td>999</td>
                                                                <td>999</td>
                                                                <td>999</td>
                                                            </tr>
                                                            <tr>
                                                                <td>3</td>
                                                                <td>19999999999</td>
                                                                <td>999</td>
                                                                <td>999</td>
                                                                <td>999</td>
                                                                <td>999</td>
                                                                <td>999</td>
                                                                <td>999</td>
                                                            </tr>
                                                            <tr>
                                                                <td>4</td>
                                                                <td>19999999999</td>
                                                                <td>999</td>
                                                                <td>999</td>
                                                                <td>999</td>
                                                                <td>999</td>
                                                                <td>999</td>
                                                                <td>999</td>
                                                            </tr>
                                                            <tr>
                                                                <td>5</td>
                                                                <td>19999999999</td>
                                                                <td>999</td>
                                                                <td>999</td>
                                                                <td>999</td>
                                                                <td>999</td>
                                                                <td>999</td>
                                                                <td>999</td>
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

export default TrackerDashboard