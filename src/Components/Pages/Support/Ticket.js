import React, { useState } from 'react'
import Header from '../../CommonComponents/Header'
import { useNavigate } from 'react-router-dom'


function Ticket() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = () => {
    navigate('/view-massage')
  }
  const openPopup = () => {
    setIsOpen(true);
  };

  const closePopupAndPage = () => {
    setIsOpen(false);
  };


  return (
    <>
      <main className='mainContent'>
        <section className="campaignPage">
          <div className="container-fluid">
            <div className="row">
              <Header title="Dialer" />
              <div className='overviewTableWrapper'>
                <div className='overviewTableChild'>
                  <div className='d-flex flex-wrap'>
                    <div className="col-12">
                      <div className="heading">
                        <div className="content">
                          <h4>Ticket</h4>
                          <p>You can Create ticket of users </p>
                        </div>
                        <div className="buttonGroup">
                          <button className="panelButton gray" >
                            <span className="text">Back</span>
                            <span className="icon"><i className="fa-solid fa-caret-left"></i></span>
                          </button>
                          <button className="panelButton" onClick={openPopup}>
                            <span className="text">Create</span>
                            <span className="icon"><i className="fa-solid fa-plus"></i></span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className='col-12' style={{ overflow: 'auto', padding: '25px 20px 0px' }}>
                      <nav className="tangoNavs">
                        <div className="nav nav-tabs" id="nav-tab" role="tablist">
                          <button
                            className="nav-link active"
                            id="nav-user-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-user"
                            type="button"
                            role="tab"
                            aria-controls="nav-user"
                            aria-selected="true"
                          >
                            Open Ticket
                          </button>
                          <button
                            className="nav-link"
                            id="nav-exten-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-exten"
                            type="button"
                            role="tab"
                            aria-controls="nav-exten"
                            aria-selected="false"
                          >
                            Close Ticket
                          </button>
                        </div>
                      </nav>
                      <div
                        className="tab-content"
                        id="nav-tabContent"
                        style={{
                          border: "1px solid var(--border-color)",
                          borderTop: "none",
                          borderRadius: "0 0 5px 5px",
                        }} >

                        <div
                          className="tab-pane fade show active"
                          id="nav-user"
                          role="tabpanel"
                          aria-labelledby="nav-user-tab"
                          tabindex="0" >

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
                                //   setItemsPerPage(e.target.value);
                                // }}
                                >
                                  <option value={10}>10</option>
                                  <option value={20}>20</option>
                                  <option value={30}>30</option>
                                </select>
                                <label>entries</label>
                              </div>

                              <div className="searchBox">
                                <label>Search:</label>
                                <input
                                  type="search"
                                  className="formItem"
                                // value={searchValue}

                                />
                              </div>
                            </div>
                            <div className="tableContainer">
                              <table>
                                <thead>
                                  <tr>
                                    <th>#</th>
                                    <th>TimeStamp</th>
                                    <th>UserName</th>
                                    <th>Email</th>
                                    <th>Subject</th>
                                    <th>Status</th>
                                    <th>View massage</th>
                                    <th>Close Ticket</th>


                                  </tr>
                                </thead>
                                <tbody>
                                  {/* {loading ? (
                                    <SkeletonTableLoader col={3} row={15} />
                                  ) : ( */}
                                  <>

                                    <tr >
                                      <td>1</td>
                                      <td>1/10/2025</td>
                                      <td>Rishabh Maurya</td>
                                      <td>rishabhmaurya@gmail.com</td>
                                      <td>Support</td>
                                      <td>
                                        <div>
                                          <label className="tableLabel success">Open</label>
                                        </div>
                                      </td>
                                      <td><div className=''>
                                        <button
                                          className="tableButton edit" onClick={handleSubmit}

                                        >
                                          <i className="fa-regular fa-eye"></i>
                                        </button>
                                      </div></td>
                                      <td>
                                        <div className='d-flex align-items-center justify-content-start'>
                                          <button
                                            className="tableButton delete me-12"

                                          >
                                            <i className="fa-solid fa-x"></i>
                                          </button>
                                        </div>
                                      </td>
                                    </tr>

                                  </>
                                </tbody>
                              </table>
                            </div>
                            <div className="tableHeader mb-3">
                              {/* <PaginationComponent
                                  pageNumber={(e) => setPageNumber(e)}
                                  totalPage={callBlock.last_page}
                                  from={callBlock.from}
                                  to={callBlock.to}
                                  total={callBlock.total}
                                /> */}
                            </div>
                          </div>



                        </div>
                        <div
                          className="tab-pane fade"
                          id="nav-exten"
                          role="tabpanel"
                          aria-labelledby="nav-exten-tab"
                          tabindex="0"
                        >

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
                                //   setItemsPerPage(e.target.value);
                                // }}
                                >
                                  <option value={10}>10</option>
                                  <option value={20}>20</option>
                                  <option value={30}>30</option>
                                </select>
                                <label>entries</label>
                              </div>

                              <div className="searchBox">
                                <label>Search:</label>
                                <input
                                  type="search"
                                  className="formItem"
                                // value={searchValue}

                                />
                              </div>
                            </div>
                            <div className="tableContainer">
                              <table>
                                <thead>
                                  <tr>
                                    <th>#</th>
                                    <th>TimeStamp</th>
                                    <th>UserName</th>
                                    <th>Email</th>
                                    <th>Subject</th>

                                    <th>View massage</th>



                                  </tr>
                                </thead>
                                <tbody>
                                  {/* {loading ? (
                                    <SkeletonTableLoader col={3} row={15} />
                                  ) : ( */}
                                  <>

                                    <tr >
                                      <td>1</td>
                                      <td>1/10/2025</td>
                                      <td>Rishabh Maurya</td>
                                      <td>rishabhmaurya@gmail.com</td>
                                      <td>Support</td>
                                      <td><div className=''>
                                        <button
                                          className="tableButton edit" onClick={handleSubmit}

                                        >
                                          <i className="fa-regular fa-eye"></i>
                                        </button>
                                      </div></td>
                                      {/* <td>
                                                <div className='d-flex align-items-center justify-content-start'>
                                                <button
                                                  className="tableButton delete me-12"
                                                  
                                                >
                                                  <i className="fa-solid fa-x"></i>
                                                </button>
                                                </div>
                                              </td> */}
                                    </tr>

                                  </>
                                </tbody>
                              </table>



                            </div>



                            <div className="tableHeader mb-3">
                              {/* <PaginationComponent
                                  pageNumber={(e) => setPageNumber(e)}
                                  totalPage={callBlock.last_page}
                                  from={callBlock.from}
                                  to={callBlock.to}
                                  total={callBlock.total}
                                /> */}
                            </div>
                          </div>


                        </div>

                      </div>





                    </div>


                    {isOpen && (
                      <div className="addNewContactPopup p-3">
                        <div className="row">
                          <div className="col-12 heading border-0 bg-transparent">
                            <i className="fa-light fa-user-plus" />
                            <h5>Create Ticket</h5>
                          </div>
                          <div className="col-xl-12">
                            <div
                              className="tableContainer0"
                              style={{ maxHeight: "calc(100vh - 100px)" }}>
                              <div className="formLabel">
                                <label for="">Subject : </label>
                              </div>
                              <div className="col-12">
                                <select
                                  className="formItem"
                                  name="" >
                                  <option value="" disabled>Choose Type</option>
                                  <option></option>
                                </select>
                              </div>
                              <div className="formLabel">
                                <label for="">Department : </label>

                              </div>

                              <div className="col-12">
                                <select
                                  className="formItem"
                                  name="" >
                                  <option value="" disabled>Choose Type</option>
                                  <option>Support</option>
                                  <option>Support</option>
                                  <option>Support</option>
                                </select>
                              </div>
                              <div className="formLabel">
                                <label for="">Query Type: </label>
                              </div>
                              <div className="col-12">
                                <select
                                  className="formItem"
                                  name="" >
                                  <option value="" disabled>Choose Type</option>
                                  <option>Minor </option>
                                  <option>Major</option>
                                  <option>Critical</option>
                                  <option>Fatal</option>
                                </select>
                              </div>
                              <div className="formLabel">
                                <label for="">Massage </label>
                              </div>
                              <div className="col-12">
                                <textarea
                                  type="text"
                                  name="did"
                                  className="formItem" />
                              </div>

                            </div>
                          </div>
                          <div className="col-xl-12 mt-2">
                            <div className="d-flex justify-content-between">
                              <button
                                className="panelButton gray ms-0"
                                onClick={closePopupAndPage}
                              >
                                <span className="text">Close</span>
                                <span className="icon">
                                  <i className="fa-solid fa-caret-left" />
                                </span>
                              </button>
                              <button
                                className="panelButton me-0"

                              >
                                <span className="text">Done</span>
                                <span className="icon">
                                  <i className="fa-solid fa-check" />
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )

                    }
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

export default Ticket