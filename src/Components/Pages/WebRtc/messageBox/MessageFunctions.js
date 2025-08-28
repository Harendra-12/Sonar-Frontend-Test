import { toast } from "react-toastify";
import {
  formatDateTime,
  generalDeleteFunction,
  generalGetFunction,
  generalPostFunction,
  generalPutFunction,
} from "../../../GlobalFunction/globalFunction";
import { api_url } from "../../../../urls";

// general stuff ====== start here

export const getContactAndAllTagData = async (
  shouldLoad,
  setLoading,
  checkMessageType,
  setContact,
  setOriginalContact,
  setMessageRefresh,
  setAllTags
) => {
  if (shouldLoad) setLoading(true);
  const apiData = await generalGetFunction(api_url?.MESSAGE_CONTACT_LIST_URL);
  const tagData = await generalGetFunction(api_url?.ALL_TAG_URL);

  if (apiData?.status && apiData.data.length > 0) {
    const filteredData = apiData?.data?.sort(
      (a, b) =>
        new Date(b?.last_message_data?.created_at) -
        new Date(a?.last_message_data?.created_at)
    );
    const updatedFilteredData = filteredData?.map((data) => ({
      ...data,
      last_message_data: {
        ...data?.last_message_data,
        message_text:
          checkMessageType(data?.last_message_data?.message_text) ===
          "text/plain"
            ? data?.last_message_data?.message_text
            : checkMessageType(data?.last_message_data?.message_text),
      },
    }));

    setContact(updatedFilteredData);
    setOriginalContact(updatedFilteredData);
    // ENABLE THIS TO SELECT CHAT ON PAGE LOAD
    // if (!extensionFromCdrMessage) {
    //   const profile_img = allAgents?.find(
    //     (data) => data?.id == apiData?.data[0]?.id
    //   )?.profile_picture;
    //   if (!isAssignmentClicked)
    //     setRecipient([
    //       apiData.data[0].extension,
    //       apiData.data[0].id,
    //       "singleChat",
    //       apiData?.data[0]?.name,
    //       apiData?.data[0]?.email,
    //       profile_img,
    //     ]);
    //   setSelectedChat("singleChat");
    // }
    setLoading(false);
    setMessageRefresh(false);
  }
  if (tagData?.status) {
    setAllTags(tagData.data);
    setLoading(false);
    setMessageRefresh(false);
  }
  setLoading(false);
  setMessageRefresh(false);
};

export const getAllMessageApiFun = async (
  pageNumb,
  recipient,
  messageListRef,
  scrollPositionRef,
  allAgents,
  setAllMessage,
  chatHistory,
  setChatHistory,
  setPageLoader
) => {
  const apiData = await generalGetFunction(
    recipient?.[2] === "singleChat"
      ? api_url?.RECEIVE_ALL_MESSAGE_URL(recipient[1], pageNumb)
      : api_url?.RECEIVE_ALL_GROUP_MESSAGE_URL(recipient[1], pageNumb)
  );

  if (messageListRef.current) {
    scrollPositionRef.current = {
      scrollTop: messageListRef.current.scrollTop,
      scrollHeight: messageListRef.current.scrollHeight,
    };
  }
  setPageLoader(false);
  apiData?.data?.data?.map((item) => {
    const key =
      recipient?.[2] === "singleChat" ? recipient?.[1] : recipient?.[0];

    const formattedMessages = apiData?.data?.data.map((item) => {
      const user_details = allAgents?.find(
        (agent) => agent?.id == item?.user_id
      );
      return {
        ...item,
        from: item.user_id,
        body: item?.message_text,
        time: formatDateTime(item.created_at),
        user_id: item.user_id,
        user_name: user_details?.username,
        profile_picture: user_details?.profile_picture,
        message_type: item.message_type,
      };
    });

    const sortedMessages = formattedMessages.sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );

    setAllMessage((prevState) => {
      if (pageNumb === 1) {
        return {
          ...prevState,
          [key]: sortedMessages,
        };
      } else {
        const existing = prevState[key] || [];
        const existingIds = new Set(existing.map((msg) => msg.id));
        const uniqueNewMessages = sortedMessages.filter(
          (msg) => !existingIds.has(msg.id)
        );

        return {
          ...prevState,
          [key]: [...uniqueNewMessages, ...existing],
        };
      }
    });

    // setAllMessage((prevState) => ({
    //     ...prevState,
    //     [recipient?.[2] == "singleChat" ? recipient?.[1] : recipient?.[0]]: [
    //         {
    //             ...item,
    //             from: item.user_id,
    //             body: item?.message_text,
    //             time: formatDateTime(item.created_at),
    //             user_id: item.user_id,
    //             user_name: user_details?.username,
    //             profile_picture: user_details?.profile_picture,
    //             message_type: item.message_type,
    //         },
    //         ...(prevState[
    //             recipient?.[2] == "singleChat" ? recipient?.[1] : recipient?.[0]
    //         ] || []),
    //     ],
    // }));
  });
  if (apiData?.status) {
    const newChatHistory = { ...chatHistory };
    newChatHistory[recipient?.[0]] = {
      total: apiData.data.total,
      pageNumber: apiData.data.current_page,
      last_page_number: apiData?.data?.last_page_url?.split("page=")?.pop(),
    };
    setChatHistory(newChatHistory);
  }
};

const getExtension = (input = "") => {
  var parts = input?.split(".");
  return parts[parts?.length - 1]?.toLowerCase();
};

// Logic to send message
export const checkMessageType = (message) => {
  const isHasExtension = getExtension(message);
  if (isHasExtension == "jpg") {
    return "image";
  } else if (isHasExtension == "gif") {
    return "image";
  } else if (isHasExtension == "bmp") {
    return "image";
  } else if (isHasExtension == "png") {
    return "image";
  } else if (isHasExtension == "jpeg") {
    return "image";
  } else if (isHasExtension == "svg") {
    return "image";
  } else if (isHasExtension == "tiff") {
    return "image";
  } else if (isHasExtension == "webp") {
    return "image";
  } else if (isHasExtension == "mp3") {
    return "audio";
  } else if (isHasExtension == "mp4") {
    return "video";
  } else if (isHasExtension == "mov") {
    return "video";
  } else if (isHasExtension == "avi") {
    return "video";
  } else if (isHasExtension == "mkv") {
    return "video";
  } else if (isHasExtension == "WMV") {
    return "video";
  } else if (isHasExtension == "flv") {
    return "video";
  } else if (isHasExtension == "pdf") {
    return "file";
  } else if (isHasExtension == "txt") {
    return "file";
  } else if (isHasExtension == "rtf") {
    return "file";
  } else if (isHasExtension == "odt") {
    return "file";
  } else if (isHasExtension == "doc") {
    return "file";
  } else if (isHasExtension == "docx") {
    return "file";
  } else if (isHasExtension == "xls") {
    return "file";
  } else if (isHasExtension == "xlsx") {
    return "file";
  } else if (isHasExtension == "csv") {
    return "file";
  } else if (isHasExtension == "ppt") {
    return "file";
  } else if (isHasExtension == "pptx") {
  } else {
    return "text/plain";
  }
};

export const getAllUser = async (setAllAgents) => {
  const apiData = await generalGetFunction(api_url?.ALL_USER_URL);
  if (apiData?.status) {
    // setUser(apiData.data.filter((item) => item.extension_id !== null));
    setAllAgents(apiData?.data);
    // setGroupSelecedAgents((prevSelected) => {
    //   return [...apiData.data.filter((item) => item.email === account.email)];
    // }
    // )
  }
};

// Handle calling
// export const onSubmit = async (mode, destNumber) => {
//     if (!isMicOn) {
//         toast.warn("Please turn on microphone");
//         return;
//     }
//     if (mode === "video") {
//         if (!isVideoOn) {
//             toast.warn("Please turn on camera");
//             return;
//         }
//     }

//     if (extension == "") {
//         toast.error("No extension assigned to your account");
//         return;
//     }
//     if (destNumber == extension) {
//         toast.error("You cannot call yourself");
//         return;
//     }

//     if (connectStatus !== "CONNECTED") {
//         toast.error("You are not connected with server");
//         return;
//     }

//     if (destNumber.length > 3) {
//         dispatch({
//             type: "SET_MINIMIZE",
//             minimize: false,
//         });
//         // e.preventDefault();
//         const apiData = await sessionManager?.call(
//             `sip:${destNumber}@${account.domain.domain_name}`,
//             {
//                 earlyMedia: true,
//                 inviteWithSdp: true,
//                 sessionDescriptionHandlerOptions: {
//                     constraints: {
//                         audio: true,
//                         video: mode === "video" ? true : false,
//                     },
//                 },
//             },
//             {
//                 media: {
//                     audio: true,
//                     video:
//                         mode === "audio"
//                             ? true
//                             : {
//                                 mandatory: {
//                                     minWidth: 1280,
//                                     minHeight: 720,
//                                     minFrameRate: 30,
//                                 },
//                                 optional: [{ facingMode: "user" }],
//                             },
//                 },
//             }
//         );

//         const sdh = apiData.sessionDescriptionHandler;

//         // Check if remoteMediaStream is available
//         if (sdh && sdh._remoteMediaStream) {
//             const remoteStream = sdh._remoteMediaStream;

//             // Listen for tracks being added to the remote stream
//             remoteStream.onaddtrack = () => {
//                 playRemoteStream(remoteStream);
//             };

//             // If tracks are already present, attach immediately
//             if (remoteStream.getTracks().length > 0) {
//                 playRemoteStream(remoteStream);
//             }
//         }

//         // Function to play the remote stream
//         function playRemoteStream(stream) {
//             const audioElement = document.createElement("audio");
//             audioElement.srcObject = stream;
//             audioElement.autoplay = true;

//             audioElement.play().catch((e) => {
//                 console.error("Error playing early media stream:", e);
//             });
//         }

//         setSelectedModule("onGoingCall");
//         dispatch({
//             type: "SET_SESSIONS",
//             sessions: [
//                 ...globalSession,
//                 {
//                     id: apiData._id,
//                     destination: destNumber,
//                     state: "Established",
//                     mode: mode,
//                 },
//             ],
//         });
//         dispatch({
//             type: "SET_VIDEOCALL",
//             videoCall: mode === "video" ? true : false,
//         });
//         dispatch({
//             type: "SET_CALLPROGRESSID",
//             callProgressId: apiData._id,
//         });
//         dispatch({
//             type: "SET_CALLPROGRESSDESTINATION",
//             callProgressDestination: destNumber,
//         });
//         dispatch({
//             type: "SET_CALLPROGRESS",
//             callProgress: mode === "video" ? false : true,
//         });
//     } else {
//         toast.error("Please enter a valid number");
//     }
// }

export const getGroups = async (
  setLoading,
  setGroups,
  setGroupList,
  setOriginalGroupsList,
  recipient,
  setRecipient,
  allAgents,
  setSelectedChat,
  setGroupNameEdit,
  setSelectedgroupUsers,
  account,
  setIsAdmin
) => {
  setLoading(true);

  const apiData = await generalGetFunction(api_url?.ALL_GROUP_CHAT_URL);
  if (apiData?.status) {
    const filteredData = apiData?.data?.sort((a, b) => {
      const dateA = a?.last_message_data?.created_at
        ? new Date(a.last_message_data.created_at)
        : null;
      const dateB = b?.last_message_data?.created_at
        ? new Date(b.last_message_data.created_at)
        : null;
      if (!a.last_message_data || !dateA) return 1;
      if (!b.last_message_data || !dateB) return -1;

      return dateB - dateA;
    });
    const updatedFilteredData = filteredData?.map((data) => ({
      ...data,
      last_message_data: {
        ...data?.last_message_data,
        message_text:
          checkMessageType(data?.last_message_data?.message_text) ===
          "text/plain"
            ? data?.last_message_data?.message_text
            : checkMessageType(data?.last_message_data?.message_text),
      },
    }));
    setGroups(updatedFilteredData);
    setGroupList(
      apiData?.data?.reverse()?.map((data) => ({
        ...data,
        last_message_data: {
          ...data?.last_message_data,
          message_text:
            checkMessageType(data?.last_message_data?.message_text) ===
            "text/plain"
              ? data?.last_message_data?.message_text
              : checkMessageType(data?.last_message_data?.message_text),
        },
      }))
    );
    setOriginalGroupsList(updatedFilteredData);
    const isGroupSelected = apiData.data.find(
      (group) => group.id == recipient?.[1]
    );
    if (isGroupSelected) {
      const profile_img = allAgents?.find(
        (data) => data?.id == isGroupSelected?.id
      )?.profile_picture;
      setRecipient([
        isGroupSelected.group_name,
        isGroupSelected.id,
        "groupChat",
        isGroupSelected?.group_name,
        isGroupSelected?.email,
        profile_img,
      ]);
      setSelectedChat("groupChat");
      setGroupNameEdit(isGroupSelected.group_name);
      setSelectedgroupUsers(isGroupSelected.message_groupusers);
      isGroupSelected.message_groupusers.map((user) => {
        if (user?.user_id === account?.id) {
          setIsAdmin(user.is_admin == 1 ? true : false);
        }
      });
    }
    setLoading(false);
  } else {
    setLoading(false);
  }
};

//  function to extract extension
export const extractFileExtension = (selectedUrl) => {
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
        if (lowerValue.includes("jpg") || lowerValue.includes("jpeg"))
          return "jpg";
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

export const handleSearchChange = (event, setSearchQuery) => {
  setSearchQuery(event.target.value);
};

export const handleMessageSearchChange = (
  event,
  setSearchValueForMessage,
  originalContact,
  setOnlineUser,
  setGroups,
  setInternalCallHistory,
  activeTab,
  setContact,
  origInalinternalCallHistory,
  originalOnlineUser,
  originalGroupsList
) => {
  setSearchValueForMessage(event?.target?.value);
  if (activeTab == "all") {
    const filteredContact = originalContact?.filter((item) =>
      item?.name?.toLowerCase().includes(event?.target?.value?.toLowerCase())
    );
    setContact(filteredContact);
  }

  if (activeTab == "online") {
    const filteredOnlineUser = originalOnlineUser?.filter((item) =>
      item?.name?.toLowerCase()?.includes(event?.target?.value)
    );
    setOnlineUser(filteredOnlineUser);
  }

  if (activeTab === "group") {
    const filteredGroup = originalGroupsList?.filter((item) =>
      item?.group_name
        ?.toLowerCase()
        ?.includes(event?.target?.value?.toLowerCase())
    );
    setGroups(filteredGroup);
  }

  if (activeTab === "call") {
    const filteredCallHistory = origInalinternalCallHistory?.filter(
      (item) =>
        item?.receiver?.name?.toLowerCase()?.includes(event?.target?.value) ||
        item?.sender?.name?.toLowerCase()?.includes(event?.target?.value)
    );
    setInternalCallHistory(filteredCallHistory);
  }
};

export const handlePinMessage = async (
  item,
  setAllMessage,
  allMessage,
  recipient,
  selectedChat
) => {
  const conversationKey = recipient[0];
  const isCurrentlyPinned = item?.is_pinned === 1;
  const result = await generalPostFunction(
    selectedChat === "singleChat"
      ? api_url?.PIN_MESSAGE(item?.id, isCurrentlyPinned ? true : "")
      : api_url?.PIN_GROUP_MESSAGE(item?.id, isCurrentlyPinned ? true : "")
  );

  if (result?.status) {
    toast?.success(result?.message);

    const updatedAllMessage = allMessage[conversationKey]?.map((msg) => {
      if (
        msg.id ===
        (selectedChat == "singleChat"
          ? result?.data?.id
          : result?.data?.group_message_id)
      ) {
        return { ...msg, is_pinned: result?.data?.is_pinned ? 1 : 0 };
      } else {
        return !isCurrentlyPinned ? { ...msg, is_pinned: 0 } : msg;
      }
    });

    setAllMessage((prev) => ({
      ...prev,
      [conversationKey]: updatedAllMessage,
    }));
  }
};

export const handleUpdateMessage = async (
  item,
  setAllMessage,
  allMessage,
  recipient,
  selectedChat,
  editedValue
) => {
  const conversationKey = recipient[0];
  const result = await generalPutFunction(
    selectedChat === "singleChat"
      ? api_url?.SINGLE_MESSAGE_UPDATE_URL(item?.id)
      : api_url?.GROUP_MESSAGE_UPDATE_URL(item?.id),
    { message_type: item?.message_type, message_text: editedValue }
  );
  if (result?.status) {
    toast?.success(result?.message);
    const updatedAllMessage = allMessage[conversationKey]?.map((msg) => {
      if (msg.id === result?.data?.id) {
        return {
          ...msg,
          message_text: result?.data?.message_text,
          body: result?.data?.message_text,
          updated_at: result?.data?.updated_at,
        };
      } else {
        return { ...msg };
      }
    });

    setAllMessage((prev) => ({
      ...prev,
      [conversationKey]: updatedAllMessage,
    }));
  }
};

export const handleDeleteMessage = async (
  item,
  setAllMessage,
  allMessage,
  recipient,
  selectedChat
) => {
  const conversationKey = recipient[0];
  const result = await generalDeleteFunction(
    selectedChat === "singleChat"
      ? api_url?.SINGLE_MESSAGE_DELETE_URL(item?.id)
      : api_url?.GROUP_MESSAGE_DELETE_URL(item?.id)
  );

  if (result?.status) {
    toast?.success(result?.message);
    const updatedAllMessage = allMessage[conversationKey]?.map((msg) => {
      if (msg.id === item?.id) {
        return {
          ...msg,
          deleted_at: formatDateTime(new Date()),
          is_pinned: item?.is_pinned == 1 && 0,
        };
      } else {
        return { ...msg };
      }
    });

    setAllMessage((prev) => ({
      ...prev,
      [conversationKey]: updatedAllMessage,
    }));
  }
};

export const getAllInternalCallsHistory = async (
  setLoading,
  internalCallsPageNumber,
  setInternalCallHistory,
  setRawInternalCallHistory,
  setOriginalInternalCallHistory,
  setDoomScrollLoading
) => {
  setLoading(true);
  try {
    const response = await generalGetFunction(
      api_url?.CHAT_CALLS_HISTORY_WITH_GROUP_AND_SINGLE_URL(
        internalCallsPageNumber
      )
    );
    if (response.status) {
      const sortedArr = response.data.data;

      // setInternalCallHistory(sortedArr);

      setOriginalInternalCallHistory((prev) => {
        const existingIds = new Set(prev.map((item) => item.id));

        const newItems = sortedArr?.filter((item) => !existingIds.has(item.id));

        return [...prev, ...newItems];
      });

      setInternalCallHistory((prev) => {
        const existingIds = new Set(prev.map((item) => item.id));

        const newItems = sortedArr?.filter((item) => !existingIds.has(item.id));

        return [...prev, ...newItems];
      });

      setRawInternalCallHistory(response.data);
    }
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
    setDoomScrollLoading(false);
  }
};

// Handle logic to make any user admin or remove any user from admin
export const manageAdmin = async (
  groupId,
  userId,
  isAdmin,
  setLoading,
  setGroupRefresh,
  groupRefresh
) => {
  setLoading(true);
  const parsedData = {
    group_id: groupId,
    user_id: userId,
    is_admin: isAdmin ? 1 : 0,
  };
  const apiData = await generalPutFunction(
    api_url?.SET_ADMIN_URL(groupId),
    parsedData
  );
  if (apiData.status) {
    setLoading(false);
    toast.success(apiData.message);
    setGroupRefresh(groupRefresh + 1);
  } else {
    setLoading(false);
    toast.error(apiData.message);
  }
};
// general stuff ===== end here

// typing stuff ==== start here
export const handleTypingEvent = (
  socketSendMessage,
  account,
  recipient,
  isTyping
) => {
  socketSendMessage({
    action:
      recipient[2] === "singleChat" ? "typing_status" : "group_typing_status",
    user_id: account?.id,
    is_typing: isTyping,
    ...(recipient[2] === "singleChat"
      ? { to_user_id: recipient?.[1] }
      : { group_id: recipient?.[1] }),
  });
};
// typing stuff ==== end here

// tag stuff ===== start here

export const handleCreateNewTag = async (
  setLoading,
  tagFilterInput,
  setAddNewTag,
  setNewTag,
  setAllTags,
  allTags
) => {
  setLoading(true);
  const parsedData = {
    name: tagFilterInput,
  };
  const apiData = await generalPostFunction(api_url?.STORE_TAG_URL, parsedData);
  if (apiData.status) {
    setLoading(false);
    toast.success("Tag added successfully");
    setAddNewTag(false);
    setNewTag("");
    setAllTags([...allTags, apiData.data]);
  } else {
    setLoading(false);
    toast.error(apiData?.errors?.name[0]);
  }
};

// Add new Tag
export const handleNewTag = async (
  newTag,
  setAddNewTag,
  setNewTag,
  setAllTags,
  allTags,
  setLoading
) => {
  if (newTag.length === 0) {
    toast.error("Please enter a valid tag name");
  } else {
    setLoading(true);
    const parsedData = {
      name: newTag,
    };

    const apiData = await generalPostFunction(
      api_url?.STORE_TAG_URL,
      parsedData
    );
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
};

// Update tag
export const handleUpdateTag = async (
  upDateTag,
  setLoading,
  selectedTag,
  allTags,
  setAllTags,
  setUpDateTag,
  setSelectedTag
) => {
  if (upDateTag.length === 0) {
    toast.error("Please enter a valid tag name");
  } else {
    setLoading(true);
    const parsedData = {
      name: upDateTag,
    };
    const apiData = await generalPutFunction(
      api_url?.UPDATE_TAG_URL(selectedTag),
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
};

// Handle assign tags
export const handleAssignTag = async (
  tagId,
  userId,
  setContactRefresh,
  contactRefresh,
  setLoading,
  setContact,
  setOriginalContact,
  setMessageRefresh,
  setAllTags
) => {
  setLoading(true);
  const parsedData = {
    tag_id: tagId,
    user_id: userId,
  };
  const apiData = await generalPostFunction(
    api_url?.ASSIGN_TAGS_TO_USER_URL,
    parsedData
  );
  if (apiData.status) {
    setContactRefresh(contactRefresh + 1);
    const shouldLoad = true;
    getContactAndAllTagData(
      shouldLoad,
      setLoading,
      checkMessageType,
      setContact,
      setOriginalContact,
      setMessageRefresh,
      setAllTags
    );
    toast.success("Tag assigned successfully");
  } else {
    setLoading(false);
  }
};

// Handle unassign task
export const handleUnassignTag = async (
  tagId,
  setLoading,
  setContactRefresh,
  contactRefresh,
  setContact,
  setOriginalContact,
  setMessageRefresh,
  setAllTags
) => {
  setLoading(true);
  const apiData = await generalDeleteFunction(
    api_url?.REMOVE_TAGS_FROM_USER_URL(tagId)
  );
  if (apiData.status) {
    setContactRefresh(contactRefresh + 1);
    const shouldLoad = true;
    getContactAndAllTagData(
      shouldLoad,
      setLoading,
      checkMessageType,
      setContact,
      setOriginalContact,
      setMessageRefresh,
      setAllTags
    );
    // setLoading(false);
    toast.success("Tag unassigned successfully");
    // setIsAssignmentClicked(true);
  } else {
    setLoading(false);
  }
};

// Delete tag
export const handleDeleteTag = async (
  id,
  setLoading,
  setSelectedTag,
  allTags,
  setAllTags
) => {
  setLoading(true);
  const apiData = await generalDeleteFunction(api_url?.DELETE_TAG_URL(id));
  if (apiData.status) {
    setLoading(false);
    toast.success("Tag deleted successfully");
    setSelectedTag("");
    const updatedTags = allTags.filter((tag) => tag.id !== id);
    setAllTags(updatedTags);
  } else {
    setLoading(false);
  }
};

// tag stuff ====== end here

// group stuff ====== start here

export async function handleCreateGroup(
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
  setGroupName
) {
  if (groupname === "") {
    toast.error("Group name is required");
    return;
  }
  setNewGroupLoader(true);
  const parsedData = {
    group_name: groupname,
    user_id: [...groupSelecedAgents.map((agent) => agent.id), account.id],
  };
  const apiData = await generalPostFunction(
    api_url?.CREATE_GROUP_URL,
    parsedData
  );
  if (apiData.status) {
    setGroupRefresh(groupRefresh + 1);
    toast.success("Group created successfully");
    setAddMember(false);
    setGroupChatPopUp(false);
    setGroupSelecedAgents([]);
    setGroupName("");
    setNewGroupLoader(false);
    setLoading(false);
  } else {
    setNewGroupLoader(false);
    setLoading(false);
  }
}

export const receiveGroupMessage = (
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
) => {
  const isNewMessage = !allNotificationState?.some(
    (data) => data?.uuid === groupMessage?.uuid
  );
  if (isNewMessage) {
    if (groupMessage) {
      const audio = new Audio(
        require("../../../assets/music/message-notification.mp3")
      );
      const from = groupMessage?.user_id;
      const body = groupMessage?.message_text;
      const time = formatDateTime(new Date());
      setAllMessage((prevState) => ({
        ...prevState,
        [groupMessage.group_name]: [
          ...(prevState[groupMessage.group_name] || []),
          {
            from,
            body,
            time,
            user_id: from,
            user_name: groupMessage?.user_name,
            profile_picture: groupMessage?.profile_picture,
            message_type: groupMessage.message_type,
          },
        ],
      }));
      if (groupMessage?.group_name != undefined) {
        const contactIndex = groups.findIndex(
          (contact) => contact?.group_name === groupMessage?.group_name
        );
        if (contactIndex !== -1) {
          const newGroups = [...groups];
          newGroups[contactIndex].last_message_data.message_text = body;
          newGroups[contactIndex].last_message_data.created_at = time;
          newGroups[contactIndex].last_message_data.user_id = from;
          newGroups?.splice(contactIndex, 1);
          newGroups.unshift(groups[contactIndex]);
          setGroups(newGroups);
          setOriginalGroupsList(newGroups);
        }
        setActiveTab("all");
        setUnreadMessage((prevState) => ({
          ...prevState,
          [groupMessage?.group_name]:
            (prevState[groupMessage?.group_name] || 0) + 1,
        }));
        audio.play();
      }
    }

    if (recipient?.length > 0) {
      setUnreadMessage((prevState) => {
        const {
          [recipient?.[2] == "singleChat" ? recipient?.[1] : recipient?.[0]]: _,
          ...newState
        } = prevState;
        return newState;
      });
      dispatch({
        type: ActionType?.REMOVE_NOTIFICATION_FOR_MESSAGE,
        recipient: [...recipient],
      });
    }
  } else {
    const unreadMap = {};
    allNotificationState?.forEach((data) => {
      if (data?.group_name) {
        unreadMap[data.group_name] = (unreadMap[data.group_name] || 0) + 1;
      }
    });
    setUnreadMessage((prev) => ({
      ...prev,
      ...unreadMap,
    }));
  }
};

export const handleEditGroupName = async (
  groupNameEdit,
  setNewGroupLoader,
  recipient,
  setGroupRefresh,
  groupRefresh,
  setSaveEditToggleGroupNameChange
) => {
  if (groupNameEdit.trim() === "") {
    toast.error("Group name cannot be empty");
    return;
  }
  const parsedData = {
    group_name: groupNameEdit,
    // members: groupSelecedAgents.map((agent) => {
    //   return { user_id: agent.id, status: agent.status };
    // }),
  };
  setNewGroupLoader(true);
  const apiData = await generalPutFunction(
    api_url?.UPDATE_GROUP_URL(recipient?.[1]),
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

export const handleAddNewMemberToGroup = async (
  recipient,
  groupSelecedAgents,
  setNewGroupLoader,
  groupRefresh,
  setGroupRefresh,
  setGroupChatPopUp,
  setAddMember,
  setGroupSelecedAgents
) => {
  // const payload = groupSelecedAgents.map((agent) => agent.id);
  const payLoad = {
    message_group_id: recipient?.[1],
    user_id: groupSelecedAgents.map((agent) => agent.id),
  };
  setNewGroupLoader(true);
  const apiData = await generalPostFunction(
    api_url?.ADD_NEW_MEMBER_TO_GROUP_URL,
    payLoad
  );
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

export const handleremoveUserFromGroup = async (
  id,
  setNewGroupLoader,
  setSelectedgroupUsers,
  selectedgroupUsers,
  account
) => {
  setNewGroupLoader(true);
  const apiData = await generalGetFunction(
    api_url?.REMOVE_USER_FROM_GROUP_URL(id, account?.id)
  );
  
  if (apiData?.status) {
    toast.success(apiData?.message);
    setSelectedgroupUsers(selectedgroupUsers?.filter((item) => item.id !== id));
    setNewGroupLoader(false);
  } else {
    setNewGroupLoader(false);
  }
};

export const handleCheckboxChange = (item, setGroupSelecedAgents) => {
  setGroupSelecedAgents((prevSelected) => {
    const alreadySelected = prevSelected?.some(
      (agent) => agent?.id === item?.id
    );
    if (alreadySelected) {
      return prevSelected.filter((agent) => agent?.id !== item?.id);
    } else {
      return [...prevSelected, item];
    }
  });
};

export const handleGroupSearchChange = (
  event,
  setGroups,
  setSearchValueForGroup,
  originalGroupsList
) => {
  setSearchValueForGroup(event?.target?.value);
  const filteredGroup = originalGroupsList?.filter((item) =>
    item?.group_name
      ?.toLowerCase()
      ?.includes(event?.target?.value?.toLowerCase())
  );
  setGroups(filteredGroup);
};

export const handleSelectAll = (
  selectAll,
  setSelectAll,
  availableUsers,
  groupSelecedAgents,
  setGroupSelecedAgents
) => {
  const newSelectAllState = !selectAll; // Toggle Select All state
  setSelectAll(newSelectAllState);

  if (newSelectAllState) {
    // Add all visible users to bulkUploadSelectedAgents
    availableUsers.forEach((item) => {
      if (!groupSelecedAgents.some((agent) => agent.name == item.name)) {
        handleCheckboxChange(item, setGroupSelecedAgents);
      }
    });
  } else {
    // Remove all visible users from bulkUploadSelectedAgents
    availableUsers.forEach((item) => {
      if (groupSelecedAgents.some((agent) => agent.name == item.name)) {
        handleCheckboxChange(item, setGroupSelecedAgents);
      }
    });
  }
};

// Handle delete group
export const handleDeleteGroup = async (
  id,
  setGroupRefresh,
  setSelectedChat,
  setRecipient,
  setLoading,
  groupRefresh
) => {
  setLoading(true);
  const apiData = await generalDeleteFunction(api_url?.DELETE_GROUP_URL(id));
  if (apiData.status) {
    toast.success(apiData.message);
    setGroupRefresh(groupRefresh + 1);
    setSelectedChat("");
    setRecipient([]);
    setLoading(false);
  } else {
    setLoading(false);
    toast.error(apiData.message);
  }
};

// group stuff ===== end here
