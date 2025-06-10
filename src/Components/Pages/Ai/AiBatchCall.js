import React, { useState } from 'react'
import Header from '../../CommonComponents/Header';
import Select from 'react-select';

const AiBatchCall = () => {
    const [refreshState, setRefreshState] = useState(false)
     const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRtl, setIsRtl] = useState(false);
    

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
                            <Header title="Agents" />
                            <div className="overviewTableWrapper">
                                <div className="overviewTableChild">
                                    <div className="d-flex flex-wrap">
                                        <div className="col-12">
                                            <div className="heading">
                                                <div className="content">
                                                    <h4>Batch Call {" "}
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
                                                    <p>You can manage yours agents here</p>
                                                </div>
                                                <div className="buttonGroup">
                                                    <button effect="ripple" className="panelButton xlWidth " data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                                                        <span className="text">Create a batch call</span>
                                                        <span className="icon">
                                                            <i className="fa-solid fa-plus"></i>
                                                        </span>
                                                    </button>
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


            {/* <div class="offcanvas offcanvas-end w-30" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
                <div class="offcanvas-header" style={{ borderBlockEnd: '1px solid var(--me-border1)' }}>
                    <div>
                        <h5 class="offcanvas-title" id="offcanvasRightLabel">Call History</h5>
                        <p className='f-s-14 mb-0' style={{ color: 'var(--color-subtext)' }}>See all the details of this Call History</p>
                    </div>
                    <button type="button" class="btn-close ms-auto" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body p-3">
                    <div className='heading'>
                        <h5 class="offcanvas-title" id="offcanvasRightLabel">06/03/2025 14:40 web_call</h5>
                        <button className=' bg-transparent border-0 text-danger'><i class="fa-solid fa-trash"></i></button>
                    </div>
                    <div className="content">

                    </div>
                </div>
            </div> */}

            <div class="offcanvas offcanvas-end batchCallCanvas" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
                <div class="offcanvas-header">
                    <button type="button" class="aitable_button bg-transparent" data-bs-dismiss="offcanvas" aria-label="Close">
                        <i class="fa-solid fa-angle-left"></i>
                    </button>
                    <div>
                        <h5 class="offcanvas-title" id="offcanvasRightLabel">Create a batch call</h5>
                        <p className='f-s-14 mb-0' style={{ color: 'var(--color-subtext)' }}>Batch call cost $0.005 per dial</p>
                    </div>
                </div>
                <div class="offcanvas-body">
                    <div className='right_body'>
                        SofiaAddSetting
                    </div>
                    <div className='left_body'>
                        <div className="formRow flex-column align-items-start">
                            <div className="formLabel">
                                <label> Batch Call Name</label>
                            </div>
                            <div className="col-12">
                                <input
                                    type="text"
                                    className="formItem"
                                    placeholder='Enter a name for your knowledge base'
                                />
                            </div>
                        </div>
                        <div className="formRow flex-column align-items-start">
                            <div className="formLabel">
                                <label> From number</label>
                            </div>
                            <div className="col-12">
                                <Select
                                    className="basic-single"
                                    classNamePrefix="select"
                                    // defaultValue={colourOptions[0]}
                                    isDisabled={isDisabled}
                                    isLoading={isLoading}
                                    isClearable={isClearable}
                                    isRtl={isRtl}
                                    isSearchable={isSearchable}
                                    name="color"
                                    // options={colourOptions}
                                />
                            </div>
                        </div>
                        <div className="formRow flex-column align-items-start">
                            <div className="formLabel">
                                <label> Upload Recipients</label>
                            </div>
                            <div className="col-12">
                               <button type="button" class="aitable_button bg-transparent py-1 px-2" data-bs-dismiss="offcanvas" aria-label="Close"><i class="fa-regular fa-arrow-down-to-line me-2"></i> Download the template</button>
                            </div>
                        </div>
                        <div className="formRow flex-column align-items-start">
                           
                            <div className="col-12">
                                  <div className="popup-border text-center p-2">
                              <input
                                type="file"
                                className="form-control-file d-none"
                                id="fileInput"
                                accept=".csv"
                              />
                              <label
                                htmlFor="fileInput"
                                className="d-block"
                              >
                                <div className="test-user text-center">
                                  <i
                                    className="fa-solid fa-cloud-arrow-up"
                                    style={{ fontSize: 30 }}
                                  />
                                  <p className="mb-0 mt-2 text-center">
                                 Choose a csv or drag & drop it here.
                                  </p>
                                  <span className='text2'>
                                   Up to 50 MB
                                  </span>
                                </div>
                              </label>
                            
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default AiBatchCall