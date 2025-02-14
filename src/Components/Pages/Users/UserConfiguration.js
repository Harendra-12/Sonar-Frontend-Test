import React from 'react'
import Header from '../../CommonComponents/Header'
import { backToTop } from '../../GlobalFunction/globalFunction';
import { useNavigate } from 'react-router-dom';
import UsersEdit from './UsersEdit';

function UserConfiguration() {
    const navigate = useNavigate();
    return (
        <>
            <main className="mainContent">
                <section id="phonePage">
                    <div className="container-fluid px-0">
                        <Header title="Agents" />
                    </div>
                    <div className="col-xl-12" style={{ overflow: "auto" }}>
                        <div className="overviewTableWrapper">
                            <div className="overviewTableChild">
                                <div className="d-flex flex-wrap">
                                    <div className="col-12">
                                        <div className="heading">
                                            <div className="content">
                                                <h4>Agents Edit</h4>
                                                <p>Edit user information and group membership.</p>
                                            </div>
                                            <div className="buttonGroup">
                                                <button
                                                    onClick={() => {
                                                        navigate("-1");
                                                        backToTop();
                                                    }}
                                                    type="button"
                                                    effect="ripple"
                                                    className="panelButton gray"
                                                >
                                                    <span className="text">Back</span>
                                                    <span className="icon">
                                                        <i class="fa-solid fa-caret-left"></i>
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="col-12 formScroller"
                                    style={{ padding: "25px 23px" }}
                                >
                                    <nav className="tangoNavs">
                                        <div class="nav nav-tabs" id="nav-tab" role="tablist">
                                            <button
                                                class="nav-link active"
                                                id="nav-user-tab"
                                                data-bs-toggle="tab"
                                                data-bs-target="#nav-user"
                                                type="button"
                                                role="tab"
                                                aria-controls="nav-user"
                                                aria-selected="true"
                                            >
                                                User Configuration
                                            </button>
                                            <button
                                                class="nav-link"
                                                id="nav-exten-tab"
                                                data-bs-toggle="tab"
                                                data-bs-target="#nav-exten"
                                                type="button"
                                                role="tab"
                                                aria-controls="nav-exten"
                                                aria-selected="false"
                                            >
                                                Permissions Configuration
                                            </button>
                                        </div>
                                    </nav>
                                    <div
                                        class="tab-content"
                                        id="nav-tabContent"
                                        style={{
                                            border: "1px solid var(--border-color)",
                                            borderTop: "none",
                                            borderRadius: "0 0 5px 5px",
                                        }}
                                    >
                                        <div
                                            class="tab-pane fade show active"
                                            id="nav-user"
                                            role="tabpanel"
                                            aria-labelledby="nav-user-tab"
                                            tabindex="0"
                                        >
                                            <UsersEdit page="marginleftAdjust" />
                                        </div>
                                        <div
                                            class="tab-pane fade"
                                            id="nav-exten"
                                            role="tabpanel"
                                            aria-labelledby="nav-exten-tab"
                                            tabindex="0"
                                        >
                                            <main className="mainContent ms-0">
                                                <section id="phonePage">
                                                    <div className="col-xl-12">
                                                        <div className="overviewTableWrapper">
                                                            <div className="overviewTableChild">
                                                                <div
                                                                    className="d-flex flex-wrap"
                                                                    style={{ position: "sticky", top: "0", zIndex: "9" }}
                                                                >
                                                                    <div className="col-12">
                                                                        <div className="heading">
                                                                            <div className="content">
                                                                                <h4>Permissions Edit</h4>
                                                                                <p>Edit user information and group membership.</p>
                                                                            </div>
                                                                            <div className="buttonGroup">
                                                                                <button
                                                                                    onClick={() => {
                                                                                        navigate(-1);
                                                                                        backToTop();
                                                                                    }}
                                                                                    type="button"
                                                                                    effect="ripple"
                                                                                    className="panelButton gray"
                                                                                >
                                                                                    <span className="text">Back</span>
                                                                                    <span className="icon">
                                                                                        <i class="fa-solid fa-caret-left"></i>
                                                                                    </span>
                                                                                </button>
                                                                                <button
                                                                                    type="button"
                                                                                    effect="ripple"
                                                                                    className="panelButton"
                                                                                >
                                                                                    <span className="text">Save</span>
                                                                                    <span className="icon">
                                                                                        <i class="fa-solid fa-floppy-disk"></i>
                                                                                    </span>
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="col-12" style={{ padding: "25px 23px" }}>
                                                                    <div className="row gx-5">
                                                                        <div
                                                                            className="col-xl-6"
                                                                            style={{ borderRight: "1px solid var(--border-color)" }}
                                                                        >
                                                                            <div className="header">
                                                                                <div className="col fw-bold" style={{ fontFamily: '"Noto Sans"' }}>
                                                                                    Edit User Visibility of the following features!
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-xl-12">
                                                                                <div className="col-xl-12 pt-3 ">
                                                                                    <div className="d-flex justify-content-center align-items-center">
                                                                                        <div className="savedCardWrapper col">
                                                                                            <div>
                                                                                                <label>Call Details Report (CDR)</label>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="d-flex align-items-center ">
                                                                                            <button className="tableButton edit m-2">
                                                                                                <i className="fa-solid fa-pencil" />
                                                                                            </button>
                                                                                            <button className="tableButton  m-2">
                                                                                                <i className="fa-solid fa-arrows-rotate" />
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-xl-12 pt-3 ">
                                                                                    <div className="d-flex justify-content-center align-items-center">
                                                                                        <div className="savedCardWrapper col">
                                                                                            <div>
                                                                                                <label>Call Recording</label>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="d-flex align-items-center ">
                                                                                            <button className="tableButton edit m-2">
                                                                                                <i className="fa-solid fa-pencil" />
                                                                                            </button>
                                                                                            <button className="tableButton  m-2">
                                                                                                <i className="fa-solid fa-arrows-rotate" />
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-xl-12 pt-3 ">
                                                                                    <div className="d-flex justify-content-center align-items-center">
                                                                                        <div className="savedCardWrapper col">
                                                                                            <div>
                                                                                                <label>Agent Report</label>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="d-flex align-items-center ">
                                                                                            <button className="tableButton edit m-2">
                                                                                                <i className="fa-solid fa-pencil" />
                                                                                            </button>
                                                                                            <button className="tableButton  m-2">
                                                                                                <i className="fa-solid fa-arrows-rotate" />
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-xl-12 pt-3 ">
                                                                                    <div className="d-flex justify-content-center align-items-center">
                                                                                        <div className="savedCardWrapper col">
                                                                                            <div>
                                                                                                <label>Call Queue Report</label>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="d-flex align-items-center ">
                                                                                            <button className="tableButton edit m-2">
                                                                                                <i className="fa-solid fa-pencil" />
                                                                                            </button>
                                                                                            <button className="tableButton  m-2">
                                                                                                <i className="fa-solid fa-arrows-rotate" />
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-xl-12 pt-3 ">
                                                                                    <div className="d-flex justify-content-center align-items-center">
                                                                                        <div className="savedCardWrapper col">
                                                                                            <div>
                                                                                                <label>Ring Group Report</label>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="d-flex align-items-center ">
                                                                                            <button className="tableButton edit m-2">
                                                                                                <i className="fa-solid fa-pencil" />
                                                                                            </button>
                                                                                            <button className="tableButton  m-2">
                                                                                                <i className="fa-solid fa-arrows-rotate" />
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-xl-12 pt-3 ">
                                                                                    <div className="d-flex justify-content-center align-items-center">
                                                                                        <div className="savedCardWrapper col">
                                                                                            <div>
                                                                                                <label>Meeting Reports</label>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="d-flex align-items-center ">
                                                                                            <button className="tableButton edit m-2">
                                                                                                <i className="fa-solid fa-pencil" />
                                                                                            </button>
                                                                                            <button className="tableButton m-2">
                                                                                                <i className="fa-solid fa-arrows-rotate" />
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-xl-6" style={{ borderLeft: "1px solid var(--border-color)" }}>
                                                                            <div className="header d-flex align-items-center justify-content-between">
                                                                                <div className="col fw-bold" style={{ fontFamily: '"Noto Sans"' }}>
                                                                                    Choose what should be visible
                                                                                </div>
                                                                                <div className="col-auto">
                                                                                    <button type="button" className="panelButton">
                                                                                        <span className="text">Save</span>
                                                                                        <span className="icon">
                                                                                            <i className="fa-solid fa-floppy-disk" />
                                                                                        </span>
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                            <div className='col-xl-12'>
                                                                                <div className='row'>
                                                                                    <div className="formRow col-xl-3">
                                                                                        <div className="formLabel">
                                                                                            <label htmlFor="">Direction</label>
                                                                                        </div>
                                                                                        <div className="col-xl-6 col-12">
                                                                                            <input type="checkbox" />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="formRow col-xl-3">
                                                                                        <div className="formLabel">
                                                                                            <label htmlFor="">Direction</label>
                                                                                        </div>
                                                                                        <div className="col-xl-6 col-12">
                                                                                            <input type="checkbox" />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="formRow col-xl-3">
                                                                                        <div className="formLabel">
                                                                                            <label htmlFor="">Direction</label>
                                                                                        </div>
                                                                                        <div className="col-xl-6 col-12">
                                                                                            <input type="checkbox" />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="formRow col-xl-3">
                                                                                        <div className="formLabel">
                                                                                            <label htmlFor="">Direction</label>
                                                                                        </div>
                                                                                        <div className="col-xl-6 col-12">
                                                                                            <input type="checkbox" />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="formRow col-xl-3">
                                                                                        <div className="formLabel">
                                                                                            <label htmlFor="">Direction</label>
                                                                                        </div>
                                                                                        <div className="col-xl-6 col-12">
                                                                                            <input type="checkbox" />
                                                                                        </div>
                                                                                    </div>
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

export default UserConfiguration