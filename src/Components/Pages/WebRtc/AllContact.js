import React from 'react'
import SideNavbarApp from './SideNavbarApp'
import { useSelector } from 'react-redux';
import ActiveCallSidePanel from './ActiveCallSidePanel';

function AllContact() {
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
                        <div
                            className="row justify-content-between"
                            style={{ height: "100%" }}
                        >
                            <div className='col-xl-6 pt-2' style={{ borderRight: '1px solid #dee2e6' }}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <div className="col-auto">
                                        <h3 style={{ fontFamily: "Outfit", color: "#444444" }}>
                                            Contacts{" "}
                                            <button className="clearButton" effect="ripple">
                                                <i
                                                    className="fa-regular fa-arrows-rotate fs-5"
                                                    style={{ color: "#949494" }}
                                                />
                                            </button>
                                        </h3>
                                    </div>
                                    <div className="col-auto d-flex justify-content-end my-2 my-xl-0">
                                        <div className="col-auto">
                                            <button className="appPanelButton" effect="ripple">
                                                <i className="fa-light fa-copy" />
                                            </button>
                                        </div>
                                        <div className="col-auto">
                                            <button className="appPanelButton" effect="ripple">
                                                <i className="fa-light fa-cloud-arrow-up" />
                                            </button>
                                        </div>
                                        <div className="col-auto">
                                            <button className="appPanelButton" effect="ripple">
                                                <i className="fa-light fa-user-plus" />
                                            </button>{" "}
                                        </div>
                                        <div className="col-auto">
                                            <button className="appPanelButton" effect="ripple">
                                                <i className="fa-light fa-pen-to-square" />
                                            </button>{" "}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 px-1 px-xl-0">
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

                                                data-category="company"
                                            >
                                                Company
                                            </button>
                                            <button
                                                className="tabLink"
                                                effect="ripple"
                                                data-category="myContacts"
                                            >
                                                My Contacts
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
                                            {/* <button class="appPanelButton" effect="ripple"><i
                                  class="fa-solid fa-calendar-plus"></i></button> */}
                                        </div>
                                        <div className="callList">
                                            <div className="text-center callListItem">
                                                <h5 className="fw-semibold">A</h5>
                                            </div>
                                            {/* Call List Item */}
                                            <div
                                                className="contactListItem favourite selected"
                                            >
                                                <div className="row justify-content-between">
                                                    <div className="col-xl-7 col-xxl-6 d-flex">
                                                        <div className="profileHolder" id="profileOnline">
                                                            <i className="fa-light fa-user fs-5" />
                                                        </div>
                                                        <div className="my-auto ms-2 ms-xl-3">
                                                            <h4>AUSER XYZ</h4>
                                                            <h5>69/A, XYZ Street, Saint Petersburg, Russia</h5>
                                                        </div>
                                                    </div>
                                                    <div className="col-10 col-xl-4 col-xxl-5">
                                                        <h4>
                                                            <span>Office</span>
                                                        </h4>
                                                        <h5>1 (999) 999-9999</h5>
                                                        <h6 style={{ display: "flex", alignItems: "center" }}>
                                                            <i className="fa-regular fa-xmark me-1" /> 550
                                                        </h6>
                                                    </div>
                                                    <div className="col-auto text-end d-flex justify-content-center align-items-center">
                                                        <i
                                                            className="fa-sharp fa-thin fa-star"
                                                            style={{ fontSize: 18 }}
                                                        />
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
                                                        <i className="fa-light fa-star" />
                                                    </button>
                                                    <button>
                                                        <i className="fa-light fa-trash" />
                                                    </button>
                                                </div>
                                            </div>
                                            {/* Call List Item */}
                                            {/* Call List Item */}
                                            <div
                                                className="contactListItem"
                                            >
                                                <div className="row justify-content-between">
                                                    <div className="col-xl-7 col-xxl-6 d-flex">
                                                        <div className="profileHolder" id="profileOnline">
                                                            <i className="fa-light fa-user fs-5" />
                                                        </div>
                                                        <div className="my-auto ms-2 ms-xl-3">
                                                            <h4>AUSER XYZ</h4>
                                                            <h5>69/A, XYZ Street, Saint Petersburg, Russia</h5>
                                                        </div>
                                                    </div>
                                                    <div className="col-10 col-xl-4 col-xxl-5">
                                                        <h4>
                                                            <span>Office</span>
                                                        </h4>
                                                        <h5>1 (999) 999-9999</h5>
                                                        <h6 style={{ display: "flex", alignItems: "center" }}>
                                                            <i className="fa-regular fa-xmark me-1" /> 10
                                                        </h6>
                                                    </div>
                                                    <div className="col-auto text-end d-flex justify-content-center align-items-center">
                                                        <i
                                                            className="fa-sharp fa-thin fa-star"
                                                            style={{ fontSize: 18 }}
                                                        />
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
                                                        <i className="fa-light fa-star" />
                                                    </button>
                                                    <button>
                                                        <i className="fa-light fa-trash" />
                                                    </button>
                                                </div>
                                            </div>
                                            {/* Call List Item */}
                                            <div className="text-center callListItem">
                                                <h5 className="fw-semibold">C</h5>
                                            </div>
                                            {/* Call List Item */}
                                            <div
                                                className="contactListItem"
                                            >
                                                <div className="row justify-content-between">
                                                    <div className="col-xl-7 col-xxl-6 d-flex">
                                                        <div className="profileHolder" id="profileOnline">
                                                            <i className="fa-light fa-user fs-5" />
                                                        </div>
                                                        <div className="my-auto ms-2 ms-xl-3">
                                                            <h4>CUSER XYZ</h4>
                                                            <h5>69/A, XYZ Street, Saint Petersburg, Russia</h5>
                                                        </div>
                                                    </div>
                                                    <div className="col-10 col-xl-4 col-xxl-5">
                                                        <h4>
                                                            <span>Office</span>
                                                        </h4>
                                                        <h5>1 (999) 999-9999</h5>
                                                        <h6 style={{ display: "flex", alignItems: "center" }}>
                                                            <i className="fa-regular fa-xmark me-1" /> 650
                                                        </h6>
                                                    </div>
                                                    <div className="col-auto text-end d-flex justify-content-center align-items-center">
                                                        <i
                                                            className="fa-sharp fa-thin fa-star"
                                                            style={{ fontSize: 18 }}
                                                        />
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
                                                        <i className="fa-light fa-star" />
                                                    </button>
                                                    <button>
                                                        <i className="fa-light fa-trash" />
                                                    </button>
                                                </div>
                                            </div>
                                            {/* Call List Item */}
                                            {/* Call List Item */}
                                            <div
                                                className="contactListItem"
                                            >
                                                <div className="row justify-content-between">
                                                    <div className="col-xl-7 col-xxl-6 d-flex">
                                                        <div className="profileHolder" id="profileBusy">
                                                            <img src="https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg" />
                                                        </div>
                                                        <div className="my-auto ms-2 ms-xl-3">
                                                            <h4>CUSER XYZ</h4>
                                                            <h5>69/A, XYZ Street, Saint Petersburg, Russia</h5>
                                                        </div>
                                                    </div>
                                                    <div className="col-10 col-xl-4 col-xxl-5">
                                                        <h4>
                                                            <span>Office</span>
                                                        </h4>
                                                        <h5>1 (999) 999-9999</h5>
                                                        <h6 style={{ display: "flex", alignItems: "center" }}>
                                                            <i className="fa-regular fa-xmark me-1" /> 150
                                                        </h6>
                                                    </div>
                                                    <div className="col-auto text-end d-flex justify-content-center align-items-center">
                                                        <i
                                                            className="fa-sharp fa-thin fa-star"
                                                            style={{ fontSize: 18 }}
                                                        />
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
                                                        <i className="fa-light fa-star" />
                                                    </button>
                                                    <button>
                                                        <i className="fa-light fa-trash" />
                                                    </button>
                                                </div>
                                            </div>
                                            {/* Call List Item */}
                                            <div className="text-center callListItem">
                                                <h5 className="fw-semibold">D</h5>
                                            </div>
                                            {/* Call List Item */}
                                            <div
                                                className="contactListItem"
                                            >
                                                <div className="row justify-content-between">
                                                    <div className="col-xl-7 col-xxl-6 d-flex">
                                                        <div className="profileHolder" id="profileOffline">
                                                            <i className="fa-light fa-user fs-5" />
                                                        </div>
                                                        <div className="my-auto ms-2 ms-xl-3">
                                                            <h4>DUSER XYZ</h4>
                                                            <h5>69/A, XYZ Street, Saint Petersburg, Russia</h5>
                                                        </div>
                                                    </div>
                                                    <div className="col-10 col-xl-4 col-xxl-5">
                                                        <h4>
                                                            <span>Office</span>
                                                        </h4>
                                                        <h5>1 (999) 999-9999</h5>
                                                        <h6 style={{ display: "flex", alignItems: "center" }}>
                                                            <i className="fa-regular fa-xmark me-1" /> 50
                                                        </h6>
                                                    </div>
                                                    <div className="col-auto text-end d-flex justify-content-center align-items-center">
                                                        <i
                                                            className="fa-sharp fa-thin fa-star"
                                                            style={{ fontSize: 18 }}
                                                        />
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
                                                        <i className="fa-light fa-star" />
                                                    </button>
                                                    <button>
                                                        <i className="fa-light fa-trash" />
                                                    </button>
                                                </div>
                                            </div>
                                            {/* Call List Item */}
                                            {/* Call List Item */}
                                            <div
                                                className="contactListItem  myContacts"
                                            >
                                                <div className="row justify-content-between">
                                                    <div className="col-xl-7 col-xxl-6 d-flex">
                                                        <div className="profileHolder" id="profileBusy">
                                                            <i className="fa-light fa-user fs-5" />
                                                        </div>
                                                        <div className="my-auto ms-2 ms-xl-3">
                                                            <h4>DUSER XYZ</h4>
                                                            <h5>69/A, XYZ Street, Saint Petersburg, Russia</h5>
                                                        </div>
                                                    </div>
                                                    <div className="col-10 col-xl-4 col-xxl-5">
                                                        <h4>
                                                            <span>Office</span>
                                                        </h4>
                                                        <h5>1 (999) 999-9999</h5>
                                                        <h6 style={{ display: "flex", alignItems: "center" }}>
                                                            <i className="fa-regular fa-xmark me-1" /> 20
                                                        </h6>
                                                    </div>
                                                    <div className="col-auto text-end d-flex justify-content-center align-items-center">
                                                        <i
                                                            className="fa-sharp fa-thin fa-star"
                                                            style={{ fontSize: 18 }}
                                                        />
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
                                                        <i className="fa-light fa-star" />
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
                            <div className='col-xl-6'>
                                <section id="contactView">
                                    <div
                                        className="row justify-content-between"
                                        style={{ height: "100%" }}
                                    >
                                        <div className="col-12 mx-auto position-relative b text-center">
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
                                                    <button className="appPanelButton" effect="ripple">
                                                        <i className="fa-light fa-phone" />
                                                    </button>
                                                    <button className="appPanelButton" effect="ripple">
                                                        <i className="fa-light fa-video" />
                                                    </button>
                                                    <button className="appPanelButton" effect="ripple">
                                                        <i className="fa-light fa-trash" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-12 mx-auto mt-3">
                                            <div className="row contact-detail-list">
                                                <div className="col-12 col-xl-4">
                                                    <div className="d-flex contactItem">
                                                        <div className="d-flex justify-content-between">
                                                            <i className="fa-regular fa-user" />
                                                        </div>
                                                        <div className="content ms-xxl-3 col-xl-12 col-xxl-10">
                                                            <div className="box">
                                                                <h6>Title:</h6>
                                                            </div>
                                                            <div className="box">
                                                                <h5>"Test1"</h5>
                                                            </div>
                                                            <div className="box">
                                                                <h6>Name:</h6>
                                                            </div>
                                                            <div className="box">
                                                                <h5>Ramnaresh Chaurasiya</h5>
                                                            </div>
                                                            <div className="box">
                                                                <h6>Type:</h6>
                                                            </div>
                                                            <div className="box">
                                                                <h5>User</h5>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-xl-4">
                                                    <div className="d-flex contactItem">
                                                        <div className="d-flex justify-content-between">
                                                            <i className="fa-regular fa-hashtag" />
                                                        </div>
                                                        <div className="content ms-xxl-3 col-xl-12 col-xxl-10">
                                                            <div className="box">
                                                                <h6>Label:</h6>
                                                            </div>
                                                            <div className="box">
                                                                <h5>Demo Text</h5>
                                                            </div>
                                                            <div className="box">
                                                                <h6>Label:</h6>
                                                            </div>
                                                            <div className="box">
                                                                <h5>Demo Text</h5>
                                                            </div>
                                                            <div className="box">
                                                                <h6>Label:</h6>
                                                            </div>
                                                            <div className="box">
                                                                <h5>Demo Text</h5>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-xl-4">
                                                    <div className="d-flex contactItem">
                                                        <div className="d-flex justify-content-between">
                                                            <i className="fa-regular fa-envelope" />
                                                        </div>
                                                        <div className="content ms-xxl-3 col-xl-12 col-xxl-10">
                                                            <div className="box">
                                                                <h6>Label:</h6>
                                                            </div>
                                                            <div className="box contact-email-box">
                                                                riddhee.gupta@gmail.com
                                                            </div>
                                                            <div className="box">
                                                                <h6>Desc:</h6>
                                                            </div>
                                                            <div className="box">
                                                                <h5>
                                                                    Magna ea fugiat ullamco sunt aliquip consequat commodo culpa
                                                                    eiusmod irure.
                                                                </h5>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-xl-4">
                                                    <div className="d-flex contactItem">
                                                        <div className="d-flex justify-content-between">
                                                            <i className="fa-regular fa-location-dot" />
                                                        </div>
                                                        <div className="content ms-xxl-3 col-xl-12 col-xxl-10">
                                                            <div className="box">
                                                                <h6>Work:</h6>
                                                            </div>
                                                            <div className="box">
                                                                <h5>Carretera A San Jacinto, Tarija, 664856, Bolivia</h5>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-xl-4">
                                                    <div className="d-flex contactItem">
                                                        <div className="d-flex justify-content-between">
                                                            <i className="fa-regular fa-link" />
                                                        </div>
                                                        <div className="content ms-xxl-3 col-xl-12 col-xxl-10">
                                                            <div className="box">
                                                                <h6>Work:</h6>
                                                            </div>
                                                            <div className="box">
                                                                <h5>https://xyz.com</h5>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-xl-4">
                                                    <div className="d-flex contactItem">
                                                        <div className="d-flex justify-content-between">
                                                            <i className="fa-regular fa-notes" />
                                                        </div>
                                                        <div className="content ms-xxl-3 col-xl-12 col-xxl-10">
                                                            <div className="box">
                                                                <h6 />
                                                            </div>
                                                            <div className="box">
                                                                <h5 />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

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

export default AllContact