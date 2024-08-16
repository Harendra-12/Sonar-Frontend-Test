import React from 'react'
import { useSelector } from 'react-redux';
import SideNavbarApp from './SideNavbarApp';
import ActiveCallSidePanel from './ActiveCallSidePanel';

function AllVoicemails() {
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
                <section>
                    <div className="container-fluid">
                        <div className="row">
                            <div
                                className="col-xl-6 d-flex flex-wrap justify-content-between py-3 border-end"
                                style={{ height: "100%" }}
                            >
                                <div className="col-auto">
                                    <h3 style={{ fontFamily: "Outfit", color: "#444444" }}>
                                        Voicemails
                                    </h3>
                                </div>
                                <div className="col-auto d-flex">
                                    <div className="col-auto">
                                        <button
                                            className="appPanelButton"
                                            effect="ripple"
                                        >
                                            <i className="fa-light fa-mobile-retro" />
                                        </button>
                                    </div>
                                    <div className="col-auto">
                                        <button className="appPanelButton" effect="ripple">
                                            <i className="fa-light fa-satellite-dish" />
                                        </button>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <nav>
                                        <div className="nav nav-tabs">
                                            <button
                                                className="tabLink active"
                                                effect="ripple"
                                                data-category="all"
                                            >
                                                All
                                            </button>
                                            <button
                                                className="tabLink"
                                                effect="ripple"
                                                data-category="new"
                                            >
                                                New
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
                                            <button className="ms-2 appPanelButton" effect="ripple">
                                                <i className="fa-light fa-calendar-plus" />
                                            </button>
                                        </div>
                                        <div className="callList">
                                            <div className="text-center callListItem">
                                                <h5 className="fw-semibold">Today</h5>
                                            </div>
                                            {/* Call List Item */}
                                            <div className="callListItem selected">
                                                <div className="row justify-content-between align-items-center">
                                                    <div className="col-9 d-flex">
                                                        <div className="profileHolder">
                                                            <i className="fa-light fa-user fs-5" />
                                                        </div>
                                                        <div className="my-auto">
                                                            <h4>1 (999) 999-9999</h4>
                                                            <h5>USER XYZ</h5>
                                                            <h6 style={{ display: "flex", alignItems: "center" }}>
                                                                <i className="fa-solid fa-voicemail text-danger fw-bold me-1" />
                                                                Voicemail, 15 sec
                                                            </h6>
                                                        </div>
                                                    </div>
                                                    <div className="col-auto text-end">
                                                        <h5>12:46pm</h5>
                                                    </div>
                                                </div>
                                                <div className='contactPopup'>
                                                    <button>
                                                        <i className="fa-light fa-phone" />
                                                    </button>
                                                    <button>
                                                        <i className="fa-light fa-message" />
                                                    </button>
                                                    <button>
                                                        <i className="fa-light fa-trash" />
                                                    </button>
                                                </div>
                                            </div>
                                            {/* Call List Item */}
                                            {/* Call List Item */}
                                            <div className="callListItem">
                                                <div className="row justify-content-between align-items-center">
                                                    <div className="col-9 d-flex">
                                                        <div className="profileHolder">
                                                            <i className="fa-light fa-user fs-5" />
                                                        </div>
                                                        <div className="my-auto">
                                                            <h4>1 (999) 999-9999</h4>
                                                            <h5>USER XYZ</h5>
                                                            <h6 style={{ display: "flex", alignItems: "center" }}>
                                                                <i className="fa-solid fa-voicemail text-danger fw-bold me-1" />
                                                                Voicemail, 15 sec
                                                            </h6>
                                                        </div>
                                                    </div>
                                                    <div className="col-auto text-end">
                                                        <h5>12:46pm</h5>
                                                    </div>
                                                </div>
                                                <div className='contactPopup'>
                                                    <button>
                                                        <i className="fa-light fa-phone" />
                                                    </button>
                                                    <button>
                                                        <i className="fa-light fa-message" />
                                                    </button>
                                                    <button>
                                                        <i className="fa-light fa-trash" />
                                                    </button>
                                                </div>
                                            </div>
                                            {/* Call List Item */}
                                            {/* Call List Item */}
                                            <div className="callListItem">
                                                <div className="row justify-content-between align-items-center">
                                                    <div className="col-9 d-flex">
                                                        <div className="profileHolder">
                                                            <i className="fa-light fa-user fs-5" />
                                                        </div>
                                                        <div className="my-auto">
                                                            <h4>1 (999) 999-9999</h4>
                                                            <h5>USER XYZ</h5>
                                                            <h6 style={{ display: "flex", alignItems: "center" }}>
                                                                <i className="fa-solid fa-voicemail text-danger fw-bold me-1" />
                                                                Voicemail, 15 sec
                                                            </h6>
                                                        </div>
                                                    </div>
                                                    <div className="col-auto text-end">
                                                        <h5>12:46pm</h5>
                                                    </div>
                                                </div>
                                                <div className='contactPopup'>
                                                    <button>
                                                        <i className="fa-light fa-phone" />
                                                    </button>
                                                    <button>
                                                        <i className="fa-light fa-message" />
                                                    </button>
                                                    <button>
                                                        <i className="fa-light fa-trash" />
                                                    </button>
                                                </div>
                                            </div>
                                            {/* Call List Item */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="col-xl-6 callDetails"
                                style={{ height: "100%" }}
                                id="callDetails"
                            >
                                <div className="profileInfoHolder">
                                    <div className="profileHolder">
                                        <i className="fa-light fa-user fs-3" />
                                    </div>
                                    <h4>1 (999) 999-9999</h4>
                                    <h5>USER XYZ</h5>
                                    <div className="d-flex justify-content-center align-items-center mt-3">
                                        <button className="appPanelButton" effect="ripple">
                                            <i className="fa-light fa-message-dots" />
                                        </button>
                                        <button
                                            className="appPanelButton"
                                            effect="ripple"
                                        >
                                            <i className="fa-light fa-phone" />
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <nav>
                                        <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                            <button
                                                className="tabLink active"
                                                effect="ripple"
                                                data-bs-toggle="tab"
                                                data-bs-target="#nav-home"
                                                type="button"
                                                role="tab"
                                                aria-controls="nav-home"
                                                aria-selected="true"
                                            >
                                                <i className="fa-regular fa-circle-info" />
                                            </button>
                                            <button
                                                className="tabLink"
                                                effect="ripple"
                                                data-bs-toggle="tab"
                                                data-bs-target="#nav-profile"
                                                type="button"
                                                role="tab"
                                                aria-controls="nav-profile"
                                                aria-selected="false"
                                            >
                                                <i className="fa-regular fa-clock-rotate-left" />
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
                                            <div className="callDetailsList">
                                                <table className="mt-3">
                                                    <tbody>
                                                        <tr>
                                                            <td style={{ color: "#444444" }}>Jan 16, 2022</td>
                                                            <td>12:46 PM</td>
                                                            <td style={{ display: "flex", alignItems: "center" }}>
                                                                <i className="fa-solid fa-voicemail text-danger fw-bold me-1" />{" "}
                                                                <span className="d-none d-xl-inline-block">
                                                                    Voicemail
                                                                </span>
                                                            </td>
                                                            <td>1 (999) 999-9999</td>
                                                            <td style={{ color: "#444444" }}>16 sec</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <div className="audio-container">
                                                    <audio controls={true}>
                                                        <source src="horse.ogg" type="audio/ogg" />
                                                        <source
                                                            src="https://www.fesliyanstudios.com/play-mp3/6560"
                                                            type="audio/mpeg"
                                                        />
                                                    </audio>
                                                    {/* Custom buttons */}
                                                    <button
                                                        className="audioCustomButton"
                                                    >
                                                        <i className="fa-sharp fa-solid fa-download" />
                                                    </button>
                                                    <button
                                                        className="audioCustomButton ms-1"
                                                    >
                                                        <i className="fa-sharp fa-solid fa-box-archive" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="tab-pane fade"
                                            id="nav-profile"
                                            role="tabpanel"
                                            aria-labelledby="nav-profile-tab"
                                            tabIndex={0}
                                        >
                                            <div className="callDetailsList">
                                                <table className="mt-3">
                                                    <tbody>
                                                        <tr
                                                            data-bs-toggle="collapse"
                                                            href="#voiceMail1"
                                                            role="button"
                                                        >
                                                            <td style={{ color: "#444444" }}>Jan 16, 2022</td>
                                                            <td>12:46 PM</td>
                                                            <td className="missed">
                                                                <span>Missed</span>
                                                            </td>
                                                            <td>1 (999) 999-9999</td>
                                                            <td style={{ color: "#444444" }}>24 sec</td>
                                                        </tr>
                                                        <tr className="collapse" id="voiceMail1">
                                                            <td colSpan={5}>
                                                                <div
                                                                    className="audio-container collapse"
                                                                    id="voiceMail1"
                                                                >
                                                                    <audio controls={true}>
                                                                        <source src="horse.ogg" type="audio/ogg" />
                                                                        <source
                                                                            src="https://www.fesliyanstudios.com/play-mp3/6560"
                                                                            type="audio/mpeg"
                                                                        />
                                                                    </audio>
                                                                    {/* Custom buttons */}
                                                                    <button
                                                                        className="audioCustomButton"
                                                                    >
                                                                        <i className="fa-sharp fa-solid fa-download" />
                                                                    </button>
                                                                    <button
                                                                        className="audioCustomButton ms-1"
                                                                    >
                                                                        <i className="fa-sharp fa-solid fa-box-archive" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr
                                                            data-bs-toggle="collapse"
                                                            href="#voiceMail2"
                                                            role="button"
                                                        >
                                                            <td style={{ color: "#444444" }}>Jan 16, 2022</td>
                                                            <td>12:46 PM</td>
                                                            <td className="missed">
                                                                <span>Missed</span>
                                                            </td>
                                                            <td>1 (999) 999-9999</td>
                                                            <td style={{ color: "#444444" }}>24 sec</td>
                                                        </tr>
                                                        <tr className="collapse" id="voiceMail2">
                                                            <td colSpan={5}>
                                                                <div
                                                                    className="audio-container collapse"
                                                                    id="voiceMail2"
                                                                >
                                                                    <audio controls={true}>
                                                                        <source src="horse.ogg" type="audio/ogg" />
                                                                        <source
                                                                            src="https://www.fesliyanstudios.com/play-mp3/6560"
                                                                            type="audio/mpeg"
                                                                        />
                                                                    </audio>
                                                                    {/* Custom buttons */}
                                                                    <button
                                                                        className="audioCustomButton"
                                                                    >
                                                                        <i className="fa-sharp fa-solid fa-download" />
                                                                    </button>
                                                                    <button
                                                                        className="audioCustomButton ms-1"
                                                                    >
                                                                        <i className="fa-sharp fa-solid fa-box-archive" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
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

export default AllVoicemails