import React, { useEffect, useState } from 'react'
import Header from '../../CommonComponents/Header';
import ThreeDotedLoader from '../../Loader/ThreeDotedLoader';
import Tippy from '@tippyjs/react';
import Transcription from './Transcription';
import Data from './Data';
import DetailLogs from './DetailLogs';
import PaginationComponent from '../../CommonComponents/PaginationComponent';
import { Link } from 'react-router-dom';

const CallHistory = () => {

    const [refreshState, setRefreshState] = useState(false)
    const [addUploadAgentToggle, setAddUploadAgentToggle] = useState(false);
    const [deletePopup, setDeletePopup] = useState(false);
    const [idCopy, setIdCopy] = useState(false)
    const [startDate, setStartDate] = useState("");
    const [startDateFlag, setStartDateFlag] = useState("");
    const [endDateFlag, setEndDateFlag] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const [allBuyers, setAllBuyers] = useState([]);
    const [filteredKeys, setFilteredKeys] = useState([]);
    const [filterBy, setFilterBy] = useState("date");
    const [createdAt, setCreatedAt] = useState("");
    const [endDate, setEndDate] = useState("");
    const [createExportToggle, setCreateExportToggle] = useState(false);



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

    useEffect(() => {
        if (
            filterBy === "7_days" ||
            filterBy === "1_month" ||
            filterBy === "3_month"
        ) {
            // featureUnderdevelopment();
            getDateRange(filterBy);
        }
    }, [filterBy]);

    useEffect(() => {
        if (filterBy === "date" && startDateFlag !== "") {
            setCreatedAt(startDateFlag);
            setStartDate("");
            setEndDate("");
        } else if (
            filterBy === "date_range" &&
            endDateFlag !== "" &&
            startDateFlag !== ""
        ) {
            setStartDate(startDateFlag);
            setEndDate(endDateFlag);
            setCreatedAt("");
        }
    }, [startDateFlag, endDateFlag, filterBy]);


    const getDateRange = (period) => {
        const currentDate = new Date();
        const formattedCurrentDate = formatDate(currentDate);

        let startDate = new Date();

        switch (period) {
            case "7_days":
                startDate.setDate(currentDate.getDate() - 7);
                break;

            case "1_month":
                startDate.setMonth(currentDate.getMonth() - 1);
                break;

            case "3_month":
                startDate.setMonth(currentDate.getMonth() - 3);
                break;

            default:
                throw new Error(
                    "Invalid period. Use 'last7days', 'last1month', or 'last3months'."
                );
        }

        const formattedStartDate = formatDate(startDate);
        setStartDate(formattedStartDate);

        setEndDate(formattedCurrentDate);

        // return { currentDate: formattedCurrentDate, startDate: formattedStartDate };
    };
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

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
                                                    <button className="panelButton static edit exportGroupBtn" >
                                                        <span className="text">Export</span>
                                                        {/* <span className="icon">
                                                            <i class="fa-solid fa-file-export"></i>
                                                        </span> */}
                                                    </button>
                                                    <div class="dropdown listingDorp">
                                                        <button class="addExportBtnListing dropdown-toggle " type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                            <i class="fa-solid fa-clock-rotate-left"></i>
                                                        </button>
                                                        <ul class="dropdown-menu">
                                                            <div className='dropdownHerder'>
                                                                <h6>Export Records</h6>
                                                                <p>The CSVs will be kept for one week. Please download after export.</p>
                                                            </div>
                                                            <li><Link class="dropdown-item" to="#">
                                                                <div>
                                                                    <p className='mb-0'>Retell-history(2025-06-10).csv</p>
                                                                    <span className='text_success fs-12'> <i class="fa-solid fa-check me-2"></i> Completed</span>
                                                                </div>
                                                                <button class="aitable_button bg-transparent"><i class="fa-regular fa-arrow-down-to-line"></i></button>
                                                            </Link></li>
                                                            <li><Link class="dropdown-item" to="#"><div>
                                                                    <p className='mb-0'>Retell-history(2025-06-10).csv</p>
                                                                    <span className='text_success fs-12'> <i class="fa-solid fa-check me-2"></i> Completed</span>
                                                                </div>
                                                                <button class="aitable_button bg-transparent"><i class="fa-regular fa-arrow-down-to-line"></i></button></Link></li>
                                                            <li><Link class="dropdown-item" to="#"><div>
                                                                    <p className='mb-0'>Retell-history(2025-06-10).csv</p>
                                                                    <span className='text_success fs-12'> <i class="fa-solid fa-check me-2"></i> Completed</span>
                                                                </div>
                                                                <button class="aitable_button bg-transparent"><i class="fa-regular fa-arrow-down-to-line"></i></button></Link></li>
                                                        </ul>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="col-12"
                                            style={{ overflow: "auto", padding: "10px 20px 0" }}
                                        >
                                            <div className="tableHeader flex-column align-items-start">
                                                <div className='d-flex justify-content-between w-100 gap-2 flex-wrap mb-2'>
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
                                                    <div className="searchBox position-relative mb-2">
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
                                                <div className='d-flex justify-content-between w-100 gap-2 flex-wrap mb-2'>

                                                    <div className="formRow border-0 p-0 gap-2">
                                                        <div className="d-flex justify-content-start flex-wrap gap-2">
                                                            {/* {filteredKeys.includes("variable_start_stamp") && ( 
                                                                <> */}

                                                            <div className="formRow border-0 p-0 gap-2">
                                                                <label className="formLabel text-start mb-0 w-100">
                                                                    Date Filter
                                                                </label>
                                                                <select
                                                                    className="formItem"
                                                                    value={filterBy}
                                                                    onChange={(e) => {
                                                                        setFilterBy(e.target.value);
                                                                        setStartDateFlag("");
                                                                        setEndDateFlag("");
                                                                    }}
                                                                >
                                                                    <option value={"date"}>Single Date</option>
                                                                    <option value={"date_range"}>Date Range</option>
                                                                    <option value={"7_days"}>Last 7 Days</option>
                                                                    <option value={"1_month"}>Last 1 Month</option>
                                                                    <option value={"3_month"}>Last 3 Months</option>
                                                                </select>
                                                            </div>

                                                            {/* {filterBy === "date_range" && (
                                                                        <> */}
                                                            <div className="formRow border-0 p-0 gap-2">
                                                                <label className="formLabel text-start mb-0 w-100">
                                                                    From
                                                                </label>
                                                                <div className="d-flex w-100">
                                                                    <input
                                                                        type="date"
                                                                        className="formItem"
                                                                        max={
                                                                            new Date()?.toISOString()?.split("T")[0]
                                                                        }
                                                                        value={startDateFlag}
                                                                        onChange={(e) => {
                                                                            setStartDateFlag(e.target.value);
                                                                            setPageNumber(1);
                                                                        }}
                                                                    />

                                                                </div>
                                                            </div>
                                                            <div className="formRow border-0 p-0 gap-2">
                                                                <label className="formLabel text-start mb-0 w-100">
                                                                    To
                                                                </label>
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
                                                                            setPageNumber(1);
                                                                        }}
                                                                        min={startDateFlag} // Prevent selecting an end date before the start date
                                                                    />

                                                                </div>
                                                            </div>
                                                            {/* </>
                                                                     )} 
                                                                 </> 
                                                            )}  */}
                                                        </div>
                                                    </div>
                                                    <div className='formRow gap-2 align-items-end p-0'>
                                                        <div class="btn-group align-items-center ">
                                                            <button type="button" class="btn btn-outline-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                                                <i class="fa-regular fa-filter me-2"></i> Filter
                                                            </button>
                                                            <ul class="dropdown-menu">
                                                                <li><a class="dropdown-item" href="#">Action</a></li>
                                                                <li><a class="dropdown-item" href="#">Another action</a></li>
                                                                <li><a class="dropdown-item" href="#">Something else here</a></li>

                                                            </ul>
                                                        </div>
                                                        <div class="btn-group align-items-center ">
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
                                            <div className="tableHeader mb-3">
                                                <PaginationComponent
                                                    pageNumber={(e) => setPageNumber(e)}
                                                    totalPage={allBuyers?.last_page}
                                                    from={allBuyers?.from}
                                                    to={allBuyers?.to}
                                                    total={allBuyers?.total}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>



                <div class="offcanvas offcanvas-end w-30" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
                    <div class="offcanvas-header" style={{ borderBlockEnd: '1px solid var(--me-border1)' }}>
                        <div>
                            <h5 class="offcanvas-title" id="offcanvasRightLabel">Call History</h5>
                            <p className='f-s-14 mb-0' style={{ color: 'var(--color-subtext)' }}>See all the details of this Call History</p>
                        </div>
                        <button type="button" class="btn-close ms-auto" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div class="offcanvas-body p-3">
                        <div className='heading'>
                            <h5 class="offcanvas-title" id="offcanvasRightLabel">06/03/2025 14:40 web_call</h5>
                            <button className=' bg-transparent border-0 text-danger' onClick={setDeletePopup}><i class="fa-solid fa-trash"></i></button>
                        </div>
                        <div className="content">
                            <p className='mb-0' style={{ color: 'var(--color-subtext)' }}><strong>Agent:</strong> <span className='fs-12'> Patient Screening (from template)(age...875)</span>
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
                            <p className='mb-0' style={{ color: 'var(--color-subtext)' }}><strong>Version:</strong> <span className='fs-12'> 0</span>

                            </p>
                            <p className='mb-0' style={{ color: 'var(--color-subtext)' }}><strong>Call ID:</strong> <span className='fs-12'>cal...7a7</span>
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
                            <p className='mb-0' style={{ color: 'var(--color-subtext)' }}><strong>Duration:</strong> <span className='fs-12'>06/03/2025 14:40 - 06/03/2025 14:42</span></p>
                            <p className='mb-0' style={{ color: 'var(--color-subtext)' }}><strong>Cost:</strong> <span className='fs-12'>$0.318</span></p>
                        </div>
                        <div className='d-flex justify-content-between align-items-center gap-3 my-3 rounded-3 p-2' style={{ border: '1px solid var(--me-border1)' }}>
                            <audio controls className="w-[300px] h-10">
                                <source src='src="https://dxc03zgurdly9.cloudfront.net/b275b2dd2dd862aac68665c735024960be447db5228cbd317f378952076625e8/recording.wav"' />
                            </audio>
                            <button className="aitable_button bg-transparent"><i class="fa-regular fa-arrow-down-to-line"></i></button>
                        </div>
                        <div className='rounded-3 p-2 table__details mb-2' style={{ border: '1px solid var(--me-border1)' }}>
                            <h6 style={{ color: 'var(--immortalBlack)' }}>Conversation Analysis</h6>
                            <p className='f-s-14' style={{ color: 'var(--color-subtext)' }}>Preset</p>
                            <div className='d-flex justify-content-start align-items-center gap-2'>
                                <p className='status_text'><i class="fa-regular fa-square-check"></i> <span>Call Successful</span></p>
                                <p className='status_text'><i class="fa-solid fa-circle-small text-success"></i> <span className='endedTxt'>Successful</span></p>
                            </div>
                            <div className='d-flex justify-content-start align-items-center gap-2'>
                                <p className='status_text'><i class="fa-solid fa-headphones"></i> <span>Call Status</span></p>
                                <p className='status_text'><i class="fa-solid fa-circle-small text-danger"></i> <span className='endedTxt'>Ended</span></p>
                            </div>
                            <div className='d-flex justify-content-start align-items-center gap-2'>
                                <p className='status_text'><i class="fa-regular fa-user-vneck-hair"></i> <span>User Sentiment</span></p>
                                <p className='status_text'><i class="fa-solid fa-circle-small text-primary"></i> <span className='endedTxt'>Neutral</span></p>
                            </div>
                            <div className='d-flex justify-content-start align-items-center gap-2'>
                                <p className='status_text'><i class="fa-regular fa-phone"></i> <span>Disconnection Reason</span></p>
                                <p className='status_text'><i class="fa-solid fa-circle-small text-warning"></i> <span className='endedTxt'>User_hangup</span></p>
                            </div>
                        </div>
                        <div className='rounded-3 p-2 table__details mb-2' style={{ border: '1px solid var(--me-border1)' }}>
                            <p className='f-s-14' style={{ color: 'var(--color-subtext)' }}>Custom</p>
                            <div className='d-flex justify-content-start align-items-start gap-2 mb-3'>
                                <i class="fa-regular fa-bars-staggered" style={{ color: 'var(--color-subtext)' }}></i>
                                <p className='status_text'> <span>_do you feel safe in your current living situation?</span></p>
                                <p className='status_text ms-5'><span className='endedTxt'>No, I feel unsafe sometimes.</span></p>
                            </div>
                            <div className='d-flex justify-content-start align-items-start gap-2 mb-3'>
                                <i class="fa-regular fa-bars-staggered" style={{ color: 'var(--color-subtext)' }}></i>
                                <p className='status_text'><span>_do you have problems with any of the following in your home?</span></p>
                                <p className='status_text ms-5'><span className='endedTxt'>None of the above.</span></p>
                            </div>
                            <div className='d-flex justify-content-start align-items-start gap-2 mb-3'>
                                <i class="fa-regular fa-bars-staggered" style={{ color: 'var(--color-subtext)' }}></i>
                                <p className='status_text'> <span>_do you currently have a steady place to live?</span></p>
                                <p className='status_text ms-5'><span className='endedTxt'>No.</span></p>
                            </div>
                            <div className='d-flex justify-content-start align-items-start gap-2 mb-3'>
                                <i class="fa-regular fa-bars-staggered" style={{ color: 'var(--color-subtext)' }}></i>
                                <p className='status_text'><span>_calculate the number of concerned questions</span></p>
                                <p className='status_text ms-5'><span className='endedTxt'>3</span></p>
                            </div>
                            <div className='d-flex justify-content-start align-items-start gap-2 mb-3'>
                                <i class="fa-regular fa-bars-staggered" style={{ color: 'var(--color-subtext)' }}></i>
                                <p className='status_text'><span>_in the past 12 months, has lack of reliable transportation prevented you from:</span></p>
                                <p className='status_text ms-5'><span className='endedTxt'>None of the above.</span></p>
                            </div>
                            <div className='d-flex justify-content-start align-items-start gap-2 mb-3'>
                                <i class="fa-regular fa-bars-staggered" style={{ color: 'var(--color-subtext)' }}></i>
                                <p className='status_text'><span>_within the past 12 months, have you worried about running out of food before you had money to buy more?</span></p>
                                <p className='status_text ms-5'><span className='endedTxt'>Never true.</span></p>
                            </div>
                            <div className='d-flex justify-content-start align-items-start gap-2 mb-3'>
                                <i class="fa-regular fa-bars-staggered" style={{ color: 'var(--color-subtext)' }}></i>
                                <p className='status_text'><span>_are you currently employed?</span></p>
                                <p className='status_text ms-5'><span className='endedTxt'>No, I’m not seeking work right now.</span></p>
                            </div>
                        </div>
                        <div className='rounded-3 p-2 table__details mb-2' style={{ border: '1px solid var(--me-border1)' }}>
                            <h6 className='f-s-14' style={{ color: 'var(--immortalBlack)' }}>Summary</h6>
                            <p className='f-s-14' style={{ color: 'var(--color-subtext)' }}>The user, Evie Wang, expressed discomfort in sharing personal information for verification but eventually provided her details. The agent confirmed that they could assist her with health and social services and asked about her living situation and food security, to which Evie indicated she does not have a steady place to live but has never worried about running out of food.</p>

                        </div>
                        <div className='rounded-3 p-2 table__details mb-2' style={{ border: '1px solid var(--me-border1)' }}>
                            <h6 className='f-s-14' style={{ color: 'var(--immortalBlack)' }}>Summary</h6>
                            <p className='f-s-14' style={{ color: 'var(--color-subtext)' }}>The user, Evie Wang, expressed discomfort in sharing personal information for verification but eventually provided her details. The agent confirmed that they could assist her with health and social services and asked about her living situation and food security, to which Evie indicated she does not have a steady place to live but has never worried about running out of food.</p>

                        </div>
                        <div
                            className="col-12 formScroller"
                        >
                            <nav className="tangoNavs historyNav">
                                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                    <button
                                        className="nav-link active"
                                        id="nav-user-tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#nav-user"
                                        type="button"
                                        role="tab"
                                        aria-controls="nav-user"
                                        aria-selected="true"
                                    >
                                        Transcription
                                    </button>
                                    <button
                                        className="nav-link"
                                        id="nav-exten-tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#nav-exten"
                                        type="button"
                                        role="tab"
                                        aria-controls="nav-exten"
                                        aria-selected="false"
                                    >
                                        Data
                                    </button>
                                    <button
                                        className="nav-link"
                                        id="nav-provision-tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#nav-exten-1"
                                        type="button"
                                        role="tab"
                                        aria-controls="nav-exten-1"
                                        aria-selected="false"
                                    >
                                        Detail Logs
                                    </button>
                                </div>
                            </nav>
                            <div
                                className="tab-content"
                                id="nav-tabContent"
                                style={{
                                    border: "none",
                                    paddingTop: '20px'
                                }}
                            >
                                <div
                                    className="tab-pane fade show active"
                                    id="nav-user"
                                    role="tabpanel"
                                    aria-labelledby="nav-user-tab"
                                    tabindex="0"
                                >
                                    <Transcription />
                                </div>
                                <div
                                    className="tab-pane fade"
                                    id="nav-exten"
                                    role="tabpanel"
                                    aria-labelledby="nav-exten-tab"
                                    tabindex="0"
                                >
                                    <Data />
                                </div>
                                <div
                                    className="tab-pane fade"
                                    id="nav-exten-1"
                                    role="tabpanel"
                                    aria-labelledby="nav-provision-tab"
                                    tabindex="0"
                                >
                                    <DetailLogs />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

                    {deletePopup && (
          <div className="popup">
            <div className="container h-100">
              <div className="row h-100 justify-content-center align-items-center">
                <div className="row content col-xl-4 col-md-5">
                  <div className="col-12">
                    <div className="iconWrapper">
                      <i className="fa-duotone fa-circle-exclamation text-danger"></i>
                    </div>
                  </div>
                  <div className="col-12">
                    <h4 className="text-center text-danger">Confirmation!</h4>
                    <p className="text-center">Are you sure! You want to delete this DID</p>

                    <div className="d-flex justify-content-center gap-2 mt-4">
                      <button
                        className="panelButton m-0"

                      >
                        <span className="text">Delete</span>
                        <span className="icon">
                          <i className="fa-solid fa-check"></i>
                        </span>
                      </button>
                      <button
                        className="panelButton gray m-0 float-end"
                        onClick={() => {
                          setDeletePopup(false);
                        }}
                      >
                        <span className="text">Cancel</span>
                        <span className="icon">
                          <i className="fa-solid fa-xmark"></i>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        </>
    )
}

export default CallHistory