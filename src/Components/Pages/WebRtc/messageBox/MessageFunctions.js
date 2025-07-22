import { toast } from "react-toastify";
import { formatDateTime, generalDeleteFunction, generalGetFunction, generalPostFunction, generalPutFunction } from "../../../GlobalFunction/globalFunction";


export const getContactAndAllTagData = async (shouldLoad, setLoading, checkMessageType, setContact, setOriginalContact, setMessageRefresh, setAllTags) => {
    if (shouldLoad) setLoading(true);
    const apiData = await generalGetFunction(`/message/contacts`);
    const tagData = await generalGetFunction("/tags/all");

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

export const getAllMessageApiFun = async (pageNumb, recipient, messageListRef, scrollPositionRef, allAgents, setAllMessage, chatHistory, setChatHistory) => {
    const apiData = await generalGetFunction(
        recipient?.[2] === "singleChat"
            ? `/message/all?receiver_id=${recipient?.[1]}&page=${pageNumb}`
            : `/group-message/all?group_id=${recipient?.[1]}&page=${pageNumb}`
    );

    if (messageListRef.current) {
        scrollPositionRef.current = {
            scrollTop: messageListRef.current.scrollTop,
            scrollHeight: messageListRef.current.scrollHeight,
        };
    }
    apiData?.data?.data?.map((item) => {
        const user_details = allAgents?.find(
            (data) => data?.id == item?.user_id
        );

        setAllMessage((prevState) => ({
            ...prevState,
            [recipient?.[2] == "singleChat" ? recipient?.[1] : recipient?.[0]]: [
                {
                    ...item,
                    from: item.user_id,
                    body: item?.message_text,
                    time: formatDateTime(item.created_at),
                    user_id: item.user_id,
                    user_name: user_details?.username,
                    profile_picture: user_details?.profile_picture,
                    message_type: item.message_type,
                },
                ...(prevState[
                    recipient?.[2] == "singleChat" ? recipient?.[1] : recipient?.[0]
                ] || []),
            ],
        }));
    });
    if (apiData?.status) {
        const newChatHistory = { ...chatHistory };
        newChatHistory[recipient?.[0]] = {
            total: apiData.data.total,
            pageNumber: apiData.data.current_page,
            last_page_number: apiData?.data?.last_page_url?.split("page=")?.pop()
        };
        setChatHistory(newChatHistory);
    }
}

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
        return "image"
    } else if (isHasExtension == "svg") {
        return "image"
    } else if (isHasExtension == "tiff") {
        return "image"
    } else if (isHasExtension == "webp") {
        return "image"
    } else if (isHasExtension == "mp3") {
        return "audio"
    } else if (isHasExtension == "mp4") {
        return "video";
    } else if (isHasExtension == "mov") {
        return "video";
    } else if (isHasExtension == "avi") {
        return "video";
    } else if (isHasExtension == "mkv") {
        return "video";
    } else if (isHasExtension == "WMV") {
        return "video"
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
        return "file"
    } else if (isHasExtension == "csv") {
        return "file"
    } else if (isHasExtension == "ppt") {
        return "file"
    } else if (isHasExtension == "pptx") {
    } else {
        return "text/plain";
    }
};

export const getAllUser = async (setAllAgents) => {
    const apiData = await generalGetFunction("/user-all");
    if (apiData?.status) {
        // setUser(apiData.data.filter((item) => item.extension_id !== null));
        setAllAgents(apiData.data);
        // setGroupSelecedAgents((prevSelected) => {
        //   return [...apiData.data.filter((item) => item.email === account.email)];
        // }
        // )
    }
}

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
    const apiData = await generalGetFunction(`/chatgroups/all`);
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
                if (user.user_id === account.id) {
                    setIsAdmin(user.is_admin);
                }
            });
        }
        setLoading(false);
    } else {
        setLoading(false);
    }
};

// Add new Tag
export const handleNewTag = async (newTag, setAddNewTag, setNewTag, setAllTags, allTags, setLoading) => {
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

// typing stuff ==== start here 
export const handleTypingEvent = (socketSendMessage, account, recipient, isTyping) => {
    socketSendMessage({
        action: "typing_status",
        user_id: account?.id,
        to_user_id: recipient?.[1],
        is_typing: false
    });
}

// typing stuff ==== end here 

// tag stuff ===== start here 
// Update tag
export const handleUpdateTag = async (upDateTag, setLoading, selectedTag, allTags, setAllTags, setUpDateTag, setSelectedTag) => {
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

// Handle assign task
export const handleAssignTag = async (tagId, userId, setContactRefresh, contactRefresh, setLoading, setContact, setOriginalContact, setMessageRefresh, setAllTags) => {
    setLoading(true);
    const parsedData = {
        tag_id: tagId,
        user_id: userId,
    };
    const apiData = await generalPostFunction(`/tag-users/store`, parsedData);
    if (apiData.status) {
        setContactRefresh(contactRefresh + 1);
        const shouldLoad = true;
        getContactAndAllTagData(shouldLoad, setLoading, checkMessageType, setContact, setOriginalContact, setMessageRefresh, setAllTags);
        // setLoading(false);
        toast.success("Tag assigned successfully");
        // setIsAssignmentClicked(true);
    } else {
        setLoading(false);
    }
}

// Handle unassign task
export const handleUnassignTag = async (tagId, setLoading, setContactRefresh, contactRefresh, setContact, setOriginalContact, setMessageRefresh, setAllTags ) => {
    setLoading(true);
    const apiData = await generalDeleteFunction(`/tag-users/destroy/${tagId}`);
    if (apiData.status) {
        setContactRefresh(contactRefresh + 1);
        const shouldLoad = true;
        getContactAndAllTagData(shouldLoad, setLoading, checkMessageType, setContact, setOriginalContact, setMessageRefresh, setAllTags);
        // setLoading(false);
        toast.success("Tag unassigned successfully");
        // setIsAssignmentClicked(true);
    } else {
        setLoading(false);
    }
}

 // Delete tag
export const handleDeleteTag = async (id, setLoading, setSelectedTag, allTags, setAllTags) => {
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

// tag stuff ====== end here 