import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import ActiveCallSidePanel from './ActiveCallSidePanel';
import SideNavbarApp from './SideNavbarApp';

function VideoCall() {
    const [commPopup, setCommPopup] = useState(true);
    const [toggleMic, setToggleMic] = useState(false);
    const [toggleCam, setToggleCam] = useState(false);
    const [toggleParticipants, setToggleParticipants] = useState(false);
    const [toggleMessages, setToggleMessages] = useState(false);
    const [toggleSettings, setToggleSettings] = useState(false);

    const sessions = useSelector((state) => state.sessions);

    return (
        <>
            <SideNavbarApp />
            <main className="mainContentApp"
                style={{
                    marginRight:
                        sessions.length > 0 && Object.keys(sessions).length > 0
                            ? "250px"
                            : "0",
                }}>
                <div className="conference-caller">
                    {commPopup ? (
                        <div className="container inputPopup h-100">
                            <div className="contentParentWrap mx-auto">
                                <div className="contentWrap">
                                    <div className="closeButton">
                                        <button
                                            className="clearButton"
                                            effect="ripple"
                                            onClick={() => setCommPopup(false)}
                                        >
                                            <i className="fa-light fa-xmark" />
                                        </button>
                                    </div>
                                    <h4>How would you like to join?</h4>
                                    <div className="d-flex justify-content-center align-items-center mt-4">
                                        <div>
                                            <button
                                                className="appPanelButton mx-auto"
                                                effect="ripple"
                                                onClick={() => setCommPopup(false)}
                                            >
                                                <i className="fa-light fa-microphone" />
                                            </button>
                                            <h6 className="mb-0 mt-2">Microphone</h6>
                                        </div>
                                        <div className="ms-4">
                                            <button
                                                className="appPanelButton mx-auto"
                                                effect="ripple"
                                                onClick={() => setCommPopup(false)}
                                            >
                                                <i className="fa-light fa-headphones" />
                                            </button>
                                            <h6 className="mb-0 mt-2">Listen only</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="container-fluid callerContent">
                            <div className="row header">
                                <div className="col-4"></div>
                                <div className="col-4 text-center d-flex align-items-center justify-content-center">
                                    <h5 className="mb-0">Room 20</h5>
                                </div>
                                <div className="col-4 d-flex justify-content-end">
                                    <button
                                        className="clearButton"
                                        effect="ripple"
                                        onclick="toggleSettings()"
                                    >
                                        <i className="fa-thin fa-gear" />
                                    </button>
                                    <button className="clearButton ms-2" effect="ripple">
                                        <i className="fa-thin fa-volume-xmark" />
                                    </button>
                                    <button
                                        className="clearButton ms-2"
                                        effect="ripple"
                                    // onClick="openMaximizeView()"
                                    >
                                        <i className="fa-thin fa-arrows-maximize" />
                                    </button>
                                </div>
                            </div>
                            <div className="participants-slider" style={{ width: toggleParticipants ? '300px' : 0 }}>
                                <button
                                    className="clearButton back"
                                    effect="ripple"
                                    onClick={() => setToggleParticipants(false)}
                                >
                                    <i className="fa-regular fa-chevron-left" />
                                </button>
                                <nav>
                                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                        <button
                                            className="tabLink active col-6"
                                            id="nav-home-tab"
                                            data-bs-toggle="tab"
                                            data-bs-target="#nav-home"
                                            type="button"
                                            role="tab"
                                            aria-controls="nav-home"
                                            aria-selected="true"
                                        >
                                            Participation
                                        </button>
                                        <button
                                            className="tabLink col-6"
                                            id="nav-profile-tab"
                                            data-bs-toggle="tab"
                                            data-bs-target="#nav-profile"
                                            type="button"
                                            role="tab"
                                            aria-controls="nav-profile"
                                            aria-selected="false"
                                        >
                                            Polls
                                        </button>
                                    </div>
                                </nav>
                                <div className="tab-content" id="nav-tabContent">
                                    <div
                                        className="tab-pane fade show active"
                                        id="nav-home"
                                        role="tabpanel"
                                        aria-labelledby="nav-home-tab"
                                        tabIndex={0}
                                    >
                                        <div className="participantsList">
                                            <h5>Participants&nbsp;&nbsp;(1)</h5>
                                            <ul>
                                                <li>
                                                    <div>UX</div>
                                                    <label>User X (me)</label>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div
                                        className="tab-pane fade"
                                        id="nav-profile"
                                        role="tabpanel"
                                        aria-labelledby="nav-profile-tab"
                                        tabIndex={0}
                                    >
                                        <button>Create new poll</button>
                                    </div>
                                </div>
                            </div>
                            {toggleMic && <div className="selectMicrophone">
                                <div className="contentParentWrap mx-auto">
                                    <div className="contentWrap">
                                        <div className="closeButton">
                                            <button
                                                className="clearButton"
                                                effect="ripple"
                                                onClick={() => setToggleMic(false)}
                                            >
                                                <i className="fa-light fa-xmark" />
                                            </button>
                                        </div>
                                        <h4>Select your microphone</h4>
                                        <div className="d-flex justify-content-center align-items-center mt-4">
                                            <div className="col-6">
                                                <select>
                                                    <option value="" />
                                                    <option value="saab">RealTek Audio Driver</option>
                                                    <option value="mercedes">3-Sennheiser USB Headset</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-9 mt-4">
                                            <div className="ms-auto">
                                                <button className="appPanelButton2 ms-auto" effect="ripple" onClick={() => setToggleMic(false)}>
                                                    Select
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>}
                            {toggleCam && <div className="selectWebcam">
                                <div className="contentParentWrap mx-auto">
                                    <div className="contentWrap">
                                        <div className="closeButton">
                                            <button
                                                className="clearButton"
                                                effect="ripple"
                                                onClick={() => setToggleCam(false)}
                                            >
                                                <i className="fa-light fa-xmark" />
                                            </button>
                                        </div>
                                        <h4>Select your Video Camera</h4>
                                        <div className="d-flex justify-content-center align-items-center mt-4">
                                            <div className="col-6">
                                                <select>
                                                    <option value="" />
                                                    <option value="saab">USB Webcam</option>
                                                    <option value="mercedes">Frontech Webcam</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-9 mt-4">
                                            <div className="ms-auto">
                                                <button className="appPanelButton2 ms-auto" effect="ripple" onClick={() => setToggleCam(false)}>
                                                    Select
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>}
                            <div className="messages-slider" style={{ width: toggleMessages ? '300px' : 0 }}>
                                <button
                                    className="clearButton back"
                                    effect="ripple"
                                    onClick={() => setToggleMessages(false)}
                                >
                                    <i className="fa-regular fa-chevron-left" />
                                </button>
                                <nav>
                                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                        <button className="tabLink active col-12">Public Chat</button>
                                    </div>
                                </nav>
                                <div className="messagesWrapper p-2">
                                    <div className="sender">
                                        Adipisicing consectetur consequat nostrud laboris sunt proident
                                        nulla irure tempor incididunt id excepteur voluptate nulla.
                                    </div>
                                    <div className="receiver">
                                        Culpa duis consequat qui incididunt commodo et officia deserunt
                                        ullamco sit non.
                                    </div>
                                </div>
                                <div className="messagesChat">
                                    <textarea
                                        cols={30}
                                        rows={2}
                                        placeholder={"Type your message here"}
                                    />
                                </div>
                            </div>
                            {toggleSettings && <div className="settingsPanel">
                                <div className="contentParentWrap mx-auto">
                                    <div className="contentWrap">
                                        <nav>
                                            <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                                <button
                                                    className="tabLink active col-3"
                                                    style={{ color: "#e5e5e5" }}
                                                    id="nav-home-tab"
                                                    data-bs-toggle="tab"
                                                    data-bs-target="#nav-appset"
                                                    type="button"
                                                    role="tab"
                                                    aria-controls="nav-home"
                                                    aria-selected="true"
                                                >
                                                    Basic
                                                </button>
                                                <button
                                                    className="tabLink col-3"
                                                    style={{ color: "#e5e5e5" }}
                                                    id="nav-profile-tab"
                                                    data-bs-toggle="tab"
                                                    data-bs-target="#nav-save"
                                                    type="button"
                                                    role="tab"
                                                    aria-controls="nav-profile"
                                                    aria-selected="false"
                                                >
                                                    Optimizations
                                                </button>
                                                <button
                                                    className="tabLink col-3"
                                                    style={{ color: "#e5e5e5" }}
                                                    id="nav-contact-tab"
                                                    data-bs-toggle="tab"
                                                    data-bs-target="#nav-nottif"
                                                    type="button"
                                                    role="tab"
                                                    aria-controls="nav-contact"
                                                    aria-selected="false"
                                                >
                                                    Notifications
                                                </button>
                                                <button
                                                    className="tabLink col-3"
                                                    style={{ color: "#e5e5e5" }}
                                                    id="nav-contact-tab"
                                                    data-bs-toggle="tab"
                                                    data-bs-target="#nav-ingres"
                                                    type="button"
                                                    role="tab"
                                                    aria-controls="nav-contact"
                                                    aria-selected="false"
                                                >
                                                    Ingress
                                                </button>
                                            </div>
                                        </nav>
                                        <div className="tab-content" id="nav-tabContent">
                                            <div
                                                className="tab-pane fade show active"
                                                id="nav-appset"
                                                role="tabpanel"
                                                aria-labelledby="nav-home-tab"
                                                tabIndex={0}
                                            >
                                                <div className="d-flex">
                                                    <div className="col-6 text-start">
                                                        <h5>Language</h5>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="selectContainer">
                                                            <select>
                                                                <option selected="">Select one</option>
                                                                <option value="">New Delhi</option>
                                                                <option value="">Istanbul</option>
                                                                <option value="">Jakarta</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="d-flex">
                                                    <div className="col-6 text-start">
                                                        <h5>Video Object Fit</h5>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="selectContainer">
                                                            <select>
                                                                <option selected="">Select one</option>
                                                                <option value="">New Delhi</option>
                                                                <option value="">Istanbul</option>
                                                                <option value="">Jakarta</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="d-flex">
                                                    <div className="col-6 text-start">
                                                        <h5>Column camera width</h5>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="selectContainer">
                                                            <select>
                                                                <option selected="">Select one</option>
                                                                <option value="">New Delhi</option>
                                                                <option value="">Istanbul</option>
                                                                <option value="">Jakarta</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="d-flex">
                                                    <div className="col-6 text-start">
                                                        <h5>Column camera position</h5>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="selectContainer">
                                                            <select>
                                                                <option selected="">Select one</option>
                                                                <option value="">New Delhi</option>
                                                                <option value="">Istanbul</option>
                                                                <option value="">Jakarta</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="tab-pane fade"
                                                id="nav-save"
                                                role="tabpanel"
                                                aria-labelledby="nav-profile-tab"
                                                tabIndex={0}
                                            >
                                                <div className="d-flex">
                                                    <div className="col-6 text-start">
                                                        <h5>Video Quality</h5>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="selectContainer">
                                                            <select>
                                                                <option selected="">Select one</option>
                                                                <option value="">New Delhi</option>
                                                                <option value="">Istanbul</option>
                                                                <option value="">Jakarta</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="d-flex">
                                                    <div className="col-6 text-start">
                                                        <h5>Show Webcam</h5>
                                                    </div>
                                                    <div className="col-6" style={{ marginBottom: 13 }}>
                                                        <div className="my-auto position-relative text-end">
                                                            <label className="switch">
                                                                <input type="checkbox" id="showAllCheck" />
                                                                <span className="slider round" />
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="d-flex">
                                                    <div className="col-6 text-start">
                                                        <h5>Show Screenshare</h5>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="my-auto position-relative text-end">
                                                            <label className="switch">
                                                                <input type="checkbox" id="showAllCheck" />
                                                                <span className="slider round" />
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="tab-pane fade"
                                                id="nav-nottif"
                                                role="tabpanel"
                                                aria-labelledby="nav-contact-tab"
                                                tabIndex={0}
                                            >
                                                <div className="d-flex">
                                                    <div className="col-6 text-start">
                                                        <h5>Allow Audio Notifications</h5>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="my-auto position-relative text-end">
                                                            <label className="switch">
                                                                <input type="checkbox" id="showAllCheck" />
                                                                <span className="slider round" />
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="tab-pane fade"
                                                id="nav-ingres"
                                                role="tabpanel"
                                                aria-labelledby="nav-disabled-tab"
                                                tabIndex={0}
                                            >
                                                <div className="d-flex">
                                                    <div className="col-6 text-start">
                                                        <h5>Ingress Type</h5>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="selectContainer">
                                                            <select>
                                                                <option selected="">Select one</option>
                                                                <option value="">New Delhi</option>
                                                                <option value="">Istanbul</option>
                                                                <option value="">Jakarta</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-end mx-4 px-2 mb-2">
                                            <button
                                                effect="ripple"
                                                className="clearButton text-white"
                                                onclick="toggleSettings()"
                                            >
                                                Exit
                                            </button>
                                            <button
                                                effect="ripple"
                                                className="appPanelButton2 ms-2"
                                                onclick="toggleSettings()"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>}
                            <div className="user">
                                <div className="container-fluid">
                                    <div className="row justify-content-center align-items-center">
                                        <div className="mobileConferenceCallerHack" />
                                        <div className="col-xl-6 col-12 col-md-6 px-xl-2 px-0">
                                            <div className='userProfileContainer'>
                                                <i className="fa-regular fa-user text-white fs-1" />

                                                <div className='primaryUserWindow'>
                                                    <i className="fa-regular fa-user text-white fs-1" />
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="row footer">
                                <div className="col-4 d-flex">
                                    <button
                                        className="appPanelButtonCaller"
                                        effect="ripple"
                                        onClick={() => setToggleMic(true)}
                                    >
                                        <i className="fa-thin fa-microphone" />
                                    </button>
                                    <button
                                        className="appPanelButtonCaller"
                                        effect="ripple"
                                        onClick={() => setToggleCam(true)}
                                    >
                                        <i className="fa-thin fa-video" />
                                    </button>
                                </div>
                                <div className="col-xl-4 col-8 d-flex justify-content-center">
                                    <button
                                        className="appPanelButtonCaller"
                                        effect="ripple"
                                        onClick={() => setToggleParticipants(!toggleParticipants)}
                                        data-tippy-content="Show Participants"
                                    >
                                        <i className="fa-thin fa-users" />
                                    </button>
                                    <button
                                        className="appPanelButtonCaller"
                                        effect="ripple"
                                        onClick={() => setToggleMessages(!toggleMessages)}
                                        data-tippy-content="Show Messages"
                                    >
                                        <i className="fa-thin fa-comments" />
                                    </button>
                                    <button
                                        className="appPanelButtonCaller"
                                        effect="ripple"
                                        data-tippy-content="Share Screen"
                                    >
                                        <i className="fa-thin fa-screencast" />
                                    </button>
                                    <button
                                        className="appPanelButtonCaller"
                                        effect="ripple"
                                        data-tippy-content="Raise Your Hand"
                                    >
                                        <i className="fa-thin fa-hand" />
                                    </button>
                                    <button
                                        className="appPanelButtonCaller"
                                        effect="ripple"
                                        data-tippy-content="Open Whiteboard"
                                    >
                                        <i className="fa-thin fa-chalkboard-user" />
                                    </button>
                                    <button
                                        className="appPanelButtonCaller"
                                        effect="ripple"
                                        data-tippy-content="Start Recording"
                                    >
                                        <i className="fa-thin fa-clapperboard" />
                                    </button>
                                    <button
                                        className="appPanelButtonCaller"
                                        effect="ripple"
                                        data-tippy-content="More Options"
                                    >
                                        <i className="fa-light fa-ellipsis" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            {sessions.length > 0 && Object.keys(sessions).length > 0 ? (
                <>
                    <section
                        className="activeCallsSidePanel"
                    // onClick={() => setSelectedModule("onGoingCall")}
                    >
                        <div className="container">
                            <div className="row">
                                {sessions.length > 0 &&
                                    sessions.map((session, chennel) => (
                                        <ActiveCallSidePanel session={session} key={chennel} />
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

export default VideoCall