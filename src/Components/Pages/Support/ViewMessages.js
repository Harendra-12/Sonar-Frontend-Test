import React from 'react'
import Header from '../../CommonComponents/Header'
import { useNavigate } from 'react-router-dom'
// import React, { useState } from 'react'






function ViewMessages() {

    const navigate = useNavigate();


    const handleback = () => {
        navigate('/ticket')
    }
    return (
        <main className='mainContent'>
            <section className="campaignPage">
                <div className="container-fluid">
                    <div className="row">
                        <Header title="Dialer" />
                        <div className='overviewTableWrapper'>
                            <div className='overviewTableChild'>
                                <div className='d-flex flex-wrap'>
                                    <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                        <div className="heading">
                                            <div className="content">
                                                <h4>Ticket</h4>
                                                <p>You can Create ticket of users </p>
                                            </div>
                                            <div className="buttonGroup">
                                                <button className="panelButton gray" onClick={handleback}>
                                                    <span className="text">Back</span>
                                                    <span className="icon"><i className="fa-solid fa-caret-left"></i></span>
                                                </button>
                                                {/* <button className="panelButton" onClick={() => Navigate("/ticket")}>
                                                    <span className="text">Create</span>
                                                    <span className="icon"><i className="fa-solid fa-plus"></i></span>
                                                </button> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-xl-12 col-lg-12 col-xxl-12 callDetails eFaxCompose" >
                                        <div className="row">
                                            <div className='col-4'>
                                                <div className='allticketshow mt-4'>



                                                   
                                                    <div className='d-flex align-items-center justify-content-between border-btmo'>
                                                        <p>
                                                            Status :

                                                        </p>
                                                        <span class="tableLabel success">
                                                            Open
                                                        </span>
                                                    </div>
                                                    <div className='d-flex align-items-center justify-content-between border-btmo'>
                                                        <p>
                                                            Email :

                                                        </p>
                                                        <span>
                                                            mauryarishabh@gmail.com
                                                        </span>
                                                    </div>
                                                    <div className='d-flex align-items-center justify-content-between border-btmo'>
                                                        <p>
                                                            Created On  :

                                                        </p>
                                                        <span>
                                                            3/29/2025 12:44pm
                                                        </span>
                                                    </div>

                                                    <div className='d-flex align-items-center justify-content-between border-btmo'>
                                                        <p>
                                                            Subject :

                                                        </p>
                                                        <span>
                                                            require toools
                                                        </span>
                                                    </div>
                                                    <div className='d-flex align-items-center justify-content-between border-btmo'>
                                                        <p>
                                                            Department :


                                                        </p>
                                                        <span>
                                                            SUPPORT
                                                        </span>
                                                    </div>
                                                    <div className='d-flex align-items-center justify-content-between border-btmo'>
                                                        <p>
                                                            Query Type:


                                                        </p>
                                                        <span>
                                                            Major
                                                        </span>
                                                    </div>
                                                    <div className='d-flex align-items-center justify-content-between border-btmo'>
                                                        <p>
                                                            Massage

                                                        </p>
                                                        <span>
                                                            fix this bugs pending works
                                                        </span>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="col-8">
                                                <div className="messageOverlay">
                                                    <div className="contactHeader">
                                                        <div>
                                                            <h4 className="">Rishabh </h4>
                                                            <div className="contactTags">
                                                                {/* <span data-id="1">Work</span> */}
                                                                <div className="dropdown">
                                                                    <ul className="dropdown-menu">
                                                                        <li className="dropdown-item" >
                                                                            rterter
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex my-auto">
                                                            <button className="clearButton2 xl"
                                                                effect="ripple" >
                                                                <i className="fa-regular fa-phone" />
                                                            </button>
                                                            <button className="clearButton2 xl" effect="ripple" >
                                                                <i className="fa-regular fa-video" />
                                                            </button>
                                                            <div className="dropdown">
                                                                <button
                                                                    className="clearButton2 xl"
                                                                    type="button"
                                                                    data-bs-toggle="dropdown"
                                                                    aria-expanded="false" >
                                                                    <i className="fa-solid fa-ellipsis-vertical"></i>
                                                                </button>
                                                                <ul className="dropdown-menu">
                                                                    <li>
                                                                        <div
                                                                            className="dropdown-item"
                                                                            href="#">
                                                                            Mark as unread
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div
                                                                            className="dropdown-item"
                                                                            href="#" >
                                                                            Archive this chat
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div
                                                                            className="dropdown-item"
                                                                            href="#" >
                                                                            Manage Group Chat
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div
                                                                            className="dropdown-item"
                                                                            href="#" >
                                                                            Leave this group
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div
                                                                            className="dropdown-item text-danger"
                                                                            href="#">  Close this chat
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="messageContent">
                                                        <div className="messageList" style={{ height: "calc(100vh - 370px)" }}>
                                                            <>
                                                                <div className="dateHeader">
                                                                    <p>
                                                                        fghhgh
                                                                    </p>
                                                                </div>
                                                                <div className="dateHeader sticky">
                                                                    <p>
                                                                        fhgfh
                                                                    </p>
                                                                </div>
                                                                <div className="messageItem sender">
                                                                    <div className="second">
                                                                        <h6>
                                                                            fgdfgfd,

                                                                        </h6>
                                                                        <div className="messageDetails">
                                                                            <p>oiyuiyu</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="messageItem receiver">
                                                                    <div className="second">
                                                                        <h6>
                                                                            sdfsdf,

                                                                        </h6>
                                                                        <div className="messageDetails">
                                                                            <p>fdgd</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                            <div className="startAJob">
                                                                <div className="text-center mt-3">
                                                                    <img
                                                                        src={require("../../assets/images/empty-box.png")}
                                                                        alt="Empty"
                                                                    ></img>
                                                                    <div>
                                                                        <h5>
                                                                            Please select a <b>Agent</b> to start{" "}
                                                                            <span>a conversation</span>.
                                                                        </h5>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="messageInput">
                                                            <div className="tab-content col-12" id="nav-tabContent">
                                                                <div
                                                                    className="tab-pane fade show active"
                                                                    id="nav-im"
                                                                    role="tabpanel"
                                                                    aria-labelledby="nav-im-tab"
                                                                >
                                                                    <textarea
                                                                        type="text"
                                                                        name=""
                                                                        className="input"
                                                                        placeholder="Please enter your message"
                                                                    />
                                                                </div>
                                                                <div
                                                                    className="tab-pane fade"
                                                                    id="nav-whatsapp"
                                                                    role="tabpanel"
                                                                    aria-labelledby="nav-whatsapp-tab" >
                                                                    ...
                                                                </div>
                                                                <div
                                                                    className="tab-pane fade"
                                                                    id="nav-messenger"
                                                                    role="tabpanel"
                                                                    aria-labelledby="nav-messenger-tab">
                                                                    ...
                                                                </div>
                                                            </div>

                                                            <div className="col-12 d-flex justify-content-between align-items-center">
                                                                <div className="d-flex">
                                                                    <button
                                                                        className="clearButton2"

                                                                    >
                                                                        <i className="fa-light fa-eraser" />
                                                                    </button>
                                                                    <button
                                                                        className="clearButton2"

                                                                    >
                                                                        <i className="fa-regular fa-image"></i>
                                                                    </button>
                                                                    <button
                                                                        className="clearButton2"

                                                                    >
                                                                        <i className="fa-solid fa-paperclip"></i>
                                                                    </button>
                                                                    <button
                                                                        className="clearButton2"
                                                                    >
                                                                        <i className="fa-regular fa-face-smile"></i>
                                                                    </button>
                                                                </div>
                                                                <div>
                                                                    <button
                                                                        effect="ripple"
                                                                        className="clearColorButton dark">
                                                                        Send Now{" "}
                                                                        <i className="fa-solid fa-paper-plane-top" />
                                                                    </button>
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

export default ViewMessages