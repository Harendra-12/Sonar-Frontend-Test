import React, { useState } from 'react'
import Header from '../../CommonComponents/Header';
import Select from 'react-select';
import { requiredValidator } from '../../validations/validation';
import PaginationComponent from '../../CommonComponents/PaginationComponent';

const AiBatchCall = () => {
    const [refreshState, setRefreshState] = useState(false)
    const [isClearable, setIsClearable] = useState(true);
    const [isSearchable, setIsSearchable] = useState(true);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRtl, setIsRtl] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");
     const [pageNumber, setPageNumber] = useState(1);
       const [agents, setAgents] = useState([]);


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
                            <Header title="Agents" />
                            <div className="overviewTableWrapper">
                                <div className="overviewTableChild">
                                    <div className="d-flex flex-wrap">
                                        <div className="col-12">
                                            <div className="heading">
                                                <div className="content">
                                                    <h4>Batch Call {" "}
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
                                                    <p>You can manage yours agents here</p>
                                                </div>
                                                <div className="buttonGroup">
                                                    <button effect="ripple" className="panelButton xlWidth " data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                                                        <span className="text">Create a batch call</span>
                                                        <span className="icon">
                                                            <i className="fa-solid fa-plus"></i>
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-12' style={{ overflow: "auto", padding: "10px 20px 0" }}>
                                            <div className="tableHeader">
                                                <div className="showEntries">
                                                    <label>Show</label>
                                                    <select
                                                        // value={entriesPerPage}
                                                        // onChange={(e) => setEntriesPerPage(e.target.value)}
                                                        className="formItem"
                                                    >
                                                        <option value={10}>10</option>
                                                        <option value={20}>20</option>
                                                        <option value={30}>30</option>
                                                    </select>
                                                    <label>entries</label>
                                                </div>

                                                {/* {checkViewSidebar(
                                                    "User",
                                                    slugPermissions,
                                                    account?.sectionPermissions,
                                                    account?.permissions,
                                                    "search"
                                                ) && ( */}
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
                                                {/* )} */}
                                            </div>
                                            <div className="tableContainer">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>Batch Call Name</th>
                                                            <th>Status</th>
                                                            <th>Recipients</th>
                                                            <th>Sent <span className=' text_muted'>|</span> Pickup <span className=' text_muted'>|</span> Successful</th>
                                                            <th>Last Sent by</th>

                                                        </tr>
                                                    </thead>
                                                    <tbody className="">
                                                        <>
                                                            <tr>
                                                                <td> 1</td>
                                                                <td>+918016000000</td>
                                                                <td>value1 (optional)</td>
                                                                <td>value2 (optional)</td>
                                                                <td>value3 (optional)</td>
                                                            </tr>
                                                            <tr>
                                                                <td> 1</td>
                                                                <td>+918016000000</td>
                                                                <td>value1 (optional)</td>
                                                                <td>value2 (optional)</td>
                                                                <td>value3 (optional)</td>
                                                            </tr>
                                                            <tr>
                                                                <td> 1</td>
                                                                <td>+918016000000</td>
                                                                <td>value1 (optional)</td>
                                                                <td>value2 (optional)</td>
                                                                <td>value3 (optional)</td>
                                                            </tr>

                                                        </>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="tableHeader mb-3">
                                                <PaginationComponent
                                                    pageNumber={(e) => setPageNumber(e)}
                                                    totalPage={agents.last_page}
                                                    from={(pageNumber - 1) * agents.per_page + 1}
                                                    to={agents.to}
                                                    total={agents.total}
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

            <div class="offcanvas offcanvas-end batchCallCanvas" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
                <div class="offcanvas-header">
                    <button type="button" class="aitable_button bg-transparent" data-bs-dismiss="offcanvas" aria-label="Close">
                        <i class="fa-solid fa-angle-left"></i>
                    </button>
                    <div className='col-3 ps-4'>
                        <h5 class="offcanvas-title" id="offcanvasRightLabel">Create a batch call</h5>
                        <p className='f-s-14 mb-0' style={{ color: 'var(--color-subtext)' }}>Batch call cost $0.005 per dial</p>
                    </div>
                </div>
                <div class="offcanvas-body p-0">
                    <div className='right_body p-3'>
                        <div className='details_header'>
                            <p className='mb-0'>Recipients</p>
                        </div>
                        {/* <div className='noTableData'>
                            <p className=' '>Please upload recipients first</p>
                        </div> */}
                        <div className="tableContainer">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Phone Number</th>
                                        <th>Dynamic Variable1</th>
                                        <th>Dynamic Variable2</th>

                                    </tr>
                                </thead>
                                <tbody className="">
                                    <>
                                        <tr>
                                            <td> 1</td>
                                            <td>+918016000000</td>
                                            <td>value1 (optional)</td>
                                            <td>value2 (optional)</td>
                                        </tr>
                                        <tr>
                                            <td> 1</td>
                                            <td>+918016000000</td>
                                            <td>value1 (optional)</td>
                                            <td>value2 (optional)</td>
                                        </tr>
                                        <tr>
                                            <td> 1</td>
                                            <td>+918016000000</td>
                                            <td>value1 (optional)</td>
                                            <td>value2 (optional)</td>
                                        </tr>

                                    </>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className='left_body'>
                        <div className="formRow flex-column align-items-start">
                            <div className="formLabel">
                                <label> Batch Call Name</label>
                            </div>
                            <div className="col-12">
                                <input
                                    type="text"
                                    className="formItem"
                                    placeholder='Enter a name for your knowledge base'
                                />
                            </div>
                        </div>
                        <div className="formRow flex-column align-items-start">
                            <div className="formLabel">
                                <label> From number</label>
                            </div>
                            <div className="col-12">
                                <Select
                                    className="basic-single"
                                    classNamePrefix="select"
                                    // defaultValue={colourOptions[0]}
                                    isDisabled={isDisabled}
                                    isLoading={isLoading}
                                    isClearable={isClearable}
                                    isRtl={isRtl}
                                    isSearchable={isSearchable}
                                    name="color"
                                // options={colourOptions}
                                />
                            </div>
                        </div>
                        <div className="formRow align-items-start" style={{ minHeight: "unset" }}>
                            <div className="formLabel">
                                <label> Upload Recipients</label>
                            </div>
                            <div className="col-auto">
                                <button type="button" class="aitable_button bg-transparent py-1 px-2" data-bs-dismiss="offcanvas" aria-label="Close"><i class="fa-regular fa-arrow-down-to-line me-2"></i> Download the template</button>
                            </div>
                        </div>
                        <div className="col-auto px-2">
                            <div className="aitable_button bg-transparent py-1 px-2 d-flex justify-content-between align-items-center">
                                <div className='d-flex justify-content-start align-items-center gap-2'>
                                    <i className="fa-solid fa-file-csv fs-4"></i>
                                    <div className='fileDetails'>
                                        <h6>recipients.csv</h6>
                                        <p>2 Recipients</p>
                                    </div>
                                </div>
                                <button className='aitable_button text-danger border-danger bg-danger-subtle'><i class="fa-regular fa-trash-can"></i></button>
                            </div>
                        </div>
                        <div className="formRow flex-column align-items-start">
                            <div className="col-12">
                                <div className="popup-border text-center p-2">
                                    <input
                                        type="file"
                                        className="form-control-file d-none"
                                        id="fileInput"
                                        accept=".csv"
                                    />
                                    <label
                                        htmlFor="fileInput"
                                        className="d-block"
                                    >
                                        <div className="test-user text-center">
                                            <i
                                                className="fa-solid fa-cloud-arrow-up"
                                                style={{ fontSize: 30 }}
                                            />
                                            <p className="mb-0 mt-2 text-center">
                                                Choose a csv or drag & drop it here.
                                            </p>
                                            <span className='text2'>
                                                Up to 50 MB
                                            </span>
                                        </div>
                                    </label>

                                </div>
                            </div>
                        </div>
                        <div className="formLabel px-2">
                            <label> When to send the calls</label>
                        </div>
                        <div className="row radio-input px-2">
                            <div className="col-6">
                                <label className="label radioLabel">
                                    <p className="text">Send Now</p>
                                    <input
                                        type="radio"
                                        id="send-now"
                                        name="value-radio"
                                        value="send-now"
                                        onChange={(e) => setSelectedOption(e.target.value)}
                                        checked={selectedOption === "send-now"}
                                    />
                                </label>
                            </div>
                            <div className="col-6">
                                <label className="label radioLabel">
                                    <p className="text">Schedule</p>
                                    <input
                                        type="radio"
                                        id="schedule"
                                        name="value-radio"
                                        value="schedule"
                                        onChange={(e) => setSelectedOption(e.target.value)}
                                        checked={selectedOption === "schedule"}
                                    />
                                </label>
                            </div>
                            <div className='col-12'>
                                {selectedOption === "schedule" && (
                                    <div className="row openFormBox mt-2">
                                        <div className="col-12 mb-1">
                                            <div className="formRow p-0">
                                                <input
                                                    type="datetime-local"
                                                    className="formItem"
                                                    name="start_date"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <Select
                                                className="basic-single"
                                                classNamePrefix="select"
                                                isDisabled={false}
                                                isLoading={false}
                                                isClearable={true}
                                                isRtl={false}
                                                isSearchable={true}
                                                name="color"
                                            // options={colourOptions}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="formRow flex-column align-items-start">
                            <div className="formLabel w-100" style={{ maxWidth: "100%" }}>
                                <label> Estimated Time to complete calls</label>
                            </div>
                            <div className="col-12">
                                <input
                                    type="text"
                                    className="formItem"
                                    placeholder='Please add recipients first'
                                    disabled
                                />
                            </div>
                            <div className="formLabel w-100" style={{ maxWidth: "100%" }}>
                                <label> Want to speed up the time? <span className='text-primary fs-12'>+ </span><span className='text-primary fs-12'>Purchase more concurrency</span> </label>
                            </div>
                        </div>
                        <div className='d-flex justify-content-end gap-2 py-2 px-2'>
                            <button className="panelButton static gray"> <span className="text">Save as a draft</span></button>
                            <button className="panelButton static "> <span className="text">Send</span></button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default AiBatchCall