import Tippy from '@tippyjs/react';
import { useDispatch, useSelector } from 'react-redux';
import { isOnlyLink } from '../../../GlobalFunction/globalFunction';
import AgentSearch from '../AgentSearch';
import ChatsCalls from "./../components/ChatsCalls";
import { getAllMessageApiFun, handleDeleteTag, handleGroupSearchChange, handleMessageSearchChange, handleNewTag } from './MessageFunctions';
import { useEffect } from 'react';
import OneToOneTyping from '../components/OneToOneTyping';
import GroupTyping from '../components/GroupTyping';
import TypingLoader from '../components/TypingLoader';

const MessageContactList = ({
    setRecipient,
    setExtensionFromCdrMessage,
    extensionFromCdrMessage,
    allAgents,
    activeTab,
    hanldeTabLinkClick,
    recipient,
    unreadMessage,
    searchValueForMessage,
    setSearchValueForMessage,
    originalContact,
    setOnlineUser,
    setGroups,
    setInternalCallHistory,
    setContact,
    origInalinternalCallHistory,
    originalOnlineUser,
    originalGroupsList,
    contact,
    setSelectedChat,
    setUnreadMessage,
    ActionType,
    setManageGroupChat,
    setAllMessage,
    allMessage,
    onlineUser,
    accountDetails,
    formatRelativeTime,
    searchValueForGroup,
    setSearchValueForGroup,
    groups,
    setGroupNameEdit,
    account,
    setIsAdmin,
    setAddNewTag,
    setSelectedgroupUsers,
    allTags,
    selectedTag,
    upDateTag,
    handleUpdateTag,
    setLoading,
    setAllTags,
    setSelectedTag,
    addNewTag,
    newTag,
    setNewTag,
    loading,
    doomScrollLoading,
    setDoomScrollLoading,
    setMeetingPage,
    setToUser,
    setCalling,
    socketSendPeerCallMessage,
    internalCallHistory,
    setInternalCallsPageNumber,
    rawInternalCallHistory,
    setGroupChatPopUp,
    setUpDateTag,
    internalCallsPageNumber,
    messageListRef,
    scrollPositionRef,
    chatHistory,
    setChatHistory,
    setPageLoader,
    setIsTyping,
    isGroupCallMessageOpened,
    isSingleCallMessageOpened,
    typingDetailState
}) => {
    const dispatch = useDispatch()
    const messageRecipient = useSelector((state) => state.messageRecipient)

    const handleContactListClicked = (item) => {
        const profile_picture = allAgents?.find(
            (data) => data?.id == item?.id
        )?.profile_picture;
        getAllMessageApiFun(
            1,
            [
                item?.id,
                item.id,
                "singleChat",
                item?.name,
                item?.email,
                profile_picture,
            ],
            messageListRef,
            scrollPositionRef,
            allAgents,
            setAllMessage,
            chatHistory,
            setChatHistory,
            setPageLoader
        );

        setRecipient([
            item?.id,
            item.id,
            "singleChat",
            item?.name,
            item?.email,
            profile_picture,
        ]);

        setSelectedChat("singleChat");
        setUnreadMessage((prevState) => {
            const { [item?.id]: _, ...newState } =
                prevState;
            return newState;
        });

        dispatch({
            type: ActionType?.REMOVE_NOTIFICATION_FOR_MESSAGE,
            recipient: [
                item?.extension,
                item.id,
                "singleChat",
                item?.name,
                item?.email,
                profile_picture,
            ],
        });
        setManageGroupChat(false);
        setAllMessage([]);
        setIsTyping(false)

    }

    const handleGroupChatListClicked = (item) => {
        getAllMessageApiFun(
            1,
            [
                item.group_name,
                item.id,
                "groupChat",
                item?.group_name,
                item?.email,
                null,
            ],
            messageListRef,
            scrollPositionRef,
            allAgents,
            setAllMessage,
            chatHistory,
            setChatHistory,
            setPageLoader
        );
        setRecipient([
            item.group_name,
            item.id,
            "groupChat",
            item?.group_name,
            item?.email,
            null,
        ]);
        setSelectedChat("groupChat");
        setGroupNameEdit(item.group_name);
        // getGroupDataById(item.id);
        setSelectedgroupUsers(
            item.message_groupusers
        );
        setUnreadMessage((prevState) => {
            const {
                [item.group_name]: _,
                ...newState
            } = prevState;
            return newState;
        });
        dispatch({
            type: ActionType?.REMOVE_NOTIFICATION_FOR_MESSAGE,
            recipient: [
                item.group_name,
                item.id,
                "groupChat",
                item?.group_name,
                item?.email,
                null,
            ],
        });
        item?.message_groupusers?.map((user) => {
            if (user?.user_id === account?.id) {
                setIsAdmin(user?.is_admin == 1 ? true : false);
            }
        });
        setAllMessage([]);
        setIsTyping(false)
    }

    useEffect(() => {
        if (isGroupCallMessageOpened && allMessage[recipient[0]] == undefined) {
            const payload = {
                group_name: messageRecipient[0],
                id: messageRecipient[1]
            }
            handleGroupChatListClicked(payload)
        }
    }, [isGroupCallMessageOpened])

    useEffect(() => {
        if (isSingleCallMessageOpened && recipient[0] == undefined) {
            const payload = {
                name: messageRecipient[3],
                id: messageRecipient[1]
            }
            handleContactListClicked(payload)
        }
    }, [isSingleCallMessageOpened])

    return (
        <div
            className="col-12 col-xl-3 col-lg-4 col-xxl-3 py-3 px-0 rounded-3 leftside_listBar"
            style={
                {
                    // height: "100%",
                    // borderRight: "1px solid var(--border-color)",
                }
            }
        >
            {/* <div className="row"> */}
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
            <div className="w-100 pb-3" style={{ padding: "0 10px" }}>
                <AgentSearch
                    getDropdownValue={setRecipient}
                    // getAllAgents={setAllAgents}
                    extensionFromCdrMessage={extensionFromCdrMessage}
                    setExtensionFromCdrMessage={setExtensionFromCdrMessage}
                    allAgents={allAgents}
                />
            </div>
            <div className="w-100">
                <nav className="">
                    <div className="nav nav-tabs align-items-center">
                        <button
                            className={
                                activeTab === "all" ? "tabLink active" : "tabLink"
                            }
                            data-category="all"
                            onClick={() => hanldeTabLinkClick("all")}
                        >
                            <i className="fa-regular fa-circle-dot "></i>
                            <span> All</span>
                            {unreadMessage && Object.values(unreadMessage).reduce(
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
                            onClick={() => hanldeTabLinkClick("online")}
                            className={
                                activeTab === "online" ? "tabLink active" : "tabLink"
                            }
                            // effect="ripple"
                            data-category="incoming"
                        >
                            <i className="fa-regular fa-user-tie"></i>{" "}
                            <span>Online</span>
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
                            onClick={() => hanldeTabLinkClick("group")}
                            className={
                                activeTab === "group" ? "tabLink active" : "tabLink"
                            }
                            // effect="ripple"
                            data-category="incoming"
                        >
                            <i className="fa-regular fa-user-group"></i>{" "}
                            <span>Group</span>
                        </button>
                        <button
                            onClick={() => hanldeTabLinkClick("call")}
                            className={
                                activeTab === "call" ? "tabLink active" : "tabLink"
                            }
                            // effect="ripple"
                            data-category="incoming"
                        >
                            <i className="fa-regular fa-phone"></i>{" "}
                            <span>Calls</span>
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
                {activeTab !== "all" && (
                    <input
                        type="search"
                        name="Search"
                        id="headerSearch"
                        className="searchStyle mt-2 mb-2"
                        placeholder="Search"
                        value={searchValueForMessage}
                        onChange={(event) =>
                            handleMessageSearchChange(
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

                            )}
                    />
                )}

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
                                <input
                                    type="search"
                                    name="Search"
                                    id="headerSearch"
                                    className="searchStyle mb-2"
                                    placeholder="Search"
                                    value={searchValueForMessage}
                                    onChange={(event) =>
                                        handleMessageSearchChange(
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
                                        )
                                    }
                                />
                                {contact?.map((item, key) => {
                                    return (
                                        <div
                                            data-bell={
                                                unreadMessage[item?.id]
                                                    ? unreadMessage[item?.id]
                                                    : ""
                                            }
                                            className={
                                                recipient?.[1] === item?.id
                                                    ? "contactListItem selected"
                                                    : "contactListItem"
                                            }
                                            key={key}
                                        >
                                            <div
                                                onClick={() => handleContactListClicked(item)}
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
                                                        {accountDetails?.users?.find(
                                                            (acc) => acc.id === item.id
                                                        )?.profile_picture ? (
                                                            <img
                                                                src={
                                                                    accountDetails?.users?.find(
                                                                        (acc) => acc.id === item.id
                                                                    )?.profile_picture
                                                                }
                                                                alt="profile"
                                                                onError={(e) =>
                                                                    (e.target.src = require("../../../assets/images/placeholder-image.webp"))
                                                                }
                                                            />
                                                        ) : (
                                                            <i className="fa-light fa-user fs-5"></i>
                                                        )}
                                                    </div>
                                                    <div className="ms-3 flex-grow-1">
                                                        <p>
                                                            {item?.name}
                                                            <span className=" text-end mb-0 dateTextColor">
                                                                {/* <span className="timeAgo "> */}
                                                                {item?.last_message_data
                                                                    ? formatRelativeTime(
                                                                        item?.last_message_data
                                                                            ?.created_at
                                                                    )
                                                                    : ""}
                                                                {/* </span> */}
                                                            </span>
                                                        </p>
                                                        {(typingDetailState?.result?.user_id === item?.id &&
                                                            recipient?.[0] != item?.id) ?
                                                            typingDetailState?.key == "typing_status"
                                                            &&
                                                            <div className="my-2">
                                                                <TypingLoader />
                                                            </div>

                                                            : (
                                                                <h5>
                                                                    {isOnlyLink(item?.last_message_data?.message_text)
                                                                        ? "Link"
                                                                        : item?.last_message_data?.message_text}
                                                                </h5>
                                                            )}

                                                        <div className="contactTags ">
                                                            {item.tags
                                                                ?.slice(0, 2)
                                                                ?.map((tag, key) => {
                                                                    return (
                                                                        <span
                                                                            data-id={key}
                                                                            className="ellipsisText"
                                                                            key={key}
                                                                        >
                                                                            {tag.tag?.[0]?.name}
                                                                        </span>
                                                                    );
                                                                })}

                                                            {item.tags?.length > 2 && (
                                                                <Tippy
                                                                    content={
                                                                        <ul
                                                                            className="contactTags"
                                                                            style={{
                                                                                listStyle: "none",
                                                                                display: "flex",
                                                                                flexWrap: "wrap",
                                                                                maxWidth: "200px",
                                                                                gap: "5px",
                                                                            }}
                                                                        >
                                                                            {item.tags?.map((tag, key) => (
                                                                                // <li>
                                                                                <span
                                                                                    data-id={key}
                                                                                    key={key}
                                                                                >
                                                                                    {tag.tag?.[0]?.name}
                                                                                </span>
                                                                                // </li>
                                                                            ))}
                                                                        </ul>
                                                                    }
                                                                    allowHTML={true}
                                                                >
                                                                    <span className="more">
                                                                        +{item.tags?.length - 2}
                                                                    </span>
                                                                </Tippy>
                                                            )}
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
                                    Group Chat{" "}
                                    <i className="fa-solid fa-chevron-down"></i>
                                </h5>
                            </div>
                            <div
                                className="collapse show"
                                id="collapse3"
                            // style={{ borderBottom: "1px solid #ddd" }}
                            >
                                <input
                                    type="search"
                                    name="Search"
                                    id="headerSearch"
                                    className="searchStyle mb-2"
                                    placeholder="Search"
                                    value={searchValueForGroup}
                                    onChange={(event) => handleGroupSearchChange(event, setGroups, setSearchValueForGroup, originalGroupsList)}
                                />
                                {groups?.map((item, index) => {
                                    return (
                                        <div
                                            className={
                                                recipient?.[1] === item.id
                                                    ? "contactListItem selected"
                                                    : "contactListItem"
                                            }
                                            key={index}
                                            data-bell={
                                                unreadMessage[item.group_name]
                                                    ? unreadMessage[item.group_name]
                                                    : ""
                                            }
                                            onClick={() => { handleGroupChatListClicked(item) }}
                                        >
                                            <div className="w-100">
                                                <div className=" d-flex align-items-center">
                                                    <div
                                                        className="profileHolder"
                                                    // id={
                                                    //   item?.message_groupusers?.some((user) =>
                                                    //     onlineUser?.some(
                                                    //       (online) =>
                                                    //         online?.id === user?.user_id
                                                    //     )
                                                    //   )
                                                    //     ? "profileOnlineNav"
                                                    //     : "profileOfflineNav"
                                                    // }
                                                    >
                                                        <i className="fa-light fa-users fs-5"></i>
                                                    </div>
                                                    <div className="ms-3 flex-grow-1">
                                                        <p>
                                                            {item.group_name}
                                                            <span className=" text-end mb-0 dateTextColor">
                                                                {/* <span className="timeAgo"> */}
                                                                {item?.last_message_data?.created_at
                                                                    ? formatRelativeTime(
                                                                        item?.last_message_data
                                                                            ?.created_at
                                                                    )
                                                                    : ""}
                                                                {/* </span> */}
                                                            </span>
                                                        </p>
                                                        {/* <h5>Alright</h5>
                                            <div className="contactTags">
                                              <span data-id="3">Priority</span>
                                            </div> */}
                                                        {/* here we are showing recent group message */}
                                                        <h5 className="f-s-14 text-gray d-flex align-items-center">
                                                            {/* here showing last send message below of contact name for group*/}
                                                            {
                                                                typingDetailState?.result?.group_id === item?.id ? (
                                                                    <span className="text-info fw-normal f-s-14">
                                                                        {
                                                                            allAgents?.find(agent => agent?.id === typingDetailState?.result?.user_id)?.username
                                                                        }
                                                                    </span>
                                                                ) : (
                                                                    allAgents?.find(agent => agent?.id === item?.last_message_data?.user_id)?.username && (
                                                                        <span className="text-info fw-normal f-s-14">
                                                                            {
                                                                                allAgents?.find(agent => agent?.id === item?.last_message_data?.user_id)?.username
                                                                            }
                                                                        </span>
                                                                    )
                                                                )
                                                            }

                                                            <span className='d-flex align-items-center'>
                                                                {typingDetailState?.result?.group_id === item?.id ? (
                                                                    typingDetailState?.result?.group_id === item?.id &&
                                                                        recipient?.[1] !== item?.id ? (
                                                                        <> : <TypingLoader /></>
                                                                    ) : null
                                                                ) : (
                                                                    item?.last_message_data?.message_text && (
                                                                        <>
                                                                            : {item.last_message_data.message_text}
                                                                        </>
                                                                    )
                                                                )}
                                                            </span>
                                                        </h5>
                                                    </div>
                                                </div>{" "}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ) : activeTab === "online" ? (
                    <div className="tab-content">
                        <div
                            className="callList"
                            style={{ height: "calc(100vh - 266px)" }}
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
                            <div className="collapse show" id="collapse4">
                                {onlineUser.map((item, key) => {
                                    return (
                                        <div
                                            data-bell=""
                                            className={
                                                recipient?.[1] === item?.id
                                                    ? "contactListItem selected"
                                                    : "contactListItem"
                                            }
                                            key={key}
                                        >
                                            <div
                                                onClick={() => {
                                                    const profile_picture = allAgents?.find(
                                                        (data) => data?.id == item?.id
                                                    )?.profile_picture;
                                                    setRecipient([
                                                        item?.id,
                                                        item.id,
                                                        "singleChat",
                                                        item?.name,
                                                        item?.email,
                                                        profile_picture,
                                                    ]);
                                                    setSelectedChat("singleChat");
                                                }}
                                                className="w-100"
                                            >
                                                <div className=" d-flex align-items-start ">
                                                    <div
                                                        className="profileHolder"
                                                        id="profileOnlineNav"
                                                    >
                                                        {accountDetails?.users?.find(
                                                            (acc) => acc.id === item.id
                                                        )?.profile_picture ? (
                                                            <img
                                                                src={
                                                                    accountDetails?.users?.find(
                                                                        (acc) => acc.id === item.id
                                                                    )?.profile_picture
                                                                }
                                                                alt="profile"
                                                                onError={(e) =>
                                                                    (e.target.src = require("../../../assets/images/placeholder-image.webp"))
                                                                }
                                                            />
                                                        ) : (
                                                            <i className="fa-light fa-user fs-5"></i>
                                                        )}
                                                    </div>
                                                    <div className="ms-3">
                                                        <p>{item?.username}</p>
                                                        {/* <h5>{item?.extension.extension}</h5> */}
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
                            style={{ height: "calc(100vh - 266px)" }}
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
                                                        onClick={() => handleUpdateTag(upDateTag, setLoading, selectedTag, allTags, setAllTags, setUpDateTag, setSelectedTag)}
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
                                                        onClick={() => handleDeleteTag(item.id, setLoading, setSelectedTag, allTags, setAllTags)}
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
                                                onClick={() => handleNewTag(newTag, setAddNewTag, setNewTag, setAllTags, allTags, setLoading)}
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
                ) : activeTab === "call" ? (
                    <div className="tab-content">
                        <ChatsCalls
                            loading={loading}
                            setLoading={setLoading}
                            doomScrollLoading={doomScrollLoading}
                            setDoomScrollLoading={setDoomScrollLoading}
                            setMeetingPage={setMeetingPage}
                            setToUser={setToUser}
                            setCalling={setCalling}
                            socketSendMessage={socketSendPeerCallMessage}
                            account={account}
                            onlineUser={onlineUser}
                            callHistory={internalCallHistory}
                            pageNumber={internalCallsPageNumber}
                            setPageNumber={setInternalCallsPageNumber}
                            rawData={rawInternalCallHistory}
                        />
                    </div>
                ) : (
                    <div className="tab-content">
                        <div
                            className="callList groupCall_list"
                            style={{ height: "calc(100vh - 266px)" }}
                        >
                            <div
                                className="chatHeading d-flex justify-content-between align-items-center"
                                data-bell={""}
                            >
                                <h5>Group Chats </h5>
                                {account?.user_role?.roles?.name !== "Agent" && (
                                    <Tippy content="Click to create a new group!">
                                        <button
                                            onClick={() => setGroupChatPopUp(true)}
                                            className="addGroup"
                                        >
                                            Add Group <i className="fa-light fa-plus"></i>
                                        </button>
                                    </Tippy>
                                )}
                            </div>
                            {groups?.map((item, index) => {
                                return (
                                    <div
                                        className={
                                            recipient?.[1] === item.id
                                                ? "contactListItem selected"
                                                : "contactListItem"
                                        }
                                        key={index}
                                        data-bell={
                                            unreadMessage[item.group_name]
                                                ? unreadMessage[item.group_name]
                                                : ""
                                        }
                                        onClick={() => {
                                            const profile_picture = allAgents?.find(
                                                (data) => data?.id == item?.id
                                            )?.profile_picture;
                                            setRecipient([
                                                item.group_name,
                                                item.id,
                                                "groupChat",
                                                item?.group_name,
                                                item?.email,
                                                profile_picture,
                                            ]);

                                            setSelectedChat("groupChat");
                                            setGroupNameEdit(item.group_name);
                                            setSelectedgroupUsers(item.message_groupusers);
                                            setUnreadMessage((prevState) => {
                                                const { [item.group_name]: _, ...newState } =
                                                    prevState;
                                                return newState;
                                            });
                                            dispatch({
                                                type: ActionType?.REMOVE_NOTIFICATION_FOR_MESSAGE,
                                                recipient: [
                                                    item.group_name,
                                                    item.id,
                                                    "groupChat",
                                                    item?.group_name,
                                                    item?.email,
                                                    profile_picture,
                                                ],
                                            });
                                            item?.message_groupusers?.map((user) => {
                                                if (user.user_id === account?.id) {
                                                    setIsAdmin(user.is_admin == 1 ? true : false);
                                                }
                                            });
                                        }}
                                    >
                                        <div className="w-100">
                                            <div className=" d-flex align-items-start justify-content-between">
                                                <div className="d-flex">
                                                    <div
                                                        className="profileHolder"
                                                    // id={"profileOfflineNav"}
                                                    >
                                                        <i className="fa-light fa-users fs-5"></i>
                                                    </div>
                                                    <div className=" ms-3 ">
                                                        <p>{item.group_name}</p>
                                                        {/* <h5>Alright</h5>
                                          <div className="contactTags">
                                            <span data-id="3">Priority</span>
                                          </div> */}
                                                        {item?.last_message_data
                                                            ?.message_text && (
                                                                <p className="fs-14 text-gray">
                                                                    <span className="text-info fw-normal">
                                                                        {allAgents.find(
                                                                            (data) =>
                                                                                data.id ==
                                                                                item?.last_message_data?.user_id
                                                                        )?.username || "N/A"}{" "}
                                                                        : &nbsp;
                                                                    </span>{" "}
                                                                    {
                                                                        item?.last_message_data
                                                                            ?.message_text
                                                                    }
                                                                </p>
                                                            )}
                                                    </div>
                                                </div>
                                                <div className=" text-end">
                                                    <div className="col text-end d-flex justify-content-end align-items-end flex-column">
                                                        {/* <button className="btn_call"><i className="fa-regular fa-video"></i></button> */}

                                                        <p className="timeAgo">
                                                            {item?.last_message_data?.created_at
                                                                ? formatRelativeTime(
                                                                    item?.last_message_data
                                                                        ?.created_at
                                                                )
                                                                : ""}
                                                        </p>
                                                        {/* {unreadMessage[item.group_name] ? (
                                            ""
                                          ) : (
                                            <span className="chat-read-icon readsms ">
                                              <i className="fa-solid fa-check-double"></i>
                                            </span>
                                          )} */}
                                                    </div>
                                                    {/* <div className="dropdown">
                                            <button
                                              className="clearButton2 "
                                              type="button"
                                              data-bs-toggle="dropdown"
                                              aria-expanded="true"
                                            >
                                              <i className="fa-solid fa-ellipsis-vertical" />
                                            </button>
                                            <ul className="dropdown-menu light">
                                              <li>
                                                <div
                                                  className="dropdown-item"
                                                  onClick={() =>
                                                    setManageGroupChat(true)
                                                  }
                                                >
                                                  Edit Group Chat
                                                </div>
                                              </li>
                                              <li>
                                                <div
                                                  className="dropdown-item text-danger"
                                                  onClick={() =>
                                                    handleDeleteGroup(item.id)
                                                  }
                                                >
                                                  Delete Group Chat
                                                </div>
                                              </li>
                                            </ul>
                                          </div> */}
                                                </div>
                                            </div>{" "}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
            {/* </div> */}
        </div>
    )
}

export default MessageContactList