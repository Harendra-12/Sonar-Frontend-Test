import React, { useState } from 'react'
import Header from '../../CommonComponents/Header'
import Select from 'react-select';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

const AiPhoneNumber = () => {
  const [refreshState, setRefreshState] = useState(false)
  const [addKnowledgeBase, setKnowledgeBase] = useState(false)
  const [idCopy, setIdCopy] = useState(false)
  const [deletePopup, setDeletePopup] = useState(false);

  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRtl, setIsRtl] = useState(false);
  const [value, setValue] = useState();

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
              <Header title="Phone Numbers" />
              <div className="overviewTableWrapper">
                <div className="overviewTableChild">
                  <div className="d-flex flex-wrap">
                    <div className="col-12">
                      <div className="heading">
                        <div className="content">
                          <h4>Phone Numbers
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
                          <p>You can manage yours Phone Numbers here</p>
                        </div>
                      </div>
                    </div>
                    <div className='col-12'>
                      <div className='row p-3'>
                        <div className='col-xxl-4 col-xl-5 col-lg-5 '>
                          <div className='KnowledgeLeftinfo'>
                            <div className='info_header'>
                              <h5 className='mb-0'>Available Numbers</h5>
                              <button
                                className={`tableButton`}
                                role="button"
                                onClick={setKnowledgeBase}
                              >
                                <i className="fa-regular fa-plus" />
                              </button>
                            </div>
                            <div className='knowledge__list'>
                              <div className="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                <button className="nav-link active" id="v-pills-home-tab" data-bs-toggle="pill" data-bs-target="#v-pills-home" type="button" role="tab" aria-controls="v-pills-home" aria-selected="true">
                                  <p className='mb-0'>
                                    <i className="fa-solid fa-phone me-2"></i> +14844731350
                                  </p>
                                  {/* <p className='mb-0'>added on <span> 5/26/2025</span></p> */}
                                </button>
                                <button className="nav-link" id="v-pills-profile-tab" data-bs-toggle="pill" data-bs-target="#v-pills-profile" type="button" role="tab" aria-controls="v-pills-profile" aria-selected="false">
                                  <p className='mb-0'>
                                    <i className="fa-solid fa-phone me-2"></i> +14844731383
                                  </p>
                                  {/* <p className='mb-0'>added on <span> 5/26/2025</span></p> */}
                                </button>
                                <button className="nav-link" id="v-pills-messages-tab" data-bs-toggle="pill" data-bs-target="#v-pills-messages" type="button" role="tab" aria-controls="v-pills-messages" aria-selected="false">
                                  <p className='mb-0'>
                                    <i className="fa-solid fa-phone me-2"></i> +16102458451
                                  </p>
                                  {/* <p className='mb-0'>added on <span> 5/26/2025</span></p> */}
                                </button>
                                <button className="nav-link" id="v-pills-settings-tab" data-bs-toggle="pill" data-bs-target="#v-pills-settings" type="button" role="tab" aria-controls="v-pills-settings" aria-selected="false">
                                  <p className='mb-0'>
                                    <i className="fa-solid fa-phone me-2"></i> +16105579255
                                  </p>
                                  {/* <p className='mb-0'>added on <span> 5/26/2025</span></p> */}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='col-xxl-8 col-xl-7 col-lg-7 '>
                          <div className="tab-content KnowledgeRightinfo" id="v-pills-tabContent">
                            <div className="tab-pane fade show active" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
                              <div className="heading">
                                <div className="content">
                                  <h4>+14844731350</h4>
                                  <p className='mb-0'>ID: <span>125634Knowledge_Base26</span>
                                    <button
                                      className="clearButton"
                                      onClick={() => { setIdCopy(!idCopy) }}
                                    >
                                      <i
                                        className={
                                          idCopy
                                            ? "fa-solid fa-check text_success"
                                            : "fa-solid fa-clone"
                                        }
                                      ></i>

                                    </button>
                                  </p>
                                </div>
                                <div>
                                  {/* <p className='text-end mb-2 f-s-14'>Last Update on : <strong> 5/26/2025</strong></p> */}
                                  <div className="buttonGroup">
                                    <button className="panelButton danger" onClick={setDeletePopup}>
                                      <span className="text">Delete</span>
                                      <span className="icon">
                                        <i className="fa-solid fa-trash"></i>
                                      </span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div className='k_body px-3'>
                                <form>
                                  <div className="formRow flex-column align-items-start px-0">
                                    <div className="formLabel">
                                      <label>Phone Number Name:</label>
                                    </div>
                                    <div className="col-12">
                                      <input
                                        type="text"
                                        className="formItem"
                                        placeholder='Enter a name for your knowledge base'

                                      />
                                    </div>
                                  </div>
                                </form>
                                <div className='d_card mb-3'>
                                  <div className='heading flex-column text-start align-items-start bg-transparent p-0'>
                                    <h4 className='mb-2'>Inbound Settings</h4>
                                    <p className='text2'>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it </p>
                                  </div>
                                  <div>
                                    <form>
                                      <div className="formRow flex-column align-items-start px-0">
                                        <div className="formLabel">
                                          <label>Phone Number Name:</label>
                                        </div>
                                        <div className="col-12">
                                          <input
                                            type="text"
                                            className="formItem"
                                            placeholder='Enter a name for your knowledge base'
                                            value={14844731350}
                                            disabled
                                          />
                                        </div>
                                      </div>
                                      <div className="formRow flex-column align-items-start px-0">
                                        <div className="formLabel">
                                          <label>Select Assistant</label>
                                        </div>
                                        <div className="col-12">
                                          <Select
                                            className="basic-single "
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
                                      <div className="formRow flex-column align-items-start px-0">
                                        <div className="formLabel">
                                          <label>Select Squad</label>
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
                                      <h6>Fallback Destination</h6>
                                      <div className="formRow flex-column align-items-start px-0">
                                        <div className="formLabel mw-100">
                                          <label>Set a fallback destination for inbound call when the  assistant or squad is not available</label>
                                        </div>
                                        <div className="col-12">
                                          <PhoneInput
                                            defaultCountry="IN"
                                            placeholder="Enter phone number"
                                            value={value}
                                            onChange={setValue}
                                            className="custom-phone-input formItem"
                                          />
                                        </div>
                                      </div>
                                    </form>
                                  </div>
                                </div>
                                <div className='d_card mb-3'>
                                  <div className='heading flex-column text-start align-items-start bg-transparent p-0'>
                                    <h4 className='mb-2'>Inbound Settings</h4>
                                    <p className='text2'>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it </p>
                                  </div>
                                  <div>
                                    <form>
                                      <div className="formRow flex-column align-items-start px-0">
                                        <div className="formLabel">
                                          <label>Phone Number Name:</label>
                                        </div>
                                        <div className="col-12">
                                          <input
                                            type="text"
                                            className="formItem"
                                            placeholder='Enter a name for your knowledge base'
                                            value={14844731350}
                                            disabled
                                          />
                                        </div>
                                      </div>
                                      <div className="formRow flex-column align-items-start px-0">
                                        <div className="formLabel">
                                          <label>Select Assistant</label>
                                        </div>
                                        <div className="col-12">
                                          <Select
                                            className="basic-single "
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
                                      <div className="formRow flex-column align-items-start px-0">
                                        <div className="formLabel">
                                          <label>Select Squad</label>
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
                                      <h6>Fallback Destination</h6>
                                      <div className="formRow flex-column align-items-start px-0">
                                        <div className="formLabel mw-100">
                                          <label>Set a fallback destination for inbound call when the  assistant or squad is not available</label>
                                        </div>
                                        <div className="col-12">
                                          <PhoneInput
                                            defaultCountry="IN"
                                            placeholder="Enter phone number"
                                            value={value}
                                            onChange={setValue}
                                            className="custom-phone-input formItem"
                                          />
                                        </div>
                                      </div>
                                    </form>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="tab-pane fade" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab">

                            </div>
                            <div className="tab-pane fade" id="v-pills-messages" role="tabpanel" aria-labelledby="v-pills-messages-tab">

                            </div>
                            <div className="tab-pane fade" id="v-pills-settings" role="tabpanel" aria-labelledby="v-pills-settings-tab">

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


        {addKnowledgeBase &&
          <div className="popup ">
            <div className="popup music">
              <div className="container h-100">
                <div className="row h-100 justify-content-center align-items-center">
                  <div
                    className="card px-0 col-5 shadow-none w50"
                    style={{
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    <div className="card-header bg-transparent ">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="card-title fs14 fw700 mb-0">
                            Phone Number
                          </h5>
                          <p className='sub_text mb-0'>Add a new phone number to your account</p></div>
                        <button className="clearButton2 xl" onClick={() => setKnowledgeBase(false)}>
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </div>
                    </div>
                    <div className="card-body aiAgentTab p-3">
                      <div className="mt-3 baseNav">
                        <ul className="nav nav-pills" id="pills-tab" role="tablist">

                          <li className="nav-item" role="presentation">
                            <button className="nav-link active" id="twilio-tab" data-bs-toggle="pill" data-bs-target="#twilio" type="button" role="tab" aria-controls="twilio" aria-selected="true">Import Twilio</button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button className="nav-link" id="Vonage-tab" data-bs-toggle="pill" data-bs-target="#Vonage" type="button" role="tab" aria-controls="Vonage" aria-selected="false">Import Vonage</button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button className="nav-link" id="import-tab" data-bs-toggle="pill" data-bs-target="#import" type="button" role="tab" aria-controls="import" aria-selected="false">Import Telnyx</button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button className="nav-link" id="sip-tab" data-bs-toggle="pill" data-bs-target="#sip" type="button" role="tab" aria-controls="sip" aria-selected="false">BYO SIP Trunk Number</button>
                          </li>
                        </ul>
                        <div className="tab-content" id="pills-tabContent">
                          <div className="tab-pane fade show active" id="twilio" role="tabpanel" aria-labelledby="twilio-tab">
                            <form>
                              <div className="formRow flex-column align-items-start px-0">
                                <div className="formLabel mw-100">
                                  <label>Twilio Phone Number</label>
                                </div>
                                <div className="col-12">
                                  <PhoneInput
                                    defaultCountry="IN"
                                    placeholder="Enter phone number"
                                    value={value}
                                    onChange={setValue}
                                    className="custom-phone-input formItem"
                                  />
                                </div>
                              </div>
                              <div className="formRow flex-column align-items-start px-0">
                                <div className="formLabel">
                                  <label>Twilio Account SID</label>
                                </div>
                                <div className="col-12">
                                  <input
                                    type="text"
                                    className="formItem"
                                    placeholder='Twilio Account SID'
                                  />
                                </div>
                              </div>
                              <div className="formRow flex-column align-items-start px-0">
                                <div className="formLabel">
                                  <label>Twilio Auth Token</label>
                                </div>
                                <div className="col-12">
                                  <input
                                    type="text"
                                    className="formItem"
                                    placeholder='Twilio Auth Token'
                                  />
                                </div>
                              </div>
                              <div className="formRow flex-column align-items-start px-0">
                                <div className="formLabel">
                                  <label>Label</label>
                                </div>
                                <div className="col-12">
                                  <input
                                    type="text"
                                    className="formItem"
                                    placeholder='Label for Phone Number'
                                  />
                                </div>
                              </div>
                            </form>
                          </div>

                          <div className="tab-pane fade pb-3" id="Vonage" role="tabpanel" aria-labelledby="Vonage-tab">
                            <form>
                              <div className="formRow flex-column align-items-start px-0">
                                <div className="formLabel mw-100">
                                  <label>Vonage Phone Number</label>
                                </div>
                                <div className="col-12">
                                  <PhoneInput
                                    defaultCountry="IN"
                                    placeholder="Enter phone number"
                                    value={value}
                                    onChange={setValue}
                                    className="custom-phone-input formItem"
                                  />
                                </div>
                              </div>
                              <div className="formRow flex-column align-items-start px-0">
                                <div className="formLabel">
                                  <label>API Key</label>
                                </div>
                                <div className="col-12">
                                  <input
                                    type="text"
                                    className="formItem"
                                    placeholder='Enter API Key'
                                  />
                                </div>
                              </div>
                              <div className="formRow flex-column align-items-start px-0">
                                <div className="formLabel">
                                  <label>API Secret</label>
                                </div>
                                <div className="col-12">
                                  <input
                                    type="text"
                                    className="formItem"
                                    placeholder='Enter API Secret'
                                  />
                                </div>
                              </div>
                              <div className="formRow flex-column align-items-start px-0">
                                <div className="formLabel">
                                  <label>Label</label>
                                </div>
                                <div className="col-12">
                                  <input
                                    type="text"
                                    className="formItem"
                                    placeholder='Label for Phone Number'
                                  />
                                </div>
                              </div>
                            </form>

                          </div>

                          <div className="tab-pane fade" id="import" role="tabpanel" aria-labelledby="import-tab">
                            <form>
                              <div className="formRow flex-column align-items-start px-0">
                                <div className="formLabel mw-100">
                                  <label>Vonage Phone Number</label>
                                </div>
                                <div className="col-12">
                                  <PhoneInput
                                    defaultCountry="IN"
                                    placeholder="Enter phone number"
                                    value={value}
                                    onChange={setValue}
                                    className="custom-phone-input formItem"
                                  />
                                </div>
                              </div>
                              <div className="formRow flex-column align-items-start px-0">
                                <div className="formLabel">
                                  <label>API Key</label>
                                </div>
                                <div className="col-12">
                                  <input
                                    type="text"
                                    className="formItem"
                                    placeholder='Enter API Key'
                                  />
                                </div>
                              </div>

                              <div className="formRow flex-column align-items-start px-0">
                                <div className="formLabel">
                                  <label>Label</label>
                                </div>
                                <div className="col-12">
                                  <input
                                    type="text"
                                    className="formItem"
                                    placeholder='Label for Phone Number'
                                  />
                                </div>
                              </div>
                            </form>

                          </div>
                          <div className="tab-pane fade" id="sip" role="tabpanel" aria-labelledby="sip-tab">
                            <form>
                              <div className="formRow flex-column align-items-start px-0">
                                <div className="formLabel">
                                  <label>Phone Number</label>
                                </div>
                                <div className="col-12">
                                  <input
                                    type="text"
                                    className="formItem"
                                    placeholder='Phone Number'
                                  />
                                </div>
                              </div>
                              <div className="formRow flex-column align-items-start px-0">

                                <div className="col-12 formLabel mw-100">
                                  <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value="" id="checkDefault" />
                                    <label className="form-check-label" htmlFor="checkDefault">
                                      Allow non-E164 Phone Number <br />
                                      <span>Check this box to disabled E164 format validation and use custom phone number formats.</span>
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div className="formRow flex-column align-items-start px-0">
                                <div className="formLabel">
                                  <label>Sip Trunk  Credential</label>
                                </div>
                                <div className="col-12">
                                  <input
                                    type="text"
                                    className="formItem"
                                    placeholder='Enter API Key'
                                  />
                                </div>
                              </div>

                              <div className="formRow flex-column align-items-start px-0">
                                <div className="formLabel">
                                  <label>Label</label>
                                </div>
                                <div className="col-12">
                                  <input
                                    type="text"
                                    className="formItem"
                                    placeholder='Label for Phone Number'
                                  />
                                </div>
                              </div>
                            </form>

                          </div>
                        </div>
                      </div>
                    </div>
                    <div className=" card-footer d-flex justify-content-end">
                      <div className="d-flex justify-content-end">
                        <button className="panelButton  m-0" >
                          <span className="text">Confirm</span>
                          <span className="icon">
                            <i className="fa-solid fa-check"></i>
                          </span>
                        </button>
                        <button
                          className="panelButton gray"
                          onClick={() => {
                            setKnowledgeBase(false);
                          }}
                        >
                          <span className="text">Cancel</span>
                          <span className="icon">
                            <i className="fa-solid fa-xmark"></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }


        {deletePopup && (
          <div className="popup">
            <div className="container h-100">
              <div className="row h-100 justify-content-center align-items-center">
                <div className="row content col-xl-4 col-md-5">
                  <div className="col-12">
                    <div className="iconWrapper">
                      <i className="fa-duotone fa-circle-exclamation text-danger"></i>
                    </div>
                  </div>
                  <div className="col-12">
                    <h4 className="text-center text-danger">Confirmation!</h4>
                    <p className="text-center">Are you sure! You want to delete this DID</p>

                    <div className="d-flex justify-content-center gap-2 mt-4">
                      <button
                        className="panelButton m-0"

                      >
                        <span className="text">Delete</span>
                        <span className="icon">
                          <i className="fa-solid fa-check"></i>
                        </span>
                      </button>
                      <button
                        className="panelButton gray m-0 float-end"
                        onClick={() => {
                          setDeletePopup(false);
                        }}
                      >
                        <span className="text">Cancel</span>
                        <span className="icon">
                          <i className="fa-solid fa-xmark"></i>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}


      </main >
    </>
  )
}

export default AiPhoneNumber