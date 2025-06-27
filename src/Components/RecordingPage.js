// src/pages/RecordingPage.jsx
import React from "react";
import {
  LiveKitRoom,
  useTracks,
  ParticipantTile,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import "@livekit/components-styles"; // Optional default LiveKit styles

const CustomLayout = () => {
  const tracks = useTracks([Track.Source.Camera, Track.Source.Microphone], {
    onlySubscribed: true,
  });

  return (
    <div className="recording-grid">
      {tracks.map(({ participant, publication }) => {
        const hasVideo = participant.isCameraEnabled;

        return (
          <div key={participant.identity} className="participant-box">
            {hasVideo ? (
              <ParticipantTile participant={participant} />
            ) : (
              <div className="avatar-placeholder">
                {participant.name?.charAt(0).toUpperCase() || "?"}
              </div>
            )}
            <p className="participant-name">{participant.name || participant.identity}</p>
          </div>
        );
      })}
    </div>
  );
};

const RecordingPage = () => {
  const params = new URLSearchParams(window.location.search);
  const roomName = params.get("roomName");
  const token = params.get("token");

  if (!roomName || !token) {
    return <p>Missing roomName or token in URL</p>;
  }

  return (
    <LiveKitRoom
      room={roomName}
      token={token}
      serverUrl="https://ucaas-conference-oyfjembm.livekit.cloud"
      connect={true}
      audio={true}
      video={false}
    >
      <CustomLayout />
    </LiveKitRoom>
  );
};

export default RecordingPage;
