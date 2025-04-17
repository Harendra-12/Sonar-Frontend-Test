import React, { useState } from 'react'
import Header from '../../../CommonComponents/Header'
import { useNavigate } from 'react-router-dom';
import { backToTop } from '../../../GlobalFunction/globalFunction';
import PagePermissionForUser from '../../../CommonComponents/PermissionConfigForUser';
import PaginationComponent from '../../../CommonComponents/PaginationComponent';

function LeadEdit() {
    const navigate = useNavigate();
    const [leadsEditState, setLeadsEditState] = useState({
        first_name: "test",
        last_name: "test",
        phone_number: "999999",
        address1: "test",
        address2: "test",
        city: "test",
        state: "test",
        phone_code: "1",
        postal_code: "111",
        gender: "M",

    });
    const [popUp, setPopUp] = useState(false);

    return (
        <main className="mainContent">
            <section id="phonePage">
                <div className="container-fluid">
                    <div className="row">
                        <Header title="Lead Manage" />
                        <div className="overviewTableWrapper">
                            <div className="overviewTableChild">
                                <div className="d-flex flex-wrap">
                                    <div className="col-12">
                                        <div className="heading">
                                            <div className="content">
                                                <h4>Lead Edit</h4>
                                                <p>Manage the config of the lead</p>
                                            </div>
                                            <div className="buttonGroup">
                                                <div className='d-flex align-items-center'>
                                                    <div className="formLabel py-0 me-2">
                                                        <label for="selectFormRow">Enabled</label>
                                                    </div>
                                                    <div className="my-auto position-relative mx-1">
                                                        {/* <label className="switch">
                                                            <input
                                                                type="checkbox"
                                                                id="showAllCheck"
                                                            />
                                                            <span className="slider round" />
                                                        </label> */}
                                                        <div class="cl-toggle-switch">
                                                            <label class="cl-switch">
                                                                <input
                                                                    type="checkbox" id="showAllCheck"
                                                                />
                                                                <span></span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
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
                                                >
                                                    <span className="text">Save</span>
                                                    <span className="icon">
                                                        <i className="fa-solid fa-floppy-disk"></i>
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
                                                        <th>First Name</th>
                                                        <th>Last Name</th>
                                                        <th>Phone Number</th>
                                                        <th>Address</th>
                                                        <th>City</th>
                                                        <th>State</th>
                                                        <th>Country code</th>
                                                        <th>Zip Code</th>
                                                        <th>Gender</th>
                                                        <th>Edit</th>
                                                        <th>Delete</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>1</td>
                                                        <td>Test</td>
                                                        <td>Test</td>
                                                        <td>999999</td>
                                                        <td>test</td>
                                                        <td>test</td>
                                                        <td>test</td>
                                                        <td>1</td>
                                                        <td>111</td>
                                                        <td>M</td>
                                                        <td>
                                                            <button
                                                                className="tableButton edit"
                                                                onClick={() => setPopUp(true)}
                                                            >
                                                                <i className="fa-solid fa-pen"></i>
                                                            </button>
                                                        </td>
                                                        <td>
                                                            <button
                                                                className="tableButton delete"
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
                                    {popUp ? (
                                        <div className="backdropContact">
                                            <div className="addNewContactPopup">
                                                <div className="row">
                                                    <div className="col-12 heading mb-0">
                                                        <i className="fa-light fa-circle-exclamation"></i>
                                                        <h5 className='mb-0'>Lead Edit</h5>
                                                    </div>
                                                    <div className="col-12" style={{ padding: "0px 0px 10px" }}>
                                                        <form className="mb-0 d-flex flex-wrap">
                                                            <div className="formRow col-xl-6">
                                                                <div className="formLabel">
                                                                    <label>First Name</label>
                                                                </div>
                                                                <div className="col-12">
                                                                    <input
                                                                        type="text"
                                                                        className="formItem"
                                                                        value={leadsEditState.first_name}
                                                                        onChange={(e) => {
                                                                            setLeadsEditState({
                                                                                ...leadsEditState,
                                                                                first_name: e.target.value,
                                                                            });
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="formRow col-xl-6">
                                                                <div className="formLabel">
                                                                    <label>Last Name</label>
                                                                </div>
                                                                <div className="col-12">
                                                                    <input
                                                                        type="text"
                                                                        className="formItem"
                                                                        value={leadsEditState.last_name}
                                                                        onChange={(e) => {
                                                                            setLeadsEditState({
                                                                                ...leadsEditState,
                                                                                last_name: e.target.value,
                                                                            });
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="formRow col-xl-6">
                                                                <div className="formLabel">
                                                                    <label>Phone Number</label>
                                                                </div>
                                                                <div className="col-12">
                                                                    <input
                                                                        type="number"
                                                                        className="formItem"
                                                                        value={leadsEditState.phone_number}
                                                                        onChange={(e) => {
                                                                            setLeadsEditState({
                                                                                ...leadsEditState,
                                                                                phone_number: e.target.value,
                                                                            });
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="formRow col-xl-6">
                                                                <div className="formLabel">
                                                                    <label>Address 1</label>
                                                                </div>
                                                                <div className="col-12">
                                                                    <input
                                                                        type="text"
                                                                        className="formItem"
                                                                        value={leadsEditState.address1}
                                                                        onChange={(e) => {
                                                                            setLeadsEditState({
                                                                                ...leadsEditState,
                                                                                address1: e.target.value,
                                                                            });
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="formRow col-xl-6">
                                                                <div className="formLabel">
                                                                    <label>Address 2</label>
                                                                </div>
                                                                <div className="col-12">
                                                                    <input
                                                                        type="text"
                                                                        className="formItem"
                                                                        value={leadsEditState.address2}
                                                                        onChange={(e) => {
                                                                            setLeadsEditState({
                                                                                ...leadsEditState,
                                                                                address2: e.target.value,
                                                                            });
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="formRow col-xl-6">
                                                                <div className="formLabel">
                                                                    <label>City</label>
                                                                </div>
                                                                <div className="col-12">
                                                                    <input
                                                                        type="text"
                                                                        className="formItem"
                                                                        value={leadsEditState.city}
                                                                        onChange={(e) => {
                                                                            setLeadsEditState({
                                                                                ...leadsEditState,
                                                                                city: e.target.value,
                                                                            });
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="formRow col-xl-6">
                                                                <div className="formLabel">
                                                                    <label>State</label>
                                                                </div>
                                                                <div className="col-12">
                                                                    <input
                                                                        type="text"
                                                                        className="formItem"
                                                                        value={leadsEditState.state}
                                                                        onChange={(e) => {
                                                                            setLeadsEditState({
                                                                                ...leadsEditState,
                                                                                state: e.target.value,
                                                                            });
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="formRow col-xl-6">
                                                                <div className="formLabel">
                                                                    <label>Country code</label>
                                                                </div>
                                                                <div className="col-12">
                                                                    <input
                                                                        type="number"
                                                                        className="formItem"
                                                                        value={leadsEditState.phone_code}
                                                                        onChange={(e) => {
                                                                            setLeadsEditState({
                                                                                ...leadsEditState,
                                                                                phone_code: e.target.value,
                                                                            });
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="formRow col-xl-6">
                                                                <div className="formLabel">
                                                                    <label>Zip Code</label>
                                                                </div>
                                                                <div className="col-12">
                                                                    <input
                                                                        type="number"
                                                                        className="formItem"
                                                                        value={leadsEditState.postal_code}
                                                                        onChange={(e) => {
                                                                            setLeadsEditState({
                                                                                ...leadsEditState,
                                                                                postal_code: e.target.value,
                                                                            });
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="formRow col-xl-6">
                                                                <div className="formLabel">
                                                                    <label>Gender</label>
                                                                </div>
                                                                <div className="col-12">
                                                                    <select
                                                                        name=""
                                                                        id=""
                                                                        className="formItem "
                                                                        value={leadsEditState.gender}
                                                                        onChange={(e) =>
                                                                            setLeadsEditState({
                                                                                ...leadsEditState,
                                                                                gender: e.target.value,
                                                                            })
                                                                        }
                                                                    >
                                                                        <option value="M">Male</option>
                                                                        <option value="F">Female</option>
                                                                        <option value="O">Other</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                    <div className="d-flex justify-content-between">
                                                        <button
                                                            className="panelButton m-0"
                                                        // onClick={() => handleUpdateLeads()}
                                                        >
                                                            <span className="text">Confirm</span>
                                                            <span className="icon">
                                                                <i className="fa-solid fa-check"></i>
                                                            </span>
                                                        </button>
                                                        <button
                                                            className="panelButton gray m-0 float-end"
                                                            onClick={() => setPopUp(false)}
                                                        >
                                                            <span className="text">Cancel</span>
                                                            <span className="icon">
                                                                <i className="fa-solid fa-xmark"></i>
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main >
    )
}

export default LeadEdit