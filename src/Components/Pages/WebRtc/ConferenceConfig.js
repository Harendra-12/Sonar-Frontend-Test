import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";

const ConferenceConfig = () => {

  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid px-0">
          <Header title="Update Extension" />
        </div>
        <div className="col-xl-12">
          {/* {loading ? (
            <div colSpan={99}>
              <CircularLoader />
            </div>
          ) : (
            ""
          )} */}
          <div className="overviewTableWrapper">
            <div className="overviewTableChild">
              <div className="d-flex flex-wrap">
                <div className="col-12">
                  <div className="heading">
                    <div className="content">
                      <h4>Update Extension</h4>
                      <p>An extension is a destinations that can be called.</p>
                    </div>
                    <div className="buttonGroup">
                      <button
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
                <div
                  className="col-12"
                  style={{
                    padding: "25px 23px",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  <form action="#" className="tangoNavs">
                    <nav>
                      <div class="nav nav-tabs" id="nav-tab" role="tablist">
                        <button
                          class="nav-link active"
                          id="nav-gen-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#nav-gen"
                          type="button"
                          role="tab"
                          aria-controls="nav-gen"
                          aria-selected="true"
                        >
                          Create
                        </button>
                        <button
                          class="nav-link"
                          id="nav-voicemail-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#nav-voicemail"
                          type="button"
                          role="tab"
                          aria-controls="nav-voicemail"
                          aria-selected="false"
                        >
                          Join
                        </button>
                      </div>
                    </nav>
                    <div class="tab-content" id="nav-tabContent">
                      <div
                        class="tab-pane fade show active"
                        id="nav-gen"
                        role="tabpanel"
                        aria-labelledby="nav-gen-tab"
                        tabindex="0"
                      >
                        <form className="row col-12 mx-auto">
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="">Extension</label>
                              <label htmlFor="data" className="formItemDesc">
                                Enter the alphanumeric extension. The default
                                configuration allows 2 - 15 digit extensions.
                              </label>
                            </div>
                            <div className="col-xl-6 col-12">
                              <input
                                type="text"
                                name="extension"
                                className="formItem"
                              />
                            </div>
                          </div>
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="">Password</label>
                              <label htmlFor="data" className="formItemDesc">
                                Password length must be atleast 4 character
                              </label>
                            </div>
                            <div className="col-xl-6 col-12">
                              <input
                                type="text"
                                name="extension"
                                className="formItem"
                              />
                            </div>
                          </div>
                        </form>
                      </div>
                      <div
                        class="tab-pane fade"
                        id="nav-voicemail"
                        role="tabpanel"
                        aria-labelledby="nav-voicemail-tab"
                        tabindex="0"
                      >
                        <form className="row col-12 mx-auto">
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="">Voicemail Password</label>
                              <label htmlFor="data" className="formItemDesc">
                                Enter the numeric voicemail password here.
                              </label>
                            </div>
                            <div className="col-xl-6 col-12">
                              <input
                                type="text"
                                name="extension"
                                className="formItem"
                              />
                            </div>
                          </div>
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="selectFormRow">
                                Voicemail Enabled
                              </label>
                              <label htmlFor="data" className="formItemDesc">
                                Enable/disable voicemail for this extension.
                              </label>
                            </div>
                            <div className="col-xl-6 col-12">
                              <input
                                type="text"
                                name="extension"
                                className="formItem"
                              />
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ConferenceConfig;
