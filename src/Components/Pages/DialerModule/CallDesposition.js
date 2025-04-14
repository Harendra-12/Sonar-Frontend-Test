import React from 'react'
import Header from '../../CommonComponents/Header'
import { Link } from 'react-router-dom'
import PaginationComponent from '../../CommonComponents/PaginationComponent'
import Tippy from '@tippyjs/react'

function CallDesposition() {
    return (
        <main className="mainContent">
            <section id="phonePage">
                <div className="container-fluid">
                    <div className="row">
                        <Header title="Call Desposition" />
                        <div className="overviewTableWrapper">
                            <div className="overviewTableChild">
                                <div className="d-flex flex-wrap">
                                    <div className="col-12">
                                        <div className="heading">
                                            <div className="content">
                                                <h4>Call Desposition</h4>
                                                <p>You can see the list of Call Desposition</p>
                                            </div>
                                            <div className="buttonGroup">
                                                <button
                                                    effect="ripple"
                                                    className="panelButton gray">
                                                    <span className="text">Back</span>
                                                    <span className="icon">
                                                        <i className="fa-solid fa-caret-left"></i>
                                                    </span>
                                                </button>
                                                <Link

                                                    to="#"

                                                    effect="ripple"
                                                    className="panelButton" >
                                                    <span className="text">Add</span>
                                                    <span className="icon">
                                                        <i className="fa-solid fa-plus"></i>
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="col-12"
                                        style={{ overflow: "auto", padding: "10px 20px 0" }} >
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
                                                    type="search"
                                                    className="formItem"
                                                />
                                            </div>
                                        </div>
                                        <div className="tableContainer">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Profile</th>
                                                        <th>Created</th>
                                                        <th>CID Number</th>
                                                        <th>Destination</th>
                                                        <th>Call Started</th>
                                                        <th>Time</th>
                                                        <th>Category</th>
                                                        <th>Option</th>
                                                    </tr>
                                                </thead>
                                                <tbody>

                                                    <tr>
                                                        <td>1212</td>
                                                        <td>Rishabh</td>
                                                        <td>45544</td>
                                                        <td>45544</td>
                                                        {/* <td>No Permissions</td> */}
                                                        <td>44565</td>
                                                        <td>cusdn</td>
                                                        <td>12:45</td>
                                                        <td>Test</td>
                                                        <td>
                                                            <div className="dropdown">
                                                                <div className={`tableButton $`} href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                    <i className="fa-solid fa-ellipsis-vertical" />
                                                                </div>
                                                                <ul className="dropdown-menu actionBtnDropdowns">
                                                                    <li className='dropdown-item'>
                                                                        <Tippy content="Reset configuration of this DID">
                                                                            <div className="clearButton text-align-start">
                                                                                <i className="fa-regular fa-pen me-2"></i>Update
                                                                            </div>
                                                                        </Tippy>
                                                                    </li>
                                                                    <li className='dropdown-item'>
                                                                        <Tippy content="Reset configuration of this DID">
                                                                            <div className="clearButton text-align-start">
                                                                                <i className="fa-regular fa-trash me-2"></i>Delete
                                                                            </div>
                                                                        </Tippy>
                                                                    </li>
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
        </main >
    )
}

export default CallDesposition