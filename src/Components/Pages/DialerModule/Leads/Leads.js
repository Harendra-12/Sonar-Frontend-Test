import React, { useState } from 'react'
import Header from '../../../CommonComponents/Header'
import PaginationComponent from '../../../CommonComponents/PaginationComponent'
import { backToTop } from '../../../GlobalFunction/globalFunction';
import { useNavigate } from 'react-router-dom';

function Leads() {
    const navigate = useNavigate();
    const [addNewCsvToggle, setAddNewCsvToggle] = useState(false);
    const [newFile, setNewFile] = useState(null);
    const [fileName, setFileName] = useState("");

    // Function to get selected file name
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const sanitizedFileName = file.name.replace(/ /g, "-");
            setFileName(sanitizedFileName); // Set the file name in state
            // Additional logic for the newFile can go here
        }
    };

    return (
        <main className="mainContent">
            <section id="phonePage">
                <div className="container-fluid">
                    <div className="row">
                        <Header title="Leads" />
                        <div className="overviewTableWrapper">
                            <div className="overviewTableChild">
                                <div className="d-flex flex-wrap">
                                    <div className="col-12">
                                        <div className="heading">
                                            <div className="content">
                                                <h4>Leads</h4>
                                            </div>
                                            <div className="buttonGroup">
                                                <button
                                                    effect="ripple"
                                                    className="panelButton ms-0"
                                                // onClick={() => setRefreshState(refreshState + 1)}
                                                >
                                                    <span className="text">Refresh</span>
                                                    <span className="icon">
                                                        <i className="fa-regular fa-arrows-rotate fs-5"></i>
                                                    </span>
                                                </button>
                                                <button
                                                    effect="ripple"
                                                    className="panelButton gray"
                                                    onClick={() => {
                                                        navigate(-1);
                                                        backToTop();
                                                    }}
                                                >
                                                    <span className="text">Back</span>
                                                    <span className="icon">
                                                        <i className="fa-solid fa-caret-left"></i>
                                                    </span>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="panelButton"
                                                    onClick={() => setAddNewCsvToggle(true)}
                                                >
                                                    <span className="text">Add</span>
                                                    <span className="icon">
                                                        <i className="fa-solid fa-plus"></i>
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12" style={{ overflow: "auto", padding: "10px 20px 0" }}>
                                        <div className="tableHeader">
                                            <div className="showEntries">
                                                <label>Show</label>
                                                <select
                                                    className="formItem"
                                                // value={itemsPerPage}
                                                // onChange={(e) => setItemsPerPage(e.target.value)}
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
                                                // onChange={() => featureUnderdevelopment()}
                                                />
                                            </div>
                                        </div>
                                        <div className="tableContainer">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Id</th>
                                                        <th>Lead Name</th>
                                                        <th>Lead Description</th>
                                                        <th>Campaign</th>
                                                        <th>Rows</th>
                                                        <th className='text-center'>Active</th>
                                                        <th style={{ textAlign: "center" }}>Download</th>
                                                        <th style={{ textAlign: "center" }}>Edit</th>
                                                        <th style={{ textAlign: "center" }}>Delete</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>78</td>
                                                        <td>xyz</td>
                                                        <td>USA CST</td>
                                                        <td>Campaign Name</td>
                                                        <td>1200</td>
                                                        <td>
                                                            <div className="my-auto position-relative d-flex justify-content-center">
                                                                {/* <label className="switch">
                                                                    <input
                                                                        type="checkbox"
                                                                        id="showAllCheck"
                                                                    />
                                                                    <span className="slider round" />
                                                                </label> */}
                                                                <div class="cl-toggle-switch">
                                                                    <label class="cl-switch">
                                                                        <input type="checkbox"
                                                                            id="showAllCheck"
                                                                        />
                                                                        <span></span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <button
                                                                className="tableButton mx-auto blue"
                                                            >
                                                                <i className="fa-solid fa-download"></i>
                                                            </button>
                                                        </td>
                                                        <td>
                                                            <button
                                                                className="tableButton edit mx-auto"
                                                                onClick={() => navigate('/lead-edit')}
                                                            >
                                                                <i className="fa-solid fa-pen"></i>
                                                            </button>
                                                        </td>
                                                        <td>
                                                            <button
                                                                className="tableButton delete mx-auto"
                                                            >
                                                                <i className="fa-solid fa-trash"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="tableHeader mb-3">
                                            <PaginationComponent
                                            // pageNumber={(e) => setPageNumber(e)}
                                            // totalPage={callCenter.totalPage}
                                            // from={callCenter.from}
                                            // to={callCenter.to}
                                            // total={callCenter.total}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {addNewCsvToggle && (
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
                                                        Upload Documents
                                                    </h5>
                                                    <button className="clearButton2 xl" onClick={() => setAddNewCsvToggle(!addNewCsvToggle)}>
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
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                                // Check if the file type is MP3

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
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Leads