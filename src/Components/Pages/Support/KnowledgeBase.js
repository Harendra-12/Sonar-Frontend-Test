import React from 'react'
import Header from '../../CommonComponents/Header'

function KnowledgeBase() {
    return (
        <main className="mainContent">
            <section id="phonePage">
                <div className="container-fluid">
                    <div className="row">
                        <Header title="Knowledge Base" />
                    </div>
                </div>
                <div className='container'>
                    <div className='row'>
                        <div className="overviewTableWrapper0">
                            <div className="overviewTableChild0">
                                <div className="d-flex flex-wrap">
                                    <div className="col-12">
                                        <div className="heading">
                                            <div className="content mt-5 d-flex align-items-center justify-content-center">
                                                <h5 style={{ fontSize: "32px" }} >How can we help you?</h5>
                                                {/* <p>You can see the list of Call Desposition</p> */}
                                            </div>
                                            {/* <div className="buttonGroup">
                                                <button
                                                    effect="ripple"
                                                    className="panelButton gray">
                                                    <span className="text">Back</span>
                                                    <span className="icon">
                                                        <i class="fa-solid fa-caret-left"></i>
                                                    </span>
                                                </button>
                                                <Link

                                                    to="#"

                                                    effect="ripple"
                                                    className="panelButton" >
                                                    <span className="text">Buy</span>
                                                    <span className="icon">
                                                        <i class="fa-solid fa-cart-shopping"></i>
                                                    </span>
                                                </Link>
                                            </div> */}
                                        </div>
                                    </div>
                                    <div
                                        className="col-12"
                                        style={{ overflow: "auto", padding: "25px 20px 0", }} >
                                        <div className="tableHeader0">
                                            {/* <div className="showEntries">
                                                <label>Show</label>
                                                <select
                                                    className="formItem"

                                                >
                                                    <option value={10}>10</option>
                                                    <option value={20}>20</option>
                                                    <option value={30}>30</option>
                                                </select>
                                                <label>entries</label>
                                            </div> */}
                                            <div className="searchBoxlable">
                                                <div className="inputWrappers">
                                                    <i className="fas fa-search searchIcon"></i>
                                                    <input
                                                        type="text"
                                                        placeholder="Ask us anything"
                                                        className="formItem form-left" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className=' mt-5  align-items-center justify-content-center'>
                                            <div className="content d-flex align-items-center justify-content-center">
                                                <p>Frequently asked questions</p>
                                            </div>
                                            <div>
                                                <div className='row mt-3'>
                                                    <div className="col-xl-4 mb-xl-4"
                                                        style={{ cursor: "pointer" }}>
                                                        <div className="itemWrapper a d-flex align-items-center  justify-content-between ">
                                                            <div className="heading ">
                                                                <div className="d-flex align-items-center justify-content-between ">
                                                                    <h6>How do I manage my incoming call settings?</h6>
                                                                    <div className="col-3 text-end">
                                                                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-4 mb-xl-4"
                                                        style={{ cursor: "pointer" }}>
                                                        <div className="itemWrapper a d-flex align-items-center  justify-content-center ">
                                                            <div className="heading ">
                                                                <div className="d-flex align-items-center  justify-content-between ">
                                                                    <h6>How do I send fax ?</h6>
                                                                    <div className="col-3 text-end">
                                                                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-4 mb-xl-4"
                                                        style={{ cursor: "pointer" }}>
                                                        <div className="itemWrapper a d-flex align-items-center  justify-content-center ">
                                                            <div className="heading">
                                                                <div className="d-flex align-items-center  justify-content-between ">
                                                                    <h6>How do I setup my deskphopne?</h6>
                                                                    <div className="col-3 text-end">
                                                                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-4 mb-xl-4"
                                                        style={{ cursor: "pointer" }}>
                                                        <div className="itemWrapper a d-flex align-items-center  justify-content-center ">
                                                            <div className="heading ">
                                                                <div className="d-flex align-items-center  justify-content-between ">
                                                                    <h6>What do I need to do to register my business SMS with TCR?</h6>
                                                                    <div className="col-3 text-end">
                                                                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-4 mb-xl-4"
                                                        style={{ cursor: "pointer" }}>
                                                        <div className="itemWrapper a d-flex align-items-center  justify-content-center ">
                                                            <div className="heading ">
                                                                <div className="d-flex align-items-center  justify-content-between ">
                                                                    <h6>Why can't I sign in to the Admin Portal or the RingCentral app?</h6>
                                                                    <div className="col-3 text-end">
                                                                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-4 mb-xl-4"
                                                        style={{ cursor: "pointer" }}>
                                                        <div className="itemWrapper a d-flex align-items-center  justify-content-center ">
                                                            <div className="heading ">
                                                                <div className="d-flex align-items-center  justify-content-between ">
                                                                    <h6>How do I create custom call rules for holidays or after hours?</h6>
                                                                    <div className="col-3 text-end">
                                                                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>



                                        <div className=' mt-5  align-items-center justify-content-center'>
                                            <div className="content d-flex align-items-center justify-content-center">
                                                <p>Popular video tutorials</p>
                                            </div>
                                            <div>
                                                <div className='row mt-3'>
                                                    <div className="col-xl-4 mb-xl-4"
                                                        style={{ cursor: "pointer" }}>
                                                        <div className="itemWrapper a d-flex align-items-center  justify-content-center ">
                                                            <div className="heading0 ">
                                                                <div className="d-flex align-items-center  justify-content-center ">
                                                                    <div>
                                                                        <video controls>
                                                                            <source src="https://www.youtube.com/watch?v=JGzOe84w8Gc" type="video/ogg" />
                                                                            Your browser does not support the video tag.
                                                                        </video>
                                                                        <div class="heading">
                                                                            <h4>Call Dashboard Provider</h4>
                                                                            <p>Customize how you want your main company number to ring.</p></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-4  mb-xl-4"
                                                        style={{ cursor: "pointer" }}>
                                                        <div className="itemWrapper a d-flex align-items-center  justify-content-center ">
                                                            <div className="heading0 ">
                                                                <div className="d-flex align-items-center  justify-content-center ">
                                                                    <div>
                                                                        <video controls>
                                                                            <source src="https://www.youtube.com/watch?v=JGzOe84w8Gc" type="video/ogg" />
                                                                            Your browser does not support the video tag.
                                                                        </video>
                                                                        <div class="heading">
                                                                            <h4>Company call handling</h4>
                                                                            <p>Use the Admin Portal to set up phone settings for users within your account.</p></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-4  mb-xl-4"
                                                        style={{ cursor: "pointer" }}>
                                                        <div className="itemWrapper a d-flex align-items-center  justify-content-center ">
                                                            <div className="heading0 ">
                                                                <div className="d-flex align-items-center  justify-content-center ">
                                                                    <div>
                                                                        <video controls>
                                                                            <source src="https://www.youtube.com/watch?v=JGzOe84w8Gc" type="video/ogg" />
                                                                            Your browser does not support the video tag.
                                                                        </video>
                                                                        <div class="heading">
                                                                            <h4>Personal call handling</h4>
                                                                            <p>Set up where calls ring, when greetings play, and what happens to missed calls.</p></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-4  mb-xl-4"
                                                        style={{ cursor: "pointer" }}>
                                                        <div className="itemWrapper a d-flex align-items-center  justify-content-center ">
                                                            <div className="heading0 ">
                                                                <div className="d-flex align-items-center  justify-content-center ">
                                                                    <div>
                                                                        <video controls>
                                                                            <source src="https://www.youtube.com/watch?v=JGzOe84w8Gc" type="video/ogg" />
                                                                            Your browser does not support the video tag.
                                                                        </video>
                                                                        <div class="heading">
                                                                            <h4>Active Call Management</h4>
                                                                            <p>Mute, record, transfer, and park active calls.</p></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-4  mb-xl-4"
                                                        style={{ cursor: "pointer" }}>
                                                        <div className="itemWrapper a d-flex align-items-center  justify-content-center ">
                                                            <div className="heading0 ">
                                                                <div className="d-flex align-items-center  justify-content-center ">
                                                                    <div>
                                                                        <video controls>
                                                                            <source src="https://www.youtube.com/watch?v=JGzOe84w8Gc" type="video/ogg" />
                                                                            Your browser does not support the video tag.
                                                                        </video>
                                                                        <div class="heading">
                                                                            <h4>Call forwarding</h4>
                                                                            <p>Learn how to send calls to voicemail, forward to another number, or play an announcement.</p></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-4  mb-xl-4"
                                                        style={{ cursor: "pointer" }}>
                                                        <div className="itemWrapper a d-flex align-items-center  justify-content-center ">
                                                            <div className="heading0 ">
                                                                <div className="d-flex align-items-center  justify-content-center ">
                                                                    <div>
                                                                        <video controls>
                                                                            <source src="https://www.youtube.com/watch?v=JGzOe84w8Gc" type="video/ogg" />
                                                                            Your browser does not support the video tag.
                                                                        </video>
                                                                        <div class="heading">
                                                                            <h4>Voice mail setup</h4>
                                                                            <p>Learn how to send calls to voicemail, forward to another number, or play an announcement.</p></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className=' mt-5  align-items-center justify-content-center'>
                                            <div className="content d-flex align-items-center justify-content-center">
                                                <p>Additional resources</p>
                                            </div>
                                            <div>
                                                <div className='row mt-3'>
                                                    <div className="col-xl-4 mb-xl-4"
                                                        style={{ cursor: "pointer" }}>
                                                        <div className="itemWrapper a d-flex align-items-center  justify-content-between ">
                                                            <div className="heading ">
                                                                <div className="d-flex align-items-center justify-content-between ">
                                                                    <div className="col-3">
                                                                        <i class="fa-solid fa-computer float-start"></i>
                                                                    </div>
                                                                    <div>
                                                                        <h6>Check System status</h6>
                                                                        <p>Get RingCentral’s live connectivity updates.</p>
                                                                    </div>



                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-4 mb-xl-4"
                                                        style={{ cursor: "pointer" }}>
                                                        <div className="itemWrapper a d-flex align-items-center  justify-content-center ">
                                                            <div className="heading ">
                                                                <div className="d-flex align-items-center  justify-content-between ">
                                                                    <div className="col-3 text-end">
                                                                        <i class="fa-solid fa-users float-start"></i>
                                                                    </div>
                                                                    <div>
                                                                        <h6>Learn community</h6>
                                                                        <p>Discuss solutions and ideas with other RingCentral users.</p>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-4 mb-xl-4"
                                                        style={{ cursor: "pointer" }}>
                                                        <div className="itemWrapper a d-flex align-items-center  justify-content-center ">
                                                            <div className="heading">
                                                                <div className="d-flex align-items-center  justify-content-space-between ">
                                                                    <div className="col-3 text-start0">
                                                                        <i class="fa-solid fa-file-lines float-start"></i>
                                                                    </div>
                                                                    <div>
                                                                        <h6>Explore release notes</h6>
                                                                        <p>Stay updated with the latest RingCentral updates.</p>
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
                </div>
            </section>
        </main>
    )
}

export default KnowledgeBase