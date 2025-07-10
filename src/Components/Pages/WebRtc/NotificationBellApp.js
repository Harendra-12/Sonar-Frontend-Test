import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import EmptyPrompt from '../../Loader/EmptyPrompt';
import { formatTimeWithAMPM } from '../../GlobalFunction/globalFunction';
import { set } from 'react-hook-form';
import { ActionType } from '../../Redux/reduxActionType';

function NotificationBellApp() {
    const recipient_to_remove_notification = useSelector((state) => state?.recipient_to_remove_notification);
    const incomingMessage = useSelector((state) => state.incomingMessage);
    const groupMessage = useSelector((state) => state.groupMessage);
    const deletedNotificationId = useSelector((state) => state.deletedNotificationId);
    const confNotif = useSelector((data) => data?.confNotif)
    const allNotificationState = useSelector((data) => data?.allNotificationState);
    const [incomingMessageList, setIncomingMessageList] = useState([]);
    const accountDetails = useSelector((state) => state.accountDetails);
    const [allNotification, setAllNotification] = useState(allNotificationState || []);
    const [userHasInteracted, setUserHasInteracted] = useState(false);
    const prevMessageIdRef = useRef(null);
    const deletedMessageIdsRef = useRef(new Set());
    const dispatch = useDispatch();
    const [toConference, setToConference] = useState(false);
    const audio = new Audio(
        require("../../assets/music/message-notification.mp3")
    );

    useEffect(() => {
        const handleInteraction = () => {
            setUserHasInteracted(true);
            window.removeEventListener('click', handleInteraction);
        };

        window.addEventListener('click', handleInteraction);
        return () => window.removeEventListener('click', handleInteraction);
    }, []);

    useEffect(() => {
        if (incomingMessage) {
            const currentMessageId = incomingMessage.uuid;
            if (currentMessageId !== prevMessageIdRef.current) {
                if (!deletedNotificationId?.has(currentMessageId)) {
                    setIncomingMessageList((prevList) => {
                        const exists = prevList.some(msg => msg.uuid === incomingMessage.uuid);
                        if (!exists) {
                            return [...prevList, incomingMessage];
                        }
                        return prevList;
                    });

                    setAllNotification((prevList) => {
                        const exists = prevList.some(msg => msg.uuid === incomingMessage.uuid);
                        const updatedList = exists ? prevList : [...prevList, incomingMessage];
                        dispatch({
                            type: ActionType?.SET_NOTIFICATION_STATE,
                            allNotificationState: updatedList,
                        });

                        return updatedList;
                    });
                    if (userHasInteracted) {
                        audio.play().catch(err => {
                            console.warn("Audio play blocked:", err);
                        });
                    }
                }
                prevMessageIdRef.current = currentMessageId;
            }
        }
    }, [incomingMessage]);

    useEffect(() => {
        if (Object?.keys(groupMessage)?.length > 0) {
            const currentMessageId = groupMessage.uuid;
            if (currentMessageId !== prevMessageIdRef.current) {
                if (!deletedNotificationId?.has(currentMessageId)) {
                    setAllNotification((prevList) => {
                        const exists = prevList?.some(msg => msg.uuid === groupMessage.uuid);
                        const updatedList = exists ? prevList : [...prevList, groupMessage];

                        dispatch({
                            type: ActionType?.SET_NOTIFICATION_STATE,
                            allNotificationState: updatedList,
                        });

                        if (userHasInteracted) {
                            audio.play().catch(err => {
                                console.warn("Audio play blocked:", err);
                            });
                        }

                        return updatedList;
                    });
                }
                prevMessageIdRef.current = currentMessageId;
            }
        }
    }, [groupMessage]);


    useEffect(() => {
        if (!recipient_to_remove_notification || recipient_to_remove_notification.length < 3) return;
        setAllNotification(prevNotifications => {
            if (recipient_to_remove_notification[2] !== "groupChat") {
                return prevNotifications?.filter(msg =>
                    msg.message_group_id !== undefined ||
                    msg.sender_id !== recipient_to_remove_notification[1]
                );
            } else {
                return prevNotifications?.filter(msg =>
                    msg?.group_name !== recipient_to_remove_notification[0]
                );
            }
        });
    }, [recipient_to_remove_notification]);

    // storing notification when meeting room is created
    useEffect(() => {
        // if (Object?.keys(confNotif)?.length > 0) {
        //     setAllNotification((prevList) => {
        //         const exists = prevList?.some(msg => msg.group_id === confNotif.group_id);
        //         if (!exists) {
        //             return [...prevList, { message_text: confNotif?.message, group_id: confNotif?.group_id, type: 'conference', conference_name: confNotif?.conference_name }];
        //         }
        //         return prevList;
        //     });
        // }
        if (Object?.keys(confNotif)?.length > 0) {
            setAllNotification((prevList) => {
                const exists = prevList?.some(msg => msg.group_id === confNotif.group_id);

                const updatedList = exists
                    ? prevList
                    : [
                        ...prevList,
                        {
                            message_text: confNotif?.message,
                            group_id: confNotif?.group_id,
                            type: 'conference',
                            conference_name: confNotif?.conference_name,
                        },
                    ];

                dispatch({
                    type: ActionType?.SET_NOTIFICATION_STATE,
                    allNotificationState: updatedList,
                });

                return updatedList;
            });
        }
    }, [confNotif])


    const removeNotification = (item) => {
        if (item.message_text) {
            const updatedNotifications = allNotification.filter(msg => msg.uuid !== item.uuid);
            setAllNotification(updatedNotifications);
            deletedMessageIdsRef.current.add(item.uuid);
            dispatch({ type: 'SET_DELETEDNOTIFFID', deletedNotificationId: new Set(deletedMessageIdsRef.current) });
            dispatch({
                type: ActionType?.SET_NOTIFICATION_STATE,
                allNotificationState: updatedNotifications,
            });
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

    // Redirect to Conference
    useEffect(() => {
        if (toConference) {
            dispatch({ type: 'SET_REDIRECTCONFERENCE', redirectConference: true });
        }
    }, [toConference])

    return (
        <div className="dropdown notification_dropdown">
            <button
                className="border-0 bg-transparent dropdown-toggle position-relative"
                type='button'
                data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside"
            >
                <i className="fa-regular fa-bell" />
                <span className="badge bg-secondary rounded-pill header-icon-badge pulse pulse-secondary" id="notification-icon-badge">{allNotification?.length || 0}</span>
            </button>
            <div className="dropdown-menu" style={{ minWidth: "300px" }}>
                <div className="p-2 header">
                    <div className="d-flex align-items-center justify-content-between">
                        <p className="mb-0 fs-17 fw-semibold">Notifications</p>
                        {/* <span className="badge bg-secondary-transparent" id="notifiation-data">5 Unread</span> */}
                    </div>
                </div>
                <ul>
                    {allNotification && allNotification?.length > 0 ?
                        allNotification?.slice(-5).reverse().map((item, index) => (
                            <li className="dropdown-item"
                            >
                                <div className="d-flex align-items-start">
                                    {item.message_text ? (
                                        <>
                                            <div className="pe-2">
                                                <span className="badge_icon bg-secondary-transparent">
                                                    <i className={`fa-duotone fa-solid fa-${item.type == 'conference' ? 'video' : 'messages'}`}></i>
                                                </span>
                                            </div>
                                            <div className="flex-grow-1 d-flex align-items-center justify-content-between">
                                                <div>
                                                    <p className="mb-0 d-flex" style={{ width: '300px' }}
                                                        onClick={() => {
                                                            if (item.type === 'conference') {
                                                                setToConference(true);
                                                                removeNotification(item);
                                                            }
                                                        }}
                                                    >
                                                        {!item?.group_id && item?.group_name ?
                                                            <>
                                                                <strong>{item?.group_name}<>{" "} (</>{accountDetails?.users.find((account) => account.id === item.sender_id)?.username}<>)</></strong>&nbsp;
                                                                <span className='text-success'></span>&nbsp;-&nbsp;<span style={{ width: '100px', display: 'inline-block', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{item?.message_text}</span>
                                                            </> :
                                                            <>
                                                                {item.type != "conference" ?
                                                                    <>
                                                                        <strong>{accountDetails?.users.find((account) => account.id === item.sender_id)?.username || 'N/A'}</strong>&nbsp;
                                                                        <span className='text-success'></span>&nbsp;-&nbsp;
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <strong>{item?.conference_name}</strong>&nbsp;
                                                                        <span className='text-success'></span>&nbsp;-&nbsp;
                                                                    </>
                                                                }
                                                                <span style={{ width: 'auto', display: 'inline-block', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', fontSize: '0.85rem' }}>{item?.message_text}</span>
                                                            </>
                                                        }

                                                    </p>
                                                    {!item?.group_id && <span className="text_gray fw-normal fs-12 ">{item.updated_at.split("T")[0]} - {new Date(item.updated_at).toLocaleTimeString()}</span>}
                                                </div>
                                                <div className='ms-4 align-self-start'>
                                                    <button className="closeBtn me-1 border-0 bg-transparent text_gray" onClick={() => removeNotification(item)}><i className="fa-regular fa-xmark"></i></button> </div>
                                            </div>
                                        </>
                                    ) : ""}
                                </div>
                            </li>
                        )) : (
                            <EmptyPrompt generic={"bell"} bell={true} nomargin={true} />
                        )
                    }

                    {/* <li className="dropdown-item">
                        <div className="d-flex align-items-start">
                            <div className="pe-2">
                                <span className="badge_icon bg-secondary-transparent "><i className="fa-duotone fa-solid fa-messages"></i></span>
                            </div>
                            <div className="flex-grow-1 d-flex align-items-center justify-content-between">
                                <div>
                                    <p className="mb-0">
                                        <span className='text-primary'>Message Received From </span> <strong>( pratima - 1002 )</strong><span className="unread text-white" style={{ backgroundColor: ' rgb(1, 199, 142)' }}>2</span></p>
                                    <span className="text_gray fw-normal fs-12 ">28 April, 2025</span>
                                </div>
                                <div className='ms-4 align-self-start'>
                                    <button className="closeBtn me-1 border-0 bg-transparent text_gray"><i className="fa-regular fa-xmark"></i></button> </div>
                            </div>
                        </div>
                    </li>
                    <li className="dropdown-item">
                        <div className="d-flex align-items-start">
                            <div className="pe-2">
                                <span className="badge_icon bg-primary-transparent "><i className="fa-duotone fa-solid fa-envelope"></i></span>
                            </div>
                            <div className="flex-grow-1 d-flex align-items-center justify-content-between">
                                <div>
                                    <p className="mb-0">
                                        <span className='text-success'>Voice Mail From </span> <strong>( pratima - 1002 )</strong><span className="unread text-white" style={{ backgroundColor: ' rgb(1, 199, 142)' }}>2</span></p>
                                    <span className="text_gray fw-normal fs-12 ">28 April, 2025</span>
                                </div>
                                <div className='ms-4 align-self-start'>
                                    <button className="closeBtn me-1 border-0 bg-transparent text_gray"><i className="fa-regular fa-xmark"></i></button> </div>
                            </div>
                        </div>
                    </li> */}
                </ul>
            </div>
        </div>
    )
}

export default NotificationBellApp