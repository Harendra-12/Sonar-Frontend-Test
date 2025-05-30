import React, { useEffect, useState } from 'react'
import Header from '../../../CommonComponents/Header'
import PaginationComponent from '../../../CommonComponents/PaginationComponent'
import { backToTop, generalGetFunction } from '../../../GlobalFunction/globalFunction';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ActionType } from '../../../Redux/reduxActionType';

function Leads() {
    const dispatch = useDispatch();
    const [refreshState, setRefreshState] = useState()
    const [leadsDetails, setLeadsDetails] = useState()
    const navigate = useNavigate();
    const getLead = async () => {
        const res = await generalGetFunction(`/campaign-lead/all`);
        if (res?.status) {
            dispatch({
                type: ActionType?.SET_ALL_LEADS_LIST,
                payload: res.data
            })
            setLeadsDetails(res?.data)
        }
    }
    useEffect(() => {
        getLead()
    }, [])

    const handleRefreshBtnClicked = () => {

    }

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
                                                <h4>Leads {" "}
                                                    <button
                                                        className="clearButton"
                                                        onClick={handleRefreshBtnClicked}
                                                        disabled={refreshState}
                                                    >
                                                        <i
                                                            className={
                                                                refreshState
                                                                    ? "fa-regular fa-arrows-rotate fs-5 fa-spin"
                                                                    : "fa-regular fa-arrows-rotate fs-5"
                                                            }
                                                        ></i>
                                                    </button>
                                                </h4>
                                            </div>
                                            <div className="buttonGroup">
                                                {/* <button
                                                    effect="ripple"
                                                    className="panelButton ms-0"
                                                // onClick={() => setRefreshState(refreshState + 1)}
                                                >
                                                    <span className="text">Refresh</span>
                                                    <span className="icon">
                                                        <i className="fa-regular fa-arrows-rotate fs-5"></i>
                                                    </span>
                                                </button> */}
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
                                                    onClick={() => navigate('/lead-add')}
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

                                                    {
                                                        leadsDetails?.data?.map((data) => {
                                                            return (
                                                                <tr>
                                                                    <td>{data?.id}</td>
                                                                    <td>{data?.first_name}</td>
                                                                    <td>static</td>
                                                                    <td>{data?.title}</td>
                                                                    <td>{data?.tries}</td>
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
                                                            )
                                                        })
                                                    }
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