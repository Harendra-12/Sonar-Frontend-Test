import React from 'react'
import Header from '../../CommonComponents/Header'
import GraphChart from '../../CommonComponents/GraphChart'
import DoughnutChart from '../../CommonComponents/DoughnutChart'

function DialerDashboard() {
    return (
        <main className='mainContent'>
            <section id="phonePage">
                <Header title="Dialer Dashboard" />
                <section className="py-2">
                    <div className="container-fluid">
                        {/* <div className="row">
                            <div className="col-md-12">
                                <div>
                                    <div className="flex-text">
                                        <div>
                                            <select
                                                name=""
                                                id=""
                                                className="form-select form-select-sm test-demo-border"
                                            >
                                                <option value="">(513) 254 1648</option>
                                                <option value="">(513) 254 1648</option>
                                                <option value="">(513) 254 1648</option>
                                            </select>
                                        </div>
                                        <div>
                                            <div className="timer ">
                                                <input
                                                    type="text"
                                                    className="form-control  form-control-sm"
                                                    defaultValue=""
                                                    placeholder="Time"
                                                />
                                            </div>
                                            <div className="time">
                                                <i className="fa-regular fa-clock" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        <div className="row mt-3 gx-3">
                            <div className="col-lg-2 col-md-2 col-sm-4 mb-sm-2 col-xl-2 ">
                                <div className="itemWrapper a">
                                    <div className='heading h-auto'>
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
                                    <div className='heading h-auto'>
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
                                    <div className='heading h-auto'>
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
                                    <div className='heading h-auto'>
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
                                    <div className='heading h-auto'>
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
                        <div className="row mt-3 gx-3">
                            <div className="col-xl-3 col-sm-12 mb-md-2 mb-sm-2 col-md-12 ">
                                <div className="itemWrapper a">
                                    <div className='heading h-auto'>
                                        <h5>Call Per Hour</h5>
                                    </div>
                                    <div className='d-flex flex-wrap justify-content-between mt-1'>
                                        <DoughnutChart
                                            fields={["Missed", "Total"]}
                                            percentage={[
                                                150,
                                                250,
                                            ]}
                                            colors={["#FF638470", "#36A2EB70"]}
                                            height={'235px'}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-6">
                                <div className="row gx-3">
                                    <div className="col-md-4 ">
                                        <div className="itemWrapper a">
                                            <div className='heading h-auto'>
                                                <h3 style={{ fontWeight: 700 }}>00:06</h3>
                                                <p className='mb-1'>Call per minutes</p>
                                                <p>Today</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4 ">
                                        <div className="itemWrapper a">
                                            <div className='heading h-auto'>
                                                <h3 style={{ fontWeight: 700 }}>06:00</h3>
                                                <p className='mb-1'>Average Call time</p>
                                                <p>Today</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4 ">
                                        <div className="itemWrapper a">
                                            <div className='heading h-auto'>
                                                <h3 style={{ fontWeight: 700 }}>00:03</h3>
                                                <p className='mb-1'>Average Response time</p>
                                                <p>Today</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-3 gx-3">
                                    <div className="col-md-6 mb-md-2">
                                        <div className="itemWrapper a">
                                            <div className='heading h-auto'>
                                                <div className="d-flex flex-wrap justify-content-between">
                                                    <div className='col-6'>
                                                        <h3 style={{ color: "#dd2e2f", fontWeight: 700 }}>
                                                            16
                                                        </h3>
                                                        <p>Missed Calls</p>
                                                    </div>
                                                    <div className='col-6 text-end'>
                                                        <h3 style={{ color: "#01c78e", fontWeight: 700 }}>
                                                            169
                                                        </h3>
                                                        <p>Answered Calls</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='heading h-auto pt-2 mt-2' style={{ borderTop: '1px solid var(--border-color)' }}>
                                                <div className="d-flex flex-wrap justify-content-between">
                                                    <div className='col-6'>
                                                        <h3 style={{ color: "#f7a733", fontWeight: 700 }}>
                                                            24
                                                        </h3>
                                                        <p>Abandoned Calls</p>
                                                    </div>
                                                    <div className='col-6 text-end'>
                                                        <h3 style={{ color: "#3388f7", fontWeight: 700 }}>
                                                            785
                                                        </h3>
                                                        <p>Totals Calls</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6  mb-md-2">
                                        <div className="itemWrapper a">
                                            <div className='heading h-auto'>
                                                <div className="d-flex flex-wrap justify-content-between">
                                                    <div className='col-6'>
                                                        <h3 style={{ fontWeight: 700 }}>
                                                            00:00:16
                                                        </h3>
                                                        <p>Avg. Waiting Time</p>
                                                    </div>
                                                    <div className='col-6 text-end'>
                                                        <h3 style={{ fontWeight: 700 }}>
                                                            00:00:28
                                                        </h3>
                                                        <p>Avg. Talking Time</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='heading h-auto pt-2 mt-2' style={{ borderTop: '1px solid var(--border-color' }}>
                                                <div className="d-flex flex-wrap justify-content-between">
                                                    <div className='col-12 text-center'>
                                                        <h3 style={{ fontWeight: 700 }}>
                                                            00:10:28
                                                        </h3>
                                                        <p>Max Waiting Calls</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3">
                                <div className="itemWrapper a">
                                    <div className='heading h-auto'>
                                        <div className="d-flex flex-wrap justify-content-between">
                                            <div className='col-9'>
                                                <h5>Call Summary</h5>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='d-flex flex-wrap justify-content-between'>
                                        <DoughnutChart
                                            fields={["Missed", "Total"]}
                                            percentage={[
                                                150,
                                                250,
                                            ]}
                                            colors={["#FF638470", "#36A2EB70"]}
                                            height={'235px'}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-3 gx-3">
                            <div className="col-md-6">
                                <div className="row g-3">
                                    <div className="col-xl-6">
                                        <div className="itemWrapper a">
                                            <div className='heading h-auto mb-2'>
                                                <h5>Call Transferred</h5>
                                            </div>

                                            <div className='data-number2 h-auto'>
                                                <div className="d-flex flex-wrap justify-content-between">
                                                    <div className='col-4'>
                                                        <p>Today</p>
                                                        <h4>03 <i className="fa-solid fa-arrow-trend-up" style={{ color: '#01c78e' }} /></h4>
                                                    </div>
                                                    <div className='col-4 text-center'>
                                                        <p>This Week</p>
                                                        <h4>03 <i className="fa-solid fa-arrow-trend-up" style={{ color: '#01c78e' }} /></h4>
                                                    </div>
                                                    <div className='col-4 text-end'>
                                                        <p>This Month</p>
                                                        <h4>03 <i className="fa-solid fa-arrow-trend-down" style={{ color: '#dd2e2f' }} /></h4>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-6">
                                        <div className="itemWrapper a">
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
                                        <div className="itemWrapper a">
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
                                        <div className="itemWrapper a">
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
                                        <div className="itemWrapper a">
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
                                    <div className="col-xl-6">
                                        <div className="itemWrapper a">
                                            <div className='heading h-auto'>
                                                <h5>Avg. call lengths</h5>
                                            </div>

                                            <div className='data-number2 h-auto'>
                                                <div className="d-flex flex-wrap justify-content-between">
                                                    <div className='col-4'>
                                                        <p>Today</p>
                                                        <h4>00:00:02</h4>
                                                    </div>
                                                    <div className='col-4 text-center'>
                                                        <p>This Week</p>
                                                        <h4>00:45:00</h4>
                                                    </div>
                                                    <div className='col-4 text-end'>
                                                        <p>This Month</p>
                                                        <h4>00:03:50</h4>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
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
                                            height={'281px'}
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
                        </div>
                    </div>
                </section>
            </section>


        </main>

    )
}

export default DialerDashboard