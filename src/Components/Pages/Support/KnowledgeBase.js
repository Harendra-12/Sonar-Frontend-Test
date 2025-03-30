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
                <div className='container-fluid'>
                    <div className='row'>
                        <div className="overviewTableWrapper0 px-0">
                            <div className="overviewTableChild0">
                                <div className="d-flex flex-wrap">
                                    <div className="col-12">
                                        <div className='hero'>
                                            <div className="heading">
                                                <div className="content mt-5 d-flex align-items-center justify-content-center">
                                                    <h3 style={{ fontSize: "48px", color: "white" }} >How can we help you?</h3>
                                                </div>
                                            </div>
                                            <div className='col-7 mx-auto'><div className="tableHeader0">
                                                <div className="searchBoxlable">
                                                    <div className="inputWrappers">
                                                        <input
                                                            type="text"
                                                            placeholder="Search our article "
                                                            className="formItem form-left" />
                                                        <i className="fas fa-search searchIcon"></i>
                                                    </div>
                                                    <div className='mt-1 text-center'><p style={{ fontSize: "16px", color: "white", fontWeight: 600 }}>Popular help articles :<span className='para-line'> Privacy FAQs,  How to Install Your Hotjar Tracking Code  </span></p></div>
                                                </div>
                                            </div>
                                            </div>
                                        </div>
                                        {/* <div className='d-flex align-items-center justify-content-center'>
                                                <div className='content-artical'>
                                                    <p>FEATURED ARTICLE</p>
                                                    <div className='d-flex align-items-center justify-content-start icon-larges'>
                                                        <h3>Hotjar Certifications are now live </h3>
                                                        <i class="fa-solid fa-shield-virus"></i>
                                                    </div>
                                                </div>
                                            </div> */}
                                    </div>
                                    <div className="col-12"
                                        style={{ overflow: "auto", padding: "25px 20px 0", }} >

                                        <div className=' mt-5  align-items-center justify-content-center'>
                                            <div className="content Additional-font text-center">
                                                <div> <h5 className='p-3 m-0'>Frequently asked questions</h5>

                                                    <p>What’s your deal with controversial topics?</p></div>
                                            </div>
                                            <div>
                                                <div className='row mt-5'>
                                                    <div className="col-xl-4 col-lg-6 col-md-6   mb-lg-3 mb-xl-4"
                                                        style={{ cursor: "pointer" }}>
                                                        <div className="itemWrapper hover-shadow  a d-flex align-items-center  justify-content-between ">
                                                            <div className="heading ">
                                                                <div className="d-flex align-items-center justify-content-start ">
                                                                    <div className=" me-3">
                                                                        <i className="fa-solid fa-right-to-bracket"></i>
                                                                    </div>
                                                                    <h6>How do I manage my incoming call settings?</h6>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-4 col-lg-6 col-md-6   mb-lg-3 mb-xl-4"
                                                        style={{ cursor: "pointer" }}>
                                                        <div className="itemWrapper  hover-shadow  a d-flex align-items-center  justify-content-center ">
                                                            <div className="heading ">
                                                                <div className="d-flex align-items-center  justify-content-start ">
                                                                    <div className=" me-3">
                                                                        <i className="fa-solid fa-right-to-bracket"></i>
                                                                    </div>
                                                                    <h6>How do I send fax ?</h6>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-4 col-lg-6 col-md-6   mb-lg-3 mb-xl-4"
                                                        style={{ cursor: "pointer" }}>
                                                        <div className="itemWrapper  hover-shadow a d-flex align-items-center  justify-content-center ">
                                                            <div className="heading">
                                                                <div className="d-flex align-items-center  justify-content-start ">
                                                                    <div className=" me-3">
                                                                        <i className="fa-solid fa-right-to-bracket"></i>
                                                                    </div>
                                                                    <h6>How do I setup my deskphone?</h6>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-4 col-lg-6 col-md-6   mb-lg-3 mb-xl-4"
                                                        style={{ cursor: "pointer" }}>
                                                        <div className="itemWrapper hover-shadow  a d-flex align-items-center  justify-content-center ">
                                                            <div className="heading ">
                                                                <div className="d-flex align-items-center  justify-content-start ">
                                                                    <div className=" me-3">
                                                                        <i className="fa-solid fa-right-to-bracket"></i>
                                                                    </div>
                                                                    <h6>What do I need to do to register my business SMS with TCR?</h6>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-4 col-lg-6 col-md-6   mb-lg-3 mb-xl-4"
                                                        style={{ cursor: "pointer" }}>
                                                        <div className="itemWrapper hover-shadow  a d-flex align-items-center  justify-content-center ">
                                                            <div className="heading ">
                                                                <div className="d-flex align-items-center  justify-content-start">
                                                                    <div className=" me-3">
                                                                        <i className="fa-solid fa-right-to-bracket"></i>
                                                                    </div>
                                                                    <h6>Why can't I sign in to the Admin Portal or the WebRTC?</h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-4 col-lg-6 col-md-6   mb-lg-3 mb-xl-4"
                                                        style={{ cursor: "pointer" }}>
                                                        <div className="itemWrapper  hover-shadow a bg-none d-flex align-items-center  justify-content-center ">
                                                            <div className="heading ">
                                                                <div className="d-flex align-items-center  justify-content-start ">
                                                                    <div className=" me-3">
                                                                        <i className="fa-solid fa-right-to-bracket"></i>
                                                                    </div>
                                                                    <h6>How do I create custom call rules for holidays or after hours?</h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>



                                        <div className=' mt-5  align-items-center justify-content-center'>
                                            <div className="content Additional-font d-flex align-items-center justify-content-center">
                                                <h5>Additional resources</h5>
                                            </div>
                                            <div>
                                                <div className='row mt-3'>
                                                    <div className="col-xl-4 col-lg-6 col-md-6   mb-lg-3 mb-xl-4"
                                                        style={{ cursor: "pointer" }}>
                                                        <div className="itemWrapper a d-flex align-items-center  justify-content-between ">
                                                            <div className="heading ">
                                                                <div className="d-flex align-items-center justify-content-start ">
                                                                    <div className="me-3">
                                                                        <i className="fa-solid fa-computer float-start"></i>
                                                                    </div>
                                                                    <div>
                                                                        <h6>Check System status</h6>
                                                                        <p>Get RingCentral’s live connectivity updates.</p>
                                                                    </div>



                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xl-4 col-lg-6 col-md-6   mb-lg-3 mb-xl-4"
                                                        style={{ cursor: "pointer" }}>
                                                        <div className="itemWrapper a d-flex align-items-center  justify-content-center ">
                                                            <div className="heading ">
                                                                <div className="d-flex align-items-center  justify-content-start ">
                                                                    <div className="me-3">
                                                                        <i className="fa-solid fa-users float-start"></i>
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
                                                                <div className="d-flex align-items-center  justify-content-space-start ">
                                                                    <div className="me-3">
                                                                        <i className="fa-solid fa-file-lines float-start"></i>
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