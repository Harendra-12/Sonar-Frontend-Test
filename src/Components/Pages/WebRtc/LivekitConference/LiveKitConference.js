import React, { useState } from "react";
import "@livekit/components-styles"; // Importing LiveKit styles
import { formatChatMessageLinks, LiveKitRoom, VideoConference } from "@livekit/components-react";
import SettingsMenu from "./SettingsMenu";
import { useNavigate } from "react-router-dom";
import Members from "./Members";
import { RecordingIndicator } from "./RecordingIndicator";


const LiveKitConference = ({ token, serverUrl, roomName, username, isAdmin, setCalling, meetingPage, isMinimize, setIsMinimize }) => {
    const [manualRecording, setManualRecording] = useState(false); // State to track manual recording
    const [isCurrentUserStartRecording, setIsCurrentUserStartRecording] = useState(false); // State to track if the current user started recording
    const navigate = useNavigate();

    // const [isMinimize, setIsMinimize] = useState(true);

    // const handleClickMinimize = () => setIsMinimize();
    const handleClickMinimize = () => {
        setIsMinimize(!isMinimize);
    };

    return (
        <main data-lk-theme="default" style={{ height: '100vh' }} className={`${meetingPage === 'message' ? 'messageMeetingWrap' : ''} ${isMinimize ? 'fullComponent' : 'minimizeComponent'}`}>
            <button className="minimize" onClick={handleClickMinimize}><i class={`${isMinimize ? 'fa-solid fa-minus' : 'fa-regular fa-expand'}`}></i></button>
            {!isMinimize && <div
                className="inter-call-drag-handle"
                style={{
                    position: "absolute",
                    top: "110px",
                    width: "100%",
                    height: "50%",
                    zIndex: "9999",
                    background: "transparent",
                    cursor: "move",
                }}
            ></div>}
            <LiveKitRoom
                token={token}
                serverUrl={serverUrl}
                connect={true}
                video={true}
                audio={true}
                ScreenShareIcon={false}
                onDisconnected={() => setCalling(false)}
            >
                <VideoConference
                    chatMessageFormatter={formatChatMessageLinks}
                    SettingsComponent={SettingsMenu}
                />
                <Members
                    roomName={roomName}
                    isAdmin={isAdmin}
                    username={username}
                    token={token}
                    manualRecording={manualRecording}
                    setManualRecording={setManualRecording}
                    isCurrentUserStartRecording={isCurrentUserStartRecording}
                    setIsCurrentUserStartRecording={setIsCurrentUserStartRecording}
                />
                <RecordingIndicator
                    manualRecording={manualRecording}
                    isCurrentUserStartRecording={isCurrentUserStartRecording}
                />
            </LiveKitRoom>
        </main>
    );
};

export default LiveKitConference;


