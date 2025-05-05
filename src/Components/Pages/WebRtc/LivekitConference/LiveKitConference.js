import React, { useState } from "react";
import "@livekit/components-styles"; // Importing LiveKit styles
import { formatChatMessageLinks, LiveKitRoom, VideoConference } from "@livekit/components-react";
import SettingsMenu from "./SettingsMenu";
import { useNavigate } from "react-router-dom";
import Members from "./Members";
import { RecordingIndicator } from "./RecordingIndicator";


const LiveKitConference = ({ token, serverUrl, roomName, username, isAdmin }) => {
    const [manualRecording, setManualRecording] = useState(false); // State to track manual recording
    const [isCurrentUserStartRecording, setIsCurrentUserStartRecording] = useState(false); // State to track if the current user started recording
    const navigate = useNavigate();

    return (
        <main data-lk-theme="default" style={{ height: '100vh' }}>
            <LiveKitRoom
                token={token}
                serverUrl={serverUrl}
                connect={true}
                video={true}
                audio={true}
                ScreenShareIcon={false}
                onDisconnected={() => navigate("/")}
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


