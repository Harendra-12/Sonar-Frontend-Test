import React from 'react'
import Header from '../../CommonComponents/Header';
import { Navigate } from 'react-router-dom';
import { backToTop } from '../../GlobalFunction/globalFunction';

function LiveChat() {
  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid px-0">
          <Header title="Live Chat" />
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
                          <p>Ella Fitzgerald</p>
                        </div>
                        <div className="chat-message">
                          <p>Typing...</p>
                        </div>
                      </div>
                      <div className="chat-time">08:45AM</div>
                    </div>
                    <div className="chat-item">
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
                    </div>
                    {/* <div class="chat-item">
                  <img src="https://spruko.com/demo/rixzo/dist/assets/images/faces/4.jpg" alt="user">
                  <div class="chat-details">
                      <div class="chat-name">Natalie Portman</div>
                      <div class="chat-message">Can't wait to discuss our project...</div>
                  </div>
                  <div class="chat-time">09:30AM</div>
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
                    <div className="chat-content">
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
                    </div>
                    <div className="chat-input-section align-items-center">
                      <input type="text" placeholder="Type your message here..." />
                      <div className="btn">
                        <button className="btns">
                          <i className="fa-solid fa-paper-plane" />
                        </button>
                      </div>
                    <div className="icons-header ">
                      <div className="">
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
        </div>




      </section>

    </main>
  )
}

export default LiveChat