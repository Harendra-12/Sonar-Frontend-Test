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
                                            <div className="col-xxl-2 col-xl-2 col-lg-3 col-md-3 col-sm-6 col-12">
                                                <div className="call_dCard  a">
                                                    <div className='heading '>
                                                        <div className="d-flex flex-wrap justify-content-center align-items-center flex-column">
                                                            <div className="imageBox_wrap">
                                                                <img className=" " src={require('../../assets/images/call-dashboardIcon/total-call.webp')} alt='customer-service' />
                                                            </div>
                                                            <div className='text-center'>
                                                                <p className='mb-1'>Total Calls</p>
                                                                <h3 className="mb-0 fw-bolder">100</h3>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xxl-2 col-xl-2 col-lg-3 col-md-3 col-sm-6 col-12">
                                                <div className="call_dCard b">
                                                    <div className='heading '>
                                                        <div className="d-flex flex-wrap justify-content-center align-items-center flex-column">
                                                            <div className="imageBox_wrap">
                                                                <img className=" " src={require('../../assets/images/call-dashboardIcon/time-call.webp')} alt='customer-service' />
                                                            </div>
                                                            <div className='text-center'>
                                                                <p className='mb-1'>Total Call Duration</p>
                                                                <h3 className="mb-0 fw-bolder">00:00:00</h3>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xxl-2 col-xl-2 col-lg-3 col-md-3 col-sm-6 col-12">
                                                <div className="call_dCard c">
                                                    <div className='heading h-auto'>
                                                        <div className="d-flex flex-wrap justify-content-center align-items-center flex-column">
                                                            <div className="imageBox_wrap">
                                                                <img className=" " src={require('../../assets/images/call-dashboardIcon/technical-support.webp')} alt='customer-service' />
                                                            </div>
                                                            <div className='text-center'>
                                                                <p className='mb-1'>Active Calls</p>
                                                                <h3 className="mb-0 fw-bolder">45</h3>
                                                            </div>
                                                            {/* <div className=''>
                                                                <i className="fa-solid fa-phone-arrow-down-left onlyAgent" />
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xxl-2 col-xl-2 col-lg-3 col-md-3 col-sm-6 col-12">
                                                <div className="call_dCard d">
                                                    <div className='heading '>
                                                        <div className="d-flex flex-wrap justify-content-center align-items-center flex-column">
                                                            <div className="imageBox_wrap">
                                                                <img className=" " src={require('../../assets/images/call-dashboardIcon/conversation.webp')} alt='customer-service' />
                                                            </div>
                                                            <div className='text-center'>
                                                                <p className='mb-1'>Calls On Queue</p>
                                                                <h3 className="mb-0 fw-bolder">10</h3>
                                                            </div>
                                                            {/* <div className='col-3'>
                                                                <i className="fa-solid fa-phone-volume onlyAgent" />
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xxl-2 col-xl-2 col-lg-3 col-md-3 col-sm-6 col-12">
                                                <div className="call_dCard a">
                                                    <div className='heading'>
                                                        <div className="d-flex flex-wrap justify-content-center align-items-center flex-column">
                                                            <div className="imageBox_wrap">
                                                                <img className=" " src={require('../../assets/images/call-dashboardIcon/money.webp')} alt='customer-service' />
                                                            </div>
                                                            <div className='text-center'>
                                                                <p className='mb-1'>Cost Per Call</p>
                                                                <h3 className="mb-0 fw-bolder">$0.46</h3>
                                                            </div>
                                                            {/* <div className='col-3'>
                                                                <i className="fa-solid fa-clock-rotate-left onlyAgent" />
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xxl-2 col-xl-2 col-lg-3 col-md-3 col-sm-6 col-12">
                                                <div className="call_dCard b">
                                                    <div className='heading '>
                                                        <div className="d-flex flex-wrap justify-content-center align-items-center flex-column">
                                                            <div className="imageBox_wrap">
                                                                <img className=" " src={require('../../assets/images/call-dashboardIcon/total-call.webp')} alt='customer-service' />
                                                            </div>
                                                            <div className='text-center'>
                                                                <p className='mb-1'>Avg. Response Time</p>
                                                                <h3 className="mb-0 fw-bolder">7 <span style={{ fontSize: '15px', fontWeight: '500' }}>seconds</span></h3>
                                                            </div>
                                                            {/* <div className='col-3'>
                                                                <i className="fa-solid fa-phone-slash onlyAgent" />
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-xxl-6 col-xl-6 '>
                                        <div className="itemWrapper a">
                                            <div className='heading h-auto'>
                                                <div className="d-flex flex-wrap justify-content-between align-items-center">
                                                    <div className='col-auto'>
                                                        <h5>Call Per Hour</h5>
                                                    </div>
                                                    <div className='col-auto'>
                                                        {/* <ul class=" chart_tabs" >
                                                            <li class="nav-item">
                                                                <button class="nav-link active" >1hr</button>
                                                            </li>
                                                            <li class="nav-item">
                                                                <button class="nav-link" >6hr</button>
                                                            </li>
                                                            <li class="nav-item">
                                                                <button class="nav-link" >12hr</button>
                                                            </li>
                                                            <li class="nav-item">
                                                                <button class="nav-link" >24hr</button>
                                                            </li>
                                                            <li class="nav-item">
                                                                <button class="nav-link" >48hr</button>
                                                            </li>
                                                            <li class="nav-item">
                                                                <button class="nav-link">72hr</button>
                                                            </li>

                                                        </ul> */}
                                                        <ul class="chart_tabs" >
                                                            <li class="nav-item">
                                                                <input class="nav-link" type="radio" name="graphFilter" defaultChecked={true}
                                                                    value="7_days"
                                                                // checked={graphFilter.numberOfCall.date === '7_days'}
                                                                // onChange={(e) =>
                                                                //     setGraphFilter((prevGraphData) => ({
                                                                //         ...prevGraphData,
                                                                //         numberOfCall: {
                                                                //             ...prevGraphData.numberOfCall,
                                                                //             date: e.target.value,
                                                                //         },
                                                                //     }))
                                                                // }
                                                                />
                                                                <button class="nav-link">7 Days</button>
                                                            </li>
                                                            <li class="nav-item">
                                                                <input class="nav-link" type="radio" name="graphFilter" value="1_month"
                                                                // checked={graphFilter.numberOfCall.date === '1_month'}
                                                                // onChange={(e) =>
                                                                //     setGraphFilter((prevGraphData) => ({
                                                                //         ...prevGraphData,
                                                                //         numberOfCall: {
                                                                //             ...prevGraphData.numberOfCall,
                                                                //             date: e.target.value,
                                                                //         },
                                                                //     }))
                                                                // }
                                                                />
                                                                <button class="nav-link">1 Month</button>
                                                            </li>
                                                            <li class="nav-item">
                                                                <input class="nav-link" type="radio" name="graphFilter" value="3_month"
                                                                // checked={graphFilter.numberOfCall.date === '3_month'}
                                                                // onChange={(e) =>
                                                                //     setGraphFilter((prevGraphData) => ({
                                                                //         ...prevGraphData,
                                                                //         numberOfCall: {
                                                                //             ...prevGraphData.numberOfCall,
                                                                //             date: e.target.value,
                                                                //         },
                                                                //     }))
                                                                // }
                                                                />
                                                                <button class="nav-link">3 Month</button>
                                                            </li>
                                                            <li class="nav-item">
                                                                <input class="nav-link" type="radio" name="graphFilter" value="6_month"
                                                                // checked={graphFilter.numberOfCall.date === '6_month'}
                                                                // onChange={(e) =>
                                                                //     setGraphFilter((prevGraphData) => ({
                                                                //         ...prevGraphData,
                                                                //         numberOfCall: {
                                                                //             ...prevGraphData.numberOfCall,
                                                                //             date: e.target.value,
                                                                //         },
                                                                //     }))
                                                                // }
                                                                />
                                                                <button class="nav-link">6 Month</button>
                                                            </li>
                                                            <li class="nav-item">
                                                                <input class="nav-link" type="radio" name="graphFilter" value="12_month"
                                                                // checked={graphFilter.numberOfCall.date === '12_month'}
                                                                // onChange={(e) =>
                                                                //     setGraphFilter((prevGraphData) => ({
                                                                //         ...prevGraphData,
                                                                //         numberOfCall: {
                                                                //             ...prevGraphData.numberOfCall,
                                                                //             date: e.target.value,
                                                                //         },
                                                                //     }))
                                                                // }
                                                                />
                                                                <button class="nav-link">12 Month</button>
                                                            </li>
                                                        </ul>
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
                                                                    <div className='agent_badge success_badge '>28 <i className="fa-solid fa-arrow-trend-up " /></div>
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
                                                                    <div className='agent_badge success_badge '>28 <i className="fa-solid fa-arrow-trend-up " /></div>
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
                                                                    <div className='agent_badge success_badge '>28 <i className="fa-solid fa-arrow-trend-up " /></div>
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
                                                                    <div className='agent_badge danger_badge '>08 <i className="fa-solid fa-arrow-trend-up " /></div>
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
                                                                <th className='text-center'>Edit</th>
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
                                                                        className="tableButton edit mx-auto"
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
                                                                        className="tableButton edit mx-auto"
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
                                                                        className="tableButton edit mx-auto"
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
                                                                        className="tableButton edit mx-auto"
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
                                                                        className="tableButton edit mx-auto"
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