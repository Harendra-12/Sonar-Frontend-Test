import React from 'react'
import Header from '../../CommonComponents/Header';
import { Link } from 'react-router-dom';
import PaginationComponent from '../../CommonComponents/PaginationComponent';

function AgentReport() {
    return (
        <main className="mainContent">
            <section id="phonePage">
                <div className="container-fluid">
                    <div className="row">
                        <Header title="Report" />
                        <div className="overviewTableWrapper">
                            <div className="overviewTableChild">
                                <div className="d-flex flex-wrap">
                                    <div className="col-12">
                                        <div className="heading">
                                            <div className="content">
                                                <h4>Agent Report</h4>
                                                <p>You can see the list of Agent</p>
                                            </div>
                                            <div className="buttonGroup">
                                                <button
                                                    effect="ripple"
                                                    className="panelButton gray">
                                                    <span className="text">Back</span>
                                                    <span className="icon">
                                                        <i class="fa-solid fa-caret-left"></i>
                                                    </span>
                                                </button>
                                                <Link

                                                    to="#"

                                                    effect="ripple"
                                                    className="panelButton" >
                                                    <span className="text">Buy</span>
                                                    <span className="icon">
                                                        <i class="fa-solid fa-cart-shopping"></i>
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="col-12"
                                        style={{ overflow: "auto", padding: "25px 20px 0" }} >
                                        <div className="tableHeader">
                                            <div className="showEntries">
                                                <label>Show</label>
                                                <select
                                                    className="formItem"

                                                >
                                                    <option value={10}>10</option>
                                                    <option value={20}>20</option>
                                                    <option value={30}>30</option>
                                                </select>
                                                <label>entries</label>
                                            </div>
                                            <div className="searchBox">
                                                <label>Search:</label>
                                                <input
                                                    type="text"

                                                    className="formItem"

                                                />
                                            </div>
                                        </div>
                                        <div className="tableContainer">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Call Direction</th>
                                                        <th>Call Type</th>
                                                        <th>Origin</th>
                                                        <th>Destination	</th>
                                                        <th>Date</th>
                                                        <th>Time</th>
                                                        <th className="text-center">Recording</th>
                                                        <th className="text-center">Duration	</th>
                                                        <th className="text-center" style={{ width: 100 }}>
                                                            Hangup Cause
                                                        </th>
                                                        <th>Charge</th>
                                                    </tr>
                                                </thead>
                                                <tbody>

                                                    <tr>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td>No Permissions</td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
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
    )
}

export default AgentReport