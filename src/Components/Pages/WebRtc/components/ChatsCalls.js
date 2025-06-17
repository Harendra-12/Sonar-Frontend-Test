import React, { useEffect, useState } from 'react'
import { formatTimeWithAMPM, generalGetFunction } from '../../../GlobalFunction/globalFunction';
import EmptyPrompt from '../../../Loader/EmptyPrompt';
import Tippy from '@tippyjs/react';

const ChatsCalls = ({ loading, setMeetingPage, setToUser, setCalling, socketSendMessage, account, onlineUser, callHistory }) => {

    return (
        <>
            <div className="chatCalls_wrap callList">
                {callHistory && callHistory.length > 0 ?
                    callHistory.map((item, index) => {
                        const alternateUser = (item.room_id.split("-")[0] == account.id) ? item.receiver : item.sender;
                        return (
                            <div className="contactListItem align-items-center" key={index}>
                                <div className="row justify-content-start align-items-center">
                                    <div className="col-xl-12 d-flex">
                                        <div
                                            className="profileHolder"
                                            id={
                                                onlineUser.find(
                                                    (user) => user.id === alternateUser.id
                                                )
                                                    ? "profileOnlineNav"
                                                    : "profileOfflineNav"
                                            }
                                        >
                                            {item?.receiver?.profile_picture || item?.sender?.profile_picture ? (
                                                <img
                                                    src={
                                                        item?.sender_id == account?.id
                                                            ? item?.receiver?.profile_picture || require("../../../assets/images/placeholder-image.webp")
                                                            : item?.sender?.profile_picture || require("../../../assets/images/placeholder-image.webp")
                                                    }
                                                    alt="profile"
                                                />
                                            ) : (
                                                <i className="fa-light fa-user fs-5"></i>
                                            )}
                                        </div>
                                        <div className="my-auto ms-2 ms-xl-3 callDetailsWidth">
                                            <p className='justify-content-start ellipsisText'>{item?.sender_id == account?.id ? item?.receiver?.name : item?.sender?.name}
                                                <span className={`missedCallArrow text-${item?.hangup_cause === "originator_cancel" ? 'danger' : 'success'} ms-2`}>
                                                    <i className={`fa-regular fa-arrow-${item?.receiver_id == account?.id ? "down-left" : "up-right"}`}></i>
                                                </span>
                                            </p>
                                            <h5>{item?.created?.split(" ")[0]}, {formatTimeWithAMPM(item?.created?.split(" ")[1])}</h5>
                                        </div>
                                        <div className="col text-end d-flex justify-content-end align-items-center" onClick={() => {
                                            setMeetingPage("message");
                                            setToUser(item.id);
                                            setCalling(true);
                                            socketSendMessage({
                                                action: "peercallInitiate",
                                                from: account.id,
                                                to: item.id,
                                                room_id: `${account.id}-${item.id}`,
                                                call_type: `${item.call_type}`,
                                            });

                                        }}>
                                            <button className="btn_call"><i className={`fa-regular fa-${item.call_type === "audio" ? 'phone' : 'video'}`}></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                    : loading ? (
                        <>
                            <div className="contactListItem align-items-center"  >
                                <div className="row justify-content-start align-items-center">
                                    <div className="col-xl-12 d-flex">
                                        <div
                                            className="profileHolder"
                                            id={"profileOfflineNav"}
                                        >
                                            <i className="fa-light fa-user fs-5"></i>
                                        </div>
                                        <div className="my-auto ms-2 ms-xl-3">
                                            <p className=' justify-content-start ellipsisText'><div className="skeleton skeleton-heading-small" /></p>
                                            <h5 className='mt-1'><div className="skeleton skeleton-heading-small" /></h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="contactListItem align-items-center"  >
                                <div className="row justify-content-start align-items-center">
                                    <div className="col-xl-12 d-flex">
                                        <div
                                            className="profileHolder"
                                            id={"profileOfflineNav"}
                                        >
                                            <i className="fa-light fa-user fs-5"></i>
                                        </div>
                                        <div className="my-auto ms-2 ms-xl-3">
                                            <p className=' justify-content-start ellipsisText'><div className="skeleton skeleton-heading-small" /></p>
                                            <h5 className='mt-1'><div className="skeleton skeleton-heading-small" /></h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="contactListItem align-items-center"  >
                                <div className="row justify-content-start align-items-center">
                                    <div className="col-xl-12 d-flex">
                                        <div
                                            className="profileHolder"
                                            id={"profileOfflineNav"}
                                        >
                                            <i className="fa-light fa-user fs-5"></i>
                                        </div>
                                        <div className="my-auto ms-2 ms-xl-3">
                                            <p className=' justify-content-start ellipsisText'><div className="skeleton skeleton-heading-small" /></p>
                                            <h5 className='mt-1'><div className="skeleton skeleton-heading-small" /></h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : <EmptyPrompt generic={true} />}
            </div>
        </>
    )
}

export default ChatsCalls