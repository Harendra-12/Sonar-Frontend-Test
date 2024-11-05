import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Messager, UserAgent } from "sip.js";
import { useSIPProvider, CONNECT_STATUS } from "react-sipjs";
import AgentSearch from "./AgentSearch";
import { generalGetFunction } from "../../GlobalFunction/globalFunction";

function Messages() {
  const loginUser = useSelector((state) => state.loginUser);
  const messageListRef = useRef(null);
  const sipProvider = useSIPProvider();
  const sessions = useSelector((state) => state.sessions);
  const [recipient, setRecipient] = useState([]);
  const account = useSelector((state) => state.account);
  const [allMessage, setAllMessage] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [isSIPReady, setIsSIPReady] = useState(false); // Track if SIP provider is ready
  const extension = account?.extension?.extension || "";
  const [contact, setContact] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [loadMore, setLoadMore] = useState(1);
  const [isFreeSwitchMessage, setIsFreeSwitchMessage] = useState(true);
  const [agents, setAgents] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [onlineUser, setOnlineUser] = useState([]);
  const [unreadMessage, setUnreadMessage] = useState([]);

  console.log("All agents", agents);

  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction(`/message/contacts`);
      if (apiData?.status && apiData.data.length > 0) {
        setContact(apiData.data);
        setRecipient([apiData.data[0].extension, apiData.data[0].id]);
      }
    }
    getData();
  }, []);

  useEffect(() => {
    if (sipProvider && sipProvider.connectStatus === CONNECT_STATUS.CONNECTED) {
      console.log("SIP provider connected", sipProvider.connectStatus);

      setIsSIPReady(true);
    } else {
      setIsSIPReady(false);
    }
  }, [sipProvider?.connectStatus]);

  useEffect(() => {
    console.log("Inside apiCalling");

    async function getData(pageNumb) {
      const apiData = await generalGetFunction(
        `message/all?receiver_id=${recipient[1]}&page=${pageNumb}`
      );

      apiData.data.data.map((item) => {
        setAllMessage((prevState) => ({
          ...prevState,
          [recipient[0]]: [
            {
              from: item.user_id === recipient[1] ? recipient[0] : extension,
              body: item.message_text,
              time: item.created_at,
            },
            ...(prevState[recipient[0]] || []),
          ],
        }));
      });
      if (apiData?.status) {
        const newChatHistory = { ...chatHistory };
        newChatHistory[recipient[0]] = {
          total: apiData.data.total,
          pageNumber: apiData.data.current_page,
        };
        setChatHistory(newChatHistory);
      }
    }
    if (recipient.length > 0) {
      if (Object.keys(chatHistory).includes(recipient[0])) {
        if (
          chatHistory[recipient[0]]?.total &&
          chatHistory[recipient[0]].pageNumber * 40 <
          chatHistory[recipient[0]].total
        ) {
          getData(chatHistory[recipient[0]].pageNumber + 1);
          setIsFreeSwitchMessage(false);
        }
      } else {
        getData(1);
        setIsFreeSwitchMessage(true);
      }
    }
  }, [recipient, loadMore]);

  console.log("Chat history", chatHistory);

  const sendMessage = () => {
    if (isSIPReady) {
      const targetURI = `sip:${recipient[0]}@${account.domain.domain_name}`;
      const userAgent = sipProvider?.sessionManager?.userAgent;

      const target = UserAgent.makeURI(targetURI);

      if (target) {
        try {
          const messager = new Messager(userAgent, target, messageInput);
          messager.message();
          const time = new Date().toLocaleString();
          setIsFreeSwitchMessage(true);
          setAllMessage((prevState) => ({
            ...prevState,
            [recipient[0]]: [
              ...(prevState[recipient[0]] || []),
              { from: extension, body: messageInput, time },
            ],
          }));
          setActiveTab("all");

          const extensionExists = contact.some(
            (contact) => contact.extension === recipient[0]
          );
          const agentDetails = agents.find(
            (agent) => agent.extension.extension === recipient[0]
          );

          if (!extensionExists) {
            contact.unshift({
              name: agentDetails.username,
              email: agentDetails.email,
              id: agentDetails.id,
              extension_id: agentDetails.extension_id,
              extension: recipient[0],
            });
          }
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

  const sendFileMessage = async (file) => {
    if (isSIPReady) {
      const targetURI = `sip:${recipient[0]}@${account.domain.domain_name}`;
      const userAgent = sipProvider?.sessionManager?.userAgent;

      const target = UserAgent.makeURI(targetURI);

      const convertImageToBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file); // This converts to Base64
        });
      };

      if (target && file) {
        try {
          // Convert file to Base64 string
          const fileContent = await convertImageToBase64(file); // Await here!

          // Create a message with the Base64 content
          const messager = new Messager(
            userAgent,
            target,
            fileContent,
            file.type
          ); // Use correct content type

          // Send the message with proper MIME type and extra headers
          messager.message({
            extraHeaders: [
              `Content-Type: ${file.type}`, // e.g., image/png
              `Content-Disposition: attachment; filename="${file.name}"`,
            ],
          });

          // Add a record to the message history (optional)
          const time = new Date().toLocaleString();
          setAllMessage((prevState) => ({
            ...prevState,
            [recipient[0]]: [
              ...(prevState[recipient[0]] || []),
              { from: extension, body: messageInput, time },
            ],
          }));
          setActiveTab("all");

          console.log("File sent to:", targetURI);
        } catch (error) {
          console.error("Error sending file:", error);
        }
      } else {
        console.error("Invalid recipient address or file.");
      }
    } else {
      console.error("UserAgent or session not ready.");
    }
  };

  const userAgent = sipProvider?.sessionManager?.userAgent;

  if (userAgent) {
    // Setup message delegate to handle incoming messages
    userAgent.delegate = {
      onMessage: (message) => {
        const from =
          message?.incomingMessageRequest?.message?.from?.uri?.user.toString();
        const body = message?.incomingMessageRequest?.message?.body;
        setIsFreeSwitchMessage(true);
        const extensionExists = contact.some(
          (contact) => contact.extension === from
        );
        const agentDetails = agents.find(
          (agent) => agent.extension.extension === from
        );

        if (!extensionExists) {
          contact.unshift({
            name: agentDetails.username,
            email: agentDetails.email,
            id: agentDetails.id,
            extension_id: agentDetails.extension_id,
            extension: from,
          });
        } else {
          // Move the extension object to the beginning of the array
          const index = contact.findIndex(
            (contact) => contact.extension === from
          );
          const extensionObject = contact.splice(index, 1)[0];
          contact.unshift(extensionObject);
        }
        // Check Content-Type for the incoming message
        const contentType =
          message?.incomingMessageRequest?.message?.getHeader("Content-Type");

        // Get the current time when the message is received
        const time = new Date().toLocaleString(); // Or use .toISOString() for UTC format

        // Check if the content is an image

        const audio = new Audio(
          require("../../assets/music/message-notification.mp3")
        );
        if (contentType && contentType.startsWith("image/")) {
          // If it's an image, create a URL for the Base64 image to render it in <img>
          const imageUrl = `${body}`;

          // Update the state to include the image
          setAllMessage((prevState) => ({
            ...prevState,
            [from]: [...(prevState[from] || []), { from, body, time }],
          }));

          // Add number of unread messaeg based on extension
          setUnreadMessage((prevState) => ({
            ...prevState,
            [from]: (prevState[from] || 0) + 1,
          }));
        } else {
          // If it's a text message or other type, render as text
          setAllMessage((prevState) => ({
            ...prevState,
            [from]: [...(prevState[from] || []), { from, body, time }],
          }));

          // Play music when message is received

          if (recipient[0] !== from) {
            setUnreadMessage((prevState) => ({
              ...prevState,
              [from]: (prevState[from] || 0) + 1,
            }));
            audio.play();
          }
        }
      },
    };
  }

  useEffect(() => {
    if (isFreeSwitchMessage) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [allMessage]);

  console.log(allMessage);

  useEffect(() => {
    const handleScroll = () => {
      if (messageListRef.current) {
        const threshold = messageListRef.current.scrollHeight * 0.9;
        if (messageListRef.current.scrollTop >= threshold) {
          console.log("User has reached 90% from top", chatHistory);
          setLoadMore(loadMore + 1);
        }
      }
    };

    if (messageListRef.current) {
      messageListRef.current.addEventListener("scroll", handleScroll);
    }
  }, []);

  useEffect(() => {
    if (loginUser.length > 0) {
      const updatedOnlineUsers = loginUser
        .map((item) => {
          const findUser = agents.find((agent) => agent.id === item.id);
          return findUser;
        })
        .filter((user) => user !== undefined);

      setOnlineUser(updatedOnlineUsers);
    } else {
      setOnlineUser([]);
    }
  }, [loginUser]);

  console.log("UnreadMessage", unreadMessage);

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
        <section>
          <div className="container-fluid">
            <div className="row">
              <div
                className="col-12 col-xl-3 d-flex flex-wrap justify-content-between py-3 border-end"
                style={{ height: "100%" }}
              >
                <div className="col-auto">
                  <h3 style={{ fontFamily: "Outfit", color: "#444444" }}>
                    Messages <button class="clearButton"><i class="fa-regular fa-arrows-rotate fs-5" style={{ color: 'rgb(148, 148, 148)' }}></i></button>
                  </h3>
                </div>
                <div className="col-12 mt-3">
                  <AgentSearch
                    getDropdownValue={setRecipient}
                    getAllAgents={setAgents}
                  />
                </div>
                <div className="col-12">
                  <nav className="my-3">
                    <div className="nav nav-tabs">
                      <button
                        className={
                          activeTab === "all" ? "tabLink active" : "tabLink"
                        }
                        data-category="all"
                        onClick={() => setActiveTab("all")}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setActiveTab("online")}
                        className={
                          activeTab === "online" ? "tabLink active" : "tabLink"
                        }
                        effect="ripple"
                        data-category="incoming"
                      >
                        Online
                      </button>
                    </div>
                  </nav>
                  {activeTab === "all" ? (
                    <div className="tab-content">
                      {/* <AgentSearch
                        getDropdownValue={setRecipient}
                        getAllAgents={setAgents}
                      /> */}
                      <div className="callList" style={{ height: 'calc(100vh - 200px)' }}>
                        <div className="chatHeading" data-bell={""}>
                          <h5 data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">Pinned <i class="fa-solid fa-caret-down"></i></h5>
                        </div>
                        <div class="collapse" id="collapseExample" style={{ borderBottom: '1px solid #ddd', marginBottom: 12 }}>
                          <div className="contactListItem" data-bell={""}>
                            <div className="row justify-content-between">
                              <div className="col-xl-12 d-flex">
                                <div
                                  className="profileHolder"
                                  id={"profileOfflineNav"}
                                >
                                  <i className="fa-light fa-user fs-5"></i>
                                </div>
                                <div className="my-auto ms-2 ms-xl-3">
                                  <h4>Test</h4>
                                  <h5>0000</h5>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {contact.map((item) => {
                          return (
                            <div
                              data-bell={
                                unreadMessage[item?.extension]
                                  ? unreadMessage[item?.extension]
                                  : ""
                              }
                              className={
                                recipient[0] === item?.extension
                                  ? "contactListItem selected"
                                  : "contactListItem"
                              }
                            >
                              <div
                                onClick={() => {
                                  setRecipient([item?.extension, item.id]);
                                  setUnreadMessage((prevState) => {
                                    const {
                                      [item?.extension]: _,
                                      ...newState
                                    } = prevState;
                                    return newState;
                                  });
                                }}
                                className="row justify-content-between"
                              >
                                <div className="col-xl-12 d-flex">
                                  <div
                                    className="profileHolder"
                                    id={
                                      onlineUser.find(
                                        (user) => user.id === item.id
                                      )
                                        ? "profileOnlineNav"
                                        : "profileOfflineNav"
                                    }
                                  >
                                    <i className="fa-light fa-user fs-5"></i>
                                  </div>
                                  <div className="my-auto ms-2 ms-xl-3">
                                    <h4>{item?.name}</h4>
                                    <h5>{item?.extension}</h5>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="tab-content">
                      {/* <AgentSearch
                        getDropdownValue={setRecipient}
                        getAllAgents={setAgents}
                      /> */}
                      <div className="callList">
                        {onlineUser.map((item) => {
                          return (
                            <div
                              data-bell=""
                              className={
                                recipient[0] === item?.extension.extension
                                  ? "contactListItem selected"
                                  : "contactListItem"
                              }
                            >
                              <div
                                onClick={() =>
                                  setRecipient([
                                    item?.extension.extension,
                                    item.id,
                                  ])
                                }
                                className="row justify-content-between"
                              >
                                <div className="col-xl-12 d-flex">
                                  <div
                                    className="profileHolder"
                                    id="profileOnlineNav"
                                  >
                                    <i className="fa-light fa-user fs-5"></i>
                                  </div>
                                  <div className="my-auto ms-2 ms-xl-3">
                                    <h4>{item?.username}</h4>
                                    <h5>{item?.extension.extension}</h5>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {onlineUser.length === 0 && (
                          <div data-bell="" className="contactListItem">
                            <div className="row justify-content-between">
                              <div className="col-xl-12 d-flex">
                                {/* <div
                                  className="profileHolder"
                                  id="profileOnline"
                                >
                                  <i className="fa-light fa-user fs-5"></i>
                                </div> */}
                                <div className="my-auto ms-2 ms-xl-3">
                                  <h4>No online user found</h4>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div
                className="col-12 col-xl-9 callDetails eFaxCompose"
                style={{ height: "100%" }}
                id="callDetails"
              >
                <div className="messageOverlay">
                  {recipient[0] ? (
                    <div className="contactHeader">
                      <div>
                        <h4>{recipient[0]}</h4>
                        {console.log('test', recipient[0])}
                        {/* <span className="status online">Online</span> */}
                      </div>
                      <div className="d-flex my-auto">
                        <button
                          className="clearButton2 xl"
                          effect="ripple"
                        >
                          <i className="fa-light fa-phone" />
                        </button>
                        <button
                          className="clearButton2 xl"
                          effect="ripple"
                        >
                          <i className="fa-light fa-video" />
                        </button>
                        <div class="dropdown">
                          <button class="clearButton2 xl" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fa-solid fa-ellipsis-vertical"></i>
                          </button>
                          <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#">Start Call</a></li>
                            <li><a class="dropdown-item" href="#">Send Message</a></li>
                            <li><a class="dropdown-item" href="#">Add to Contact</a></li>
                            <li><a class="dropdown-item" href="#">Delete Contact</a></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="messageContent">
                    <div className="messageList" ref={messageListRef}>
                      {allMessage?.[recipient[0]]?.map((item, index) => {
                        // console.log("inside loop", item);
                        return (
                          <>
                            {item.from == extension ? (
                              <div className="messageItem sender">
                                <div className="second">
                                  <h6>{item.from},
                                    <span>
                                      {item.time
                                        .split(" ")[1]
                                        .split(":")
                                        .slice(0, 2)
                                        .join(":")}
                                    </span>
                                  </h6>
                                  <div className="messageDetails">
                                    <p>{item.body}</p>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="messageItem receiver">
                                <div className="second">
                                  <h6>
                                    {item.from},
                                    <span>
                                      {item.time
                                        .split(" ")[1]
                                        .split(":")
                                        .slice(0, 2)
                                        .join(":")}
                                    </span>
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
                      {recipient[0] ? (
                        ""
                      ) : (
                        <div className="startAJob">
                          <div class="text-center mt-3">
                            <img
                              src={require("../../assets/images/empty-box.png")}
                              alt="Empty"
                            ></img>
                            <div>
                              <h5>
                                Please select a <b>Agent</b> to start{" "}
                                <span>a conversation</span>.
                              </h5>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {recipient[0] ? (
                      <div className="messageInput">
                        <div className="col-12">
                          <nav>
                            <div class="nav nav-tabs" id="nav-tab" role="tablist">
                              <button class="tabLink active" id="nav-sms-tab" data-bs-toggle="tab" data-bs-target="#nav-sms" type="button" role="tab" aria-controls="nav-sms" aria-selected="true">SMS</button>
                              <button class="tabLink" id="nav-whatsapp-tab" data-bs-toggle="tab" data-bs-target="#nav-whatsapp" type="button" role="tab" aria-controls="nav-whatsapp" aria-selected="false" disabled>WhatsApp</button>
                              <button class="tabLink" id="nav-skype-tab" data-bs-toggle="tab" data-bs-target="#nav-skype" type="button" role="tab" aria-controls="nav-skype" aria-selected="false" disabled>Skype</button>
                            </div>
                          </nav>
                        </div>
                        <div class="tab-content col-12" id="nav-tabContent">
                          <div class="tab-pane fade show active" id="nav-sms" role="tabpanel" aria-labelledby="nav-sms-tab">
                            <textarea
                              type="text"
                              name=""
                              className="input"
                              placeholder="Please enter your message"
                              value={messageInput}
                              onChange={(e) => setMessageInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  sendMessage();
                                }
                              }}
                            />
                          </div>
                          <div class="tab-pane fade" id="nav-whatsapp" role="tabpanel" aria-labelledby="nav-whatsapp-tab">...</div>
                          <div class="tab-pane fade" id="nav-skype" role="tabpanel" aria-labelledby="nav-skype-tab">...</div>
                        </div>

                        <div className="col-12 d-flex justify-content-between align-items-center">
                          <div className="d-flex">
                            <button className="clearButton2">
                              <i className="fa-light fa-eraser" />
                            </button>
                            <button className="clearButton2">
                              <i class="fa-regular fa-image"></i>
                            </button>
                            <button className="clearButton2">
                              <i class="fa-solid fa-paperclip"></i>
                            </button>
                            <button className="clearButton2">
                              <i class="fa-regular fa-face-smile"></i>
                            </button>
                          </div>
                          <div>
                            <button
                              effect="ripple"
                              className="clearColorButton dark"
                              onClick={() => sendMessage()}
                            >
                              Send Now <i className="fa-solid fa-paper-plane-top" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main >
    </>
  );
}

export default Messages;
