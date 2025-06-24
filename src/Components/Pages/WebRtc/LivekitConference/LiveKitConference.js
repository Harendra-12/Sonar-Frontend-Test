import React, { useEffect, useState } from "react";
import "@livekit/components-styles"; // Importing LiveKit styles
import { formatChatMessageLinks, LiveKitRoom, useRoomContext, VideoConference } from "@livekit/components-react";
import SettingsMenu from "./SettingsMenu";
import Members from "./Members";
import { RecordingIndicator } from "./RecordingIndicator";
import GoConferenceSocket from "../../../GlobalFunction/GoConferenceSocket";


const LiveKitConference = ({ token, serverUrl, roomName, username, isAdmin, setCalling, isMinimize, setIsMinimize, isConferenceCall }) => {
    const [manualRecording, setManualRecording] = useState(false); // State to track manual recording
    const [isCurrentUserStartRecording, setIsCurrentUserStartRecording] = useState(false); // State to track if the current user started recording
    const handleClickMinimize = () => {
        setIsMinimize(!isMinimize);
    };
    const { sendConferenceMessage } = GoConferenceSocket();
    return (
        <>

            <main data-lk-theme="default" className={`messageMeetingWrap ${isMinimize ? 'fullComponent' : 'minimizeComponent'}`}>
                <button className="minimize me-2" onClick={handleClickMinimize}><i className={`${isMinimize ? 'fa-solid fa-minus' : 'fa-regular fa-expand'}`}></i></button>
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
                    onDisconnected={() => { setCalling(false); }}
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
                        setCalling={setCalling}
                        isConferenceCall={isConferenceCall}
                        socketMessage={sendConferenceMessage}
                    />
                    <RecordingIndicator
                        manualRecording={manualRecording}
                        isCurrentUserStartRecording={isCurrentUserStartRecording}
                    />
                </LiveKitRoom>
            </main>
        </>
    );
};

export default LiveKitConference;


