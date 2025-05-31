import React, { useState } from 'react'
import Header from '../../CommonComponents/Header'

const AiKnowledgeBase = () => {
  const [refreshState, setRefreshState] = useState(false)

  const handleRefreshBtnClicked = () => {
    setRefreshState(true)
    // const shouldLoad = false
    // getData(shouldLoad);
  }


  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid">
            <div className="row">
              <Header title="Knowledge Base" />
              <div className="overviewTableWrapper">
                <div className="overviewTableChild">
                  <div className="d-flex flex-wrap">
                    <div className="col-12">
                      <div className="heading">
                        <div className="content">
                          <h4>Knowledge Base {" "}
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
                          <p>You can manage yours Knowledge Base here</p>
                        </div>
                        {/* <div className="buttonGroup">
                                                    <button effect="ripple" className="panelButton " >
                                                        <span className="text">Create</span>
                                                        <span className="icon">
                                                            <i className="fa-solid fa-plus"></i>
                                                        </span>
                                                    </button>


                                                    <button className="panelButton edit">
                                                        <span className="text">import</span>
                                                        <span className="icon">
                                                            <i className="fa-solid fa-file-csv"></i>
                                                        </span>
                                                    </button>
                                                </div> */}
                      </div>
                    </div>
                    <div className='col-12'>
                      <div className='row p-3'>
                        <div className='col-xxl-4 col-xl-5 col-lg-5 '>
                          <div className='KnowledgeLeftinfo'>
                            <div className='info_header'>
                              <h5 className='mb-0'>Uploaded files</h5>
                              <button
                                className={`tableButton`}
                                href="#"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <i className="fa-regular fa-plus" />
                              </button>
                            </div>
                            <div className='knowledge__list'>
                              <div class="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                <button class="nav-link active" id="v-pills-home-tab" data-bs-toggle="pill" data-bs-target="#v-pills-home" type="button" role="tab" aria-controls="v-pills-home" aria-selected="true">
                                  <p className='mb-0'>
                                    <i class="fa-duotone fa-solid fa-folder-open me-2"></i> abc
                                  </p>
                                  <p className='mb-0'>added on <span> 5/26/2025</span></p>
                                </button>
                                <button class="nav-link" id="v-pills-profile-tab" data-bs-toggle="pill" data-bs-target="#v-pills-profile" type="button" role="tab" aria-controls="v-pills-profile" aria-selected="false">
                                  <p className='mb-0'>
                                    <i class="fa-duotone fa-solid fa-folder-open me-2"></i> abc2
                                  </p>
                                  <p className='mb-0'>added on <span> 5/26/2025</span></p>
                                </button>
                                <button class="nav-link" id="v-pills-messages-tab" data-bs-toggle="pill" data-bs-target="#v-pills-messages" type="button" role="tab" aria-controls="v-pills-messages" aria-selected="false">
                                  <p className='mb-0'>
                                    <i class="fa-duotone fa-solid fa-folder-open me-2"></i> abc3
                                  </p>
                                  <p className='mb-0'>added on <span> 5/26/2025</span></p>
                                </button>
                                <button class="nav-link" id="v-pills-settings-tab" data-bs-toggle="pill" data-bs-target="#v-pills-settings" type="button" role="tab" aria-controls="v-pills-settings" aria-selected="false">
                                  <p className='mb-0'>
                                    <i class="fa-duotone fa-solid fa-folder-open me-2"></i> abc4
                                  </p>
                                  <p className='mb-0'>added on <span> 5/26/2025</span></p>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='col-xxl-8 col-xl-7 col-lg-7 '>
                          <div class="tab-content KnowledgeRightinfo" id="v-pills-tabContent">
                            <div class="tab-pane fade show active" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
                              <div className="heading">
                                <div className="content">
                                  <h4>abc</h4>
                                  <p className='mb-0'>ID: <span>125634Knowledge_Base26</span>
                                    <button
                                      className="clearButton"
                                      onClick={handleRefreshBtnClicked}
                                      disabled={refreshState}
                                    >
                                      <i className="fa-solid fa-clone"></i>
                                    </button>
                                  </p>
                                </div>
                                <div>
                                  <p className='text-end mb-2 f-s-14'>Last Update on : <strong> 5/26/2025</strong></p>
                                <div className="buttonGroup">
                                  <button effect="ripple" className="panelButton edit" >
                                    <span className="text">Edit</span>
                                    <span className="icon">
                                     <i class="fa-solid fa-pen"></i>
                                    </span>
                                  </button>


                                  <button className="panelButton danger">
                                    <span className="text">Delete</span>
                                    <span className="icon">
                                     <i class="fa-solid fa-trash"></i>
                                    </span>
                                  </button>
                                </div>
                                </div>
                              </div>
                            </div>
                            <div class="tab-pane fade" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab">

                            </div>
                            <div class="tab-pane fade" id="v-pills-messages" role="tabpanel" aria-labelledby="v-pills-messages-tab">

                            </div>
                            <div class="tab-pane fade" id="v-pills-settings" role="tabpanel" aria-labelledby="v-pills-settings-tab">

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
    </>
  )
}

export default AiKnowledgeBase