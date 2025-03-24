import React from 'react'
import PaginationComponent from '../../CommonComponents/PaginationComponent'
import Header from '../../CommonComponents/Header'

function Source() {
    return (
        <>
            <main className="mainContent">
                <section id="phonePage">
                    <div className="container-fluid">
                        <div className="row">
                            <Header title="Source" />
                            <div className="overviewTableWrapper">
                                <div className="overviewTableChild">
                                    <div className="d-flex flex-wrap">
                                        <div className="col-12">
                                            <div className="heading">
                                                <div className="content">
                                                    <h4>
                                                    Source
                                                    </h4>
                                                    <p>You can see all list of Buyers groups</p>
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
                                                            <th>DID</th>
                                                            <th>Campaign</th>
                                                            <th>Status</th>
                                                            <th>Edit</th>
                                                            <th>Delete</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Rishabh maurya01</td>
                                                            <td>test102</td>
                                                            <td>enterprise</td>
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
                                                                //   onClick={() =>
                                                                //     navigate(
                                                                //       `/ring-groups-edit?id=${item.id}`
                                                                //     )
                                                                //   }
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
                                                        <tr>
                                                            <td>Rishabh maurya02</td>
                                                            <td>test102</td>
                                                            <td>enterprise</td>
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
                                                                //   onClick={() =>
                                                                //     navigate(
                                                                //       `/ring-groups-edit?id=${item.id}`
                                                                //     )
                                                                //   }
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
                                                        <tr>
                                                            <td>Rishabh maurya03</td>
                                                            <td>test102</td>
                                                            <td>enterprise</td>
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
                                                                //   onClick={() =>
                                                                //     navigate(
                                                                //       `/ring-groups-edit?id=${item.id}`
                                                                //     )
                                                                //   }
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

export default Source