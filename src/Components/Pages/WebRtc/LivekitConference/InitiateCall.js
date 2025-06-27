import axios from "axios";
import React, { useEffect, useState } from "react";
import LiveKitConference from "./LiveKitConference";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { meetGeneralGetFunction } from "../../../GlobalFunction/globalFunction";

function InitiateCall({
  from,
  to,
  name,
  setCalling,
  interCallMinimize,
  setInterCallMinimize,
  type,
  setactivePage,
  recipient,
  setRecipient,
  selectedChat,
  setSelectedChat,
  isConferenceCall,
  isConferenceAdmin,
  conferenceInfo
}) {
  const [token, setToken] = useState(null);
  const [serverUrl, setServerUrl] = useState(null);
  // const roomName = `${from}-${to}`;
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [storeRecipient, setStoreRecipient] = useState();
  const roomId = useSelector((state) => state.RoomID);
  const [roomName, setRoomName] = useState("");
  const [isAdmin, setIsAdmin] = useState(true);

  // Check if its a Conference Call or Normal Call

  useEffect(() => {
    if (isConferenceCall) {
      setRoomName(roomId);
      setIsAdmin(isConferenceAdmin);
    } else {
      setRoomName(`${from}-${to}`)
    }
  }, [isConferenceCall])

  useEffect(() => {
    async function getToken() {
      // axios
      //   .get(
      //     `https://meet.webvio.in/backend/get-token?room=${roomName}&username=${name}&isAdmin=${isAdmin}`
      //   )
      //   .then((res) => {
      //     setToken(res.data.token);
      //     setServerUrl(res.data.serverUrl);
      //   })
      //   .catch((err) => {
      //     console.log("This error coming from conference", err);
      //   });
      const res = await meetGeneralGetFunction(`/get-token?room=${roomName}&username=${name}&isAdmin=${isAdmin}`)
      if (res?.status) {
        setToken(res?.data?.token);
        setServerUrl(res?.data?.serverUrl);
      } else {
        console.log("This error coming from conference", res?.err);
      }
    }
    if (roomName) {
      getToken();
    }
    if (recipient[1] == to) {
      setStoreRecipient(recipient);
    }
  }, [from, to, name, roomName, isAdmin]);

  // useEffect(() => {
  //     const handleClick = (event) => {
  //         const chatButton = document.querySelector(".lk-button.lk-chat-toggle");

  //         if (event.target === chatButton || chatButton?.contains(event.target)) {
  //             if (storeRecipient) {
  //                 setRecipient(storeRecipient);
  //                 setSelectedChat("singleChat");

  //                 setIsChatOpen(prev => !prev);
  //             }
  //         }
  //     };

  //     document.addEventListener('click', handleClick);

  //     return () => {
  //         document.removeEventListener('click', handleClick);
  //     };
  // }, [storeRecipient]);

  useEffect(() => {
    const messagingBlock = document.getElementById("messagingBlock");

    if (isChatOpen) {
      setactivePage("messages");
      if (messagingBlock) {
        messagingBlock.style.position = "absolute";
        messagingBlock.style.left = "10px";
        messagingBlock.style.zIndex = 9999;
        messagingBlock.style.maxWidth = "425px";
      }
    } else {
      if (messagingBlock) {
        messagingBlock.style.position = "initial";
        messagingBlock.style.left = "initial";
        messagingBlock.style.zIndex = "initial";
        messagingBlock.style.maxWidth = "initial";
      }
    }

    return () => {
      // Cleanup on unmount
      if (messagingBlock) {
        messagingBlock.style.position = "initial";
        messagingBlock.style.left = "initial";
        messagingBlock.style.zIndex = "initial";
        messagingBlock.style.maxWidth = "initial";
      }
    };
  }, [isChatOpen]);

  return (
    <>
      {token ? (
        <LiveKitConference
          token={token}
          serverUrl={serverUrl}
          roomName={roomName}
          username={name}
          isAdmin={true}
          setCalling={setCalling}
          isMinimize={interCallMinimize}
          setIsMinimize={setInterCallMinimize}
          isConferenceCall={isConferenceCall}
          conferenceInfo={conferenceInfo}
        />
      ) : (
        ""
      )}
    </>
  );
}

export default InitiateCall;
