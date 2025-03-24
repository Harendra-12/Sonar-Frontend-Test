import React from 'react'
import PaginationComponent from '../../CommonComponents/PaginationComponent'
import Header from '../../CommonComponents/Header'

function Buyers() {
    return (
        <>
            <main className="mainContent">
                <section id="phonePage">
                    <div className="container-fluid">
                        <div className="row">
                            <Header title="Ring Groups" />
                            <div className="overviewTableWrapper">
                                <div className="overviewTableChild">
                                    <div className="d-flex flex-wrap">
                                        <div className="col-12">
                                            <div className="heading">
                                                <div className="content">
                                                    <h4>
                                                        Ring Group List
                                                    </h4>
                                                    <p>You can see all list of ring groups</p>
                                                </div>
                                                <div className="buttonGroup">
                                                    <button
                                                        effect="ripple"
                                                        className="panelButton gray"
                                                    >
                                                        <span className="text">Back</span>
                                                        <span className="icon">
                                                            <i className="fa-solid fa-caret-left"></i>
                                                        </span>
                                                    </button>
                                                    <button
                                                        disabled
                                                        effect="ripple"
                                                        className="panelButton"
                                                        style={{ cursor: "not-allowed" }}
                                                    >
                                                        <span className="text">Add</span>
                                                        <span className="icon">
                                                            <i className="fa-solid fa-plus"></i>
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="col-12"
                                            style={{ overflow: "auto", padding: "25px 20px 0" }}
                                        >
                                            <div className="tableHeader">
                                                <div className="showEntries">
                                                    <label>Show</label>
                                                    <select
                                                        className="formItem"
                                                    // value={itemsPerPage}
                                                    // onChange={(e) => {
                                                    //     setItemsPerPage(e.target.value);
                                                    // }}
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
                                                        type="text"
                                                        name="Search"
                                                        placeholder="Search"
                                                        // value={searchValue}
                                                        className="formItem"
                                                    // onChange={(e) => setSearchValue(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="tableContainer">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>Name</th>
                                                            <th>Extension</th>
                                                            <th>Strategy</th>
                                                            <th>Members</th>
                                                            <th>Status</th>
                                                            <th>Description</th>
                                                            <th>Edit</th>
                                                            <th>Delete</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>test</td>
                                                            <td>test</td>
                                                            <td>test</td>
                                                            <td>test</td>
                                                            <td>test</td>
                                                            <td>tset</td>
                                                            <td>tsetse</td>
                                                            <td>test</td>

                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="tableHeader mb-3">
                                                <PaginationComponent
                                                // pageNumber={(e) => setPageNumber(e)}
                                                // totalPage={ringGroup.last_page}
                                                // from={ringGroup.from}
                                                // to={ringGroup.to}
                                                // total={ringGroup.total}
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

export default Buyers