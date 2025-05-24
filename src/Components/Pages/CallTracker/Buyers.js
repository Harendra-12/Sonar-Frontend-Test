import React from "react";
import PaginationComponent from "../../CommonComponents/PaginationComponent";
import Header from "../../CommonComponents/Header";
import { useNavigate } from "react-router-dom";

function Buyers() {
  const navigate = useNavigate();
  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid">
            <div className="row">
              <Header title="Buyers" />
              <div className="overviewTableWrapper">
                <div className="overviewTableChild">
                  <div className="d-flex flex-wrap">
                    <div className="col-12">
                      <div className="heading">
                        <div className="content">
                          <h4> All Buyers </h4>
                          <p>You can see all list of all buyers</p>
                        </div>
                        <div className="buttonGroup">
                          <button effect="ripple" className="panelButton gray">
                            <span className="text">Back</span>
                            <span className="icon">
                              <i className="fa-solid fa-caret-left"></i>
                            </span>
                          </button>
                          <button
                            onClick={() => navigate("/buyer-add")}
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
                      style={{ overflow: "auto", padding: "10px 20px 0" }}
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
                              <th>Buyer name</th>
                              <th>Phone Number</th>
                              <th>Alt Phone Number</th>
                              <th>Email</th>
                              <th>Address</th>
                              <th>City</th>
                              <th>State</th>
                              <th>Province</th>
                              <th>Postal code</th>
                              <th>Country code</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Rishabh maurya01</td>
                              <td>97814569314</td>
                              <td>45984566633</td>
                              <td>rishabh@gmail.com</td>
                              <td>Delhi</td>
                              <td>Delhi</td>
                              <td>Okhla</td>
                              <td>NA</td>
                              <td>4578</td>
                              <td>91</td>
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

export default Buyers;
