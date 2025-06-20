import Tippy from '@tippyjs/react';
import React from 'react'
import { useState } from 'react';
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Link } from 'react-router-dom';
import Select from 'react-select';
import KnowledgeBaseFlow from './KnowledgeBaseFlow';
import SpeechSettings from './SpeechSettings';

const FlowAccordionContent = () => {

  const [endCallPopup, setEndCallPopup] = useState();
  const [callTransferPopup, setCallTransferPopup] = useState();
  const [checkCalendarAvailabilityPopup, setCheckCalendarAvailabilityPopup] = useState();
  const [bookCalendarPopup, setBookCalendarPopup] = useState();
  const [pressDigitsPopup, setPressDigitsPopup] = useState();
  const [customFunctionPopup, setCustomFunctionPopup] = useState();
  const [editCustomFunctionPopup, setEditCustomFunctionPopup] = useState();
  const [selectedTransfer, setSelectedTransfer] = useState('cold');
  const [value, setValue] = useState();
  const [selectVoice, SetSelectVoice] = useState();
  const [selectVoiceSettings, SetSelectVoiceSettings] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [editPostCallPopup, setEditPostCallPopup] = useState(false);

  return (
    <>
      <div class="accordion accordion-flush FlowAccordion_content" id="accordionFlushExample">
        <div class="accordion-item">
          <h2 class="accordion-header" id="flush-headingOne">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
              <i class="fa-regular fa-shapes me-3"></i> Functions
            </button>
          </h2>
          <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
            <div class="accordion-body">
              <p className='detailText'>Enable your agent with capabilities such as calendar bookings, call termination, etc.</p>

              <ul>
                <li>
                  <div class="noticeMessageBox justify-content-between">
                    <div className='d-flex align-items-center gap-2'>
                      <i class="fa-regular fa-phone-arrow-up-right iconGray"></i>
                      <p class="mb-0 f-s-14">end_call</p>
                    </div>
                    <div className='d-flex align-items-center gap-1'>
                      <button className="clearButton text-align-start" onClick={setEditCustomFunctionPopup} >
                        <i class="fa-regular fa-pen-to-square"></i>
                      </button>
                      <button className="clearButton text-align-start text-danger" >
                        <i class="fa-regular fa-trash-can"></i>
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="dropdown">
                <button className="panelButton static mt-3 dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <span class="text"><i class="fa-regular fa-plus me-2"></i> Add</span>
                </button>
                <ul class="dropdown-menu">
                  <li><button class="dropdown-item" onClick={setEndCallPopup}><i class="fa-regular fa-phone-arrow-up-right me-2"></i> End Call</button></li>
                  <li><button class="dropdown-item" onClick={setCallTransferPopup}><i class="fa-regular fa-phone-arrow-right me-2"></i> Call Transfer</button></li>
                  <li><button class="dropdown-item" onClick={setCheckCalendarAvailabilityPopup}><i class="fa-regular fa-calendar me-2"></i> Check Calendar Availability (Cal.com)</button></li>
                  <li><button class="dropdown-item" onClick={setBookCalendarPopup}><i class="fa-regular fa-calendar-plus me-2"></i> Book on the Calendar (Cal.com)</button></li>
                  <li><button class="dropdown-item" onClick={setPressDigitsPopup}><i class="fa-regular fa-calendar-days me-2"></i> Press Digits (IVR Navigation)</button></li>
                  <li><hr class="dropdown-divider" /></li>
                  <li><button class="dropdown-item" onClick={setCustomFunctionPopup}><i class="fa-regular fa-gear me-2"></i> Custom Function</button></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header" id="flush-headingTwo">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
              <i class="fa-regular fa-robot me-3"></i> Agent Settings
            </button>
          </h2>
          <div id="flush-collapseTwo" class="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
            <div class="accordion-body">

              <div className='row'>
                <div className='col-12'>
                  <div className="formRow flex-column align-items-start px-0">
                    <div className="formLabel mw-100">
                      <label>Voice & Language</label>
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
                    <div className='col-12 d-flex align-items-center gap-2 mt-2'>
                      <button className='aitable_button static  w-100' onClick={SetSelectVoice}>Dorothy</button>
                      <div className='dropdown'>
                        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                          <i class="fa-regular fa-gear"></i>
                        </button>
                        <div class="dropdown-menu w300 settingMenu">
                          <div className="card-body aiAgentTab p-3">
                            <div className=' mb-4'>
                              <div className='formLabel w-100'>
                                <label className='fs-5 mb-2'> Voice Model</label>
                              </div>
                              <ul className='ps-3'>
                                <li className="d-flex flex-column">
                                  <p className='listHeding'>Elevenlabs Turbo V2</p>
                                  <span class="text2">English only, fast, high quality</span>
                                </li>
                                <li className="d-flex flex-column">
                                  <p className='listHeding'>Elevenlabs Turbo V2</p>
                                  <span class="text2">English only, fast, high quality</span>
                                </li>
                                <li className="d-flex flex-column">
                                  <p className='listHeding'>Elevenlabs Turbo V2</p>
                                  <span class="text2">English only, fast, high quality</span>
                                </li>
                              </ul>
                            </div>
                            <div className=''>
                              <div className="mb-2">
                                <div class="formLabel">
                                  <label>Voice Speed:</label>
                                </div>
                                <input type="range" min="0" max="1" step="0.01" style={{ width: '80%' }} /> <span className='textGray'>1</span>
                              </div>
                              <div className="mb-2">
                                <div class="formLabel">
                                  <label>Voice Temperature:</label>
                                </div>
                                <input type="range" min="0" max="1" step="0.01" style={{ width: '60%' }} /> <span className='textGray'>1.1</span>
                              </div>
                              <div className="mb-2">
                                <div class="formLabel">
                                  <label>Voice Volume:</label>
                                </div>
                                <input type="range" min="0" max="1" step="0.01" style={{ width: '30%' }} /> <span className='textGray'>1.2</span>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="formLabel mw-100">
                      <label>LLM Settings</label>
                    </div>
                    <div className='col-12 d-flex align-items-center gap-2 mt-2 '>
                      {/* <button className='aitable_button static  w-100'>Dorothy</button> */}
                      <div class="dropdown">
                        <button class="aitable_button static  w-100 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                          gpt-4.1-nano
                        </button>
                        <ul class="dropdown-menu">
                          <li><a class="dropdown-item" href="#">Action</a></li>
                          <li><a class="dropdown-item" href="#">Another action</a></li>
                          <li><a class="dropdown-item" href="#">Something else here</a></li>
                        </ul>
                      </div>
                      <div className='dropdown'>
                        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                          <i class="fa-regular fa-gear"></i>
                        </button>
                        <div class="dropdown-menu w300 settingMenu">
                          <div className="card-body aiAgentTab p-3">

                            <div className=''>
                              <div className='formLabel w-100'>
                                <label>LLM Temperature</label>
                              </div>
                              <div className="mb-2">
                                <div class="formLabel">
                                  <label>Lower value yields better function call results.</label>
                                </div>
                                <input type="range" min="0" max="1" step="0.01" style={{ width: '80%' }} />
                              </div>
                              <div className="mb-2">
                                <div class="formLabel">
                                  <label>High Priority</label>
                                </div>
                                <span className='textGray'>Use more dedicated resource pool to ensure lower and more consistent latency. This feature incurs a higher cost.</span>
                                <div className="cl-toggle-switch">
                                  <label className="cl-switch">
                                    <input type="checkbox" id="showAllCheck" />
                                    <span></span>
                                  </label>
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

            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header" id="flush-headingThree">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
              <i class="fa-regular fa-book me-3"></i>  Knowledge Base
            </button>
          </h2>
          <div id="flush-collapseThree" class="accordion-collapse collapse" aria-labelledby="flush-headingThree" data-bs-parent="#accordionFlushExample">
            <div class="accordion-body">
              <KnowledgeBaseFlow />
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header" id="flush-heading04">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse04" aria-expanded="false" aria-controls="flush-collapse04">
              <i class="fa-regular fa-microphone me-3"></i> Speech Settings
            </button>
          </h2>
          <div id="flush-collapse04" class="accordion-collapse collapse" aria-labelledby="flush-heading04" data-bs-parent="#accordionFlushExample">
            <div class="accordion-body">
              <SpeechSettings />
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header" id="flush-heading05">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse05" aria-expanded="false" aria-controls="flush-collapse05">
              <i class="fa-regular fa-headset me-3"></i> Call Settings
            </button>
          </h2>
          <div id="flush-collapse05" class="accordion-collapse collapse" aria-labelledby="flush-heading05" data-bs-parent="#accordionFlushExample">
            <div class="accordion-body">
              <div className="mb-2">
                <div class="formLabel mw-100">
                  <label>Voicemail Detection</label><br />
                  <span className='iconGray'>Hang up or leave a voicemail if a voicemail is detected.</span>
                </div>
                <div className="cl-toggle-switch">
                  <label className="cl-switch">
                    <input type="checkbox" id="showAllCheck" />
                    <span></span>
                  </label>
                </div>
              </div>
              <div className="mb-2">
                <div class="formLabel mw-100">
                  <label>End Call on Silence</label><br />
                  <span className='iconGray'>Call will automatically terminated if there is silence.</span>
                </div>
                <div class="formRow flex-column align-items-start px-0 ">
                  <div class="row w-100"><div class="col-9"><input type="number" class="formItem" placeholder="1000" /></div><div class="col-3"><span className='textGray'>miliseconds</span></div></div></div>
              </div>
              <div className="mb-2">
                <div class="formLabel mw-100">
                  <label>Max call duration</label><br />
                  <span className='iconGray'>Call will automatically terminated after this duration.</span>
                </div>
                <div class="formRow flex-column align-items-start px-0 ">

                  <div class="row w-100"><div class="col-9"><input type="number" class="formItem" placeholder="3600000" /></div><div class="col-3"><span className='textGray'>miliseconds</span></div></div></div>
              </div>
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header" id="flush-heading06">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse06" aria-expanded="false" aria-controls="flush-collapse06">
              <i class="fa-regular fa-chart-line me-3"></i>  Post-Call Analysis
            </button>
          </h2>
          <div id="flush-collapse06" class="accordion-collapse collapse" aria-labelledby="flush-heading06" data-bs-parent="#accordionFlushExample">
            <div class="accordion-body">
              <div className="mb-2">
                <div class="formLabel mw-100">
                  <label>Post Call Data Retrieval</label><br />
                  <span className='iconGray'>Define the information that you need to extract from the call.</span>
                </div>
                <ul>
                  <li>
                    <div class="noticeMessageBox justify-content-between">
                      <div className='d-flex align-items-center gap-2'>
                        <i class="fa-solid fa-arrow-up-right iconGray"></i>
                        <p class="mb-0 f-s-14">detailed_call_summary</p>
                      </div>
                      <div className='d-flex align-items-center gap-1'>
                        <button className="clearButton text-align-start" onClick={setEditPostCallPopup}>
                          <i class="fa-regular fa-pen-to-square"></i>
                        </button>
                        <button className="clearButton text-align-start text-danger" >
                          <i class="fa-regular fa-trash-can"></i>
                        </button>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="dropdown">
                <button className="panelButton static mt-3 dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <span class="text"><i class="fa-regular fa-plus me-2"></i> Add</span>
                </button>
                <ul class="dropdown-menu">
                  <li><button class="dropdown-item" onClick={setEditPostCallPopup}><i class="fa-solid fa-align-left me-2"></i> Text</button></li>
                  <li><button class="dropdown-item" onClick={setEditPostCallPopup}><i class="fa-solid fa-list-ul me-2"></i> Selector</button></li>
                  <li><button class="dropdown-item" onClick={setEditPostCallPopup}><i class="fa-solid fa-ban me-2"></i> Boolean</button></li>
                  <li><button class="dropdown-item" onClick={setEditPostCallPopup}><i class="fa-solid fa-arrow-up-9-1 me-2"></i> Number</button></li>

                </ul>
              </div>
              <div class="dropdown ms-2">
                <button class="aitable_button static  w-100 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  gpt-4.1-nano
                </button>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#">Action</a></li>
                  <li><a class="dropdown-item" href="#">Another action</a></li>
                  <li><a class="dropdown-item" href="#">Something else here</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header" id="flush-heading07">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse07" aria-expanded="false" aria-controls="flush-collapse07">
              <i class="fa-regular fa-shield-check me-3"></i>  Security & Fallback Settings
            </button>
          </h2>
          <div id="flush-collapse07" class="accordion-collapse collapse" aria-labelledby="flush-heading07" data-bs-parent="#accordionFlushExample">
            <div class="accordion-body">
              <div className="mb-2">
                <div class="formLabel mw-100">
                  <label>Opt Out Sensitive Data Storage</label><br />
                  <span className='iconGray'>Control whether Retell should store sensitive data. (Learn more)</span>
                </div>
                <div className="cl-toggle-switch">
                  <label className="cl-switch">
                    <input type="checkbox" id="showAllCheck" />
                    <span></span>
                  </label>
                </div>
              </div>
              <div className="mb-2">
                <div class="formLabel mw-100">
                  <label>Opt In Secure URLs</label><br />
                  <span className='iconGray'>Add security signatures to URLs. The URLs expire after 24 hours.</span>
                </div>
                <div className="cl-toggle-switch">
                  <label className="cl-switch">
                    <input type="checkbox" id="showAllCheck" />
                    <span></span>
                  </label>
                </div>
              </div>
              <div className="mb-2">
                <div class="formLabel mw-100">
                  <label>Fallback Voice ID</label><br />
                  <span className='iconGray'>If the current voice provider fails, assign a fallback voice to continue the call.</span>
                </div>
                <div className="cl-toggle-switch">
                  <label className="cl-switch">
                    <input type="checkbox" id="showAllCheck" />
                    <span></span>
                  </label>
                </div>
              </div>
              <button className="panelButton static mt-3 " role="button" onClick={SetSelectVoice}>
                <span class="text"><i class="fa-regular fa-plus me-2"></i> Add</span>
              </button>
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header" id="flush-heading08">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse08" aria-expanded="false" aria-controls="flush-collapse08">
              <i class="fa-regular fa-webhook me-3"></i>Webhook Settings
            </button>
          </h2>
          <div id="flush-collapse08" class="accordion-collapse collapse" aria-labelledby="flush-heading08" data-bs-parent="#accordionFlushExample">
            <div class="accordion-body">
              <div className="mb-2">
                <div class="formLabel mw-100">
                  <label>Inbound Call Webhook URL</label><br />
                  <span className='iconGray'>The webhook has been migrated to phone level webhook. (Learn more).</span>
                </div>
                <div className="formRow flex-column align-items-start px-0">

                  <div className="col-12">
                    <input
                      type="text"
                      className="formItem"
                      placeholder=''
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>




      {/* ==================================================== all popup */}
      {/* ==================================================== function start*/}
      {/* ============================= end call */}

      {endCallPopup &&
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
                          End call
                        </h5>
                      </div>
                      <button className="clearButton2 xl" onClick={() => setEndCallPopup(false)}>
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body aiAgentTab p-3">
                    <div className="formRow flex-column align-items-start px-0">
                      <div className="formLabel">
                        <label>Name</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          placeholder='Enter Name'
                        />
                      </div>
                    </div>
                    <div className="formRow flex-column align-items-start px-0 ">
                      <div className="formLabel">
                        <label>Description <span>(Optional)</span></label>
                      </div>
                      <div className="col-12">
                        <textarea
                          type="text"
                          className="formItem h-auto"
                          rows={3}
                          placeholder='Enter Description'
                        />
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
                          setEndCallPopup(false);
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

      {/* =============================  Call Transfer */}

      {callTransferPopup &&
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
                          Call Transfer
                        </h5>
                      </div>
                      <button className="clearButton2 xl" onClick={() => setCallTransferPopup(false)}>
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body aiAgentTab p-3">
                    <div className="formRow flex-column align-items-start px-0">
                      <div className="formLabel">
                        <label>Name</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          placeholder='Enter Name'
                        />
                      </div>
                    </div>
                    <div className="formRow flex-column align-items-start px-0 ">
                      <div className="formLabel">
                        <label>Description <span>(Optional)</span></label>
                      </div>
                      <div className="col-12">
                        <textarea
                          type="text"
                          className="formItem h-auto"
                          rows={3}
                          placeholder='Enter Description'
                        />
                      </div>
                    </div>
                    <div className="formLabel">
                      <label>Transfer to</label>
                    </div>
                    <div class="mt-2 baseNav">
                      <ul class="nav nav-pills" id="pills-tab" role="tablist">
                        <li class="nav-item" role="presentation">
                          <button class="nav-link active" id="webPAge-tab" data-bs-toggle="pill" data-bs-target="#webPAge" type="button" role="tab" aria-controls="webPAge" aria-selected="true">Static Number</button>
                        </li>
                        <li class="nav-item" role="presentation">
                          <button class="nav-link" id="upload-tab" data-bs-toggle="pill" data-bs-target="#upload" type="button" role="tab" aria-controls="upload" aria-selected="false">Dynamic Routing</button>
                        </li>

                      </ul>
                      <div class="tab-content" id="pills-tabContent">
                        <div class="tab-pane fade show active" id="webPAge" role="tabpanel" aria-labelledby="webPAge-tab">

                          <form>
                            <div className="formRow flex-column align-items-start">
                              <div className="col-12">
                                <input
                                  type="text"
                                  className="formItem"
                                  placeholder='+1xxxxxxxxxx'
                                />
                                <span>Enter a static phone number or dynamic variable.</span>
                              </div>
                            </div>
                          </form>
                        </div>
                        <div class="tab-pane fade pb-3" id="upload" role="tabpanel" aria-labelledby="upload-tab">
                          <div className="formRow flex-column align-items-start px-0 ">
                            <div className="formLabel">
                              <label>Welcome Message</label>
                            </div>
                            <div className="col-12">
                              <textarea
                                type="text"
                                className="formItem h-auto"
                                rows={3}
                                placeholder='Enter prompt to infer the destinaton number.'
                              />
                              <span>Use a prompt to handle dynamic call transfer routing.</span>
                            </div>
                          </div>

                        </div>



                      </div>
                    </div>
                    <div className="formLabel mb-2">
                      <label>Type</label>
                    </div>
                    <div className="row radio-input px-2">
                      {/* Radio Buttons */}
                      <div className="col-6">
                        <label className="label radioLabel">
                          <p className="text">
                            Cold Transfer <i className="fa-regular fa-circle-exclamation ms-2"></i>
                          </p>
                          <input
                            type="radio"
                            id="cold"
                            name="transferType"
                            value="cold"
                            checked={selectedTransfer === 'cold'}
                            onChange={() => setSelectedTransfer('cold')}
                          />
                        </label>
                      </div>

                      <div className="col-6">
                        <label className="label radioLabel">
                          <p className="text">
                            Warm Transfer <i className="fa-regular fa-circle-exclamation ms-2"></i>
                          </p>
                          <input
                            type="radio"
                            id="warm"
                            name="transferType"
                            value="warm"
                            checked={selectedTransfer === 'warm'}
                            onChange={() => setSelectedTransfer('warm')}
                          />
                        </label>
                      </div>

                      {/* Cold Transfer UI */}
                      {selectedTransfer === 'cold' && (
                        <div className="mt-3">
                          <p className="mb-0 fs-12 formLabel">Displayed Phone Number</p>
                          <p className="mb-0 f-s-14 formLabel">Show transferee's number</p>
                          <div className="cl-toggle-switch">
                            <label className="cl-switch">
                              <input type="checkbox" id="showAllCheck" />
                              <span></span>
                            </label>
                          </div>

                        </div>
                      )}

                      {/* Warm Transfer UI */}
                      {selectedTransfer === 'warm' && (
                        <>
                          <div className="formLabel mt-2">
                            <label>Handoff message</label>
                          </div>
                          <div className="mt-2 baseNav">
                            <ul className="nav nav-pills" id="pills-tab" role="tablist">
                              <li className="nav-item" role="presentation">
                                <button
                                  className="nav-link active"
                                  id="tab01-tab"
                                  data-bs-toggle="pill"
                                  data-bs-target="#tab01"
                                  type="button"
                                  role="tab"
                                  aria-controls="tab01"
                                  aria-selected="true"
                                >
                                  Prompt
                                </button>
                              </li>
                              <li className="nav-item" role="presentation">
                                <button
                                  className="nav-link"
                                  id="tab02-tab"
                                  data-bs-toggle="pill"
                                  data-bs-target="#tab02"
                                  type="button"
                                  role="tab"
                                  aria-controls="tab02"
                                  aria-selected="false"
                                >
                                  Static Sentence
                                </button>
                              </li>
                            </ul>

                            <div className="tab-content" id="pills-tabContent">
                              <div
                                className="tab-pane fade show active"
                                id="tab01"
                                role="tabpanel"
                                aria-labelledby="tab01-tab"
                              >
                                <div className="formRow flex-column align-items-start px-0">
                                  <div className="col-12">
                                    <textarea
                                      className="formItem h-auto"
                                      rows={3}
                                      placeholder="Say hello to the agent and summarize the user problem to him"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div
                                className="tab-pane fade pb-3"
                                id="tab02"
                                role="tabpanel"
                                aria-labelledby="tab02-tab"
                              >
                                <div className="formRow flex-column align-items-start px-0">
                                  <div className="col-12">
                                    <textarea
                                      className="formItem h-auto"
                                      rows={3}
                                      placeholder="Enter static message"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                        </>
                      )}
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
                          setCallTransferPopup(false);
                        }}
                      >
                        <span className="text">Cancel</span>
                        <span className="icon">
                          <i className="fa-solid fa-xmark"></i>
                        </span>
                      </button>
                    </div>
                  </div>
                  {/* </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      {/* =============================  Check Calendar Availability */}

      {checkCalendarAvailabilityPopup &&
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
                          Check Calendar Availability (Cal.com)
                        </h5>
                      </div>
                      <button className="clearButton2 xl" onClick={() => setCheckCalendarAvailabilityPopup(false)}>
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body aiAgentTab p-3">
                    <div className="formRow flex-column align-items-start px-0">
                      <div className="formLabel">
                        <label>Name</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          placeholder='Enter Name'
                        />
                      </div>
                    </div>
                    <div className="formRow flex-column align-items-start px-0 ">
                      <div className="formLabel">
                        <label>Description <span>(Optional)</span></label>
                      </div>
                      <div className="col-12">
                        <textarea
                          type="text"
                          className="formItem h-auto"
                          rows={3}
                          placeholder='Enter Description'
                        />
                      </div>
                    </div>
                    <div className="formRow flex-column align-items-start px-0">
                      <div className="formLabel">
                        <label>API Key (Cal.com)</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          placeholder='Enter Name'
                        />
                      </div>
                    </div>
                    <div className="formRow flex-column align-items-start px-0">
                      <div className="formLabel">
                        <label>Event Type ID (Cal.com)</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          placeholder='Enter Name'
                        />
                      </div>
                    </div>
                    <div className="formRow flex-column align-items-start px-0">
                      <div className="formLabel">
                        <label>Timezone <span>(Optional)</span></label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          placeholder='Enter Name'
                        />
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
                          setCheckCalendarAvailabilityPopup(false);
                        }}
                      >
                        <span className="text">Cancel</span>
                        <span className="icon">
                          <i className="fa-solid fa-xmark"></i>
                        </span>
                      </button>
                    </div>
                  </div>
                  {/* </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      {/* =============================  Book on the Calendar (Cal.com) */}

      {bookCalendarPopup &&
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
                          Check Calendar Availability (Cal.com)
                        </h5>
                      </div>
                      <button className="clearButton2 xl" onClick={() => setBookCalendarPopup(false)}>
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body aiAgentTab p-3">
                    <div className="formRow flex-column align-items-start px-0">
                      <div className="formLabel">
                        <label>Name</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          placeholder='Enter Name'
                        />
                      </div>
                    </div>
                    <div className="formRow flex-column align-items-start px-0 ">
                      <div className="formLabel">
                        <label>Description <span>(Optional)</span></label>
                      </div>
                      <div className="col-12">
                        <textarea
                          type="text"
                          className="formItem h-auto"
                          rows={3}
                          placeholder='Enter Description'
                        />
                      </div>
                    </div>
                    <div className="formRow flex-column align-items-start px-0">
                      <div className="formLabel">
                        <label>API Key (Cal.com)</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          placeholder='Enter Name'
                        />
                      </div>
                    </div>
                    <div className="formRow flex-column align-items-start px-0">
                      <div className="formLabel">
                        <label>Event Type ID (Cal.com)</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          placeholder='Enter Name'
                        />
                      </div>
                    </div>
                    <div className="formRow flex-column align-items-start px-0">
                      <div className="formLabel">
                        <label>Timezone <span>(Optional)</span></label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          placeholder='Enter Name'
                        />
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
                          setBookCalendarPopup(false);
                        }}
                      >
                        <span className="text">Cancel</span>
                        <span className="icon">
                          <i className="fa-solid fa-xmark"></i>
                        </span>
                      </button>
                    </div>
                  </div>
                  {/* </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      {/* =============================  Press Digits (IVR Navigation) */}

      {pressDigitsPopup &&
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
                          Check Calendar Availability (Cal.com)
                        </h5>
                      </div>
                      <button className="clearButton2 xl" onClick={() => setPressDigitsPopup(false)}>
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body aiAgentTab p-3">
                    <div className="formRow flex-column align-items-start px-0">
                      <div className="formLabel">
                        <label>Name</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          placeholder='Enter Name'
                        />
                      </div>
                    </div>
                    <div className="formRow flex-column align-items-start px-0 ">
                      <div className="formLabel">
                        <label>Description <span>(Optional)</span></label>
                      </div>
                      <div className="col-12">
                        <textarea
                          type="text"
                          className="formItem h-auto"
                          rows={3}
                          placeholder='Enter Description'
                        />
                      </div>
                    </div>
                    <div className='w-100'>
                      <div className="formRow flex-column align-items-start px-0 ">
                        <div className="formLabel">
                          <label>Description <span>(Optional)</span>
                            <Tippy content="Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make">
                              <button className="clearButton text-align-start" >
                                <i class="fa-regular fa-circle-exclamation "></i>
                              </button>

                            </Tippy>
                          </label>
                        </div>
                        <div className='row w-100'>
                          <div className="col-9">
                            <input
                              type="number"
                              className="formItem"
                              placeholder='1000'
                            />
                          </div>
                          <div className="col-3">
                            <span>miliseconds</span>
                          </div>
                        </div>
                      </div>
                      {/* <div className="formRow flex-column align-items-start px-0 ">
                        <div className="formLabel">
                          <label>miliseconds</label>
                        </div>
                      </div> */}

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
                          setPressDigitsPopup(false);
                        }}
                      >
                        <span className="text">Cancel</span>
                        <span className="icon">
                          <i className="fa-solid fa-xmark"></i>
                        </span>
                      </button>
                    </div>
                  </div>
                  {/* </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      {/* ============================= Custom Function */}

      {customFunctionPopup &&
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
                          Custom Function
                        </h5>
                      </div>
                      <button className="clearButton2 xl" onClick={() => setCustomFunctionPopup(false)}>
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body aiAgentTab p-3">
                    <div className="formRow flex-column align-items-start px-0">
                      <div className="formLabel">
                        <label>Name</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          placeholder='Enter Name'
                        />
                      </div>
                    </div>
                    <div className="formRow flex-column align-items-start px-0 ">
                      <div className="formLabel">
                        <label>Description </label>
                      </div>
                      <div className="col-12">
                        <textarea
                          type="text"
                          className="formItem h-auto"
                          rows={3}
                          placeholder='Enter Description'
                        />
                      </div>
                    </div>
                    <div className="formRow flex-column align-items-start px-0">
                      <div className="formLabel">
                        <label>Your URL</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          placeholder='Enter the url of Custom Function'
                        />
                      </div>
                    </div>
                    <div className='w-100'>
                      <div className="formRow flex-column align-items-start px-0 ">
                        <div className="formLabel">
                          <label>Description <span>(Optional)</span>
                            <Tippy content="Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make">
                              <button className="clearButton text-align-start" >
                                <i class="fa-regular fa-circle-exclamation "></i>
                              </button>

                            </Tippy>
                          </label>
                        </div>
                        <div className='row w-100'>
                          <div className="col-9">
                            <input
                              type="number"
                              className="formItem"
                              placeholder='1000'
                            />
                          </div>
                          <div className="col-3">
                            <span>miliseconds</span>
                          </div>
                        </div>
                      </div>
                      {/* <div className="formRow flex-column align-items-start px-0 ">
                        <div className="formLabel">
                          <label>miliseconds</label>
                        </div>
                      </div> */}

                    </div>

                    <div className="formRow flex-column align-items-start px-0">
                      <div className="formLabel">
                        <label>Parameters (Optional)</label>
                      </div>
                      <span>JSON schema that defines the format in which the LLM will return. Please refer to the docs.</span>
                      <div className="col-12">
                        <textarea
                          type="text"
                          className="formItem h-auto"
                          rows={3}
                          placeholder='Enter JSON schema here...'
                        />
                      </div>
                    </div>

                    <div className="py-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="toggleWebhook"
                      />
                      <label className="form-check-label ms-3" htmlFor="toggleWebhook">
                        Speak During Execution<br />
                        <span>text-muted-foreground text-sm</span>
                      </label>

                      <div className="formRow flex-column align-items-start px-0 showUrl">

                        <div className="col-12">
                          <input
                            type="text"
                            className="formItem"
                            placeholder="Enter the execution message description"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="toggleWebhook"
                      />
                      <label className="form-check-label ms-3" htmlFor="toggleWebhook">
                        Speak After Execution <br /> <span>Unselect if you want to run the function silently, such as uploading the call result to the server silently.</span>
                      </label>
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
                          setCustomFunctionPopup(false);
                        }}
                      >
                        <span className="text">Cancel</span>
                        <span className="icon">
                          <i className="fa-solid fa-xmark"></i>
                        </span>
                      </button>
                    </div>
                  </div>
                  {/* </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      {/* ============================= edit Custom Function */}

      {editCustomFunctionPopup &&
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
                          Custom Function
                        </h5>
                      </div>
                      <button className="clearButton2 xl" onClick={() => setEditCustomFunctionPopup(false)}>
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body aiAgentTab p-3">
                    <div className="formRow flex-column align-items-start px-0">
                      <div className="formLabel">
                        <label>Name</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          placeholder='Check_Flight'
                        />
                      </div>
                    </div>
                    <div className="formRow flex-column align-items-start px-0 ">
                      <div className="formLabel">
                        <label>Description </label>
                      </div>
                      <div className="col-12">
                        <textarea
                          type="text"
                          className="formItem h-auto"
                          rows={3}
                          placeholder='Use for flight search'
                        />
                      </div>
                    </div>
                    <div className="formRow flex-column align-items-start px-0">
                      <div className="formLabel">
                        <label>Your URL</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          placeholder='https://webvio.app.n8n.cloud/webhook-test/a3845445-6f83-4573-94d6-a1ec9fe9511c'
                        />
                      </div>
                    </div>
                    <div className='w-100'>
                      <div className="formRow flex-column align-items-start px-0 ">
                        <div className="formLabel">
                          <label>Description <span>(Optional)</span>
                            <Tippy content="Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make">
                              <button className="clearButton text-align-start" >
                                <i class="fa-regular fa-circle-exclamation "></i>
                              </button>

                            </Tippy>
                          </label>
                        </div>
                        <div className='row w-100'>
                          <div className="col-9">
                            <input
                              type="number"
                              className="formItem"
                              placeholder='1000'
                            />
                          </div>
                          <div className="col-3">
                            <span>miliseconds</span>
                          </div>
                        </div>
                      </div>
                      {/* <div className="formRow flex-column align-items-start px-0 ">
                        <div className="formLabel">
                          <label>miliseconds</label>
                        </div>
                      </div> */}

                    </div>

                    <div className="formRow flex-column align-items-start px-0">
                      <div className="formLabel">
                        <label>Parameters (Optional)</label>
                      </div>
                      <span>JSON schema that defines the format in which the LLM will return. Please refer to the docs.</span>
                      <div className="col-12">
                        <textarea
                          type="text"
                          className="formItem h-auto"
                          rows={3}
                          placeholder='Enter JSON schema here...'
                        />
                      </div>
                    </div>

                    <div className="py-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="toggleWebhook"
                      />
                      <label className="form-check-label ms-3" htmlFor="toggleWebhook">
                        Speak During Execution<br />
                        <span>text-muted-foreground text-sm</span>
                      </label>

                      <div className="formRow flex-column align-items-start px-0 showUrl">

                        <div className="col-12">
                          <input
                            type="text"
                            className="formItem"
                            placeholder="Enter the execution message description"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="toggleWebhook"
                      />
                      <label className="form-check-label ms-3" htmlFor="toggleWebhook">
                        Speak After Execution <br /> <span>Unselect if you want to run the function silently, such as uploading the call result to the server silently.</span>
                      </label>
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
                          setEditCustomFunctionPopup(false);
                        }}
                      >
                        <span className="text">Cancel</span>
                        <span className="icon">
                          <i className="fa-solid fa-xmark"></i>
                        </span>
                      </button>
                    </div>
                  </div>
                  {/* </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      {/* ==================================================== function end */}

      {/* ==================================================== Agent Settings  */}


      {/* --------------- select voice */}

      {selectVoice &&
        <div className="popup ">
          <div className="popup music">
            <div className="container h-100">
              <div className="row h-100 justify-content-center align-items-center">
                <div
                  className="card px-0 col-5 shadow-none card80"
                  style={{
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <div className="card-header bg-transparent ">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="card-title fs14 fw700 mb-0">
                          Custom Function
                        </h5>
                      </div>
                      <button className="clearButton2 xl" onClick={() => SetSelectVoice(false)}>
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body aiAgentTab p-3">
                    <div className='d-flex align-items-center gap-2 mb-4'>
                      <div className='col-auto'>
                        <button className='panelButton static gray'>Elevenlabs</button>
                      </div>
                      <div className='col-lg-3'>
                        <Select
                          className="basic-single "
                          classNamePrefix="select"
                          // defaultValue={colourOptions[0]}
                          // isDisabled={isDisabled}
                          // isLoading={isLoading}
                          // isClearable={isClearable}
                          // isRtl={isRtl}
                          // isSearchable={isSearchable}
                          name="color"
                        // options={colourOptions}
                        />
                      </div>
                      <div className='col-lg-3'>
                        <Select
                          className="basic-single "
                          classNamePrefix="select"
                          // defaultValue={colourOptions[0]}
                          // isDisabled={isDisabled}
                          // isLoading={isLoading}
                          // isClearable={isClearable}
                          // isRtl={isRtl}
                          // isSearchable={isSearchable}
                          name="color"
                        // options={colourOptions}
                        />
                      </div>
                    </div>
                    <div className="tableContainer">
                      <table>
                        <thead>
                          <tr>
                            <th></th>
                            <th>Voice</th>
                            <th>Accent</th>
                            <th>Age</th>
                            <th>Gender</th>
                            <th>Provider</th>

                          </tr>
                        </thead>
                        <tbody className="">
                          <>
                            <tr>
                              <td>
                                <button className='clearButton text-align-start' onClick={() => setIsPlaying(!isPlaying)}>
                                  {isPlaying ? (
                                    <i className="fa-regular fa-circle-pause fs-5"></i>
                                  ) : (
                                    <i className="fa-regular fa-circle-play fs-5"></i>
                                  )}
                                </button>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="tableProfilePicHolder">
                                    {/* <img
                                                            alt="profile"
                                                            src={item.profile_picture}
                                                           src={require('../../assets/images/placeholder-image.webp')}
                                                          />
                                                        ) : ( */}
                                    <i className="fa-light fa-user" />
                                    {/* )} */}
                                  </div>
                                  <div className="ms-2">ravi raj</div>
                                </div>
                              </td>
                              <td>conversation flow</td>
                              <td>14844731350</td>
                              <td>en-US</td>
                              <td><Link to='' className='urlText text-success'><i class="fa-regular fa-check me-2"></i> Use the Voice</Link></td>
                            </tr>
                          </>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      {editPostCallPopup &&
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
                          Text
                        </h5>
                      </div>
                      <button className="clearButton2 xl" onClick={() => setEditPostCallPopup(false)}>
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body aiAgentTab p-3">
                    <div className="formRow flex-column align-items-start px-0">
                      <div className="formLabel">
                        <label>Name</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          placeholder='detailed_call_summary'
                        />
                      </div>
                    </div>
                    <div className="formRow flex-column align-items-start px-0 ">
                      <div className="formLabel">
                        <label>Description </label>
                      </div>
                      <div className="col-12">
                        <textarea
                          type="text"
                          className="formItem h-auto"
                          rows={3}
                          placeholder='Detailed summary of the call before you transfer the call to a human agent so that the human agent can understand the context of the call'
                        />
                      </div>
                    </div>
                    <div className="formLabel">
                      <label>Format Example (Optional)</label>
                    </div>
                    <div className='d-flex align-items-center gap-2 '>
                      <div className="formRow flex-column align-items-start px-0 w-100">
                        <div className="col-12">
                          <div className="col-12">
                            <input
                              type="text"
                              className="formItem"
                              placeholder='detailed_call_summary'
                            />
                          </div>
                        </div>
                      </div>
                      <button class="aitable_button bg-transparent text-danger"><i class="fa-regular fa-trash-can"></i></button>
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
                          setEditPostCallPopup(false);
                        }}
                      >
                        <span className="text">Cancel</span>
                        <span className="icon">
                          <i className="fa-solid fa-xmark"></i>
                        </span>
                      </button>
                    </div>
                  </div>
                  {/* </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      }



    </>
  )
}

export default FlowAccordionContent