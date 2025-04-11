import React from 'react'
import PaginationComponent from '../../CommonComponents/PaginationComponent'
import Header from '../../CommonComponents/Header'
import { useNavigate } from 'react-router-dom'

function Buyers() {
    const navigate = useNavigate();
    return (
        <>
            <main className="mainContent">
                <section id="phonePage">
                    <div className="container-fluid">
                        <div className="row">
                            <Header title="Forwarding portal" />
                            <div className="overviewTableWrapper">
                                <div className="overviewTableChild">
                                    <div className="d-flex flex-wrap">
                                        <div className="col-12">
                                            <div className="heading">
                                                <div className="content">
                                                    <h4>
                                                    Forwarding portal
                                                    </h4>
                                                    <p>You can see all list of Forwarding portal</p>
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
                                                        onClick={() => navigate('/buyer-add')}
                                                        effect="ripple"
                                                        className="panelButton"
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
                                                            <th>Fportal name</th>
                                                            <th>Type</th>
                                                            <th>Active hours</th>
                                                            <th>Start time </th>
                                                            <th>End time</th>
                                                            <th>Start Day</th>
                                                            <th>End Day day</th>
                                                            <th>Status</th>
                                                            <th>Edit</th>
                                                            <th>Delete</th>



                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Rishabh maurya01</td>
                                                            <td>Outbound</td>
                                                            <td>60 min</td>
                                                            <td>09:30pm </td>
                                                            <td>10:30am</td>

                                                            <td>24/03/2025</td> 
                                                            <td>05/04/2025</td>
                                                            <td>
                                                                <div className="my-auto position-relative mx-1">
                                                                    <label className="switch">
                                                                        <input
                                                                            type="checkbox"
                                                                            // checked={
                                                                            //     item.status == "active"
                                                                            // }
                                                                            // onClick={(e) => {
                                                                            //     setSelectedRingGroup(item);
                                                                            //     setPopUp(true);
                                                                            // }}
                                                                            // {...register("status")}
                                                                            id="showAllCheck"
                                                                        />
                                                                        <span className="slider round" />
                                                                    </label>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <button
                                                                    className="tableButton edit"
                                                                    onClick={() =>
                                                                        navigate(
                                                                            `/buyer-edit`
                                                                        )
                                                                    }
                                                                >
                                                                    <i className="fa-solid fa-pencil" />
                                                                </button>
                                                            </td>
                                                            <td>
                                                                <button
                                                                    className="tableButton delete"
                                                                // onClick={() => {
                                                                //     setPopUp(true);
                                                                //     setDeleteId(item.id);
                                                                // }}
                                                                >
                                                                    <i className="fa-solid fa-trash" />
                                                                </button>
                                                            </td>

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