import React, { useState } from 'react'
import Header from '../../CommonComponents/Header';
import ThreeDotedLoader from '../../Loader/ThreeDotedLoader';
import Tippy from '@tippyjs/react';

const CallHistory = () => {

    const [refreshState, setRefreshState] = useState(false)
    const [addUploadAgentToggle, setAddUploadAgentToggle] = useState(false);
    const [deletePopup, setDeletePopup] = useState(false);
    const [idCopy, setIdCopy] = useState(false)
    const [startDateFlag, setStartDateFlag] = useState("");
    const [endDateFlag, setEndDateFlag] = useState("");
    const [timeFlag, setTimeFlag] = useState({
        startTime: "",
        endTime: "",
    });
    const [timeFilter, setTimeFilter] = useState({
        startTime: "",
        endTime: "",
    });



    const handleRefreshBtnClicked = () => {
        setRefreshState(true)
        // const shouldLoad = false
        // getData(shouldLoad);
    }

    return (
        <>
            <main className="mainContent">
                <section id="phonePage">
                    <div className="container-fluid">
                        <div className="row">
                            <Header title="Call History" />
                            <div className="overviewTableWrapper">
                                <div className="overviewTableChild">
                                    <div className="d-flex flex-wrap">
                                        <div className="col-12">
                                            <div className="heading">
                                                <div className="content">
                                                    <h4>Call History {" "}
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
                                                    <p>This is where you can view the call history </p>
                                                </div>
                                                <div className="buttonGroup">



                                                    <button className="panelButton edit" onClick={() => {
                                                        setAddUploadAgentToggle(true);
                                                    }}>
                                                        <span className="text">Export</span>
                                                        <span className="icon">
                                                            <i class="fa-solid fa-file-export"></i>
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="col-12"
                                            style={{ overflow: "auto", padding: "10px 20px 0" }}
                                        >
                                            <div className="tableHeader">
                                                <div className='d-flex justify-content-start gap-2'>
                                                    <div className="showEntries">
                                                        <label>Show</label>
                                                        <select
                                                            // value={entriesPerPage}
                                                            //   onChange={(e) => setEntriesPerPage(e.target.value)}
                                                            className="formItem"
                                                        >
                                                            <option value={10}>10</option>
                                                            <option value={20}>20</option>
                                                            <option value={30}>30</option>
                                                        </select>
                                                        <label>entries</label>
                                                    </div>
                                                    <div className="formRow border-0">
                                                        <div className="d-flex w-100">
                                                            <input
                                                                type="date"
                                                                className="formItem"
                                                                max={
                                                                    new Date()?.toISOString()?.split("T")[0]
                                                                }
                                                                value={endDateFlag}
                                                                onChange={(e) => {
                                                                    setEndDateFlag(e.target.value);
                                                                    // setPageNumber(1);
                                                                }}
                                                                min={startDateFlag} // Prevent selecting an end date before the start date
                                                            />
                                                            <input
                                                                type="time"
                                                                className="formItem ms-2"
                                                                value={timeFlag.endTime}
                                                                onChange={(e) => {
                                                                    setTimeFlag((prev) => ({
                                                                        ...prev,
                                                                        endTime: `${e.target.value}:00`,
                                                                    }));
                                                                    // setPageNumber(1);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div class="btn-group align-items-center">
                                                        <button type="button" class="btn btn-outline-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                                            <i class="fa-regular fa-filter me-2"></i> Filter
                                                        </button>
                                                        <ul class="dropdown-menu">
                                                            <li><a class="dropdown-item" href="#">Action</a></li>
                                                            <li><a class="dropdown-item" href="#">Another action</a></li>
                                                            <li><a class="dropdown-item" href="#">Something else here</a></li>

                                                        </ul>
                                                    </div>
                                                    <div class="btn-group align-items-center">
                                                        <button type="button" class="btn btn-info dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                                            <i class="fa-regular fa-gear me-2"></i> Customize Fields
                                                        </button>
                                                        <ul class="dropdown-menu">
                                                            <li><a class="dropdown-item" href="#">Action</a></li>
                                                            <li><a class="dropdown-item" href="#">Another action</a></li>
                                                            <li><a class="dropdown-item" href="#">Something else here</a></li>

                                                        </ul>
                                                    </div>

                                                </div>


                                                <div className="searchBox position-relative">
                                                    <label>Search:</label>
                                                    <input
                                                        type="search"
                                                        name="Search"
                                                        className="formItem"
                                                    // value={userInput}
                                                    // onChange={(e) => setuserInput(e?.target?.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="tableContainer">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>Time</th>
                                                            <th>Call Duration</th>
                                                            <th>Type</th>
                                                            <th>Cost</th>
                                                            <th>Call ID</th>
                                                            <th>Disconnect Reason</th>
                                                            <th>Call Status</th>
                                                            <th>User Sentiment</th>
                                                            <th>From</th>
                                                            <th>To</th>
                                                            <th>Call Success</th>
                                                            <th>Latency</th>
                                                            <th>Question 1</th>
                                                            <th>Question 2</th>
                                                            <th>Question 3</th>
                                                            <th>Question 4</th>

                                                        </tr>
                                                    </thead>
                                                    <tbody className="">
                                                        <>
                                                            <tr data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                                                                <td>
                                                                    06/03/2025 14:40
                                                                </td>
                                                                <td>2:46</td>
                                                                <td>web_call</td>
                                                                <td>$0.318</td>
                                                                <td> call_ddac4e7635daa1881a14ef1a7a7</td>
                                                                <td>user hangup</td>
                                                                <td>ended</td>
                                                                <td>positive</td>
                                                                <td>-</td>
                                                                <td>-</td>
                                                                <td>Unsuccessful</td>
                                                                <td>1642ms</td>
                                                                <td>yes</td>
                                                                <td>no</td>
                                                                <td>yes</td>
                                                                <td>0</td>
                                                            </tr>

                                                        </>
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

                {/* 
                <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">Toggle right offcanvas</button> */}

                <div class="offcanvas offcanvas-end w-25" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
                    <div class="offcanvas-header">

                        <button type="button" class="btn-close ms-auto" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div class="offcanvas-body p-3">
                        <div className='heading'>
                            <h5 class="offcanvas-title" id="offcanvasRightLabel">06/03/2025 14:40 web_call</h5>
                            <button className=' bg-transparent border-0 text-danger'><i class="fa-solid fa-trash"></i></button>
                        </div>
                        <div className="content">
                            <p className='mb-0' style={{ color: 'var(--importantBlack)' }}><strong>Agent:</strong> <span className='fs-12'> Patient Screening (from template)(age...875)</span>
                                <button
                                    className="clearButton"
                                    onClick={() => { setIdCopy(!idCopy) }}
                                >
                                    <i
                                        className={
                                            idCopy
                                                ? "fa-solid fa-check text_success"
                                                : "fa-solid fa-clone"
                                        }
                                    ></i>

                                </button>
                            </p>
                            <p className='mb-0' style={{ color: 'var(--importantBlack)' }}><strong>Version:</strong> <span className='fs-12'> 0</span>

                            </p>
                            <p className='mb-0' style={{ color: 'var(--importantBlack)' }}><strong>Call ID:</strong> <span className='fs-12'>cal...7a7</span>
                                <button
                                    className="clearButton"
                                    onClick={() => { setIdCopy(!idCopy) }}
                                >
                                    <i
                                        className={
                                            idCopy
                                                ? "fa-solid fa-check text_success"
                                                : "fa-solid fa-clone"
                                        }
                                    ></i>

                                </button>
                            </p>
                            <p className='mb-0' style={{ color: 'var(--importantBlack)' }}><strong>Duration:</strong> <span className='fs-12'>06/03/2025 14:40 - 06/03/2025 14:42</span></p>
                            <p className='mb-0' style={{ color: 'var(--importantBlack)' }}><strong>Cost:</strong> <span className='fs-12'>$0.318</span></p>
                        </div>
                        <div className='d-flex justify-content-between align-items-center gap-3 my-3 border rounded-3 p-2'>
                            <audio controls className="w-[300px] h-10">
                                <source src='src="https://dxc03zgurdly9.cloudfront.net/b275b2dd2dd862aac68665c735024960be447db5228cbd317f378952076625e8/recording.wav"' />
                                Your browser does not support the audio element.
                            </audio>
                            <button className="aitable_button bg-transparent"><i class="fa-regular fa-arrow-down-to-line"></i></button>
                        </div>
                        <div className='border rounded-3 p-2'>
                            <h6>Conversation Analysis</h6>
                            <p>Preset</p>
                        </div>
                    </div>
                </div>

            </main>
        </>
    )
}

export default CallHistory