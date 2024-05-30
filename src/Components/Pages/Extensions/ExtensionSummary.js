import React from 'react'

const ExtensionSummary = () => {
    return (
        <main className="mainContent">
            <section id="phonePage">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="row px-xl-3 py-2" id="detailsHeader">
                                <div className="col-xl-6 d-flex align-items-center">
                                    <h4 className="my-auto">Extension Summary</h4>
                                </div>
                                <div className="col-xl-6 d-flex justify-content-end">
                                    <div className="mx-3 my-auto">
                                        <button
                                            className="getApp"
                                            effect="ripple"
                                        >
                                            Get Our App
                                        </button>
                                    </div>
                                    <div className="profileHolder">
                                        <img
                                            src={require("../../assets/images/profilepic.png")}
                                            alt="img"
                                        />
                                    </div>
                                </div>
                                {/* <div className="col-12 my-2">
                                    <p className="p-0 m-0">Use this to monitor and interact with the active calls. </p>
                                </div> */}
                                <div className="mt-1" />
                                <div className="col-9 my-auto row gy-2">
                                    <div className="col-3">
                                        <label className="formLabel p-0">Quick Select</label>
                                        <div className="my-auto context">
                                            <select className="formItem w-100 shadow-none" name="" id="selectFormRow">
                                                <option value="last7">Last 7 Days</option>
                                                <option value="lasthour">Last Hour</option>
                                                <option value="today">
                                                    Today
                                                </option>
                                                <option value="yesterday">Yesterday</option>
                                                <option value="thisweek">This Week</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-3">
                                        <label className="formLabel p-0">Include Internal</label>
                                        <div className="my-auto context">
                                            <select className="formItem w-100 shadow-none" name="" id="selectFormRow">
                                                <option value="true">True</option>
                                                <option value="false">False</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-3">
                                        <label className="formLabel p-0">Start Date/Time</label>
                                        <input
                                            type="text"
                                            className="formItem py-1"
                                            id="datetimepicker"
                                            placeholder="From"
                                        />
                                    </div>
                                    <div className="col-3">
                                        <label className="formLabel p-0">End Date/Time</label>
                                        <input
                                            type="text"
                                            className="formItem py-1"
                                            id="datetimepicker2"
                                            placeholder="To"
                                        />
                                    </div>
                                    {/* <div className="position-relative searchBox">
                              <input type="search" name="Search" id="headerSearch" placeholder="Search">
                          </div> */}
                                </div>
                                <div className="col-3 mt-auto">
                                    <div className="d-flex justify-content-end">
                                        <button effect="ripple" className="panelButton">
                                            Download CSV
                                        </button>
                                        <button effect="ripple" className="panelButton">
                                            Reset
                                        </button>
                                        <button effect="ripple" className="panelButton">
                                            Update
                                        </button>
                                        {/* <div className="my-auto position-relative mx-3">
                                  <label className="switch">
                                      <input type="checkbox" id="showAllCheck" onchange="toggleDomain()">
                                      <span className="slider round"></span>
                                  </label>
                                  <span className="position-relative mx-1">Show All</span>
                              </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12" style={{ overflow: "auto" }}>
                            <div className="tableContainer">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>
                                                <input
                                                    type="checkbox"
                                                    id="tableCheckbox"
                                                    name="demoValue"
                                                    defaultValue="demoValue"
                                                />
                                            </th>
                                            {/* <th id="domain">Domains</th> */}
                                            <th>Extension</th>
                                            <th>Answered</th>
                                            <th>Missed</th>
                                            <th>CC Missed</th>
                                            <th>Busy</th>
                                            <th>ALOC</th>
                                            <th>Inbound Calls</th>
                                            <th>Inbound Duration</th>
                                            <th>Outbound Calls</th>
                                            <th>Outbound Duration</th>
                                            <th>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr >
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    id="tableCheckbox"
                                                    name="demoValue"
                                                    defaultValue="demoValue"
                                                />
                                            </td>
                                            {/* <td id="domain">0.0.0.0</td> */}
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td className="ellipsis" id="detailBox">
                                                10000000000001
                                            </td>
                                        </tr>
                                        <tr >
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    id="tableCheckbox"
                                                    name="demoValue"
                                                    defaultValue="demoValue"
                                                />
                                                {/* <td id="domain">1.1.1.1</td> */}
                                            </td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                        </tr>
                                        <tr >
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    id="tableCheckbox"
                                                    name="demoValue"
                                                    defaultValue="demoValue"
                                                />
                                            </td>
                                            {/* <td id="domain">2.2.2.2</td> */}
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                        </tr>
                                        <tr >
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    id="tableCheckbox"
                                                    name="demoValue"
                                                    defaultValue="demoValue"
                                                />
                                            </td>
                                            {/* <td id="domain">1.1.1.1</td> */}
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                        </tr>
                                        <tr >
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    id="tableCheckbox"
                                                    name="demoValue"
                                                    defaultValue="demoValue"
                                                />
                                                {/* <td id="domain">5.5.5.5</td> */}
                                            </td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                        </tr>
                                        <tr >
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    id="tableCheckbox"
                                                    name="demoValue"
                                                    defaultValue="demoValue"
                                                />
                                            </td>
                                            {/* <td id="domain">6.6.6.6</td> */}
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                            <td>1001</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>

    )
}

export default ExtensionSummary