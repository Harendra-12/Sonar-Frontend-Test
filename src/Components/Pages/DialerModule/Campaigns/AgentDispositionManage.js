import React from "react";
import Header from "../../../CommonComponents/Header";

import { backToTop, } from "../../../GlobalFunction/globalFunction";
import PaginationComponent from "../../../CommonComponents/PaginationComponent";

import {
    numberValidator, requiredValidator
} from "../../../validations/validation";
import ErrorMessage from "../../../CommonComponents/ErrorMessage";
import CircularLoader from "../../../Loader/CircularLoader";
import { Navigate } from "react-router-dom";


function AgentDispositionManage() {
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
                                                {/* <div className='d-flex align-items-center'>
                                                  <div className="formLabel py-0 me-2">
                                                      <label for="selectFormRow">Enabled</label>
                                                  </div>
                                                  <div className="my-auto position-relative mx-1">
                                                      <label className="switch">
                                                          <input
                                                              type="checkbox"
                                                              id="showAllCheck"
                                                              {...register("status", {
                                                              })}
                                                          />
                                                          <span className="slider round" />
                                                      </label>
                                                  </div>
                                              </div> */}
                                                <button
                                                    effect="ripple"
                                                    className="panelButton gray"
                                                    onClick={() => {
                                                        Navigate(-1);
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
                                        <div className="row">
                                            {/* <div className="col-xl-2">
                      <div className="someTempDialerDesign">
                      
                      </div>
                    </div> */}
                                            <div className="col-xl-5  inputcheckbox ">
                                                <div className="header d-flex align-items-center justify-content-between">
                                                    <div
                                                        className="col-5 fw-bold"
                                                        style={{ fontFamily: "Noto Sans" }}
                                                    >
                                                        Agent Disposition
                                                    </div>
                                                    {/* <div className="col-5 text-end">
                                                                                <button className="panelButton m-0 ms-auto">
                                                                                    <span className="text">Add</span>
                                                                                    <span className="icon">
                                                                                        <i className="fa-solid fa-plus" />
                                                                                    </span>
                                                                                </button>
                                                                            </div> */}
                                                </div>
                                                <div className="col-xl-12 pt-3 ">
                                                    <div className="d-flex justify-content-center align-items-center">
                                                        <div className="savedCardWrapper col">
                                                            <div>
                                                                <label>Interested</label>
                                                            </div>

                                                        </div>
                                                        <div>
                                                       <div className="d-flex align-items-center ">
                                                       <input className="m-2" type="checkbox" id="" checked=""/>
                                                      

                                                        <button
                                                            className="tableButton edit m-2" >
                                                            <i class="fa-solid fa-pencil "></i>
                                                        </button>

                                                        <button
                                                            className="tableButton delete m-2">
                                                            <i className="fa-solid fa-trash " />
                                                        </button>
                                                        </div>
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
                                                        <div>
                                                       <div className="d-flex align-items-center ">
                                                       <input className="m-2" type="checkbox" id="" checked=""/>
                                                      

                                                        <button
                                                            className="tableButton edit m-2" >
                                                            <i class="fa-solid fa-pencil "></i>
                                                        </button>

                                                        <button
                                                            className="tableButton delete m-2">
                                                            <i className="fa-solid fa-trash " />
                                                        </button>
                                                        </div>
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
                                                        <div>
                                                       <div className="d-flex align-items-center ">
                                                       <input className="m-2" type="checkbox" id="" checked=""/>
                                                      

                                                        <button
                                                            className="tableButton edit m-2" >
                                                            <i class="fa-solid fa-pencil "></i>
                                                        </button>

                                                        <button
                                                            className="tableButton delete m-2">
                                                            <i className="fa-solid fa-trash " />
                                                        </button>
                                                        </div>
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

                                                        <div>
                                                       <div className="d-flex align-items-center ">
                                                       <input className="m-2" type="checkbox" id="" checked=""/>
                                                      

                                                        <button
                                                            className="tableButton edit m-2" >
                                                            <i class="fa-solid fa-pencil "></i>
                                                        </button>

                                                        <button
                                                            className="tableButton delete m-2">
                                                            <i className="fa-solid fa-trash " />
                                                        </button>
                                                        </div>
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

                                                        <div>
                                                       <div className="d-flex align-items-center ">
                                                       <input className="m-2" type="checkbox" id="" checked=""/>
                                                      

                                                        <button
                                                            className="tableButton edit m-2" >
                                                            <i class="fa-solid fa-pencil "></i>
                                                        </button>

                                                        <button
                                                            className="tableButton delete m-2">
                                                            <i className="fa-solid fa-trash " />
                                                        </button>
                                                        </div>
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
                                                        <div>
                                                       <div className="d-flex align-items-center ">
                                                       <input className="m-2" type="checkbox" id="" checked=""/>
                                                      

                                                        <button
                                                            className="tableButton edit m-2" >
                                                            <i class="fa-solid fa-pencil "></i>
                                                        </button>

                                                        <button
                                                            className="tableButton delete m-2">
                                                            <i className="fa-solid fa-trash " />
                                                        </button>
                                                        </div>
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
                                                        <div>
                                                       <div className="d-flex align-items-center ">
                                                       <input className="m-2" type="checkbox" id="" checked=""/>
                                                      

                                                        <button
                                                            className="tableButton edit m-2" >
                                                            <i class="fa-solid fa-pencil "></i>
                                                        </button>

                                                        <button
                                                            className="tableButton delete m-2">
                                                            <i className="fa-solid fa-trash " />
                                                        </button>
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
                    </div>
                </div>

            </section>
            {/* {loading && <CircularLoader />} */}
        </main>
    )
}

export default AgentDispositionManage