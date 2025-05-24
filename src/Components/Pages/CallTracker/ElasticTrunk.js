import React from 'react'
import PaginationComponent from '../../CommonComponents/PaginationComponent'
import { Navigate } from 'react-router-dom'
import Header from '../../CommonComponents/Header'
function ElasticTrunk() {
  return (
    <>
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row">
            <Header title="Elastic Trunk" />
            <div className="overviewTableWrapper">
              <div className="overviewTableChild">
                <div className="d-flex flex-wrap">
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
                        <h4>Elastic Trunk portal</h4>
                        <p>You can see all list of Elastic Trunk portal</p>
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
                  <div  className="col-12"
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
                            <th>Description</th>
                            <th>Channel</th>
                            <th>Status</th>
                            <th>Caller ID </th>
                            <th>Emergency Location</th>

                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Rishabh maurya</td>
                            <td>Outbound</td>
                            <td>On off</td>
                            <td>10111</td>
                            <td>974586235</td>

                        
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
  )
}

export default ElasticTrunk