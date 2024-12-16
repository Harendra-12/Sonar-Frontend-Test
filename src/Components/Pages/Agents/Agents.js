import React from 'react'
import Header from '../../CommonComponents/Header';
import PaginationComponent from '../../CommonComponents/PaginationComponent';
import EmptyPrompt from '../../Loader/EmptyPrompt';
import { Link } from 'react-router-dom';

function Agents() {
    return (

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
                                            <div className="content d-flex">
                                                {/* <h4>User List <button className="clearButton"><i className={
                                                    loading
                                                      
                                                }></i></button></h4> */}
                                            </div>
                                            <div className="buttonGroup">
                                                <button
                                                    effect="ripple"
                                                    className="panelButton gray" >
                                                    <span className="text">Back</span>
                                                    <span className="icon">
                                                        <i class="fa-solid fa-caret-left"></i>
                                                    </span>
                                                </button>


                                                <button


                                                    className="panelButton"
                                                    style={{ cursor: "not-allowed" }}
                                                >
                                                    <span className="text">Add</span>
                                                    <span className="icon">
                                                        <i class="fa-solid fa-plus"></i>
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
                                                    style={{ paddingRight: 100 }}
                                                />
                                            </div>
                                        </div>
                                        <div className="tableContainer">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Agentsname</th>
                                                        <th>Extension</th>
                                                        <th>Account ID</th>
                                                        {/* <th>Role</th> */}
                                                        {/* <th>Domain</th> */}
                                                        <th>Online</th>
                                                        <th>Edit</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="">


                                                    <tr>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                    </tr>
                                                    <>
                                                        <tr >
                                                            <td> </td>
                                                            <td> </td>
                                                            <td> </td>
                                                            <td>
                                                                <span></span>
                                                            </td>
                                                            <td>
                                                                {/* <button >
                                                                    <i class="fa-solid fa-pencil"></i>
                                                                </button> */}
                                                            </td>
                                                            <td>

                                                            </td>
                                                        </tr>
                                                    </>
                                                </tbody>
                                            </table>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* {popUp ? (
                <div className="popup">
                    <div className="container h-100">
                        <div className="row h-100 justify-content-center align-items-center">
                            <div className="row content col-xl-4">
                                <div className="col-2 px-0">
                                    <div className="iconWrapper">
                                        <i className="fa-duotone fa-triangle-exclamation"></i>
                                    </div>
                                </div>
                                <div className="col-10 ps-0">
                                    <h4>Warning!</h4>
                                    <p>
                                        
                                    </p>
                                    <div className="d-flex justify-content-between">
                                        <button
                                           
                                        >
                                            <span className="text">
                                               
                                            </span>
                                            <span className="icon">
                                                <i class="fa-solid fa-check"></i>
                                            </span>
                                        </button>
                                        <button
                                            className="panelButton gray m-0 float-end"
                                           
                                        >
                                            <span className="text">Cancel</span>
                                            <span className="icon">
                                                <i class="fa-solid fa-xmark"></i>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                ""
            )} */}
        </main>


    )
}

export default Agents