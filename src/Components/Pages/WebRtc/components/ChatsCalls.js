import React, { useEffect, useState } from 'react'
import { formatTimeWithAMPM, generalGetFunction } from '../../../GlobalFunction/globalFunction';
import EmptyPrompt from '../../../Loader/EmptyPrompt';
import Tippy from '@tippyjs/react';

const ChatsCalls = ({ loading, setMeetingPage, setToUser, setCalling, socketSendMessage, account, allAgents, onlineUser, callHistory }) => {

    return (
        <>
            <div className="chatCalls_wrap">
                {callHistory && callHistory.length > 0 ?
                    callHistory.map((item, index) => {
                        return (
                            <div className="contactListItem align-items-center" key={index}>
                                <div className="row justify-content-start align-items-center">
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
                                            {allAgents?.find(
                                                (acc) => acc.id === item.id
                                            )?.profile_picture ? (
                                                <img
                                                    src={
                                                        allAgents?.find(
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
                                        <div className="my-auto ms-2 ms-xl-3">
                                            <p className=' justify-content-start ellipsisText'>{item?.name}
                                                <span className={`missedCallArrow text-${item?.last_call_data?.hangup_cause === "originator_cancel" ? 'danger' : 'success'} ms-2`}>
                                                    <i class={`fa-regular fa-arrow-${item?.last_call_data?.room_id?.split("-")[0] == item.id ? "down-left" : "up-right"}`}></i>
                                                </span>
                                            </p>
                                            <h5>{item?.last_call_data?.created_at?.split(" ")[0]}, {formatTimeWithAMPM(item?.last_call_data?.created_at?.split(" ")[1])}</h5>
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

                                                {item.tags?.length > 2 && (
                                                    <Tippy content={
                                                        <ul className='contactTags' style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', maxWidth: '200px', gap: '5px' }}>
                                                            {item.tags?.map((tag, key) =>
                                                                <li>
                                                                    <span data-id={key}>
                                                                        {tag.tag?.[0]?.name}
                                                                    </span>
                                                                </li>
                                                            )}
                                                        </ul>
                                                    } allowHTML={true}>
                                                        <span className="more">
                                                            +{item.tags?.length - 2}
                                                        </span>
                                                    </Tippy>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col text-end d-flex justify-content-end align-items-center" onClick={() => {
                                            setMeetingPage("message");
                                            setToUser(item.id);
                                            setCalling(true);
                                            socketSendMessage({
                                                action: "peercall",
                                                from: account.id,
                                                to: item.id,
                                                room_id: `${account.id}-${item.id}`,
                                                call_type: `${item.last_call_data.call_type}`,
                                            });

                                        }}>
                                            <button className="btn_call"><i class={`fa-regular fa-${item.last_call_data.call_type === "audio" ? 'phone' : 'video'}`}></i></button>
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