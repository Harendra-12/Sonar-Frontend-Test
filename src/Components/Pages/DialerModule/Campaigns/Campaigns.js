import React from 'react'
import Header from '../../../CommonComponents/Header'

function Campaigns() {
    return (
        <>
            <main className='mainContent'>
                <section className="campaignPage">
                    <div className="container-fluid">
                        <div className="row">
                            <Header title="Dialer" />
                            <div className='overviewTableWrapper'>
                                <div className='overviewTableChild'>
                                    <div className='d-flex flex-wrap'>
                                        <div class="col-12">
                                            <div class="heading">
                                                <div class="content">
                                                    <h4>Campaigns</h4>
                                                    <p>You can see the list of campaigns</p>
                                                </div>
                                                <div class="buttonGroup">
                                                    <button class="panelButton gray">
                                                        <span class="text">Back</span>
                                                        <span class="icon"><i class="fa-solid fa-caret-left"></i></span>
                                                    </button>
                                                    <button class="panelButton">
                                                        <span class="text">Create</span>
                                                        <span class="icon"><i class="fa-solid fa-plus"></i></span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-12' style={{ overflow: 'auto', padding: '25px 20px 0px' }}>
                                            <div class="tableHeader">
                                                <div class="showEntries">
                                                    <label>Show</label>
                                                    <select class="formItem">
                                                        <option value="10">10</option>
                                                        <option value="20">20</option>
                                                        <option value="30">30</option>
                                                    </select>
                                                    <label>entries</label>
                                                </div>
                                                <div class="searchBox">
                                                    <label>Search:</label>
                                                    <input type="text" class="formItem" value="" />
                                                </div>
                                            </div>
                                            <div className='tableContainer'>
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th />
                                                            <th>Name</th>
                                                            <th>Mode</th>
                                                            <th>DID(s)</th>
                                                            <th>Gateway</th>
                                                            <th>Progress</th>
                                                            <th>Agents</th>
                                                            <th>Records</th>
                                                            <th />
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <div className="d-flex align-items-center justify-content-start ">
                                                                    <div className="phone-call">
                                                                        <i className="fa-solid fa-phone" />
                                                                    </div>
                                                                    <div>
                                                                        <span className="ms-1">Running</span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td><b>motor cycle gear with a 15% discount</b></td>
                                                            <td>Broadcast</td>
                                                            <td>1800123465</td>
                                                            <td>Gateway</td>
                                                            <td className="">
                                                                <div
                                                                    className="specialProgressWrap  dropdown"
                                                                    style={{ cursor: "pointer" }}
                                                                >
                                                                    <div className="specialProgress">
                                                                        <div className='segment success' style={{ width: '85%' }}></div>
                                                                        <div className='segment fail' style={{ width: '5%' }}></div>
                                                                        <div className='segment pending' style={{ width: '10%' }}></div>
                                                                    </div>
                                                                    <div className="dropdown-content">
                                                                        <div>
                                                                            <div className="">
                                                                                <div className="d-flex align-items-center justify-content-start">
                                                                                    <p
                                                                                        className="text-paragraph p-1 m-0"
                                                                                        style={{ fontSize: 10, fontWeight: 500 }}
                                                                                    >
                                                                                        LEADS IN TOTAL
                                                                                    </p>
                                                                                    <span className="test-demos">1000</span>
                                                                                </div>
                                                                                <div className="border-test">
                                                                                    <p
                                                                                        style={{
                                                                                            color: "rgb(92, 92, 92)",
                                                                                            fontSize: 12,
                                                                                            fontWeight: 400
                                                                                        }}
                                                                                        className="p-0 m-0"
                                                                                    >
                                                                                        Completed records
                                                                                    </p>
                                                                                    <div className="specialProgressWrap">
                                                                                        <div className="specialProgress">
                                                                                            <div className='segment success' style={{ width: '85%' }}></div>
                                                                                            <div className='segment fail' style={{ width: '5%' }}></div>
                                                                                            <div className='segment pending' style={{ width: '10%' }}></div>
                                                                                        </div>
                                                                                        <div className="specialProgressText">
                                                                                            <p>0.00%</p>
                                                                                            <span>0 of 1000</span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <p
                                                                                        style={{
                                                                                            color: "rgb(92, 92, 92)",
                                                                                            fontSize: 12,
                                                                                            fontWeight: 400
                                                                                        }}
                                                                                        className="p-0 m-0"
                                                                                    >
                                                                                        Failed records
                                                                                    </p>
                                                                                    <div className="specialProgressWrap">
                                                                                        <div className="specialProgress">
                                                                                            <div className='segment success' style={{ width: '85%' }}></div>
                                                                                            <div className='segment fail' style={{ width: '5%' }}></div>
                                                                                            <div className='segment pending' style={{ width: '10%' }}></div>
                                                                                        </div>
                                                                                        <div className="specialProgressText">
                                                                                            <p>0.00%</p>
                                                                                            <span>0 of 1000</span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <p
                                                                                        style={{
                                                                                            color: "rgb(92, 92, 92)",
                                                                                            fontSize: 12,
                                                                                            fontWeight: 400
                                                                                        }}
                                                                                        className="p-0 m-0"
                                                                                    >
                                                                                        Request records
                                                                                    </p>
                                                                                    <div className="specialProgressWrap">
                                                                                        <div className="specialProgress">
                                                                                            <div className='segment success' style={{ width: '85%' }}></div>
                                                                                            <div className='segment fail' style={{ width: '5%' }}></div>
                                                                                            <div className='segment pending' style={{ width: '10%' }}></div>
                                                                                        </div>
                                                                                        <div className="specialProgressText">
                                                                                            <p>0.00%</p>
                                                                                            <span>0 of 1000</span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <p
                                                                                        style={{
                                                                                            color: "rgb(92, 92, 92)",
                                                                                            fontSize: 12,
                                                                                            fontWeight: 400
                                                                                        }}
                                                                                        className="p-0 m-0"
                                                                                    >
                                                                                        Untouched records
                                                                                    </p>
                                                                                    <div className="specialProgressWrap">
                                                                                        <div className="specialProgress">
                                                                                            <div className='segment success' style={{ width: '85%' }}></div>
                                                                                            <div className='segment fail' style={{ width: '5%' }}></div>
                                                                                            <div className='segment pending' style={{ width: '10%' }}></div>
                                                                                        </div>
                                                                                        <div className="specialProgressText">
                                                                                            <p>0.00%</p>
                                                                                            <span>0 of 1000</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="specialProgressText">
                                                                        <p>0.00%</p>
                                                                        <span>0 of 1000</span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div>
                                                                    <div className="avatar-container">
                                                                        <img
                                                                            src="https://randomuser.me/api/portraits/men/1.jpg"
                                                                            alt="Avatar 1"
                                                                            className="avatar avatar1"
                                                                        />
                                                                        <img
                                                                            src="https://randomuser.me/api/portraits/men/2.jpg"
                                                                            alt="Avatar 2"
                                                                            className="avatar avatar2"
                                                                        />
                                                                        <img
                                                                            src="https://randomuser.me/api/portraits/men/3.jpg"
                                                                            alt="Avatar 3"
                                                                            className="avatar avatar3"
                                                                        />
                                                                        <img
                                                                            src="https://randomuser.me/api/portraits/men/4.jpg"
                                                                            alt="Avatar 4"
                                                                            className="avatar avatar4"
                                                                        />
                                                                        <img
                                                                            src="https://randomuser.me/api/portraits/men/5.jpg"
                                                                            alt="Avatar 5"
                                                                            className="avatar avatar5"
                                                                        />
                                                                        <img src="" alt="Avatar 6" className="avatar avatar6" />
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td><span className='ellipsis'>Customerlist.xls</span></td>
                                                            <td>
                                                                <button className="tableButton">
                                                                    <i className="fa-solid fa-ellipsis-vertical" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <div className="d-flex align-items-center justify-content-start ">
                                                                    <div className="phone-call">
                                                                        <i className="fa-solid fa-id-card" />
                                                                    </div>
                                                                    <div>
                                                                        <span className="ms-1">Ready</span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <b>10% discount on all product</b>
                                                            </td>
                                                            <td>Broadcast</td>
                                                            <td>1800123465</td>
                                                            <td>Gateway</td>
                                                            <td>
                                                                <div className="specialProgressWrap">
                                                                    <div className="specialProgress">
                                                                        <div className='segment success' style={{ width: '85%' }}></div>
                                                                        <div className='segment fail' style={{ width: '5%' }}></div>
                                                                        <div className='segment pending' style={{ width: '10%' }}></div>
                                                                    </div>
                                                                    <div className="specialProgressText">
                                                                        <p>0.00%</p>
                                                                        <span>0 of 1000</span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div>
                                                                    <div className="avatar-container">
                                                                        <img
                                                                            src="https://randomuser.me/api/portraits/men/1.jpg"
                                                                            alt="Avatar 1"
                                                                            className="avatar avatar1"
                                                                        />
                                                                        <img
                                                                            src="https://randomuser.me/api/portraits/men/2.jpg"
                                                                            alt="Avatar 2"
                                                                            className="avatar avatar2"
                                                                        />
                                                                        <img
                                                                            src="https://randomuser.me/api/portraits/men/3.jpg"
                                                                            alt="Avatar 3"
                                                                            className="avatar avatar3"
                                                                        />
                                                                        <img
                                                                            src="https://randomuser.me/api/portraits/men/4.jpg"
                                                                            alt="Avatar 4"
                                                                            className="avatar avatar4"
                                                                        />
                                                                        <img
                                                                            src="https://randomuser.me/api/portraits/men/5.jpg"
                                                                            alt="Avatar 5"
                                                                            className="avatar avatar5"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td><span className='ellipsis'>Customerlist.xls</span></td>
                                                            <td>
                                                                <button className="tableButton">
                                                                    <i className="fa-solid fa-ellipsis-vertical" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <div className="d-flex align-items-center justify-content-start ">
                                                                    <div
                                                                        style={{ backgroundColor: "#f2c333" }}
                                                                        className="phone-call"
                                                                    >
                                                                        <i className="fa-solid fa-pause" />
                                                                    </div>
                                                                    <div>
                                                                        <span className="ms-1">Paused</span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td><b>motor cycle euiptment upto 30 discount</b></td>
                                                            <td>Broadcast</td>
                                                            <td>1800123465</td>
                                                            <td>Gateway</td>
                                                            <td>
                                                                <div className="specialProgressWrap">
                                                                    <div className="specialProgress">
                                                                        <div className='segment success' style={{ width: '85%' }}></div>
                                                                        <div className='segment fail' style={{ width: '5%' }}></div>
                                                                        <div className='segment pending' style={{ width: '10%' }}></div>
                                                                    </div>
                                                                    <div className="specialProgressText">
                                                                        <p>0.00%</p>
                                                                        <span>0 of 1000</span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div>
                                                                    <div className="avatar-container">
                                                                        <img
                                                                            src="https://randomuser.me/api/portraits/men/1.jpg"
                                                                            alt="Avatar 1"
                                                                            className="avatar avatar1"
                                                                        />
                                                                        <img
                                                                            src="https://randomuser.me/api/portraits/men/2.jpg"
                                                                            alt="Avatar 2"
                                                                            className="avatar avatar2"
                                                                        />
                                                                        <img
                                                                            src="https://randomuser.me/api/portraits/men/3.jpg"
                                                                            alt="Avatar 3"
                                                                            className="avatar avatar3"
                                                                        />
                                                                        <img
                                                                            src="https://randomuser.me/api/portraits/men/4.jpg"
                                                                            alt="Avatar 4"
                                                                            className="avatar avatar4"
                                                                        />
                                                                        <img
                                                                            src="https://randomuser.me/api/portraits/men/5.jpg"
                                                                            alt="Avatar 5"
                                                                            className="avatar avatar5"
                                                                        />
                                                                        <img src="" alt="Avatar 6" className="avatar avatar6" />
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td><span className='ellipsis'>Customerlist.xls</span></td>
                                                            <td>
                                                                <button className="tableButton">
                                                                    <i className="fa-solid fa-ellipsis-vertical" />
                                                                </button>
                                                            </td>
                                                        </tr>
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
        </>
    )
}

export default Campaigns