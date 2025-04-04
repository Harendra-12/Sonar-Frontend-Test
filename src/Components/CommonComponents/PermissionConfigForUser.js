import React from 'react'
import { backToTop } from '../GlobalFunction/globalFunction';
import Header from './Header';
import { useNavigate } from 'react-router-dom';

function PermissionConfigForUser() {
  const navigate = useNavigate();
  return (
    <>
      {/* <div className='profileView p-0'>
        <div className='profileDetailsHolder position-relative p-0 shadow-none border-0'>
          <div class="col-xl-12">
            <div class="headerCommon d-flex align-items-center">
              <div class="col">Permissions for Role
                <span style={{ color: "var(--ui-accent)", fontWeight: 600 }}>Agent</span>
              </div>
            </div>
          </div>
          <div className="accordion permissionListWrapper">
            <div className="accordion-item">
              <h2 className="accordion-header" id="heading1">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapse1"
                  aria-expanded="true"
                  aria-controls="collapse1"
                >
                  <div className="d-flex align-items-center justify-content-start">
                    <input type="checkbox" className="" />
                    <label className="ms-2 rolebar">Account</label>
                  </div>
                </button>
              </h2>
              <div
                id="collapse1"
                className="accordion-collapse collapse show"
                aria-labelledby="heading1"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body d-block">
                  <div className="accordion-item">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#subCollapse1"
                    >

                      <input type="checkbox" className="" />
                      <label className="ms-2 rolebar">Users</label>
                    </button>
                    <div
                      id="subCollapse1"
                      className="accordion-collapse collapse show"
                    >
                      <div className="accordion-body">
                        <div className="col-xxl col-auto col-md-4 col-6">
                          <input type="checkbox" id="permission-7" />
                          <label className="formLabel ms-2 text-capitalize">browse</label>
                        </div>
                        <div className="col-xxl col-auto col-md-4 col-6">
                          <input type="checkbox" id="permission-8" />
                          <label className="formLabel ms-2 text-capitalize">read</label>
                        </div>
                        <div className="col-xxl col-auto col-md-4 col-6">
                          <input type="checkbox" id="permission-9" />
                          <label className="formLabel ms-2 text-capitalize">edit</label>
                        </div>
                        <div className="col-xxl col-auto col-md-4 col-6">
                          <input type="checkbox" id="permission-10" />
                          <label className="formLabel ms-2 text-capitalize">add</label>
                        </div>
                        <div className="col-xxl col-auto col-md-4 col-6">
                          <input type="checkbox" id="permission-11" />
                          <label className="formLabel ms-2 text-capitalize">delete</label>
                        </div>
                        <div className="col-xxl col-auto col-md-4 col-6">
                          <input type="checkbox" id="permission-12" />
                          <label className="formLabel ms-2 text-capitalize">search</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#subCollapse2"
                    >

                      <input type="checkbox" className="" />
                      <label className="ms-2 rolebar">Extensions</label>
                    </button>
                    <div
                      id="subCollapse2"
                      className="accordion-collapse collapse show"
                    >
                      <div className="accordion-body">
                        <div className="col-xxl col-auto col-md-4 col-6">
                          <input type="checkbox" id="permission-7" />
                          <label className="formLabel ms-2 text-capitalize">browse</label>
                        </div>
                        <div className="col-xxl col-auto col-md-4 col-6">
                          <input type="checkbox" id="permission-8" />
                          <label className="formLabel ms-2 text-capitalize">read</label>
                        </div>
                        <div className="col-xxl col-auto col-md-4 col-6">
                          <input type="checkbox" id="permission-9" />
                          <label className="formLabel ms-2 text-capitalize">edit</label>
                        </div>
                        <div className="col-xxl col-auto col-md-4 col-6">
                          <input type="checkbox" id="permission-10" />
                          <label className="formLabel ms-2 text-capitalize">add</label>
                        </div>
                        <div className="col-xxl col-auto col-md-4 col-6">
                          <input type="checkbox" id="permission-11" />
                          <label className="formLabel ms-2 text-capitalize">delete</label>
                        </div>
                        <div className="col-xxl col-auto col-md-4 col-6">
                          <input type="checkbox" id="permission-12" />
                          <label className="formLabel ms-2 text-capitalize">search</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingTwo">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseTwo"
                  aria-expanded="false"
                  aria-controls="collapseTwo"
                >
                  Accordion Item #2
                </button>
              </h2>
              <div
                id="collapseTwo"
                className="accordion-collapse collapse"
                aria-labelledby="headingTwo"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <strong>This is the second item's accordion body.</strong> It is hidden
                  by default, until the collapse plugin adds the appropriate classes that
                  we use to style each element. These classes control the overall
                  appearance, as well as the showing and hiding via CSS transitions. You
                  can modify any of this with custom CSS or overriding our default
                  variables. It's also worth noting that just about any HTML can go within
                  the <code>.accordion-body</code>, though the transition does limit
                  overflow.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid">
            <div className="row">
              <Header title="Global Permissions" />
              <div className="overviewTableWrapper">
                <div className="overviewTableChild">
                  <div className="d-flex flex-wrap">
                    <div className="col-12">
                      <div className="heading">
                        <div className="content">
                          <h4>Permissions</h4>
                        </div>
                        <div className="buttonGroup">
                          <button
                            effect="ripple"
                            className="panelButton ms-0"
                          >
                            <span className="text">Refresh</span>
                            <span className="icon">
                              <i className="fa-regular fa-arrows-rotate fs-5"></i>
                            </span>
                          </button>
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
                        </div>
                      </div>
                    </div>
                    <div className='col-12' style={{ padding: '25px 23px' }}>
                      <form className="row mb-0">
                        <div className="formRow col-xl-3">
                          <div className='formLabel'>
                            <label>
                              Select Class Type
                            </label>
                          </div>
                          <div className='col-6'>
                            <div className='row'>
                              <div className='col-6'>
                                <select className='formItem'>
                                  <option value={"group"}>Group</option>
                                  <option value={"role"}>Role</option>
                                </select>
                              </div>
                              <div className='col-6'>
                                <select className='formItem'>
                                  <option value={"group"}>Group</option>
                                  <option value={"role"}>Role</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                      <div className='col-xl-12 col-xxl-10'>
                        <div className='itemWrapper a shadow-none px-0 permissionsConfigWrapper'>
                          <div className="heading h-auto">
                            <h5>Accounts</h5>
                          </div>
                          <div className='tableContainer h-auto' style={{ minHeight: 'auto' }}>
                            <table>
                              <thead>
                                <tr>
                                  <th>Page Name</th>
                                  <th>View</th>
                                  <th>Utilities</th>
                                  <th>Add</th>
                                  <th>Edit</th>
                                  <th>Delete</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Users</td>
                                  <td>
                                    <div class="my-auto position-relative mx-1">
                                      <label class="switch">
                                        <input type="checkbox" id="showAllCheck" />
                                        <span class="slider round"></span>
                                      </label>
                                    </div>
                                  </td>
                                  <td>
                                    <div class="my-auto position-relative mx-1">
                                      <label class="switch">
                                        <input type="checkbox" id="showAllCheck" />
                                        <span class="slider round"></span>
                                      </label>
                                    </div>
                                  </td>
                                  <td>
                                    <div class="my-auto position-relative mx-1">
                                      <label class="switch">
                                        <input type="checkbox" id="showAllCheck" />
                                        <span class="slider round"></span>
                                      </label>
                                    </div>
                                  </td>
                                  <td>
                                    <div class="my-auto position-relative mx-1">
                                      <label class="switch">
                                        <input type="checkbox" id="showAllCheck" />
                                        <span class="slider round"></span>
                                      </label>
                                    </div>
                                  </td>
                                  <td>
                                    <div class="my-auto position-relative mx-1">
                                      <label class="switch">
                                        <input type="checkbox" id="showAllCheck" />
                                        <span class="slider round"></span>
                                      </label>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td>Extensions</td>
                                  <td>
                                    <div class="my-auto position-relative mx-1">
                                      <label class="switch">
                                        <input type="checkbox" id="showAllCheck" />
                                        <span class="slider round"></span>
                                      </label>
                                    </div>
                                  </td>
                                  <td>
                                    <div class="my-auto position-relative mx-1">
                                      <label class="switch">
                                        <input type="checkbox" id="showAllCheck" />
                                        <span class="slider round"></span>
                                      </label>
                                    </div>
                                  </td>
                                  <td>
                                    <div class="my-auto position-relative mx-1">
                                      <label class="switch">
                                        <input type="checkbox" id="showAllCheck" />
                                        <span class="slider round"></span>
                                      </label>
                                    </div>
                                  </td>
                                  <td>
                                    <div class="my-auto position-relative mx-1">
                                      <label class="switch">
                                        <input type="checkbox" id="showAllCheck" />
                                        <span class="slider round"></span>
                                      </label>
                                    </div>
                                  </td>
                                  <td>
                                    <div class="my-auto position-relative mx-1">
                                      <label class="switch">
                                        <input type="checkbox" id="showAllCheck" />
                                        <span class="slider round"></span>
                                      </label>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td>Roles And Permissions</td>
                                  <td>
                                    <div class="my-auto position-relative mx-1">
                                      <label class="switch">
                                        <input type="checkbox" id="showAllCheck" />
                                        <span class="slider round"></span>
                                      </label>
                                    </div>
                                  </td>
                                  <td>
                                    <div class="my-auto position-relative mx-1">
                                      <label class="switch">
                                        <input type="checkbox" id="showAllCheck" />
                                        <span class="slider round"></span>
                                      </label>
                                    </div>
                                  </td>
                                  <td>
                                    <div class="my-auto position-relative mx-1">
                                      <label class="switch">
                                        <input type="checkbox" id="showAllCheck" />
                                        <span class="slider round"></span>
                                      </label>
                                    </div>
                                  </td>
                                  <td>
                                    <div class="my-auto position-relative mx-1">
                                      <label class="switch">
                                        <input type="checkbox" id="showAllCheck" />
                                        <span class="slider round"></span>
                                      </label>
                                    </div>
                                  </td>
                                  <td>
                                    <div class="my-auto position-relative mx-1">
                                      <label class="switch">
                                        <input type="checkbox" id="showAllCheck" />
                                        <span class="slider round"></span>
                                      </label>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className='itemWrapper a shadow-none px-0 permissionsConfigWrapper'>
                          <div className="heading h-auto">
                            <h5>Number Management</h5>
                          </div>
                          <div className='tableContainer h-auto' style={{ minHeight: 'auto' }}>
                            <table>
                              <thead>
                                <tr>
                                  <th>Page Name</th>
                                  <th>View</th>
                                  <th>Utilities</th>
                                  <th>Add</th>
                                  <th>Edit</th>
                                  <th>Delete</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Users</td>
                                  <td>
                                    <div class="my-auto position-relative mx-1">
                                      <label class="switch">
                                        <input type="checkbox" id="showAllCheck" />
                                        <span class="slider round"></span>
                                      </label>
                                    </div>
                                  </td>
                                  <td>
                                    <div class="my-auto position-relative mx-1">
                                      <label class="switch">
                                        <input type="checkbox" id="showAllCheck" />
                                        <span class="slider round"></span>
                                      </label>
                                    </div>
                                  </td>
                                  <td>
                                    <div class="my-auto position-relative mx-1">
                                      <label class="switch">
                                        <input type="checkbox" id="showAllCheck" />
                                        <span class="slider round"></span>
                                      </label>
                                    </div>
                                  </td>
                                  <td>
                                    <div class="my-auto position-relative mx-1">
                                      <label class="switch">
                                        <input type="checkbox" id="showAllCheck" />
                                        <span class="slider round"></span>
                                      </label>
                                    </div>
                                  </td>
                                  <td>
                                    <div class="my-auto position-relative mx-1">
                                      <label class="switch">
                                        <input type="checkbox" id="showAllCheck" />
                                        <span class="slider round"></span>
                                      </label>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td>Extensions</td>
                                  <td>
                                    <div class="my-auto position-relative mx-1">
                                      <label class="switch">
                                        <input type="checkbox" id="showAllCheck" />
                                        <span class="slider round"></span>
                                      </label>
                                    </div>
                                  </td>
                                  <td>
                                    <div class="my-auto position-relative mx-1">
                                      <label class="switch">
                                        <input type="checkbox" id="showAllCheck" />
                                        <span class="slider round"></span>
                                      </label>
                                    </div>
                                  </td>
                                  <td>
                                    <div class="my-auto position-relative mx-1">
                                      <label class="switch">
                                        <input type="checkbox" id="showAllCheck" />
                                        <span class="slider round"></span>
                                      </label>
                                    </div>
                                  </td>
                                  <td>
                                    <div class="my-auto position-relative mx-1">
                                      <label class="switch">
                                        <input type="checkbox" id="showAllCheck" />
                                        <span class="slider round"></span>
                                      </label>
                                    </div>
                                  </td>
                                  <td>
                                    <div class="my-auto position-relative mx-1">
                                      <label class="switch">
                                        <input type="checkbox" id="showAllCheck" />
                                        <span class="slider round"></span>
                                      </label>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td>Roles And Permissions</td>
                                  <td>
                                    <div class="my-auto position-relative mx-1">
                                      <label class="switch">
                                        <input type="checkbox" id="showAllCheck" />
                                        <span class="slider round"></span>
                                      </label>
                                    </div>
                                  </td>
                                  <td>
                                    <div class="my-auto position-relative mx-1">
                                      <label class="switch">
                                        <input type="checkbox" id="showAllCheck" />
                                        <span class="slider round"></span>
                                      </label>
                                    </div>
                                  </td>
                                  <td>
                                    <div class="my-auto position-relative mx-1">
                                      <label class="switch">
                                        <input type="checkbox" id="showAllCheck" />
                                        <span class="slider round"></span>
                                      </label>
                                    </div>
                                  </td>
                                  <td>
                                    <div class="my-auto position-relative mx-1">
                                      <label class="switch">
                                        <input type="checkbox" id="showAllCheck" />
                                        <span class="slider round"></span>
                                      </label>
                                    </div>
                                  </td>
                                  <td>
                                    <div class="my-auto position-relative mx-1">
                                      <label class="switch">
                                        <input type="checkbox" id="showAllCheck" />
                                        <span class="slider round"></span>
                                      </label>
                                    </div>
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
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default PermissionConfigForUser