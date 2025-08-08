import Tippy from '@tippyjs/react';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { featureUnderdevelopment } from '../../../GlobalFunction/globalFunction';
import CircularLoader from '../../../Loader/CircularLoader';
import MessageProfileDetails from "./../components/MessageProfileDetails";
import {
    handleAddNewMemberToGroup,
    handleAssignTag,
    handleCheckboxChange,
    handleDeleteGroup,
    handleEditGroupName,
    handlePinMessage,
    handleremoveUserFromGroup,
    handleSearchChange,
    handleSelectAll,
    handleTypingEvent,
    handleUnassignTag
} from './MessageFunctions';
import GroupTyping from '../components/GroupTyping';
import OneToOneTyping from '../components/OneToOneTyping';
import TypingLoader from '../components/TypingLoader';



const MessageBody = ({
    recipient,
    selectedChat,
    loading,
    contact,
    setLoading,
    setContactRefresh,
    contactRefresh,
    setContact,
    setOriginalContact,
    setMessageRefresh,
    setAllTags,
    account,
    setCalling,
    setToUser,
    setMeetingPage,
    isVideoOn,
    allTags,
    setNewTag,
    setAddNewTag,
    tagFilterInput,
    handleCreateNewTag,
    filteredTags,
    setTagFilterInput,
    tagDropdownRef,
    setManageGroupChat,
    setGroupLeaveId,
    setGroupLeavePopUp,
    groups,
    setGroupRefresh,
    groupRefresh,
    setSelectedChat,
    setRecipient,
    allMessage,
    messageListRef,
    formatDateTime,
    selectedgroupUsers,
    dateHeaderRefs,
    isAnyDateHeaderVisible,
    setAllMessage,
    DisplayFile,
    emojiOpen,
    EmojiPicker,
    handleEmojiClick,
    setEmojiOpen,
    setactivePage,
    activePage,
    isTyping,
    messageInput,
    socketSendMessage,
    setMessageInput,
    typingTimeoutRef,
    isTypingRef,
    sendGroupMessage,
    sendSingleMessage,
    autoReply,
    setAutoReply,
    setFileUpload,
    setFileType,
    manageGroupChat,
    groupNameEdit,
    setSaveEditToggleGroupNameChange,
    setGroupNameEdit,
    setNewGroupLoader,
    setAddMember,
    addMember,
    allAgents,
    setGroupChatPopUp,
    isAdmin,
    manageAdmin,
    setSelectedgroupUsers,
    isActiveAgentsOpen,
    setIsActiveAgentsOpen,
    saveEditToggleGroupNameChange,
    socketSendPeerCallMessage,
    pageLoader,
    socketSendPeerGroupCallMessage,
    setIsConferenceCall,
    setConferenceInfo,
    setConferenceToggle,
    conferenceToggle,
    setInternalCaller,
    typingUserList
}) => {

    const dispatch = useDispatch()
    const [searchQuery, setSearchQuery] = useState("")
    const [selectAll, setSelectAll] = useState(false)
    const [filteredAgents, setFilteredAgents] = useState(allAgents)
    const [groupSelecedAgents, setGroupSelecedAgents] = useState([]);
    const handlePinClick = (messageId) => {
        const selector = `.messageItem.active-${messageId}`;
        const element = document.querySelector(selector);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('highlight-temp');
            setTimeout(() => {
                element.classList.remove('highlight-temp');
            }, 3000);
        }
    }

    const handleConferenceJoinForGroupMessage = async (item) => {

        socketSendPeerGroupCallMessage({
            "action": "initiate_peer_group_call",
            "room_id": `${account.id}-${recipient?.[1]}`,
            "call_type": "audio",
            "message_group_id": recipient[1],
            "group_name": recipient[0],
            "user_id": account?.id,
        })
        setToUser(recipient[1])
        setCalling(true)
        setIsConferenceCall(false);
        try {
            dispatch({
                type: "SET_ROOMID",
                RoomID: `${account.id}-${recipient?.[1]}`
            })
        } catch (err) {
            console.log(err)
        } finally {
            setConferenceInfo({
                room_id: `${account.id}-${recipient?.[1]}`,
                extension_id: account?.extension_id,
                name: account?.username,
                setactivePage: setactivePage,
                activePage: activePage,
                setConferenceToggle: setConferenceToggle,
                conferenceToggle: conferenceToggle,
                conferenceId: "",
                pin: "",
                isVideoOn: isVideoOn,
            })
            setTimeout(() => {
                setCalling(true);
            }, 1000)
        }
    }

    const handleSearchMember = (event) => {
        const searchValue = event?.target?.value?.toLowerCase();
        setSearchQuery(searchValue)
        const filtered = allAgents?.filter((agent) => {
            const name = agent?.name?.toLowerCase() || "";
            return name.includes(searchValue);
        });
        setFilteredAgents(filtered);
    };

    const handleCloseMemberList = () => {
        setAddMember(false);
        setGroupChatPopUp(false);
        setSearchQuery("")
        setSelectAll(false)
        setGroupSelecedAgents([])
        setFilteredAgents(allAgents)
    }

    useEffect(() => {
        setFilteredAgents(allAgents)
    }, [allAgents])

    return (
        <div
            className="col-12 col-xl-9 col-lg-8 col-xxl-9 callDetails eFaxCompose newMessageBoxUi pe-0"
            // style={{ height: "100%" }}
            id="callDetails"
        >
            <div className="d-flex h-100 smBlock">
                {/* <PanelGroup autoSaveId="example" direction="horizontal">
                    <Panel className='leftPanel' defaultSize={70} collapsible={false} minSize={50} ref={leftPanel}> */}
                {/* this is chat section *********** */}
                <div className="col h-100 me-2" id="messagingBlock">
                    <div className={`messageOverlay h-100 ${recipient[2]}`}>
                        {recipient?.[0] ? (
                            <div className="contactHeader">
                                <div>
                                    <div className="d-flex justify-content-start align-items-center gap-2 mb-2">
                                        {recipient?.[5] != null ? (
                                            <div className="profileHolder">
                                                <img
                                                    src={recipient?.[5]}
                                                    alt="profile"
                                                    onError={(e) =>
                                                        (e.target.src = require("../../../assets/images/placeholder-image.webp"))
                                                    }
                                                />
                                            </div>
                                        ) : (
                                            <div
                                                className="profileHolder"
                                                id={"profileOfflineNav"}
                                            >
                                                {selectedChat == "singleChat" ? (
                                                    <i className="fa-light fa-user fs-5"></i>
                                                ) : (
                                                    <i className="fa-light fa-users fs-5"></i>
                                                )}
                                            </div>
                                        )}
                                        <h4 className="">
                                            {/* {
                                contact?.find(
                                  (contact) => contact.extension == recipient?.[0]
                                )?.name
                              }{" "}-
                              {" "} */}

                                            {recipient?.[3]}
                                        </h4>
                                    </div>
                                    {/* <h4>{recipient?.[0]}</h4> */}
                                    <div className="contactTags">
                                        {loading && (
                                            <div colSpan={99}>
                                                <CircularLoader />
                                            </div>
                                        )}
                                        {/* {contact
                                .find((contact) => contact.id == recipient?.[1])

                                ?.tags?.slice(0, 8).map((item, key) => {


                                  return (
                                    <>
                                      <span
                                        data-id={key}
                                        onClick={() =>
                                          handleUnassignTask(item?.id)
                                        }
                                        className="removableTag ellipsisText"
                                      >
                                        {item.tag?.[0]?.name}
                                      </span>

                                    </>
                                  );
                                } 
                                )} */}

                                        {contact?.find((contact) => contact.id == recipient?.[1])
                                            ?.tags?.slice(0, 8)
                                            .map((item, key) => (
                                                <span
                                                    key={key}
                                                    data-id={key}
                                                    onClick={() => handleUnassignTag(
                                                        item?.id,
                                                        setLoading,
                                                        setContactRefresh,
                                                        contactRefresh,
                                                        setContact,
                                                        setOriginalContact,
                                                        setMessageRefresh,
                                                        setAllTags
                                                    )}
                                                    className="removableTag ellipsisText"
                                                >
                                                    {item.tag?.[0]?.name}
                                                </span>
                                            ))}

                                        {contact?.find(
                                            (contact) => contact.id == recipient?.[1]
                                        )?.tags?.length > 8 && (
                                                <Tippy
                                                    trigger="click"
                                                    content={
                                                        <ul
                                                            className="contactTags"
                                                            style={{
                                                                listStyle: "none",
                                                                display: "flex",
                                                                flexWrap: "wrap",
                                                                maxWidth: "300px",
                                                                gap: "5px",
                                                                zIndex: "99999",
                                                            }}
                                                        >
                                                            {contact
                                                                .find(
                                                                    (contact) =>
                                                                        contact.id == recipient?.[1]
                                                                )
                                                                // ?.tags?.slice(2)
                                                                ?.tags?.map((tag, key) => (
                                                                    // <li key={key}  data-id={key}>
                                                                    <span key={key} data-id={key}>
                                                                        {tag.tag?.[0]?.name}
                                                                    </span>
                                                                    // </li>
                                                                ))}
                                                        </ul>
                                                    }
                                                    allowHTML={true}
                                                >
                                                    <span className="viewAllTagBtn">
                                                        View All +
                                                        {contact.find(
                                                            (contact) => contact.id == recipient?.[1]
                                                        )?.tags?.length - 8}
                                                    </span>
                                                </Tippy>
                                            )}

                                        {/* <span data-id="1">Work</span> */}
                                        {selectedChat === "groupChat" ? (
                                            ''
                                        ) : (
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
                                                <ul
                                                    className="dropdown-menu p-3"
                                                    style={{ maxWidth: "500px" }}
                                                    ref={tagDropdownRef}
                                                >
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
                                                            value={tagFilterInput}
                                                            onChange={(e) =>
                                                                setTagFilterInput(e.target.value)
                                                            }
                                                        />
                                                    </div>
                                                    <div
                                                        className="contactTags my-2"
                                                        style={{
                                                            width: "100%",
                                                            flexWrap: "wrap",
                                                            gap: "5px",
                                                        }}
                                                    >
                                                        {filteredTags?.map((item, key) => {
                                                            return (
                                                                <span
                                                                    data-id={key}
                                                                    key={key}
                                                                    onClick={() =>
                                                                        handleAssignTag(
                                                                            item?.id,
                                                                            recipient?.[1],
                                                                            setContactRefresh,
                                                                            contactRefresh,
                                                                            setLoading,
                                                                            setContact,
                                                                            setOriginalContact,
                                                                            setMessageRefresh,
                                                                            setAllTags
                                                                        )
                                                                    }
                                                                // className="removableTag"
                                                                >
                                                                    {item?.name}
                                                                </span>
                                                            );
                                                        })}
                                                        {filteredTags?.length == 0 && (
                                                            <button
                                                                className="more info"
                                                                onClick={() => handleCreateNewTag(setLoading, tagFilterInput, setAddNewTag, setNewTag, setAllTags, allTags)}
                                                            >
                                                                <i className="fa-regular fa-plus me-1"></i>{" "}
                                                                Create New Tag
                                                            </button>
                                                        )}
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
                                                        recipient?.[0]
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
                                            //       recipient?.[0]
                                            //     )
                                            //   }
                                            // >
                                            //   {item.name}
                                            // </li>
                                          );
                                        })} */}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                    {/* <span className="status online">Online</span> */}
                                </div>
                                <div className="d-flex position-relative">
                                    {/* <div className="d-flex align-items-center me-2">
                          <label className="gray14 me-2">Assigned to:</label>
                          <select className="ovalSelect">
                            <option>
                              {agents.map((item) => {
                                if (item.extension.extension === recipient?.[0]) {
                                  return item.username;
                                }
                              })}
                            </option>
                          </select>
                        </div> */}
                                    {/* <div class="clearButton_search">
                                        <input checked="" class="checkbox" type="checkbox" />
                                        <div class="mainbox">
                                            <div class="iconContainer">
                                                <i class="fa-regular fa-magnifying-glass"></i>
                                            </div>
                                            <input class="search_input" placeholder="search" type="text" />
                                        </div>
                                    </div> */}

                                    <div class="input-wrapper ">
                                        <button className="icon">
                                            <i className="fa-regular fa-magnifying-glass"></i>
                                        </button>
                                        <input placeholder="search.." className="input clearButton2" name="text" type="text" />
                                    </div>
                                    {selectedChat === "groupChat" ? (
                                        <button
                                            onClick={() => {
                                                handleConferenceJoinForGroupMessage()
                                            }}
                                            className="clearButton2"
                                            effect="ripple"
                                        >
                                            <i className="fa-regular fa-phone" />
                                        </button>
                                    ) : (
                                        <button
                                            // onClick={() => onSubmit("audio", recipient?.[0])}
                                            onClick={() => {
                                                setMeetingPage("message");
                                                setInternalCaller(account?.id)
                                                setToUser(recipient?.[1]);
                                                setCalling(true);
                                                dispatch({
                                                    type: "SET_INTERNALCALLACTION",
                                                    internalCallAction: null,
                                                });
                                                socketSendPeerCallMessage({
                                                    action: "peercallInitiate",
                                                    from: account.id,
                                                    to: recipient?.[1],
                                                    room_id: `${account.id}-${recipient?.[1]}`,
                                                    call_type: "audio",
                                                });
                                            }}
                                            className="clearButton2"
                                            effect="ripple"
                                        >
                                            <i className="fa-regular fa-phone" />
                                        </button>
                                    )}
                                    {isVideoOn ? (
                                        <button
                                            // onClick={() => onSubmit("video", recipient?.[0])}
                                            onClick={() => {
                                                setMeetingPage("message");
                                                setToUser(recipient?.[1]);
                                                setCalling(true);
                                                dispatch({
                                                    type: "SET_INTERNALCALLACTION",
                                                    internalCallAction: null,
                                                });
                                                socketSendPeerCallMessage({
                                                    action: "peercallInitiate",
                                                    from: account.id,
                                                    to: recipient?.[1],
                                                    room_id: `${account.id}-${recipient?.[1]}`,
                                                    call_type: "video",
                                                });
                                            }}
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
                                                        className="dropdown-item text-danger"
                                                        href="#"
                                                        onClick={() => {
                                                            setGroupLeaveId(
                                                                selectedgroupUsers.filter(
                                                                    (item) =>
                                                                        item.user_id === account.id
                                                                )[0].id
                                                            );
                                                            setGroupLeavePopUp(true);
                                                        }}
                                                    >
                                                        Leave this group
                                                    </div>
                                                </li>
                                            )}

                                            {selectedChat === "groupChat" &&
                                                groups?.find(
                                                    (group) => group.group_name == recipient?.[0]
                                                )?.created_by == account?.id ? (
                                                <li>
                                                    <div
                                                        className="dropdown-item text-danger"
                                                        href="#"
                                                        onClick={() =>
                                                            handleDeleteGroup(
                                                                recipient?.[1],
                                                                setGroupRefresh,
                                                                setSelectedChat,
                                                                setRecipient,
                                                                setLoading,
                                                                groupRefresh
                                                            )
                                                        }
                                                    >
                                                        Delete this group
                                                    </div>
                                                </li>
                                            ) : (
                                                ""
                                            )}

                                            <li>
                                                <div
                                                    className="dropdown-item text-danger"
                                                    href="#"
                                                    onClick={() => {
                                                        setRecipient([]);
                                                        setSelectedChat("");
                                                    }}
                                                >
                                                    Close this chat
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    {/* <button
                                        className="clearButton2"
                                        effect="ripple"
                                    >
                                        <i class="fa-regular fa-magnifying-glass"></i>
                                    </button> */}

                                </div>
                            </div>
                        ) : (
                            ""
                        )}
                        <div className="messageContent position-relative">
                            {/* this is chat section (showing section of all input and output messages) */}
                            {
                                pageLoader &&
                                <div className='loadingBody'>
                                    <div class="spinner-border text-spinner-secondary" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            }
                            {allMessage[recipient[0]]?.length > 0 && (() => {
                                const pinnedMessage = allMessage[recipient[0]].find(msg => msg?.is_pinned == 1);
                                if (!pinnedMessage) return null;

                                let displayText = pinnedMessage?.message_text;
                                if (displayText?.includes('/')) {
                                    displayText = displayText?.split('/').pop();
                                }

                                if (displayText?.length > 100) {
                                    displayText = displayText.slice(0, 100) + '...';
                                }

                                return (
                                    <div
                                        className="pinedMessage"
                                        onClick={() => handlePinClick(pinnedMessage?.id)}
                                    >
                                        <i className="fad fa-thumbtack"></i>
                                        <p className='mb-0'>
                                            {displayText}
                                        </p>
                                    </div>
                                );
                            })()}


                            <div className={`messageList  `} ref={messageListRef}>
                                {recipient?.[0] ? (
                                    <>
                                        {allMessage?.[
                                            selectedChat === "groupChat"
                                                ? recipient?.[0]
                                                : recipient?.[1]
                                        ]?.map((item, index, arr) => {
                                            const messageDate = item.time?.split(" ")[0]; // Extract date from the time string
                                            const todayDate = formatDateTime(
                                                new Date()
                                            ).split(" ")[0]; // Get today's date in "YYYY-MM-DD" format

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
                                                    {(
                                                        selectedChat === "groupChat"
                                                            ? item.from === account?.id
                                                            : item.from !== recipient?.[1]
                                                    ) ? (
                                                        <div className={`messageItem sender active-${item?.id}`}>
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
                                                                            </span>{" "}
                                                                            &nbsp;
                                                                            {item?.user_name}
                                                                        </h6>

                                                                        <div
                                                                            className={`message-text-container active-${item?.id}`}
                                                                            style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}
                                                                        >
                                                                            {/* <div className="dropdown">
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
                                                                                            onClick={() => handlePinMessage(item, setAllMessage, allMessage, recipient, selectedChat)}
                                                                                        >
                                                                                            {item?.is_pinned == 1 ? "Unpin" : "Pin"}
                                                                                        </div>
                                                                                    </li>
                                                                                </ul>
                                                                            </div> */}
                                                                            <div className="videoSize">
                                                                                <DisplayFile
                                                                                    key={index}
                                                                                    item={item.body}
                                                                                    index={index}
                                                                                />
                                                                                <div className='pinBox'>
                                                                                    <button className={`roundPinButton ${item?.is_pinned == 1 ? "pin_bg" : ""}`} onClick={() => handlePinMessage(item, setAllMessage, allMessage, recipient, selectedChat)}>
                                                                                        <i class={`fas fa-thumbtack ${item?.is_pinned == 1 ? "text-danger" : ""}`}></i>
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {item?.profile_picture ? (
                                                                        <div className="profileHolder">
                                                                            <img
                                                                                src={item?.profile_picture}
                                                                                alt="profile"
                                                                                onError={(e) =>
                                                                                    (e.target.src = require("../../../assets/images/placeholder-image.webp"))
                                                                                }
                                                                            />
                                                                        </div>
                                                                    ) : (
                                                                        <div
                                                                            className="profileHolder"
                                                                            id={"profileOfflineNav"}
                                                                        >
                                                                            <i className="fa-light fa-user fs-5"></i>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className={`messageItem receiver active-${item?.id}`}>
                                                            <div className="second">
                                                                <div className="d-flex">
                                                                    {item?.profile_picture ? (
                                                                        <div className="profileHolder">
                                                                            <img
                                                                                src={item?.profile_picture}
                                                                                alt="profile"
                                                                                onError={(e) =>
                                                                                    (e.target.src = require("../../../assets/images/placeholder-image.webp"))
                                                                                }
                                                                            />
                                                                        </div>
                                                                    ) : (
                                                                        <div
                                                                            className="profileHolder"
                                                                            id={"profileOfflineNav"}
                                                                        >
                                                                            <i className="fa-light fa-user fs-5"></i>
                                                                        </div>
                                                                    )}

                                                                    <div className=" ms-3 ">
                                                                        <h6>
                                                                            {item?.user_name}
                                                                            <span>
                                                                                {item?.time
                                                                                    ?.split(" ")[1]
                                                                                    ?.split(":")
                                                                                    .slice(0, 2)
                                                                                    .join(":")}
                                                                            </span>
                                                                        </h6>
                                                                        <div
                                                                            className={`message-text-container active-${item?.id}`}
                                                                            style={{ display: "flex", alignItems: "center" }}
                                                                        >
                                                                            <div className="videoSize">
                                                                                <DisplayFile item={item.body} />
                                                                                <div className='pinBox'>
                                                                                    <button className='roundPinButton' onClick={() => handlePinMessage(item, setAllMessage, allMessage, recipient, selectedChat)}>
                                                                                        <i class="fas fa-thumbtack"></i>
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                            {/* TODO : FIX PIN UI */}
                                                                            {/* <div className="dropdown">
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
                                                                                            onClick={() => handlePinMessage(item, setAllMessage, allMessage, recipient, selectedChat)}
                                                                                        >
                                                                                            {item?.is_pinned == 1 ? "Unpin" : "Pin"}
                                                                                        </div>
                                                                                    </li>
                                                                                </ul>
                                                                            </div> */}
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
                                        })}
                                    </>
                                ) : (
                                    <div className="startAJob">
                                        <div className="text-center mt-3">
                                            <img
                                                src={require("../../../assets/images/empty-box.png")}
                                                alt="Empty"
                                            ></img>
                                            <div>
                                                <h5>
                                                    Please select a <b>Chat</b> to start{" "}
                                                    <span>a conversation</span>.
                                                </h5>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {
                                    isTyping && (selectedChat == "singleChat"
                                        ? <OneToOneTyping shouldProfileShow={false} />
                                        : <GroupTyping shouldProfileShow={true} typingUserList={typingUserList} />)
                                }
                            </div>

                            {recipient?.[0] ? (
                                <div className="messageInput textarea_inputTab">

                                    {emojiOpen && (
                                        <div
                                            style={{
                                                position: "absolute",
                                                bottom: 180,
                                                width: "auto",
                                                height: "auto",
                                            }}
                                        >
                                            <EmojiPicker
                                                onEmojiClick={handleEmojiClick}
                                                open={emojiOpen}
                                            />
                                            <button
                                                className="clearButton2"
                                                style={{
                                                    position: "absolute",
                                                    bottom: 15,
                                                    right: 10,
                                                    zIndex: 9,
                                                }}
                                                onClick={() => setEmojiOpen(!emojiOpen)}
                                            >
                                                <i className="fa-solid fa-xmark"></i>
                                            </button>
                                        </div>
                                    )}
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
                                                    onClick={() =>
                                                        setactivePage("whatsapp-chartbox")
                                                    }
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
                                    <div className="d-flex w-100 flex_wrap575">
                                        <div
                                            className="tab-content textSms me-2"
                                            id="nav-tabContent"
                                        >
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
                                                <div className={`w-100 ${messageInput[recipient[0]] === 'Generating Ai response...' ? 'aiGenResponse' : ''}`}>
                                                    <div className="animated-border-box-glow">
                                                        <div className="textarea-border-wrapper position-relative">
                                                            <textarea
                                                                type="text"
                                                                rows={2}
                                                                name=""
                                                                className="formItem animated-textarea"
                                                                placeholder={"Please enter your message"}
                                                                value={messageInput[recipient[0]] || ""}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    const wordCount = value
                                                                        .trim()
                                                                        .split(/\s+/)
                                                                        .filter(Boolean).length;
                                                                    if (value.trim() === "") {
                                                                        setMessageInput((prev) => {
                                                                            const updated = { ...prev };
                                                                            delete updated[recipient[0]];
                                                                            return updated;
                                                                        });
                                                                        return;
                                                                    }
                                                                    if (!isTypingRef.current) {
                                                                        handleTypingEvent(socketSendMessage, account, recipient, true);
                                                                        isTypingRef.current = true;
                                                                    }

                                                                    // Reset typing timeout
                                                                    if (typingTimeoutRef.current) {
                                                                        clearTimeout(typingTimeoutRef.current);
                                                                    }

                                                                    typingTimeoutRef.current = setTimeout(() => {
                                                                        handleTypingEvent(socketSendMessage, account, recipient, false);
                                                                        isTypingRef.current = false;
                                                                    }, 5000);

                                                                    if (wordCount <= 7000) {
                                                                        setMessageInput((prev) => ({
                                                                            ...prev,
                                                                            [recipient[0]]: value,
                                                                        }));
                                                                    } else {
                                                                        toast.warn("Text is too long!");
                                                                    }
                                                                    // setUnreadMessage((prevState) => {
                                                                    //   const { [recipient?.[2] == "singleChat" ? recipient?.[1] : recipient?.[0]]: _, ...newState } =
                                                                    //     prevState;
                                                                    //   return newState;
                                                                    // });
                                                                }}
                                                                // onClick={() => {
                                                                //   console.log('bbbbbbbbbbb hello abc', unreadMessage)
                                                                //   setUnreadMessage((prevState) => {
                                                                //     const { [recipient?.[2] == "singleChat" ? recipient?.[1] : recipient?.[0]]: _, ...newState } =
                                                                //       prevState;
                                                                //     return newState;
                                                                //   });
                                                                // }}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === "Enter") {
                                                                        if (recipient?.[2] === "groupChat") {
                                                                            sendGroupMessage();
                                                                        } else {
                                                                            sendSingleMessage();
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                            <div className='typingLoader'>
                                                                <TypingLoader />
                                                            </div>
                                                        </div>
                                                    </div>
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

                                        <div className=" d-flex justify-content-between align-items-center gap-2">
                                            <div className="d-flex gap-1 align-items-center">
                                                <Tippy content="Auto Reply with AI">
                                                    <button
                                                        className={`clearButton2 eraser ${autoReply ? "active" : ""
                                                            }`}
                                                        onClick={() => setAutoReply(!autoReply)}
                                                    >
                                                        <i className="fa-solid fa-message-bot"></i>
                                                    </button>
                                                </Tippy>
                                                <button
                                                    className="clearButton2 gallery"
                                                    onClick={() => {
                                                        setFileUpload(true);
                                                        setFileType("image");
                                                    }}
                                                >
                                                    <i className="fa-regular fa-image"></i>
                                                </button>
                                                <button
                                                    className="clearButton2 link"
                                                    onClick={() => {
                                                        setFileUpload(true);
                                                        setFileType("all");
                                                    }}
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
                                                        if (recipient?.[2] === "groupChat") {
                                                            sendGroupMessage();
                                                        } else {
                                                            sendSingleMessage();
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
                {/* </Panel>
                  <PanelResizeHandle className="resizeHandle">
                      <Tippy content={
                        <button className='tableButton delete' onClick={resetResizeContent}>
                          <i className="fa-regular fa-arrows-rotate"></i>
                        </button>
                      } allowHTML={true} placement="top" interactive={true}>
                        <button className='clearButton2'>
                          <i className="fa-regular fa-arrows-left-right"></i>
                        </button>
                      </Tippy>
                    </PanelResizeHandle> */}
                {/* <Panel className='rightPanel' defaultSize={30} collapsible={true} minSize={25} ref={rightPanel}> */}

                {manageGroupChat ? (
                    <div
                        className="h-100 "
                        style={{
                            width: "30%",
                            transition: "all 0.4s ease-in-out",
                            borderLeft: "1px solid var(--border-color)",
                        }}
                    >
                        <div className="messageOverlay">
                            <div
                                className="contactHeader"
                                style={{ height: "71px" }}
                            >
                                <div className="col">
                                    <h4
                                        className="my-0"
                                        style={{ fontSize: "18px", fontWeight: 500 }}
                                    >
                                        {groupNameEdit}
                                    </h4>
                                </div>
                                <div className="d-flex my-auto">
                                    <button
                                        className="clearButton2 "
                                        onClick={() =>
                                            setSaveEditToggleGroupNameChange(true)
                                        }
                                    >
                                        <i className="fa-regular fa-pen"></i>
                                    </button>
                                </div>
                                {saveEditToggleGroupNameChange && (
                                    <div className="popup">
                                        <div className="container h-100">
                                            <div className="row h-100 justify-content-center align-items-center">
                                                <div className="row content col-xxl-4 col-xl-5 col-md-5">
                                                    <div className="col-12 mb-2">
                                                        <div className="iconWrapper">
                                                            <i className="fa-duotone fa-circle-exclamation" />
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="mb-2">
                                                            <h4 className="text-center text-orange">
                                                                Please type the new name of the group
                                                                below
                                                            </h4>
                                                        </div>
                                                        <div className="my-2">
                                                            <input
                                                                type="text"
                                                                className="formItem"
                                                                value={groupNameEdit}
                                                                onChange={(e) =>
                                                                    setGroupNameEdit(e.target.value)
                                                                }
                                                            />
                                                        </div>
                                                        <div className="d-flex justify-content-center gap-2 mt-3">
                                                            <button
                                                                className="panelButton m-0"
                                                                onClick={() => handleEditGroupName(groupNameEdit, setNewGroupLoader, recipient, setGroupRefresh, groupRefresh, setSaveEditToggleGroupNameChange)}
                                                            >
                                                                <span className="text">Confirm</span>
                                                                <span className="icon">
                                                                    <i className="fa-solid fa-check" />
                                                                </span>
                                                            </button>
                                                            <button
                                                                className="panelButton gray m-0 float-end"
                                                                onClick={() => {
                                                                    setSaveEditToggleGroupNameChange(
                                                                        false
                                                                    );
                                                                    setGroupNameEdit(recipient?.[3]);
                                                                }}
                                                            >
                                                                <span className="text">Cancel</span>
                                                                <span className="icon">
                                                                    <i className="fa-solid fa-xmark" />
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div
                                data-bell=""
                                className="contactListItem bg-transparent"
                                style={{
                                    minHeight: "auto",
                                    borderBottom: "1px solid var(--border-color)",
                                }}
                            >
                                <div className="row justify-content-between">
                                    <div
                                        className="col-xl-12 d-flex"
                                        onClick={() => {
                                            setAddMember((prev) => !prev);
                                            // setGroupChatPopUp(true);
                                        }}
                                    >
                                        <div className="profileHolder">
                                            <i className="fa-light fa-plus fs-5" />
                                        </div>
                                        <div className="my-auto ms-2 ms-xl-3">
                                            <h4 style={{ color: "var(--ui-accent)" }}>
                                                Add Member
                                                {addMember ? <i className="fa-solid fa-chevron-up"></i> : <i className="fa-solid fa-chevron-down"></i>}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {addMember ? (
                                <div
                                    className="addNewContactPopup py-0"
                                    style={{
                                        position: "static",
                                        transform: "none",
                                        width: "100%",
                                        boxShadow: "none",
                                        background: "transparent",
                                    }}
                                >
                                    <div className="row">
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
                                                    id="headerSearch"
                                                    className="formItem searchStyle"
                                                    placeholder="Search"
                                                    name="name"
                                                    value={searchQuery}
                                                    onChange={(event) => handleSearchMember(event)}
                                                />
                                                {/* <button
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
                                                                <th style={{ width: "20px" }}>
                                                                    S.No
                                                                </th>
                                                                <th>Name</th>
                                                                <th style={{ width: "20px" }}>
                                                                    <input
                                                                        type="checkbox"
                                                                        onChange={() => handleSelectAll(selectAll, setSelectAll, filteredAgents, groupSelecedAgents, setGroupSelecedAgents)} // Call handler on change
                                                                    // checked={selectAll ? true : false} // Keep checkbox state in sync
                                                                    />
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {filteredAgents?.map((item, index) => (
                                                                <tr key={item.id}>
                                                                    <td style={{ width: "20px" }}>
                                                                        {index + 1}.
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            whiteSpace: "break-spaces",
                                                                        }}
                                                                    >
                                                                        {item.name}
                                                                    </td>
                                                                    <td style={{ width: "20px" }}>
                                                                        <input
                                                                            type="checkbox"
                                                                            onChange={() =>
                                                                                handleCheckboxChange(item, setGroupSelecedAgents)
                                                                            } // Call handler on change
                                                                            checked={groupSelecedAgents.some(
                                                                                (agent) =>
                                                                                    agent.name == item.name
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
                                                        handleCloseMemberList()
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
                                                    onClick={() => {
                                                        handleAddNewMemberToGroup(
                                                            recipient,
                                                            groupSelecedAgents,
                                                            setNewGroupLoader,
                                                            groupRefresh,
                                                            setGroupRefresh,
                                                            setGroupChatPopUp,
                                                            setAddMember,
                                                            setGroupSelecedAgents
                                                        )
                                                        handleCloseMemberList()
                                                    }}
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
                            ) : (
                                <div
                                    style={{
                                        height: "calc(100vh - 275px)",
                                        overflow: "hidden scroll",
                                    }}
                                >
                                    {allAgents
                                        .filter((item) => {
                                            return selectedgroupUsers.some(
                                                (agent) => agent.user_id === item.id
                                            );
                                        })
                                        .map((item) => {
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
                                        })
                                        .map((item, index) => {
                                            return (
                                                <div
                                                    data-bell=""
                                                    className="contactListItem bg-transparent"
                                                    style={{ minHeight: "auto" }}
                                                    key={index}
                                                >
                                                    <div className="row justify-content-between">
                                                        <div className="col-xl-12 d-flex">
                                                            <div className="profileHolder">
                                                                {item?.profile_picture ? (
                                                                    <img
                                                                        src={item?.profile_picture}
                                                                        alt="profile"
                                                                        onError={(e) =>
                                                                            (e.target.src = require("../../../assets/images/placeholder-image.webp"))
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <i className="fa-light fa-user" />
                                                                )}
                                                            </div>
                                                            <div className="my-auto ms-2 ms-xl-3 ">
                                                                <h4>{item.name}</h4>
                                                            </div>
                                                            {item.email !== account.email &&
                                                                isAdmin ? (
                                                                <div className="col text-end my-auto">
                                                                    <div className="dropdown">
                                                                        <button
                                                                            className="clearButton2"
                                                                            type="button"
                                                                            data-bs-toggle="dropdown"
                                                                            aria-expanded="true"
                                                                        >
                                                                            <i className="fa-solid fa-ellipsis-vertical" />
                                                                        </button>
                                                                        <ul className="dropdown-menu light">
                                                                            {item.is_admin ? (
                                                                                <li>
                                                                                    <div
                                                                                        className="dropdown-item"
                                                                                        onClick={() =>
                                                                                            manageAdmin(
                                                                                                item.agentId,
                                                                                                item.group_id,
                                                                                                item.userId,
                                                                                                !item.is_admin,
                                                                                                setLoading,
                                                                                                setGroupRefresh,
                                                                                                groupRefresh
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        Dismiss Group Admin
                                                                                    </div>
                                                                                </li>
                                                                            ) : (
                                                                                <li>
                                                                                    <div
                                                                                        className="dropdown-item"
                                                                                        onClick={() =>
                                                                                            manageAdmin(
                                                                                                item.agentId,
                                                                                                item.group_id,
                                                                                                item.userId,
                                                                                                !item.is_admin,
                                                                                                setLoading,
                                                                                                setGroupRefresh,
                                                                                                groupRefresh
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        Make Group Admin
                                                                                    </div>
                                                                                </li>
                                                                            )}
                                                                            <li>
                                                                                <div
                                                                                    className="dropdown-item text-danger"
                                                                                    onClick={() =>
                                                                                        handleremoveUserFromGroup(
                                                                                            item.agentId,
                                                                                            setNewGroupLoader,
                                                                                            setSelectedgroupUsers,
                                                                                            selectedgroupUsers
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    Kick User
                                                                                </div>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                ""
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            )}
                            {!addMember && (
                                <div className="mb-auto px-4">
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
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div
                        className={`h-100 messageSlideBox`}
                        style={{
                            width:
                                isActiveAgentsOpen &&
                                    recipient &&
                                    recipient?.length > 0
                                    ? "30%"
                                    : "0%",
                            transition: "all 0.4s ease-in-out",
                        }}
                    // style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
                    >
                        <div
                            className={`callDashParkedCalls messageDower pe-0 absolutePanel`}
                            style={{
                                transform:
                                    isActiveAgentsOpen &&
                                        recipient &&
                                        recipient?.length > 0
                                        ? "translate(3%, 0%)"
                                        : "translate(100%, 0%)",
                            }}
                        >
                            {recipient && recipient?.length > 0 ? (
                                <button
                                    onClick={() =>
                                        setIsActiveAgentsOpen(!isActiveAgentsOpen)
                                    }
                                    className="callDashParkedCallsBtn"
                                    style={{
                                        left:
                                            isActiveAgentsOpen &&
                                                recipient &&
                                                recipient?.length > 0
                                                ? "-15px"
                                                : "-5px",
                                        transition: "all 0.4s ease-in-out",
                                    }}
                                >
                                    <i
                                        className={`fa-solid fa-chevron-${isActiveAgentsOpen &&
                                            recipient &&
                                            recipient?.length > 0
                                            ? "right"
                                            : "left"
                                            }`}
                                    />
                                </button>
                            ) : (
                                ""
                            )}
                            <div
                                className=" h-100"
                            // style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
                            >
                                {/* this section is for profile details ************ */}
                                {recipient && recipient?.length > 0 ? (
                                    <MessageProfileDetails
                                        recipient={recipient}
                                        messages={
                                            recipient?.[2] === "groupChat"
                                                ? allMessage?.[recipient?.[3]]
                                                : allMessage?.[recipient?.[1]]
                                        }
                                        selectedChat={selectedChat}
                                        setMeetingPage={setMeetingPage}
                                        setToUser={setToUser}
                                        setCalling={setCalling}
                                        socketSendMessage={socketSendPeerCallMessage}
                                        account={account}
                                        socketSendPeerGroupCallMessage={socketSendPeerGroupCallMessage}
                                        setIsConferenceCall={setIsConferenceCall}
                                        setConferenceInfo={setConferenceInfo}
                                        setactivePage={setactivePage}
                                        activePage={activePage}
                                        isVideoOn={isVideoOn}
                                        setConferenceToggle={setConferenceToggle}
                                        conferenceToggle={conferenceToggle}
                                    />
                                ) : (
                                    ""
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {/* </Panel>
                  </PanelGroup> */}
            </div>
        </div>
    )
}

export default MessageBody