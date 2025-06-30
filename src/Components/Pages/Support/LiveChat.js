import React, { useCallback, useEffect, useState } from 'react'
import Header from '../../CommonComponents/Header';
import { Navigate, useLocation } from 'react-router-dom';
import { awsGeneralGetFunction, backToTop, featureUnderdevelopment } from '../../GlobalFunction/globalFunction';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { api_url } from '../../../urls';

function LiveChat() {
  const [loading, setLoading] = useState(false);
  const [sendMessage, setSendMessage] = useState("");
  const account = useSelector((state) => state.account);
  const [aiMessageLog, setAiMessageLog] = useState([]);
  const locationState = useLocation();

  const handleSendMessageToAI = async () => {
    if (!sendMessage || sendMessage.trim() === "") {
      toast.error("Please enter a message");
    } else {
      setLoading(true);
      setAiMessageLog((prev) => {
        return [...prev, { message: sendMessage, time: new Date().toLocaleTimeString(), status: 'pending' }];
      });
      setSendMessage("");
      const payload = {
        "user_id": account.id,
        "session_id": 'ticket_id-' + locationState?.state || 'n/a',
        "message": sendMessage,
        "crm_data_used": false,
      }
      // axios.post("https://4ofg0goy8h.execute-api.us-east-2.amazonaws.com/dev2/chat_bot", payload).then((res) => {
      //   setLoading(false);
      //   setAiMessageLog((prev) => {
      //     return [...prev, { ...res.data, time: new Date().toLocaleTimeString(), status: 'success' }];
      //   });
      // })
      //   .catch((err) => {
      //     toast.error(err.message);
      //     setLoading(false);
      //   }); 
      const res = await awsGeneralGetFunction(api_url?.CHAT_BOT)
      if (res?.status) {
        setLoading(false);
        setAiMessageLog((prev) => {
          return [...prev, { ...res.data, time: new Date().toLocaleTimeString(), status: 'success' }];
        });
      }else{
        toast.error(res?.message)
        setLoading(false);
      }
    }
  }

  // Function to handle Enter key press
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter") {
        handleSendMessageToAI();
      }
    },
    [handleSendMessageToAI]
  );

  // Listen to enter press and then trigger login
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid px-0">
          <Header title="Support" />
        </div>

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
                        onChange={() => featureUnderdevelopment()}
                      />
                      <button
                        className="btn btn-primary"
                        type="button"
                        id="button-addon01"
                        onClick={() => featureUnderdevelopment()}
                      >
                        <i className="fa-solid fa-magnifying-glass" />
                      </button>
                    </div>
                  </div>
                  <div className="tabs justify-content-start">
                    <div className="tab active">Chat</div>
                  </div>
                  <div className="chat-list">
                    <div className="chat-item active">
                      <div className="borders-color">
                        <img
                          src="https://spruko.com/demo/rixzo/dist/assets/images/faces/3.jpg"
                          alt="user"
                        />
                        <div className="user-online" />
                      </div>
                      <div className="chat-details">
                        <div className="chat-name">
                          <p>Support Bot</p>
                        </div>
                        <div className="chat-message">
                          <p>Online</p>
                        </div>
                      </div>
                      <div className="chat-time">08:45AM</div>
                    </div>
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
                            <h5>Support Bot</h5>
                            <p>Available!</p>
                          </div>
                        </div>
                      </div>
                      <div className="icons-header me-3">
                        <div className="d-flex align-items-center justify-content-start">
                          <div className="phone" onClick={() => featureUnderdevelopment()}>
                            <i className="fa-solid fa-phone" />
                          </div>
                          <div>
                            <div className="video" onClick={() => featureUnderdevelopment()}>
                              <i className="fa-solid fa-video" />
                            </div>
                          </div>
                          <div className="user" onClick={() => featureUnderdevelopment()}>
                            <i className="fa-solid fa-user-tie" />
                          </div>
                          <div className="three-dot" onClick={() => featureUnderdevelopment()}>
                            <i className="fa-solid fa-ellipsis-vertical" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="chat-content">
                      {/* <div className="chat-message incomings">
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
                      </div> */}
                      {aiMessageLog && aiMessageLog.length > 0 ? aiMessageLog?.map((item, index) => (
                        <>
                          {item.status == "pending" && <div className="chat-message outgoings">
                            <div className="message-content message-time">
                              <p>
                                {item.message}
                              </p>
                              <p className="timestamp">{item.time}</p>
                            </div>
                            <div className="borders-color-chat">
                              <img
                                src={account?.profile_picture ? account?.profile_picture : require('../../assets/images/placeholder-image.webp')}
                                onError={(e) => e.target.src = require('../../assets/images/placeholder-image.webp')}
                                alt="User"
                                className="user-image"
                              />
                            </div>
                          </div>}
                          {item.status == "success" && <div className="chat-message incomings">
                            <div className="borders-color-chat">
                              <img
                                src="https://spruko.com/demo/rixzo/dist/assets/images/faces/3.jpg"
                                alt="You"
                                className="user-image"
                              />
                            </div>
                            <div className="message-content">
                              <p>
                                {item.reply}
                              </p>
                              <p className="timestamp">{item.time}</p>
                            </div>
                          </div>}
                        </>
                      )) : ""}
                    </div>
                    <div className="chat-input-section align-items-center">
                      <input type="text" placeholder="Type your message here..." onChange={(e) => setSendMessage(e.target.value)} value={sendMessage} disabled={loading} />
                      <div className="btn">
                        <button className="btns" onClick={handleSendMessageToAI} disabled={loading}>
                          <i className={`fa-solid fa-${loading ? 'arrows-rotate fa-spin' : 'paper-plane'}`} />
                        </button>
                      </div>
                      <div className="icons-header ">
                        <div className="">
                          <div className="d-flex justify-content-start align-items center">
                            <div className="phone a" onClick={() => featureUnderdevelopment()}>
                              <i className="fa-solid fa-camera" />
                            </div>
                            <div className="video b" onClick={() => featureUnderdevelopment()}>
                              <i className="fa-solid fa-paperclip" />
                            </div>
                            <div className="user c" onClick={() => featureUnderdevelopment()}>
                              <i className="fa-regular fa-face-smile" />
                            </div>
                            <div className="three-dot d" onClick={() => featureUnderdevelopment()}>
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
        </div>
      </section>
    </main>
  )
}

export default LiveChat