import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SideNavbarApp from "./SideNavbarApp";
import ActiveCallSidePanel from "./ActiveCallSidePanel";
import { Messager, UserAgent } from "sip.js";
import { SIPProvider, useSIPProvider, CONNECT_STATUS } from "react-sipjs";

function Messages() {
  const sipProvider = useSIPProvider();
  const sessions = useSelector((state) => state.sessions);
  const [recipient, setRecipient] = useState("1013");
  const account = useSelector((state) => state.account);
  const [allMessage, setAllMessage] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [isSIPReady, setIsSIPReady] = useState(false); // Track if SIP provider is ready
  const extension = account?.extension?.extension || "";

  useEffect(() => {
    if (sipProvider && sipProvider.connectStatus === CONNECT_STATUS.CONNECTED) {
      setIsSIPReady(true);
    } else {
      setIsSIPReady(false);
    }
  }, [sipProvider?.connectStatus]);
  const sendMessage = () => {
    if (isSIPReady) {
      const targetURI = `sip:${recipient}@${account.domain.domain_name}`;
      const userAgent = sipProvider?.sessionManager?.userAgent;

      const target = UserAgent.makeURI(targetURI);

      if (target) {
        try {
          const messager = new Messager(userAgent, target, messageInput);
          messager.message();
          const time = new Date().toLocaleString();
          setAllMessage((prevState) => [
            ...prevState,
            { from: extension, body: messageInput,time:time },
          ]);
          setMessageInput("");

          console.log("Message sent to:", targetURI);
        } catch (error) {
          console.error("Error sending message:", error);
        }
      } else {
        console.error("Invalid recipient address.");
      }
    } else {
      console.error("UserAgent or session not ready.");
    }
  };

  //   useEffect(() => {
  const userAgent = sipProvider?.sessionManager?.userAgent;

  if (userAgent) {
    // Setup message delegate to handle incoming messages
    userAgent.delegate = {
      onMessage: (message) => {
        const from =
          message?.incomingMessageRequest?.message?.from?.uri?.user.toString();
        const body = message?.incomingMessageRequest?.message?.body;

        // Get the current time when the message is received
        const time = new Date().toLocaleString(); // Or use .toISOString() for UTC format

        setAllMessage((prevState) => [
          ...prevState,
          { from, body, time },
        ]);

        console.log(
          `Received message from ${from}: ${body} at ${time}`,
          message
        );
      },
    };

    //   return () => {
    //     // Cleanup delegate if needed
    //     userAgent.delegate = null;
    //   };
  }
  //   }, [sipProvider]);

  console.log(allMessage);
  return (
    <>
      {/* <SideNavbarApp /> */}
      <main
        className="mainContentApp"
        style={{
          marginRight:
            sessions.length > 0 && Object.keys(sessions).length > 0
              ? "250px"
              : "0",
        }}
      >
        <section>
          <div className="container-fluid">
            <div className="row">
              <div
                className="col-12 col-xl-6 d-flex flex-wrap justify-content-between py-3 border-end"
                style={{ height: "100%" }}
              >
                <div className="col-auto">
                  <h3 style={{ fontFamily: "Outfit", color: "#444444" }}>
                    Messages
                  </h3>
                </div>
                <div className="col-auto d-flex">
                  <div className="col-auto">
                    <button className="appPanelButton" effect="ripple">
                      <i className="fa-solid fa-message-plus"></i>
                    </button>
                  </div>
                  <div className="col-auto">
                    <button className="appPanelButton" effect="ripple">
                      <i className="fa-solid fa-gear"></i>
                    </button>
                  </div>
                </div>
                <div className="col-12">
                  <nav>
                    <div className="nav nav-tabs">
                      <button className={"tabLink active"} data-category="all">
                        All
                      </button>
                      <button
                        className={"tabLink"}
                        effect="ripple"
                        data-category="incoming"
                      >
                        Received
                      </button>
                      <button
                        className={"tabLink"}
                        effect="ripple"
                        data-category="outgoing"
                      >
                        Sent
                      </button>
                      <button
                        className={"tabLink"}
                        effect="ripple"
                        data-category="missed"
                      >
                        Failed
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
                    </div>
                    <div className="callList">
                      <div className="text-center callListItem">
                        <h5 className="fw-semibold">Today</h5>
                      </div>
                      <div className="contactListItem">
                        <div
                          onClick={() => setRecipient(1009)}
                          className="row justify-content-between"
                        >
                          <div className="col-xl-6 d-flex">
                            <div className="profileHolder" id="profileOnline">
                              <i className="fa-light fa-user fs-5"></i>
                            </div>
                            <div className="my-auto ms-2 ms-xl-3">
                              <h4>AUSER XYZ</h4>
                              <h5>1009</h5>
                            </div>
                          </div>
                          {/* <div className="col-10 col-xl-4">
                            <h4>
                              <span>Received</span>
                            </h4>
                            <h5>1 Attachment</h5>
                          </div> */}
                          <div className="col-auto text-end d-flex justify-content-center align-items-center">
                            <h5>12:46pm</h5>
                          </div>
                        </div>
                      </div>
                      <div className="contactListItem">
                        <div
                          onClick={() => setRecipient(1001)}
                          className="row justify-content-between"
                        >
                          <div className="col-xl-6 d-flex">
                            <div className="profileHolder" id="profileOnline">
                              <i className="fa-light fa-user fs-5"></i>
                            </div>
                            <div className="my-auto ms-2 ms-xl-3">
                              <h4>AUSER XYZ</h4>
                              <h5>1001</h5>
                            </div>
                          </div>
                          {/* <div className="col-10 col-xl-4">
                            <h4>
                              <span>Received</span>
                            </h4>
                            <h5>1 Attachment</h5>
                          </div> */}
                          <div className="col-auto text-end d-flex justify-content-center align-items-center">
                            <h5>12:46pm</h5>
                          </div>
                        </div>
                      </div>
                      <div className="contactListItem">
                        <div
                          onClick={() => setRecipient(1000)}
                          className="row justify-content-between"
                        >
                          <div className="col-xl-6 d-flex">
                            <div className="profileHolder" id="profileOnline">
                              <i className="fa-light fa-user fs-5"></i>
                            </div>
                            <div className="my-auto ms-2 ms-xl-3">
                              <h4>AUSER XYZ</h4>
                              <h5>1000</h5>
                            </div>
                          </div>
                          {/* <div className="col-10 col-xl-4">
                            <h4>
                              <span>Received</span>
                            </h4>
                            <h5>1 Attachment</h5>
                          </div> */}
                          <div className="col-auto text-end d-flex justify-content-center align-items-center">
                            <h5>12:46pm</h5>
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
                <div className="messageOverlay">
                  <div className="contactHeader">
                    <div>
                      <h4>{recipient}</h4>
                      <span className="status online">Online</span>
                    </div>
                    <div className="d-flex my-auto">
                      <button
                        className="appPanelButton"
                        effect="ripple"
                        onclick="location.href='http://192.168.2.220/ringerappCI/webrtc/user-app-caller'"
                      >
                        <i className="fa-light fa-phone" />
                      </button>
                      <button
                        className="appPanelButton"
                        effect="ripple"
                        onclick="location.href='http://192.168.2.220/ringerappCI/webrtc/user-app-videocaller'"
                      >
                        <i className="fa-light fa-video" />
                      </button>
                    </div>
                  </div>
                  <div className="messageContent">
                    <div className="messageList">
                      {allMessage.map((item, index) => {
                        return (
                          <>
                            {item.from == extension ? (
                              <div className="messageItem sender">
                                <div className="first">
                                  <div className="profileHolder">US</div>
                                </div>
                                <div className="second">
                                  <h6>
                                     <span>{item.time.split(" ")[1]}</span>
                                  </h6>
                                  <div className="messageDetails">
                                    <p>{item.body}</p>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="messageItem receiver">
                                <div className="first">
                                  <div className="profileHolder">US</div>
                                </div>
                                <div className="second">
                                  <h6>
                                     <span>{item.time.split(" ")[1]}</span>
                                  </h6>
                                  <div className="messageDetails">
                                    <p>{item.body}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        );
                      })}
                    </div>
                    <div className="messageInput">
                      <div className="col-10">
                        <input
                          type="text"
                          name=""
                          id=""
                          placeholder="Please enter your message"
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyDown={(e) => {
                            console.log(e);
                            if (e.key === "Enter") {
                              sendMessage();
                            }
                          }}
                        />
                      </div>
                      <div className="col-auto d-flex">
                        <button
                          effect="ripple"
                          className="appPanelButtonColor2 ms-auto"
                        >
                          <i className="fa-regular fa-paperclip" />
                        </button>
                        <button
                          effect="ripple"
                          className="appPanelButtonColor"
                          onClick={() => sendMessage()}
                        >
                          <i className="fa-solid fa-paper-plane-top" />
                        </button>
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
  );
}

export default Messages;
