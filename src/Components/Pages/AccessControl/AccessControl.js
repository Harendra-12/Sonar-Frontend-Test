import React from "react";
import Header from "../../CommonComponents/Header";
import { Link } from "react-router-dom";

function AccessControl() {
  return (
    <>
      <div className="mainContent">
        <section id="phonePage">
          <div className="container-fluid">
            <div className="row">
              <Header title="Access Control List" />
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
                          <p>You can see all list of access control</p>
                        </div>
                        <div className="buttonGroup">
                          <button effect="ripple" className="panelButton gray">
                            <span className="text">Back</span>
                            <span className="icon">
                              <i className="fa-solid fa-caret-left"></i>
                            </span>
                          </button>
                          {/* {checkViewSidebar(
                      "Ringgroup",
                      slugPermissions,
                      account?.permissions,
                      "add"
                    ) ? ( */}
                          <Link
                            to="/access-control-list-add"
                            // onClick={backToTop}
                            // onClick={handleRingGroupAddValidation}
                            effect="ripple"
                            className="panelButton"
                          >
                            <span className="text">Add</span>
                            <span className="icon">
                              <i className="fa-solid fa-plus"></i>
                            </span>
                          </Link>
                          {/* ) : ( */}
                          {/* <button
                        disabled
                        // onClick={handleRingGroupAddValidation}
                        effect="ripple"
                        className="panelButton"
                        style={{ cursor: "not-allowed" }}
                      >
                        <span className="text">Add</span>
                        <span className="icon">
                          <i className="fa-solid fa-plus"></i>
                        </span>
                      </button> */}
                          {/* )} */}
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-12"
                      style={{ overflow: "auto", padding: "10px 20px 0px" }}
                    >
                      <div className="tableContainer">
                        <div className="utilPopup" />
                        <div className="utilPopup" />
                        <table>
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>List</th>
                              <th className="text-center">Edit</th>
                              <th className="text-center">Delete</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>123</td>
                              <td>
                                <div className="hover-dropdown ">
                                  <div
                                    type="button"
                                    data-bs-toggle="hover-dropdown "
                                    aria-expanded="false"
                                    style={{ color: "var(--ui-accent)" }}
                                  >
                                    <div className="avatar-container">
                                      <i className="fa-light fa-user" />
                                      <img
                                        alt="profile"
                                        src="https://ucaas-angelpbx.s3.us-east-2.amazonaws.com/abin.11.webvio.in/profile/1744952835_rishabh.png"
                                      />
                                      <i className="fa-light fa-user" />
                                      <i className="fa-light fa-user" />
                                      <span>+9</span>
                                    </div>
                                  </div>
                                  
                                </div>
                              </td>
                              <td>
                                <button className="tableButton edit mx-auto">
                                  <i className="fa-solid fa-pencil" />
                                </button>
                              </td>
                              <td>
                                <button className="tableButton delete mx-auto">
                                  <i className="fa-solid fa-trash" />
                                </button>
                              </td>
                            </tr>
                            <tr>
                              <td>test</td>
                              <td>
                                <div className="hover-dropdown ">
                                  <div
                                    type="button"
                                    data-bs-toggle="hover-dropdown "
                                    aria-expanded="false"
                                    style={{ color: "var(--ui-accent)" }}
                                  >
                                    <div className="avatar-container">
                                      <i className="fa-light fa-user" />
                                      <i className="fa-light fa-user" />
                                      <img
                                        alt="profile"
                                        src="https://ucaas-angelpbx.s3.us-east-2.amazonaws.com/abin.11.webvio.in/profile/1744952835_rishabh.png"
                                      />
                                      <i className="fa-light fa-user" />
                                      <span>+9</span>
                                    </div>
                                  </div>
                                
                                </div>
                              </td>
                              <td>
                                <button className="tableButton edit mx-auto">
                                  <i className="fa-solid fa-pencil" />
                                </button>
                              </td>
                              <td>
                                <button className="tableButton delete mx-auto">
                                  <i className="fa-solid fa-trash" />
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
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

export default AccessControl;
