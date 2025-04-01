import React, { useState } from 'react'
import Header from '../../../CommonComponents/Header'
import { useSelector } from 'react-redux';

const WhatsAppChatBox = ({ initial }) => {
    const sessions = useSelector((state) => state.sessions);
    const [open, setOpen] = useState(false);

    // const handleOpen = () => {
    //     setOpen(!open);
    // }
    const handleOpen = () => setOpen(false);
    const handleClose = () => setOpen(true);
    return (
        <>
            <main
                className={initial ? "" : "mainContentApp"}
                style={{
                    marginRight:
                        sessions.length > 0 && Object.keys(sessions).length > 0
                            ? "250px"
                            : "0",
                }}
            >
                {/* {allLogOut && (
                    <LogOutPopUp
                        setAllLogOut={setAllLogOut}
                        handleLogOut={handleLogOut}
                    />
                )} */}

                <div className="container-fluid">
                    <div className="row">
                        <div className={!initial ? "col-12 px-0" : "col-12 px-0 d-none"}>
                            <div className="newHeader">
                                <div className="col-auto" style={{ padding: "0 10px" }}>
                                    <h3 style={{ fontFamily: "Outfit", marginBottom: "0" }}>
                                        <button
                                            className="clearButton2 text-dark"
                                        // onClick={() => featureUnderdevelopment()}
                                        >
                                            <i className="fa-solid fa-chevron-left fs-4"></i>
                                        </button>{" "}
                                        WhatsApp Chat box{" "}
                                    </h3>
                                </div>
                                <div className="d-flex justify-content-end align-items-center">
                                    <div className="col-9">
                                        <input
                                            type="search"
                                            name="Search"
                                            placeholder="Search users, groups or chat"
                                            className="formItem fw-normal"
                                            style={{ backgroundColor: "var(--searchBg)" }}
                                        />
                                    </div>
                                    <div className="col-auto ms-2">
                                        <button className="clearButton2 xl" effect="ripple">
                                            <i className="fa-regular fa-bell" />
                                        </button>
                                    </div>
                                    {/* <DarkModeToggle marginLeft={"2"} /> */}
                                    <div className="col-auto">
                                        <div className="dropdown">
                                            <div
                                                className="myProfileWidget"
                                                type="button"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                <div className="profileHolder" id="profileOnlineNav">
                                                    <img
                                                        src="https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg"
                                                        alt="profile"
                                                    />
                                                </div>
                                                <div className="profileName">
                                                    {/* {account?.username}{" "} */}
                                                    <span className="status">Available</span>
                                                </div>
                                            </div>
                                            <ul className="dropdown-menu">
                                                <li
                                                // onClick={() => {
                                                //     if (allCallCenterIds.length > 0) {
                                                //         setAllLogOut(true);
                                                //     } else {
                                                //         handleLogOut();
                                                //     }
                                                // }}
                                                >
                                                    <div
                                                        className="dropdown-item"
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        Logout
                                                    </div>
                                                </li>
                                                {/* <li onClick={() => navigate("/my-profile")}>
                          <div
                            className="dropdown-item"
                            style={{ cursor: "pointer" }}
                          >
                            Profile
                          </div>
                        </li> */}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <>
                            <div class="overviewTableWrapper">
                                <div class="overviewTableChild chartBox">
                                    <div class="d-flex flex-wrap">
                                        <div class={`chat_nav col-lg-5 col-12 ${open ? 'active' : 'hidden'}`}>
                                            {/* <div className={`chat_nav ${open ? 'active' : 'hidden'}`}> */}
                                            <div className='d-flex chat_sideNav'>
                                                <div className={`leftBox ${open ? 'active' : 'hidden'}`}>
                                                    <div className='pb-3 pt-4 px-3 '>
                                                        <div className='left_listClose'>
                                                            <button onClick={handleClose} className=' border-0 bg-transparent'><i class="fa-solid fa-xmark"></i></button>
                                                        </div>
                                                        <ul className='mt-3'>
                                                            <li className='active'><button><i class="fa-brands fa-rocketchat"></i></button></li>
                                                            <li><button><i class="fa-solid fa-rotate"></i></button></li>
                                                        </ul>
                                                    </div>
                                                </div>

                                                <div className=" pb-3 w-100">
                                                    <div className='d-flex justify-content-start gap-2 align-items-center px-3 py-3  borderGray searchBar_userList'>

                                                        <div className='form-group w-100 position-relative '>
                                                            <input
                                                                type="search"
                                                                name="Search"
                                                                placeholder="Search users, groups or chat"
                                                                className="formItem fw-normal searchInput"
                                                            />
                                                            <i class="fas fa-search user_Search"></i>
                                                        </div>
                                                    </div>
                                                    <div className='user_list'>
                                                        <div className='profile_wrap isActive py-3'>
                                                            <div className='d-flex justify-content-start align-items-center gap-3'>
                                                                <div className='profileBox'>
                                                                    <img src={require("../../../assets/images/boy.png")} alt="loader" />
                                                                </div>
                                                                <p className='mb-0 profile_text'><span>Claire</span> <br /><span>Haha that's terrifying 😂 Haha that's terrifying</span></p>
                                                            </div>
                                                            <div className='user_info'>
                                                                <p className='mb-0'>7:30 am</p>
                                                                <p className='mb-0 text-end read mt-2'><i class="fa-solid fa-check-double"></i></p>
                                                            </div>
                                                        </div>
                                                        <div className='profile_wrap py-3'>
                                                            <div className='d-flex justify-content-start align-items-center gap-3'>
                                                                <div className='profileBox'>
                                                                    <img src={require("../../../assets/images/boy.png")} alt="loader" />
                                                                </div>
                                                                <p className='mb-0 profile_text'><span>Claire</span> <br /><span>Haha that's terrifying 😂 Haha that's terrifying</span></p>
                                                            </div>
                                                            <div className='user_info'>
                                                                <p className='mb-0 un_Read'>7:30 am</p>
                                                                <div className='message_record ms-auto mt-2'>25+</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* </div> */}
                                        </div>
                                        <div class="col-lg-7 col-12" >
                                            <div className='d-flex flex-column h-100'>
                                                <div>
                                                    <div className='chat_head position-relative'>

                                                        <div className='d-flex justify-content-start align-items-center gap-3'>
                                                            <button className='chat_menu ' onClick={handleOpen}>
                                                                <i class="fa-solid fa-bars"></i></button>
                                                            <div className='profileBox'>
                                                                <img src={require("../../../assets/images/boy.png")} alt="loader" />
                                                            </div>
                                                            <p className='mb-0 profile_text'><span>Claire</span> <br /><span className=''><i class="fa-solid fa-circle un_Read me-1"></i>Online</span></p>
                                                        </div>
                                                        <div className='d-flex justify-content-end align-items-center gap-2'>
                                                            <button className='chat_button'><i class="fa-solid fa-phone"></i></button>
                                                            <button className='chat_button'><i class="fa-solid fa-video"></i></button>
                                                            <div class="search-box ">
                                                                <button class="btn-search chat_button"><i class="fas fa-search"></i></button>
                                                                <input type="text" class="input-search" placeholder="Type to Search..." />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='chart_body'>
                                                        <div className='chart_text'>
                                                            <div className='message_chatbox received'>
                                                                <p>Hey brother, are you still a fan of UI design? Can I show you something?</p>
                                                                <span className='c_time'>17:07</span>
                                                            </div>
                                                            <div className='message_chatbox sent'>
                                                                <p>Hey brother</p>
                                                                <span className='c_time'>17:07 <i class="fa-solid fa-check-double read"></i></span>
                                                            </div>
                                                            <div className='message_chatbox sent'>
                                                                <p>are you still a fan of UI design?</p>
                                                                <span className='c_time'>17:07 <i class="fa-solid fa-check-double read"></i></span>
                                                            </div>
                                                            <div className='message_chatbox sent'>
                                                                <p>Hey brother</p>
                                                                <span className='c_time'>17:07 <i class="fa-solid fa-check-double read"></i></span>
                                                            </div>
                                                            <div className='d-flex justify-content-end align-items-end gap-2'>
                                                                <div className='message_chatbox sent'>
                                                                    <div>
                                                                        <p>Neque porro quisquam est qui dolorem ipsum quia dolor sit amet</p>
                                                                        <span className='c_time'>17:07 <i class="fa-solid fa-check-double read"></i></span>
                                                                    </div>
                                                                </div>
                                                                <i class="fa-solid fa-exclamation notSend"></i>
                                                            </div>
                                                            <div className='message_chatbox received'>
                                                                <p>Neque porro quisquam est qui dolorem ipsum quia dolor sit amet</p>
                                                                <span className='c_time'>17:07</span>
                                                            </div>
                                                            <div className='message_chatbox received'>
                                                                <p>There is no one who loves pain itself</p>
                                                                <span className='c_time'>17:07</span>
                                                            </div>
                                                            <div className='message_chatbox received'>
                                                                <p>who seeks after it and wants to have it, simply because it is pain</p>
                                                                <span className='c_time'>17:07</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='chat_footer'>
                                                    <div class="chat-input">
                                                        <button className='send_btn me-2 plus '><i class="fa-solid fa-plus d-flex justify-content-center align-items-center"></i></button>
                                                        <input type="text" placeholder="Type a message..." id="messageInput" className='formItem ' />
                                                        <button className='send_btn ms-2'><i class="fas fa-paper-plane"></i></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    </div>
                </div>
            </main>
        </>
    )
}

export default WhatsAppChatBox