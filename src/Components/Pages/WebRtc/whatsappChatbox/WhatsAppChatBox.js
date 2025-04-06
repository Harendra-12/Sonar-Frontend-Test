import React, { useEffect, useState, useRef } from "react";
import Header from "../../../CommonComponents/Header";
import { useDispatch, useSelector } from "react-redux";
import { get, set } from "react-hook-form";
import {
  generalGetFunction,
  generalPostFunction,
} from "../../../GlobalFunction/globalFunction";
import { toast } from "react-toastify";

const WhatsAppChatBox = ({ initial }) => {
  const dispatch = useDispatch();
  const account = useSelector((state) => state.account);
  const chatContainerRef = useRef(null);

  const sessions = useSelector((state) => state.sessions);
  const whatsappContact = useSelector((state) => state.whatsappContact);
  const whatsappContactRefresh = useSelector(
    (state) => state.whatsappContactRefresh
  );
  const whatsappMessage = useSelector((state) => state.whatsappMessage);
  const whatsappMessageRefresh = useSelector(
    (state) => state.whatsappMessageRefresh
  );

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [whatsappContactData, setWhatsappContactData] = useState();
  const [whatsappMessageData, setWhatsappMessageData] = useState();
  const [activeChat, setActiveChat] = useState();
  const [activeChatMessages, setActiveChatMessages] = useState();
  const [message, setMessage] = useState();
  const [sendingMessage, setSendingMessage] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const POLLING_INTERVAL = 3000; // 3 seconds

  const handleOpen = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (whatsappContactRefresh > 0) {
      setWhatsappContactData(whatsappContact);
      setActiveChat(whatsappContact?.[0]);
    } else {
      dispatch({
        type: "SET_WHATSAPPCONTACTREFRESH",
        whatsappContactRefresh: whatsappContactRefresh + 1,
      });
    }

    if (whatsappMessageRefresh > 0) {
      setWhatsappMessageData(whatsappMessage);
    } else {
      dispatch({
        type: "SET_WHATSAPPMESSAGEREFRESH",
        whatsappMessageRefresh: whatsappMessageRefresh + 1,
      });
    }
  }, [
    whatsappContactRefresh,
    whatsappContact,
    whatsappMessageRefresh,
    whatsappMessage,
  ]);

  // Fetch whatsapp message for individual contact
  useEffect(() => {
    let pollInterval;

    if (activeChat && isPolling) {
      // Initial fetch
      fetchIndividualData();

      // Set up polling interval
      pollInterval = setInterval(() => {
        fetchIndividualData();
      }, POLLING_INTERVAL);
    }

    // Cleanup function to clear interval when component unmounts or dependencies change
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [activeChat, isPolling]);

  // Start polling when chat becomes active
  useEffect(() => {
    setLoading(true);
    if (activeChat) {
      setIsPolling(true);
    } else {
      setIsPolling(false);
    }
  }, [activeChat]);

  const formatTimeFromDate = (fullDate) => {
    const date = new Date(fullDate);
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleMessageSend = async () => {
    setSendingMessage(true);
    if (!message) {
      setSendingMessage(false);
      return toast.error("Please enter a message");
    }
    const fetchData = await generalPostFunction("/whatsapp/send-message", {
      to: activeChat,
      message: message,
    });

    if (fetchData.status) {
      fetchIndividualData();
      setSendingMessage(false);
    } else {
      setSendingMessage(false);
    }
    setMessage("");
  };

  const fetchIndividualData = async () => {
    // setLoading(true);
    const fetchData = await generalPostFunction(
      "/whatsapp/get-individual-messages",
      {
        wp_receiver_id: activeChat,
      }
    );
    if (fetchData.status) {
      setActiveChatMessages(fetchData.data?.reverse());
      setLoading(false);
    } else {
      setActiveChatMessages([]);
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [activeChatMessages]);

  // Scroll to bottom after sending a message
  useEffect(() => {
    if (!sendingMessage) {
      scrollToBottom();
    }
  }, [sendingMessage]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleMessageSend();
    }
  };

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
                    WhatsApp
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
                            src={account?.profile_picture}
                            alt="profile"
                            onError={(e) => e.target.src = require('../../../assets/images/placeholder-image.webp')}
                          />
                        </div>
                        <div className="profileName">
                          {account?.username}{" "}
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
                    <div class="col-lg-5 col-5">
                      <div className="d-flex chat_sideNav">
                        <div
                          className={`leftBox ${open ? "active" : "hidden"}`}
                        >
                          <div className="pb-3 pt-4 px-3 ">
                            <ul>
                              <li className="active">
                                <button>
                                  <i class="fa-brands fa-rocketchat"></i>
                                </button>
                              </li>
                              <li>
                                <button>
                                  <i class="fa-solid fa-rotate"></i>
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className=" pb-3 w-100">
                          <div className="d-flex justify-content-start gap-2 align-items-center px-3 py-3 border-bottom">
                            <button className="chat_menu " onClick={handleOpen}>
                              <i class="fa-solid fa-bars"></i>
                            </button>
                            <div className="form-group w-100 position-relative ">
                              <input
                                type="search"
                                name="Search"
                                placeholder="Search users, groups or chat"
                                className="formItem fw-normal searchInput"
                              />
                              <i class="fas fa-search user_Search"></i>
                            </div>
                          </div>
                          <div className="user_list">
                            {whatsappContactData &&
                              whatsappContactData.map((item, index) => (
                                <div
                                  className={`profile_wrap py-3 ${activeChat === item && "isActive"
                                    }`}
                                  key={index}
                                  onClick={() => setActiveChat(item)}
                                >
                                  <div className="d-flex justify-content-start align-items-center gap-3">
                                    <div className="profileBox">
                                      <img
                                        src={require("../../../assets/images/boy.png")}
                                        alt="loader"
                                      />
                                    </div>
                                    <p className="mb-0 profile_text">
                                      <span>{item}</span> <br />
                                      {/* <span>
                                    Haha that's terrifying 😂 Haha that's
                                    terrifying
                                  </span> */}
                                    </p>
                                  </div>
                                  {/* <div className="user_info">
                                <p className="mb-0">7:30 am</p>
                                <p className="mb-0 text-end read mt-2">
                                  <i class="fa-solid fa-check-double"></i>
                                </p>
                              </div> */}
                                </div>
                              ))}
                            {/* <div className="profile_wrap isActive py-3">
                              <div className="d-flex justify-content-start align-items-center gap-3">
                                <div className="profileBox">
                                  <img
                                    src={require("../../../assets/images/boy.png")}
                                    alt="loader"
                                  />
                                </div>
                                <p className="mb-0 profile_text">
                                  <span>Claire</span> <br />
                                  <span>
                                    Haha that's terrifying 😂 Haha that's
                                    terrifying
                                  </span>
                                </p>
                              </div>
                              <div className="user_info">
                                <p className="mb-0">7:30 am</p>
                                <p className="mb-0 text-end read mt-2">
                                  <i class="fa-solid fa-check-double"></i>
                                </p>
                              </div>
                            </div>
                            <div className="profile_wrap py-3">
                              <div className="d-flex justify-content-start align-items-center gap-3">
                                <div className="profileBox">
                                  <img
                                    src={require("../../../assets/images/boy.png")}
                                    alt="loader"
                                  />
                                </div>
                                <p className="mb-0 profile_text">
                                  <span>Claire</span> <br />
                                  <span>
                                    Haha that's terrifying 😂 Haha that's
                                    terrifying
                                  </span>
                                </p>
                              </div>
                              <div className="user_info">
                                <p className="mb-0 un_Read">7:30 am</p>
                                <div className="message_record ms-auto mt-2">
                                  25+
                                </div>
                              </div>
                            </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-7 col-7">
                      <div className="d-flex flex-column h-100">
                        <div>
                          <div className="chat_head ">
                            <div className="d-flex justify-content-start align-items-center gap-3">
                              <div className="profileBox">
                                <img
                                  src={require("../../../assets/images/boy.png")}
                                  alt="loader"
                                />
                              </div>
                              <p className="mb-0 profile_text">
                                <span>{activeChat}</span> <br />
                                <span className="">
                                  <i class="fa-solid fa-circle un_Read me-1"></i>
                                  Online
                                </span>
                              </p>
                            </div>
                            <div className="d-flex justify-content-end align-items-center gap-2">
                              <button className="chat_button" disabled>
                                <i class="fa-solid fa-phone"></i>
                              </button>
                              <button className="chat_button" disabled>
                                <i class="fa-solid fa-video"></i>
                              </button>
                              <div class="search-box ">
                                <button
                                  className="btn-search chat_button"
                                  disabled
                                >
                                  <i class="fas fa-search"></i>
                                </button>
                                <input
                                  type="text"
                                  class="input-search"
                                  placeholder="Type to Search..."
                                  disabled
                                />
                              </div>
                            </div>
                          </div>
                          {loading ? (
                            <div className="w_loader">
                              <div class="spinner-border" role="status">
                                <span class="visually-hidden">Loading...</span>
                              </div>
                            </div>
                          ) : (
                            <div className="chart_body" ref={chatContainerRef}>
                              <div
                                className="chart_text"

                              // style={{
                              //   maxHeight: "calc(100vh - 200px)",
                              //   overflowY: "auto",
                              // }}
                              >
                                {activeChatMessages &&
                                  activeChatMessages.map((item, index) => (
                                    <div
                                      className={`message_chatbox ${item?.wp_receiver_id === activeChat
                                        ? "sent"
                                        : "received"
                                        }`}
                                      key={index}
                                    >
                                      <p>{item?.message}</p>
                                      <span className="c_time">
                                        {formatTimeFromDate(item?.created_at)}
                                        {item?.delivery_status === "read" &&
                                          item?.wp_receiver_id === activeChat ? (
                                          <i class="fa-solid fa-check-double read ms-2" />
                                        ) : item?.delivery_status === "sent" &&
                                          item?.wp_receiver_id ===
                                          activeChat ? (
                                          <i class="fa-solid fa-check text-muted ms-2" />
                                        ) : (
                                          ""
                                        )}
                                      </span>
                                    </div>
                                  ))}
                                {/* <div className="message_chatbox sent">
                                <p>Hey brother</p>
                                <span className="c_time">
                                  17:07{" "}
                                  <i class="fa-solid fa-check-double read"></i>
                                </span>
                              </div> */}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="chat_footer">
                          <div class="chat-input">
                            <button className="send_btn me-2 plus ">
                              <i class="fa-solid fa-plus d-flex justify-content-center align-items-center"></i>
                            </button>
                            <input
                              type="text"
                              placeholder="Type a message..."
                              id="messageInput"
                              className="formItem"
                              onChange={(e) => setMessage(e.target.value)}
                              onKeyPress={handleKeyPress}
                              value={message}
                            />
                            <button
                              className="send_btn ms-2"
                              onClick={handleMessageSend}
                              disabled={sendingMessage}
                              type="submit"
                            >
                              <i class="fas fa-paper-plane"></i>
                            </button>
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
  );
};

export default WhatsAppChatBox;
