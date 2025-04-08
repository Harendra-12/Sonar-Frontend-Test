import React from "react";
import PaginationComponent from "../../CommonComponents/PaginationComponent";
import Header from "../../CommonComponents/Header";

function Source() {
  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid">
            <div className="row">
              <Header title="Source" />
              <div className="overviewTableWrapper">
                <div className="overviewTableChild">
                  <div className="d-flex flex-wrap">
                    <div className="col-12">
                      <div className="heading">
                        <div className="content">
                          <h4>Source</h4>
                          <p>You can see all list of Source groups</p>
                        </div>
                        <div className="buttonGroup">
                          <button effect="ripple" className="panelButton gray">
                            <span className="text">Back</span>
                            <span className="icon">
                              <i className="fa-solid fa-caret-left"></i>
                            </span>
                          </button>
                          <button
                            
                            // effect="ripple"
                            className="panelButton"
                            style={{ cursor: "not-allowed" }}
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
                      style={{ overflow: "auto", padding: "25px 20px 0" }}
                    >
                      <div className="tableHeader">
                        <div className="showEntries">
                          <label>Show</label>
                          <select
                            className="formItem"
                            // value={itemsPerPage}
                            // onChange={(e) => {
                            //     setItemsPerPage(e.target.value);
                            // }}
                          >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={30}>30</option>
                          </select>
                          <label>entries</label>
                        </div>
                        <div className="searchBox position-relative">
                          <label>Search:</label>
                          <input
                            type="text"
                            name="Search"
                            placeholder="Search"
                            // value={searchValue}
                            className="formItem"
                            // onChange={(e) => setSearchValue(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="tableContainer">
                        <table>
                          <thead>
                            <tr>
                              <th>
                                <div>
                                  <input type="checkbox" />
                                </div>
                              </th>
                              <th>
                                <div className="d-flex align-items-center justify-content-start">
                                  <div className="ms-2 me-2">
                                    <i class="fa-regular fa-gear"></i>
                                  </div>
                                  <div>Lead</div>
                                </div>
                              </th>
                              <th>Stage</th>
                              <th>Customer Journey</th>
                              <th>Source</th>
                              <th>Created </th>
                              <th>Created by </th>
                              <th>Responsible </th>
                              <th>Edit</th>
                              <th>Delete</th>

                              <th>Client</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <div>
                                  <input type="checkbox" />
                                </div>
                              </td>
                              <td>
                                <div className="d-flex  justify-content-start">
                                  <div className="ms-2 me-2">
                                    <i class="fa-solid fa-bars"></i>
                                  </div>
                                  <div>
                                    <div className="d-flex align-items-center justify-content-start">
                                      <progress id="file" value="1" max="100">
                                        {" "}
                                        32%{" "}
                                      </progress>
                                      <div
                                        className=""
                                        style={{ fontStyle: "italic" }}
                                      >
                                        {/* <p className="m-0 p-0">Call</p> */}
                                        <span className="ms-3">
                                          -incoming call
                                        </span>
                                      </div>
                                    </div>

                                    <div className="d-flex align-items-center justify-content-start ">
                                      <div>Advertising</div>
                                      <i class="fa-solid px-1 fa-circle-info"></i>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <progress id="file" value="32" max="100">
                                    {" "}
                                    32%{" "}
                                  </progress>
                                </div>
                                <span>Unassigned</span>
                              </td>

                              <td>
                                <div className="d-flex align-items-center justify-content-start">
                                  <div className="me-2">
                                    <i class="fa-brands fa-facebook"></i>
                                  </div>
                                  <div className="me-2">facebook</div>
                                  <div className="me-2">
                                    <i class="fa-solid fa-chevron-right"></i>
                                  </div>
                                  <div className="me-2">Call</div>
                                </div>
                              </td>
                              <td>Advertising</td>
                              <td>
                                <p className="m-0 p-0 ">6 minute ago</p>
                              </td>
                              <td>
                                <div>
                                  <h6 className="m-0 p-0">Rishabh Maurya</h6>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <h6 className="m-0 p-0">Vivek negi</h6>
                                </div>
                              </td>
                              <td>
                                <button className="tableButton edit ms-3">
                                  <i className="fa-solid fa-pencil" />
                                </button>
                              </td>
                              <td>
                                <button className="tableButton delete ms-3">
                                  <i className="fa-solid fa-trash" />
                                </button>
                              </td>
                              <td>
                                <div>
                                  <div className="d-flex align-items-center justify-content-start">
                                    <span>Webvio pvt ltd</span>
                                    <button className="tableButton edit ms-3">
                                      <i className="fa-solid fa-eye" />
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div>
                                  <input type="checkbox" />
                                </div>
                              </td>
                              <td>
                                <div className="d-flex  justify-content-start">
                                  <div className="ms-2 me-2">
                                    <i class="fa-solid fa-bars"></i>
                                  </div>
                                  <div>
                                    <div className="d-flex align-items-center justify-content-start">
                                      <progress id="file" value="1" max="100">
                                        {" "}
                                        32%{" "}
                                      </progress>
                                      <div
                                        className=""
                                        style={{ fontStyle: "italic" }}
                                      >
                                        {/* <p className="m-0 p-0">Call</p> */}
                                        <span className="ms-3">
                                          -incoming call
                                        </span>
                                      </div>
                                    </div>

                                    <div className="d-flex align-items-center justify-content-start ">
                                      <div>Advertising</div>
                                      <i class="fa-solid px-1 fa-circle-info"></i>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <progress id="file" value="32" max="100">
                                    {" "}
                                    32%{" "}
                                  </progress>
                                </div>
                                <span>Unassigned</span>
                              </td>

                              <td>
                                <div className="d-flex align-items-center justify-content-start">
                                  <div className="me-2">
                                    <i class="fa-brands fa-whatsapp"></i>
                                  </div>
                                  <div className="me-2">WhatsApp</div>
                                  <div className="me-2">
                                    <i class="fa-solid fa-chevron-right"></i>
                                  </div>
                                  <div className="me-2">Call</div>
                                </div>
                              </td>
                              <td>Call</td>
                              <td>
                                <p className="m-0 p-0 ">2 Days</p>
                              </td>
                              <td>
                                <div>
                                  <h6 className="m-0 p-0">Rishabh Maurya</h6>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <h6 className="m-0 p-0">Vivek negi</h6>
                                </div>
                              </td>
                              <td>
                                <button className="tableButton edit ms-3">
                                  <i className="fa-solid fa-pencil" />
                                </button>
                              </td>
                              <td>
                                <button className="tableButton delete ms-3">
                                  <i className="fa-solid fa-trash" />
                                </button>
                              </td>

                              <td>
                                <div>
                                  <div className="d-flex align-items-center justify-content-start">
                                    <span>Webvio pvt ltd</span>
                                    <button className="tableButton edit ms-3">
                                      <i className="fa-solid fa-eye" />
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>

                            <tr>
                              <td>
                                <div>
                                  <input type="checkbox" />
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center justify-content-start">
                                  <div className="ms-2 me-2">
                                    <i class="fa-solid fa-bars"></i>
                                  </div>
                                  <div>
                                    <h6 className="m-0 p-0">lead #187</h6>
                                    <div>
                                      {/* <p className="m-0 p-0">Call</p> */}
                                      <span>Repeat Lead</span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <progress id="file" value="45" max="100">
                                    {" "}
                                    32%{" "}
                                  </progress>
                                </div>
                                <span>Meeting</span>
                              </td>

                              <td>
                                <div className="d-flex align-items-center justify-content-start">
                                  <div className="me-2">
                                    <i class="fa-brands fa-google"></i>
                                  </div>
                                  <div className="me-2">Google</div>
                                  <div className="me-2">
                                    <i class="fa-solid fa-chevron-right"></i>
                                  </div>
                                  <div className="me-2">Call</div>
                                </div>
                              </td>
                              <td>Call</td>
                              <td>
                                <p className="m-0 p-0 ">40 minute ago</p>
                              </td>
                              <td>
                                <div>
                                  <h6 className="m-0 p-0">Rishabh Maurya</h6>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <h6 className="m-0 p-0">Vivek negi</h6>
                                </div>
                              </td>
                              <td>
                                <button className="tableButton edit ms-3">
                                  <i className="fa-solid fa-pencil" />
                                </button>
                              </td>
                              <td>
                                <button className="tableButton delete ms-3">
                                  <i className="fa-solid fa-trash" />
                                </button>
                              </td>
                              <td>
                                <div>
                                  <div className="d-flex align-items-center justify-content-start">
                                    <span>Webvio pvt ltd</span>
                                    <button className="tableButton edit ms-3">
                                      <i className="fa-solid fa-eye" />
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="tableHeader mb-3">
                        <PaginationComponent
                        // pageNumber={(e) => setPageNumber(e)}
                        // totalPage={ringGroup.last_page}
                        // from={ringGroup.from}
                        // to={ringGroup.to}
                        // total={ringGroup.total}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Source;
