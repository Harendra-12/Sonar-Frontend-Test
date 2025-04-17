import React from "react";
import Header from "../../../CommonComponents/Header";
import { useNavigate } from "react-router-dom";
import { backToTop } from "../../../GlobalFunction/globalFunction";

function LeadAdd() {
  const navigate = useNavigate();
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
                        <h4>Lead Add</h4>
                        <p>Add A new Lead</p>
                      </div>
                      <div className="buttonGroup">
                        <div className="d-flex align-items-center">
                          <div className="formLabel py-0 me-2">
                            <label for="selectFormRow">Enabled</label>
                          </div>
                          <div className="my-auto position-relative mx-1">
                            {/* <label className="switch">
                              <input type="checkbox" id="showAllCheck" />
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
                    <form className="mb-0">
                      <div className="formRow col-xl-6">
                        <div className="formLabel">
                          <label>Lead File</label>
                        </div>
                        <div className="col-6">
                          <input type="file" className="formItem" />
                        </div>
                      </div>
                      <div className="formRow col-xl-6">
                        <div className="formLabel">
                          <label>Lead Name</label>
                        </div>
                        <div className="col-6">
                          <input type="text" className="formItem" />
                        </div>
                      </div>
                      <div className="formRow col-xl-6">
                        <div className="formLabel">
                          <label>Lead Description</label>
                        </div>
                        <div className="col-6">
                          <input type="text" className="formItem" />
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
  );
}

export default LeadAdd;
