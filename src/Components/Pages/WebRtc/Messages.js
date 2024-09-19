import React from 'react'
import { useSelector } from 'react-redux';
import SideNavbarApp from './SideNavbarApp';
import ActiveCallSidePanel from './ActiveCallSidePanel';

function Messages() {
    const sessions = useSelector((state) => state.sessions);
    return (
        <>
            <SideNavbarApp />
            <main
                className="mainContentApp"
                style={{
                    marginRight:
                        sessions.length > 0 && Object.keys(sessions).length > 0
                            ? "250px"
                            : "0",
                }}
            >
                <section>
                    <div className="container-fluid">
                        <div className="row">
                            <div
                                className="col-12 col-xl-6 d-flex flex-wrap justify-content-between py-3 border-end"
                                style={{ height: "100%" }}
                            >
                                <div className="col-auto">
                                    <h3 style={{ fontFamily: "Outfit", color: "#444444" }}>
                                        eFax
                                    </h3>
                                </div>
                                <div className="col-auto d-flex">
                                    <div className="col-auto">
                                        <button className="appPanelButton" effect="ripple">
                                            <i className="fa-solid fa-message-plus"></i>
                                        </button>
                                    </div>
                                    <div className="col-auto">
                                        <button className="appPanelButton" effect="ripple">
                                            <i className="fa-solid fa-gear"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <nav>
                                        <div className="nav nav-tabs">
                                            <button className={"tabLink active"} data-category="all">
                                                All
                                            </button>
                                            <button
                                                className={"tabLink"}
                                                effect="ripple"
                                                data-category="incoming"
                                            >
                                                Received
                                            </button>
                                            <button
                                                className={"tabLink"}
                                                effect="ripple"
                                                data-category="outgoing"
                                            >
                                                Sent
                                            </button>
                                            <button
                                                className={"tabLink"}
                                                effect="ripple"
                                                data-category="missed"
                                            >
                                                Failed
                                            </button>
                                        </div>
                                    </nav>
                                    <div className="tab-content">
                                        <div className="position-relative searchBox d-flex mt-3">
                                            <input
                                                type="search"
                                                name="Search"
                                                id="headerSearch"
                                                placeholder="Search"
                                            />
                                        </div>
                                        <div className="callList">
                                            <div className="text-center callListItem">
                                                <h5 className="fw-semibold">Today</h5>
                                            </div>
                                            <div className="contactListItem">
                                                <div className="row justify-content-between">
                                                    <div className="col-xl-6 d-flex">
                                                        <div className="profileHolder" id="profileOnline">
                                                            <i className="fa-light fa-user fs-5"></i>
                                                        </div>
                                                        <div className="my-auto ms-2 ms-xl-3">
                                                            <h4>AUSER XYZ</h4>
                                                            <h5>1 (999) 999-9999</h5>
                                                        </div>
                                                    </div>
                                                    <div className="col-10 col-xl-4">
                                                        <h4>
                                                            <span>Received</span>
                                                        </h4>
                                                        <h5>1 Attachment</h5>
                                                    </div>
                                                    <div className="col-auto text-end d-flex justify-content-center align-items-center">
                                                        <h5>12:46pm</h5>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="col-12 col-xl-6 callDetails eFaxCompose"
                                style={{ height: "100%" }}
                                id="callDetails"
                            >
                                <div className="messageOverlay">
                                    <div className="contactHeader">
                                        <div>
                                            <h4>USER XYZ</h4>
                                            <span className="status online">Online</span>
                                        </div>
                                        <div className="d-flex my-auto">
                                            <button
                                                className="appPanelButton"
                                                effect="ripple"
                                                onclick="location.href='http://192.168.2.220/ringerappCI/webrtc/user-app-caller'"
                                            >
                                                <i className="fa-light fa-phone" />
                                            </button>
                                            <button
                                                className="appPanelButton"
                                                effect="ripple"
                                                onclick="location.href='http://192.168.2.220/ringerappCI/webrtc/user-app-videocaller'"
                                            >
                                                <i className="fa-light fa-video" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="messageContent">
                                        <div className="messageList">
                                            <div className="messageItem sender">
                                                <div className="first">
                                                    <div className="profileHolder">US</div>
                                                </div>
                                                <div className="second">
                                                    <h6>
                                                        USER XYZ <span>10:12 PM</span>
                                                    </h6>
                                                    <div className="messageDetails">
                                                        <p>Hi</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="messageItem receiver">
                                                <div className="first">
                                                    <div className="profileHolder">US</div>
                                                </div>
                                                <div className="second">
                                                    <h6>
                                                        USER 123 <span>10:12 PM</span>
                                                    </h6>
                                                    <div className="messageDetails">
                                                        <p>Hello. Whatsup!</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="messageItem sender">
                                                <div className="first">
                                                    <div className="profileHolder">US</div>
                                                </div>
                                                <div className="second">
                                                    <h6>
                                                        USER XYZ <span>10:12 PM</span>
                                                    </h6>
                                                    <div className="messageDetails">
                                                        <p>Nothing much, regular work.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="messageItem sender">
                                                <div className="first">
                                                    <div className="profileHolder">US</div>
                                                </div>
                                                <div className="second">
                                                    <h6>
                                                        USER XYZ <span>10:12 PM</span>
                                                    </h6>
                                                    <div className="messageDetails">
                                                        <p>Are you free right now?</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="messageItem receiver">
                                                <div className="first">
                                                    <div className="profileHolder">US</div>
                                                </div>
                                                <div className="second">
                                                    <h6>
                                                        USER 123 <span>10:12 PM</span>
                                                    </h6>
                                                    <div className="messageDetails">
                                                        <p>Yeah, go ahead.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="messageItem receiver">
                                                <div className="first">
                                                    <div className="profileHolder">US</div>
                                                </div>
                                                <div className="second">
                                                    <h6>
                                                        USER 123 <span>10:12 PM</span>
                                                    </h6>
                                                    <div className="messageDetails">
                                                        <p>You need details regarding last day's conversation?</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="messageItem sender">
                                                <div className="first">
                                                    <div className="profileHolder">US</div>
                                                </div>
                                                <div className="second">
                                                    <h6>
                                                        USER XYZ <span>10:12 PM</span>
                                                    </h6>
                                                    <div className="messageDetails">
                                                        <p>Yes i would need the documentation we talked about.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="messageItem receiver">
                                                <div className="first">
                                                    <div className="profileHolder">US</div>
                                                </div>
                                                <div className="second">
                                                    <h6>
                                                        USER 123 <span>10:12 PM</span>
                                                    </h6>
                                                    <div className="messageDetails">
                                                        <p>Hold on, Sending it in a moment.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="messageItem receiver">
                                                <div className="first">
                                                    <div className="profileHolder">US</div>
                                                </div>
                                                <div className="second">
                                                    <h6>
                                                        USER 123 <span>10:12 PM</span>
                                                    </h6>
                                                    <div className="messageDetails">
                                                        <p>
                                                            Attachment <i className="fa-duotone fa-download" />
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="messageInput">
                                            <div className="col-10">
                                                <input
                                                    type="text"
                                                    name=""
                                                    id=""
                                                    placeholder="Please enter your message"
                                                />
                                            </div>
                                            <div className="col-auto d-flex">
                                                <button effect="ripple" className="appPanelButtonColor2 ms-auto">
                                                    <i className="fa-regular fa-paperclip" />
                                                </button>
                                                <button effect="ripple" className="appPanelButtonColor">
                                                    <i className="fa-solid fa-paper-plane-top" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>
            </main>
            {sessions.length > 0 && Object.keys(sessions).length > 0 ? (
                <>
                    <section className="activeCallsSidePanel">
                        <div className="container">
                            <div className="row">
                                {sessions.length > 0 &&
                                    sessions.map((session, chennel) => (
                                        <ActiveCallSidePanel
                                            sessionId={session.id}
                                            destination={session.destination}
                                            chennel={chennel}
                                        />
                                    ))}
                            </div>
                        </div>
                    </section>
                </>
            ) : (
                ""
            )}
        </>
    )
}

export default Messages