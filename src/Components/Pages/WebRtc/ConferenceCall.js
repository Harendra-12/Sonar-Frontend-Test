import React from 'react'
import { useSelector } from 'react-redux';
import SideNavbarApp from './SideNavbarApp';

function ConferenceCall() {
    const sessions = useSelector((state) => state.sessions);
    return (
        <>
            <SideNavbarApp />
            <main className='mainContentApp'
                style={{
                    marginRight:
                        sessions.length > 0 && Object.keys(sessions).length > 0
                            ? "250px"
                            : "0",
                }}>
                <section>
                    <div className='container-fluid'>
                        <div className="row">
                            <div className="col-12 ps-xl-0">
                                <div className="newHeader">
                                    <div className="col-auto" style={{ padding: '0 10px' }}>
                                        <h3 style={{ fontFamily: "Outfit", marginBottom: '0' }}>
                                            <button class="clearButton text-dark"><i class="fa-solid fa-caret-left fs-4"></i></button> Conference <button class="clearButton"><i class="fa-regular fa-arrows-rotate fs-5" style={{ color: 'rgb(148, 148, 148)' }}></i></button>
                                        </h3>
                                    </div>
                                    <div className="d-flex justify-content-end align-items-center">
                                        <div className="col-9">
                                            <input type="search" name="Search" placeholder="Search users, groups or chat" class="formItem fw-normal" style={{ backgroundColor: '#f5f5f5' }} />
                                        </div>
                                        <div className="col-auto mx-2">
                                            <button
                                                className="clearButton2 xl"
                                                effect="ripple"
                                            >
                                                <i className="fa-regular fa-bell" />
                                            </button>
                                        </div>
                                        <div className="col-auto">
                                            <div className="myProfileWidget">
                                                <div class="profileHolder" id="profileOnlineNav">
                                                    <img src="https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg" alt="profile" />
                                                </div>
                                                <div class="profileName">test two <span className="status">Available</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-lg-8 col-xl-8 col-12 border-end'>

                            </div>
                            <div className='col-lg-4 col-xl-4 col-12'>
                                <div className="messageOverlay">
                                    <div className="contactHeader py-3">
                                        <div>
                                            <h4>Messages</h4>
                                        </div>
                                    </div>
                                    <div className="messageContent">
                                        <div className="messageList">
                                            <div className="messageItem sender">
                                                <div className="second">
                                                    <h6>
                                                        1003,<span>3:48</span>
                                                    </h6>
                                                    <div className="messageDetails">
                                                        <p>hi</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="messageInput">
                                            <div className="col-12">
                                                <nav>
                                                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                                        <button
                                                            className="tabLink active"
                                                            id="nav-sms-tab"
                                                            data-bs-toggle="tab"
                                                            data-bs-target="#nav-sms"
                                                            type="button"
                                                            role="tab"
                                                            aria-controls="nav-sms"
                                                            aria-selected="true"
                                                        >
                                                            SMS
                                                        </button>
                                                        <button
                                                            className="tabLink"
                                                            id="nav-whatsapp-tab"
                                                            data-bs-toggle="tab"
                                                            data-bs-target="#nav-whatsapp"
                                                            type="button"
                                                            role="tab"
                                                            aria-controls="nav-whatsapp"
                                                            aria-selected="false"
                                                            disabled=""
                                                        >
                                                            WhatsApp
                                                        </button>
                                                        <button
                                                            className="tabLink"
                                                            id="nav-skype-tab"
                                                            data-bs-toggle="tab"
                                                            data-bs-target="#nav-skype"
                                                            type="button"
                                                            role="tab"
                                                            aria-controls="nav-skype"
                                                            aria-selected="false"
                                                            disabled=""
                                                        >
                                                            Skype
                                                        </button>
                                                    </div>
                                                </nav>
                                            </div>
                                            <div className="tab-content col-12" id="nav-tabContent">
                                                <div
                                                    className="tab-pane fade show active"
                                                    id="nav-sms"
                                                    role="tabpanel"
                                                    aria-labelledby="nav-sms-tab"
                                                >
                                                    <textarea
                                                        type="text"
                                                        name=""
                                                        className="input"
                                                        placeholder="Please enter your message"
                                                        defaultValue={""}
                                                    />
                                                </div>
                                                <div
                                                    className="tab-pane fade"
                                                    id="nav-whatsapp"
                                                    role="tabpanel"
                                                    aria-labelledby="nav-whatsapp-tab"
                                                >
                                                    ...
                                                </div>
                                                <div
                                                    className="tab-pane fade"
                                                    id="nav-skype"
                                                    role="tabpanel"
                                                    aria-labelledby="nav-skype-tab"
                                                >
                                                    ...
                                                </div>
                                            </div>
                                            <div className="col-12 d-flex justify-content-between align-items-center">
                                                <div className="d-flex">
                                                    <button className="clearButton2">
                                                        <i className="fa-light fa-eraser" />
                                                    </button>
                                                    <button className="clearButton2">
                                                        <i className="fa-regular fa-image" />
                                                    </button>
                                                    <button className="clearButton2">
                                                        <i className="fa-solid fa-paperclip" />
                                                    </button>
                                                    <button className="clearButton2">
                                                        <i className="fa-regular fa-face-smile" />
                                                    </button>
                                                </div>
                                                <div>
                                                    <button effect="ripple" className="clearColorButton dark">
                                                        Send Now <i className="fa-solid fa-paper-plane-top" />
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
        </>
    )
}

export default ConferenceCall