/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import EmojiPicker from "emoji-picker-react";
import { CONNECT_STATUS, useSIPProvider } from "modify-react-sipjs";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { api_url } from "../../../urls";
import {
  awsGeneralPostFunction,
  formatDateTime,
  formatRelativeTime,
  logout
} from "../../GlobalFunction/globalFunction";
import CircularLoader from "../../Loader/CircularLoader";
import { ActionType } from "../../Redux/reduxActionType";
import DisplayFile from "./DisplayFile";
import FileUpload from "./FileUpload";
import HeaderApp from "./HeaderApp";
import LogOutPopUp from "./LogOutPopUp";
import MessageBody from "./messageBox/MessageBody";
import MessageContactList from "./messageBox/MessageContactList";
import {
  checkMessageType,
  extractFileExtension,
  getAllInternalCallsHistory,
  getAllMessageApiFun,
  getAllUser,
  getContactAndAllTagData,
  getGroups,
  handleCheckboxChange,
  handleCreateGroup,
  handleCreateNewTag,
  handleNewTag,
  handleremoveUserFromGroup,
  handleSearchChange,
  handleSelectAll,
  handleUpdateTag,
  manageAdmin,
  receiveGroupMessage
} from "./messageBox/MessageFunctions";

function Messages({
  setSelectedModule,
  isMicOn,
  isVideoOn,
  setactivePage,
  activePage = { activePage },
  extensionFromCdrMessage,
  setExtensionFromCdrMessage,
  calling,
  setCalling,
  setToUser,
  setMeetingPage,
  setIsConferenceCall,
  setConferenceInfo,
  setConferenceToggle,
  conferenceToggle,
  setInternalCaller,
  isGroupCallMessageOpened,
  isSingleCallMessageOpened,
  selectedChat,
  setSelectedChat,
  callStatus,
  setCallStatus,
  // recipient,
  // setRecipient,
  // selectedChat,
  // setSelectedChat,
  // formatRelativeTime,
  // formatRelativeTime, accountDetails, onlineUser
}) {
  const dispatch = useDispatch();
  const socketSendMessage = useSelector((state) => state.socketSendMessage);
  const socketSendPeerCallMessage = useSelector((state) => state.socketSendPeerCallMessage);
  const socketSendPeerGroupCallMessage = useSelector((state) => state.socketSendPeerGroupCallMessage);
  const { sessionManager, connectStatus } = useSIPProvider();
  const incomingMessage = useSelector((state) => state.incomingMessage);
  const loginUser = useSelector((state) => state.loginUser);
  const globalSession = useSelector((state) => state.sessions);
  const allNotificationState = useSelector((data) => data?.allNotificationState);
  const messageListRef = useRef(null);
  const sipProvider = useSIPProvider();
  const groupMessage = useSelector((state) => state.groupMessage);
  const sessions = useSelector((state) => state.sessions);
  // const [recipient, setRecipient] = useState([]);
  const account = useSelector((state) => state.account);
  const typingDetails = useSelector((state) => state.typingDetails)
  const [allMessage, setAllMessage] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [isSIPReady, setIsSIPReady] = useState(false); // Track if SIP provider is ready
  const extension = account?.extension?.extension || "";
  const [contact, setContact] = useState([]);
  const [originalContact, setOriginalContact] = useState([]);
  const [recipient, setRecipient] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [loadMore, setLoadMore] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [onlineUser, setOnlineUser] = useState([]);
  const [originalOnlineUser, setOriginalOnlineUser] = useState([]);
  const [unreadMessage, setUnreadMessage] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [addNewTag, setAddNewTag] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [upDateTag, setUpDateTag] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [doomScrollLoading, setDoomScrollLoading] = useState(false);
  const [messageRefresh, setMessageRefresh] = useState(false);
  const [newGroupLoader, setNewGroupLoader] = useState(false);
  const [contactRefresh, setContactRefresh] = useState(1);
  const [isAnyDateHeaderVisible, setIsAnyDateHeaderVisible] = useState(false);
  const dateHeaderRefs = useRef([]); // Store refs for all dateHeader elements
  const visibilityMap = useRef(new Map()); // Track visibility of each ref
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);
  const [groupChatPopUp, setGroupChatPopUp] = useState(false);
  const [manageGroupChat, setManageGroupChat] = useState(false);
  const [groups, setGroups] = useState([]);
  const [groupsList, setGroupList] = useState([])
  const [originalGroupsList, setOriginalGroupsList] = useState([]);
  const [groupRefresh, setGroupRefresh] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchValueForMessage, setSearchValueForMessage] = useState("");
  const [searchValueForGroup, setSearchValueForGroup] = useState("");
  const [allAgents, setAllAgents] = useState([]);
  const [agent, setAgent] = useState([]);
  const [groupname, setGroupName] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [groupSelecedAgents, setGroupSelecedAgents] = useState([]);
  const [groupNameEdit, setGroupNameEdit] = useState("");
  const [saveEditToggleGroupNameChange, setSaveEditToggleGroupNameChange] =
    useState(false);
  const [addMember, setAddMember] = useState(false);
  const [selectedgroupUsers, setSelectedgroupUsers] = useState([]);
  const [groupLeavePopUp, setGroupLeavePopUp] = useState(false);
  const [groupLeaveId, setGroupLeaveId] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const allCallCenterIds = useSelector((state) => state.allCallCenterIds);
  const [allLogOut, setAllLogOut] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [fileUpload, setFileUpload] = useState(false);
  const [fileType, setFileType] = useState("");
  const [addNewTagPopUp, setAddNewTagPopUp] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const tagDropdownRef = useRef();
  const location = useLocation();
  const pathSegments = location.pathname;
  const [selectFileExtension, setSelectFileExtension] = useState(null);
  const [isActiveAgentsOpen, setIsActiveAgentsOpen] = useState(true);
  const accountDetails = useSelector((state) => state.accountDetails);
  const [filteredTags, setFilteredTags] = useState();
  const [tagFilterInput, setTagFilterInput] = useState("");
  const [internalCallHistory, setInternalCallHistory] = useState([]);
  const [origInalinternalCallHistory, setOriginalInternalCallHistory] =
    useState([]);
  const [rawInternalCallHistory, setRawInternalCallHistory] = useState([]);
  const [autoReply, setAutoReply] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [isTyping, setIsTyping] = useState(false)
  const [internalCallsPageNumber, setInternalCallsPageNumber] = useState(1);
  const scrollPositionRef = useRef({ scrollTop: 0, scrollHeight: 0 });
  const isUserAtBottomRef = useRef(true);
  const isNewMessageByUserRef = useRef(false);
  const prevRecipient = useRef(null);
  const messageRecipient = useSelector((state) => state.messageRecipient)
  const [pageLoader, setPageLoader] = useState(false);
  const [typingDetailState, setTypingDetailState] = useState(null)
  const [typingUserList, setTypingUserList] = useState([])
  const [isUpdatedClicked, setIsUpdatedClicked] = useState(null);
  const [editedValue, setEditedValue] = useState(null);
  // Function to handle logout
  const handleLogOut = async () => {
    setLoading(true);
    try {
      const apiResponses = await logout(
        allCallCenterIds,
        dispatch,
        sessionManager
      );
    } catch (error) {
      console.error("Unexpected error in handleLogOut:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleEmojiClick = (emojiData) => {
    if (isUpdatedClicked == null) {
      setMessageInput((prev) => ({
        ...prev,
        [recipient[0]]: (prev[recipient[0]] || "") + emojiData.emoji,
      }));
    } else {
      setEditedValue((prev) => (prev ?? isUpdatedClicked?.message_text ?? "") + emojiData?.emoji);
    }
  };

  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
  } = useForm();

  useEffect(() => {
    if (selectedUrl) {
      const extension = extractFileExtension(selectedUrl);
      setSelectFileExtension(extension);
    }
  }, [selectedUrl]);

  useEffect(() => {
    if (isUpdatedClicked?.message_type === "image") {
      setFileUpload(true);
      setFileType("image");
    } else if (isUpdatedClicked?.message_type === "file" || isUpdatedClicked?.message_type === "video") {
      setFileUpload(true);
      setFileType("all");
    }
  }, [isUpdatedClicked]);

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

  // Resizeable Layout Functions
  const leftPanel = useRef(null);
  const rightPanel = useRef(null);

  const resetResizeContent = () => {
    if (leftPanel.current && rightPanel.current) {
      leftPanel.current.resize(70);
      rightPanel.current.resize(30);
    }
  };

  // Formate date to get today date same as backend send
  // const formatDateTime = (date) => {
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, "0");
  //   const day = String(date.getDate()).padStart(2, "0");
  //   const hours = String(date.getHours()).padStart(2, "0");
  //   const minutes = String(date.getMinutes()).padStart(2, "0");
  //   const seconds = String(date.getSeconds()).padStart(2, "0");

  //   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  // };

  // Formate date for time stamp to get time when message arrives
  // function formatRelativeTime(dateString) {
  //   const date = new Date(dateString);
  //   const now = new Date();

  //   const diffMs = now - date;
  //   const diffSeconds = Math.floor(diffMs / 1000);
  //   const diffMinutes = Math.floor(diffSeconds / 60);
  //   const diffHours = Math.floor(diffMinutes / 60);
  //   const diffDays = Math.floor(diffHours / 24);

  //   if (diffDays >= 1) {
  //     if (diffDays === 1) return "Yesterday";
  //     return date.toLocaleDateString(); // Formats as the date for older days
  //   } else if (diffHours >= 1) {
  //     return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  //   } else if (diffMinutes >= 1) {
  //     return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  //   } else {
  //     return `${diffSeconds} second${diffSeconds > 1 ? "s" : ""} ago`;
  //   }
  // }

  // Getting messages based on pagination
  useEffect(() => {
    if (recipient?.length > 0 && allAgents?.length > 0) {
      if (Object.keys(chatHistory).includes(String(recipient?.[0])) && messageListRef.current.scrollHeight > 1000) {

        if (chatHistory[recipient?.[0]]?.last_page_number > chatHistory[recipient?.[0]].pageNumber) {
          getAllMessageApiFun(chatHistory[recipient?.[0]].pageNumber + 1, recipient, messageListRef, scrollPositionRef, allAgents, setAllMessage, chatHistory, setChatHistory, setPageLoader);
          setPageLoader(true)
        }
      } else {
        getAllMessageApiFun(1, recipient, messageListRef, scrollPositionRef, allAgents, setAllMessage, chatHistory, setChatHistory, setPageLoader);
      }
    }
  }, [loadMore, allAgents]);

  function sendSingleMessage(selectedUrl) {
    if (!selectedUrl && (!messageInput[recipient[0]]?.trim || messageInput[recipient[0]].trim() === "")) {
      return;
    }
    let messageContent;
    if (selectedUrl) {
      messageContent = selectedUrl;
    } else {
      messageContent = messageInput[recipient[0]].trim();
    }
    isNewMessageByUserRef.current = true;
    const messageType = checkMessageType(messageContent);
    socketSendMessage({
      sharedMessage: messageContent,
      from: account?.id,
      to: recipient?.[1],
      key: "peerchat",
      action: "peerchat",
      type: messageType,
    });

    const time = formatDateTime(new Date());
    const userDetails = allAgents?.find((data) => data?.id == account?.id);
    setAllMessage((prevState) => ({
      ...prevState,
      [recipient?.[2] == "singleChat" ? recipient?.[1] : recipient?.[0]]: [
        ...(prevState[
          recipient?.[2] == "singleChat" ? recipient?.[1] : recipient?.[0]
        ] || []),
        {
          from: userDetails.id,
          body: selectedUrl ? selectedUrl : messageInput[recipient[0]],
          time,
          user_id: userDetails.id,
          user_name: userDetails?.username,
          profile_picture: userDetails?.profile_picture,
          message_type: messageType,
        },
      ],
    }));
    // Update contact last message
    const contactIndex = contact.findIndex(
      (contact) => contact.id === recipient?.[1]
    );
    if (contactIndex !== -1) {
      const newContact = [...contact];
      let lastMessage = "";
      if (selectedFile) {
        lastMessage = selectedFile?.type;
      } else {
        lastMessage = messageInput[recipient[0]];
      }
      newContact[contactIndex].last_message_data.message_text = lastMessage;
      newContact[contactIndex].last_message_data.created_at = time;
      newContact?.splice(contactIndex, 1);
      newContact.unshift(contact[contactIndex]);
      setContact(newContact);
      setOriginalContact(newContact);
    }
    setActiveTab("all");

    const extensionExists = contact.some(
      (contact) => contact.extension === recipient?.[0]
    );
    const agentDetails = allAgents.find((agent) => agent.id === recipient?.[1]);

    if (!extensionExists) {
      contact.unshift({
        name: agentDetails.username,
        email: agentDetails.email,
        id: agentDetails.id,
        extension_id: agentDetails.extension_id,
        extension: recipient?.[0],
        last_message_data: {
          message_text: messageInput[recipient[0]],
          created_at: time,
        },
      });
    }
    setMessageInput("");
    setSelectedFile(null);
    setSelectedUrl(null);
    setSelectFileExtension(null);
  }
  // const sendSingleMessageWithFreeswitch = (selectedUrl) => {
  //   // Only proceed if there's either a URL or message text
  //   // debugger
  //   if (!selectedUrl && messageInput.trim() === "") {
  //     return;
  //   }
  //   if (isSIPReady) {
  //     const targetURI = `sip:${recipient?.[0]}@${account.domain.domain_name}`;
  //     const userAgent = sipProvider?.sessionManager?.userAgent;

  //     const target = UserAgent.makeURI(targetURI);
  //     if (target) {
  //       let messager;
  //       let messageContent;
  //       try {
  //         if (selectedUrl) {
  //           messageContent = selectedUrl
  //         } else {
  //           messageContent = messageInput.trim();
  //         }
  //         //  message if any file is selected
  //         messager = new Messager(userAgent, target, messageContent);

  //         messager.message();
  //         const time = formatDateTime(new Date());
  //         setAllMessage((prevState) => ({
  //           ...prevState,
  //           [recipient?.[0]]: [
  //             ...(prevState[recipient?.[0]] || []),
  //             { from: extension, body: messageInput || selectedUrl, time },
  //           ],
  //         }));
  //         // Update contact last message
  //         const contactIndex = contact.findIndex(
  //           (contact) => contact.extension === recipient?.[0]
  //         );
  //         if (contactIndex !== -1) {
  //           const newContact = [...contact];
  //           newContact[contactIndex].last_message_data.message_text = messageInput;
  //           newContact[contactIndex].last_message_data.created_at = time;
  //           setContact(newContact);
  //         }
  //         setActiveTab("all");

  //         const extensionExists = contact.some(
  //           (contact) => contact.extension === recipient?.[0]
  //         );
  //         const agentDetails = agents.find(
  //           (agent) => agent.extension.extension === recipient?.[0]
  //         );

  //         if (!extensionExists) {
  //           contact.unshift({
  //             name: agentDetails.username,
  //             email: agentDetails.email,
  //             id: agentDetails.id,
  //             extension_id: agentDetails.extension_id,
  //             extension: recipient?.[0],
  //             last_message_data: {
  //               message_text: messageInput,
  //               created_at: time,
  //             },
  //           });
  //         }
  //         setMessageInput("");
  //         setSelectedFile(null);
  //         setSelectedUrl(null);
  //         setSelectFileExtension(null);
  //       } catch (error) {
  //         setMessageInput("");
  //         console.error("Error sending message:", error);
  //       }
  //     } else {
  //       setMessageInput("");
  //       console.error("Invalid recipient address.");
  //     }
  //   } else {
  //     toast.error("UserAgent or session not ready.");
  //   }
  // };

  // Logic to recieve messages from differnt users
  const userAgent = sipProvider?.sessionManager?.userAgent;

  useEffect(() => {
    let isMounted = true; // Track if component is mounted

    async function handleIncomingMessage() {
      if (incomingMessage) {
        const from = incomingMessage?.sender_id;
        const body = incomingMessage?.message_text;

        if (from === recipient?.[1] && autoReply) {
          if (isMounted) setAiProcessing(true);
          if (isMounted)
            setMessageInput((prev) => ({
              ...prev,
              [recipient[0]]: "Generating Ai response...",
            }));
          // axios.post("https://4ofg0goy8h.execute-api.us-east-2.amazonaws.com/dev2/ai-reply", { message: body, user_id: account.id }).then((res) => {

          //   if (res.data) {
          //     setMessageInput((prev) => ({
          //       ...prev,
          //       [recipient[0]]: res.data.reply
          //     }));
          //     setAiProcessing(false);
          //   }
          // }).catch((err) => {

          //   console.log(err);
          //   setMessageInput("");
          // })
          const res = await awsGeneralPostFunction(api_url?.AI_REPLY, {
            message: body,
            user_id: account.id,
          });
          if (res?.status) {
            if (res?.data) {
              setMessageInput((prev) => ({
                ...prev,
                [recipient[0]]: res.data.reply,
              }));
              setAiProcessing(false);
            }
          } else {
            console.log(res?.err);
            setMessageInput("");
          }
        }

        const extensionExists = contact.some((contact) => contact?.id === from);
        const agentDetails = allAgents?.find((agent) => agent?.id === from);

        const time = formatDateTime(new Date());

        const contactIndex = contact.findIndex(
          (contact) => contact.id === agentDetails?.id
        );
        if (contactIndex !== -1) {
          const newContact = [...contact];
          newContact[contactIndex].last_message_data.message_text = body;
          newContact[contactIndex].last_message_data.created_at = time;
          setContact(newContact);
          setOriginalContact(newContact);
        }
        if (!extensionExists) {
          contact.unshift({
            name: agentDetails?.username,
            email: agentDetails?.email,
            id: agentDetails?.id,
            extension_id: agentDetails?.extension_id,
            extension: from,
            last_message_data: { message_text: body, created_at: time },
          });
        } else {
          // Move the extension object to the beginning of the array
          const index = contact.findIndex((contact) => contact?.id === from);
          const extensionObject = contact.splice(index, 1)[0];
          contact.unshift(extensionObject);
          const newContact = [...contact];
          newContact[index].last_message_data.message_text = body;
          newContact[index].last_message_data.created_at = time;
          setContact(newContact);
          setOriginalContact(newContact);
        }
        // Check Content-Type for the incoming message
        const contentType = incomingMessage?.message_type;

        // Get the current time when the message is received
        // Or use .toISOString() for UTC format

        // Check if the content is an image

        const audio = new Audio(
          require("../../assets/music/message-notification.mp3")
        );
        if (contentType == "image") {
          // If it's an image, create a URL for the Base64 image to render it in <img>
          // const imageUrl = `${body}`;

          // Update the state to include the image
          setAllMessage((prevState) => ({
            ...prevState,
            [from]: [
              ...(prevState[from] || []),
              {
                from,
                body,
                time,
                user_id: agentDetails?.id,
                user_name: agentDetails?.username,
                profile_picture: agentDetails?.profile_picture,
                message_type: contentType,
              },
            ],
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
            [from]: [
              ...(prevState[from] || []),
              {
                from,
                body,
                time,
                user_id: agentDetails?.id,
                user_name: agentDetails?.username,
                profile_picture: agentDetails?.profile_picture,
                message_type: contentType,
              },
            ],
          }));

          // Play music when message is received

          if (recipient?.[0] !== from) {
            setUnreadMessage((prevState) => ({
              ...prevState,
              [from]: (prevState[from] || 0) + 1,
            }));
            audio.play();
          }

          // Update contact last message
          const contactIndex = contact.findIndex(
            (contact) => contact.extension === recipient?.[0]
          );
          if (contactIndex !== -1) {
            const newContact = [...contact];
            newContact[contactIndex].last_message_data.message_text = body;
            newContact[contactIndex].last_message_data.created_at = time;
            setContact(newContact);
            setOriginalContact(newContact);
          }
        }

        if (recipient?.length > 0) {
          setUnreadMessage((prevState) => {
            const {
              [recipient?.[2] == "singleChat"
                ? recipient?.[1]
                : recipient?.[0]]: _,
              ...newState
            } = prevState;
            return newState;
          });
          dispatch({
            type: ActionType?.REMOVE_NOTIFICATION_FOR_MESSAGE,
            recipient: [...recipient],
          });
        }
      }
    }
    const isNewMessage = !allNotificationState?.some(data => data?.uuid === incomingMessage?.uuid);

    if (isNewMessage) {
      handleIncomingMessage();
    } else {
      const unreadMap = {};

      allNotificationState?.forEach((data) => {
        if (data?.group_name) {
          unreadMap[data.group_name] = (unreadMap[data.group_name] || 0) + 1;
        } else if (data?.sender_id) {
          unreadMap[data.sender_id] = (unreadMap[data.sender_id] || 0) + 1;
        }
      });

      setUnreadMessage((prev) => ({
        ...prev,
        ...unreadMap,
      }));
    }

    return () => {
      isMounted = false; // Cleanup: mark as unmounted
    };
  }, [incomingMessage]);

  // if (userAgent) {
  //   debugger
  //   // Setup message delegate to handle incoming messages
  //   userAgent.delegate = {
  //     onMessage: (message) => {
  //       const from =
  //         message?.incomingMessageRequest?.message?.from?.uri?.user.toString();
  //       const body = message?.incomingMessageRequest?.message?.body;
  //       const extensionExists = contact.some(
  //         (contact) => contact.extension === from
  //       );
  //       const agentDetails = agents.find(
  //         (agent) => agent.extension.extension === from
  //       );
  //       const time = formatDateTime(new Date());

  //       const contactIndex = contact.findIndex(
  //         (contact) => contact.extension === recipient?.[0]
  //       );
  //       if (contactIndex !== -1) {
  //         const newContact = [...contact];
  //         newContact[contactIndex].last_message_data.message_text = body;
  //         newContact[contactIndex].last_message_data.created_at = time;
  //         setContact(newContact);
  //       }
  //       if (!extensionExists) {
  //         contact.unshift({
  //           name: agentDetails.username,
  //           email: agentDetails.email,
  //           id: agentDetails.id,
  //           extension_id: agentDetails.extension_id,
  //           extension: from,
  //           last_message_data: { message_text: body, created_at: time },
  //         });
  //       } else {
  //         // Move the extension object to the beginning of the array
  //         const index = contact.findIndex(
  //           (contact) => contact.extension === from
  //         );
  //         const extensionObject = contact.splice(index, 1)[0];
  //         contact.unshift(extensionObject);
  //         const newContact = [...contact];
  //         newContact[index].last_message_data.message_text = body;
  //         newContact[index].last_message_data.created_at = time;
  //         setContact(newContact);
  //       }
  //       // Check Content-Type for the incoming message
  //       const contentType =
  //         message?.incomingMessageRequest?.message?.getHeader("Content-Type");

  //       // Get the current time when the message is received
  //       // Or use .toISOString() for UTC format

  //       // Check if the content is an image

  //       const audio = new Audio(
  //         require("../../assets/music/message-notification.mp3")
  //       );
  //       if (contentType && contentType.startsWith("image/")) {
  //         // If it's an image, create a URL for the Base64 image to render it in <img>
  //         // const imageUrl = `${body}`;

  //         // Update the state to include the image
  //         const userDetails = allAgents?.find((data) => data?.extension?.extension == from)
  //         setAllMessage((prevState) => ({
  //           ...prevState,
  //           [userDetails?.id]: [...(prevState[userDetails?.id] || []),
  //           {
  //             from: userDetails?.id,
  //             body,
  //             time,
  //             user_id: userDetails.id,
  //             user_name: userDetails?.username,
  //             profile_picture: userDetails?.profile_picture }],
  //         }));

  //         // Add number of unread messaeg based on extension
  //         setUnreadMessage((prevState) => ({
  //           ...prevState,
  //           [from]: (prevState[from] || 0) + 1,
  //         }));
  //       } else {
  //         // If it's a text message or other type, render as text
  //         const userDetails = allAgents?.find((data) => data?.extension?.extension == from)
  //         setAllMessage((prevState) => ({
  //           ...prevState,
  //           [userDetails.id]: [...(prevState[userDetails.id] || []), {
  //             from: userDetails.id,
  //             body,
  //             time,
  //             user_id: userDetails.id,
  //             user_name: userDetails?.username,
  //             profile_picture: userDetails?.profile_picture }],
  //         }));

  //         // Play music when message is received

  //         if (recipient?.[0] !== from) {
  //           setUnreadMessage((prevState) => ({
  //             ...prevState,
  //             [from]: (prevState[from] || 0) + 1,
  //           }));
  //           audio.play();
  //         }

  //         // Update contact last message
  //         const contactIndex = contact.findIndex(
  //           (contact) => contact.extension === recipient?.[0]
  //         );
  //         if (contactIndex !== -1) {
  //           const newContact = [...contact];
  //           newContact[contactIndex].last_message_data.message_text =
  //             messageInput;
  //           newContact[contactIndex].last_message_data.created_at = time;
  //           setContact(newContact);
  //         }
  //       }
  //     },
  //   };
  // }

  // Auto scroll
  // ================ scroll related stuff start here 
  useEffect(() => {
    const el = messageListRef.current;
    if (!el) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const { scrollTop, scrollHeight } = scrollPositionRef.current || {};
        const newScrollHeight = el.scrollHeight;
        if (isUserAtBottomRef.current || isNewMessageByUserRef.current) {
          el.scrollTop = el.scrollHeight;
        } else if (scrollTop !== undefined && scrollHeight !== undefined) {
          el.scrollTop = newScrollHeight - scrollHeight + scrollTop;
        }
        isNewMessageByUserRef.current = false;
      });
    });
  }, [allMessage]);

  const handleScroll = () => {
    const el = messageListRef.current;
    if (!el) return;

    if (el.scrollTop === 0) {
      setLoadMore(prev => prev + 1);
    }
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
    isUserAtBottomRef.current = isAtBottom;
  };

  useEffect(() => {
    const el = messageListRef.current;
    if (el) el.addEventListener("scroll", handleScroll);

    return () => {
      if (el) el.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (messageListRef.current) {
  //       // Check if scrolled to top
  //       if (messageListRef.current.scrollTop === 0) {
  //         setLoadMore(prev => prev + 1);
  //       }
  //     }
  //   };

  //   const ref = messageListRef.current;
  //   if (ref) {
  //     ref.addEventListener("scroll", handleScroll);
  //   }

  //   // Cleanup listener on unmount or dependency change
  //   return () => {
  //     if (ref) {
  //       ref.removeEventListener("scroll", handleScroll);
  //     }
  //   };
  // }, [messageListRef?.current?.scrollTop === 0]);

  // ================ scroll related stuff end here 



  // =============== useEffect stuff start here 

  useEffect(() => {
    setMessageRefresh(true);
    const shouldLoad = true;
    getContactAndAllTagData(shouldLoad, setLoading, checkMessageType, setContact, setOriginalContact, setMessageRefresh, setAllTags);
    getAllUser(setAllAgents);
  }, []);

  useEffect(() => {
    if (sipProvider && sipProvider.connectStatus === CONNECT_STATUS.CONNECTED) {
      setIsSIPReady(true);
    } else {
      setIsSIPReady(false);
    }
  }, [sipProvider?.connectStatus]);

  useEffect(() => {
    if (typingDetails?.result?.is_typing) {
      setTypingDetailState(typingDetails);
      const allTypingUserList = allAgents?.find((agent) =>
        agent?.id === typingDetails?.result?.user_id
      );
      setTypingUserList((prevList) => {
        const alreadyExists = prevList.some(user => user?.id === allTypingUserList?.id);
        if (!alreadyExists && allTypingUserList) {
          return [...prevList, allTypingUserList];
        }
        return prevList;
      });
      const test = typingDetails?.key === "typing_status" ? typingDetails?.result?.user_id === recipient[1] : typingDetails?.result?.group_id === recipient[1]
      if (test) {
        setIsTyping(true)
      }
    } else {
      setIsTyping(false)
      setTypingDetailState(null)
      setTypingUserList([])
    }
  }, [typingDetails?.result])

  useEffect(() => {
    if (loginUser?.length > 0) {
      const updatedOnlineUsers = loginUser
        .map((item) => {
          const findUser = allAgents?.find((agent) => agent.id === item.id);
          return findUser;
        })
        .filter((user) => user !== undefined);
      if (updatedOnlineUsers?.length !== originalOnlineUser?.length) {
        setOnlineUser(updatedOnlineUsers);
        setOriginalOnlineUser(updatedOnlineUsers);
      }
    } else {
      setOnlineUser([]);
      setOriginalOnlineUser([]);
    }
  }, [loginUser]);

  // Filter out the user from selcted group
  useEffect(() => {
    getGroups(setLoading, setGroups, setGroupList, setOriginalGroupsList, recipient, setRecipient, allAgents, setSelectedChat, setGroupNameEdit, setSelectedgroupUsers, account, setIsAdmin);
  }, [groupRefresh]);

  // ======================= useEffect stuff End here 

  // ============================= Tag Related Stuff ======= start here
  useEffect(() => {
    // const tag = allTags?.filter((tag) =>
    //   contact?.every((contactItem) =>
    //     !(contactItem?.tags?.some((contactTage) => contactTage?.tag_id === tag?.id))
    //   )
    // );
    const userTag = contact?.find((data) => data?.id === recipient[1])?.tags;
    const defaultTag = allTags?.filter((data) => data?.default == 1);

    const tag = defaultTag?.filter((tag) =>
      userTag?.every((contactTag) => contactTag?.tag_id !== tag?.id)
    );
    const filteredTag = tag?.filter((data) =>
      data?.name?.toLowerCase()?.includes(tagFilterInput?.toLowerCase())
    );

    if (tagFilterInput) {
      if (userTag?.length) {
        const tag = allTags?.filter((tag) =>
          userTag?.every((contactTag) => contactTag?.tag_id !== tag?.id)
        );

        const filteredTag = tag?.filter((data) =>
          data?.name?.toLowerCase()?.includes(tagFilterInput?.toLowerCase())
        );
        setFilteredTags(filteredTag);
      } else {
        setFilteredTags(filteredTag);
      }
    } else {
      setFilteredTags(filteredTag);
    }
  }, [allTags, contact, tagFilterInput, recipient]);
  // ============================= Tag Related Stuff ======= end here

  const filteredUsers = allAgents.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user?.extension?.extension || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // Filter out agents already added
  const availableUsers = filteredUsers.filter(
    (user) => !allAgents.some((agent) => user.id == agent.name)
  );

  // Logic to send group messages
  function sendGroupMessage(selectedUrl) {
    let messageContent;
    if (selectedUrl) {
      messageContent = selectedUrl;
    } else {
      messageContent = messageInput[recipient[0]].trim();
    }
    if (messageContent === "") return;
    const messageType = checkMessageType(messageContent);
    socketSendMessage({
      action: "broadcastGroupMessage",
      user_id: account.id,
      sharedMessage: messageContent,
      group_id: recipient?.[1],
      group_name: recipient?.[0],
      user_name: account.name,
      user_extension: account.extension.extension,
      message_type: messageType,
    });

    const time = formatDateTime(new Date());
    const userDetails = allAgents?.find((data) => data?.id == account?.id);
    setAllMessage((prevState) => ({
      ...prevState,
      [recipient?.[2] == "singleChat" ? recipient?.[1] : recipient?.[0]]: [
        ...(prevState[
          recipient?.[2] == "singleChat" ? recipient?.[1] : recipient?.[0]
        ] || []),
        {
          from: recipient?.[2] == "singleChat" ? recipient?.[1] : account?.id,
          body: messageContent,
          time,
          user_id: userDetails.id,
          user_name: userDetails?.username,
          profile_picture: userDetails?.profile_picture,
          message_type: checkMessageType(messageContent),
        },
      ],
    }));

    const contactIndex = groups.findIndex(
      (contact) => contact?.group_name === recipient?.[0]
    );
    if (contactIndex !== -1) {
      const newGroups = [...groups];
      let last_message = "";
      if (selectedUrl) {
        last_message = messageType;
      } else {
        last_message = messageInput[recipient[0]];
      }
      newGroups[contactIndex].last_message_data.message_text = last_message;
      newGroups[contactIndex].last_message_data.created_at = time;
      newGroups[contactIndex].last_message_data.user_id = userDetails.id;
      newGroups?.splice(contactIndex, 1);
      newGroups.unshift(groups[contactIndex]);
      setGroups(newGroups);
      setOriginalGroupsList(newGroups);
    }
    setActiveTab("all");

    // Clear both message input and selected file
    setMessageInput("");
    setSelectedUrl(null);
  }


  // Recieve group message
  useEffect(() => {
    receiveGroupMessage(
      allNotificationState,
      groupMessage,
      setAllMessage,
      groups,
      setGroups,
      setOriginalGroupsList,
      setActiveTab,
      setUnreadMessage,
      recipient,
      ActionType,
      dispatch,
      allAgents
    )
  }, [groupMessage]);



  // Send SMS Function
  // const sendSMSMessage = handleSubmit(async (data) => {
  //   const payload = { ...data };
  //   try {
  //     const apiData = await generalPostFunction("/send-sms", payload);
  //     if (apiData.status) {
  //       toast.success(apiData.message);
  //     } else {
  //       if (apiData.errors.from_did) {
  //         toast.error(apiData.errors.from_did[0]);
  //       } else if (apiData.errors.to_did) {
  //         toast.error(apiData.errors.to_did[0]);
  //       } else {
  //         toast.error(apiData.message);
  //       }
  //     }
  //     reset();
  //     setSendSMSPopup(false);
  //   } catch (err) {
  //     console.error("Error sending SMS:", err);
  //   }
  // })

  useEffect(() => {
    getAllInternalCallsHistory(setLoading, internalCallsPageNumber, setInternalCallHistory, setRawInternalCallHistory, setOriginalInternalCallHistory, setDoomScrollLoading);
  }, [calling, internalCallsPageNumber]);

  const handleRefresh = () => {
    const shouldLoad = false;
    getContactAndAllTagData(shouldLoad, setLoading, checkMessageType, setContact, setOriginalContact, setMessageRefresh, setAllTags);
    setMessageRefresh(true);
  };

  const hanldeTabLinkClick = (tab) => {
    setActiveTab(tab);
    setSearchValueForMessage("");
    setSearchValueForGroup("");
    setGroups(originalGroupsList);
    setContact(originalContact);
    setOnlineUser(originalOnlineUser);
    setInternalCallHistory(origInalinternalCallHistory);
    setManageGroupChat(false)
  };

  // Adding this coz Recipient was changed from being passed as a prop from WebrtcWrapper to here, need this hack to make P2P Call chat work
  useEffect(() => {
    if (recipient && recipient !== prevRecipient.current) {
      dispatch(({
        type: "SET_MESSAGERECIPIENT",
        messageRecipient: recipient,
      }));
      prevRecipient.current = recipient;
    }
  }, [recipient, dispatch]);

  // Sync to support the above
  useEffect(() => {
    if (messageRecipient && messageRecipient !== recipient) {
      setRecipient(messageRecipient);
      prevRecipient.current = messageRecipient; // sync ref too
    }
  }, [messageRecipient]);

  const handleGroupChatPopupClose = () => {
    setGroupChatPopUp(false);
    setGroupName("");
    setSearchQuery("");
    setSelectAll(false);
    setGroupSelecedAgents([])
  }

  return (
    <>
      <style>
        {`#sidenNav{
        display:none;
      }`}
      </style>
      {addNewTagPopUp && (
        <div className="backdropContact">
          <div className="addNewContactPopup">
            <div className="row">
              <div className="col-12 heading">
                <i className="fa-light fa-tag"></i>
                <h5>Please enter a Tag name</h5>
                <div className="border-bottom col-12" />
              </div>
              <div className="col-xl-12">
                <div className="formLabel">
                  <label htmlFor="">Full Name</label>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Please enter tag name"
                    className="formItem"
                  />
                </div>
              </div>

              <div className="col-xl-12 mt-4">
                <div className="d-flex justify-content-between">
                  <button
                    disabled={loading}
                    className="panelButton gray ms-0"
                    onClick={() => setAddNewTagPopUp(false)}
                  >
                    <span className="text">Cancel</span>
                    <span className="icon">
                      <i className="fa-solid fa-caret-left"></i>
                    </span>
                  </button>
                  <button
                    disabled={loading}
                    className="panelButton me-0"
                    onClick={() => {
                      handleNewTag(newTag, setAddNewTag, setNewTag, setAllTags, allTags, setLoading);
                      setAddNewTagPopUp(false);
                    }}
                  >
                    <span className="text">Save</span>
                    <span className="icon">
                      <i className="fa-solid fa-floppy-disk"></i>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {allLogOut && (
        <LogOutPopUp setAllLogOut={setAllLogOut} handleLogOut={handleLogOut} />
      )}
      <main
        className="mainContentApp"
        style={{
          marginRight:
            sessions.length > 0 && Object.keys(sessions).length > 0
              ? "250px"
              : "0",
          marginLeft: pathSegments === "/messages" ? "0px" : "210px",
        }}
      >
        <section>
          <div className="w-100 p-0">
            <HeaderApp
              title={pathSegments === "/messages" ? account?.name : "Messages"}
              loading={messageRefresh}
              setLoading={setMessageRefresh}
              refreshApi={handleRefresh}
            />
          </div>
          <div className="container-fluid ">
            <div className="row webrtc_newMessageUi">
              <MessageContactList
                setRecipient={setRecipient}
                setExtensionFromCdrMessage={setExtensionFromCdrMessage}
                extensionFromCdrMessage={extensionFromCdrMessage}
                allAgents={allAgents}
                activeTab={activeTab}
                hanldeTabLinkClick={hanldeTabLinkClick}
                recipient={recipient}
                unreadMessage={unreadMessage}
                searchValueForMessage={searchValueForMessage}
                setSearchValueForMessage={setSearchValueForMessage}
                originalContact={originalContact}
                setOnlineUser={setOnlineUser}
                setGroups={setGroups}
                setInternalCallHistory={setInternalCallHistory}
                setContact={setContact}
                origInalinternalCallHistory={origInalinternalCallHistory}
                originalOnlineUser={originalOnlineUser}
                originalGroupsList={originalGroupsList}
                contact={contact}
                setSelectedChat={setSelectedChat}
                setUnreadMessage={setUnreadMessage}
                ActionType={ActionType}
                setManageGroupChat={setManageGroupChat}
                setAllMessage={setAllMessage}
                allMessage={allMessage}
                onlineUser={onlineUser}
                accountDetails={accountDetails}
                formatRelativeTime={formatRelativeTime}
                searchValueForGroup={searchValueForGroup}
                setSearchValueForGroup={setSearchValueForGroup}
                groups={groups}
                setGroupNameEdit={setGroupNameEdit}
                account={account}
                setIsAdmin={setIsAdmin}
                setAddNewTag={setAddNewTag}
                setSelectedgroupUsers={setSelectedgroupUsers}
                allTags={allTags}
                selectedTag={selectedTag}
                upDateTag={upDateTag}
                handleUpdateTag={handleUpdateTag}
                setLoading={setLoading}
                setAllTags={setAllTags}
                setSelectedTag={setSelectedTag}
                addNewTag={addNewTag}
                newTag={newTag}
                setNewTag={setNewTag}
                loading={loading}
                doomScrollLoading={doomScrollLoading}
                setDoomScrollLoading={setDoomScrollLoading}
                setMeetingPage={setMeetingPage}
                setToUser={setToUser}
                setCalling={setCalling}
                socketSendPeerCallMessage={socketSendPeerCallMessage}
                internalCallHistory={internalCallHistory}
                setInternalCallsPageNumber={setInternalCallsPageNumber}
                rawInternalCallHistory={rawInternalCallHistory}
                setGroupChatPopUp={setGroupChatPopUp}
                setUpDateTag={setUpDateTag}
                internalCallsPageNumber={internalCallsPageNumber}
                messageListRef={messageListRef}
                scrollPositionRef={scrollPositionRef}
                chatHistory={chatHistory}
                setChatHistory={setChatHistory}
                setPageLoader={setPageLoader}
                setIsTyping={setIsTyping}
                socketSendPeerGroupCallMessage={socketSendPeerGroupCallMessage}
                isGroupCallMessageOpened={isGroupCallMessageOpened}
                isSingleCallMessageOpened={isSingleCallMessageOpened}
                typingDetailState={typingDetailState}
                groupsList={groupsList}
              />
              <MessageBody
                recipient={recipient}
                selectedChat={selectedChat}
                loading={loading}
                contact={contact}
                setLoading={setLoading}
                setContactRefresh={setContactRefresh}
                contactRefresh={contactRefresh}
                setContact={setContact}
                setOriginalContact={setOriginalContact}
                setMessageRefresh={setMessageRefresh}
                setAllTags={setAllTags}
                account={account}
                setCalling={setCalling}
                setToUser={setToUser}
                setMeetingPage={setMeetingPage}
                isVideoOn={isVideoOn}
                allTags={allTags}
                setNewTag={setNewTag}
                setAddNewTag={setAddNewTag}
                tagFilterInput={tagFilterInput}
                handleCreateNewTag={handleCreateNewTag}
                filteredTags={filteredTags}
                setTagFilterInput={setTagFilterInput}
                tagDropdownRef={tagDropdownRef}
                setManageGroupChat={setManageGroupChat}
                setGroupLeaveId={setGroupLeaveId}
                setGroupLeavePopUp={setGroupLeavePopUp}
                groups={groups}
                setGroupRefresh={setGroupRefresh}
                groupRefresh={groupRefresh}
                setSelectedChat={setSelectedChat}
                setRecipient={setRecipient}
                allMessage={allMessage}
                messageListRef={messageListRef}
                formatDateTime={formatDateTime}
                selectedgroupUsers={selectedgroupUsers}
                dateHeaderRefs={dateHeaderRefs}
                isAnyDateHeaderVisible={isAnyDateHeaderVisible}
                setAllMessage={setAllMessage}
                DisplayFile={DisplayFile}
                emojiOpen={emojiOpen}
                EmojiPicker={EmojiPicker}
                handleEmojiClick={handleEmojiClick}
                setEmojiOpen={setEmojiOpen}
                setactivePage={setactivePage}
                activePage={activePage}
                isTyping={isTyping}
                messageInput={messageInput}
                socketSendMessage={socketSendMessage}
                setMessageInput={setMessageInput}
                typingTimeoutRef={typingTimeoutRef}
                isTypingRef={isTypingRef}
                sendGroupMessage={sendGroupMessage}
                sendSingleMessage={sendSingleMessage}
                autoReply={autoReply}
                setAutoReply={setAutoReply}
                setFileUpload={setFileUpload}
                setFileType={setFileType}
                manageGroupChat={manageGroupChat}
                groupNameEdit={groupNameEdit}
                setSaveEditToggleGroupNameChange={setSaveEditToggleGroupNameChange}
                setGroupNameEdit={setGroupNameEdit}
                setNewGroupLoader={setNewGroupLoader}
                setAddMember={setAddMember}
                addMember={addMember}
                allAgents={allAgents}
                setGroupChatPopUp={setGroupChatPopUp}
                isAdmin={isAdmin}
                manageAdmin={manageAdmin}
                setSelectedgroupUsers={setSelectedgroupUsers}
                isActiveAgentsOpen={isActiveAgentsOpen}
                setIsActiveAgentsOpen={setIsActiveAgentsOpen}
                saveEditToggleGroupNameChange={saveEditToggleGroupNameChange}
                socketSendPeerCallMessage={socketSendPeerCallMessage}
                pageLoader={pageLoader}
                socketSendPeerGroupCallMessage={socketSendPeerGroupCallMessage}
                setConferenceInfo={setConferenceInfo}
                setIsConferenceCall={setIsConferenceCall}
                setConferenceToggle={setConferenceToggle}
                conferenceToggle={conferenceToggle}
                setInternalCaller={setInternalCaller}
                typingUserList={typingUserList}
                setIsUpdatedClicked={setIsUpdatedClicked}
                isUpdatedClicked={isUpdatedClicked}
                setEditedValue={setEditedValue}
                editedValue={editedValue}
                setCallStatus={setCallStatus}
              />

            </div>
          </div>
          {groupChatPopUp ? (
            <div className="backdropContact">
              <div className="addNewContactPopup">
                <div className="row">
                  <div className="col-12 heading mb-0">
                    <i className="fa-light fa-users" />
                    <h5>Create a Group Chat</h5>
                    <p>
                      Add people to a group chat effortlessly, keeping your
                      connections organized and efficient
                    </p>
                    <div className="border-bottom col-12" />
                  </div>
                  <div className="col-xl-12 mt-2">
                    <div className="formRow px-0">
                      <div className="formLabel">
                        <label htmlFor="">
                          Group Name <span className="text-danger">*</span>
                        </label>
                      </div>
                      <div className="col-xl-6 col-12">
                        <input
                          value={groupname}
                          onChange={(e) => {
                            setGroupName(e.target.value);
                          }}
                          type="text"
                          className="formItem"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-12 mt-2">
                    <div className="col-12 d-flex justify-content-between align-items-center">
                      <input
                        type="text"
                        className="formItem "
                        placeholder="Search"
                        name="name"
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e, setSearchQuery)}
                      />
                    </div>
                  </div>
                  <div className="col-xl-12 mt-2">
                    <div className="col-xl-12 mt-2">
                      <div
                        className="tableContainer mt-0"
                        style={{
                          maxHeight: "calc(100vh - 670px)",
                        }}
                      >
                        <table>
                          <thead>
                            <tr>
                              <th>S.No</th>
                              <th>Name</th>
                              <th>
                                <input
                                  type="checkbox"
                                  onChange={() => handleSelectAll(selectAll, setSelectAll, availableUsers, groupSelecedAgents, setGroupSelecedAgents)} // Call handler on change
                                  checked={selectAll ? true : false} // Keep checkbox state in sync
                                />
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredUsers?.filter((data) => data?.id != account?.id)?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}.</td>
                                <td>{item.name}</td>
                                <td>
                                  <input
                                    type="checkbox"
                                    onChange={() =>
                                      handleCheckboxChange(item, setGroupSelecedAgents)
                                    } // Call handler on change
                                    checked={groupSelecedAgents.some(
                                      (agent) => agent.name == item.name
                                    )} // Keep checkbox state in sync
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-12 mt-2">
                    <div className="d-flex justify-content-between">
                      <button
                        className="panelButton gray ms-0"
                        onClick={() => {
                          handleGroupChatPopupClose()
                        }}
                      >
                        <span className="text">Close</span>
                        <span className="icon">
                          <i className="fa-solid fa-caret-left" />
                        </span>
                      </button>
                      <button
                        className="panelButton me-0"
                        onClick={() => {
                          handleCreateGroup(
                            groupname,
                            setNewGroupLoader,
                            groupSelecedAgents,
                            account,
                            setGroupRefresh,
                            groupRefresh,
                            setAddMember,
                            setGroupChatPopUp,
                            setGroupSelecedAgents,
                            setLoading,
                            setGroupName,
                          )
                          handleGroupChatPopupClose()
                        }
                        }
                      >
                        <span className="text">Create</span>
                        <span className="icon">
                          <i className="fa-solid fa-check" />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          {groupLeavePopUp ? (
            <div className="popup">
              <div className="container h-100">
                <div className="row h-100 justify-content-center align-items-center">
                  <div className="row content col-xl-4">
                    <div className="col-12">
                      <div className="iconWrapper">
                        <i className="fa-duotone fa-triangle-exclamation"></i>
                      </div>
                    </div>
                    <div className="col-12 ">
                      <h4 className="text-orange text-center">Warning!</h4>
                      <p className="text-center">
                        Are you sure you want to leave from this group?
                      </p>
                      <div className="mt-2 d-flex justify-content-center gap-2">
                        <button
                          disabled={loading}
                          className="panelButton m-0"
                          onClick={() => {
                            handleremoveUserFromGroup(recipient[1], setNewGroupLoader, setSelectedgroupUsers, selectedgroupUsers, account);
                            setGroupLeavePopUp(false);
                            setRecipient([]);
                            setGroupRefresh(groupRefresh + 1);
                          }}
                        >
                          <span className="text">Confirm</span>
                          <span className="icon">
                            <i className="fa-solid fa-check"></i>
                          </span>
                        </button>

                        <button
                          className="panelButton gray m-0 float-end"
                          onClick={() => {
                            setGroupLeavePopUp(false);
                            setGroupLeaveId("");
                          }}
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
          ) : (
            ""
          )}
          {/* {sendSMSPopup &&
            <div className="backdropContact">
              <div className="addNewContactPopup">
                <div className="row">
                  <div className="col-12 heading">
                    <i className="fa-light fa-message" />
                    <h5>Send a SMS</h5>
                    <p>
                      Send a SMS to a DID / PSTN number.
                    </p>
                    <div className="border-bottom col-12" />
                  </div>
                  <div className="col-xl-12">
                    <div className="formLabel">
                      <label htmlFor="">Enter Sender Number</label>
                    </div>
                    <div className="col-12">
                      <input
                        type="text"
                        className="formItem"
                        placeholder="DID / PSTN"
                        name="from_did"
                        {...register("from_did", { ...requiredValidator, ...numberValidator })}
                      />
                      {errors.from_did && (
                        <ErrorMessage text={errors.from_did.message} />
                      )}
                    </div>
                  </div>
                  <div className="col-xl-12 mt-2">
                    <div className="formLabel">
                      <label htmlFor="">Enter Receiver Number</label>
                    </div>
                    <div className="col-12">
                      <input
                        type="text"
                        className="formItem"
                        placeholder="DID / PSTN"
                        name="to_did"
                        {...register("to_did", { ...requiredValidator, ...numberValidator })}
                      />
                      {errors.to_did && (
                        <ErrorMessage text={errors.to_did.message} />
                      )}
                    </div>
                  </div>
                  <div className="col-xl-12 mt-2">
                    <div className="formLabel">
                      <label htmlFor="">Enter your messsage</label>
                    </div>
                    <div className="col-12">
                      <textarea
                        type="text"
                        className="formItem h-auto"
                        placeholder="Please enter your message"
                        name="message"
                        rows={3}
                        {...register("message", {
                          ...requiredValidator,
                        })}
                      />
                      {errors.message && (
                        <ErrorMessage text={errors.message.message} />
                      )}
                    </div>
                  </div>
                  <div className="col-xl-12 mt-4">
                    <div className="d-flex justify-content-between">
                      <button className="panelButton gray ms-0" onClick={() => { reset(); setSendSMSPopup(false) }}>
                        <span className="text">Cancel</span>
                        <span className="icon">
                          <i className="fa-solid fa-caret-left" />
                        </span>
                      </button>
                      <button className="panelButton me-0" onClick={sendSMSMessage}>
                        <span className="text">Send</span>
                        <span className="icon">
                          <i className="fa-solid fa-send" />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          } */}
        </section>

        {newGroupLoader ? (
          <div colSpan={99}>
            <CircularLoader />
          </div>
        ) : (
          ""
        )}
        {fileUpload && (
          <FileUpload
            type={fileType}
            setFileUpload={setFileUpload}
            setSelectedUrl={setSelectedUrl}
            setSelectedFile={setSelectedFile}
            selectedFile={selectedFile}
            sendSingleMessage={sendSingleMessage}
            sendGroupMessage={sendGroupMessage}
            recipient={recipient}
            setAllMessage={setAllMessage}
            allMessage={allMessage}
            extension={extension}
            formatDateTime={formatDateTime}
            setIsUpdatedClicked={setIsUpdatedClicked}
            isUpdatedClicked={isUpdatedClicked}
            setEditedValue={setEditedValue}
          />
        )}
      </main>
    </>
  );
}

export default Messages;
