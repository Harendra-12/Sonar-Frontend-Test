import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { backToTop } from "../../GlobalFunction/globalFunction";
import Header from "../../CommonComponents/Header";

function FportalCampaign() {
  const [refreshState, setRefreshState] = useState();
  const handleRefreshBtnClicked = () => {

  }
  return (
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
                        <h4>Forwarding portal {" "}
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
                        <p>You can see all list of Forwarding portal</p>
                      </div>
                      <div className="buttonGroup">
                        <button effect="ripple" className="panelButton gray">
                          <span className="text">Back</span>
                          <span className="icon">
                            <i className="fa-solid fa-caret-left"></i>
                          </span>
                        </button>
                        <button
                          onClick={() => Navigate("/buyer-add")}
                          effect="ripple"
                          className="panelButton"
                        >
                          <span className="text">Add</span>
                          <span className="icon">
                            <i className="fa-solid fa-plus"></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-12"
                    style={{ overflow: "auto", padding: "25px 20px 0px" }}
                  >
                    <div className="tableHeader">
                      <div className="showEntries">
                        <label>Show</label>
                        <select className="formItem">
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={30}>30</option>
                        </select>
                        <label>entries</label>
                      </div>
                      <div className="searchBox">
                        <label>Search:</label>
                        <input type="text" className="formItem" defaultValue="" />
                      </div>
                    </div>
                    <div className="tableContainer">
                      <table>
                        <thead>
                          <tr>
                            <th>Status</th>
                            <th>Name</th>
                            <th>Mode</th>
                            <th>DID(s)</th>
                            <th>Gateway</th>
                            <th>Progress</th>
                            <th>Agents</th>
                            <th>Records</th>
                            <th>Options</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <div className="d-flex align-items-center justify-content-start ">
                                <div className="phone-call">
                                  <i className="fa-solid fa-pause" />
                                </div>
                                <div>
                                  <span className="ms-1">Paused</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <b>asdasd</b>
                            </td>
                            <td>preview</td>
                            <td>1</td>
                            <td>Gateway</td>
                            <td className="">
                              <div
                                className="specialProgressWrap"
                                style={{ cursor: "pointer" }}
                              >
                                <div className="specialProgress">
                                  <div
                                    className="segment success"
                                    style={{ width: "85%" }}
                                  />
                                  <div
                                    className="segment fail"
                                    style={{ width: "5%" }}
                                  />
                                  <div
                                    className="segment pending"
                                    style={{ width: "10%" }}
                                  />
                                </div>
                                <div className="specialProgressText">
                                  <p>0.00%</p>
                                  <span>0 of 1000</span>
                                </div>
                                {/* <div className="specialProgressWrapDetails">
                                <div className="d-flex align-items-center justify-content-start mb-1">
                                  <p
                                    style={{
                                      fontSize: 12,
                                      fontWeight: 500,
                                      marginBottom: 0
                                    }}
                                  >
                                    LEADS IN TOTAL
                                  </p>
                                  <span className="test-demos ms-2">1000</span>
                                </div>
                                <ul>
                                  <li>
                                    <p
                                      className="p-0 m-0"
                                      style={{
                                        color: "rgb(92, 92, 92)",
                                        fontSize: 12,
                                        fontWeight: 400
                                      }}
                                    >
                                      Completed records
                                    </p>
                                    <div className="specialProgressWrap">
                                      <div className="specialProgress">
                                        <div
                                          className="segment success"
                                          style={{ width: "85%" }}
                                        />
                                        <div
                                          className="segment fail"
                                          style={{ width: "5%" }}
                                        />
                                        <div
                                          className="segment pending"
                                          style={{ width: "10%" }}
                                        />
                                      </div>
                                      <div className="specialProgressText">
                                        <p>0.00%</p>
                                        <span>0</span>
                                      </div>
                                    </div>
                                  </li>
                                  <li>
                                    <p
                                      className="p-0 m-0"
                                      style={{
                                        color: "rgb(92, 92, 92)",
                                        fontSize: 12,
                                        fontWeight: 400
                                      }}
                                    >
                                      Failed records
                                    </p>
                                    <div className="specialProgressWrap">
                                      <div className="specialProgress">
                                        <div
                                          className="segment success"
                                          style={{ width: "85%" }}
                                        />
                                        <div
                                          className="segment fail"
                                          style={{ width: "5%" }}
                                        />
                                        <div
                                          className="segment pending"
                                          style={{ width: "10%" }}
                                        />
                                      </div>
                                      <div className="specialProgressText">
                                        <p>0.00%</p>
                                        <span>0</span>
                                      </div>
                                    </div>
                                  </li>
                                  <li>
                                    <p
                                      className="p-0 m-0"
                                      style={{
                                        color: "rgb(92, 92, 92)",
                                        fontSize: 12,
                                        fontWeight: 400
                                      }}
                                    >
                                      Untouched records
                                    </p>
                                    <div className="specialProgressWrap">
                                      <div className="specialProgress">
                                        <div
                                          className="segment success"
                                          style={{ width: "85%" }}
                                        />
                                        <div
                                          className="segment fail"
                                          style={{ width: "5%" }}
                                        />
                                        <div
                                          className="segment pending"
                                          style={{ width: "10%" }}
                                        />
                                      </div>
                                      <div className="specialProgressText">
                                        <p>0.00%</p>
                                        <span>0</span>
                                      </div>
                                    </div>
                                  </li>
                                </ul>
                              </div> */}
                              </div>
                            </td>
                            <td>
                              <div>
                                <div className="avatar-container" />
                              </div>
                            </td>
                            <td>
                              <span className="ellipsis">CustomerList.xls</span>
                            </td>
                            <td>
                              <div className="dropdown">
                                <div
                                  className="tableButton"
                                  href="#"
                                  role="button"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="fa-solid fa-ellipsis-vertical" />
                                </div>
                                <ul
                                  className="dropdown-menu actionBtnDropdowns"
                                  style={{}}
                                >
                                  <li className="dropdown-item">
                                    <div className="clearButton text-align-start">
                                      <i className="fa-regular fa-circle-stop me-2" />{" "}
                                      Stop
                                    </div>
                                  </li>
                                  <li className="dropdown-item">
                                    <div className="clearButton text-align-start">
                                      <i className="fa-regular fa-circle-play me-2" />{" "}
                                      Start
                                    </div>
                                  </li>
                                  <li className="dropdown-item">
                                    <div className="clearButton text-align-start">
                                      <i className="fa-regular fa-pen me-2" /> Edit
                                    </div>
                                  </li>
                                  <li className="dropdown-item">
                                    <div className="clearButton text-align-start">
                                      <i className="fa-regular fa-clock me-2" />{" "}
                                      Schedule
                                    </div>
                                  </li>
                                  <li className="dropdown-item">
                                    <div className="clearButton text-align-start">
                                      <i className="fa-regular fa-trash me-2" />{" "}
                                      Delete
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="tableHeader mb-3">
                      <label
                        className="col-6"
                        style={{
                          fontFamily: "Roboto",
                          color: "var(--color-subtext)",
                          fontWeight: 500,
                          fontSize: 14,
                        }}
                      >
                        Showing 1 to 1 of 1 Entries.
                      </label>
                      {/* <nav
                      aria-label="pagination navigation"
                      className="MuiPagination-root MuiPagination-text pagination_slider col-6 justify-content-end css-1oj2twp-MuiPagination-root"
                    >
                      <ul className="MuiPagination-ul css-wjh20t-MuiPagination-ul">
                        <li>
                          <button
                            className="MuiButtonBase-root Mui-disabled MuiPaginationItem-root MuiPaginationItem-sizeMedium MuiPaginationItem-text MuiPaginationItem-circular MuiPaginationItem-colorPrimary MuiPaginationItem-textPrimary Mui-disabled MuiPaginationItem-previousNext css-1to7aaw-MuiButtonBase-root-MuiPaginationItem-root"
                            tabIndex={-1}
                            type="button"
                            disabled=""
                            aria-label="Go to previous page"
                          >
                            <svg
                              className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiPaginationItem-icon css-g2z002-MuiSvgIcon-root-MuiPaginationItem-icon"
                              focusable="false"
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              data-testid="NavigateBeforeIcon"
                            >
                              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                            </svg>
                          </button>
                        </li>
                        <li>
                          <button
                            className="MuiButtonBase-root MuiPaginationItem-root MuiPaginationItem-sizeMedium MuiPaginationItem-text MuiPaginationItem-circular MuiPaginationItem-colorPrimary MuiPaginationItem-textPrimary Mui-selected MuiPaginationItem-page css-1to7aaw-MuiButtonBase-root-MuiPaginationItem-root"
                            tabIndex={0}
                            type="button"
                            aria-current="true"
                            aria-label="page 1"
                          >
                            1
                            <span className="MuiTouchRipple-root css-8je8zh-MuiTouchRipple-root" />
                          </button>
                        </li>
                        <li>
                          <button
                            className="MuiButtonBase-root Mui-disabled MuiPaginationItem-root MuiPaginationItem-sizeMedium MuiPaginationItem-text MuiPaginationItem-circular MuiPaginationItem-colorPrimary MuiPaginationItem-textPrimary Mui-disabled MuiPaginationItem-previousNext css-1to7aaw-MuiButtonBase-root-MuiPaginationItem-root"
                            tabIndex={-1}
                            type="button"
                            disabled=""
                            aria-label="Go to next page"
                          >
                            <svg
                              className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiPaginationItem-icon css-g2z002-MuiSvgIcon-root-MuiPaginationItem-icon"
                              focusable="false"
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              data-testid="NavigateNextIcon"
                            >
                              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                            </svg>
                          </button>
                        </li>
                      </ul>
                    </nav> */}
                    </div>
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

export default FportalCampaign;
