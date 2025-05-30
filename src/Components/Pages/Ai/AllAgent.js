import React, { useState } from 'react'
import Header from '../../CommonComponents/Header';
import ThreeDotedLoader from '../../Loader/ThreeDotedLoader';
import Tippy from '@tippyjs/react';
import '../../assets/css/components/aiAgent.css'

const AllAgent = () => {

    const [isAgentCreatePopup, setIsAgentCreatePopup] = useState(false);
    const [refreshState, setRefreshState] = useState(false)
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


                                                    <button className="panelButton edit" >
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
                                                                                    <div
                                                                                        className="clearButton text-align-start"
                                                                                    >
                                                                                        <i className="fa-regular fa-arrows-rotate me-2"></i>{" "}
                                                                                        Reset
                                                                                    </div>
                                                                                </Tippy>
                                                                            </li>
                                                                            <li className="dropdown-item">
                                                                                <Tippy content="Select the usage of this DID">
                                                                                    <div
                                                                                        className="clearButton text-align-start"
                                                                                    >
                                                                                        <i className="fa-regular fa-gear me-2"></i>{" "}
                                                                                        Set Usage
                                                                                    </div>
                                                                                </Tippy>
                                                                            </li>
                                                                            <li className="dropdown-item">
                                                                                <Tippy content={"Delete the DID"}>
                                                                                    <div
                                                                                        className="clearButton text-align-start"
                                                                                    >
                                                                                        <i
                                                                                            className={`fa-regular fa-trash me-2`}
                                                                                        ></i>{" "}
                                                                                        Delete
                                                                                    </div>
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
                                                                                    <div
                                                                                        className="clearButton text-align-start"
                                                                                    >
                                                                                        <i className="fa-regular fa-arrows-rotate me-2"></i>{" "}
                                                                                        Reset
                                                                                    </div>
                                                                                </Tippy>
                                                                            </li>
                                                                            <li className="dropdown-item">
                                                                                <Tippy content="Select the usage of this DID">
                                                                                    <div
                                                                                        className="clearButton text-align-start"
                                                                                    >
                                                                                        <i className="fa-regular fa-gear me-2"></i>{" "}
                                                                                        Set Usage
                                                                                    </div>
                                                                                </Tippy>
                                                                            </li>
                                                                            <li className="dropdown-item">
                                                                                <Tippy content={"Delete the DID"}>
                                                                                    <div
                                                                                        className="clearButton text-align-start"
                                                                                    >
                                                                                        <i
                                                                                            className={`fa-regular fa-trash me-2`}
                                                                                        ></i>{" "}
                                                                                        Delete
                                                                                    </div>
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
                                                                                    <div
                                                                                        className="clearButton text-align-start"
                                                                                    >
                                                                                        <i className="fa-regular fa-arrows-rotate me-2"></i>{" "}
                                                                                        Reset
                                                                                    </div>
                                                                                </Tippy>
                                                                            </li>
                                                                            <li className="dropdown-item">
                                                                                <Tippy content="Select the usage of this DID">
                                                                                    <div
                                                                                        className="clearButton text-align-start"
                                                                                    >
                                                                                        <i className="fa-regular fa-gear me-2"></i>{" "}
                                                                                        Set Usage
                                                                                    </div>
                                                                                </Tippy>
                                                                            </li>
                                                                            <li className="dropdown-item">
                                                                                <Tippy content={"Delete the DID"}>
                                                                                    <div
                                                                                        className="clearButton text-align-start"
                                                                                    >
                                                                                        <i
                                                                                            className={`fa-regular fa-trash me-2`}
                                                                                        ></i>{" "}
                                                                                        Delete
                                                                                    </div>
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
                                                                                    <div
                                                                                        className="clearButton text-align-start"
                                                                                    >
                                                                                        <i className="fa-regular fa-arrows-rotate me-2"></i>{" "}
                                                                                        Reset
                                                                                    </div>
                                                                                </Tippy>
                                                                            </li>
                                                                            <li className="dropdown-item">
                                                                                <Tippy content="Select the usage of this DID">
                                                                                    <div
                                                                                        className="clearButton text-align-start"
                                                                                    >
                                                                                        <i className="fa-regular fa-gear me-2"></i>{" "}
                                                                                        Set Usage
                                                                                    </div>
                                                                                </Tippy>
                                                                            </li>
                                                                            <li className="dropdown-item">
                                                                                <Tippy content={"Delete the DID"}>
                                                                                    <div
                                                                                        className="clearButton text-align-start"
                                                                                    >
                                                                                        <i
                                                                                            className={`fa-regular fa-trash me-2`}
                                                                                        ></i>{" "}
                                                                                        Delete
                                                                                    </div>
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
                                            <div class="d-flex align-items-start">
                                                <div class="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                                    <button class="nav-link active" id="v-pills-home-tab" data-bs-toggle="pill" data-bs-target="#v-pills-home" type="button" role="tab" aria-controls="v-pills-home" aria-selected="true">Single Prompt</button>
                                                    <button class="nav-link" id="v-pills-profile-tab" data-bs-toggle="pill" data-bs-target="#v-pills-profile" type="button" role="tab" aria-controls="v-pills-profile" aria-selected="false">conversation flow</button>

                                                </div>
                                                <div class="tab-content w-100" id="v-pills-tabContent">
                                                    <div class="tab-pane fade show active" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
                                                        <div className='d-flex gap-2'>
                                                            <div className='popup_box'>
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
                                                                        <div className="p-2 text-center">
                                                                            <i
                                                                                className="fa-solid fa-plus"
                                                                                style={{ fontSize: 40, color: '#03c2f4' }}
                                                                            />
                                                                            {/* <p className="mb-0 mt-2 text-center">
                                                                                Healthcare Check-in <br />
                                                                                <span> Transfer Call</span>
                                                                            </p> */}

                                                                        </div>
                                                                    </label>

                                                                </div>
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
                                                                        <div className="p-2 text-center">
                                                                            <i
                                                                                className="fa-solid fa-phone-arrow-up-right"
                                                                                style={{ fontSize: 20, color: '#03c2f4' }}
                                                                            />
                                                                            <h5 className="mb-0 mt-2 text-center">
                                                                                Healthcare Check-in <br />
                                                                                <span> Transfer Call</span>
                                                                            </h5>

                                                                        </div>
                                                                    </label>

                                                                </div>
                                                                <div className=" text-center">

                                                                    <h5 className="mb-0 mt-2 text-center">
                                                                        Healthcare Check-in
                                                                    </h5>
                                                                    <span>
                                                                        Lorem Ipsum has been the industry's standard dummy text ever
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="tab-pane fade" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab">

                                                    </div>

                                                </div>
                                            </div>

                                            {/* <div className="popup-border text-center p-2">
                                                <input
                                                    type="file"
                                                    className="form-control-file d-none"
                                                    id="fileInput"
                                                    accept=".csv"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            const fileName =
                                                                file.name.replace(/ /g, "-");
                                                            const newFile = new File(
                                                                [file],
                                                                fileName,
                                                                {
                                                                    type: file.type,
                                                                }
                                                            );
                                                            setNewFile(newFile);
                                                            handleFileChange(e);
                                                        }
                                                    }}
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
                                                {fileName && (
                                                    <p className="mt-3 text-center">
                                                        Selected File:{" "}
                                                        <strong>{fileName}</strong>
                                                    </p>
                                                )}
                                            </div> */}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }

            </main>
        </>
    )
}

export default AllAgent