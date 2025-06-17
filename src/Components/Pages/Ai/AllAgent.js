import React, { useState } from 'react'
import Header from '../../CommonComponents/Header';
import ThreeDotedLoader from '../../Loader/ThreeDotedLoader';
import Tippy from '@tippyjs/react';
import '../../assets/css/components/aiAgent.css'

const AllAgent = () => {

    const [isAgentCreatePopup, setIsAgentCreatePopup] = useState(false);
    const [refreshState, setRefreshState] = useState(false)
    const [addUploadAgentToggle, setAddUploadAgentToggle] = useState(false);
    const [createNewAgentToggle, setCreateNewAgentToggle] = useState(false);
    const [deletePopup, setDeletePopup] = useState(false);

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
                                                    <h4>Agents {" "}
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
                                                    <button effect="ripple" className="panelButton " onClick={() => {
                                                        setIsAgentCreatePopup(true);
                                                    }}>
                                                        <span className="text">Create</span>
                                                        <span className="icon">
                                                            <i className="fa-solid fa-plus"></i>
                                                        </span>
                                                    </button>


                                                    <button className="panelButton edit" onClick={() => {
                                                        setAddUploadAgentToggle(true);
                                                    }}>
                                                        <span className="text">import</span>
                                                        <span className="icon">
                                                            <i className="fa-solid fa-file-csv"></i>
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
                                                            <th>Agent Name</th>
                                                            <th>Agent Type</th>
                                                            <th>Phone</th>
                                                            <th>Language</th>
                                                            <th>Voice</th>
                                                            <th></th>

                                                        </tr>
                                                    </thead>
                                                    <tbody className="">
                                                        <>
                                                            <tr>
                                                                <td>
                                                                    <div className="d-flex align-items-center">
                                                                        <div className="tableProfilePicHolder">
                                                                            {/* <img
                                                            alt="profile"
                                                            src={item.profile_picture}
                                                           src={require('../../assets/images/placeholder-image.webp')}
                                                          />
                                                        ) : ( */}
                                                                            <i className="fa-light fa-user" />
                                                                            {/* )} */}
                                                                        </div>
                                                                        <div className="ms-2">ravi raj</div>
                                                                    </div>
                                                                </td>
                                                                <td>conversation flow</td>
                                                                <td>14844731350</td>
                                                                <td>en-US</td>
                                                                <td>abc</td>
                                                                <td>
                                                                    <div className="dropdown">
                                                                        <button
                                                                            className={`tableButton`}
                                                                            href="#"
                                                                            role="button"
                                                                            data-bs-toggle="dropdown"
                                                                            aria-expanded="false"
                                                                        >
                                                                            <i className="fa-solid fa-ellipsis-vertical" />
                                                                        </button>
                                                                        <ul className="dropdown-menu actionBtnDropdowns">

                                                                            <li className="dropdown-item">
                                                                                <Tippy content="Reset configuration of this DID">
                                                                                    <button
                                                                                        className="clearButton text-align-start"
                                                                                    >
                                                                                        <i className="fa-regular fa-clone me-2"></i>
                                                                                        Duplicate
                                                                                    </button>
                                                                                </Tippy>
                                                                            </li>
                                                                            <li className="dropdown-item">
                                                                                <Tippy content="Select the usage of this DID">
                                                                                    <button
                                                                                        className="clearButton text-align-start"
                                                                                    >
                                                                                        <i className="fa-regular fa-arrow-right-arrow-left me-2"></i>
                                                                                        Export
                                                                                    </button>
                                                                                </Tippy>
                                                                            </li>
                                                                            <li className="dropdown-item">
                                                                                <Tippy content={"Delete the DID"}>
                                                                                    <button className="clearButton text-align-start text-danger" onClick={setDeletePopup}>
                                                                                        <i
                                                                                            className={`fa-regular fa-trash me-2`}
                                                                                        ></i>{" "}
                                                                                        Delete
                                                                                    </button>
                                                                                </Tippy>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <div className="d-flex align-items-center">
                                                                        <div className="tableProfilePicHolder">
                                                                            {/* <img
                                                            alt="profile"
                                                            src={item.profile_picture}
                                                           src={require('../../assets/images/placeholder-image.webp')}
                                                          />
                                                        ) : ( */}
                                                                            <i className="fa-light fa-user" />
                                                                            {/* )} */}
                                                                        </div>
                                                                        <div className="ms-2">sajid mirza</div>
                                                                    </div>
                                                                </td>
                                                                <td>conversation flow</td>
                                                                <td>14844731350</td>
                                                                <td>en-US</td>
                                                                <td>abc</td>
                                                                <td>
                                                                    <div className="dropdown">
                                                                        <button
                                                                            className={`tableButton`}
                                                                            href="#"
                                                                            role="button"
                                                                            data-bs-toggle="dropdown"
                                                                            aria-expanded="false"
                                                                        >
                                                                            <i className="fa-solid fa-ellipsis-vertical" />
                                                                        </button>
                                                                        <ul className="dropdown-menu actionBtnDropdowns">

                                                                            <li className="dropdown-item">
                                                                                <Tippy content="Reset configuration of this DID">
                                                                                    <button
                                                                                        className="clearButton text-align-start"
                                                                                    >
                                                                                        <i className="fa-regular fa-clone me-2"></i>
                                                                                        Duplicate
                                                                                    </button>
                                                                                </Tippy>
                                                                            </li>
                                                                            <li className="dropdown-item">
                                                                                <Tippy content="Select the usage of this DID">
                                                                                    <button
                                                                                        className="clearButton text-align-start"
                                                                                    >
                                                                                        <i className="fa-regular fa-arrow-right-arrow-left me-2"></i>
                                                                                        Export
                                                                                    </button>
                                                                                </Tippy>
                                                                            </li>
                                                                            <li className="dropdown-item">
                                                                                <Tippy content={"Delete the DID"}>
                                                                                    <button className="clearButton text-align-start text-danger" onClick={setDeletePopup} >
                                                                                        <i
                                                                                            className={`fa-regular fa-trash me-2`}
                                                                                        ></i>{" "}
                                                                                        Delete
                                                                                    </button>
                                                                                </Tippy>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <div className="d-flex align-items-center">
                                                                        <div className="tableProfilePicHolder">
                                                                            {/* <img
                                                            alt="profile"
                                                            src={item.profile_picture}
                                                           src={require('../../assets/images/placeholder-image.webp')}
                                                          />
                                                        ) : ( */}
                                                                            <i className="fa-light fa-user" />
                                                                            {/* )} */}
                                                                        </div>
                                                                        <div className="ms-2">riddhee gupta</div>
                                                                    </div>
                                                                </td>
                                                                <td>conversation flow</td>
                                                                <td>14844731350</td>
                                                                <td>en-US</td>
                                                                <td>abc</td>
                                                                <td>
                                                                    <div className="dropdown">
                                                                        <button
                                                                            className={`tableButton`}
                                                                            href="#"
                                                                            role="button"
                                                                            data-bs-toggle="dropdown"
                                                                            aria-expanded="false"
                                                                        >
                                                                            <i className="fa-solid fa-ellipsis-vertical" />
                                                                        </button>
                                                                        <ul className="dropdown-menu actionBtnDropdowns">

                                                                            <li className="dropdown-item">
                                                                                <Tippy content="Reset configuration of this DID">
                                                                                    <button
                                                                                        className="clearButton text-align-start"
                                                                                    >
                                                                                        <i className="fa-regular fa-clone me-2"></i>
                                                                                        Duplicate
                                                                                    </button>
                                                                                </Tippy>
                                                                            </li>
                                                                            <li className="dropdown-item">
                                                                                <Tippy content="Select the usage of this DID">
                                                                                    <button
                                                                                        className="clearButton text-align-start"
                                                                                    >
                                                                                        <i className="fa-regular fa-arrow-right-arrow-left me-2"></i>
                                                                                        Export
                                                                                    </button>
                                                                                </Tippy>
                                                                            </li>
                                                                            <li className="dropdown-item">
                                                                                <Tippy content={"Delete the DID"}>
                                                                                    <button
                                                                                        className="clearButton text-align-start text-danger" onClick={setDeletePopup}
                                                                                    >
                                                                                        <i
                                                                                            className={`fa-regular fa-trash me-2`}
                                                                                        ></i>{" "}
                                                                                        Delete
                                                                                    </button>
                                                                                </Tippy>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <div className="d-flex align-items-center">
                                                                        <div className="tableProfilePicHolder">
                                                                            {/* <img
                                                            alt="profile"
                                                            src={item.profile_picture}
                                                           src={require('../../assets/images/placeholder-image.webp')}
                                                          />
                                                        ) : ( */}
                                                                            <i className="fa-light fa-user" />
                                                                            {/* )} */}
                                                                        </div>
                                                                        <div className="ms-2">Sanjib Mukherjee</div>
                                                                    </div>
                                                                </td>
                                                                <td>conversation flow</td>
                                                                <td>14844731350</td>
                                                                <td>en-US</td>
                                                                <td>abc</td>
                                                                <td>
                                                                    <div className="dropdown">
                                                                        <button
                                                                            className={`tableButton`}
                                                                            href="#"
                                                                            role="button"
                                                                            data-bs-toggle="dropdown"
                                                                            aria-expanded="false"
                                                                        >
                                                                            <i className="fa-solid fa-ellipsis-vertical" />
                                                                        </button>
                                                                        <ul className="dropdown-menu actionBtnDropdowns">

                                                                            <li className="dropdown-item">
                                                                                <Tippy content="Reset configuration of this DID">
                                                                                    <button
                                                                                        className="clearButton text-align-start"
                                                                                    >
                                                                                        <i className="fa-regular fa-clone me-2"></i>
                                                                                        Duplicate
                                                                                    </button>
                                                                                </Tippy>
                                                                            </li>
                                                                            <li className="dropdown-item">
                                                                                <Tippy content="Select the usage of this DID">
                                                                                    <button
                                                                                        className="clearButton text-align-start"
                                                                                    >
                                                                                        <i className="fa-regular fa-arrow-right-arrow-left me-2"></i>
                                                                                        Export
                                                                                    </button>
                                                                                </Tippy>
                                                                            </li>
                                                                            <li className="dropdown-item">
                                                                                <Tippy content={"Delete the DID"}>
                                                                                    <button
                                                                                        className="clearButton text-align-start text-danger" onClick={setDeletePopup}
                                                                                    >
                                                                                        <i
                                                                                            className={`fa-regular fa-trash me-2`}
                                                                                        ></i>{" "}
                                                                                        Delete
                                                                                    </button>
                                                                                </Tippy>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </>
                                                    </tbody>
                                                </table>
                                            </div>
                                            {/* <div className="tableHeader mb-3">
                                            <PaginationComponent
                                                pageNumber={(e) => setPageNumber(e)}
                                                totalPage={agents.last_page}
                                                from={(pageNumber - 1) * agents.per_page + 1}
                                                to={agents.to}
                                                total={agents.total}
                                            />
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {isAgentCreatePopup &&
                    <div className="popup">
                        <div className="popup music">
                            <div className="container h-100">
                                <div className="row h-100 justify-content-center align-items-center">
                                    <div
                                        className="card px-0 col-5 shadow-none card80"
                                        style={{
                                            border: "1px solid var(--border-color)",
                                        }}
                                    >
                                        <div className="card-header bg-transparent ">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h5 className="card-title fs14 fw700 mb-0">
                                                    Select Template
                                                </h5>
                                                <button className="clearButton2 xl" onClick={() => setIsAgentCreatePopup(false)}>
                                                    <i className="fa-solid fa-xmark"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="card-body aiAgentTab ">
                                            <div className="d-flex align-items-start">
                                                <div className="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                                    <button className="nav-link active" id="v-pills-home-tab" data-bs-toggle="pill" data-bs-target="#v-pills-home" type="button" role="tab" aria-controls="v-pills-home" aria-selected="true">Single Prompt</button>
                                                    <button className="nav-link" id="v-pills-profile-tab" data-bs-toggle="pill" data-bs-target="#v-pills-profile" type="button" role="tab" aria-controls="v-pills-profile" aria-selected="false">conversation flow</button>

                                                </div>
                                                <div className="tab-content w-100" id="v-pills-tabContent">
                                                    <div className="tab-pane fade show active" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
                                                        <div className='d-flex gap-2'>
                                                            <div className='popup_box'>
                                                                <button className="popup-border text-center bg-transparent p-2" onClick={() => { setCreateNewAgentToggle(true) }}>

                                                                    <div
                                                                        className="d-block"
                                                                    >
                                                                        <div className="p-2 text-center">
                                                                            <i
                                                                                className="fa-solid fa-plus"
                                                                                style={{ fontSize: 40, color: '#03c2f4' }}
                                                                            />

                                                                        </div>
                                                                    </div>

                                                                </button>
                                                                <div className=" text-center">
                                                                    <h5 className="mb-0 mt-2 text-center">
                                                                        Start from Blank
                                                                    </h5>

                                                                </div>
                                                            </div>
                                                            <div className='popup_box'>
                                                                <button className="popup-border bg-transparent text-center p-2" onClick={() => { setCreateNewAgentToggle(true) }}>

                                                                    <div
                                                                        className="d-block"
                                                                    >
                                                                        <div className="p-2 text-center">
                                                                            <i
                                                                                className="fa-solid fa-phone-arrow-up-right"
                                                                                style={{ fontSize: 20, color: '#03c2f4' }}
                                                                            />
                                                                            <h5 className="mb-0 mt-2 text-center">
                                                                                Healthcare Check-in <br />
                                                                                <span className='text2'> Transfer Call</span>
                                                                            </h5>

                                                                        </div>
                                                                    </div>

                                                                </button>
                                                                <div className=" text-center">

                                                                    <h5 className="mb-0 mt-2 text-center">
                                                                        Healthcare Check-in
                                                                    </h5>
                                                                    <span className='text2'>
                                                                        Lorem Ipsum has been the industry's standard dummy text ever
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="tab-pane fade" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab">
                                                        <div className='d-flex gap-2'>
                                                            <div className='popup_box'>
                                                                <button className="popup-border bg-transparent text-center p-2" onClick={setCreateNewAgentToggle}>

                                                                    <div
                                                                        className="d-block"
                                                                    >
                                                                        <div className="p-2 text-center">
                                                                            <i
                                                                                className="fa-solid fa-plus"
                                                                                style={{ fontSize: 40, color: '#03c2f4' }}
                                                                            />


                                                                        </div>
                                                                    </div>

                                                                </button>
                                                                <div className=" text-center">
                                                                    <h5 className="mb-0 mt-2 text-center">
                                                                        Start from Blank
                                                                    </h5>
                                                                    {/* <span>
                                                                        Lorem Ipsum has been the industry's standard dummy text ever
                                                                    </span> */}
                                                                </div>
                                                            </div>
                                                            <div className='popup_box'>
                                                                <button className=" border-0 bg-transparent text-center p-2" onClick={() => { setCreateNewAgentToggle(true) }}>

                                                                    <div className=" popup-border p-3 ">
                                                                        <div className=' position-relative d-flex justify-content-center align-items-center'>
                                                                            <div className="p-3 text-center rounded-2 d-flex justify-content-center align-items-center gap-1 flex-column" style={{ border: '1px solid var(--me-border1' }}>
                                                                                <i
                                                                                    className="fa-solid fa-link"
                                                                                    style={{ fontSize: 20, color: '#03c2f4' }}
                                                                                />
                                                                                <h5 className="mb-0 mt-2 text-center">
                                                                                    Greetings
                                                                                </h5>

                                                                            </div>
                                                                            <div className="absoluteSvg">
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="75" viewBox="0 0 13 73" fill="none"><path d="M12.3536 4.35355C12.5488 4.15829 12.5488 3.84171 12.3536 3.64645L9.17156 0.46447C8.9763 0.269211 8.65972 0.269211 8.46446 0.46447C8.2692 0.659737 8.2692 0.976318 8.46446 1.17158L11.2929 4L8.46447 6.82844C8.26921 7.0237 8.26921 7.34028 8.46447 7.53554C8.65974 7.7308 8.97632 7.7308 9.17158 7.53554L12.3536 4.35355ZM9.39991 4V4.5V4ZM1.39992 71.5H0L0 72.5H1.39992V71.5ZM12 3.5C11.2484 3.5 10.3203 3.5 9.39991 3.5V4.5C10.3203 4.5 11.2484 4.5 12 4.5L12 3.5ZM4.89992 8L4.89992 68H5.89992L5.89992 8H4.89992ZM9.39991 3.5C6.91463 3.5 4.89992 5.51472 4.89992 8H5.89992C5.89992 6.067 7.46692 4.5 9.39991 4.5V3.5ZM1.39992 72.5C3.8852 72.5 5.89992 70.4853 5.89992 68H4.89992C4.89992 69.933 3.33291 71.5 1.39992 71.5V72.5Z" fill="currentColor"></path></svg></div>
                                                                            <div className="p-3 text-center rounded-2 d-flex justify-content-center align-items-center gap-1 flex-column" style={{ border: '1px solid var(--me-border1' }}>
                                                                                <i

                                                                                    className="fa-solid fa-chart-waterfall"
                                                                                    style={{ fontSize: 20, color: '#03c2f4' }}
                                                                                />
                                                                                <h5 className="mb-0 mt-2 text-center">
                                                                                    Screening
                                                                                </h5>

                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                </button>
                                                                <div className=" text-center">

                                                                    <h5 className="mb-0 mt-2 text-center">
                                                                        Patient Screening
                                                                    </h5>
                                                                    <span className='text2'>
                                                                        Lorem Ipsum has been the industry's standard dummy text ever
                                                                    </span>
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
                        </div>
                    </div>
                }

                {addUploadAgentToggle && (
                    <div className="popup music">
                        <div className="container h-100">
                            <div className="row h-100 justify-content-center align-items-center">
                                <div
                                    className="card px-0 col-5 shadow-none"
                                    style={{
                                        border: "1px solid var(--border-color)",
                                    }}
                                >
                                    <div className="header bg-transparent">
                                        <div className="d-flex justify-content-between">
                                            <h5 className="card-title fs14 border-bootm fw700">
                                                Upload an Agent
                                            </h5>
                                            <button className="clearButton2 xl" onClick={() => setAddUploadAgentToggle(!addUploadAgentToggle)}>
                                                <i className="fa-solid fa-xmark"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="popup-border text-center p-2">
                                            <input
                                                type="file"
                                                className="form-control-file d-none"
                                                id="fileInput"
                                                accept=".csv"
                                            // onChange={(e) => {
                                            //     const file = e.target.files[0];
                                            //     if (file) {
                                            //         // Check if the file type is MP3

                                            //         const fileName =
                                            //             file.name.replace(/ /g, "-");
                                            //         const newFile = new File(
                                            //             [file],
                                            //             fileName,
                                            //             {
                                            //                 type: file.type,
                                            //             }
                                            //         );
                                            //         setNewFile(newFile);
                                            //         handleFileChange(e);
                                            //     }
                                            // }}
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
                                                        Drag and Drop or{" "}
                                                        <span>Click on upload</span>
                                                    </p>
                                                    <span>
                                                        Supports formats : MP3, Max
                                                        Size: 2MB
                                                    </span>
                                                </div>
                                            </label>
                                            {/* {fileName && (
                                                <p className="mt-3 text-center">
                                                    Selected File:{" "}
                                                    <strong>{fileName}</strong>
                                                </p>
                                            )} */}
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <div className="d-flex justify-content-between">
                                            <button
                                                className="panelButton m-0"
                                            // onClick={handleNewImage}
                                            // disabled={!newImage}
                                            // onClick={() => handleFormSubmitStepFour()}
                                            >
                                                <span className="text">Confirm</span>
                                                <span className="icon">
                                                    <i className="fa-solid fa-check"></i>
                                                </span>
                                            </button>
                                            <button
                                                className="panelButton gray"
                                                onClick={() => {
                                                    setAddUploadAgentToggle(false);
                                                    // setNewImage(null);
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

                {createNewAgentToggle && (
                    <div className="popup music">
                        <div className="container h-100">
                            <div className="row h-100 justify-content-center align-items-center">
                                <div
                                    className="card px-0 col-5 shadow-none"
                                    style={{
                                        border: "1px solid var(--border-color)",
                                    }}
                                >
                                    <div className="header bg-transparent">
                                        <div className="d-flex justify-content-between">
                                            <h5 className="card-title fs14 border-bootm fw700">
                                                Create a New Agent
                                            </h5>
                                            <button className="clearButton2 xl" onClick={() => setCreateNewAgentToggle(!createNewAgentToggle)}>
                                                <i className="fa-solid fa-xmark"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <form>
                                            <div className="formRow">
                                                <div className="formLabel">
                                                    <label>Enter a Agent Name:</label>
                                                </div>
                                                <div className="col-8">
                                                    <input
                                                        type="text"
                                                        className="formItem"

                                                    />

                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="card-footer">
                                        <div className="d-flex justify-content-between">
                                            <button
                                                className="panelButton m-0"
                                            // onClick={handleNewImage}
                                            // disabled={!newImage}
                                            // onClick={() => handleFormSubmitStepFour()}
                                            >
                                                <span className="text">Create</span>
                                                <span className="icon">
                                                    <i className="fa-solid fa-check"></i>
                                                </span>
                                            </button>
                                            <button
                                                className="panelButton gray"
                                                onClick={() => {
                                                    setCreateNewAgentToggle(false);
                                                    // setNewImage(null);
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


            </main>
        </>
    )
}

export default AllAgent