/* eslint-disable react-hooks/exhaustive-deps */
import { useIsRecording, useRoomContext } from "@livekit/components-react";
import React, { useEffect, useState, useRef } from "react";
// import { generalGetFunction, generalPostFunction } from './GlobalFunction/globalFunction';
import { createLocalVideoTrack } from "livekit-client";
import {
  generalGetFunction,
  generalPostFunction,
  meetGeneralGetFunction,
  meetGeneralPostFunction,
} from "../../../GlobalFunction/globalFunction";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { api_url } from "../../../../urls";

/**
 * Members component manages the participants and recordings of a room.
 * It handles the display and management of participant avatars, recording controls,
 * and participant list interactions.
 *
 * @param {Object} props - Component props.
 * @param {string} props.roomName - The name of the room.
 * @param {boolean} props.isAdmin - Indicates if the current user is an admin.
 * @param {string} props.username - The username of the current user.
 * @param {string} props.token - The token for API requests.
 * @param {boolean} props.manualRecording - Indicates if recording is manually controlled.
 * @param {Function} props.setManualRecording - Function to set manual recording state.
 * @param {boolean} props.isCurrentUserStartRecording - Indicates if the current user started recording.
 * @param {Function} props.setIsCurrentUserStartRecording - Function to set the recording state for the current user.
 */

function Members({
  roomName,
  isAdmin,
  username,
  token,
  manualRecording,
  setManualRecording,
  isCurrentUserStartRecording,
  setIsCurrentUserStartRecording,
  setCalling,
  isConferenceCall,
  socketMessage,
  conferenceInfo
}) {
  const room = useRoomContext();
  const socketSendMessage = useSelector((state) => state.socketSendMessage);
  const isRecording = useIsRecording();
  const isRecordingRef = useRef(isRecording); // Ref to track the latest value of isRecording
  const avatarTracks = {}; // Store references for avatars
  const internalCallAction = useSelector((state) => state.internalCallAction);
  const incomingCall = useSelector((state) => state.incomingCall);
  const dispatch = useDispatch();
  const [participants, setParticipants] = useState([]);
  const [showParticipants, setParticipantList] = useState(false);
  const [processingRecRequest, setProcessingRecRequest] = useState(false);
  const [currentCallRoom, setCurentCallRoom] = useState([]);
  // const [manualRecording, setManualRecording] = useState(false); // State to track manual recording
  const [searchTerm, setSearchTerm] = useState(""); // State to track the search input
  //   const currentCallRoom = incomingCall.filter((item) => item.room_id === roomName)
  const [toggleHandRaise, setToggleHandRaise] = useState(false);
  const microphoneButton = document.querySelector(".lk-button[data-lk-source='microphone']");
  const chatButton = document.querySelector('.lk-chat-toggle:not(.lk-close-button)');

  // State to manage hand raise functionality
  const handRaises = useSelector((state) => state.handRaises);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationText, setNotificationText] = useState(false);
  const lastProcessedRaise = useRef(null);

  const [toggleMeetingInfo, setToggleMeetingInfo] = useState(false);

  useEffect(() => {
    setCurentCallRoom(
      incomingCall.filter((item) => item?.room_id === roomName)
    );
  }, [incomingCall]);
  // Function to check if any user added in room and if added then update its value in incomingCall
  useEffect(() => {
    if (
      internalCallAction &&
      (internalCallAction?.hangup_cause !== "originator_cancel" ||
        internalCallAction?.hangup_cause !== "success")
    ) {
      const filterCall = incomingCall.filter(
        (item) => item.room_id === internalCallAction.room_id
      );
      if (filterCall) {
        dispatch({
          type: "REMOVE_INCOMINGCALL",
          room_id: internalCallAction.room_id,
        });
        dispatch({
          type: "SET_INCOMINGCALL",
          incomingCall: { ...filterCall[0], isOtherMember: true },
        });
      }
    }
  }, [internalCallAction]);
  // Function to manage avatars for all participants
  async function handleAvatarsForParticipants(room) {
    if (!room || !room.participants) return; // ✅ Ensure room and participants exist

    for (const participant of room.participants.values()) {
      if (!hasVideoTrack(participant)) {
        if (!avatarTracks[participant.identity]) {
          avatarTracks[participant.identity] = await addAvatarVideoTrack(
            participant
          );
        }
      }
    }

    room.on("participantConnected", async (participant) => {
      if (!hasVideoTrack(participant)) {
        avatarTracks[participant.identity] = await addAvatarVideoTrack(
          participant
        );
      }
    });

    room.on("trackUnsubscribed", async (track, publication, participant) => {
      if (track.kind === "video" && !avatarTracks[participant.identity]) {
        avatarTracks[participant.identity] = await addAvatarVideoTrack(
          participant
        );
      }
    });

    room.on("trackSubscribed", async (track, publication, participant) => {
      if (track.kind === "video" && avatarTracks[participant.identity]) {
        removeAvatar(participant);
      }
    });

    room.on("activeSpeakersChanged", (speakers) => {
      Object.keys(avatarTracks).forEach((id) => {
        avatarTracks[id].drawAvatar(false);
      });

      speakers.forEach((speaker) => {
        if (avatarTracks[speaker.identity]) {
          avatarTracks[speaker.identity].drawAvatar(true);
        }
      });
    });
  }

  // After disconnect this function will trigger to send socket data to other user about call state\
  useEffect(() => {
    const handleRoomDisconnect = () => {
      console.log(
        "currentCallRoom",
        incomingCall.filter((item) => item?.room_id === roomName),
        incomingCall
      );
      // Reset Hand Raise State
      dispatch({ type: "RESET_HAND_RAISES" })

      if (
        incomingCall.filter((item) => item?.room_id === roomName)[0]
          ?.isOtherMember
      ) {
        socketSendMessage({
          action: "peercallUpdate",
          chat_call_id: incomingCall.filter(
            (item) => item?.room_id === roomName
          )?.[0]?.uuid,
          hangup_cause: "success",
          room_id: roomName,
          duration: 120,
          status: "ended",
        });
        dispatch({ type: "REMOVE_INCOMINGCALL", room_id: roomName });
        dispatch({ type: "SET_INTERNALCALLACTION", internalCallAction: null });
        setCalling(false); // Update parent state if needed
      } else {
        socketSendMessage({
          action: "peercallUpdate",
          chat_call_id: incomingCall.filter(
            (item) => item?.room_id === roomName
          )?.[0]?.uuid,
          hangup_cause: "originator_cancel",
          room_id: roomName,
          duration: 0,
          status: "ended",
        });
        dispatch({ type: "REMOVE_INCOMINGCALL", room_id: roomName });
        dispatch({ type: "SET_INTERNALCALLACTION", internalCallAction: null });
        setCalling(false); // Update parent state if needed
      }
    };

    room.on("disconnected", handleRoomDisconnect);

    // Cleanup listener on unmount
    return () => {
      room.off("disconnected", handleRoomDisconnect);
    };
  }, [room, incomingCall]);

  // Function to disconnect user when found condition to be true
  const handleDisconnect = async () => {
    try {
      dispatch({ type: "SET_INTERNALCALLACTION", internalCallAction: null });
      dispatch({ type: "REMOVE_INCOMINGCALL", room_id: roomName });
      setCalling(false); // Update parent state if needed
      await room.disconnect();
    } catch (error) {
      console.error("Failed to disconnect from room:", error);
    }
  };
  useEffect(() => {
    if (
      (internalCallAction?.room_id === roomName &&
        internalCallAction?.hangup_cause === "rejected") ||
      internalCallAction?.hangup_cause === "success" ||
      internalCallAction?.hangup_cause === "originator_cancel"
    ) {
      handleDisconnect();
    }
  }, [internalCallAction]);
  function hasVideoTrack(participant) {
    return Array.from(participant.videoTracks.values()).some(
      (track) => track.isSubscribed
    );
  }

  // Function to create and publish an avatar video track
  async function addAvatarVideoTrack(participant) {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext("2d");

    function drawAvatar(isActive = false) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = isActive ? "#ffcc00" : "#007bff"; // Yellow for active speaker
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.font = "bold 50px Arial";
      ctx.textAlign = "center";
      ctx.fillText(participant.name || "Guest", 320, 260); // Draw name
    }

    drawAvatar(); // Initial avatar drawing

    // Convert canvas to video stream
    const stream = canvas.captureStream(30);
    const track = stream.getVideoTracks()[0];

    // Publish the avatar as a video track
    const localVideoTrack = await createLocalVideoTrack({ track });
    await participant.publishTrack(localVideoTrack);

    return { canvas, drawAvatar };
  }

  // Function to remove an avatar when video is enabled
  function removeAvatar(participant) {
    if (avatarTracks[participant.identity]) {
      avatarTracks[participant.identity] = null;
    }
  }

  useEffect(() => {
    handleAvatarsForParticipants(room);
  }, [room]);

  // Update the ref whenever isRecording changes
  useEffect(() => {
    isRecordingRef.current = isRecording;
    setIsCurrentUserStartRecording(false);
  }, [isRecording]);

  // Filter participants based on the search term
  const filteredParticipants = [...participants.values()].filter(
    (participant) =>
      participant.identity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Subscribing to room events to get participant details
  useEffect(() => {
    if (!room) {
      console.error("Room instance is not available");
      return;
    }

    const updateParticipants = () => {
      if (!room.remoteParticipants) return;
      setParticipants(new Map(room.remoteParticipants));
    };

    if (room.state === "connected") {
      updateParticipants();
    } else {
      room.once("connected", updateParticipants);
    }

    room.on("participantConnected", updateParticipants);
    room.on("participantDisconnected", updateParticipants);

    return () => {
      room.off("participantConnected", updateParticipants);
      room.off("participantDisconnected", updateParticipants);
    };
  }, [room]);
  // Function to toggle recording
  const toggleRecording = async () => {
    if (processingRecRequest || !isAdmin) return; // Prevent multiple requests
    setProcessingRecRequest(true);

    try {
      console.log(isRecordingRef.current);

      if (!isRecordingRef.current) {
        try {
          // const response = await axios.get(`https://meet.webvio.in/backend/start-recording?roomName=${room.name}`);
          const response = await meetGeneralGetFunction(api_url?.MEET_START_RECORDING(room?.name))
          if (response.data.success) {
            toast.success(response.data.message);
            setManualRecording(true); // Set manual recording state to true
            setIsCurrentUserStartRecording(true); // Set the state to indicate the current user started recording
          } else {
            toast.error(response.data.error);
          }
        } catch (err) {
          toast.error(err.response.data.error);
        }
      } else {
        // Stop recording
        try {
          // const response = await axios.get(`https://meet.webvio.in/backend/stop-recording?roomName=${room.name}`);
          const response = await meetGeneralGetFunction(api_url?.MEET_STOP_RECORDING(room?.name))
          if (response.data.success) {
            toast.success(response.data.message);
            setManualRecording(false); // Set manual recording state to false
            setIsCurrentUserStartRecording(true); // Reset the state to indicate the current user stopped recording
          } else {
            toast.error(response.data.error);
          }
        } catch (err) {
          toast.error(err.response.data.error);
        }
      }
    } catch (error) {
      console.error("Error toggling recording:", error);
    } finally {
      setProcessingRecRequest(false);
    }
  };

  // Dynamically append the "All Members" and "Record" buttons before the lk-disconnect-button
  useEffect(() => {
    const disconnectButton = document.querySelector(".lk-disconnect-button");
    if (disconnectButton) {
      // Check if the custom div already exists to avoid duplicates
      if (!document.querySelector(".custom-controls-container")) {
        const customDiv = document.createElement("div");
        customDiv.className = "custom-controls-container";
        customDiv.style.display = "flex";
        customDiv.style.alignItems = "center";
        customDiv.style.gap = "10px"; // Add spacing between buttons
        customDiv.style.position = "fixed";
        customDiv.style.right = "20px"; // Adjust as needed

        // Create the "All Members" button
        const allMembersButton = document.createElement("button");

        allMembersButton.className = "lk-button all-members-button d-flex align-items-center";
        allMembersButton.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="9" r="3" stroke="#000" stroke-width="1.5" />
            <circle cx="12" cy="12" r="10" stroke="#000" stroke-width="1.5" />
            <path d="M17.9691 20C17.81 17.1085 16.9247 15 11.9999 15C7.07521 15 6.18991 17.1085 6.03076 20" stroke="#000" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          All Members
        `;
        allMembersButton.onclick = () => setParticipantList((prev) => !prev);

        // Create the "Hand Raise" button
        const handRaiseButton = document.createElement("button");

        handRaiseButton.className = "lk-button hand-raise-button";
        handRaiseButton.setAttribute("data-lk-enabled", "false");
        handRaiseButton.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="18px" height="18px" viewBox="0 0 32 32" version="1.1">
            <path d="M20.903 24.014l2.959-3.984 3.475-3.32c0 0-1.158-1.381-2.59-1.381-0.643 0-1.232 0.184-1.77 0.552-0.535 0.367-1.023 0.918-1.463 1.655-0.615 0.215-1.094 0.42-1.438 0.615-0.076-0.766-0.168-1.333-0.275-1.7l1.996-7.748c0.473-1.868 0.586-2.812-0.539-3.312s-2.275 0.879-2.867 2.637l-1.893 5.983 0.057-7.694c0-1.889-0.596-2.833-1.788-2.833-1.204 0-1.805 0.837-1.805 2.51v7.692l-1.936-6.738c-0.48-1.192-1.325-2.366-2.45-1.991s-1.072 2.226-0.76 3.411l1.725 6.569-2.782-4.595c-0.851-1.475-2.319-1.76-2.651-1.416-0.529 0.549-0.883 1.717 0.077 3.394l3.069 5.343 2.74 9.492v1.845h8v-2.379c0.929-0.637 1.732-1.506 2.909-2.607v0z"/>
            <script xmlns=""/>
          </svg>
          Raise Hand
        `;
        handRaiseButton.onclick = () => handRaise();

        // Create the "Meeting Info" button
        const meetingInfoButon = document.createElement("button");
        meetingInfoButon.className = "lk-button meeting-info-button";
        meetingInfoButon.innerHTML =
          `<svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="16px" height="16px" viewBox="0 0 32 32" version="1.1">
            <title>info</title>
            <path d="M22 28.75h-4.75v-18.75c0-0.69-0.56-1.25-1.25-1.25v0h-4c-0.69 0-1.25 0.56-1.25 1.25s0.56 1.25 1.25 1.25v0h2.75v17.5h-4.75c-0.69 0-1.25 0.56-1.25 1.25s0.56 1.25 1.25 1.25v0h12c0.69 0 1.25-0.56 1.25-1.25s-0.56-1.25-1.25-1.25v0zM16 6.25c1.243 0 2.25-1.007 2.25-2.25s-1.007-2.25-2.25-2.25c-1.243 0-2.25 1.007-2.25 2.25v0c0.002 1.242 1.008 2.248 2.25 2.25h0zM16 3.75c0.138 0 0.25 0.112 0.25 0.25v0c0 0.275-0.5 0.275-0.5 0 0-0.138 0.112-0.25 0.25-0.25h0z"/>
            <script xmlns=""/>
          </svg>
          <span>Meeting Info</span>`;
        meetingInfoButon.onclick = () => setToggleMeetingInfo((prev) => !prev);

        // Create the "Record" button
        if (isAdmin) {
          const recordButton = document.createElement("button");
          recordButton.className = "lk-button record-button";
          disconnectButton.parentNode.insertBefore(recordButton, disconnectButton);
        }
        // Append the buttons to the custom div
        customDiv.appendChild(allMembersButton);

        customDiv.appendChild(meetingInfoButon);

        // Insert the custom div before the disconnect button
        disconnectButton.parentNode.insertBefore(customDiv, disconnectButton);

        // Insert the hand raise button before the disconnect button
        disconnectButton.parentNode.insertBefore(handRaiseButton, disconnectButton);
      }
    }
  }, [setParticipantList, roomName, chatButton]);

  // Use a separate useEffect to dynamically update the "Record" button text based on isRecording
  useEffect(() => {
    const recordButton = document.querySelector(".record-button");
    if (recordButton && isAdmin) {
      recordButton.innerHTML = processingRecRequest
        ? `<svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="18px" height="18px" viewBox="0 0 1920 1920">
              <path d="M1190.725 1368.395c77.93 63.247 151.68 122.993 191.096 252.763l22.25 72.96H515.336l22.137-72.96c39.416-129.77 113.167-189.516 191.21-252.763l169.524-137.675c35.577-28.913 87.304-29.026 122.993.113l169.525 137.562Zm142.306-641.393c135.529-109.891 304.263-246.663 304.263-670.531V0H282v56.47c0 423.869 168.734 560.64 304.264 670.532 88.884 72.057 147.5 119.605 147.5 232.998 0 113.393-58.616 160.941-147.5 232.885C450.734 1302.889 282 1439.66 282 1863.529V1920h1355.294v-56.47c0-423.869-168.734-560.64-304.263-670.645-88.772-71.944-147.502-119.492-147.502-232.885 0-113.393 58.73-160.941 147.502-232.998Z" fill-rule="evenodd"/>
            <script xmlns=""/>
          </svg> Record`
        : isCurrentUserStartRecording
          ? manualRecording
            ? `<svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="none">
                <path d="M12 21C10.22 21 8.47991 20.4722 6.99987 19.4832C5.51983 18.4943 4.36628 17.0887 3.68509 15.4442C3.0039 13.7996 2.82567 11.99 3.17294 10.2442C3.5202 8.49836 4.37737 6.89472 5.63604 5.63604C6.89472 4.37737 8.49836 3.5202 10.2442 3.17294C11.99 2.82567 13.7996 3.0039 15.4442 3.68509C17.0887 4.36628 18.4943 5.51983 19.4832 6.99987C20.4722 8.47991 21 10.22 21 12C21 14.387 20.0518 16.6761 18.364 18.364C16.6761 20.0518 14.387 21 12 21ZM12 4.5C10.5166 4.5 9.0666 4.93987 7.83323 5.76398C6.59986 6.58809 5.63856 7.75943 5.07091 9.12988C4.50325 10.5003 4.35473 12.0083 4.64411 13.4632C4.9335 14.918 5.64781 16.2544 6.6967 17.3033C7.7456 18.3522 9.08197 19.0665 10.5368 19.3559C11.9917 19.6453 13.4997 19.4968 14.8701 18.9291C16.2406 18.3614 17.4119 17.4001 18.236 16.1668C19.0601 14.9334 19.5 13.4834 19.5 12C19.5 10.0109 18.7098 8.10323 17.3033 6.6967C15.8968 5.29018 13.9891 4.5 12 4.5Z" fill="#000000"/>
                <path d="M14.5 8H9.5C8.67157 8 8 8.67157 8 9.5V14.5C8 15.3284 8.67157 16 9.5 16H14.5C15.3284 16 16 15.3284 16 14.5V9.5C16 8.67157 15.3284 8 14.5 8Z" fill="#000000"/>
                <script xmlns=""/>
              </svg> Stop Recording`
            : `<svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="16px" height="16px" viewBox="0 0 1920 1920">
                  <path d="M960 0c529.36 0 960 430.645 960 960 0 529.36-430.64 960-960 960-529.355 0-960-430.64-960-960C0 430.645 430.645 0 960 0Zm0 112.941c-467.125 0-847.059 379.934-847.059 847.059 0 467.12 379.934 847.06 847.059 847.06 467.12 0 847.06-379.94 847.06-847.06 0-467.125-379.94-847.059-847.06-847.059Zm0 313.726c294.55 0 533.33 238.781 533.33 533.333 0 294.55-238.78 533.33-533.33 533.33-294.552 0-533.333-238.78-533.333-533.33 0-294.552 238.781-533.333 533.333-533.333Z" fill-rule="evenodd"/>
              <script xmlns=""/></svg> Record`
          : isRecording
            ? `<svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="none">
                <path d="M12 21C10.22 21 8.47991 20.4722 6.99987 19.4832C5.51983 18.4943 4.36628 17.0887 3.68509 15.4442C3.0039 13.7996 2.82567 11.99 3.17294 10.2442C3.5202 8.49836 4.37737 6.89472 5.63604 5.63604C6.89472 4.37737 8.49836 3.5202 10.2442 3.17294C11.99 2.82567 13.7996 3.0039 15.4442 3.68509C17.0887 4.36628 18.4943 5.51983 19.4832 6.99987C20.4722 8.47991 21 10.22 21 12C21 14.387 20.0518 16.6761 18.364 18.364C16.6761 20.0518 14.387 21 12 21ZM12 4.5C10.5166 4.5 9.0666 4.93987 7.83323 5.76398C6.59986 6.58809 5.63856 7.75943 5.07091 9.12988C4.50325 10.5003 4.35473 12.0083 4.64411 13.4632C4.9335 14.918 5.64781 16.2544 6.6967 17.3033C7.7456 18.3522 9.08197 19.0665 10.5368 19.3559C11.9917 19.6453 13.4997 19.4968 14.8701 18.9291C16.2406 18.3614 17.4119 17.4001 18.236 16.1668C19.0601 14.9334 19.5 13.4834 19.5 12C19.5 10.0109 18.7098 8.10323 17.3033 6.6967C15.8968 5.29018 13.9891 4.5 12 4.5Z" fill="#000000"/>
                <path d="M14.5 8H9.5C8.67157 8 8 8.67157 8 9.5V14.5C8 15.3284 8.67157 16 9.5 16H14.5C15.3284 16 16 15.3284 16 14.5V9.5C16 8.67157 15.3284 8 14.5 8Z" fill="#000000"/>
                <script xmlns=""/>
              </svg> Stop Recording`
            : `<svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="16px" height="16px" viewBox="0 0 1920 1920">
                  <path d="M960 0c529.36 0 960 430.645 960 960 0 529.36-430.64 960-960 960-529.355 0-960-430.64-960-960C0 430.645 430.645 0 960 0Zm0 112.941c-467.125 0-847.059 379.934-847.059 847.059 0 467.12 379.934 847.06 847.059 847.06 467.12 0 847.06-379.94 847.06-847.06 0-467.125-379.94-847.059-847.06-847.059Zm0 313.726c294.55 0 533.33 238.781 533.33 533.333 0 294.55-238.78 533.33-533.33 533.33-294.552 0-533.333-238.78-533.333-533.33 0-294.552 238.781-533.333 533.333-533.333Z" fill-rule="evenodd"/>
                <script xmlns=""/></svg> Record`;
    }
  }, [isRecording, processingRecRequest]);

  // Use a separate useEffect to dynamically update the "Record" button text based on isRecording
  useEffect(() => {
    const allMembersButton = document.querySelector(".all-members-button");

    if (allMembersButton) {
      allMembersButton.style.backgroundColor = showParticipants
        ? "#373737"
        : "#1e1e1e";

      allMembersButton.style.display = isConferenceCall ? "block" : "none";
    }

    // Detect speaking participants
    detectSpeakingParticipants();
  }, [showParticipants, isConferenceCall]);

  // Attach the toggleRecording function to the "Record" button
  useEffect(() => {
    const recordButton = document.querySelector(".record-button");
    if (recordButton) {
      recordButton.onclick = async () => {
        if (isAdmin) {
          await toggleRecording(); // Call the toggleRecording function
        }
      };
    }
  }, [toggleRecording]);

  // async function handleMute(participant, isMuted) {
  //     await generalPostFunction(`/mute-participant`, {
  //         room: roomName,
  //         participantId: participant,
  //         isMuted: isMuted,
  //         token: token,
  //     });
  // }

  async function handleRemove(participant) {
    const payload = {
      room: roomName,
      participantId: participant,
    }
    // await generalPostFunction(`/remove-participant`, {
    //   room: roomName,
    //   participantId: participant,
    // });
    // const response = await axios.post(`https://meet.webvio.in/backend/remove-participant`, payload);
    const response = await meetGeneralPostFunction(`/remove-participant`, payload)
    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }

  }

  // Raise Hand Fucntion
  async function handRaise() {
    try {
      setToggleHandRaise(prev => {
        const updatedValue = !prev;
        const payload = {
          action: "handRaise",
          room_id: roomName,
          username: username,
          hand_raised: updatedValue,
        };
        socketMessage(payload);
        return updatedValue;
      });
    } catch (err) {
      console.error(err);
    }
  }

  // State Check of Raise Hand Button
  useEffect(() => {
    const handRaiseButton = document.querySelector(".hand-raise-button");
    if (handRaiseButton) {
      const textNode = handRaiseButton.childNodes[1];
      if (textNode && textNode.nodeType === Node.TEXT_NODE) {
        textNode.textContent = toggleHandRaise ? "Lower Hand" : "Raise Hand";
      }
    }
    handRaiseButton.setAttribute("data-lk-enabled", toggleHandRaise);
  }, [toggleHandRaise])

  // Replace Microphone with Mute / Unmute
  useEffect(() => {
    if (microphoneButton) {
      const updateButtonText = () => {
        const isEnabled = microphoneButton.getAttribute("data-lk-enabled") === "true";
        microphoneButton.childNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            node.textContent = isEnabled ? "Mute" : "Unmute";
          }
        });
      };

      // Initial set
      updateButtonText();

      // Observe attribute changes
      const observer = new MutationObserver(updateButtonText);
      observer.observe(microphoneButton, { attributes: true, attributeFilter: ['data-lk-enabled'] });

      return () => {
        observer.disconnect();
      };
    }
  }, [microphoneButton, roomName]);

  // Handle chat panel visibility based on chat button state
  useEffect(() => {
    const chatPanel = document.querySelector(".lk-chat");
    const customDiv = document.querySelector(".custom-controls-container")

    if (!chatButton) return;

    const toggleParticipants = () => {
      const isEnabled = chatButton.getAttribute("aria-pressed") === "true";
      // if chat is open and participants is showing → hide participants
      if (showParticipants && isEnabled) {
        chatPanel.style.right = '300px'
      } else {
        chatPanel.style.right = '0px'
      }
    };

    // Observe attribute changes
    const observer = new MutationObserver(toggleParticipants);
    observer.observe(chatButton, { attributes: true, attributeFilter: ['aria-pressed'] });

    // Also check immediately in case both are already active
    toggleParticipants();

    customDiv.prepend(chatButton);

    return () => {
      observer.disconnect();
    };
  }, [chatButton, showParticipants]);


  // Raise Hand Notification
  useEffect(() => {
    if (handRaises && handRaises.length > 0) {
      const latestRaise = handRaises[handRaises.length - 1];

      // Avoid showing toast for the same action again
      if (
        !lastProcessedRaise.current ||
        lastProcessedRaise.current.room_id !== latestRaise.room_id ||
        lastProcessedRaise.current.username !== latestRaise.username ||
        lastProcessedRaise.current.hand_raised !== latestRaise.hand_raised
      ) {
        setNotificationText(`${latestRaise.username} ${latestRaise.hand_raised ? 'raised' : 'lowered'} their hand ✋`);
        setShowNotification(true);

        lastProcessedRaise.current = latestRaise;

        const timer = setTimeout(() => {
          setShowNotification(false);
          setNotificationText("");
        }, 5000);

        return () => clearTimeout(timer);
      }
    }
  }, [handRaises]);

  function detectSpeakingParticipants() {
    const observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (mutation.attributeName === 'data-lk-speaking') {
          const tile = mutation.target;
          const isSpeaking = tile.getAttribute('data-lk-speaking') === 'true';

          if (isSpeaking) {
            const nameEl = tile.querySelector('[data-lk-participant-name]');
            const participantName = nameEl ? nameEl.getAttribute('data-lk-participant-name') : 'Unknown';

            if (participantName == username) {
              if (handRaises?.find((user) => user.username == participantName)?.hand_raised) {
                handRaise();
              }
            }
          }
        }
      });
    });

    // Select all participant tiles
    const participantTiles = document.querySelectorAll('.lk-participant-tile');
    participantTiles.forEach((tile) => {
      observer.observe(tile, { attributes: true });
    });

    return observer;
  }


  return (
    <>
      {!isConferenceCall && <style>
        {`
        .messageMeetingWrap .lk-chat {
          display: none !important;
        }
      `}
      </style>}
      {showNotification && <div className="NotificationBell">
        <i className="fa-solid fa-bell"></i>
        <div className="content">
          {notificationText}
        </div>
      </div>}
      {showParticipants && (
        <div className="participantMemberList p-0">
          <div className="lk-chat-header">
            <div
              style={{
                color: "#000",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Meeting Participants
            </div>
            <button
              className="clearButton2 xl ms-auto"
              onClick={() => setParticipantList(false)}
            >
              <i className={`fa-regular fa-xmark`}></i>
            </button>
          </div>
          <div></div>
          <div className="col-12 mt-3 p-2">
            <input
              type="search"
              name="Search"
              id="headerSearch"
              placeholder="Search"
              value={searchTerm} // Bind the input value to the state
              onChange={(e) => setSearchTerm(e.target.value)} // Update the state on input change
              style={{
                backgroundColor: "#f1f1f1",
                color: "#000",
                border: "none",
                minHeight: "35px",
              }}
            />
          </div>

          <ul className="noScrollbar p-2">
            {filteredParticipants.map((participant, index) => (
              <li key={index}>
                <div className={`d-flex align-items-center ${handRaises?.find((user) => user.username == participant.identity.split('-')[0])?.hand_raised ? 'handRaiseIcon' : ''} `}>
                  <div className="profileHolder">
                    <i className="fa-light fa-user"></i>
                  </div>
                  <span className="ms-2">{participant.identity.split('-')[0]}</span>
                </div>
                <div className="d-flex">
                  {/* <button
                                        onClick={() => {
                                            if (isAdmin) {
                                                handleMute(
                                                    participant.identity,
                                                    participant.isMicrophoneEnabled
                                                );
                                            }
                                        }}
                                        disabled={!isAdmin}
                                        className="clearButton2 me-2"
                                        style={{
                                            width: '30px',
                                            height: '30px',
                                            fontSize: '16px',
                                        }}
                                    >
                                        <i
                                            className={
                                                participant.isMicrophoneEnabled
                                                    ? 'fa-light fa-microphone'
                                                    : 'fa-light fa-microphone-slash'
                                            }
                                        ></i>
                                    </button> */}
                  <button
                    onClick={() => {
                      if (isAdmin) {
                        handleRemove(participant.identity);
                      }
                    }}
                    disabled={!isAdmin}
                    className="clearButton2 danger"
                    style={{
                      width: "30px",
                      height: "30px",
                      fontSize: "16px",
                    }}
                  >
                    <i className="fa-light fa-user-minus"></i>
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderTop: "1px solid var(--border-color)",
              padding: "10px 10px",
            }}
          >
            <div className="d-flex align-items-center">
              <div className="profileHolder">
                <i className="fa-light fa-user" />
              </div>
              <span className="ms-2">{username}</span>
            </div>
          </div>
        </div>
      )}
      {toggleMeetingInfo && (
        <div className="participantMemberList  p-0">
          <div className="lk-chat-header " style={{ borderBottom: "1px solid var(--border-color)" }}>
            <div
              style={{
                color: "rgb(19, 19, 19)",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Meeting details
            </div>

            <button
              className="clearButton2 xl ms-auto"
              onClick={() => setToggleMeetingInfo(false)}
            >
              <i className={`fa-regular fa-xmark`}></i>
            </button>

          </div>
          <div className="meeting-card p-3">
            <div className="meeting-section mt-3">
              <h5 className="fs-5 mb-3" style={{ textTransform: 'capitalize' }}>{conferenceInfo?.conf_name}</h5>
              <h3>Joining info</h3>
              <div className="meeting-link">{conferenceInfo?.conf_url}</div>
              <button className="btn btn-outline-secondary" onClick={() => { navigator.clipboard.writeText(conferenceInfo?.conf_url); toast.success("Copied to clipboard!") }}>
                <i class="fa-solid fa-clone me-2"></i>
                Copy joining info
              </button>
            </div>
            <div className="attachments">
              <p>Start Time and Date: <span className="text-dark fw-semibold">{conferenceInfo?.conf_start_time || "All Day"}</span></p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Members;
