import React from 'react'
import Header from '../../../CommonComponents/Header'
import PaginationComponent from '../../../CommonComponents/PaginationComponent'
import { backToTop } from '../../../GlobalFunction/globalFunction';
import { useNavigate } from 'react-router-dom';

function Leads() {
    const navigate = useNavigate();
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
                                                        <i class="fa-solid fa-caret-left"></i>
                                                    </span>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="panelButton"
                                                    onClick={() => {
                                                        navigate('/lead-add');
                                                        backToTop();
                                                    }}
                                                >
                                                    <span className="text">Add</span>
                                                    <span className="icon">
                                                        <i className="fa-solid fa-plus"></i>
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12" style={{ overflow: "auto", padding: "25px 20px 0" }}>
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
                                                    placeholder="Search"
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
                                                        <th>Active</th>
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
                                                            <div className="my-auto position-relative mx-1">
                                                                <label className="switch">
                                                                    <input
                                                                        type="checkbox"
                                                                        id="showAllCheck"
                                                                    />
                                                                    <span className="slider round" />
                                                                </label>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <button
                                                                className="tableButton mx-auto"
                                                            >
                                                                <i class="fa-solid fa-download"></i>
                                                            </button>
                                                        </td>
                                                        <td>
                                                            <button
                                                                className="tableButton edit mx-auto"
                                                                onClick={() => navigate('/lead-edit')}
                                                            >
                                                                <i class="fa-solid fa-pen"></i>
                                                            </button>
                                                        </td>
                                                        <td>
                                                            <button
                                                                className="tableButton delete mx-auto"
                                                            >
                                                                <i class="fa-solid fa-trash"></i>
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
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Leads