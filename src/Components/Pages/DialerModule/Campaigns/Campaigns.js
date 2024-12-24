import React from 'react'
import Header from '../../../CommonComponents/Header'
import PaginationComponent from '../../../CommonComponents/PaginationComponent'
import Tippy from '@tippyjs/react'

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
                                                                    className="specialProgressWrap"
                                                                    style={{ cursor: "pointer" }}
                                                                >
                                                                    <div className="specialProgress">
                                                                        <div className='segment success' style={{ width: '85%' }}></div>
                                                                        <div className='segment fail' style={{ width: '5%' }}></div>
                                                                        <div className='segment pending' style={{ width: '10%' }}></div>
                                                                    </div>
                                                                    <div className="specialProgressText">
                                                                        <p>0.00%</p>
                                                                        <span>0 of 1000</span>
                                                                    </div>
                                                                    <div className="specialProgressWrapDetails">
                                                                        <div className="d-flex align-items-center justify-content-start mb-1">
                                                                            <p
                                                                                style={{ fontSize: 12, fontWeight: 500, marginBottom: 0 }}
                                                                            >
                                                                                LEADS IN TOTAL
                                                                            </p>
                                                                            <span className="test-demos ms-2">1000</span>
                                                                        </div>
                                                                        <ul>
                                                                            <li>
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
                                                                                        <span>0</span>
                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                            <li>
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
                                                                                        <span>0</span>
                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                            <li>
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
                                                                                        <span>0</span>
                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div>
                                                                    <div className="avatar-container">
                                                                        <Tippy content={"1001"}><i class="fa-light fa-user"></i></Tippy>
                                                                        <Tippy content={"1001"}><i class="fa-light fa-user"></i></Tippy>
                                                                        <Tippy content={"1001"}><i class="fa-light fa-user"></i></Tippy>
                                                                        <Tippy content={"1001"}><i class="fa-light fa-user"></i></Tippy>
                                                                        <span>+2</span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td><span className='ellipsis'>Customerlist.xls</span></td>
                                                            <td>
                                                                <div class="dropdown">
                                                                    <a class="tableButton" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                        <i className="fa-solid fa-ellipsis-vertical" />
                                                                    </a>
                                                                    <ul class="dropdown-menu actionBtnDropdowns">
                                                                        <li className='dropdown-item'><a class="clearButton text-align-start" href="#"><i class="fa-regular fa-pen-to-square me-2"></i> Edit</a></li>
                                                                        <li className='dropdown-item'><a class="clearButton text-align-start" href="#"><i class="fa-regular fa-circle-pause me-2"></i> Pause</a></li>
                                                                    </ul>
                                                                </div>
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
                                                                        <Tippy content={"1001"}><i class="fa-light fa-user"></i></Tippy>
                                                                        <Tippy content={"1001"}><i class="fa-light fa-user"></i></Tippy>
                                                                        <Tippy content={"1001"}><i class="fa-light fa-user"></i></Tippy>
                                                                        <Tippy content={"1001"}><i class="fa-light fa-user"></i></Tippy>
                                                                        <span>+2</span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td><span className='ellipsis'>Customerlist.xls</span></td>
                                                            <td>
                                                                <div class="dropdown">
                                                                    <a class="tableButton" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                        <i className="fa-solid fa-ellipsis-vertical" />
                                                                    </a>
                                                                    <ul class="dropdown-menu actionBtnDropdowns">
                                                                        <li className='dropdown-item'><a class="clearButton text-align-start" href="#"><i class="fa-regular fa-pen-to-square me-2"></i> Edit</a></li>
                                                                        <li className='dropdown-item'><a class="clearButton text-align-start" href="#"><i class="fa-regular fa-circle-pause me-2"></i> Pause</a></li>
                                                                    </ul>
                                                                </div>
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
                                                                    <div className="specialProgressWrapDetails">
                                                                        <div className="d-flex align-items-center justify-content-start mb-1">
                                                                            <p
                                                                                style={{ fontSize: 12, fontWeight: 500, marginBottom: 0 }}
                                                                            >
                                                                                LEADS IN TOTAL
                                                                            </p>
                                                                            <span className="test-demos ms-2">1000</span>
                                                                        </div>
                                                                        <ul>
                                                                            <li>
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
                                                                                        <span>0</span>
                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                            <li>
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
                                                                                        <span>0</span>
                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                            <li>
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
                                                                                        <span>0</span>
                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div>
                                                                    <div className="avatar-container">
                                                                        <Tippy content={"1001"}><i class="fa-light fa-user"></i></Tippy>
                                                                        <Tippy content={"1001"}><i class="fa-light fa-user"></i></Tippy>
                                                                        <Tippy content={"1001"}><i class="fa-light fa-user"></i></Tippy>
                                                                        <Tippy content={"1001"}><i class="fa-light fa-user"></i></Tippy>
                                                                        <span>+2</span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td><span className='ellipsis'>Customerlist.xls</span></td>
                                                            <td>
                                                                <div class="dropdown">
                                                                    <a class="tableButton" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                        <i className="fa-solid fa-ellipsis-vertical" />
                                                                    </a>
                                                                    <ul class="dropdown-menu actionBtnDropdowns">
                                                                        <li className='dropdown-item'><a class="clearButton text-align-start" href="#"><i class="fa-regular fa-pen-to-square me-2"></i> Edit</a></li>
                                                                        <li className='dropdown-item'><a class="clearButton text-align-start" href="#"><i class="fa-regular fa-circle-pause me-2"></i> Pause</a></li>
                                                                    </ul>
                                                                </div>
                                                            </td>
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
                </section>
            </main>
        </>
    )
}

export default Campaigns