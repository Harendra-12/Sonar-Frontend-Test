import React from 'react'

function EFax() {
    return (
        <main className="mainContentApp">
            <section>
                <div className="container-fluid">
                    <div className="row">
                        <div
                            className="col-12 col-xl-6 d-flex flex-wrap justify-content-between py-3 border-end"
                            style={{ height: "100%" }}
                        >
                            <div className="col-auto">
                                <h3 style={{ fontFamily: "Outfit", color: "#444444" }}>
                                    eFax
                                </h3>
                            </div>
                            <div className="col-auto d-flex">
                                <div className="col-auto">
                                    <button
                                        className="appPanelButton"
                                        effect="ripple"
                                    // onClick={() => setDialpadShow(!dialpadShow)}
                                    >
                                        <i className="fa-light fa-mobile-retro" />
                                    </button>
                                </div>
                                <div className="col-auto">
                                    <button className="appPanelButton" effect="ripple">
                                        <i className="fa-light fa-satellite-dish" />
                                    </button>
                                </div>
                            </div>

                            <div className="col-12">
                                <nav>
                                    <div className="nav nav-tabs">
                                        <button
                                            //   onClick={()=>setClickStatus("all")} 
                                            className={"tabLink active"} data-category="all">
                                            All
                                        </button>
                                        <button
                                            // onClick={()=>setClickStatus("incoming")}
                                            className={"tabLink"}
                                            effect="ripple"
                                            data-category="incoming"
                                        >
                                            Received
                                        </button>
                                        <button
                                            // onClick={()=>setClickStatus("outgoing")}
                                            className={"tabLink"}
                                            effect="ripple"
                                            data-category="outgoing"
                                        >
                                            Sent
                                        </button>
                                        <button
                                            // onClick={()=>setClickStatus("missed")}
                                            className={"tabLink"}
                                            effect="ripple"
                                            data-category="missed"
                                        >
                                            Failed
                                        </button>
                                    </div>
                                </nav>
                                <div className="tab-content">
                                    <div className="position-relative searchBox d-flex mt-3">
                                        <input
                                            type="search"
                                            name="Search"
                                            id="headerSearch"
                                            placeholder="Search"
                                        />
                                        <button className="appPanelButton" effect="ripple">
                                            <i className="fa-light fa-calendar-plus" />
                                        </button>
                                    </div>
                                    <div className='callList'>
                                        <div className="text-center callListItem active-item">
                                            <h5 className="fw-semibold">Today</h5>
                                        </div>
                                        <div className="contactListItem filterItem active-item">
                                            <div className="row justify-content-between">
                                                <div className="col-xl-6 d-flex">
                                                    <div className="profileHolder" id="profileOnline"><i className="fa-light fa-user fs-5"></i></div>
                                                    <div className="my-auto ms-2 ms-xl-3">
                                                        <h4>AUSER XYZ</h4>
                                                        <h5>1 (999) 999-9999</h5>
                                                    </div>
                                                </div>
                                                <div className="col-10 col-xl-4">
                                                    <h4><span>Received</span></h4>
                                                    <h5>1 Attachment</h5>
                                                    {/* <h6 style={{ display: 'flex', alignItems: 'center' }}><i className="fa-regular fa-xmark me-1"></i> 550</h6> */}
                                                </div>
                                                <div className="col-auto text-end d-flex justify-content-center align-items-center">
                                                    <h5>12:46pm</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="col-12 col-xl-6 callDetails"
                            style={{ height: "100%" }}
                            id="callDetails"
                        >
                            <div className="profileInfoHolder">
                                <div className="profileHolder">
                                    <i className="fa-light fa-user fs-3" />
                                </div>
                                <h4>1 (999) 999-9999</h4>
                                <h5>USER XYZ</h5>
                                <div className="d-flex justify-content-center align-items-center mt-3">
                                    <button className="appPanelButton" effect="ripple">
                                        <i className="fa-light fa-message-dots" />
                                    </button>
                                    <button className="appPanelButton" effect="ripple">
                                        <i className="fa-light fa-phone" />
                                    </button>
                                    <button className="appPanelButton" effect="ripple">
                                        <i className="fa-light fa-video" />
                                    </button>
                                </div>
                            </div>
                            <div className="mt-2">
                                <nav>
                                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                        <button
                                            className="tabLink active"
                                            effect="ripple"
                                            data-bs-toggle="tab"
                                            data-bs-target="#nav-home"
                                            type="button"
                                            role="tab"
                                            aria-controls="nav-home"
                                            aria-selected="true"
                                        >
                                            <i className="fa-regular fa-circle-info" />
                                        </button>
                                        <button
                                            className="tabLink"
                                            effect="ripple"
                                            data-bs-toggle="tab"
                                            data-bs-target="#nav-profile"
                                            type="button"
                                            role="tab"
                                            aria-controls="nav-profile"
                                            aria-selected="false"
                                        >
                                            <i className="fa-regular fa-clock-rotate-left" />
                                        </button>
                                    </div>
                                </nav>
                                <div className="tab-content" id="nav-tabContent">
                                    <div
                                        className="tab-pane fade show active"
                                        id="nav-home"
                                        role="tabpanel"
                                        aria-labelledby="nav-home-tab"
                                        tabIndex={0}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default EFax