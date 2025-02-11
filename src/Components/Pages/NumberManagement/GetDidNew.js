import React from 'react'
import Header from '../../CommonComponents/Header';
import { Navigate } from 'react-router-dom';
import { backToTop } from '../../GlobalFunction/globalFunction';
import { Select } from '@mui/material';

function GetDidNew() {
  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <Header title="DID Management" />
            <div className="overviewTableWrapper pb-2">
              <div className="overviewTableChild">
                <div className="d-flex flex-wrap">
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
                        <h4>Get DID</h4>
                        <p>You can purchase a DID here</p>
                      </div>
                      <div className="buttonGroup">
                        <button
                          effect="ripple"
                          className="panelButton gray"
                          onClick={() => {
                            Navigate(-1);
                            backToTop();
                          }}
                        >
                          <span className="text">Back</span>
                          <span className="icon">
                            <i class="fa-solid fa-caret-left"></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12" style={{ padding: "25px 23px" }}>
                  <div className='row'>
                    <div className="col-xl-4  mx-auto">
                      <div className="itemWrapper boxshadow    local-calls a">
                        <div className="heading  d-flex justify-content-center align-items-center h-auto">
                          <div class="float-none">
                            <div>
                              <i className="fa-solid mb-2 fa-phone-flip"></i>
                              <h5 >Local Call</h5>
                              <p>

                                Local voice, fax and application messaging servicesss
                              </p>

                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                    <div className="col-xl-4  mx-auto">
                      <div className="itemWrapper boxshadow  local-calls a">
                        <div className="heading  d-flex justify-content-center align-items-center h-auto">
                          <div class="float-none">
                            <div>
                              {/* <i className="fa-solid mb-2 fa-phone-flip"></i> */}
                              <i class="fa-solid mb-2 fa-phone-volume"></i>
                              <h5 >Toll Free</h5>
                              <p>

                               Business voice , fax and application messaging services 
                              </p>

                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                    <div className="col-xl-4  mx-auto">
                      <div className="itemWrapper boxshadow   local-calls a">
                        <div className="heading  d-flex justify-content-center align-items-center h-auto">
                          <div class="float-none">
                            <div>
                              <i class="fa-regular mb-2 fa-comment-dots"></i>
                              <h5 >Shortcode</h5>
                              <p>
                               Enterprising , messaging and Exclusive Ownership
                              </p>

                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                  <div className='row  mt-5'>
                    <div className="col-xl-4">
                      <div className="itemWrapper boxshadow  a">
                        <div className="heading h-auto">
                          <div className="">
                            <div className="formRow col-xl-12">
                              <div className="formLabel">
                                <label htmlFor="searchType">Search Type</label>
                              </div>
                              <div className="col-12">
                                <select
                                  name="searchType"
                                  className="formItem"

                                >
                                  <option value="tollfree">Toll free</option>
                                  <option value="domestic">Domestic</option>
                                </select>

                                <label htmlFor="data" className="formItemDesc">
                                  Select the type of DID
                                </label>
                              </div>
                            </div>
                            <div className="formRow col-xl-12">
                              <div
                                className="formLabel d-flex justify-content-between"
                                style={{ width: "100%" }}
                              >
                                <label htmlFor="quantity">Quantity</label>
                              </div>
                              <div className="col-12">
                                <input
                                  type="number"
                                  name="quantity"
                                  className="formItem" />

                                <label htmlFor="data" className="formItemDesc">
                                  Input the quantity
                                </label>
                              </div>
                            </div>

                            <div className="formRow col-xl-12">
                              <div className="formLabel">
                                <label htmlFor="">Usage</label>
                              </div>
                              <div className="col-12">
                                <select
                                  name="searchType"
                                  className="formItem"

                                >
                                  <option value="tollfree">Toll free</option>
                                  <option value="domestic">Domestic</option>
                                </select>
                                <label htmlFor="data" className="formItemDesc">
                                  Set how the Destination will be used
                                </label>
                              </div>
                            </div>
                            <div className="formRow col-xl-12">
                              <div
                                className="formLabel d-flex justify-content-between"
                                style={{ width: "100%" }}
                              >
                                <label htmlFor="npa">NPA</label>
                              </div>
                              <div className="col-12">
                                <input
                                  type="number"
                                  name="npa"
                                  className=" formItem" />

                                <label htmlFor="data" className="formItemDesc">
                                  Input the NPA for the DID
                                </label>
                              </div>
                            </div>
                            <div className="formRow col">
                              <div className="col-12">
                                <div className="formLabel">
                                  <label htmlFor=""></label>
                                </div>
                                <button
                                  effect="ripple"
                                  className="panelButton m-0"
                                  type="submit"
                                >
                                  <span className="text">Search</span>
                                  <span className="icon">
                                    <i class="fa-solid fa-magnifying-glass"></i>
                                  </span>
                                </button>
                                <label
                                  htmlFor="data"
                                  className="formItemDesc"
                                ></label>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                    {/* <div className='col-xl-8 col-md-12'></div> */}
                    <div className="col-xl-8">
                      <div className="itemWrapper boxshadow  a">
                        <div className="heading d-block h-auto">
                          <div className="tableContainer">
                            <table>
                              <thead>
                                <tr>
                                  <th>Number</th>
                                  <th>Capabilities</th>
                                  <th>Cast</th>
                                  <th>Add & Buy</th>


                                </tr>
                              </thead>
                              <tbody className="">
                                <tr>
                                  <td>
                                    <span >+1564651654</span>
                                  </td>
                                  <td>
                                    <div className='icons d-flex align-items-center justify-content-center'>
                                      <i class="fa-solid m-1 fa-phone-flip"></i>
                                      <i class="fa-regular m-1 fa-comments"></i>
                                      <i class="fa-solid m-1 fa-images"></i>
                                      <i class="fa-regular m-1 fa-id-badge"></i>
                                    </div>
                                  </td>
                                  <td>$0.51/month</td>
                                  <td>
                                    <button
                                      className="tableButton  align-items-center justify-content-center" >
                                      <i class="fa-solid bg-transparent shadow-none fa-plus "></i>
                                    </button>
                                  </td>
                                  {/* <td>
                                    <button
                                      className="tableButton edit"
                                      
                                    >
                                      <i className="fa-solid fa-pencil"></i>
                                    </button>
                                  </td> */}
                                  {/* <td>
                                  <div className="my-auto position-relative mx-1">
                                    <label className="switch">
                                      <input
                                        type="checkbox"
                                        id="showAllCheck"
                                        checked=""
                                      />
                                      <span className="slider round"></span>
                                    </label>
                                  </div>
                                </td> */}
                                </tr>
                                <tr>
                                  <td>
                                    <span >+1564651654</span>
                                  </td>
                                  <td>
                                    <div className='icons d-flex align-items-center justify-content-center'>
                                      <i class="fa-solid m-1 fa-phone-flip"></i>
                                      <i class="fa-regular m-1 fa-comments"></i>
                                      <i class="fa-solid m-1 fa-images"></i>
                                      <i class="fa-regular m-1 fa-id-badge"></i>
                                    </div>
                                  </td>
                                  <td>$0.51/month</td>
                                  <td>
                                    <button
                                      className="tableButton  align-items-center justify-content-center" >
                                      <i class="fa-solid bg-transparent shadow-none fa-plus "></i>
                                    </button>
                                  </td>
                                  {/* <td>
                                    <button
                                      className="tableButton edit"
                                      
                                    >
                                      <i className="fa-solid fa-pencil"></i>
                                    </button>
                                  </td> */}
                                  {/* <td>
                                  <div className="my-auto position-relative mx-1">
                                    <label className="switch">
                                      <input
                                        type="checkbox"
                                        id="showAllCheck"
                                        checked=""
                                      />
                                      <span className="slider round"></span>
                                    </label>
                                  </div>
                                </td> */}
                                </tr>
                                <tr>
                                  <td>
                                    <span >+1564651654</span>
                                  </td>
                                  <td>
                                    <div className='icons d-flex align-items-center justify-content-center'>
                                      <i class="fa-solid m-1 fa-phone-flip"></i>
                                      <i class="fa-regular m-1 fa-comments"></i>
                                      <i class="fa-solid m-1 fa-images"></i>
                                      <i class="fa-regular m-1 fa-id-badge"></i>
                                    </div>
                                  </td>
                                  <td>$0.51/month</td>
                                  <td>
                                    <button
                                      className="tableButton  align-items-center justify-content-center" >
                                      <i class="fa-solid bg-transparent shadow-none fa-plus "></i>
                                    </button>
                                  </td>
                                  {/* <td>
                                    <button
                                      className="tableButton edit"
                                      
                                    >
                                      <i className="fa-solid fa-pencil"></i>
                                    </button>
                                  </td> */}
                                  {/* <td>
                                  <div className="my-auto position-relative mx-1">
                                    <label className="switch">
                                      <input
                                        type="checkbox"
                                        id="showAllCheck"
                                        checked=""
                                      />
                                      <span className="slider round"></span>
                                    </label>
                                  </div>
                                </td> */}
                                </tr>
                                <tr>
                                  <td>
                                    <span >+1564651654</span>
                                  </td>
                                  <td>
                                    <div className='icons d-flex align-items-center justify-content-center'>
                                      <i class="fa-solid m-1 fa-phone-flip"></i>
                                      <i class="fa-regular m-1 fa-comments"></i>
                                      <i class="fa-solid m-1 fa-images"></i>
                                      <i class="fa-regular m-1 fa-id-badge"></i>
                                    </div>
                                  </td>
                                  <td>$0.51/month</td>
                                  <td>
                                    <button
                                      className="tableButton  align-items-center justify-content-center" >
                                      <i class="fa-solid bg-transparent shadow-none fa-plus "></i>
                                    </button>
                                  </td>
                                  {/* <td>
                                    <button
                                      className="tableButton edit"
                                      
                                    >
                                      <i className="fa-solid fa-pencil"></i>
                                    </button>
                                  </td> */}
                                  {/* <td>
                                  <div className="my-auto position-relative mx-1">
                                    <label className="switch">
                                      <input
                                        type="checkbox"
                                        id="showAllCheck"
                                        checked=""
                                      />
                                      <span className="slider round"></span>
                                    </label>
                                  </div>
                                </td> */}
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


            </div>





          </div>
        </div>
      </section>
    </main>
  )
}

export default GetDidNew