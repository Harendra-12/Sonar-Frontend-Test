import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { featureUnderdevelopment, generalGetFunction } from '../../GlobalFunction/globalFunction';
import { useNavigate } from 'react-router-dom';

function Email() {
    const sessions = useSelector((state) => state.sessions);
    const account = useSelector((state) => state.account);
    const extension = account?.extension?.extension || "";
    const dispatch = useDispatch();
    const navigate = useNavigate();
    async function logOut() {
        const apiData = await generalGetFunction("/logout");
        localStorage.clear();
        if (apiData?.data) {
            localStorage.clear();
            dispatch({
                action: "SET_ACCOUNT",
                account: null,
            });
            navigate("/");
        }
    }
    return (
        <>
            <main
                className="mainContentApp"
                style={{
                    marginRight:
                        sessions.length > 0 && Object.keys(sessions).length > 0
                            ? "250px"
                            : "0",
                }}
            >
                <section className="callPage">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12 ps-xl-0">
                                <div className="newHeader">
                                    <div className="col-auto" style={{ padding: '0 10px' }}>
                                        <h3 style={{ fontFamily: "Outfit", marginBottom: '0' }}>
                                            <button class="clearButton text-dark" ><i class="fa-solid fa-chevron-left fs-4"></i></button> E-Mail{" "}
                                            <button class="clearButton">
                                                <i
                                                    class="fa-regular fa-arrows-rotate fs-5"
                                                    style={{ color: "var(--webUtilGray)" }}
                                                    onClick={() => featureUnderdevelopment()}
                                                ></i>
                                            </button>
                                        </h3>
                                    </div>
                                    <div className="d-flex justify-content-end align-items-center">
                                        <div className="col-9">
                                            <input type="search" name="Search" placeholder="Search users, groups or chat" class="formItem fw-normal" style={{ backgroundColor: 'var(--searchBg)' }} onChange={() => featureUnderdevelopment()} />
                                        </div>
                                        <div className="col-auto mx-2">
                                            <button
                                                className="clearButton2 xl"
                                                effect="ripple"
                                                onClick={() => featureUnderdevelopment()}
                                            >
                                                <i className="fa-regular fa-bell" />
                                            </button>
                                        </div>
                                        <div className="col-auto">
                                            <div class="dropdown">
                                                <div className="myProfileWidget" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                    <div class="profileHolder" id="profileOnlineNav">
                                                        <img src="https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg" alt="profile" />
                                                    </div>
                                                    <div class="profileName">{account.username} <span className="status">Available</span></div>
                                                </div>
                                                <ul class="dropdown-menu" onClick={logOut}>
                                                    <li><div class="dropdown-item" style={{ cursor: 'pointer' }} >Logout</div></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-6 allCallHistory pb-0">

                                <div className="col-auto" style={{ padding: '0 10px' }}>
                                    <h5 className="viewingAs">
                                        Viewing As:
                                        <span>
                                            {account && extension ? (
                                                <span>
                                                    {account.username} - {account && extension}
                                                </span>
                                            ) : (
                                                <span className="text-danger">
                                                    No Extension Assigned
                                                </span>
                                            )}
                                        </span>
                                    </h5>
                                </div>
                                <div className="col-auto" style={{ padding: '0 10px' }}>
                                    <button className="clearColorButton dark">
                                        <i className="fa-light fa-at" /> New Email
                                    </button>
                                </div>
                                <div className="col-12 mt-3" style={{ padding: '0 10px' }}>
                                    <input
                                        type="search"
                                        name="Search"
                                        id="headerSearch"
                                        placeholder="Search"
                                    />
                                </div>

                                <div className="col-12">
                                    <nav className="mt-3">
                                        <div className="nav nav-tabs" style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <button
                                                className="tabLink active"
                                                effect="ripple"
                                                data-category="all"
                                            >
                                                All
                                            </button>
                                            <button
                                                onClick={() => featureUnderdevelopment()}
                                                className="tabLink"
                                                effect="ripple"
                                                data-category="file"
                                            >
                                                File
                                            </button>
                                            {/* <button
                        className={"tabLink"}
                        effect="ripple"
                        data-category="incoming"
                      >
                        Received
                      </button> */}
                                            {/* <button
                        className={"tabLink"}
                        effect="ripple"
                        data-category="outgoing"
                      >
                        Sent
                      </button> */}
                                            {/* <button
                        className={"tabLink"}
                        effect="ripple"
                        data-category="missed"
                      >
                        Failed
                      </button> */}
                                        </div>
                                    </nav>
                                    <div className="tab-content">
                                        <div className="callList">
                                            <div className="dateHeader">
                                                <p className="fw-semibold">Today</p>
                                            </div>
                                            <div data-bell="" className="callListItem incoming">
                                                <div className="row justify-content-between">
                                                    <div className="col-xl-12 d-flex">
                                                        <div className="profileHolder">
                                                            <i className="fa-light fa-user fs-5"></i>
                                                        </div>

                                                        <div class="col-4 my-auto ms-2 ms-xl-3" style={{ cursor: "pointer" }}>
                                                            <h4>AUSER XYZ</h4>
                                                            <h5 style={{ paddingLeft: "20px" }}>1 (999) 999-9999</h5>
                                                        </div>

                                                        <div className="col-3 mx-auto">
                                                            <div className="contactTags">
                                                                <span data-id="1">Received</span>
                                                            </div>
                                                            <h5 style={{ fontWeight: '400' }}><i class="fa-light fa-paperclip"></i> 1 Attachment</h5>
                                                        </div>
                                                        <div className="col-1 text-end ms-auto">
                                                            <p className="timeAgo">12:46pm</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div data-bell="" className="callListItem outgoing">
                                                <div className="row justify-content-between">
                                                    <div className="col-xl-12 d-flex">
                                                        <div className="profileHolder">
                                                            <i className="fa-light fa-user fs-5"></i>
                                                        </div>

                                                        <div class="col-4 my-auto ms-2 ms-xl-3" style={{ cursor: "pointer" }}>
                                                            <h4>AUSER XYZ</h4>
                                                            <h5 style={{ paddingLeft: "20px" }}>1 (999) 999-9999</h5>
                                                        </div>

                                                        <div className="col-3 mx-auto">
                                                            <div className="contactTags">
                                                                <span data-id="0">Sent</span>
                                                            </div>
                                                            <h5 style={{ fontWeight: '400' }}><i class="fa-light fa-paperclip"></i> 1 Attachment</h5>
                                                        </div>
                                                        <div className="col-1 text-end ms-auto">
                                                            <p className="timeAgo">12:46pm</p>
                                                        </div>
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
                                <div className="overviewTableWrapper p-2 mt-2">
                                    <div className="overviewTableChild">
                                        <div className="d-flex flex-wrap">
                                            <div class="col-12">
                                                <div class="heading">
                                                    <div class="content">
                                                        <h4>New Email</h4>
                                                        <p>You can send a new email from here</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12" style={{ padding: '0px 20px 0px' }}>
                                                <div className="newMessageWrapper mb-3">
                                                    <div>
                                                        <div className="messageTo">
                                                            <label>Recipents</label>
                                                            <div className="d-flex flex-wrap">
                                                                <div className="col-auto my-auto">
                                                                    <input
                                                                        type="text"
                                                                        className="border-0 mb-0"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="messageSubject">
                                                            <label>Subject</label>
                                                            <input type="text" />
                                                        </div>
                                                        <div className="messageBody">
                                                            <label>Body</label>
                                                            <textarea type="text" rows="5" />
                                                        </div>
                                                        <div className="messageBody">
                                                            <label>
                                                                <i className="fa-regular fa-link"></i> Attach
                                                                File(s) (maximum file size is 50 MB)
                                                            </label>
                                                            <div className="inputFileWrapper">
                                                                {/* <input type="file" /> */}
                                                                <select className="formItem">
                                                                    <option value="">
                                                                        Chose file
                                                                    </option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="buttonControl">
                                                            <button className="panelButton"><span className="text">Send</span><span className="icon"><i class="fa-solid fa-paper-plane-top"></i></span></button>
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

export default Email