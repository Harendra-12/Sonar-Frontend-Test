/* eslint-disable react-hooks/exhaustive-deps */
import { useIsRecording, useRoomContext } from '@livekit/components-react';
import React, { useEffect, useState, useRef } from 'react';
// import { generalGetFunction, generalPostFunction } from './GlobalFunction/globalFunction';
import { createLocalVideoTrack } from "livekit-client";
import { generalGetFunction, generalPostFunction } from '../../../GlobalFunction/globalFunction';
import { useDispatch, useSelector } from 'react-redux';

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

function Members({ roomName, isAdmin, username, token, manualRecording, setManualRecording, isCurrentUserStartRecording, setIsCurrentUserStartRecording, setCalling }) {
    const room = useRoomContext();
    const socketSendMessage = useSelector((state)=>state.socketSendMessage)
    const isRecording = useIsRecording();
    const isRecordingRef = useRef(isRecording); // Ref to track the latest value of isRecording
    const avatarTracks = {}; // Store references for avatars
    const internalCallAction = useSelector((state)=>state.internalCallAction)
    const incomingCall = useSelector((state)=>state.incomingCall)
    const dispatch = useDispatch()
    const [participants, setParticipants] = useState([]);
    const [showParticipants, setParticipantList] = useState(false);
    const [processingRecRequest, setProcessingRecRequest] = useState(false);
    // const [manualRecording, setManualRecording] = useState(false); // State to track manual recording
    const [searchTerm, setSearchTerm] = useState(''); // State to track the search input
    const currentCallRoom = incomingCall.filter((item)=>item.room_id===roomName)

    // Function to check if any user added in room and if added then update its value in incomingCall
    useEffect(()=>{
        if(internalCallAction?.status==="started"){
            const filterCall = incomingCall.filter((item)=>item.room_id===internalCallAction.room_id)
            if(filterCall){
                dispatch({type:"REMOVE_INCOMINGCALL",room_id:internalCallAction.room_id})
                dispatch({type:"SET_INCOMINGCALL",incomingCall:{...filterCall,isOtherMember:true}})
            }
        }
       
    },[internalCallAction])
    // Function to manage avatars for all participants
    async function handleAvatarsForParticipants(room) {
        if (!room || !room.participants) return; // ✅ Ensure room and participants exist
    
        for (const participant of room.participants.values()) { 
            if (!hasVideoTrack(participant)) {
                if (!avatarTracks[participant.identity]) {
                    avatarTracks[participant.identity] = await addAvatarVideoTrack(participant);
                }
            }
        }
    
        room.on("participantConnected", async (participant) => {
            if (!hasVideoTrack(participant)) {
                avatarTracks[participant.identity] = await addAvatarVideoTrack(participant);
            }
        });
    
        room.on("trackUnsubscribed", async (track, publication, participant) => {
            if (track.kind === "video" && !avatarTracks[participant.identity]) {
                avatarTracks[participant.identity] = await addAvatarVideoTrack(participant);
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
            console.log("participants",participants);
            
            if(participants.isOtherMember){
                socketSendMessage({
                    "action": "peercall",
                    "chat_call_id": currentCallRoom.id,
                    "hangup_cause": "success",
                    "room_id": roomName,
                    "duration": 120, 
                    "status": "ended"
                  })
            }else{
                socketSendMessage( {
                    "action": "peercall",
                    "chat_call_id": currentCallRoom.id,
                    "hangup_cause": "originator_cancel",
                    "room_id": roomName,
                    "duration": 0,
                    "status": "ended"
                  })
            }
        };
    
        room.on('disconnected', handleRoomDisconnect);
    
        // Cleanup listener on unmount
        return () => {
            room.off('disconnected', handleRoomDisconnect);
        };
    }, [room]);
    
    // Function to disconnect user when found condition to be true
    const handleDisconnect = async () => {
        try {
            dispatch({type: "SET_INTERNALCALLACTION",internalCallAction: null});
            dispatch({type:"REMOVE_INCOMINGCALL", room_id:roomName})
            await room.disconnect();
            setCalling(false); // Update parent state if needed
        } catch (error) {
            console.error("Failed to disconnect from room:", error);
        }
    };
    useEffect(()=>{
        if(internalCallAction?.room_id===roomName && internalCallAction?.hangup_cause==="rejected" || internalCallAction?.hangup_cause==="success" || internalCallAction?.hangup_cause==="originator_cancel"){
            handleDisconnect()
        }
    },[internalCallAction])
    function hasVideoTrack(participant) {
        return Array.from(participant.videoTracks.values()).some((track) => track.isSubscribed);
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
        setIsCurrentUserStartRecording(false)
    }, [isRecording]);


    // Filter participants based on the search term
    const filteredParticipants = [...participants.values()].filter((participant) =>
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

        if (room.state === 'connected') {
            updateParticipants();
        } else {
            room.once('connected', updateParticipants);
        }

        room.on('participantConnected', updateParticipants);
        room.on('participantDisconnected', updateParticipants);

        return () => {
            room.off('participantConnected', updateParticipants);
            room.off('participantDisconnected', updateParticipants);
        };
    }, [room]);
    // Function to toggle recording
    const toggleRecording = async () => {
        if (processingRecRequest || !isAdmin) return; // Prevent multiple requests
        setProcessingRecRequest(true);

        try {
            console.log(isRecordingRef.current);

            if (!isRecordingRef.current) {
                console.log('Start recording', isRecordingRef.current);

                // Start recording
                const response = await generalGetFunction(`/start-recording?roomName=${roomName}`);
                console.log('Start Recording Response:', response);
                if (response) {
                    setManualRecording(true); // Set manual recording state to true
                    setIsCurrentUserStartRecording(true); // Set the state to indicate the current user started recording
                }
            } else {
                // Stop recording
                const response = await generalGetFunction(`/stop-recording?roomName=${roomName}`);
                console.log('Stop Recording Response:', response);
                if (response) {
                    setManualRecording(false); // Set manual recording state to false
                    setIsCurrentUserStartRecording(true); // Reset the state to indicate the current user stopped recording
                }
            }
        } catch (error) {
            console.error('Error toggling recording:', error);
        } finally {
            setProcessingRecRequest(false);
        }
    };

    // Dynamically append the "All Members" and "Record" buttons before the lk-disconnect-button
    useEffect(() => {
        const disconnectButton = document.querySelector('.lk-disconnect-button');
        if (disconnectButton) {
            // Check if the custom div already exists to avoid duplicates
            if (!document.querySelector('.custom-controls-container')) {
                const customDiv = document.createElement('div');
                customDiv.className = 'custom-controls-container';
                customDiv.style.display = 'flex';
                customDiv.style.alignItems = 'center';
                customDiv.style.marginRight = '10px';
                customDiv.style.gap = '10px'; // Add spacing between buttons

                // Create the "All Members" button
                const allMembersButton = document.createElement('button');
                allMembersButton.className = 'lk-button all-members-button';
                allMembersButton.innerHTML = '<i class="fa-light fa-users"></i> All Members';
                allMembersButton.onclick = () => setParticipantList((prev) => !prev);

                // Create the "Record" button
                if (isAdmin) {
                    const recordButton = document.createElement('button');
                    recordButton.className = 'lk-button record-button';
                    customDiv.appendChild(recordButton);
                }
                // Append the buttons to the custom div
                customDiv.appendChild(allMembersButton);


                // Insert the custom div before the disconnect button
                disconnectButton.parentNode.insertBefore(customDiv, disconnectButton);
            }
        }
    }, [setParticipantList, roomName]);

    // Use a separate useEffect to dynamically update the "Record" button text based on isRecording
    useEffect(() => {
        const recordButton = document.querySelector('.record-button');
        if (recordButton && isAdmin) {
            recordButton.innerHTML = processingRecRequest ? '<i class="fa-solid fa-spinner fa-spin"></i> Record' : isCurrentUserStartRecording ? manualRecording
                ? '<i class="fa-light fa-stop"></i> Stop Recording'
                : '<i class="fa-light fa-circle"></i> Record' : isRecording ? '<i class="fa-light fa-stop"></i> Stop Recording'
                : '<i class="fa-light fa-circle"></i> Record'
        }
    }, [isRecording, processingRecRequest]);

     // Use a separate useEffect to dynamically update the "Record" button text based on isRecording
     useEffect(() => {
        const allMembersButton = document.querySelector('.all-members-button');
        
        if (allMembersButton ) {
            console.log("Insideee");
            
            allMembersButton.style.backgroundColor = showParticipants ? '#373737' : '#1e1e1e';
        }
    }, [showParticipants]);

    // Attach the toggleRecording function to the "Record" button
    useEffect(() => {
        const recordButton = document.querySelector('.record-button');
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
        await generalPostFunction(`/remove-participant`, {
            room: roomName,
            participantId: participant,
        });
    }

    return (
        <>
            {showParticipants && (
                <div className="participantMemberList">
                    <div className="mb-3">
                        <button
                            className="clearButton2 xl ms-auto"
                            onClick={() => setParticipantList(false)}
                        >
                            <i className={`fa-regular fa-xmark`}></i>
                        </button>
                    </div>
                    <div>
                        <div
                            style={{
                                color: 'rgb(194, 194, 194)',
                                fontSize: '14px',
                                fontWeight: '600',
                                marginBottom: '16px',
                            }}
                        >
                            Meeting Participants
                        </div>
                    </div>
                    <div className="col-12 mt-3">
                        <input
                            type="search"
                            name="Search"
                            id="headerSearch"
                            placeholder="Search"
                            value={searchTerm} // Bind the input value to the state
                            onChange={(e) => setSearchTerm(e.target.value)} // Update the state on input change
                            style={{
                                backgroundColor: 'transparent',
                                color: '#f5f5f5',
                            }}
                        />
                    </div>

                    <ul className="noScrollbar">
                        {filteredParticipants.map((participant, index) => (
                            <li key={index}>
                                <div className="d-flex align-items-center">
                                    <div className="profileHolder">
                                        <i className="fa-light fa-user"></i>
                                    </div>
                                    <span className="ms-2">{participant.identity}</span>
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
                                            width: '30px',
                                            height: '30px',
                                            fontSize: '16px',
                                        }}
                                    >
                                        <i className="fa-light fa-user-minus"></i>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', padding: '10px 10px' }}>
                        <div className="d-flex align-items-center">
                            <div className="profileHolder">
                                <i className="fa-light fa-user" />
                            </div>
                            <span className="ms-2">{username}</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Members;