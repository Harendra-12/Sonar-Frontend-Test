import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function InternalIncomingCall({ setInternalCaller, setToUser, setCalling }) {
  const socketSendMessage = useSelector((state)=>state.socketSendMessage)
  const account = useSelector((state) => state.account);
  const incomingCall = useSelector((state) => state.incomingCall);
  const internalCallAction = useSelector((state) => state.internalCallAction);
  console.log("Internal call action", internalCallAction);
  console.log("Incoming call", incomingCall);

  const dispatch = useDispatch();
  function answerCall(item) {
    setInternalCaller(item.sender_id);
    setToUser(account.id);
    setCalling(true);
    setTimeout(() => {
      dispatch({type:"REMOVE_INCOMINGCALL",room_id:item.room_id})
      dispatch({type:"SET_INCOMINGCALL",incomingCall:{...item,recieved:true,isOtherMember:true}})

    }, 1000);

    socketSendMessage({
      action: "peercall",
      chat_call_id: item.id,
      hangup_cause: "",
      room_id: item.room_id,
      duration: "",
      status: "started",
    });
  }

  function rejectCall(item) {
    dispatch({
      type: "REMOVE_INCOMINGCALL",
      room_id: item.room_id,
    });
    dispatch({type: "SET_INTERNALCALLACTION",internalCallAction: null});
    socketSendMessage({
      action: "peercall",
      chat_call_id: item.id,
      hangup_cause: "rejected",
      room_id: item.room_id,
      duration: "0",
      status: "ended",
    });
  }

  useEffect(()=>{
    incomingCall.map((item)=>{
      if(internalCallAction?.room_id === item.room_id && internalCallAction?.hangup_cause==="originator_cancel" ){
        dispatch({type:"SET_INTERNALCALLACTION",internalCallAction:null})
        dispatch({ type: "REMOVE_INCOMINGCALL", room_id: item.room_id });
      }
    })
  },[internalCallAction])

  console.log("IncominCall data",incomingCall)
  return (
    <>
      {incomingCall.length > 0 &&
        incomingCall.map((item) => {
          if (item.sender_id !== account.id && !item.recieved) {
            return (
              <div className="messageIncomingPopup">
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
                        <div className="userHolder" id={"profileOfflineNav"}>
                          <i className="fa-light fa-user fs-5"></i>
                        </div>
                      )}
                      <div className="userInfo col-12 mt-0">
                        <h5 className="fw-medium text-white mb-0 ellipsisText">
                          Calling from {item.sender_name}
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
