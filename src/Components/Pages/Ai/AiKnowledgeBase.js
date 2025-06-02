import React, { useState } from 'react'
import Header from '../../CommonComponents/Header'

const AiKnowledgeBase = () => {
  const [refreshState, setRefreshState] = useState(false)
  const [addKnowledgeBase, setKnowledgeBase] = useState(false)
  const [dataCopy, setDataCopy] = useState(false)
  const [idCopy, setIdCopy] = useState(false)
      const [deletePopup, setDeletePopup] = useState(false);


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
                                role="button"
                                onClick={setKnowledgeBase}
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
                                  <p className='text-end mb-2 f-s-14'>Last Update on : <strong> 5/26/2025</strong></p>
                                  <div className="buttonGroup">
                                    <button effect="ripple" className="panelButton edit" onClick={setKnowledgeBase}>
                                      <span className="text">Edit</span>
                                      <span className="icon">
                                        <i class="fa-solid fa-pen"></i>
                                      </span>
                                    </button>


                                    <button className="panelButton danger" onClick={setDeletePopup}>
                                      <span className="text">Delete</span>
                                      <span className="icon">
                                        <i class="fa-solid fa-trash"></i>
                                      </span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div className='k_body px-2'>
                                <div className="tableContainer">
                                  <table>
                                    {/* <thead>
                                      <tr>
                                        
                                        <th></th>
                                        <th></th>

                                      </tr>
                                    </thead> */}
                                    <tbody className="">
                                      <>
                                        <tr>
                                          <td colSpan={12}>
                                            <div className="d-flex align-items-center">
                                              <div className="table__icon">
                                                <i class="fa-solid fa-file-pdf"></i>
                                              </div>
                                              <div className="ms-2 detailsTable">
                                                <h5 className='mb-0'>google.com</h5>
                                                <p className='mb-0'>URL | 3MB</p>
                                              </div>
                                            </div>
                                          </td>
                                          <td>
                                            <div className='d-flex justify-content-end align-items-center gap-2'>
                                              <button className='aitable_button bg-transparent' onClick={() => setDataCopy(!dataCopy)}>

                                                <i className={
                                                  dataCopy
                                                    ? "fa-solid fa-check text_success"
                                                    : "fa-solid fa-clone"
                                                }
                                                ></i>
                                              </button>
                                              <button className='aitable_button bg-transparent'>
                                                <i class="fa-regular fa-arrow-down-to-line"></i>
                                              </button>
                                            </div>
                                          </td>

                                        </tr>


                                      </>
                                    </tbody>
                                  </table>
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


        {addKnowledgeBase &&
          <div className="popup ">
            <div className="popup music">
              <div className="container h-100">
                <div className="row h-100 justify-content-center align-items-center">
                  <div
                    className="card px-0 col-5 shadow-none"
                    style={{
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    <div className="card-header bg-transparent ">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="card-title fs14 fw700 mb-0">
                            Add Knowledge Base for Agent
                          </h5>
                          <p className='sub_text mb-0'>choose any type of data that best suits for your agent</p></div>
                        <button className="clearButton2 xl" onClick={() => setKnowledgeBase(false)}>
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </div>
                    </div>
                    <div className="card-body aiAgentTab p-3">
                      <div className='addFile_box'>
                        <h5 className="card-title fs14 border-bootm fw700 mb-3">
                          Added Files
                        </h5>
                        <div className='addFile_box p-2 d-flex justify-content-between align-items-center gap-1 mb-2'>
                          <div className='d-flex align-items-center gap-1'>
                            <i class="fa-regular fa-file me-2"></i>
                            <h5 className="card-title fs14 border-bootm fw700 mb-0">
                              dummy.pdf
                            </h5>
                          </div>
                          <button className='aitable_button bg-transparent d-flex justify-content-center align-items-center p-1 text-danger border-danger'>
                            <i className={`fa-regular fa-trash `}></i>
                          </button>
                        </div>
                        <div className='addFile_box p-2 d-flex justify-content-between align-items-center gap-1 mb-2'>
                          <div className='d-flex align-items-center gap-1'>
                            <i class="fa-regular fa-file me-2"></i>
                            <h5 className="card-title fs14 border-bootm fw700 mb-0">
                              dummy.pdf
                            </h5>
                          </div>
                          <button className='aitable_button bg-transparent d-flex justify-content-center align-items-center p-1 text-danger border-danger'>
                            <i className={`fa-regular fa-trash `}></i>
                          </button>
                        </div>

                      </div>

                      <form>
                        <div className="formRow flex-column align-items-start">
                          <div className="formLabel">
                            <label> Name:</label>
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
                      <div class="mt-3 baseNav">
                        <ul class="nav nav-pills" id="pills-tab" role="tablist">
                          <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="webPAge-tab" data-bs-toggle="pill" data-bs-target="#webPAge" type="button" role="tab" aria-controls="webPAge" aria-selected="true">Web Page</button>
                          </li>
                          <li class="nav-item" role="presentation">
                            <button class="nav-link" id="upload-tab" data-bs-toggle="pill" data-bs-target="#upload" type="button" role="tab" aria-controls="upload" aria-selected="false">Upload File</button>
                          </li>
                          <li class="nav-item" role="presentation">
                            <button class="nav-link" id="addText-tab" data-bs-toggle="pill" data-bs-target="#addText" type="button" role="tab" aria-controls="addText" aria-selected="false">Add Text</button>
                          </li>
                        </ul>
                        <div class="tab-content" id="pills-tabContent">
                          <div class="tab-pane fade show active" id="webPAge" role="tabpanel" aria-labelledby="webPAge-tab">

                            <form>
                              <div className="formRow flex-column align-items-start">
                                <div className="formLabel">
                                  <label> Web PAge URL</label>
                                </div>
                                <div className="col-12">
                                  <input
                                    type="text"
                                    className="formItem"
                                    placeholder='Enter Web page URl'
                                  />

                                </div>
                              </div>
                            </form>
                          </div>
                          <div class="tab-pane fade pb-3" id="upload" role="tabpanel" aria-labelledby="upload-tab">
                            <h5 className="card-title fs14 border-bootm fw700 mt-3">
                              Upload File
                            </h5>
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
                                    Drag and Drop or{" "}
                                    <span>Click on upload</span>
                                  </p>
                                  <span className='text2'>
                                    Supports formats : MP3, Max
                                    Size: 2MB
                                  </span>
                                </div>
                              </label>
                              {/* {fileName && (
                                                <p className="mt-3 text-center">
                                                    Selected File:{" "}
                                                    <strong>{fileName}</strong>
                                                </p>
                                            )} */}
                            </div>

                          </div>
                          <div class="tab-pane fade" id="addText" role="tabpanel" aria-labelledby="addText-tab">
                            <form>
                              <div className="formRow flex-column align-items-start">
                                <div className="formLabel">
                                  <label> File Name</label>
                                </div>
                                <div className="col-12">
                                  <input
                                    type="text"
                                    className="formItem"
                                    placeholder='Enter Web page URl'
                                  />
                                </div>
                              </div>
                              <div className="formRow flex-column align-items-start">
                                <div className="formLabel">
                                  <label>Content</label>
                                </div>
                                <div className="col-12">
                                  <textarea rows={8} className="formItem" placeholder='Enter Text'></textarea>
                                </div>
                              </div>
                            </form>

                          </div>
                        </div>
                      </div>
                    </div>
                    <div className=" card-footer d-flex justify-content-between">
                      <div className="d-flex justify-content-start">
                        <button className="panelButton add m-0" >
                          <span className="text">Add File</span>
                          <span className="icon">
                            <i className="fa-regular fa-plus"></i>
                          </span>
                        </button>

                      </div>
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
                            // setNewImage(null);
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

export default AiKnowledgeBase