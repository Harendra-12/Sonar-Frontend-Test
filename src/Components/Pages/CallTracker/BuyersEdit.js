import React from 'react'
import Header from '../../CommonComponents/Header'
import { backToTop } from '../../GlobalFunction/globalFunction';
import { useNavigate } from 'react-router-dom';

const BuyersEdit = () => {
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
                          <h4>Forwarding portal Add</h4>
                          <p>Manage the config of the Forwarding portal</p>
                        </div>
                        <div className="buttonGroup">
                          <div className="d-flex align-items-center">
                            <div className="formLabel py-0 me-2">
                              <label for="selectFormRow">Enabled</label>
                            </div>
                            <div className="my-auto position-relative mx-1">
                              <label className="switch">
                                <input type="checkbox" id="showAllCheck" />
                                <span className="slider round" />
                              </label>
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
                          <button type="button" className="panelButton">
                            <span className="text">Save</span>
                            <span className="icon">
                              <i className="fa-solid fa-floppy-disk"></i>
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-12" style={{ padding: "25px 23px" }}>
                      <form className="row mb-0">
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label>
                              Forwarding Portal Name{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <label htmlFor="data" className="formItemDesc">
                              Enter a name.
                            </label>
                          </div>
                          <div className="col-6">
                            <input type="text" className="formItem" />
                          </div>
                        </div>

                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label>Active hours</label>
                            <label htmlFor="data" className="formItemDesc">
                              select time
                            </label>
                          </div>
                          <div className="col-6">
                            <select
                              className="formItem"
                              // {...register("strategy")}
                              id="selectFormRow"
                            >
                              <option value="enterprise">60 min</option>
                              <option value="sequence">30 min</option>
                            </select>
                          </div>
                        </div>
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label>Forwarding Portal Type</label>
                            <label htmlFor="data" className="formItemDesc">
                             
                            </label>
                          </div>
                          <div className="col-6">
                            <select
                              className="formItem"
                              // {...register("strategy")}
                              id="selectFormRow"
                            >
                              <option value="enterprise">Outbound</option>
                              <option value="sequence">Trunk</option>
                            </select>
                          </div>
                        </div>
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label>Status</label>
                            <label htmlFor="data" className="formItemDesc">
                          
                            </label>
                          </div>
                          <div className="col-6">
                            <input type="text" className="formItem" />
                          </div>
                        </div>

                        <div className=" col-xl-6">
                          <div>
                            <label>Call schedule</label>
                            <span className="text-danger">*</span>
                          </div>
                          <div className="formRow  justify-content-start">
                            <div className="formLabel me-4">
                              <div className="formLabel">
                                <label>Start Days : </label>
                                <input type="text" className="formItem" />
                              </div>
                              <div className="formLabel">
                                <label className="">End Day : </label>
                                <input type="text" className="formItem" />
                              </div>
                            </div>
                            <div className="formLabel">
                              <div className="">
                                <div className="formLabel">
                                  <label>Start time : </label>
                                  <input type="text" className="formItem" />
                                </div>
                                <div className="formLabel">
                                  <label className="">End Time : </label>
                                  <input type="text" className="formItem" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label>Active hours</label>
                            <span className="text-danger">*</span>
                            <div className="d-flex align-items-center justify-content-between mt-3">
                              <div>
                                <input type="radio" className="me-2" />
                                <label>Active hours</label>
                              </div>
                              <div>
                                <input type="radio" className="ms-3" />
                                <label className="ms-1">Set time</label>
                              </div>
                            </div>
                          </div>
                          <div className="col-6">
                            {" "}
                            <div className="formLabel">
                              <label>Status</label>
                              <span className="text-danger">*</span>
                              <div className="d-flex align-items-center">
                                <div className="formLabel py-0 me-2">
                                  <label for="selectFormRow">Enabled</label>
                                </div>
                                <div className="my-auto position-relative mx-1">
                                  <label className="switch">
                                    <input type="checkbox" id="showAllCheck" />
                                    <span className="slider round" />
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
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

export default BuyersEdit