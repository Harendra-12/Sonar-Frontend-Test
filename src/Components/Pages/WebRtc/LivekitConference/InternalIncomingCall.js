import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatDateTime } from "../../../GlobalFunction/globalFunction";

function InternalIncomingCall({
  setInternalCaller,
  setToUser,
  setCalling,
  setConferenceToggle,
  setIsConferenceCall,
  setConferenceInfo,
  setactivePage,
  activePage,
  conferenceToggle,
  isVideoOn,
  setConferenceId,
}) {
  const socketSendPeerCallMessage = useSelector((state) => state.socketSendPeerCallMessage)
  const account = useSelector((state) => state.account);
  const incomingCall = useSelector((state) => state.incomingCall);
  const internalCallAction = useSelector((state) => state.internalCallAction);
  const socketSendPeerGroupCallMessage = useSelector((state) => state.socketSendPeerGroupCallMessage);
  // console.log(incomingCall,internalCallAction)

  const dispatch = useDispatch();
  function answerCall(item) {
    if (item?.source === "incoming_peer_group_call") {
      setTimeout(() => {
        dispatch({ type: "REMOVE_INCOMINGCALL", room_id: item?.room_id })
      }, 1000);
      setConferenceId(item?.room_id)
      setCalling(true)
      setIsConferenceCall(true);
      try {
        dispatch({
          type: "SET_ROOMID",
          RoomID: item?.room_id,
        })
      } catch (err) {
        console.log(err)
      } finally {
        setConferenceInfo({
          room_id: item?.room_id,
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
      }
      socketSendPeerGroupCallMessage({
        "action": "receive_peer_group_call",
        "room_id": item?.room_id,
        "call_type": "audio",
        "message_group_id": item?.message_group_id,
        "group_name": item?.group_name,
        "user_id": item?.receiver_id,
        "date_and_time": formatDateTime(new Date())
      })
    } else {
      setInternalCaller(item?.sender_id);
      setToUser(account.id);
      setCalling(true);
      setTimeout(() => {
        dispatch({ type: "REMOVE_INCOMINGCALL", room_id: item?.room_id })
        dispatch({ type: "SET_INCOMINGCALL", incomingCall: { ...item, recieved: true, isOtherMember: true } })

      }, 1000);


      socketSendPeerCallMessage({
        action: "peercallUpdate",
        chat_call_id: item?.uuid,
        Hangup_cause: "",
        room_id: item?.room_id,
        duration: "",
        status: "started",
      });
    }
  }
  
  function rejectCall(item) {
    if (item?.source === "incoming_peer_group_call") {
      socketSendPeerGroupCallMessage({
        "action": "reject_peer_group_call",
        "group_name": item?.message_group_id,
        "rejected_by": account?.username,
        "room_id": item?.room_id,
        "user_id": item?.receiver_id,
        "date_and_time": formatDateTime(new Date())
      })
      dispatch({
        type: "REMOVE_INCOMINGCALL",
        room_id: item?.room_id,
      });
      dispatch({ type: "SET_INTERNALCALLACTION", internalCallAction: null });
    } else {
      dispatch({
        type: "REMOVE_INCOMINGCALL",
        room_id: item?.room_id,
      });
      dispatch({ type: "SET_INTERNALCALLACTION", internalCallAction: null });
      socketSendPeerCallMessage({
        action: "peercallUpdate",
        chat_call_id: item?.uuid,
        Hangup_cause: "rejected",
        room_id: item?.room_id,
        duration: "0",
        status: "ended",
      });
    }
  }

  useEffect(() => {
    incomingCall?.map((item) => {
      if (internalCallAction?.room_id === item?.room_id && internalCallAction?.Hangup_cause === "originator_cancel") {
        dispatch({ type: "SET_INTERNALCALLACTION", internalCallAction: null })
        dispatch({ type: "REMOVE_INCOMINGCALL", room_id: item?.room_id });
      }
    })
  }, [internalCallAction])

  useEffect(() => {
    console.log("incomingCall", incomingCall);
  }, [])

  return (
    <>
      {incomingCall?.length > 0 &&
        incomingCall?.map((item, key) => {
          if (item?.sender_id != account.id && !item?.recieved) {
            return (
              <div key={key} className="messageIncomingPopup">
                <div className="incomingCallPopup ">
                  <div className="d-flex justify-content-between w-100 align-items-center gap-2">
                    <div className="user">
                      {item?.sender_profile_picture ? (
                        <div className="userHolder">
                          <img
                            src={item?.sender_profile_picture}
                            alt="profile"
                            onError={(e) =>
                              (e.target.src = require("../../../assets/images/placeholder-image.webp"))
                            }
                          />
                        </div>
                      ) : (
                        <div className="userHolder"
                        >
                          <i className="fa-light fa-user fs-5"></i>
                        </div>
                      )}
                      <div className="userInfo col-12 mt-0">
                        <h5 className="fw-medium text-white mb-0 ellipsisText">
                          Calling from {item?.sender_name}
                        </h5>
                      </div>
                    </div>
                    <div className="controls">
                      <button
                        className="callButton"
                        onClick={() => answerCall(item)}
                      >
                        <i className="fa-duotone fa-phone"></i>
                        <div className="circle1"></div>
                        <div className="circle2"></div>
                      </button>
                      <button
                        className="callButton hangup me-0"
                        onClick={() => rejectCall(item)}
                      >
                        <i className="fa-duotone fa-phone-hangup"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        })}
    </>
  );
}

export default InternalIncomingCall;
