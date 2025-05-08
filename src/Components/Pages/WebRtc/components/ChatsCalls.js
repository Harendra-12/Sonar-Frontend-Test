import React, { useState } from 'react'

const ChatsCalls = () => {

    //  const [unreadMessage, setUnreadMessage] = useState([]);
    //    const [contact, setContact] = useState([]);

    return (
        <>
            <div className="chatCalls_wrap">
                <div className="contactListItem align-items-center"  >
                    <div className="row justify-content-start align-items-center">
                        <div className="col-xl-12 d-flex">
                            <div
                                className="profileHolder"
                                id={"profileOfflineNav"}
                            >
                                <i className="fa-light fa-user fs-5"></i>
                            </div>
                            <div className="my-auto ms-2 ms-xl-3">
                                <p className=' justify-content-start ellipsisText'>Test <span className="missedCallArrow text-danger ms-2"><i class="fa-regular fa-arrow-up-right"></i></span></p>
                                <h5>Today,12:47PM</h5>

                            </div>
                            <div className="col text-end d-flex justify-content-end align-items-center">
                                <button className="btn_call"><i class="fa-regular fa-phone"></i></button>
                                {/* <p className="timeAgo">1h ago</p> */}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="contactListItem align-items-center"  >
                    <div className="row justify-content-start align-items-center">
                        <div className="col-xl-12 d-flex">
                            <div
                                className="profileHolder"
                                id={"profileOfflineNav"}
                            >
                                <i className="fa-light fa-user fs-5"></i>
                            </div>
                            <div className="my-auto ms-2 ms-xl-3">
                                <p className=' justify-content-start ellipsisText'>Test <span className="missedCallArrow text-success ms-2"><i class="fa-solid fa-arrow-down-left"></i></span></p>
                                <h5>Today,12:47PM</h5>

                            </div>
                            <div className="col text-end d-flex justify-content-end align-items-center">
                                <button className="btn_call"><i class="fa-regular fa-video"></i></button>
                                {/* <p className="timeAgo">1h ago</p> */}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="contactListItem align-items-center"  >
                    <div className="row justify-content-start align-items-center">
                        <div className="col-xl-12 d-flex">
                            <div
                                className="profileHolder"
                                id={"profileOfflineNav"}
                            >
                                <i className="fa-light fa-user fs-5"></i>
                            </div>
                            <div className="my-auto ms-2 ms-xl-3">
                                <p className=' justify-content-start ellipsisText'>Test <span className="missedCallArrow text-danger ms-2"><i class="fa-regular fa-arrow-up-right"></i></span></p>
                                <h5>Today,12:47PM</h5>

                            </div>
                            <div className="col text-end d-flex justify-content-end align-items-center">
                                <button className="btn_call"><i class="fa-regular fa-phone"></i></button>
                                {/* <p className="timeAgo">1h ago</p> */}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="contactListItem align-items-center"  >
                    <div className="row justify-content-start align-items-center">
                        <div className="col-xl-12 d-flex">
                            <div
                                className="profileHolder"
                                id={"profileOfflineNav"}
                            >
                                <i className="fa-light fa-user fs-5"></i>
                            </div>
                            <div className="my-auto ms-2 ms-xl-3">
                                <p className=' justify-content-start ellipsisText'>Test <span className="missedCallArrow text-success ms-2"><i class="fa-regular fa-arrow-up-right"></i></span></p>
                                <h5>Today,12:47PM</h5>

                            </div>
                            <div className="col text-end d-flex justify-content-end align-items-center">
                                <button className="btn_call"><i class="fa-regular fa-phone"></i></button>
                                {/* <p className="timeAgo">1h ago</p> */}
                            </div>
                        </div>
                    </div>
                </div>
               

            </div>
        </>
    )
}

export default ChatsCalls