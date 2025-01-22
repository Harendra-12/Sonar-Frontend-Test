import React from "react";
import Header from "../../../CommonComponents/Header";

import { backToTop, } from "../../../GlobalFunction/globalFunction";
import Tippy from "@tippyjs/react";
import { useNavigate } from "react-router-dom";


function AgentDispositionManage() {
    const navigate = useNavigate()
    return (
        <main className="mainContent">
            <section id="phonePage">
                <div className="container-fluid">
                    <div className="row">
                        <Header title="Agent Disposition" />
                        <div className="overviewTableWrapper">
                            <div className="overviewTableChild">
                                <div className="d-flex flex-wrap">
                                    <div className="col-12">
                                        <div className="heading">
                                            <div className="content">
                                                <h4>Agent Disposition Manage Edit</h4>
                                                <p>Edit existing Agent Disposition</p>
                                            </div>
                                            <div className="buttonGroup">
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
                                                        <i class="fa-solid fa-caret-left"></i>
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

                                    <div className="col-12" style={{ padding: "25px 23px" }}>
                                        <div className="row justify-content-between">
                                            <div className="col-xl-6 inputcheckbox" style={{ borderRight: '1px solid var(--border-color)' }}>
                                                <div className="header d-flex align-items-center justify-content-between">
                                                    <div
                                                        className="col fw-bold"
                                                        style={{ fontFamily: "Noto Sans" }}
                                                    >
                                                        Available Agent Disposition Methods
                                                    </div>
                                                    <div className="col-auto">
                                                        <button type="button" className="panelButton">
                                                            <span className="text">Add</span>
                                                            <span className="icon">
                                                                <i className="fa-solid fa-plus"></i>
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="col-xl-12">
                                                    <div className="col-xl-12 pt-3 ">
                                                        <div className="d-flex justify-content-center align-items-center">
                                                            <div className="savedCardWrapper col">
                                                                <div>
                                                                    <label>Interested</label>
                                                                </div>
                                                            </div>
                                                            <div className="d-flex align-items-center ">
                                                                <Tippy content='Edit this disposition'>
                                                                    <button
                                                                        className="tableButton edit m-2" >
                                                                        <i class="fa-solid fa-pencil"></i>
                                                                    </button>
                                                                </Tippy>
                                                                <Tippy content='Delete this disposition'>
                                                                    <button
                                                                        className="tableButton delete m-2">
                                                                        <i className="fa-solid fa-trash" />
                                                                    </button>
                                                                </Tippy>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-12 pt-3">
                                                        <div className="d-flex align-items-center">
                                                            <div className="savedCardWrapper col">
                                                                <div>
                                                                    <label>Not Interested</label>
                                                                </div>

                                                            </div>
                                                            <div className="d-flex align-items-center ">
                                                                <Tippy content='Edit this disposition'>
                                                                    <button
                                                                        className="tableButton edit m-2" >
                                                                        <i class="fa-solid fa-pencil"></i>
                                                                    </button>
                                                                </Tippy>
                                                                <Tippy content='Delete this disposition'>
                                                                    <button
                                                                        className="tableButton delete m-2">
                                                                        <i className="fa-solid fa-trash" />
                                                                    </button>
                                                                </Tippy>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-12 pt-3">
                                                        <div className="d-flex align-items-center">
                                                            <div className="savedCardWrapper col">
                                                                <div>
                                                                    <label>Demo Booked</label>
                                                                </div>

                                                            </div>
                                                            <div className="d-flex align-items-center ">
                                                                <Tippy content='Edit this disposition'>
                                                                    <button
                                                                        className="tableButton edit m-2" >
                                                                        <i class="fa-solid fa-pencil"></i>
                                                                    </button>
                                                                </Tippy>
                                                                <Tippy content='Delete this disposition'>
                                                                    <button
                                                                        className="tableButton delete m-2">
                                                                        <i className="fa-solid fa-trash" />
                                                                    </button>
                                                                </Tippy>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-12 pt-3">
                                                        <div className="d-flex align-items-center">
                                                            <div className="savedCardWrapper col">
                                                                <div>
                                                                    <label>Deal Closed</label>
                                                                </div>

                                                            </div>
                                                            <div className="d-flex align-items-center ">
                                                                <Tippy content='Edit this disposition'>
                                                                    <button
                                                                        className="tableButton edit m-2" >
                                                                        <i class="fa-solid fa-pencil"></i>
                                                                    </button>
                                                                </Tippy>
                                                                <Tippy content='Delete this disposition'>
                                                                    <button
                                                                        className="tableButton delete m-2">
                                                                        <i className="fa-solid fa-trash" />
                                                                    </button>
                                                                </Tippy>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-12 pt-3">
                                                        <div className="d-flex align-items-center">
                                                            <div className="savedCardWrapper col">
                                                                <div>
                                                                    <label>Requires Follow-up</label>
                                                                </div>

                                                            </div>
                                                            <div className="d-flex align-items-center ">
                                                                <Tippy content='Edit this disposition'>
                                                                    <button
                                                                        className="tableButton edit m-2" >
                                                                        <i class="fa-solid fa-pencil"></i>
                                                                    </button>
                                                                </Tippy>
                                                                <Tippy content='Delete this disposition'>
                                                                    <button
                                                                        className="tableButton delete m-2">
                                                                        <i className="fa-solid fa-trash" />
                                                                    </button>
                                                                </Tippy>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-12 pt-3">
                                                        <div className="d-flex align-items-center">
                                                            <div className="savedCardWrapper col">
                                                                <div>
                                                                    <label>Incorrect Number</label>
                                                                </div>

                                                            </div>
                                                            <div className="d-flex align-items-center ">
                                                                <Tippy content='Edit this disposition'>
                                                                    <button
                                                                        className="tableButton edit m-2" >
                                                                        <i class="fa-solid fa-pencil"></i>
                                                                    </button>
                                                                </Tippy>
                                                                <Tippy content='Delete this disposition'>
                                                                    <button
                                                                        className="tableButton delete m-2">
                                                                        <i className="fa-solid fa-trash" />
                                                                    </button>
                                                                </Tippy>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-12 pt-3">
                                                        <div className="d-flex align-items-center">
                                                            <div className="savedCardWrapper col">
                                                                <div>
                                                                    <label>Left Voicemail</label>
                                                                </div>

                                                            </div>
                                                            <div className="d-flex align-items-center ">
                                                                <Tippy content='Edit this disposition'>
                                                                    <button
                                                                        className="tableButton edit m-2" >
                                                                        <i class="fa-solid fa-pencil"></i>
                                                                    </button>
                                                                </Tippy>
                                                                <Tippy content='Delete this disposition'>
                                                                    <button
                                                                        className="tableButton delete m-2">
                                                                        <i className="fa-solid fa-trash" />
                                                                    </button>
                                                                </Tippy>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xl-6">
                                                <div className="header d-flex align-items-center justify-content-between">
                                                    <div
                                                        className="col-12 fw-bold"
                                                        style={{ fontFamily: "Noto Sans" }}
                                                    >
                                                        Manage Agent Disposition
                                                    </div>
                                                </div>
                                                <div className="col-xl-12 pt-3 ">
                                                    <form className="">
                                                        <div className="formRow col-xl-12">
                                                            <div className="formLabel">
                                                                <label htmlFor="">Disposition Name</label>
                                                                <label htmlFor="data" className="formItemDesc">
                                                                    Enter the name for the disposition method.
                                                                </label>
                                                            </div>
                                                            <div className="col-xl-6 col-12">
                                                                <input className="formItem" />
                                                            </div>
                                                        </div>
                                                        <div className="formRow col-xl-12">
                                                            <button type="button" className="panelButton ms-auto">
                                                                <span className="text">Save</span>
                                                                <span className="icon">
                                                                    <i className="fa-solid fa-floppy-disk"></i>
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </form>
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
            {/* {loading && <CircularLoader />} */}
        </main>
    )
}

export default AgentDispositionManage