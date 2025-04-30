/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Messager, UserAgent } from "sip.js";
import { useSIPProvider, CONNECT_STATUS } from "modify-react-sipjs";
import AgentSearch from "./AgentSearch";
import {
  featureUnderdevelopment,
  generalDeleteFunction,
  generalGetFunction,
  generalPostFunction,
  generalPutFunction,
  logout,
} from "../../GlobalFunction/globalFunction";
import { toast } from "react-toastify";
import CircularLoader from "../../Loader/CircularLoader";
import { Link, useNavigate } from "react-router-dom";
import Tippy from "@tippyjs/react";
import DarkModeToggle from "../../CommonComponents/DarkModeToggle";
import { useForm } from "react-hook-form";
import Socket from "../../GlobalFunction/Socket";
import EmojiPicker from "emoji-picker-react";
import LogOutPopUp from "./LogOutPopUp";
import FileUpload from "./FileUpload";
import AudioPlayer from "./AudioWaveForm";
import DisplayFile from "./DisplayFile";
import { numberValidator, requiredValidator } from "../../validations/validation";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import { getPanelElement, getResizeHandleElement, Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import HeaderApp from "./HeaderApp";
import MessageProfileDetails from "./components/MessageProfileDetails";

function Messages({
  setSelectedModule,
  isMicOn,
  isVideoOn,
  setactivePage,
  extensionFromCdrMessage,
  setExtensionFromCdrMessage,
}) {
  const dispatch = useDispatch();
  const { sendMessage } = Socket();
  const navigate = useNavigate();
  const { sessionManager, connectStatus } = useSIPProvider();
  const incomingMessage = useSelector((state) => state.incomingMessage);
  const loginUser = useSelector((state) => state.loginUser);
  const globalSession = useSelector((state) => state.sessions);
  const messageListRef = useRef(null);
  const sipProvider = useSIPProvider();
  const groupMessage = useSelector((state) => state.groupMessage);
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
  const [selectedChat, setSelectedChat] = useState("singleChat");
  const [onlineUser, setOnlineUser] = useState([]);
  const [unreadMessage, setUnreadMessage] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [addNewTag, setAddNewTag] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [upDateTag, setUpDateTag] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [newGroupLoader, setNewGroupLoader] = useState(false);
  const [contactRefresh, setContactRefresh] = useState(1);
  const [isAnyDateHeaderVisible, setIsAnyDateHeaderVisible] = useState(false);
  const dateHeaderRefs = useRef([]); // Store refs for all dateHeader elements
  const visibilityMap = useRef(new Map()); // Track visibility of each ref
  const [groupChatPopUp, setGroupChatPopUp] = useState(false);
  const [manageGroupChat, setManageGroupChat] = useState(false);
  const [groups, setGroups] = useState([]);
  const [groupRefresh, setGroupRefresh] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [allAgents, setAllAgents] = useState([]);
  const [agent, setAgent] = useState([]);
  const [groupname, setGroupName] = useState("")
  const [selectAll, setSelectAll] = useState(false);
  const [groupSelecedAgents, setGroupSelecedAgents] = useState([]);
  const [groupNameEdit, setGroupNameEdit] = useState("");
  const [saveEditToggleGroupNameChange, setSaveEditToggleGroupNameChange] = useState(false);
  const [addMember, setAddMember] = useState(false);
  const [selectedgroupUsers, setSelectedgroupUsers] = useState([]);
  const [groupLeavePopUp, setGroupLeavePopUp] = useState(false)
  const [groupLeaveId, setGroupLeaveId] = useState("")
  const [emojiOpen, setEmojiOpen] = useState(false);
  const allCallCenterIds = useSelector((state) => state.allCallCenterIds);
  const [allLogOut, setAllLogOut] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false)
  const [fileUpload, setFileUpload] = useState(false)
  const [fileType, setFileType] = useState("")
  const [addNewTagPopUp, setAddNewTagPopUp] = useState(false)
  const [selectedUrl, setSelectedUrl] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null);
  const tagDropdownRef = useRef();
  const [selectFileExtension, setSelectFileExtension] = useState(null)
  const thisAudioRef = useRef(null);
  // const [currentPlaying, setCurrentPlaying] = useState("");
  const [audioUrl, setAudioURL] = useState("")
  const [sendSMSPopup, setSendSMSPopup] = useState(false);
  const [isActiveAgentsOpen, setIsActiveAgentsOpen] = useState(false);
  const accountDetails = useSelector((state) => state.accountDetails);

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
    setMessageInput((prevMessage) => {
      return prevMessage + emojiData.emoji
    })
  };
  const {
    formState: { errors },
    register,
    handleSubmit,
    reset
  } = useForm();

  //  function to extract extension
  const extractFileExtension = (selectedUrl) => {
    // debugger
    if (!selectedUrl) return null;

    // Step 1: Remove query parameters and get the base URL
    const fileUrl = selectedUrl.split("?")[0];
    const fileName = fileUrl.split("/").pop();

    if (fileName) {
      // Step 2: Try extracting extension from the filename
      const fileParts = fileName.split(".");
      if (fileParts.length > 1) {
        return fileParts.pop().toLowerCase(); // Standard case: return the extension
      }

      // Step 3: Fallback - Check query parameters for extension hints
      const queryParams = selectedUrl.split("?")[1];
      if (queryParams) {
        const params = new URLSearchParams(queryParams);
        // Look for common extension indicators in query params (customize as needed)
        for (const [, value] of params) {
          const lowerValue = value.toLowerCase();
          if (lowerValue.includes("png")) return "png";
          if (lowerValue.includes("jpg") || lowerValue.includes("jpeg")) return "jpg";
          if (lowerValue.includes("pdf")) return "pdf";
          // Add more extensions as needed
        }
      }

      // Step 4: Fallback - Decode URL-encoded filename and retry
      const decodedFileName = decodeURIComponent(fileName);
      const decodedParts = decodedFileName.split(".");
      if (decodedParts.length > 1) {
        return decodedParts.pop().toLowerCase();
      }
    }

    return null; // No extension found
  };
  useEffect(() => {
    if (selectedUrl) {
      const extension = extractFileExtension(selectedUrl);
      setSelectFileExtension(extension);
    }
  }, [selectedUrl]);


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
        const filteredData = apiData?.data?.sort((a, b) =>
          new Date(b?.last_message_data?.created_at) - new Date(a?.last_message_data?.created_at)
        );
        setContact(filteredData);
        if (!extensionFromCdrMessage) {
          const profile_img = allAgents?.find((data) => data?.id == apiData?.data[0]?.id)?.profile_picture
          setRecipient([apiData.data[0].extension, apiData.data[0].id, "singleChat", apiData?.data[0]?.name, apiData?.data[0]?.email, profile_img]);
          setSelectedChat("singleChat");
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

  // useEffect(() => {
  //   setContactRefresh(contactRefresh + 1)
  // }, [])

  useEffect(() => {
    if (sipProvider && sipProvider.connectStatus === CONNECT_STATUS.CONNECTED) {

      setIsSIPReady(true);
    } else {
      setIsSIPReady(false);
    }
  }, [sipProvider?.connectStatus]);

  // Resizeable Layout Functions
  const leftPanel = useRef(null);
  const rightPanel = useRef(null);

  const resetResizeContent = () => {
    if (leftPanel.current && rightPanel.current) {
      leftPanel.current.resize(70);
      rightPanel.current.resize(30);
    }
  }


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
        recipient[2] === "singleChat" ? `/message/all?receiver_id=${recipient[1]}&page=${pageNumb}` : `/group-message/all?group_id=${recipient[1]}&page=${pageNumb}`
      );

      apiData?.data?.data?.map((item) => {
        const user_details = allAgents?.find((data) => data?.id == item?.user_id)
        setAllMessage((prevState) => ({
          ...prevState,
          [recipient[2] == "singleChat" ? recipient[1] : recipient[0]]: [
            {
              from: item.user_id,
              body: item?.message_text,
              time: item.created_at,
              user_id: item.user_id,
              user_name: user_details?.username,
              profile_picture: user_details?.profile_picture,
              message_type: item.message_type
            },
            ...(prevState[recipient[2] == "singleChat" ? recipient[1] : recipient[0]] || []),
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
          console.log("from first");

        }
      } else {
        getData(1);
        setIsFreeSwitchMessage(true);
        console.log("from second");

      }
    }
  }, [recipient, loadMore]);

  const getExtension = (input) => {
    var parts = input?.split('.');
    return parts[parts?.length - 1]?.toLowerCase();
  }
  // Logic to send message
  const checkMessageType = (message) => {
    const isHasExtension = getExtension(message)
    if (isHasExtension == "jpg") {
      return "image"
    } else if (isHasExtension == "gif") {
      return "image"
    } else if (isHasExtension == "bmp") {
      return "image"
    } else if (isHasExtension == "png") {
      return "image"
    } else if (isHasExtension == "m4v") {
      return "video"
    } else if (isHasExtension == "avi") {
      return "video"
    } else if (isHasExtension == "mpg") {
      return "video"
    } else if (isHasExtension == "mp4") {
      return "video"
    } else if (isHasExtension == "webm") {
      return "video"
    } else if (isHasExtension == "wav") {
      return "audio"
    } else if (isHasExtension == "wma") {
      return "audio"
    } else if (isHasExtension == "pdf") {
      return "file"
    } else if (isHasExtension == "xlsx") {
      return "file"
    } else if (isHasExtension == "xlsm") {
      return "file"
    } else if (isHasExtension == "xlsb") {
      return "file"
    } else if (isHasExtension == "xltx") {
      return "file"
    } else if (isHasExtension == "csv") {
      return "file"
    } else if (isHasExtension == "zip") {
      return "file"
    } else {
      return "text/plain"
    }
  }
  function sendSingleMessage(selectedUrl) {
    if (!selectedUrl && messageInput.trim() === "") {
      return;
    }
    let messageContent;
    if (selectedUrl) {
      messageContent = selectedUrl
    } else {
      messageContent = messageInput.trim();
    }
    const messageType = checkMessageType(messageContent)
    sendMessage({
      "sharedMessage": messageContent,
      "from": account?.id,
      "to": recipient[1],
      "key": "peerchat",
      "action": "peerchat",
      "type": messageType
    })

    const time = formatDateTime(new Date());
    setIsFreeSwitchMessage(true);
    const userDetails = allAgents?.find((data) => data?.id == account?.id)
    setAllMessage((prevState) => ({
      ...prevState,
      [recipient[2] == "singleChat" ? recipient[1] : recipient[0]]: [
        ...(prevState[recipient[2] == "singleChat" ? recipient[1] : recipient[0]] || []),
        {
          from: userDetails.id,
          body: messageInput || selectedUrl,
          time,
          user_id: userDetails.id,
          user_name: userDetails?.username,
          profile_picture: userDetails?.profile_picture,
          message_type: messageType
        },
      ],
    }));
    // Update contact last message
    const contactIndex = contact.findIndex(
      (contact) => contact.id === recipient[1]
    );
    if (contactIndex !== -1) {
      const newContact = [...contact];
      newContact[contactIndex].last_message_data.message_text = messageInput;
      newContact[contactIndex].last_message_data.created_at = time;
      newContact?.splice(contactIndex, 1)
      newContact.unshift(contact[contactIndex])
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
  //     const targetURI = `sip:${recipient[0]}@${account.domain.domain_name}`;
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
  //         setIsFreeSwitchMessage(true);
  //         setAllMessage((prevState) => ({
  //           ...prevState,
  //           [recipient[0]]: [
  //             ...(prevState[recipient[0]] || []),
  //             { from: extension, body: messageInput || selectedUrl, time },
  //           ],
  //         }));
  //         // Update contact last message
  //         const contactIndex = contact.findIndex(
  //           (contact) => contact.extension === recipient[0]
  //         );
  //         if (contactIndex !== -1) {
  //           const newContact = [...contact];
  //           newContact[contactIndex].last_message_data.message_text = messageInput;
  //           newContact[contactIndex].last_message_data.created_at = time;
  //           setContact(newContact);
  //         }
  //         setActiveTab("all");

  //         const extensionExists = contact.some(
  //           (contact) => contact.extension === recipient[0]
  //         );
  //         const agentDetails = agents.find(
  //           (agent) => agent.extension.extension === recipient[0]
  //         );

  //         if (!extensionExists) {
  //           contact.unshift({
  //             name: agentDetails.username,
  //             email: agentDetails.email,
  //             id: agentDetails.id,
  //             extension_id: agentDetails.extension_id,
  //             extension: recipient[0],
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
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  // Logic to recieve messages from differnt users
  const userAgent = sipProvider?.sessionManager?.userAgent;

  useEffect(() => {
    if (incomingMessage) {
      const from = incomingMessage?.sender_id;
      const body = incomingMessage?.message_text;
      setIsFreeSwitchMessage(true);
      const extensionExists = contact.some(
        (contact) => contact?.id === from
      );
      const agentDetails = agents.find(
        (agent) => agent?.id === from
      );
      const time = formatDateTime(new Date());

      const contactIndex = contact.findIndex(
        (contact) => contact.id === agentDetails?.id
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
          (contact) => contact?.id === from
        );
        const extensionObject = contact.splice(index, 1)[0];
        contact.unshift(extensionObject);
        const newContact = [...contact];
        newContact[index].last_message_data.message_text = body;
        newContact[index].last_message_data.created_at = time;
        setContact(newContact);
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
          [from]: [...(prevState[from] || []), {
            from,
            body,
            time,
            user_id: agentDetails?.id,
            user_name: agentDetails?.name,
            profile_picture: agentDetails?.profile_picture,
            message_type: contentType
          }],
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
          [from]: [...(prevState[from] || []), {
            from,
            body,
            time,
            user_id: agentDetails?.id,
            user_name: agentDetails?.name,
            profile_picture: agentDetails?.profile_picture,
            message_type: contentType
          }],
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
          newContact[contactIndex].last_message_data.message_text = body;
          newContact[contactIndex].last_message_data.created_at = time;
          setContact(newContact);
        }
      }
    }
  }, [incomingMessage])
  // ===========================================================
  // if (userAgent) {
  //   debugger
  //   // Setup message delegate to handle incoming messages
  //   userAgent.delegate = {
  //     onMessage: (message) => {
  //       const from =
  //         message?.incomingMessageRequest?.message?.from?.uri?.user.toString();
  //       const body = message?.incomingMessageRequest?.message?.body;
  //       setIsFreeSwitchMessage(true);
  //       const extensionExists = contact.some(
  //         (contact) => contact.extension === from
  //       );
  //       const agentDetails = agents.find(
  //         (agent) => agent.extension.extension === from
  //       );
  //       const time = formatDateTime(new Date());

  //       const contactIndex = contact.findIndex(
  //         (contact) => contact.extension === recipient[0]
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

  //         if (recipient[0] !== from) {
  //           setUnreadMessage((prevState) => ({
  //             ...prevState,
  //             [from]: (prevState[from] || 0) + 1,
  //           }));
  //           audio.play();
  //         }

  //         // Update contact last message
  //         const contactIndex = contact.findIndex(
  //           (contact) => contact.extension === recipient[0]
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
          setLoadMore(loadMore + 1);
        }
      }
    };

    if (messageListRef.current) {
      messageListRef.current.addEventListener("scroll", handleScroll);
    }
  }, []);

  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction("/user-all");
      if (apiData?.status) {
        // setUser(apiData.data.filter((item) => item.extension_id !== null));
        setAllAgents(apiData.data.filter((item) => item.extension_id !== null));
        // setGroupSelecedAgents((prevSelected) => {
        //   return [...apiData.data.filter((item) => item.email === account.email)];
        // }
        // )
      }
    }
    getData();
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
          earlyMedia: true,
          inviteWithSdp: true,
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

      const sdh = apiData.sessionDescriptionHandler;

      // Check if remoteMediaStream is available
      if (sdh && sdh._remoteMediaStream) {
        const remoteStream = sdh._remoteMediaStream;

        // Listen for tracks being added to the remote stream
        remoteStream.onaddtrack = () => {
          playRemoteStream(remoteStream);
        };

        // If tracks are already present, attach immediately
        if (remoteStream.getTracks().length > 0) {
          playRemoteStream(remoteStream);
        }
      }

      // Function to play the remote stream
      function playRemoteStream(stream) {
        const audioElement = document.createElement("audio");
        audioElement.srcObject = stream;
        audioElement.autoplay = true;

        audioElement.play().catch((e) => {
          console.error("Error playing early media stream:", e);
        });
      }

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

  // Filter out the user from selcted group
  useEffect(() => {
    // ===========
    const getGroups = async () => {
      setLoading(true);
      const apiData = await generalGetFunction(`/groups/all`);
      if (apiData?.status) {
        const filteredData = apiData?.data?.sort((a, b) =>
          new Date(b?.last_message_data?.updated_at) - new Date(a?.last_message_data?.updated_at)
        );
        setGroups(apiData?.data);
        const isGroupSelected = apiData.data.find(
          (group) => group.id == recipient[1]
        );
        if (isGroupSelected) {
          const profile_img = allAgents?.find((data) => data?.id == isGroupSelected?.id)?.profile_picture
          setRecipient([isGroupSelected.group_name, isGroupSelected.id, "groupChat", isGroupSelected?.group_name, isGroupSelected?.email, profile_img]);
          setSelectedChat("groupChat");
          setGroupNameEdit(isGroupSelected.group_name);
          setSelectedgroupUsers(isGroupSelected.groupusers);
          isGroupSelected.groupusers.map((user) => {
            if (user.user_id === account.id) {
              setIsAdmin(user.is_admin)
            }
          })
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    getGroups();
  }, [groupRefresh]);


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
      user_id: userId
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

  const filteredUsers = allAgents.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user?.extension?.extension || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // Filter out agents already added
  const availableUsers = filteredUsers.filter(
    (user) => !agent.some((agent) => user.id == agent.name)
  );
  const handleCheckboxChange = (item) => {
    setGroupSelecedAgents((prevSelected) => {
      if (prevSelected.some((agent) => agent.name == item.name)) {
        // If the item is already in the array, remove it
        return prevSelected.filter((agent) => agent.name != item.name);
      } else {
        // Otherwise, add the item
        return [...prevSelected, item];
      }
    });
  };

  const handleSelectAll = () => {
    const newSelectAllState = !selectAll; // Toggle Select All state
    setSelectAll(newSelectAllState);

    if (newSelectAllState) {
      // Add all visible users to bulkUploadSelectedAgents
      availableUsers.forEach((item) => {
        if (!groupSelecedAgents.some((agent) => agent.name == item.name)) {
          handleCheckboxChange(item);
        }
      });
    } else {
      // Remove all visible users from bulkUploadSelectedAgents
      availableUsers.forEach((item) => {
        if (groupSelecedAgents.some((agent) => agent.name == item.name)) {
          handleCheckboxChange(item);
        }
      });
    }
  };

  async function handleCreateGroup() {
    if (groupname === "") {
      toast.error("Group name is required");
      return
    }
    setNewGroupLoader(true);
    const parsedData = {
      group_name: groupname,
      user_id: [...groupSelecedAgents.map((agent) => agent.id), account.id],
    };
    const apiData = await generalPostFunction("/groups/store", parsedData);
    if (apiData.status) {
      setGroupRefresh(groupRefresh + 1);
      toast.success("Group created successfully");
      setAddMember(false);
      setGroupChatPopUp(false);
      // setGroupSelecedAgents([]);
      setNewGroupLoader(false);
    } else {
      setNewGroupLoader(false);
    }
  };

  const handleEditGroupName = async () => {
    const parsedData = {
      group_name: groupNameEdit,
      // members: groupSelecedAgents.map((agent) => {
      //   return { user_id: agent.id, status: agent.status };
      // }),
    };
    setNewGroupLoader(true);
    const apiData = await generalPutFunction(
      `/groups/update/${recipient[1]}`,
      parsedData
    );
    if (apiData.status) {
      setGroupRefresh(groupRefresh + 1);
      toast.success("Group updated successfully");
      setSaveEditToggleGroupNameChange(false);
      setNewGroupLoader(false);
    } else {
      setNewGroupLoader(false);
    }
  };
  const handleAddNewMemberToGroup = async () => {
    // const payload = groupSelecedAgents.map((agent) => agent.id);
    const payLoad = {
      group_id: recipient[1],
      user_id: groupSelecedAgents.map((agent) => agent.id),
    };
    setNewGroupLoader(true);
    const apiData = await generalPostFunction("/group-users/store", payLoad);
    if (apiData.status) {
      setGroupRefresh(groupRefresh + 1);
      setGroupChatPopUp(false);
      setAddMember(false);
      setGroupSelecedAgents([]);
      setNewGroupLoader(false);
    } else {
      setNewGroupLoader(false);
    }
  };
  const handleremoveUserFromGroup = async (id) => {
    setNewGroupLoader(true);
    const apiData = await generalDeleteFunction(
      `/group-users/destroy/${id}`
      // payload
    );
    if (apiData.status) {
      toast.success(apiData.message);
      setSelectedgroupUsers(
        selectedgroupUsers.filter((item) => item.id !== id)
      );
      setNewGroupLoader(false);
    } else {
      setNewGroupLoader(false);
    }
  };


  // function to add display logic in messages

  // Logic to send group messages 
  function sendGroupMessage(selectedUrl) {
    let messageContent;
    if (selectedUrl) {
      messageContent = selectedUrl
    } else {
      messageContent = messageInput.trim();
    }
    const messageType = checkMessageType(messageContent)
    sendMessage({
      "action": "broadcastGroupMessage",
      "user_id": account.id,
      "sharedMessage": messageContent,
      "group_id": recipient[1],
      "group_name": recipient[0],
      "user_name": account.name,
      "user_extension": account.extension.extension,
      "message_type": messageType
    })

    const time = formatDateTime(new Date());
    const userDetails = allAgents?.find((data) => data?.id == account?.id)
    setAllMessage((prevState) => ({
      ...prevState,
      [recipient[2] == "singleChat" ? recipient[1] : recipient[0]]: [
        ...(prevState[recipient[2] == "singleChat" ? recipient[1] : recipient[0]] || []),
        {
          from: recipient[2] == "singleChat" ? recipient[1] : recipient[0],
          body: messageContent, // Show appropriate text in the message history
          time,
          user_id: userDetails.id,
          user_name: userDetails?.username,
          profile_picture: userDetails?.profile_picture,
          message_type: checkMessageType(messageContent)
        },
      ],
    }));

    // ============================== need to work here
    // debugger
    // // Update contact last message
    // const contactIndex = groups.findIndex(
    //   (contact) => contact?.group_name === recipient[0]
    // );
    // if (contactIndex !== -1) {
    //   const newGroups = [...groups];
    //   newGroups[contactIndex].last_message_data.message_text = messageInput;
    //   newGroups[contactIndex].last_message_data.created_at = time;
    //   newGroups?.splice(contactIndex, 1)
    //   newGroups.unshift(contact[contactIndex])
    //   setContact(newGroups);
    // }
    // setActiveTab("all");

    // const extensionExists = contact.some(
    //   (contact) => contact.extension === recipient[0]
    // );
    // const agentDetails = agents.find(
    //   (agent) => agent.extension.extension === recipient[0]
    // );

    // if (!extensionExists) {
    //   contact.unshift({
    //     name: agentDetails.username,
    //     email: agentDetails.email,
    //     id: agentDetails.id,
    //     extension_id: agentDetails.extension_id,
    //     extension: recipient[0],
    //     last_message_data: {
    //       message_text: messageInput,
    //       created_at: time,
    //     },
    //   });
    // }
    // Clear both message input and selected file
    setMessageInput("");
    setSelectedUrl(null);

  }
  
  // Recieve group message
  useEffect(() => {
    if (groupMessage) {
      const audio = new Audio(
        require("../../assets/music/message-notification.mp3")
      );
      const from = groupMessage?.user_id;
      const body = groupMessage?.sharedMessage;
      setIsFreeSwitchMessage(true);
      const time = formatDateTime(new Date());
      setAllMessage((prevState) => ({
        ...prevState,
        [groupMessage.group_name]: [...(prevState[groupMessage.group_name] || []),
        {
          from,
          body,
          time,
          user_id: from,
          ser_name: groupMessage?.user_name,
          profile_picture: groupMessage?.profile_picture,
          message_type: groupMessage.message_type,
        }],
      }));
      if (groupMessage?.group_name != undefined) {
        setUnreadMessage((prevState) => ({
          ...prevState,
          [groupMessage?.group_name]: (prevState[groupMessage?.group_name] || 0) + 1,
        }));
        audio.play();
      }

    }
  }, [groupMessage])

  // Handle logic to make any user admin or remove any user from admin
  async function manageAdmin(id, groupId, userId, isAdmin) {
    setLoading(true);
    const parsedData = {
      'group_id': groupId,
      'user_id': userId,
      'is_admin': isAdmin,
    }
    const apiData = await generalPutFunction(`/group-users/update/${id}`, parsedData)
    if (apiData.status) {
      setLoading(false);
      toast.success(apiData.message)
      setGroupRefresh(groupRefresh + 1);
    } else {
      setLoading(false);
      toast.error(apiData.message)
    }
  }

  // Handle delete group 
  async function handleDeleteGroup(id) {
    setLoading(true);
    const apiData = await generalDeleteFunction(`/groups/destroy/${id}`)
    if (apiData.status) {
      setLoading(false);
      toast.success(apiData.message)
      setGroupRefresh(groupRefresh + 1);
    } else {
      setLoading(false);
      toast.error(apiData.message)
    }
  }
  const example = []
  const newExample = []

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
  console.log('allMessageallMessageallMessage', allMessage)
  console.log('gorup 777777777', groups)
  return (
    <>
      {addNewTagPopUp &&
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
                  <label for="">Full Name</label>
                </div>
                <div className="col-12">
                  <input type="text"
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
                      handleNewTag();
                      setAddNewTagPopUp(false)
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
      }

      {allLogOut && (
        <LogOutPopUp setAllLogOut={setAllLogOut} handleLogOut={handleLogOut} />
      )}
      <main
        className="mainContentApp "
        style={{
          marginRight:
            sessions.length > 0 && Object.keys(sessions).length > 0
              ? "250px"
              : "0",
        }}
      >
        <section>
          <div className="w-100 p-0">
            <HeaderApp title={"Messages"} loading={loading} setLoading={setLoading} refreshApi={() => setContactRefresh(contactRefresh + 1)} />
          </div>
          <div className="container-fluid ">

            <div className="row webrtc_newMessageUi">

              <div
                className="col-12 col-xl-3 col-lg-3 col-xxl-3 d-flex flex-wrap justify-content-between py-3 px-xl-0 rounded-3 leftside_listBar"
                style={{
                  // height: "100%",
                  // borderRight: "1px solid var(--border-color)",
                }}
              >
                {/* <div className="col-auto" style={{ padding: "0 10px" }}>
                  <h5 className="viewingAs">
                    Viewing As:
                    <span>
                      {account && extension ? (
                        <span>
                          {account?.username} - {account && extension}
                        </span>
                      ) : (
                        <span className="text-danger">
                          No Extension Assigned
                        </span>
                      )}
                    </span>
                  </h5>
                </div> */}
                {/* <div className="col-auto" style={{ padding: "0 10px" }}>
                  <button
                    className="clearColorButton dark"
                    onClick={() => setGroupChatPopUp(true)}
                  >
                    <i className="fa-light fa-pen-to-square"></i> New Chat
                  </button>
                </div> */}
                <div className="col-12" style={{ padding: "0 10px" }}>
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
                        <i className="fa-regular fa-circle-dot "></i> All
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
                        <i className="fa-regular fa-user-tie"></i> Online
                      </button>
                      {/* <button
                        onClick={() => setActiveTab("tags")}
                        className={
                          activeTab === "tags" ? "tabLink active" : "tabLink"
                        }
                        effect="ripple"
                        data-category="incoming"
                      >
                        Tags
                      </button> */}
                      <button
                        onClick={() => setActiveTab("group")}
                        className={
                          activeTab === "group" ? "tabLink active" : "tabLink"
                        }
                        effect="ripple"
                        data-category="incoming"
                      >
                        <i className="fa-regular fa-user-group"></i> Group
                      </button>
                      {/* <button
                        onClick={() => setSendSMSPopup(true)}
                        className="tabLink"
                        effect="ripple"
                        data-category="incoming"
                      >
                        SMS
                      </button> */}
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
                      // style={{ height: "calc(100vh - 270px)" }}
                      >
                        {/* <div className="chatHeading">
                          <h5 data-bs-toggle="collapse" href="#collapse1" role="button" aria-expanded="false" aria-controls="collapse1">Pinned <i className="fa-solid fa-chevron-down"></i></h5>
                        </div>
                        <div className="collapse show" id="collapse1">
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
                            Chats <i className="fa-solid fa-chevron-down"></i>
                          </h5>
                        </div>
                        <div
                          className="collapse show"
                          id="collapse2"
                        // style={{
                        //   borderBottom: "1px solid var(--border-color)",
                        // }}
                        >
                          {contact.map((item) => {
                            return (
                              <div
                                data-bell={
                                  unreadMessage[item?.id]
                                    ? unreadMessage[item?.id]
                                    : ""
                                }
                                className={
                                  recipient[1] === item?.id
                                    ? "contactListItem selected"
                                    : "contactListItem"
                                }
                              >
                                <div
                                  onClick={() => {
                                    const profile_picture = allAgents?.find((data) => data?.id == item?.id)?.profile_picture
                                    setRecipient([item?.extension, item.id, "singleChat", item?.name, item?.email, profile_picture]);
                                    setSelectedChat("singleChat");
                                    setUnreadMessage((prevState) => {
                                      const {
                                        [item?.id]: _,
                                        ...newState
                                      } = prevState;
                                      return newState;
                                    });
                                  }}
                                  className="w-100 "
                                >
                                  <div className=" d-flex align-items-start">
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
                                      {accountDetails?.users?.find((acc) => acc.id === item.id)?.profile_picture ?
                                        <img
                                          src={accountDetails?.users?.find((acc) => acc.id === item.id)?.profile_picture}
                                          alt="profile"
                                          onError={(e) => e.target.src = require('../../assets/images/placeholder-image.webp')}
                                        /> :
                                        <i className="fa-light fa-user fs-5"></i>
                                      }
                                    </div>
                                    <div className="ms-3 flex-grow-1">
                                      <p>{item?.name}
                                        <span className=" text-end mb-0">
                                          <p className="timeAgo">
                                            {item?.last_message_data
                                              ? formatRelativeTime(
                                                item?.last_message_data
                                                  ?.created_at
                                              )
                                              : ""}
                                          </p>
                                        </span>
                                      </p>
                                      <h5>
                                        {/* here showing last send message below of contact name */}
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

                                        {item.tags?.length > 2 &&
                                          <span className="more">
                                            +{item.tags?.length - 2}
                                          </span>
                                        }
                                      </div>

                                    </div>

                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="chatHeading">
                          <h5
                            data-bs-toggle="collapse"
                            href="#collapse3"
                            role="button"
                            aria-expanded="false"
                            aria-controls="collapse3"
                          >
                            Group Chat <i className="fa-solid fa-chevron-down"></i>
                          </h5>
                        </div>
                        <div
                          className="collapse show"
                          id="collapse3"
                        // style={{ borderBottom: "1px solid #ddd" }}
                        >
                          {
                            groups.map((item, index) => {
                              return (
                                <div
                                  className={recipient[1] === item.id ? "contactListItem selected" : "contactListItem"}
                                  data-bell={
                                    unreadMessage[item.group_name]
                                      ? unreadMessage[item.group_name]
                                      : ""
                                  }
                                  onClick={() => {
                                    setRecipient([item.group_name, item.id, "groupChat", item?.group_name, item?.email, null]);
                                    setSelectedChat("groupChat");
                                    setGroupNameEdit(item.group_name);
                                    // getGroupDataById(item.id);
                                    setSelectedgroupUsers(item.groupusers);
                                    setUnreadMessage((prevState) => {
                                      const {
                                        [item.group_name]: _,
                                        ...newState
                                      } = prevState;
                                      return newState;
                                    });
                                    item.groupusers.map((user) => {
                                      if (user.user_id === account.id) {
                                        setIsAdmin(user.is_admin)
                                      }
                                    })
                                  }}
                                >
                                  <div className="w-100">
                                    <div className=" d-flex align-items-center">
                                      <div
                                        className="profileHolder"
                                        id={"profileOfflineNav"}
                                      >
                                        <i className="fa-light fa-users fs-5"></i>
                                      </div>
                                      <div className="ms-3">
                                        <p>{item.group_name}</p>
                                        {/* <h5>Alright</h5>
                                        <div className="contactTags">
                                          <span data-id="3">Priority</span>
                                        </div> */}
                                      </div>
                                    </div>{" "}
                                  </div>
                                </div>
                              );
                            })
                          }
                        </div>


                      </div>
                    </div>
                  ) : activeTab === "online" ? (
                    <div className="tab-content">
                      <div
                        className="callList"
                        style={{ height: "calc(100vh - 230px)" }}
                      >
                        <div className="chatHeading">
                          <h5
                            data-bs-toggle="collapse"
                            href="#collapse4"
                            role="button"
                            aria-expanded="false"
                            aria-controls="collapse2"
                          >
                            Online<i className="fa-solid fa-chevron-down"></i>
                          </h5>
                        </div>
                        <div className="collapse show" id="collapse4" style={{ borderBottom: "1px solid var(--border-color)" }}>
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
                                  onClick={() => {
                                    const profile_picture = allAgents?.find((data) => data?.id == item?.id)?.profile_picture
                                    setRecipient([
                                      item?.extension.extension,
                                      item.id,
                                      "singleChat",
                                      item?.name,
                                      item?.email,
                                      profile_picture
                                    ])
                                    setSelectedChat("singleChat");
                                  }
                                  }
                                  className="w-100"
                                >
                                  <div className=" d-flex align-items-start ">
                                    <div
                                      className="profileHolder"
                                      id="profileOnlineNav"
                                    >
                                      {accountDetails?.users?.find((acc) => acc.id === item.id)?.profile_picture ?
                                        <img
                                          src={accountDetails?.users?.find((acc) => acc.id === item.id)?.profile_picture}
                                          alt="profile"
                                          onError={(e) => e.target.src = require('../../assets/images/placeholder-image.webp')}
                                        /> :
                                        <i className="fa-light fa-user fs-5"></i>
                                      }
                                    </div>
                                    <div className=" ms-3 ">
                                      <p>{item?.username}</p>
                                      <h5>{item?.extension.extension}</h5>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {onlineUser.length === 0 && (
                          <div className="chatHeading" data-bell={""}>
                            <h5>No Online user found</h5>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : activeTab === "tags" ? (
                    <div className="tab-content">
                      <div
                        className="callList"
                        style={{ height: "calc(100vh - 230px)" }}
                      >
                        <div className="chatHeading" data-bell={""}>
                          <h5>
                            Tag List{" "}
                            <Tippy content="Click to add a new tag!">
                              <i
                                onClick={() => setAddNewTag(true)}
                                className="fa-light fa-plus fs-5"
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
                                      className="clearButton2"
                                      onClick={handleUpdateTag}
                                    >
                                      <Tippy content="Click to save your tag!">
                                        <i className="fa-regular fa-floppy-disk"></i>
                                      </Tippy>
                                    </button>
                                  ) : (
                                    <button
                                      className="clearButton2"
                                      onClick={() => {
                                        setSelectedTag(item.id);
                                        setUpDateTag(item.name);
                                      }}
                                    >
                                      <Tippy content="You can edit the tag here!">
                                        <i className="fa-regular fa-pen-to-square"></i>
                                      </Tippy>
                                    </button>
                                  )}
                                  <Tippy content="Click to delete your tag!">
                                    <button
                                      className="clearButton2"
                                      onClick={() => handleDeleteTag(item.id)}
                                    >
                                      <i className="fa-regular fa-trash text-danger"></i>
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
                                  className="clearButton2"
                                  onClick={handleNewTag}
                                >
                                  <i className="fa-regular fa-circle-check"></i>
                                </button>
                                <button
                                  className="clearButton2  xl"
                                  onClick={() => setAddNewTag(false)}
                                >
                                  <i className="fa-regular fa-trash text-danger"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="tab-content">
                      <div
                        className="callList"
                        style={{ height: "calc(100vh - 230px)" }}
                      >
                        <div className="chatHeading d-flex justify-content-between align-items-center" data-bell={""}>
                          <h5>
                            Group Chats{" "}
                          </h5>
                          {account.user_role?.roles?.name !== "Agent" &&
                            <Tippy content="Click to create a new group!">
                              <button onClick={() => setGroupChatPopUp(true)} className="addGroup">
                                Add Group  <i className="fa-light fa-plus" ></i>
                              </button>
                            </Tippy>
                          }
                        </div>
                        {groupChatPopUp ? (
                          <div
                            className="addNewContactPopup pb-0"
                            style={{
                              position: "static",
                              transform: "none",
                              width: "100%",
                              boxShadow: "none",
                              background: "transparent",
                            }}
                          >
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
                                {/* <div className="col-12 d-flex justify-content-between align-items-center"> */}
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
                                {/* </div> */}
                              </div>
                              <div className="col-xl-12 mt-2">
                                <div className="col-12 d-flex justify-content-between align-items-center">
                                  <input
                                    type="text"
                                    className="formItem"
                                    placeholder="Search"
                                    name="name"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
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
                                          <th>Extension</th>
                                          <th>
                                            <input
                                              type="checkbox"
                                              onChange={handleSelectAll} // Call handler on change
                                            // checked={selectAll ? true : false} // Keep checkbox state in sync
                                            />
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {allAgents
                                          .sort((a, b) => {
                                            const aMatches =
                                              a.name
                                                .toLowerCase()
                                                .includes(searchQuery.toLowerCase()) ||
                                              (a?.extension?.extension || "")
                                                .toLowerCase()
                                                .includes(searchQuery.toLowerCase());
                                            const bMatches =
                                              b.name
                                                .toLowerCase()
                                                .includes(searchQuery.toLowerCase()) ||
                                              (b?.extension?.extension || "")
                                                .toLowerCase()
                                                .includes(searchQuery.toLowerCase());
                                            // Items that match come first
                                            return bMatches - aMatches;
                                          })
                                          .filter(
                                            (user) =>
                                              !agent.some((agent) => user.id == agent.name) && (user.email !== account.email)
                                          ) // Exclude agents already in `agent`
                                          .map((item, index) => (
                                            <tr key={index}>
                                              <td>{index + 1}.</td>
                                              <td>{item.name}</td>
                                              <td>{item?.extension?.extension}</td>
                                              <td>
                                                <input
                                                  type="checkbox"
                                                  onChange={() =>
                                                    handleCheckboxChange(item)
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
                                      setGroupChatPopUp(false);
                                    }}
                                  >
                                    <span className="text">Close</span>
                                    <span className="icon">
                                      <i className="fa-solid fa-caret-left" />
                                    </span>
                                  </button>
                                  <button
                                    className="panelButton me-0"
                                    onClick={() => handleCreateGroup()}
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
                        ) :
                          groups.map((item, index) => {
                            return (
                              <div
                                className={recipient[1] === item.id ? "contactListItem selected" : "contactListItem"}
                                data-bell={""}
                                onClick={() => {
                                  const profile_picture = allAgents?.find((data) => data?.id == item?.id)?.profile_picture
                                  setRecipient([item.group_name, item.id, "groupChat", item?.group_name, item?.email, profile_picture]);
                                  setSelectedChat("groupChat");
                                  setGroupNameEdit(item.group_name);
                                  setSelectedgroupUsers(item.groupusers);
                                  item.groupusers.map((user) => {
                                    if (user.user_id === account.id) {
                                      setIsAdmin(user.is_admin)
                                    }
                                  })
                                }}
                              >
                                <div className="w-100">
                                  <div className=" d-flex align-items-start justify-content-between">
                                    <div className="d-flex">
                                      <div
                                        className="profileHolder"
                                        id={"profileOfflineNav"}
                                      >
                                        <i className="fa-light fa-users fs-5"></i>
                                      </div>
                                      <div className=" ms-3 ">
                                        <p>{item.group_name}</p>
                                        {/* <h5>Alright</h5>
                                      <div className="contactTags">
                                        <span data-id="3">Priority</span>
                                      </div> */}
                                      </div>
                                    </div>
                                    <div className=" text-end">
                                      <div className="dropdown">
                                        <button
                                          className="clearButton2 "
                                          type="button"
                                          data-bs-toggle="dropdown"
                                          aria-expanded="true"
                                        >
                                          <i className="fa-solid fa-ellipsis-vertical" />
                                        </button>
                                        <ul
                                          className="dropdown-menu light"
                                        >
                                          <li>
                                            <div className="dropdown-item" onClick={() => setManageGroupChat(true)}>
                                              Edit Group Chat
                                            </div>
                                          </li>
                                          <li>
                                            <div className="dropdown-item text-danger" onClick={() => handleDeleteGroup(item.id)}>
                                              Delete Group Chat
                                            </div>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>{" "}
                                </div>
                              </div>
                            );
                          })
                        }

                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div
                className="col-12 col-xl-9 col-lg-9 col-xxl-9 callDetails eFaxCompose newMessageBoxUi pe-0"
                // style={{ height: "100%" }}
                id="callDetails"
              >
                <div className="row h-100">
                  <PanelGroup autoSaveId="example" direction="horizontal">
                    <Panel className='leftPanel' defaultSize={70} collapsible={false} minSize={50} ref={leftPanel}>
                      {/* this is chat section *********** */}
                      <div className="col-auto h-100">
                        <div className="messageOverlay h-100">
                          {recipient[0] ? (
                            <div className="contactHeader">
                              <div>
                                <div className="d-flex justify-content-start align-items-center gap-2 mb-2">
                                  {
                                    recipient[5] != null ?
                                      <div className="profileHolder">
                                        <img
                                          src={recipient[5]}
                                          alt="profile"
                                          onError={(e) => e.target.src = require('../../assets/images/placeholder-image.webp')}
                                        />
                                      </div>
                                      :
                                      <div
                                        className="profileHolder"
                                        id={"profileOfflineNav"}
                                      >
                                        {
                                          selectedChat == "singleChat" ?
                                            <i className="fa-light fa-user fs-5"></i> :
                                            <i className="fa-light fa-users fs-5"></i>
                                        }
                                      </div>
                                  }
                                  <h4 className="">
                                    {/* {
                                contact?.find(
                                  (contact) => contact.extension == recipient[0]
                                )?.name
                              }{" "}-
                              {" "} */}


                                {recipient[3]}
                              </h4>
                            </div>
                            {/* <h4>{recipient[0]}</h4> */}
                            <div className="contactTags">
                              {contact
                                .find(
                                  (contact) => contact.extension == recipient[0]
                                )
                                ?.tags?.map((item, key) => {
                                  return (
                                    <span
                                      data-id={key}
                                      onClick={() =>
                                        handleUnassignTask(item?.id)
                                      }
                                      className="removableTag"
                                    >
                                      {item.tag?.[0]?.name}
                                    </span>
                                  );
                                })}
                              {/* <span data-id="1">Work</span> */}
                              {selectedChat === "groupChat" ? "" :
                                <div className="dropdown ms-1">
                                  <span
                                    className="add"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    data-bs-auto-close="outside"
                                    ref={tagDropdownRef}
                                  >
                                    <i className="fa-solid fa-circle-plus me-1"></i>{" "}
                                    Add tag
                                  </span>
                                  <ul className="dropdown-menu p-3" ref={tagDropdownRef}>
                                    {/* <div className="tagBox">
                                      <img src={require("../../assets/images/tag.webp")} alt="tag" />
                                    </div>
                                    <p className="text-center">Add New Tag</p> */}
                                    <div className="searchBox position-relative">
                                      {/* <label>Search:</label> */}
                                      <input
                                        type="search"
                                        name="Search"
                                        className="formItem"
                                        placeholder="Search a Tag Name"
                                      // value={userInput}
                                      // onChange={(e) => setuserInput(e.target.value)}
                                      />
                                    </div>
                                    <div className="contactTags my-2">
                                      {contact
                                        .find(
                                          (contact) => contact.extension == recipient[0]
                                        )
                                        ?.tags?.map((item, key) => {
                                          return (
                                            <span
                                              data-id={key}
                                            // onClick={() =>
                                            //   handleUnassignTask(item?.id)
                                            // }
                                            // className="removableTag"
                                            >
                                              {item.tag?.[0]?.name}
                                            </span>
                                          );
                                        })}
                                      <button className="more info">
                                        <i class="fa-regular fa-plus me-1"></i> Create New Tag
                                      </button>
                                    </div>
                                    {/* {allTags.map((item, key) => {
                                          return (
                                            <div className="contactTagsAddEdit" style={{ width: '350px' }}>
                                              <div className="row align-items-center item">
                                                <div className="col-4">
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
                                                      className="w-100"
                                                    />
                                                  </h5>
                                                </div>
                                                <div className="col-3">
                                                  <span data-id="0">
                                                    {
                                                      selectedTag === item.id
                                                        ? upDateTag
                                                        : item.name
                                                    }
                                                  </span>
                                                </div>
                                                <div className="col-auto d-flex justify-content-end pe-0">
                                                  <button
                                                    className="clearButton2"
                                                    onClick={() =>
                                                      handleAssignTask(
                                                        item?.id,
                                                        recipient[1]
                                                      )
                                                    }
                                                  ><i className="fa-regular fa-check" /></button>
                                                  {selectedTag === item.id ? (
                                                    <button
                                                      className="clearButton2"
                                                      onClick={handleUpdateTag}
                                                    >
                                                      <Tippy content="Click to save your tag!">
                                                        <i className="fa-regular fa-floppy-disk"></i>
                                                      </Tippy>
                                                    </button>
                                                  ) : (
                                                    <button
                                                      className="clearButton2"
                                                      onClick={() => {
                                                        setSelectedTag(item.id);
                                                        setUpDateTag(item.name);
                                                      }}
                                                    >
                                                      <Tippy content="You can edit the tag here!">
                                                        <i className="fa-regular fa-pen-to-square"></i>
                                                      </Tippy>
                                                    </button>
                                                  )}
                                                  <Tippy content="Click to delete your tag!">
                                                    <button
                                                      className="clearButton2"
                                                      onClick={() => handleDeleteTag(item.id)}
                                                    >
                                                      <i className="fa-regular fa-trash text-danger"></i>
                                                    </button>
                                                  </Tippy>
                                                </div>
                                              </div>
                                            </div>
                                            // <li
                                            //   className="dropdown-item"
                                            //   onClick={() =>
                                            //     handleAssignTask(
                                            //       item.id,
                                            //       recipient[0]
                                            //     )
                                            //   }
                                            // >
                                            //   {item.name}
                                            // </li>
                                          );
                                        })} */}
                                    {/* <li className="mt-4">
                                      <button onClick={() => { setAddNewTagPopUp(true); tagDropdownRef.current.classList.toggle("show") }} className="panelButton text-white static">
                                        Create New Tag
                                      </button>
                                    </li> */}
                                  </ul>
                                </div>
                              }
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
                            {selectedChat === "groupChat" ? "" :
                              <button
                                onClick={() => onSubmit("audio", recipient[0])}
                                className="clearButton2"
                                effect="ripple"
                              >
                                <i className="fa-regular fa-phone" />
                              </button>
                            }
                            {isVideoOn ? (
                              <button
                                onClick={() => onSubmit("video", recipient[0])}
                                className="clearButton2"
                                effect="ripple"
                              >
                                <i className="fa-regular fa-video" />
                              </button>
                            ) : (
                              ""
                            )}
                            <div className="dropdown">
                              <button
                                className="clearButton2"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <i className="fa-solid fa-ellipsis-vertical"></i>
                              </button>
                              <ul className="dropdown-menu">
                                <li>
                                  <div
                                    className="dropdown-item"
                                    href="#"
                                    onClick={() => featureUnderdevelopment()}
                                  >
                                    Mark as unread
                                  </div>
                                </li>
                                <li>
                                  <div
                                    className="dropdown-item"
                                    href="#"
                                    onClick={() => featureUnderdevelopment()}
                                  >
                                    Archive this chat
                                  </div>
                                </li>
                                {selectedChat === "groupChat" && (
                                  <li>
                                    <div
                                      className="dropdown-item"
                                      href="#"
                                      onClick={() => setManageGroupChat(true)}
                                    >
                                      Manage Group Chat
                                    </div>
                                  </li>
                                )}

                                {selectedChat === "groupChat" && (
                                  <li>
                                    <div
                                      className="dropdown-item"
                                      href="#"
                                      onClick={() => {
                                        setGroupLeaveId(selectedgroupUsers.filter((item) => item.user_id === account.id)[0].id);
                                        setGroupLeavePopUp(true);
                                      }}
                                    >
                                      Leave this group
                                    </div>
                                  </li>
                                )}

                                <li>
                                  <div
                                    className="dropdown-item text-danger"
                                    href="#"
                                    onClick={() => featureUnderdevelopment()}
                                  >
                                    Close this chat
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="messageContent position-relative">
                        {/* this is chat section (showing section of all input and output messages) */}
                        <div className="messageList" ref={messageListRef}>
                          {recipient[0] ? (
                            <>
                              {allMessage?.[selectedChat === "groupChat" ? recipient[0] : recipient[1]]?.map(
                                (item, index, arr) => {
                                  const messageDate = item.time?.split(" ")[0]; // Extract date from the time string
                                  const todayDate = new Date()
                                    .toISOString()
                                    ?.split("T")[0]; // Get today's date in "YYYY-MM-DD" format
                                  const isNewDate =
                                    index === 0 ||
                                    messageDate !==
                                    arr[index - 1].time?.split(" ")[0];

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
                                      {item.from !== recipient[1] ? (
                                        <div className="messageItem sender">
                                          <div className="second">
                                            <div className="d-flex gap-3 ">
                                              <div className=" ms-3 ">
                                                <h6>
                                                  <span>
                                                    {item.time
                                                      ?.split(" ")[1]
                                                      ?.split(":")
                                                      .slice(0, 2)
                                                      .join(":")}
                                                  </span> &nbsp;
                                                  {item.user_name}
                                                </h6>
                                                <div className="">
                                                  <DisplayFile key={index} item={item.body} index={index} />
                                                </div>
                                              </div>
                                              {
                                                item?.profile_picture ?
                                                  <div className="profileHolder">
                                                    <img
                                                      src={item?.profile_picture}
                                                      alt="profile"
                                                      onError={(e) => e.target.src = require('../../assets/images/placeholder-image.webp')}
                                                    />
                                                  </div>
                                                  :
                                                  <div
                                                    className="profileHolder"
                                                    id={"profileOfflineNav"}
                                                  >
                                                    <i className="fa-light fa-users fs-5"></i>
                                                  </div>
                                              }
                                            </div>
                                          </div>
                                        </div>
                                      ) : (

                                        <div className="messageItem receiver">
                                          <div className="second">
                                            <div className="d-flex gap-3 ">
                                              {
                                                item?.profile_picture ?
                                                  <div className="profileHolder">
                                                    <img
                                                      src={item?.profile_picture}
                                                      alt="profile"
                                                      onError={(e) => e.target.src = require('../../assets/images/placeholder-image.webp')}
                                                    />
                                                  </div>
                                                  :
                                                  <div
                                                    className="profileHolder"
                                                    id={"profileOfflineNav"}
                                                  >
                                                    <i className="fa-light fa-users fs-5"></i>
                                                  </div>
                                              }

                                              <div className=" ms-3 ">
                                                <h6>
                                                  {item.user_name}
                                                  <span>
                                                    {item.time
                                                      ?.split(" ")[1]
                                                      ?.split(":")
                                                      .slice(0, 2)
                                                      .join(":")}
                                                  </span>
                                                </h6>
                                                <div className="">
                                                  <DisplayFile item={item.body} />

                                                </div>
                                              </div>

                                            </div>
                                          </div>

                                          {/* <div className="second">
                                           
                                           
                                          </div> */}
                                        </div>
                                      )}
                                    </React.Fragment>
                                  );
                                }
                              )}

                            </>
                          ) : (
                            <div className="startAJob">
                              <div className="text-center mt-3">
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

                          <div className="messageInput textarea_inputTab">
                            {emojiOpen &&
                              <div style={{ position: "absolute", bottom: 180, width: 'auto', height: 'auto' }}>
                                <EmojiPicker onEmojiClick={handleEmojiClick} open={emojiOpen} />
                                <button className='clearButton2' style={{ position: 'absolute', bottom: 15, right: 10, zIndex: 9 }} onClick={() => setEmojiOpen(!emojiOpen)}><i className='fa-solid fa-xmark'></i></button>
                              </div>
                            }
                            <div className="col-12">
                              <nav>
                                <div
                                  className="nav nav-tabs"
                                  id="nav-tab"
                                  role="tablist"
                                >
                                  <button
                                    className="tabLink active"
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
                                    className="tabLink"
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
                                    className="tabLink"
                                    id="nav-whatsapp-tab"
                                    // data-bs-toggle="tab"
                                    // data-bs-target="#nav-whatsapp"
                                    type="button"
                                    role="tab"
                                    aria-controls="nav-whatsapp"
                                    aria-selected="false"
                                    // onClick={() => featureUnderdevelopment()}
                                    onClick={() => setactivePage("whatsapp-chartbox")}
                                  >
                                    WhatsApp
                                  </button>
                                  <button
                                    className="tabLink"
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
                            <div className="d-flex w-100">
                              <div className="tab-content textSms me-2" id="nav-tabContent">
                                <div
                                  className="tab-pane fade show active"
                                  id="nav-im"
                                  role="tabpanel"
                                  aria-labelledby="nav-im-tab"
                                >
                                  {/* {selectedFile && (
                                  <div className="file-badge absolute top-1 left-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full z-10 max-w-[80%] truncate">
                                    📎 {selectedFile.name}
                                  </div>
                                )} */}
                                  <div className="w-100">
                                    <textarea
                                      type="text"
                                      rows={1}
                                      name=""
                                      className="formItem "
                                      placeholder="Please enter your message"
                                      value={messageInput}
                                      onChange={(e) =>
                                        setMessageInput(e.target.value)
                                      }
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          if (recipient[2] === "groupChat") {
                                            sendGroupMessage();
                                          } else {
                                            sendSingleMessage();
                                          }
                                        }
                                      }}
                                    />
                                  </div>
                                </div>
                                <div
                                  className="tab-pane fade"
                                  id="nav-whatsapp"
                                  role="tabpanel"
                                  aria-labelledby="nav-whatsapp-tab"
                                >
                                  ...
                                </div>
                                <div
                                  className="tab-pane fade"
                                  id="nav-messenger"
                                  role="tabpanel"
                                  aria-labelledby="nav-messenger-tab"
                                >
                                  ...
                                </div>
                              </div>

                              <div className=" d-flex justify-content-between align-items-start gap-2">
                                <div className="d-flex gap-1">
                                  <button
                                    className="clearButton2 eraser"
                                    onClick={() => featureUnderdevelopment()}
                                  >
                                    <i className="fa-light fa-eraser" />
                                  </button>
                                  <button
                                    className="clearButton2 gallery"
                                    onClick={() => { setFileUpload(true); setFileType("image") }}
                                  >
                                    <i className="fa-regular fa-image"></i>
                                  </button>
                                  <button
                                    className="clearButton2 link"
                                    onClick={() => { setFileUpload(true); setFileType("all") }}
                                  >
                                    <i className="fa-solid fa-paperclip"></i>
                                  </button>
                                  <button
                                    className="clearButton2 emoji"
                                    onClick={() => setEmojiOpen(!emojiOpen)}
                                  >
                                    <i className="fa-regular fa-face-smile"></i>
                                  </button>
                                </div>
                                <div>
                                  <button
                                    effect="ripple"
                                    className="clearColorButton dark"
                                    onClick={() => {
                                      if (recipient[2] === "groupChat") {
                                        sendGroupMessage()
                                      } else {
                                        sendSingleMessage()
                                      }
                                    }}
                                  >
                                    {/* Send Now{" "} */}
                                    <i className="fa-solid fa-paper-plane-top" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                  {/* </Panel> */}
                  {/* <PanelResizeHandle className="resizeHandle">
                      <Tippy content={
                        <button className='tableButton delete' onClick={resetResizeContent}>
                          <i className="fa-regular fa-arrows-rotate"></i>
                        </button>
                      } allowHTML={true} placement="top" interactive={true}>
                        <button className='clearButton2'>
                          <i class="fa-regular fa-arrows-left-right"></i>
                        </button>
                      </Tippy>
                    </PanelResizeHandle> */}
                  {/* <Panel className='rightPanel' defaultSize={30} collapsible={true} minSize={25} ref={rightPanel}> */}
                  {manageGroupChat ?
                    (
                      <div
                        className="col-12"
                        style={{ borderLeft: "1px solid var(--border-color)" }}
                      >
                        <div className="messageOverlay">
                          <div className="contactHeader" style={{ height: "71px" }}>
                            <div className="col">
                              <h4 className="my-0">
                                <input
                                  value={groupNameEdit}
                                  disabled={!saveEditToggleGroupNameChange}
                                  onChange={(e) =>
                                    setGroupNameEdit(e.target.value)
                                  }
                                  className="border-0 bg-transparent w-100"
                                  style={{ fontSize: "18px", fontWeight: 500 }}
                                />
                              </h4>
                            </div>
                            <div className="d-flex my-auto">
                              {!saveEditToggleGroupNameChange ? (
                                <button
                                  className="clearButton2 "
                                  onClick={() =>
                                    setSaveEditToggleGroupNameChange(true)
                                  }
                                >
                                  <i className="fa-regular fa-pen"></i>
                                </button>
                              ) : (
                                <button
                                  className="clearButton2 "
                                  onClick={() =>
                                    // setSaveEditToggleGroupNameChange(false)
                                    handleEditGroupName()
                                  }
                                >
                                  <i className="fa-regular fa-check"></i>
                                </button>
                              )}
                            </div>
                          </div>

                          <div
                            data-bell=""
                            className="contactListItem bg-transparent"
                            style={{ minHeight: "auto" }}
                          >
                            <div className="row justify-content-between">
                              <div
                                className="col-xl-12 d-flex"
                                onClick={() => {
                                  setAddMember(true);
                                  // setGroupChatPopUp(true);
                                }}
                              >
                                <div className="profileHolder">
                                  <i className="fa-light fa-plus fs-5" />
                                </div>
                                <div className="my-auto ms-2 ms-xl-3">
                                  <h4 style={{ color: "var(--ui-accent)" }}>
                                    Add Member
                                  </h4>
                                </div>
                              </div>
                            </div>
                          </div>
                          {addMember ? (
                            <div
                              className="addNewContactPopup px-0"
                              style={{
                                position: "static",
                                transform: "none",
                                width: "100%",
                                boxShadow: "none",
                                background: "transparent",
                              }}
                            >
                              <div className="row">
                                <div className="col-12 heading mb-0">
                                  <i className="fa-light fa-users" />
                                  <h5>Add Members</h5>
                                  {/* <p>
                                Add people to a group chat effortlessly,
                                keeping your connections organized and
                                efficient
                              </p> */}
                                  <div className="border-bottom col-12" />
                                </div>
                                <div className="col-xl-12 mt-2">
                                  {/* <div className="col-12 d-flex justify-content-between align-items-center"> */}
                                  {/* <div className="formRow px-0">
                                <div className="formLabel">
                                  <label htmlFor="">
                                    Group Name{" "}
                                    <span className="text-danger">*</span>
                                  </label>
                                </div>
                                <div className="col-xl-6 col-12">
                                  <input
                                    {...register("group_name", {
                                      ...requiredValidator,
                                    })}
                                    type="text"
                                    className="formItem"
                                  />
                                  {errors.group_name && (
                                    <ErrorMessage text={errors.group_name} />
                                  )}
                                </div>
                              </div> */}
                                  {/* </div> */}
                                </div>

                                <div className="col-xl-12 mt-2">
                                  <div className="col-12 d-flex justify-content-between align-items-center">
                                    <input
                                      type="text"
                                      className="formItem"
                                      placeholder="Search"
                                      name="name"
                                      value={searchQuery}
                                      onChange={handleSearchChange}
                                    />
                                    {/* <button
                                    className="tableButton ms-2"
                                    onClick={() => navigate("/users-add")}
                                  >
                                    <i className="fa-solid fa-user-plus"></i>
                                  </button> */}
                                  </div>
                                </div>
                                <div className="col-xl-12 mt-2">
                                  <div className="col-xl-12 mt-2">
                                    <div
                                      className="tableContainer mt-0"
                                      style={{
                                        maxHeight: "calc(100vh - 400px)",
                                      }}
                                    >
                                      <table>
                                        <thead>
                                          <tr>
                                            <th>S.No</th>
                                            <th>Name</th>
                                            <th>Extension</th>
                                            <th>
                                              <input
                                                type="checkbox"
                                                onChange={handleSelectAll} // Call handler on change
                                              // checked={selectAll ? true : false} // Keep checkbox state in sync
                                              />
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {allAgents
                                            .sort((a, b) => {
                                              const aMatches =
                                                a.name
                                                  .toLowerCase()
                                                  .includes(searchQuery.toLowerCase()) ||
                                                (a?.extension?.extension || "")
                                                  .toLowerCase()
                                                  .includes(searchQuery.toLowerCase());
                                              const bMatches =
                                                b.name
                                                  .toLowerCase()
                                                  .includes(searchQuery.toLowerCase()) ||
                                                (b?.extension?.extension || "")
                                                  .toLowerCase()
                                                  .includes(searchQuery.toLowerCase());
                                              // Items that match come first
                                              return bMatches - aMatches;
                                            })
                                            .filter(
                                              (user) =>
                                                !agent.some(
                                                  (agent) => user.id == agent.name
                                                ) &&
                                                !selectedgroupUsers.some(
                                                  (users) => users.user_id == user.id
                                                )
                                            ) // Exclude agents already in `agent`
                                            .map((item, index) => (
                                              <tr key={""}>
                                                <td>{index + 1}.</td>
                                                <td>{item.name}</td>
                                                <td>{item?.extension?.extension}</td>
                                                <td>
                                                  <input
                                                    type="checkbox"
                                                    onChange={() =>
                                                      handleCheckboxChange(item)
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
                                        setAddMember(false);
                                        setGroupChatPopUp(false);
                                      }}
                                    >
                                      <span className="text">Close</span>
                                      <span className="icon">
                                        <i className="fa-solid fa-caret-left" />
                                      </span>
                                    </button>
                                    <button
                                      className="panelButton me-0"
                                      // onClick={() => handleCreateGroup()}
                                      onClick={() => handleAddNewMemberToGroup()}
                                    >
                                      <span className="text">Add</span>
                                      <span className="icon">
                                        <i className="fa-solid fa-check" />
                                      </span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) :
                            (
                              <div style={{ height: 'calc(100vh - 275px)', overflow: 'hidden scroll' }}>
                                {
                                  allAgents
                                    .filter((item) => {
                                      return selectedgroupUsers.some(
                                        (agent) => agent.user_id === item.id
                                      );
                                    }).map((item) => {
                                      const matchingAgent = selectedgroupUsers.find(
                                        (agent) => agent.user_id === item.id
                                      );
                                      return {
                                        ...item, // Include all existing properties of the agent
                                        agentId: matchingAgent?.id, // Include the user_id from selectedgroupUsers
                                        is_admin: matchingAgent?.is_admin,
                                        userId: matchingAgent?.user_id,
                                        group_id: matchingAgent?.group_id,
                                      };
                                    }).map((item, index) => {
                                      return (
                                        <div
                                          data-bell=""
                                          className="contactListItem bg-transparent"
                                          style={{ minHeight: "auto" }}
                                        >
                                          <div className="row justify-content-between">
                                            <div className="col-xl-12 d-flex">
                                              <div className="profileHolder">
                                                {item?.profile_picture ?
                                                  <img
                                                    src={item?.profile_picture}
                                                    alt="profile"
                                                    onError={(e) => e.target.src = require('../../assets/images/placeholder-image.webp')}
                                                  /> :
                                                  <i className="fa-light fa-user" />}
                                              </div>
                                              <div className="my-auto ms-2 ms-xl-3">
                                                <h4>{item.name}</h4>
                                              </div>
                                              {(item.email !== account.email) && isAdmin ? <div className="col text-end my-auto">
                                                <div className="dropdown">
                                                  <button
                                                    className="clearButton2"
                                                    type="button"
                                                    data-bs-toggle="dropdown"
                                                    aria-expanded="true"
                                                  >
                                                    <i className="fa-solid fa-ellipsis-vertical" />
                                                  </button>
                                                  <ul
                                                    className="dropdown-menu light"
                                                  >
                                                    {
                                                      item.is_admin ?
                                                        <li>
                                                          <div className="dropdown-item" onClick={() => manageAdmin(item.agentId, item.group_id, item.userId, !item.is_admin)}>
                                                            Dismiss Group Admin
                                                          </div>
                                                        </li>
                                                        :
                                                        <li>
                                                          <div className="dropdown-item" onClick={() => manageAdmin(item.agentId, item.group_id, item.userId, !item.is_admin)}>
                                                            Make Group Admin
                                                          </div>
                                                        </li>}
                                                    <li>
                                                      <div className="dropdown-item text-danger"
                                                        onClick={() =>
                                                          handleremoveUserFromGroup(
                                                            item.agentId
                                                          )
                                                        }>
                                                        Kick User
                                                      </div>
                                                    </li>
                                                  </ul>
                                                </div>
                                              </div> : ""}

                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })
                                }
                              </div>
                            )
                          }
                          {!addMember && <div className="mb-auto px-2">
                            <button
                              className="panelButton gray ms-0"
                              onClick={() => {
                                setManageGroupChat(false);
                              }}
                            >
                              <span className="text">Close</span>
                              <span className="icon">
                                <i className="fa-solid fa-caret-left" />
                              </span>
                            </button>
                          </div>}
                        </div>
                      </div>
                    ) : (
                      <div
                        className=" h-100" style={{ width: isActiveAgentsOpen ? '30%' : '0%', transition: 'all 0.4s ease-in-out' }}
                      // style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
                      >
                        <div className="callDashParkedCalls messageDower pe-0"
                          style={{ transform: isActiveAgentsOpen ? 'translate(3%, 0%)' : 'translate(100%, 0%)' }}
                        >
                          <button onClick={() => setIsActiveAgentsOpen(!isActiveAgentsOpen)} className="callDashParkedCallsBtn" style={{ left: isActiveAgentsOpen ? '-15px' : '7px', transition: 'all 0.4s ease-in-out', }}>
                            <i className={`fa-solid fa-chevron-${isActiveAgentsOpen ? "right" : "left"}`} />
                          </button>
                          <div
                            className=" h-100"
                          // style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
                          >
                            {/* this section is for profile details ************ */}
                            <MessageProfileDetails
                              recipient={recipient}
                              messages={recipient[2] === "groupChat" ? allMessage?.[recipient[3]] : allMessage?.[recipient[1]]}
                              selectedChat={selectedChat}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  }
                  </Panel>
                  </PanelGroup>
                </div>
              </div>
            </div>
          </div>
          {groupLeavePopUp ? (
            <div className="popup">
              <div className="container h-100">
                <div className="row h-100 justify-content-center align-items-center">
                  <div className="row content col-xl-4">
                    <div className="col-2 px-0">
                      <div className="iconWrapper">
                        <i className="fa-duotone fa-triangle-exclamation"></i>
                      </div>
                    </div>
                    <div className="col-10 ps-0">
                      <h4>Warning!</h4>
                      <p>
                        Are you sure you want to leave from this group?
                      </p>
                      <div className="mt-2 d-flex justify-content-between">
                        <button
                          disabled={loading}
                          className="panelButton m-0"
                          onClick={() => {
                            handleremoveUserFromGroup(groupLeaveId)
                            setGroupLeavePopUp(false);
                            setRecipient([])
                            setGroupRefresh(groupRefresh + 1)
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
                            setGroupLeaveId("")
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
        {
          fileUpload && <FileUpload type={fileType} setFileUpload={setFileUpload} setSelectedUrl={setSelectedUrl} setSelectedFile={setSelectedFile} selectedFile={selectedFile} sendSingleMessage={sendSingleMessage} sendGroupMessage={sendGroupMessage} recipient={recipient} setAllMessage={setAllMessage} allMessage={allMessage}
            extension={extension} formatDateTime={formatDateTime}
          />
        }
      </main>
    </>
  );
}

export default Messages;
