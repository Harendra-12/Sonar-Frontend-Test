import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  featureUnderdevelopment,
  generalGetFunction,
  generalPostFunction,
} from "../../../GlobalFunction/globalFunction";
import { toast } from "react-toastify";
import { api_url } from "../../../../urls";
import { ActionType } from "../../../Redux/reduxActionType";
import HeaderApp from "../HeaderApp";

const WhatsAppChatBox = ({ initial }) => {
  const dispatch = useDispatch();
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
  // const [whatsappMessageData, setWhatsappMessageData] = useState();
  const [activeChat, setActiveChat] = useState();
  const [activeChatMessages, setActiveChatMessages] = useState();
  const [message, setMessage] = useState();
  const [sendingMessage, setSendingMessage] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isWhatsappInAllSocialPlatformData, setIsWhatsappInAllSocialPlatformData] = useState(null)
  const POLLING_INTERVAL = 3000; // 3 seconds

  // const handleOpen = () => {
  //   setOpen(!open);
  // };

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
      // setWhatsappMessageData(whatsappMessage);
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
    // setLoading(true);
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

  useEffect(() => {
    const getData = async () => {
      const apiData = await generalGetFunction(api_url?.all_social_platform);
      if (apiData?.status) {
        dispatch({
          type: ActionType?.ALL_SOCIAL_PLATFORM,
          all_social_platform_data: apiData?.data
        })
        const isWhatsAppAllowed = apiData?.data?.find((data) => data?.platform?.toLowerCase() == "whatsapp") || null
        if (isWhatsAppAllowed == null) {
          setIsPopupOpen(true)
        }
        setIsWhatsappInAllSocialPlatformData(isWhatsAppAllowed)
      }
    }
    getData()
  }, [])

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
        {/* <div className="container-fluid">
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
                </div>
              </div>
            </div>
            <>
              <div className="overviewTableWrapper">
                <div className="overviewTableChild chartBox">
                  <div className="d-flex flex-wrap">
                    <div className="col-lg-5 col-5">
                      <div className="d-flex chat_sideNav">
                        <div
                          className={`leftBox ${open ? "active" : "hidden"}`}
                        >
                          <div className="pb-3 pt-4 px-3 ">
                            <ul>
                              <li className="active">
                                <button>
                                  <i className="fa-brands fa-rocketchat"></i>
                                </button>
                              </li>
                              <li>
                                <button>
                                  <i className="fa-solid fa-rotate"></i>
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className=" pb-3 w-100">
                          <div className="d-flex justify-content-start gap-2 align-items-center px-3 py-3 border-bottom">
                            <button className="chat_menu " onClick={handleOpen}>
                              <i className="fa-solid fa-bars"></i>
                            </button>
                            <div className="form-group w-100 position-relative ">
                              <input
                                type="search"
                                name="Search"
                                placeholder="Search users, groups or chat"
                                className="formItem fw-normal searchInput"
                              />
                              <i className="fas fa-search user_Search"></i>
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

                                    </p>
                                  </div>

                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-7 col-7">
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
                                  <i className="fa-solid fa-circle un_Read me-1"></i>
                                  Online
                                </span>
                              </p>
                            </div>
                            <div className="d-flex justify-content-end align-items-center gap-2">
                              <button className="chat_button" disabled>
                                <i className="fa-solid fa-phone"></i>
                              </button>
                              <button className="chat_button" disabled>
                                <i className="fa-solid fa-video"></i>
                              </button>
                              <div className="search-box ">
                                <button
                                  className="btn-search chat_button"
                                  disabled
                                >
                                  <i className="fas fa-search"></i>
                                </button>
                                <input
                                  type="text"
                                  className="input-search"
                                  placeholder="Type to Search..."
                                  disabled
                                />
                              </div>
                            </div>
                          </div>
                          {loading ? (
                            <div className="w_loader">
                              <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                            </div>
                          ) : (
                            <div className="chart_body" ref={chatContainerRef}>
                              <div
                                className="chart_text"
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
                                          <i className="fa-solid fa-check-double read ms-2" />
                                        ) : item?.delivery_status === "sent" &&
                                          item?.wp_receiver_id ===
                                          activeChat ? (
                                          <i className="fa-solid fa-check text-muted ms-2" />
                                        ) : (
                                          ""
                                        )}
                                      </span>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="chat_footer">
                          <div className="chat-input">
                            <button className="send_btn me-2 plus ">
                              <i className="fa-solid fa-plus d-flex justify-content-center align-items-center"></i>
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
                              <i className="fas fa-paper-plane"></i>
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
        </div> */}


        <div className={!initial ? "col-12 px-0" : "col-12 px-0 d-none"}>
          <HeaderApp
            title={"WhatsApp"}
            loading={loading}
            setLoading={setLoading}
            refreshApi={() => featureUnderdevelopment()} />
        </div>

        {
          isWhatsappInAllSocialPlatformData != null ?
            <div className="container-fluid mt-4">
              <div className='row'>
                <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12 '>
                  <div className="main-chart-wrapper gap-xl-3 gap-lg-3 gap-0 mb-2 d-flex align-items-center justify-content-center">
                    <div className="chat-container border chat-info">
                      <div className="chat-search p-3 border-bottom">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control "
                            placeholder="Search Chat"
                            aria-describedby="button-addon01"
                          />
                          <button
                            aria-label="button"
                            className="btn btn-primary"
                            type="button"
                            id="button-addon01"
                          >
                            <i className="fa-solid fa-magnifying-glass" />
                          </button>
                        </div>
                      </div>
                      <div className="tabs">
                        <div className="tab active">Chat</div>
                        <div className="tab" />
                        <div className="tab" />
                        <div className="tab" />
                      </div>
                      <div className="chat-list">
                        {
                          whatsappContactData?.length > 0 ?
                            whatsappContactData && whatsappContactData.map((item, index) => (

                              <div className={`chat-item py-3 ${activeChat === item && "active"
                                }`}
                                key={index}
                                onClick={() => setActiveChat(item)}>
                                <div className="borders-color">
                                  <img
                                    src="https://spruko.com/demo/rixzo/dist/assets/images/faces/3.jpg"
                                    alt="user"
                                  />
                                  <div className="user-online" />
                                </div>
                                <div className="chat-details">
                                  <div className="chat-name">
                                    {/* <p>Ella Fitzgerald</p> */}
                                    <p>{item}</p>
                                  </div>
                                  <div className="chat-message">
                                    <p>Typing...</p>
                                  </div>
                                </div>
                                <div className="chat-time">08:45AM</div>
                              </div>
                            )) :
                            <div>There is no contact list!</div>
                        }
                        {/* <div className="chat-item">
                      <div className="borders-color">
                        <img
                          src="https://spruko.com/demo/rixzo/dist/assets/images/faces/7.jpg"
                          alt="user"
                        />
                      </div>
                      <div className="chat-details">
                        <div className="chat-name">
                          <p>Liam Neeson</p>
                        </div>
                        <div>
                          <div className="chat-message">
                            <p>Excited for our meeting later!</p>
                          </div>
                        </div>
                        <div></div>
                      </div>
                      <div className="chat-time">
                        <p>11:05AM</p>
                        <p className="notification">5</p>
                      </div>
                    </div>
                    <div className="chat-item">
                      <div className="borders-color">
                        <img
                          src="https://spruko.com/demo/rixzo/dist/assets/images/faces/9.jpg"
                          alt="user"
                        />
                      </div>
                      <div className="chat-details">
                        <div className="chat-name">
                          <p>Biplab</p>
                        </div>
                        <div className="chat-message">
                          <p>Can't wait to discuss our project...</p>
                        </div>
                      </div>
                      <div className="chat-time">09:30AM</div>
                    </div>
                    <div className="chat-item">
                      <div className="borders-color">
                        <img
                          src="https://spruko.com/demo/rixzo/dist/assets/images/faces/11.jpg"
                          alt="user"
                        />
                      </div>
                      <div className="chat-details">
                        <div className="chat-name">
                          <p>Rishabh</p>
                        </div>
                        <div className="chat-message">
                          <p>hiii </p>
                        </div>
                      </div>
                      <div className="chat-time">09:30AM</div>
                    </div>
                    <div className="chat-item">
                      <div className="borders-color">
                        <img
                          src="https://spruko.com/demo/rixzo/dist/assets/images/faces/10.jpg"
                          alt="user"
                        />
                      </div>
                      <div className="chat-details">
                        <div className="chat-name">
                          <p>Rajneesh</p>
                        </div>
                        <div className="chat-message">
                          <p>Can't wait to discuss our project...</p>
                        </div>
                      </div>
                      <div className="chat-time">
                        <p>09:30AM</p>
                        <p className="notification">1</p>
                      </div>
                    </div>
                    <div className="chat-item">
                      <div className="borders-color">
                        <img
                          src="https://spruko.com/demo/rixzo/dist/assets/images/faces/1.jpg"
                          alt="user"
                        />
                      </div>
                      <div className="chat-details">
                        <div className="chat-name">
                          <p>Natalie Portman</p>
                        </div>
                        <div className="chat-message">
                          <p>Can't wait to discuss our project...</p>
                        </div>
                      </div>
                      <div className="chat-time">09:30AM</div>
                    </div>
                    <div className="chat-item">
                      <div className="borders-color">
                        <img
                          src="https://spruko.com/demo/rixzo/dist/assets/images/faces/2.jpg"
                          alt="user"
                        />
                      </div>
                      <div className="chat-details">
                        <div className="chat-name">
                          <p>Damini</p>
                        </div>
                        <div className="chat-message">
                          <p>work done.</p>
                        </div>
                      </div>
                      <div className="chat-time">09:30AM</div>
                    </div> */}
                        {/* <div className="chat-item">
                  <img src="https://spruko.com/demo/rixzo/dist/assets/images/faces/4.jpg" alt="user">
                  <div className="chat-details">
                      <div className="chat-name">Natalie Portman</div>
                      <div className="chat-message">Can't wait to discuss our project...</div>
                  </div>
                  <div className="chat-time">09:30AM</div>
              </div> */}
                      </div>
                    </div>
                    <div className="main-chat-area border">
                      <div className="chat-box">
                        <div className="chat-header-section">
                          <div className="d-flex align-items-center justify-content-space-between">
                            <div className="borders-color">
                              <img
                                src="https://spruko.com/demo/rixzo/dist/assets/images/faces/3.jpg"
                                alt="User"
                                className="user-avatar"
                              />
                              <div className="user-online" />
                            </div>
                            <div>
                              <div className="user-details">
                                <h5>Ella Fitzgerald</h5>
                                <p className="status"></p>
                                <p>Last seen: Today, 8:45AM</p>
                                <p />
                              </div>
                            </div>
                          </div>
                          <div className="icons-header me-3">
                            <div className="d-flex align-items-center justify-content-start">
                              <div className="phone">
                                <i className="fa-solid fa-phone" />
                              </div>
                              <div>
                                <div className="video">
                                  <i className="fa-solid fa-video" />
                                </div>
                              </div>
                              <div className="user">
                                <i className="fa-solid fa-user-tie" />
                              </div>
                              <div className="three-dot">
                                <i className="fa-solid fa-ellipsis-vertical" />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* <div className="chat-content" ref={chatContainerRef}>
                      <div className="chat-message incomings">
                        <div className="borders-color-chat">
                          <img
                            src="https://spruko.com/demo/rixzo/dist/assets/images/faces/3.jpg"
                            alt="User"
                            className="user-image"
                          />
                        </div>
                        <div className="message-content">
                          <p>
                            Hey! 😊 Have you tried that new restaurant in town? I heard
                            their biryani is fantastic!
                          </p>
                          <p className="timestamp">Today, 10:20 PM</p>
                        </div>
                      </div>
                      <div className="chat-message outgoings">
                        <div className="message-content message-time">
                          <p>
                            Oh, hey! 😊 I've been meaning to go! I'm free this weekend,
                            maybe we can check it out together?
                          </p>
                          <p className="timestamp">Today, 11:50 PM</p>
                        </div>
                        <div className="borders-color-chat">
                          <img
                            src="https://spruko.com/demo/rixzo/dist/assets/images/faces/9.jpg"
                            alt="You"
                            className="user-image"
                          />
                        </div>
                      </div>
                      <div className="chat-message incomings">
                        <div className="borders-color-chat">
                          <img
                            src="https://spruko.com/demo/rixzo/dist/assets/images/faces/3.jpg"
                            alt="User"
                            className="user-image"
                          />
                        </div>
                        <div className="message-content">
                          <p>
                            Absolutely! I've heard the ambience is great too. Let's decide
                            on a time!
                          </p>
                          <p className="timestamp">Today, 10:20 PM</p>
                        </div>
                      </div>
                      <div className="chat-message outgoings">
                        <div className="message-content message-time">
                          <p>yes </p>
                          <p className="timestamp">Today, 11:50 PM</p>
                        </div>
                        <div className="borders-color-chat">
                          <img
                            src="https://spruko.com/demo/rixzo/dist/assets/images/faces/9.jpg"
                            alt="You"
                            className="user-image"
                          />
                        </div>
                      </div>
                      <div className="chat-message incomings">
                        <div className="borders-color-chat">
                          <img
                            src="https://spruko.com/demo/rixzo/dist/assets/images/faces/3.jpg"
                            alt="User"
                            className="user-image"
                          />
                        </div>
                        <div className="message-content">
                          <p>done </p>
                          <p className="timestamp">Today, 10:20 PM</p>
                        </div>
                      </div>
                      <div className="chat-message incomings ">
                        <div className="borders-color-chat">
                          <img
                            src="https://spruko.com/demo/rixzo/dist/assets/images/faces/3.jpg"
                            alt="User"
                            className="user-image"
                          />
                        </div>
                        <div>
                          <div className="message-content">
                            <p>hiii</p>
                          </div>
                          <p className="timestamp">Today, 10:20 PM</p>
                        </div>
                      </div>
                      <div className="chat-message outgoings">
                        <div className="message-content message-time">
                          <div>
                            <p>Good</p>
                          </div>
                          <p className="timestamp">Today, 11:50 PM</p>
                        </div>
                        <div className="borders-color-chat">
                          <img
                            src="https://spruko.com/demo/rixzo/dist/assets/images/faces/9.jpg"
                            alt="You"
                            className="user-image"
                          />
                        </div>
                      </div>
                      <div className="chat-message incomings">
                        <div className="borders-color-chat">
                          <img
                            src="https://spruko.com/demo/rixzo/dist/assets/images/faces/3.jpg"
                            alt="User"
                            className="user-image"
                          />
                        </div>
                        <div className="message-content">
                          <p>how are you ?</p>
                          <p className="timestamp">Today, 10:20 PM</p>
                        </div>
                      </div>
                      <div className="chat-message incomings">
                        <div className="borders-color-chat">
                          <img
                            src="https://spruko.com/demo/rixzo/dist/assets/images/faces/3.jpg"
                            alt="User"
                            className="user-image"
                          />
                        </div>
                        <div className="message-content">
                          <p>done </p>
                          <p className="timestamp">Today, 10:20 PM</p>
                        </div>
                      </div>
                    </div> */}

                        {loading ? (
                          <div className="w_loader">
                            <div className="spinner-border" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          </div>
                        ) : (
                          <div className="chat-content" ref={chatContainerRef}>
                            <div
                              className="chart-text"
                            >
                              {activeChatMessages &&
                                activeChatMessages.map((item, index) => (
                                  <>
                                    <div
                                      className={`chat-message ${item?.wp_receiver_id === activeChat
                                        ? "incomings"
                                        : "outgoings"
                                        }`}
                                      key={index}
                                    >
                                      <div className="borders-color-chat">
                                        <img
                                          src="https://spruko.com/demo/rixzo/dist/assets/images/faces/3.jpg"
                                          alt="User"
                                          className="user-image"
                                        />
                                      </div>
                                      <div className="message-content">
                                        <p>
                                          {item?.message}
                                        </p>
                                        <p className="timestamp">Today, 10:20 PM</p>
                                        <span className="c_time">
                                          {formatTimeFromDate(item?.created_at)}
                                          {item?.delivery_status === "read" &&
                                            item?.wp_receiver_id === activeChat ? (
                                            <i className="fa-solid fa-check-double read ms-2" />
                                          ) : item?.delivery_status === "sent" &&
                                            item?.wp_receiver_id ===
                                            activeChat ? (
                                            <i className="fa-solid fa-check text-muted ms-2" />
                                          ) : (
                                            ""
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  </>
                                ))}
                            </div>
                          </div>
                        )}
                        <div className="chat-input-section">
                          <input type="text" placeholder="Type your message here..." onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            value={message} />
                          <div className="btn">
                            <button className="btns" onClick={handleMessageSend}
                              disabled={sendingMessage}>
                              <i className="fa-solid fa-paper-plane" />
                            </button>
                          </div>
                        </div>
                        <div className="icons-header ">
                          <div className="ms-3  mb-3">
                            <div className="d-flex justify-content-start align-items center">
                              <div className="phone a">
                                <i className="fa-solid fa-camera" />
                              </div>
                              <div className="video b">
                                <i className="fa-solid fa-paperclip" />
                              </div>
                              <div className="user c">
                                <i className="fa-regular fa-face-smile" />
                              </div>
                              <div className="three-dot d">
                                <i className="fa-brands fa-meta" />
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
            :
            <>
              {
                isPopupOpen ?
                  <div className="whatsapp-not-allowed">
                    <div className="popup">
                      <div className="container h-100">
                        <div className="row h-100 justify-content-center align-items-center">
                          <div className="row content col-xl-4 col-md-5">

                            <div className="col-10 ps-0">
                              <h4>Warning!</h4>
                              <p>
                                This module is not configured!
                              </p>
                              <div className="d-flex justify-content-between">

                                {/* <button
                            disabled={loading}
                            className="panelButton m-0"
                          // onClick={() => handleDelete(deleteId)}
                          >
                            <span className="text">Confirm</span>
                            <span className="icon">
                              <i className="fa-solid fa-check"></i>
                            </span>
                          </button> */}

                                <button
                                  className="panelButton gray m-0 float-end"
                                  onClick={() => setIsPopupOpen(false)}
                                >
                                  <span className="text">Cancel</span>
                                  <span className="icon">
                                    <i className="fa-solid fa-xmark"></i>
                                  </span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  :
                  <div>
                    This module is not configured!
                  </div>
              }
            </>

        }


      </main>
    </>
  );
};

export default WhatsAppChatBox;
