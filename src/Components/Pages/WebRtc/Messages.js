import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Messager, UserAgent } from "sip.js";
import { useSIPProvider, CONNECT_STATUS } from "react-sipjs";
import AgentSearch from "./AgentSearch";
import {
  featureUnderdevelopment,
  generalDeleteFunction,
  generalGetFunction,
  generalPostFunction,
  generalPutFunction,
} from "../../GlobalFunction/globalFunction";
import { toast } from "react-toastify";
import CircularLoader from "../../Loader/CircularLoader";
import { useNavigate } from "react-router-dom";
import Tippy from "@tippyjs/react";

function Messages({
  setSelectedModule,
  isMicOn,
  isVideoOn,
  extensionFromCdrMessage,
  setExtensionFromCdrMessage,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sessionManager, connectStatus } = useSIPProvider();
  const loginUser = useSelector((state) => state.loginUser);
  const globalSession = useSelector((state) => state.sessions);
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
  const [allTags, setAllTags] = useState([]);
  const [addNewTag, setAddNewTag] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [upDateTag, setUpDateTag] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [contactRefresh, setContactRefresh] = useState(0);
  const [isAnyDateHeaderVisible, setIsAnyDateHeaderVisible] = useState(false);
  const dateHeaderRefs = useRef([]); // Store refs for all dateHeader elements
  const visibilityMap = useRef(new Map()); // Track visibility of each ref
  const [refreshstate, setRefreshState] = useState(false);

  console.log("isAnyDateHeaderVisible", contact);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Update visibility for each observed element
        entries.forEach((entry) => {
          visibilityMap.current.set(entry.target, entry.isIntersecting);
        });

        // Check if any element is visible
        const anyVisible = Array.from(visibilityMap.current.values()).some(
          (isVisible) => isVisible
        );
        setIsAnyDateHeaderVisible(anyVisible);
      },
      {
        root: null, // Defaults to the viewport
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    // Observe all dateHeader elements
    dateHeaderRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      // Cleanup observer
      observer.disconnect();
    };
  }, [allMessage, recipient]);
  useEffect(() => {
    setLoading(true);
    async function getData() {
      const apiData = await generalGetFunction(`/message/contacts`);
      const tagData = await generalGetFunction("/tags/all");

      if (apiData?.status && apiData.data.length > 0) {
        setContact(apiData.data);
        if (!extensionFromCdrMessage) {
          setRecipient([apiData.data[0].extension, apiData.data[0].id]);
        }
        setLoading(false);
      }
      if (tagData?.status) {
        setAllTags(tagData.data);
        setLoading(false);
      }
      setLoading(false);
    }
    getData();
  }, [contactRefresh]);

  useEffect(() => {
    if (sipProvider && sipProvider.connectStatus === CONNECT_STATUS.CONNECTED) {
      console.log("SIP provider connected", sipProvider.connectStatus);

      setIsSIPReady(true);
    } else {
      setIsSIPReady(false);
    }
  }, [sipProvider?.connectStatus]);

  // Formate date to get today date same as backend send
  const formatDateTime = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // Formate date for time stamp to get time when message arrives
  function formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();

    const diffMs = now - date;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays >= 1) {
      if (diffDays === 1) return "Yesterday";
      return date.toLocaleDateString(); // Formats as the date for older days
    } else if (diffHours >= 1) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else if (diffMinutes >= 1) {
      return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    } else {
      return `${diffSeconds} second${diffSeconds > 1 ? "s" : ""} ago`;
    }
  }

  // Getting messages based on pagination
  useEffect(() => {
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
              body: item?.message_text,
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

  // Logic to send message
  const sendMessage = () => {
    if (messageInput.trim() === "") return;
    if (isSIPReady) {
      const targetURI = `sip:${recipient[0]}@${account.domain.domain_name}`;
      const userAgent = sipProvider?.sessionManager?.userAgent;

      const target = UserAgent.makeURI(targetURI);

      if (target) {
        try {
          const messager = new Messager(userAgent, target, messageInput);
          messager.message();
          const time = formatDateTime(new Date());
          setIsFreeSwitchMessage(true);
          setAllMessage((prevState) => ({
            ...prevState,
            [recipient[0]]: [
              ...(prevState[recipient[0]] || []),
              { from: extension, body: messageInput, time },
            ],
          }));
          // Update contact last message
          const contactIndex = contact.findIndex(
            (contact) => contact.extension === recipient[0]
          );
          if (contactIndex !== -1) {
            const newContact = [...contact];
            newContact[contactIndex].last_message_data.message_text =
              messageInput;
            newContact[contactIndex].last_message_data.created_at = time;
            setContact(newContact);
          }
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
              last_message_data: {
                message_text: messageInput,
                created_at: time,
              },
            });
          }
          setMessageInput("");

          console.log("Message sent to:", targetURI);
        } catch (error) {
          setMessageInput("");
          console.error("Error sending message:", error);
        }
      } else {
        setMessageInput("");
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

  // Logic to recieve messages from differnt users
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
        const time = formatDateTime(new Date());

        const contactIndex = contact.findIndex(
          (contact) => contact.extension === recipient[0]
        );
        if (contactIndex !== -1) {
          const newContact = [...contact];
          newContact[contactIndex].last_message_data.message_text = body;
          newContact[contactIndex].last_message_data.created_at = time;
          setContact(newContact);
        }
        if (!extensionExists) {
          contact.unshift({
            name: agentDetails.username,
            email: agentDetails.email,
            id: agentDetails.id,
            extension_id: agentDetails.extension_id,
            extension: from,
            last_message_data: { message_text: body, created_at: time },
          });
        } else {
          // Move the extension object to the beginning of the array
          const index = contact.findIndex(
            (contact) => contact.extension === from
          );
          const extensionObject = contact.splice(index, 1)[0];
          contact.unshift(extensionObject);
          const newContact = [...contact];
          newContact[index].last_message_data.message_text = body;
          newContact[index].last_message_data.created_at = time;
          setContact(newContact);
        }
        // Check Content-Type for the incoming message
        const contentType =
          message?.incomingMessageRequest?.message?.getHeader("Content-Type");

        // Get the current time when the message is received
        // Or use .toISOString() for UTC format

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

          // Update contact last message
          const contactIndex = contact.findIndex(
            (contact) => contact.extension === recipient[0]
          );
          if (contactIndex !== -1) {
            const newContact = [...contact];
            newContact[contactIndex].last_message_data.message_text =
              messageInput;
            newContact[contactIndex].last_message_data.created_at = time;
            setContact(newContact);
          }
        }
      },
    };
  }

  // Auto scroll
  useEffect(() => {
    if (isFreeSwitchMessage) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [allMessage]);
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

  // Handle calling
  async function onSubmit(mode, destNumber) {
    if (!isMicOn) {
      toast.warn("Please turn on microphone");
      return;
    }
    if (mode === "video") {
      if (!isVideoOn) {
        toast.warn("Please turn on camera");
        return;
      }
    }

    if (extension == "") {
      toast.error("No extension assigned to your account");
      return;
    }
    if (destNumber == extension) {
      toast.error("You cannot call yourself");
      return;
    }

    if (connectStatus !== "CONNECTED") {
      toast.error("You are not connected with server");
      return;
    }

    if (destNumber.length > 3) {
      dispatch({
        type: "SET_MINIMIZE",
        minimize: false,
      });
      // e.preventDefault();
      const apiData = await sessionManager?.call(
        `sip:${destNumber}@${account.domain.domain_name}`,
        {
          sessionDescriptionHandlerOptions: {
            constraints: {
              audio: true,
              video: mode === "video" ? true : false,
            },
          },
        },
        {
          media: {
            audio: true,
            video:
              mode === "audio"
                ? true
                : {
                  mandatory: {
                    minWidth: 1280,
                    minHeight: 720,
                    minFrameRate: 30,
                  },
                  optional: [{ facingMode: "user" }],
                },
          },
        }
      );
      console.log("apiData", apiData);

      setSelectedModule("onGoingCall");
      dispatch({
        type: "SET_SESSIONS",
        sessions: [
          ...globalSession,
          {
            id: apiData._id,
            destination: destNumber,
            state: "Established",
            mode: mode,
          },
        ],
      });
      dispatch({
        type: "SET_VIDEOCALL",
        videoCall: mode === "video" ? true : false,
      });
      dispatch({
        type: "SET_CALLPROGRESSID",
        callProgressId: apiData._id,
      });
      dispatch({
        type: "SET_CALLPROGRESSDESTINATION",
        callProgressDestination: destNumber,
      });
      dispatch({
        type: "SET_CALLPROGRESS",
        callProgress: mode === "video" ? false : true,
      });
    } else {
      toast.error("Please enter a valid number");
    }
  }

  // Add new Tag
  async function handleNewTag() {
    if (newTag.length === 0) {
      toast.error("Please enter a valid tag name");
    } else {
      setLoading(true);
      const parsedData = {
        name: newTag,
      };
      const apiData = await generalPostFunction(`/tags/store`, parsedData);
      if (apiData.status) {
        setLoading(false);
        toast.success("Tag added successfully");
        setAddNewTag(false);
        setNewTag("");
        setAllTags([...allTags, apiData.data]);
      } else {
        setLoading(false);
      }
    }
  }

  // Update tag
  async function handleUpdateTag() {
    if (upDateTag.length === 0) {
      toast.error("Please enter a valid tag name");
    } else {
      setLoading(true);
      const parsedData = {
        name: upDateTag,
      };
      const apiData = await generalPutFunction(
        `/tags/update/${selectedTag}`,
        parsedData
      );
      if (apiData.status) {
        setLoading(false);
        toast.success("Tag updated successfully");
        setUpDateTag("");
        setSelectedTag("");
        // Upadte the value of tag in existing data
        const updatedTags = allTags.map((tag) => {
          if (tag.id === selectedTag) {
            return { ...tag, name: upDateTag };
          }
          return tag;
        });
        setAllTags(updatedTags);
      } else {
        setLoading(false);
      }
    }
  }
  console.log("testingData", unreadMessage, recipient);
  // Delete tag
  async function handleDeleteTag(id) {
    setLoading(true);
    const apiData = await generalDeleteFunction(`/tags/destroy/${id}`);
    if (apiData.status) {
      setLoading(false);
      toast.success("Tag deleted successfully");
      setSelectedTag("");
      const updatedTags = allTags.filter((tag) => tag.id !== id);
      setAllTags(updatedTags);
    } else {
      setLoading(false);
    }
  }

  // Handle assign task
  async function handleAssignTask(tagId, userId) {
    setLoading(true);
    const parsedData = {
      tag_id: tagId,
      user_id: contact.find((contact) => contact.extension === userId).id,
    };
    const apiData = await generalPostFunction(`/tag-users/store`, parsedData);
    if (apiData.status) {
      setContactRefresh(contactRefresh + 1);
      setLoading(false);
      toast.success("Tag assigned successfully");
    } else {
      setLoading(false);
    }
  }

  // Handle unassign task
  async function handleUnassignTask(tagId) {
    setLoading(true);
    const apiData = await generalDeleteFunction(`/tag-users/destroy/${tagId}`);
    if (apiData.status) {
      setContactRefresh(contactRefresh + 1);
      setLoading(false);
      toast.success("Tag unassigned successfully");
    } else {
      setLoading(false);
    }
  }

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
        <section>
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 ps-xl-0">
                <div className="newHeader">
                  <div className="col-auto" style={{ padding: "0 10px" }}>
                    <h3 style={{ fontFamily: "Outfit", marginBottom: "0" }}>
                      <button class="clearButton2 text-dark" onClick={() => featureUnderdevelopment()}>
                        <i class="fa-solid fa-chevron-left fs-4"></i>
                      </button>{" "}
                      Messages{" "}
                      <button
                        class="clearButton2"
                        onClick={() => setContactRefresh(contactRefresh + 1)}
                        disabled={loading}
                      >
                        <i
                          class={
                            loading
                              ? "fa-regular fa-arrows-rotate fs-5 fa-spin"
                              : "fa-regular fa-arrows-rotate fs-5"
                          }
                          style={{ color: "var(--webUtilGray)" }}
                        ></i>
                      </button>
                    </h3>
                  </div>
                  <div className="d-flex justify-content-end align-items-center">
                    <div className="col-9">
                      <input
                        type="search"
                        name="Search"
                        placeholder="Search users, groups or chat"
                        class="formItem fw-normal"
                        style={{ backgroundColor: "var(--searchBg)" }}
                        onClick={() => featureUnderdevelopment()}
                      />
                    </div>
                    <div className="col-auto mx-2">
                      <button className="clearButton2 xl" effect="ripple" onClick={() => featureUnderdevelopment()}>
                        <i className="fa-regular fa-bell" />
                      </button>
                    </div>
                    <div className="col-auto">
                      <div class="dropdown">
                        <div
                          className="myProfileWidget"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <div class="profileHolder" id="profileOnlineNav">
                            <img
                              src="https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg"
                              alt="profile"
                            />
                          </div>
                          <div class="profileName">
                            {account.username}{" "}
                            <span className="status">Available</span>
                          </div>
                        </div>
                        <ul class="dropdown-menu">
                          <li onClick={logOut}>
                            <div
                              class="dropdown-item"
                              style={{ cursor: "pointer" }}
                            >
                              Logout
                            </div>
                          </li>
                          <li onClick={() => navigate("/my-profile")}>
                            <div
                              class="dropdown-item"
                              style={{ cursor: "pointer" }}
                            >
                              Profile
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="col-12 col-xl-4 col-lg-4 col-xxl-3 d-flex flex-wrap justify-content-between py-3 px-xl-0"
                style={{
                  height: "100%",
                  borderRight: "1px solid var(--border-color)",
                }}
              >
                <div className="col-auto" style={{ padding: "0 10px" }}>
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
                <div className="col-auto" style={{ padding: "0 10px" }}>
                  <button
                    className="clearColorButton dark"
                    onClick={() => featureUnderdevelopment()}
                  >
                    <i class="fa-light fa-pen-to-square"></i> New Chat
                  </button>
                </div>
                <div className="col-12 mt-3" style={{ padding: "0 10px" }}>
                  <AgentSearch
                    getDropdownValue={setRecipient}
                    getAllAgents={setAgents}
                    extensionFromCdrMessage={extensionFromCdrMessage}
                    setExtensionFromCdrMessage={setExtensionFromCdrMessage}
                  />
                </div>
                <div className="col-12">
                  <nav className="mt-3">
                    <div className="nav nav-tabs">
                      <button
                        className={
                          activeTab === "all" ? "tabLink active" : "tabLink"
                        }
                        data-category="all"
                        onClick={() => setActiveTab("all")}
                      >
                        All
                        {Object.values(unreadMessage).reduce(
                          (acc, count) => acc + count,
                          0
                        ) !== 0 ? (
                          <span className="unread">
                            {Object.values(unreadMessage).reduce(
                              (acc, count) => acc + count,
                              0
                            )}
                          </span>
                        ) : (
                          ""
                        )}
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
                      <button
                        onClick={() => setActiveTab("tags")}
                        className={
                          activeTab === "tags" ? "tabLink active" : "tabLink"
                        }
                        effect="ripple"
                        data-category="incoming"
                      >
                        Tags
                      </button>
                    </div>
                  </nav>
                  {activeTab === "all" ? (
                    <div className="tab-content">
                      {/* <AgentSearch
                        getDropdownValue={setRecipient}
                        getAllAgents={setAgents}
                      /> */}
                      <div
                        className="callList"
                        style={{ height: "calc(100vh - 270px)" }}
                      >
                        {/* <div className="chatHeading">
                          <h5 data-bs-toggle="collapse" href="#collapse1" role="button" aria-expanded="false" aria-controls="collapse1">Pinned <i class="fa-solid fa-chevron-down"></i></h5>
                        </div>
                        <div class="collapse show" id="collapse1">
                          <div className="contactListItem" data-bell={"1"}>
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
                                  <h5>Hi! I need some help with the stuff you were talking about</h5>
                                  <div className="contactTags">
                                    <span data-id="1">Work</span>
                                    <span data-id="2">Important</span>
                                    <span className="more">+2</span>
                                  </div>
                                </div>
                                <div className="col text-end">
                                  <p className="timeAgo">1h ago</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div> */}

                        <div className="chatHeading">
                          <h5
                            data-bs-toggle="collapse"
                            href="#collapse2"
                            role="button"
                            aria-expanded="false"
                            aria-controls="collapse2"
                          >
                            Chats <i class="fa-solid fa-chevron-down"></i>
                          </h5>
                        </div>
                        <div
                          class="collapse show"
                          id="collapse2"
                          style={{
                            borderBottom: "1px solid var(--border-color)",
                          }}
                        >
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
                                      <h5>
                                        {item?.last_message_data?.message_text}
                                      </h5>
                                      <div className="contactTags">
                                        {item.tags
                                          ?.slice(0, 2)
                                          ?.map((tag, key) => {
                                            return (
                                              <span data-id={key}>
                                                {tag.tag?.[0]?.name}
                                              </span>
                                            );
                                          })}

                                        <span className="more">
                                          {item.tags?.length > 2 &&
                                            `+${item.tags?.length - 2}`}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="col text-end">
                                      <p className="timeAgo">
                                        {item?.last_message_data
                                          ? formatRelativeTime(
                                            item?.last_message_data
                                              ?.created_at
                                          )
                                          : ""}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* <div className="chatHeading">
                          <h5 data-bs-toggle="collapse" href="#collapse3" role="button" aria-expanded="false" aria-controls="collapse3">Group Chat <i class="fa-solid fa-chevron-down"></i></h5>
                        </div>
                        <div class="collapse show" id="collapse3" style={{ borderBottom: '1px solid #ddd' }}>
                          <div className="contactListItem" data-bell={""}>
                            <div className="row justify-content-between">
                              <div className="col-xl-12 d-flex">
                                <div
                                  className="profileHolder"
                                  id={"profileOfflineNav"}
                                >
                                  <i className="fa-light fa-users fs-5"></i>
                                </div>
                                <div className="my-auto ms-2 ms-xl-3">
                                  <h4>Group Chat</h4>
                                  <h5>Alright</h5>
                                  <div className="contactTags">
                                    <span data-id="3">Priority</span>
                                  </div>
                                </div>
                                <div className="col text-end">
                                  <p className="timeAgo">5min ago</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div> */}
                      </div>
                    </div>
                  ) : activeTab === "online" ? (
                    <div className="tab-content">
                      {/* <AgentSearch
                        getDropdownValue={setRecipient}
                        getAllAgents={setAgents}
                      /> */}
                      <div
                        className="callList"
                        style={{ height: "calc(100vh - 270px)" }}
                      >
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
                          <div className="chatHeading" data-bell={""}>
                            <h5>No Online user found</h5>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="tab-content">
                      {/* <AgentSearch
                        getDropdownValue={setRecipient}
                        getAllAgents={setAgents}
                      /> */}
                      <div
                        className="callList"
                        style={{ height: "calc(100vh - 270px)" }}
                      >
                        <div className="chatHeading" data-bell={""}>
                          <h5>
                            Tag List{" "}
                            <Tippy content="Click to add a new tag!">
                              <i
                                onClick={() => setAddNewTag(true)}
                                class="fa-regular fa-circle-plus fs-5"
                                style={{ cursor: "pointer", fontSize: 18 }}
                              ></i>
                            </Tippy>
                          </h5>
                        </div>
                        {allTags.map((item, key) => {
                          return (
                            <div className="contactTagsAddEdit">
                              <div className="row align-items-center item">
                                <div className="col-6">
                                  <h5>
                                    <input
                                      value={
                                        selectedTag === item.id
                                          ? upDateTag
                                          : item.name
                                      }
                                      onChange={(e) =>
                                        setUpDateTag(e.target.value)
                                      }
                                      placeholder="Please enter tag name"
                                      type="text"
                                      disabled={selectedTag !== item.id}
                                    />
                                  </h5>
                                </div>
                                <div className="col-3">
                                  <div className="contactTags">
                                    <span data-id={key}>
                                      {selectedTag === item.id
                                        ? upDateTag
                                        : item.name}
                                    </span>
                                  </div>
                                </div>
                                <div className="col-auto d-flex ms-auto pe-0">
                                  {selectedTag === item.id ? (
                                    <button
                                      className="clearButton2 xl"
                                      onClick={handleUpdateTag}
                                    >
                                      <Tippy content="Click to save your tag!">
                                        <i class="fa-regular fa-circle-check"></i>
                                      </Tippy>
                                    </button>
                                  ) : (
                                    <button
                                      className="clearButton2 xl"
                                      onClick={() => {
                                        setSelectedTag(item.id);
                                        setUpDateTag(item.name);
                                      }}
                                    >
                                      <Tippy content="You can edit the tag here!">
                                        <i class="fa-regular fa-pen-to-square"></i>
                                      </Tippy>
                                    </button>
                                  )}
                                  <Tippy content="Click to delete your tag!">
                                    <button
                                      className="clearButton2 xl"
                                      onClick={() => handleDeleteTag(item.id)}
                                    >
                                      <i class="fa-regular fa-trash text-danger"></i>
                                    </button>
                                  </Tippy>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {addNewTag && (
                          <div className="contactTagsAddEdit">
                            <div className="row align-items-center item">
                              <div className="col-auto">
                                <h5>
                                  <input
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    placeholder="Please enter tag name"
                                    type="text"
                                  />
                                </h5>
                              </div>
                              {newTag.length > 0 ? (
                                <div className="col-auto">
                                  <div className="contactTags">
                                    <span data-id="4">{newTag}</span>
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}
                              <div className="col-auto d-flex ms-auto pe-0">
                                <button
                                  className="clearButton2 xl"
                                  onClick={handleNewTag}
                                >
                                  <i class="fa-regular fa-circle-check"></i>
                                </button>
                                <button
                                  className="clearButton2  xl"
                                  onClick={() => setAddNewTag(false)}
                                >
                                  <i class="fa-regular fa-trash text-danger"></i>
                                </button>
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
                className="col-12 col-xl-8 col-lg-8 col-xxl-9 callDetails eFaxCompose"
                style={{ height: "100%" }}
                id="callDetails"
              >
                <div className="messageOverlay">
                  {recipient[0] ? (
                    <div className="contactHeader">
                      <div>
                        <h4>{recipient[0]}</h4>
                        <div className="contactTags">
                          {contact
                            .find(
                              (contact) => contact.extension == recipient[0]
                            )
                            ?.tags?.map((item, key) => {
                              return (
                                <span
                                  data-id={key}
                                  onClick={() => handleUnassignTask(item?.id)}
                                  className="removableTag"
                                >
                                  {item.tag?.[0]?.name}
                                </span>
                              );
                            })}
                          {/* <span data-id="1">Work</span> */}

                          <div class="dropdown">
                            <span
                              className="add"
                              type="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <i class="fa-solid fa-circle-plus me-1"></i> Add
                              tag
                            </span>
                            <ul class="dropdown-menu">
                              {allTags.map((item) => {
                                return (
                                  <li
                                    className="dropdown-item"
                                    onClick={() =>
                                      handleAssignTask(item.id, recipient[0])
                                    }
                                  >
                                    {item.name}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                        {/* <span className="status online">Online</span> */}
                      </div>
                      <div className="d-flex my-auto">
                        {/* <div className="d-flex align-items-center me-2">
                          <label className="gray14 me-2">Assigned to:</label>
                          <select className="ovalSelect">
                            <option>
                              {agents.map((item) => {
                                if (item.extension.extension === recipient[0]) {
                                  return item.username;
                                }
                              })}
                            </option>
                          </select>
                        </div> */}
                        <button
                          onClick={() => onSubmit("audio", recipient[0])}
                          className="clearButton2 xl"
                          effect="ripple"
                        >
                          <i className="fa-regular fa-phone" />
                        </button>
                        {isVideoOn ? (
                          <button
                            onClick={() => onSubmit("video", recipient[0])}
                            className="clearButton2 xl"
                            effect="ripple"
                          >
                            <i className="fa-regular fa-video" />
                          </button>
                        ) : (
                          ""
                        )}
                        <div class="dropdown">
                          <button
                            class="clearButton2 xl"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <i class="fa-solid fa-ellipsis-vertical"></i>
                          </button>
                          <ul class="dropdown-menu">
                            <li>
                              <a class="dropdown-item" href="#" onClick={() => featureUnderdevelopment()}>
                                Mark as unread
                              </a>
                            </li>
                            <li>
                              <a class="dropdown-item" href="#" onClick={() => featureUnderdevelopment()}>
                                Archive this chat
                              </a>
                            </li>
                            <li>
                              <a class="dropdown-item" href="#" onClick={() => featureUnderdevelopment()}>
                                Close this chat
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="messageContent">
                    <div className="messageList" ref={messageListRef}>
                      {allMessage?.[recipient[0]]?.map((item, index, arr) => {
                        const messageDate = item.time?.split(" ")[0]; // Extract date from the time string
                        const todayDate = new Date()
                          .toISOString()
                          ?.split("T")[0]; // Get today's date in "YYYY-MM-DD" format
                        const isNewDate =
                          index === 0 ||
                          messageDate !== arr[index - 1].time?.split(" ")[0];

                        return (
                          <React.Fragment key={index}>
                            {isNewDate && (
                              <div
                                className="dateHeader"
                                ref={(el) =>
                                  (dateHeaderRefs.current[index] = el)
                                }
                              >
                                <p>
                                  {messageDate === todayDate
                                    ? "Today"
                                    : messageDate}
                                </p>
                              </div>
                            )}
                            {!isAnyDateHeaderVisible && isNewDate && (
                              <div className="dateHeader sticky">
                                <p>
                                  {messageDate === todayDate
                                    ? "Today"
                                    : messageDate}
                                </p>
                              </div>
                            )}
                            {/* Message content */}
                            {item.from === extension ? (
                              <div className="messageItem sender">
                                <div className="second">
                                  <h6>
                                    {item.from},
                                    <span>
                                      {item.time
                                        ?.split(" ")[1]
                                        ?.split(":")
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
                                        ?.split(" ")[1]
                                        ?.split(":")
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
                          </React.Fragment>
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
                            <div
                              class="nav nav-tabs"
                              id="nav-tab"
                              role="tablist"
                            >
                              <button
                                class="tabLink active"
                                id="nav-im-tab"
                                data-bs-toggle="tab"
                                data-bs-target="#nav-im"
                                type="button"
                                role="tab"
                                aria-controls="nav-im"
                                aria-selected="true"
                              >
                                IM
                              </button>
                              <button
                                class="tabLink"
                                id="nav-sms-tab"
                                // data-bs-toggle="tab"
                                // data-bs-target="#nav-whatsapp"
                                type="button"
                                role="tab"
                                aria-controls="nav-whatsapp"
                                aria-selected="false"
                                onClick={() => featureUnderdevelopment()}
                              >
                                SMS
                              </button>
                              <button
                                class="tabLink"
                                id="nav-whatsapp-tab"
                                // data-bs-toggle="tab"
                                // data-bs-target="#nav-whatsapp"
                                type="button"
                                role="tab"
                                aria-controls="nav-whatsapp"
                                aria-selected="false"
                                onClick={() => featureUnderdevelopment()}
                              >
                                WhatsApp
                              </button>
                              <button
                                class="tabLink"
                                id="nav-messenger-tab"
                                // data-bs-toggle="tab"
                                // data-bs-target="#nav-messenger"
                                type="button"
                                role="tab"
                                aria-controls="nav-messenger"
                                aria-selected="false"
                                onClick={() => featureUnderdevelopment()}
                              >
                                Messenger
                              </button>
                            </div>
                          </nav>
                        </div>
                        <div class="tab-content col-12" id="nav-tabContent">
                          <div
                            class="tab-pane fade show active"
                            id="nav-im"
                            role="tabpanel"
                            aria-labelledby="nav-im-tab"
                          >
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
                          <div
                            class="tab-pane fade"
                            id="nav-whatsapp"
                            role="tabpanel"
                            aria-labelledby="nav-whatsapp-tab"
                          >
                            ...
                          </div>
                          <div
                            class="tab-pane fade"
                            id="nav-messenger"
                            role="tabpanel"
                            aria-labelledby="nav-messenger-tab"
                          >
                            ...
                          </div>
                        </div>

                        <div className="col-12 d-flex justify-content-between align-items-center">
                          <div className="d-flex">
                            <button className="clearButton2" onClick={() => featureUnderdevelopment()}>
                              <i className="fa-light fa-eraser" />
                            </button>
                            <button className="clearButton2" onClick={() => featureUnderdevelopment()}>
                              <i class="fa-regular fa-image"></i>
                            </button>
                            <button className="clearButton2" onClick={() => featureUnderdevelopment()}>
                              <i class="fa-solid fa-paperclip"></i>
                            </button>
                            <button className="clearButton2" onClick={() => featureUnderdevelopment()}>
                              <i class="fa-regular fa-face-smile"></i>
                            </button>
                          </div>
                          <div>
                            <button
                              effect="ripple"
                              className="clearColorButton dark"
                              onClick={() => sendMessage()}
                            >
                              Send Now{" "}
                              <i className="fa-solid fa-paper-plane-top" />
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
      {
        loading ? (
          <div colSpan={99} >
            <CircularLoader />
          </div>
        ) : (
          ""
        )
      }
    </>
  );
}

export default Messages;
