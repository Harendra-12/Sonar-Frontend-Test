import React from "react";
import Header from "../../CommonComponents/Header";
import { Link } from "react-router-dom";

function AccessControlAdd() {
  return (
    <>
      <div className="mainContent">
        <section id="phonePage">
          <div className="container-fluid">
            <div className="row">
              <Header title="Access List" />
              <div className="overviewTableWrapper">
                <div className="overviewTableChild">
                  <div className="d-flex flex-wrap">
                    <div className="col-12">
                      <div className="heading">
                        <div className="content">
                          <h4>
                            Access Control
                            <button className="clearButton">
                              {/* <i
                          className={
                            loading
                              ? "fa-regular fa-arrows-rotate fs-5 fa-spin"
                              : "fa-regular fa-arrows-rotate fs-5"
                          }
                        ></i> */}
                            </button>
                          </h4>
                          <p>You can see all list of Access Control</p>
                        </div>
                        <div className="buttonGroup">
                          <button effect="ripple" className="panelButton gray">
                            <span className="text">Back</span>
                            <span className="icon">
                              <i className="fa-solid fa-caret-left"></i>
                            </span>
                          </button>

                          <Link
                            to="/groups-add"
                            effect="ripple"
                            className="panelButton"
                          >
                            <span className="text">Save</span>
                            <span className="icon">
                              <i className="fa-solid fa-floppy-disk"></i>
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-xl-6"
                      style={{
                        padding: "25px 23px",
                        borderBottom: "1px solid rgb(221, 221, 221)",
                      }}
                    >
                      <form className="row mb-0">
                        <div className="formRow col-xl-12">
                          <div className="formLabel">
                            <label htmlFor="">
                              Name <span className="text-danger">*</span>
                            </label>
                            <label htmlFor="data" className="formItemDesc">
                              Enter a name.
                            </label>
                          </div>
                          <div className="col-6">
                            <input
                              type="text"
                              name="name"
                              className="formItem"
                            />
                          </div>
                        </div>

                        <div className="formRow col-xl-12 ">
                          <div className="formLabel">
                            <label htmlFor="">IP Address</label>
                          </div>
                          <div className="col-6">
                            <input
                              type="text"
                              name="description"
                              className="formItem"
                            />
                          </div>
                        </div>
                        <div className="formRow col-xl-12 ">
                          <div className="formLabel">
                            <label htmlFor="">Default</label>
                          </div>
                          <div className="col-6">
                            <input
                              type="text"
                              name="description"
                              className="formItem"
                            />
                          </div>
                        </div>
                        <div className="formRow col-xl-12 ">
                          <div className="formLabel">
                            <label htmlFor="">Description</label>
                          </div>
                          <div className="col-6">
                            <input
                              type="text"
                              name="description"
                              className="formItem"
                            />
                          </div>
                        </div>
                        <div className="formRow col-xl-12 ">
                          <div className="formLabel">
                            <label htmlFor="">Group Name</label>
                          </div>
                          <div className="col-6">
                            {" "}
                            <select className="formItem" name="role_id">
                              <option value="" disabled="" selected="">
                                Choose Type
                              </option>
                              <option value={68}>Admin</option>
                              <option value={69}>Manager</option>
                              <option value={70}>Agent</option>
                              <option value={71}>Retention</option>
                              <option value={72}>Billing</option>
                              <option value={73}>
                                All access with upcoming fetaure
                              </option>
                            </select>
                          </div>
                        </div>
                        <div className="formRow col-xl-12">
                          <div className="formLabel">
                            <label htmlFor="selectFormRow">Nodes</label>
                            <label htmlFor="data" className="formItemDesc">
                              Select the status of Node
                            </label>
                          </div>
                        </div>
                        <div className=" col-xl-12">
                          <div className="formRow">
                            <div className="col-3 " style={{ width: "21.3%" }}>
                              <div className="formLabel">
                                <label className="formItemDesc">Type</label>
                              </div>
                              <input
                                type="number"
                                name="name"
                                className="formItem"
                              />
                            </div>
                            <div className="col-3 " style={{ width: "12%" }}
                            >
                              <div className="formLabel">
                                <label className="formItemDesc">CDR </label>
                              </div>
                              <input
                                type="text"
                                name="stick_agent_expires"
                                className="formItem"
                              />
                            </div>
                            <div className="col-3" style={{ width: "21.3%" }}>
                              <div className="formLabel">
                                <label className="formItemDesc">
                                  Description
                                </label>
                              </div>
                              <input
                                type="text"
                                name="stick_agent_expires"
                                className="formItem"
                              />
                            </div>
                            <div className="col-3 mt-4" style={{ width: "7.3%" }}>
                              <button className="tableButton delete mx-auto">
                                <i className="fa-solid fa-trash" />
                              </button>
                            </div>
                            <div className="col-3 mt-4" style={{ width: "19.3%" }}>
                              <button className="panelButton">
                                <span className="text">Add</span>
                                <span className="icon">
                                  <i className="fa-solid fa-plus"></i>
                                </span>
                              </button>
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
      </div>
    </>
  );
}

export default AccessControlAdd;
