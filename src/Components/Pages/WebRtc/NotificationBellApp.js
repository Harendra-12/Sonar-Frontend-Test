import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import EmptyPrompt from '../../Loader/EmptyPrompt';
import { formatTimeWithAMPM } from '../../GlobalFunction/globalFunction';
import { set } from 'react-hook-form';

function NotificationBellApp() {
    const incomingMessage = useSelector((state) => state.incomingMessage);
    const deletedNotificationId = useSelector((state) => state.deletedNotificationId);
    const [incomingMessageList, setIncomingMessageList] = useState([]);
    const accountDetails = useSelector((state) => state.accountDetails);
    const [allNotification, setAllNotification] = useState([]);

    const prevMessageIdRef = useRef(null);
    const deletedMessageIdsRef = useRef(new Set());
    const dispatch = useDispatch();

    useEffect(() => {
        if (incomingMessage) {
            const currentMessageId = incomingMessage.id;
            if (currentMessageId !== prevMessageIdRef.current) {
                if (!deletedNotificationId?.has(currentMessageId)) {
                    setIncomingMessageList((prevList) => {
                        const exists = prevList.some(msg => msg.id === incomingMessage.id);
                        if (!exists) {
                            return [...prevList, incomingMessage];
                        }
                        return prevList;
                    });

                    setAllNotification((prevList) => {
                        const exists = prevList.some(msg => msg.id === incomingMessage.id);
                        if (!exists) {
                            return [...prevList, incomingMessage];
                        }
                        return prevList;
                    });
                }
                prevMessageIdRef.current = currentMessageId;
            }
        }
    }, [incomingMessage]);

    const removeNotification = (item) => {
        if (item.message_text) {
            const updatedNotifications = allNotification.filter(msg => msg.uuid !== item.uuid);
            setAllNotification(updatedNotifications);
            deletedMessageIdsRef.current.add(item.id);
            dispatch({ type: 'SET_DELETEDNOTIFFID', deletedNotificationId: new Set(deletedMessageIdsRef.current) });
        }
    };


    // const locationState = useLocation();

    // // Function to Redirect to the Specific Message
    // useEffect(() => {
    //     if (contact && contact.length > 0) {
    //         if (locationState.state) {
    //             const selectedContact = contact.filter((item) => item.id === location.state.sender_id);
    //             const profile_img = allAgents?.find((data) => data?.id == selectedContact?.id)?.profile_picture
    //             setRecipient([selectedContact?.extension, selectedContact?.id, "singleChat", selectedContact?.name, selectedContact?.email, profile_img]);
    //         }
    //     }
    // }, [locationState.state, contact, allAgents]);


    return (
        <div class="dropdown notification_dropdown">
            <button
                className="border-0 bg-transparent dropdown-toggle position-relative"
                type='button'
                data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside"
            >
                <i className="fa-regular fa-bell" />
                <span class="badge bg-secondary rounded-pill header-icon-badge pulse pulse-secondary" id="notification-icon-badge">{allNotification.length || 0}</span>
            </button>
            <div className="dropdown-menu" style={{ minWidth: "300px" }}>
                <div class="p-2 header">
                    <div class="d-flex align-items-center justify-content-between">
                        <p class="mb-0 fs-17 fw-semibold">Notifications</p>
                        {/* <span class="badge bg-secondary-transparent" id="notifiation-data">5 Unread</span> */}
                    </div>
                </div>
                <ul>
                    {allNotification && allNotification.length > 0 ?
                        allNotification.map((item, index) => (
                            <li class="dropdown-item">
                                <div class="d-flex align-items-start">
                                    {item.message_text ? (
                                        <>
                                            <div class="pe-2">
                                                <span class="badge_icon bg-secondary-transparent">
                                                    <i class="fa-duotone fa-solid fa-messages"></i>
                                                </span>
                                            </div>
                                            <div class="flex-grow-1 d-flex align-items-center justify-content-between">
                                                <div>
                                                    <p class="mb-0 d-flex">
                                                        <strong>{accountDetails?.users.find((account) => account.id === item.sender_id)?.username || 'N/A'}</strong>&nbsp;
                                                        <span className='text-success'>sent</span>&nbsp;-&nbsp;<span style={{ width: '100px', display: 'inline-block', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{item?.message_text}</span>
                                                    </p>
                                                    <span class="text_gray fw-normal fs-12 ">{item.updated_at.split("T")[0]} - {new Date(item.updated_at).toLocaleTimeString()}</span>
                                                </div>
                                                <div className='ms-4 align-self-start'>
                                                    <button class="closeBtn me-1 border-0 bg-transparent text_gray" onClick={() => removeNotification(item)}><i class="fa-regular fa-xmark"></i></button> </div>
                                            </div>
                                        </>
                                    ) : ""}
                                </div>
                            </li>
                        )) : (
                            <EmptyPrompt generic={"bell"} bell={true} nomargin={true} />
                        )
                    }

                    {/* <li class="dropdown-item">
                        <div class="d-flex align-items-start">
                            <div class="pe-2">
                                <span class="badge_icon bg-secondary-transparent "><i class="fa-duotone fa-solid fa-messages"></i></span>
                            </div>
                            <div class="flex-grow-1 d-flex align-items-center justify-content-between">
                                <div>
                                    <p class="mb-0">
                                        <span className='text-primary'>Message Received From </span> <strong>( pratima - 1002 )</strong><span className="unread text-white" style={{ backgroundColor: ' rgb(1, 199, 142)' }}>2</span></p>
                                    <span class="text_gray fw-normal fs-12 ">28 April, 2025</span>
                                </div>
                                <div className='ms-4 align-self-start'>
                                    <button class="closeBtn me-1 border-0 bg-transparent text_gray"><i class="fa-regular fa-xmark"></i></button> </div>
                            </div>
                        </div>
                    </li>
                    <li class="dropdown-item">
                        <div class="d-flex align-items-start">
                            <div class="pe-2">
                                <span class="badge_icon bg-primary-transparent "><i class="fa-duotone fa-solid fa-envelope"></i></span>
                            </div>
                            <div class="flex-grow-1 d-flex align-items-center justify-content-between">
                                <div>
                                    <p class="mb-0">
                                        <span className='text-success'>Voice Mail From </span> <strong>( pratima - 1002 )</strong><span className="unread text-white" style={{ backgroundColor: ' rgb(1, 199, 142)' }}>2</span></p>
                                    <span class="text_gray fw-normal fs-12 ">28 April, 2025</span>
                                </div>
                                <div className='ms-4 align-self-start'>
                                    <button class="closeBtn me-1 border-0 bg-transparent text_gray"><i class="fa-regular fa-xmark"></i></button> </div>
                            </div>
                        </div>
                    </li> */}
                </ul>
            </div>
        </div>
    )
}

export default NotificationBellApp