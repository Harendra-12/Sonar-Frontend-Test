import React, { useState } from 'react'
import Header from '../../CommonComponents/Header';
import BillingHistory from './BillingHistory';
import Usage from './Usage';
import Limits from './Limits';


const Billing = () => {

    const [refreshState, setRefreshState] = useState(false)
    const [addUploadAgentToggle, setAddUploadAgentToggle] = useState(false);
    const [deletePopup, setDeletePopup] = useState(false);
    const [idCopy, setIdCopy] = useState(false)
    const [startDateFlag, setStartDateFlag] = useState("");
    const [endDateFlag, setEndDateFlag] = useState("");
    const [timeFlag, setTimeFlag] = useState({
        startTime: "",
        endTime: "",
    });
    const [timeFilter, setTimeFilter] = useState({
        startTime: "",
        endTime: "",
    });



    const handleRefreshBtnClicked = () => {
        setRefreshState(true)
        // const shouldLoad = false
        // getData(shouldLoad);
    }

    return (
        <>
            <main className="mainContent">
                <section id="phonePage">
                    <div className="container-fluid">
                        <div className="row">
                            <Header title="Billing" />
                            <div className="overviewTableWrapper">
                                <div className="overviewTableChild">
                                    <div className="d-flex flex-wrap">
                                        <div className="col-12">
                                            <div className="heading">
                                                <div className="content">
                                                    <h4>Billing {" "}
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
                                                    <p>You can manage your billing information here. </p>
                                                </div>
                                                <div className="buttonGroup">
                                                    <button effect="ripple" className="panelButton xlWidth"
                                                    // onClick={() => {
                                                    //     setIsAgentCreatePopup(true); }}
                                                    >
                                                        <span className="text">Change payment methods</span>
                                                        <span className="icon">
                                                            <i className="fa-solid fa-arrow-up-right"></i>
                                                        </span>
                                                    </button>
                                                    <button className="panelButton edit xlWidth"
                                                    // onClick={() => {
                                                    //     setAddUploadAgentToggle(true);
                                                    // }}
                                                    >
                                                        <span className="text">Manage Billing Info</span>
                                                        <span className="icon">
                                                            <i className="fa-solid fa-arrow-up-right-from-square"></i>
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 formScroller billingTable">
                                            <nav className="tangoNavs historyNav">
                                                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                                    <button
                                                        className="nav-link active"
                                                        id="nav-user-tab"
                                                        data-bs-toggle="tab"
                                                        data-bs-target="#nav-user"
                                                        type="button"
                                                        role="tab"
                                                        aria-controls="nav-user"
                                                        aria-selected="true"
                                                    >
                                                        Billing History
                                                    </button>
                                                    <button
                                                        className="nav-link"
                                                        id="nav-exten-tab"
                                                        data-bs-toggle="tab"
                                                        data-bs-target="#nav-exten"
                                                        type="button"
                                                        role="tab"
                                                        aria-controls="nav-exten"
                                                        aria-selected="false"
                                                    >
                                                        Usage
                                                    </button>
                                                    <button
                                                        className="nav-link"
                                                        id="nav-provision-tab"
                                                        data-bs-toggle="tab"
                                                        data-bs-target="#nav-exten-1"
                                                        type="button"
                                                        role="tab"
                                                        aria-controls="nav-exten-1"
                                                        aria-selected="false"
                                                    >
                                                        Limits
                                                    </button>
                                                </div>
                                            </nav>
                                            <div
                                                className="tab-content"
                                                id="nav-tabContent"
                                                style={{
                                                    border: "none",
                                                    paddingTop: '20px'
                                                }}
                                            >
                                                <div
                                                    className="tab-pane fade show active"
                                                    id="nav-user"
                                                    role="tabpanel"
                                                    aria-labelledby="nav-user-tab"
                                                    tabIndex="0"
                                                >
                                                    <BillingHistory />
                                                </div>
                                                <div
                                                    className="tab-pane fade"
                                                    id="nav-exten"
                                                    role="tabpanel"
                                                    aria-labelledby="nav-exten-tab"
                                                    tabIndex="0"
                                                >
                                                    <Usage />
                                                </div>
                                                <div
                                                    className="tab-pane fade"
                                                    id="nav-exten-1"
                                                    role="tabpanel"
                                                    aria-labelledby="nav-provision-tab"
                                                    tabIndex="0"
                                                >
                                                    <Limits />
                                                </div>
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

export default Billing