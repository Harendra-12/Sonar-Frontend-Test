import React from 'react'
import Header from "../../CommonComponents/Header";
import { Link } from 'react-router-dom';
import { backToTop } from "../../GlobalFunction/globalFunction";

function ExpenseList() {
    return (
        <main className="mainContent">
            <section id="phonePage">
                <div className="container-fluid">
                    <div className="row">
                        <Header title="Expense List" />
                        <div className="row px-xl-3 py-2" id="detailsHeader">
                            <div className="col-xl-4 my-auto">
                                <div className="position-relative searchBox">
                                    <input
                                        type="search"
                                        name="Search"
                                        id="headerSearch"
                                        placeholder="Search"
                                    />
                                </div>
                            </div>
                            <div className="col-xl-8 pt-3 pt-xl-0">
                                <div className="d-flex justify-content-end">
                                    <Link
                                        to="/extensions-add"
                                        onClick={backToTop}
                                        effect="ripple"
                                        className="panelButton"
                                    >
                                        Add
                                    </Link>
                                    {/* <div className="my-auto position-relative mx-3">
                                        <label className="switch">
                                            <input type="checkbox" id="showAllCheck" />
                                            <span className="slider round" />
                                        </label>
                                        <span className="position-relative mx-1">Show All</span>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                        <div className="col-12" style={{ overflow: "auto" }}>
                            <div className="tableContainer">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Card Holder's Name</th>
                                            <th>Card Number</th>
                                            <th>Payment Date</th>
                                            <th>Transaction ID</th>
                                            <th>Transaction Amount</th>
                                            <th>Description</th>
                                            <th>Status</th>
                                            <th>Download</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* {loading ? (
                                            <tr>
                                                <td colSpan={99}>
                                                    <ContentLoader />
                                                </td>
                                            </tr>
                                        ) : (
                                            ""
                                        )} */}

                                        <tr>
                                            <td>
                                                Lalu Prasad Yadav
                                            </td>
                                            <td>
                                                **** **** **** 4411
                                            </td>
                                            <td>
                                                16-04-2024
                                            </td>
                                            <td>
                                                pi_3PXyXLP2K5GdGJju1uxFk71D
                                            </td>
                                            <td>
                                                $25000.00
                                            </td>
                                            <td>
                                                Package Purchase
                                            </td>
                                            <td>
                                                <label className="tableLabel success">Succes</label>
                                            </td>
                                            <td>
                                                <i className="fa-duotone fa-download text-success"></i>
                                            </td>
                                        </tr>

                                        {/* {extension && extension.data.length === 0 ? (
                                            <td colSpan={99}>
                                                <EmptyPrompt name="Extension" link="extensions-add" />
                                            </td>
                                        ) : (
                                            ""
                                        )} */}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {/* {extension && extension.data.length > 0 ? (
                        <PaginationComponent
                            pageNumber={(e) => setPageNumber(e)}
                            totalPage={extension.last_page}
                            from={(pageNumber - 1) * extension.per_page + 1}
                            to={extension.to}
                            total={extension.total}
                        />
                    ) : (
                        ""
                    )} */}
                </div>
            </section>
        </main>
    )
}

export default ExpenseList