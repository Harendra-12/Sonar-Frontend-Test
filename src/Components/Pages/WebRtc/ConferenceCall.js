import React from 'react'
import { useSelector } from 'react-redux';
import SideNavbarApp from './SideNavbarApp';

function ConferenceCall() {
    const sessions = useSelector((state) => state.sessions);
    return (
        <>
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
                            <div className='videoCallWrapper'>
                                <div className='row'>
                                    <div className='col-lg-8 col-xl-8 col-12'>
                                        <div className='heading'>
                                            <h4>Conference <span>14:20</span></h4>
                                            <button className='clearButton'><i class="fa-sharp fa-solid fa-circle-plus"></i> Add Participant</button>
                                        </div>
                                        <div className='videoBody'>
                                            <div className='activeGuyName'>
                                                You
                                            </div>
                                            <div className='activeGuyName' style={{ bottom: '20px', top: 'inherit', width: '45px' }}>
                                                <i class="fa-sharp fa-solid fa-volume"></i>
                                            </div>
                                            <div className='participant active'>
                                                <img src='https://dm0qx8t0i9gc9.cloudfront.net/thumbnails/video/HjH5lgeHeix7kfhup/videoblocks-31_man-successful_4k_rwpcr0ar3_thumbnail-1080_11.png' />
                                            </div>
                                            <div className='participant' data-mic='true'>
                                                <img src='https://ogletree.com/app/uploads/people/alexandre-abitbol.jpg' />
                                            </div>
                                            <div className='participant' data-mic='false' style={{ top: `120px` }}>
                                                <img src='https://ogletree.com/app/uploads/people/jerod-a-allen.jpg' />
                                            </div>
                                            <div className='participant' data-pin='true' style={{ top: `220px` }}>
                                                <img src='https://ogletree.com/app/uploads/people/janice-g-dubler.jpg' />
                                            </div>
                                            <div className='participant' style={{ top: `320px` }}>
                                                <img src='https://i.pinimg.com/736x/54/b7/58/54b758f7757dfb67d75a0b6640cb2efa.jpg' />
                                            </div>
                                        </div>
                                        <div className='videoControls'>
                                            <button className='appPanelButtonCallerRect'>
                                                <i class="fa-light fa-microphone"></i>
                                            </button>
                                            <button className='appPanelButtonCallerRect'>
                                                <i class="fa-light fa-video"></i>
                                            </button>
                                            <button className='appPanelButtonCallerRect'>
                                                <i class="fa-sharp fa-light fa-record-vinyl"></i>
                                            </button>
                                            <button className='appPanelButtonCallerRect' style={{ fontSize: '14px', padding: '10px 20px', backgroundColor: '#e45758' }}>
                                                Leave Call
                                            </button>
                                            <button className='appPanelButtonCallerRect'>
                                                <i class="fa-light fa-screencast"></i>
                                            </button>
                                            <button className='appPanelButtonCallerRect'>
                                                <i class="fa-light fa-chalkboard-user"></i>
                                            </button>
                                            <button className='appPanelButtonCallerRect'>
                                                <i class="fa-light fa-hand"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className='col-lg-4 col-xl-4 col-12 p-3'>
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
                                                    <textarea
                                                        type="text"
                                                        name=""
                                                        className="input"
                                                        placeholder="Please enter your message"
                                                        defaultValue={""}
                                                        rows={2}
                                                    />
                                                    <div className="col-12 d-flex justify-content-between align-items-center">
                                                        <div className="d-flex">
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
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

export default ConferenceCall