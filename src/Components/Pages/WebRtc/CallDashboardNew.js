import React from 'react'
import SideNavbarApp from './SideNavbarApp'

function CallDashboardNew() {
    return (
        <>
            <SideNavbarApp />
            <main className="mainContentApp p-2 me-0">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div>
                                <div className="flex-text">
                                    <div>
                                        <select
                                            name=""
                                            id=""
                                            className="formItem "
                                        >
                                            <option value="">(513) 254 1648</option>
                                            <option value="">(513) 254 1648</option>
                                            <option value="">(513) 254 1648</option>
                                        </select>
                                    </div>
                                    <div>
                                        <div className="timer">
                                            <input
                                                type="text"
                                                className=" formItem "
                                                defaultValue=""
                                                placeholder="Time"
                                            />
                                            <div className="time">
                                                <i className="fa-regular fa-clock" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-sm-4 col-lg-2">
                            <div className="card custom-card">
                                <div className="d-flex justify-content-between  ">
                                    <div className="text-paragraph">
                                        <p className="font-s20">56</p>
                                        <span>Agents logged in</span>
                                    </div>
                                    <div>
                                        <div className="bg-color-1">
                                            <i className="fa-regular fa-square-check" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4 col-lg-2">
                            <div className="card custom-card">
                                <div className="d-flex   justify-content-between  ">
                                    <div className="text-paragraph">
                                        <p className="font-s20">50</p>
                                        <span>Available Agents</span>
                                    </div>
                                    <div>
                                        <div className="bg-color-2">
                                            <i className="fa-solid fa-user-minus" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4 col-lg-2">
                            <div className="card custom-card">
                                <div className="d-flex   justify-content-between  ">
                                    <div className="text-paragraph">
                                        <p className="font-s20">45</p>
                                        <span>Waiting Calls</span>
                                    </div>
                                    <div>
                                        <div className="bg-color-3">
                                            <i className="fa-solid fa-phone" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4 col-lg-2">
                            <div className="card custom-card">
                                <div className="d-flex   justify-content-between  ">
                                    <div className="text-paragraph">
                                        <p className="font-s20">78</p>
                                        <span>Active Calls</span>
                                    </div>
                                    <div>
                                        <div className="bg-color-4">
                                            <i className="fa-solid fa-phone-volume" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4 col-lg-2">
                            <div className="card custom-card">
                                <div className="d-flex   justify-content-between  ">
                                    <div className="text-paragraph">
                                        <p className="font-s20">545</p>
                                        <span>Calls on Queue</span>
                                    </div>
                                    <div>
                                        <div className="bg-color-5">
                                            <i className="fa-solid fa-phone-slash" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4 col-lg-2">
                            <div className="card custom-card">
                                <div className="d-flex   justify-content-between  ">
                                    <div className="text-paragraph">
                                        <p className="font-s20">
                                            7 <span>second</span>
                                        </p>
                                        <span style={{ fontSize: '10px' }}>Average Response Time</span>
                                    </div>
                                    <div>
                                        <div className="bg-color-6">
                                            <i className="fa-regular fa-clock" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-md-3">
                            <div className="card chats custom-card">
                                <div className="flex-text boder-btm">
                                    <div className="text-paragraph">
                                        <p>Call Per Hour</p>
                                    </div>
                                    <div>
                                        <i className="fa-solid fa-bars" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="card  custom-card">
                                            <div className="text-paragraph">
                                                <p className="font-s18">00:06</p>
                                                <p className='text-colors'>Call per minutes</p>
                                              
                                                <span style={{ color: "#959595", fontSize: 11 }}>Today</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4 ">
                                        <div className="card  custom-card">
                                            <div className="text-paragraph">
                                                <p className="font-s18">06:00</p>
                                                <p className='text-colors'>Average Call time </p>
                                                
                                         
                                                <span style={{ color: "#959595", fontSize: 11 }}>Today</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4 ">
                                        <div className="card  custom-card">
                                            <div className="text-paragraph">
                                                <p className="font-s18">00:03</p>
                                                <p className='text-colors'>Average Response Time</p>
                                               
                                               
                                                <span style={{ color: "#959595", fontSize: 11 }}>Today</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-md-6">
                                        <div className="card  custom-card">
                                            <div className="flex-text boder-btm">
                                                <div className="text-paragraph">
                                                    <p className="font-s18" style={{ color: "red" }}>
                                                        16
                                                    </p>
                                                    <span>Missed Calls</span>
                                                </div>
                                                <div>
                                                    <div className="text-paragraph">
                                                        <p
                                                            className="font-s18 text-end"
                                                            style={{ color: "green" }}
                                                        >
                                                            169
                                                        </p>
                                                        <span>Answered Calls</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-text p-2">
                                                <div className="text-paragraph">
                                                    <p className="font-s18" style={{ color: "#f8bb63" }}>
                                                        24
                                                    </p>
                                                    <span>Abandoned Calls</span>
                                                </div>
                                                <div>
                                                    <div className="text-paragraph">
                                                        <p
                                                            className="font-s18 text-end"
                                                            style={{ color: "#76bef7" }}
                                                        >
                                                            785
                                                        </p>
                                                        <span>Totals Calls</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="card  custom-card">
                                            <div className="flex-text boder-btm">
                                                <div className="text-paragraph">
                                                    <p className="font-s18">00:00:16</p>
                                                    <span  style={{ fontSize: '10px' }}>Average Waiting Time</span>
                                                </div>
                                                <div>
                                                    <div className="text-paragraph">
                                                        <p className="font-s18">00:00:28</p>
                                                        <span>Average Talking Time</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-center p-2 ">
                                                <div>
                                                    <div className="text-paragraph">
                                                        <p className="font-s18">00:10:28</p>
                                                        <span>Max Waiting Calls</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card custom-card chats text-paragraph  ">
                                <p className="boder-btm">Call Summary </p>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="card custom-card text-paragraph">
                                        <p>Call transferred</p>
                                        <div className="flex-text mt-2">
                                            <div>
                                                <span>Today</span>
                                                <div className="flex-text-1 text-paragraph">
                                                    <p>03</p>
                                                    <div className="icons ms-2">
                                                        <i className="fa-solid fa-arrow-trend-up" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <span>This week </span>
                                                <div className="flex-text-1 text-paragraph">
                                                    <p>03</p>
                                                    <div className="icons ms-2">
                                                        <i className="fa-solid fa-arrow-trend-up" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <span>This month</span>
                                                <div className="flex-text-1 text-paragraph">
                                                    <p>25</p>
                                                    <div className="icons-1 ms-2">
                                                        <i className="fa-solid fa-arrow-trend-down" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="card custom-card  text-paragraph">
                                        <p>Total Calls Completed</p>
                                        <div className="flex-text mt-2">
                                            <div>
                                                <span>Today</span>
                                                <div className="flex-text-1  text-paragraph">
                                                    <p>28</p>
                                                    <div className="icons ms-2">
                                                        <i className="fa-solid fa-arrow-trend-up" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <span>This week </span>
                                                <div className="flex-text-1 text-paragraph">
                                                    <p>82</p>
                                                    <div className="icons ms-2">
                                                        <i className="fa-solid fa-arrow-trend-up" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <span>This month</span>
                                                <div className="flex-text-1 text-paragraph">
                                                    <p>259</p>
                                                    <div className="icons-1 ms-2">
                                                        <i className="fa-solid fa-arrow-trend-down" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-6">
                                    <div className="card custom-card text-paragraph">
                                        <p>Calls Abandoned</p>
                                        <div className="flex-text mt-2">
                                            <div>
                                                <span>Today</span>
                                                <div className="flex-text-1 text-paragraph">
                                                    <p>03</p>
                                                    {/* <div class="icons ms-2"><i class="fa-solid fa-arrow-trend-up"></i></div> */}
                                                </div>
                                            </div>
                                            <div>
                                                <span>This week </span>
                                                <div className="flex-text-1">
                                                    <p>09</p>
                                                    {/* <div class="icons ms-2"><i class="fa-solid fa-arrow-trend-up"></i></div> */}
                                                </div>
                                            </div>
                                            <div>
                                                <span>This month</span>
                                                <div className="flex-text-1 text-paragraph">
                                                    <p>23</p>
                                                    {/* <div class="icons-1 ms-2"><i class="fa-solid fa-arrow-trend-down"></i></div> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="card custom-card text-paragraph">
                                        <p>Call not Answer</p>
                                        <div className="flex-text mt-2">
                                            <div>
                                                <span>Today</span>
                                                <div className="flex-text-1 text-paragraph">
                                                    <p>00</p>
                                                    {/* <div class="icons-1 ms-2"><i class="fa-solid fa-arrow-trend-down"></i></div> */}
                                                </div>
                                            </div>
                                            <div>
                                                <span>This week </span>
                                                <div className="flex-text-1 text-paragraph">
                                                    <p>45</p>
                                                    {/* <div class="icons ms-2"><i class="fa-solid fa-arrow-trend-up"></i></div> */}
                                                </div>
                                            </div>
                                            <div>
                                                <span>This month</span>
                                                <div className="d-flex text-paragraph">
                                                    <p>09</p>
                                                    {/* <div class="icons-1 ms-2"><i class="fa-solid fa-arrow-trend-down"></i></div> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-6">
                                    <div className="card custom-card text-paragraph">
                                        <p>Repeat Calls</p>
                                        <div className="flex-text mt-2">
                                            <div>
                                                <span>Today</span>
                                                <div className="flex-text-1  text-paragraph">
                                                    <p>18</p>
                                                    {/* <div class="icons ms-2"><i class="fa-solid fa-arrow-trend-up"></i></div> */}
                                                </div>
                                            </div>
                                            <div>
                                                <span>This week </span>
                                                <div className="d-flex  text-paragraph">
                                                    <p>43</p>
                                                    {/* <div class="icons ms-2"><i class="fa-solid fa-arrow-trend-up"></i></div> */}
                                                </div>
                                            </div>
                                            <div>
                                                <span>This month</span>
                                                <div className="flex-text-1  text-paragraph">
                                                    <p>965</p>
                                                    {/* <div class="icons-1 ms-2"><i class="fa-solid fa-arrow-trend-down"></i></div> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="card custom-card text-paragraph">
                                        <p>Average call lengths</p>
                                        <div className="flex-text mt-2">
                                            <div>
                                                <span>Today</span>
                                                <div className="flex-text-1  text-paragraph">
                                                    <p>00:02</p>
                                                    {/* <div class="icons ms-2"><i class="fa-solid fa-arrow-trend-up"></i></div> */}
                                                </div>
                                            </div>
                                            <div>
                                                <span>This week </span>
                                                <div className="flex-text-1  text-paragraph">
                                                    <p>00:45:00</p>
                                                    {/* <div class="icons ms-2"><i class="fa-solid fa-arrow-trend-up"></i></div> */}
                                                </div>
                                            </div>
                                            <div>
                                                <span>This month</span>
                                                <div className="flex-text-1  text-paragraph">
                                                    <p>3:50</p>
                                                    {/* <div class="icons-1 ms-2"><i class="fa-solid fa-arrow-trend-down"></i></div> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card custom-card chats-height">
                                <div className="flex-text boder-btm  text-paragraph">
                                    <div>
                                        <p>Call Results Last 30 days</p>
                                    </div>
                                    <div className="icons-2">
                                        <div className="zoom-in me-2 ">
                                            <i className="fa-solid  fa-plus" />
                                        </div>
                                        <div className="zoom-out me-2">
                                            <i className="fa-solid fa-minus " />
                                        </div>
                                        <i className="fa-solid fa-magnifying-glass-plus me-2" />
                                        <i className="fa-regular fa-hand me-2" />
                                        <i className="fa-solid fa-house me-2" />
                                        <i className="fa-solid fa-bars me-2" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

        </>
    )
}

export default CallDashboardNew